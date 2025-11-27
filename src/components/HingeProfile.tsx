import React from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { ArchetypeList } from './ArchetypeList';
import { mockData } from '../utils/mockData';
import { Edit, Camera } from 'lucide-react';

interface HingeProfileProps {
  onEdit?: () => void;
  onRetakePersonalityTest?: () => void;
}

export function HingeProfile({ onEdit, onRetakePersonalityTest }: HingeProfileProps) {
  // Använd Emma L som exempel-profil
  const profile = mockData.matches[0];

  return (
    <div className="max-w-md mx-auto">
      {/* Hinge-style scrollable container */}
      <div className="pb-20 space-y-4">
        
        {/* Top-sektion: Foto + namn enligt Hinge */}
        <Card className="overflow-hidden">
          <div className="relative">
            {/* Foto-placeholder (300x300px) */}
            <div className="w-full h-80 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <div className="text-center">
                <Camera className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">Foto kommer snart</p>
              </div>
            </div>
            
            {/* Gradient overlay för MÄÄK-estetik */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
              <h2 className="text-2xl font-bold">{profile.name}</h2>
              <p className="text-lg opacity-90">{profile.age} år - {profile.location}</p>
            </div>
          </div>
        </Card>

        {/* Centralt: Archetypes med fyra tydliga badges enligt Figma-analys */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium text-center mb-4">Arketyper & Profil</h3>
            
            {/* Main archetype badge */}
            <div className="text-center mb-4">
              <Badge className="bg-gradient-primary text-white text-lg px-4 py-2">
                {profile.mainArchetype}
              </Badge>
            </div>

            {/* Fyra archetype badges enligt Figma-analys */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="archetype-badge text-sm">
                Emotionell: Vårdande
              </div>
              <div className="archetype-badge text-sm">
                Kreativ: Konstnärlig
              </div>
              <div className="archetype-badge text-sm">
                Social: Empatisk
              </div>
              <div className="archetype-badge text-sm">
                Mental: Reflekterande
              </div>
            </div>
            
            {/* Fyra archetypes i radial/lista */}
            <ArchetypeList 
              archetypes={profile.archetypes}
              layout="grid"
              size="medium"
            />
            
            {/* Personality Test Action */}
            <div className="mt-4 text-center">
              <Button 
                variant="outline" 
                size="sm"
                className="text-primary border-primary hover:bg-primary hover:text-white"
                onClick={onRetakePersonalityTest}
              >
                🧠 Ta personlighetstestet igen
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Scroll-sektioner (modulärt som Hinge) */}
        
        {/* Sektion 1: Bio */}
        <Card>
          <CardContent className="p-6">
            <h4 className="font-medium mb-3">Om mig</h4>
            <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
          </CardContent>
        </Card>

        {/* Sektion 2: Prefs-badges (3-4 chips) */}
        <Card>
          <CardContent className="p-6">
            <h4 className="font-medium mb-3">Intressen</h4>
            <div className="flex flex-wrap gap-2">
              {(profile.interests || ['Resor', 'Fotografi', 'Konst']).map((interest, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border border-primary/20 rounded-full px-3 py-1"
                >
                  {interest}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sektion 3: Prompts (Hinge-stil) */}
        <Card>
          <CardContent className="p-6">
            <h4 className="font-medium mb-3">Prompts & Frågor</h4>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Mitt favoritminne:</p>
                <p className="text-gray-800">{profile.prompt || 'En spontan roadtrip. Vad är ditt?'}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Jag blir lycklig av:</p>
                <p className="text-gray-800">Att upptäcka nya platser och träffa intressanta människor</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">På en perfekt söndag:</p>
                <p className="text-gray-800">Börjar med yoga, sedan kaffe på en mysig café och avslutar med en promenad i naturen</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sektion 4: Statistics & Insights */}
        <Card>
          <CardContent className="p-6">
            <h4 className="font-medium mb-3">Profil Insights</h4>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-gradient-to-br from-primary/5 to-secondary/5 p-3 rounded-lg">
                <div className="text-2xl font-bold text-primary">12</div>
                <div className="text-xs text-gray-600">Matchningar</div>
              </div>
              <div className="bg-gradient-to-br from-secondary/5 to-primary/5 p-3 rounded-lg">
                <div className="text-2xl font-bold text-secondary">94%</div>
                <div className="text-xs text-gray-600">Kompatibilitet</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sektion 5: Edit-knapp längst ner */}
        <Card>
          <CardContent className="p-6">
            <Button 
              className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white rounded-full h-12"
              onClick={onEdit}
            >
              <Edit className="w-5 h-5 mr-2" />
              Uppdatera Profil
            </Button>
            
            {/* Additional quick actions */}
            <div className="flex gap-2 mt-3">
              <Button variant="outline" className="flex-1 rounded-full">
                Lägg till foto
              </Button>
              <Button variant="outline" className="flex-1 rounded-full">
                Ny prompt
              </Button>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}