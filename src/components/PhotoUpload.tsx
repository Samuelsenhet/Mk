import { useState, useRef } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Upload, X, Camera, Image as ImageIcon, Trash2, RotateCcw } from "lucide-react";

interface PhotoUploadProps {
  photos: string[];
  onPhotosChange: (photos: string[]) => void;
  maxPhotos?: number;
  required?: boolean;
}

export function PhotoUpload({ photos = [], onPhotosChange, maxPhotos = 6, required = false }: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    const newPhotos = [...photos];

    try {
      for (let i = 0; i < files.length && newPhotos.length < maxPhotos; i++) {
        const file = files[i];
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
          console.log(`Skipping non-image file: ${file.name}`);
          continue;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          console.error(`File too large: ${file.name}`);
          alert(`Bilden "${file.name}" är för stor. Max 5MB per bild.`);
          continue;
        }

        // Create preview URL
        try {
          const previewUrl = URL.createObjectURL(file);
          newPhotos.push(previewUrl);
        } catch (urlError) {
          console.error("Error creating object URL:", urlError);
          continue;
        }
      }

      onPhotosChange(newPhotos);
    } catch (error) {
      console.error("Error uploading photos:", error);
      alert("Ett fel uppstod vid uppladdning av bilder.");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const removePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    onPhotosChange(newPhotos);
  };

  const movePhoto = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= photos.length) return;
    
    const newPhotos = [...photos];
    const [movedPhoto] = newPhotos.splice(fromIndex, 1);
    newPhotos.splice(toIndex, 0, movedPhoto);
    onPhotosChange(newPhotos);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-medium">Foton & bilder</h3>
          <p className="text-sm text-gray-600">
            Lägg till {required ? "minst 2" : "upp till " + maxPhotos} bilder som visar din personlighet
          </p>
        </div>
        <div className="text-sm text-gray-500">
          {photos.length}/{maxPhotos}
        </div>
      </div>

      {/* Photo Grid */}
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: maxPhotos }, (_, index) => (
          <div key={index} className="aspect-square">
            {photos[index] ? (
              <Card className="relative group aspect-square overflow-hidden hover:shadow-md transition-shadow">
                <ImageWithFallback
                  src={photos[index]}
                  alt={`Foto ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                
                {/* Photo overlay controls */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="flex space-x-2">
                    {index > 0 && (
                      <Button
                        size="sm"
                        variant="secondary"
                        className="w-8 h-8 p-0"
                        onClick={() => movePhoto(index, index - 1)}
                      >
                        ←
                      </Button>
                    )}
                    
                    <Button
                      size="sm"
                      variant="destructive"
                      className="w-8 h-8 p-0"
                      onClick={() => removePhoto(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    
                    {index < photos.length - 1 && (
                      <Button
                        size="sm"
                        variant="secondary"
                        className="w-8 h-8 p-0"
                        onClick={() => movePhoto(index, index + 1)}
                      >
                        →
                      </Button>
                    )}
                  </div>
                </div>

                {/* Primary photo indicator */}
                {index === 0 && (
                  <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
                    Huvudbild
                  </div>
                )}
              </Card>
            ) : (
              <Card
                className={`aspect-square border-2 border-dashed cursor-pointer transition-all hover:border-primary hover:bg-primary/5 flex flex-col items-center justify-center ${
                  dragOver ? "border-primary bg-primary/10" : "border-gray-300"
                }`}
                onClick={openFileDialog}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <div className="text-center p-4">
                  {uploading ? (
                    <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                  ) : (
                    <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                  )}
                  <p className="text-xs text-gray-500">
                    {uploading ? "Laddar upp..." : index === 0 ? "Huvudbild" : `Foto ${index + 1}`}
                  </p>
                </div>
              </Card>
            )}
          </div>
        ))}
      </div>

      {/* Upload buttons */}
      {photos.length < maxPhotos && (
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={openFileDialog}
            disabled={uploading}
            className="flex-1"
          >
            <ImageIcon className="w-4 h-4 mr-2" />
            Välj från galleri
          </Button>
          
          <Button
            variant="outline"
            onClick={openFileDialog}
            disabled={uploading}
            className="flex-1"
          >
            <Camera className="w-4 h-4 mr-2" />
            Ta foto
          </Button>
        </div>
      )}

      {/* Tips */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-medium text-yellow-800 mb-2">Tips för bra profilbilder:</h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Använd bilder där ditt ansikte syns tydligt</li>
          <li>• Visa dig själv i olika situationer och miljöer</li>
          <li>• Undvik för många gruppbilder eller selfies</li>
          <li>• Första bilden blir din huvudbild - välj din bästa!</li>
        </ul>
      </div>

      {/* Photo requirements warning */}
      {required && photos.length < 2 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-700">
            Du behöver minst 2 bilder för att kunna fortsätta med din profil.
          </p>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
      />
    </div>
  );
}