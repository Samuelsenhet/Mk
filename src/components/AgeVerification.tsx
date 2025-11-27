import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { Calendar, AlertCircle, ArrowLeft } from "lucide-react";

interface AgeVerificationProps {
  onVerified: (birthDate: string, age: number) => void;
  onBack: () => void;
}

export function AgeVerification({ onVerified, onBack }: AgeVerificationProps) {
  const [birthDate, setBirthDate] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const validateBirthDate = (dateString: string): boolean => {
    if (!dateString) return false;
    
    const date = new Date(dateString);
    const today = new Date();
    
    // Check if date is valid
    if (isNaN(date.getTime())) return false;
    
    // Check if date is not in the future
    if (date > today) return false;
    
    // Check if date is reasonable (not more than 100 years ago)
    const hundredYearsAgo = new Date();
    hundredYearsAgo.setFullYear(today.getFullYear() - 100);
    if (date < hundredYearsAgo) return false;
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!birthDate) {
        setError("Födelsedatum krävs");
        setLoading(false);
        return;
      }

      if (!validateBirthDate(birthDate)) {
        setError("Ogiltigt födelsedatum");
        setLoading(false);
        return;
      }

      const age = calculateAge(birthDate);

      if (age < 20) {
        setError("Du måste vara minst 20 år för att använda Määk Mood. Kom tillbaka när du fyller 20!");
        setLoading(false);
        return;
      }

      // Age verification passed
      setTimeout(() => {
        onVerified(birthDate, age);
        setLoading(false);
      }, 500); // Small delay to show loading state

    } catch (error) {
      console.error("Age verification error:", error);
      setError("Ett fel uppstod vid verifiering");
      setLoading(false);
    }
  };

  const formatDateForInput = () => {
    // Get today's date minus 20 years as default max
    const today = new Date();
    const twentyYearsAgo = new Date(today.getFullYear() - 20, today.getMonth(), today.getDate());
    return twentyYearsAgo.toISOString().split('T')[0];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 p-6">
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Tillbaka
          </Button>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">
              <Calendar className="w-8 h-8" />
            </div>
            <CardTitle className="text-2xl text-primary">
              Åldersverifiering
            </CardTitle>
            <p className="text-gray-600 text-sm">
              Määk Mood är en 20+ plattform för seriösa relationer
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="birthDate">Födelsedatum *</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  max={formatDateForInput()}
                  className="rounded-[10px] border-gray-300"
                  disabled={loading}
                  required
                />
                <p className="text-xs text-gray-500">
                  Du måste vara minst 20 år för att fortsätta
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs mt-0.5">
                    i
                  </div>
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Varför åldersverifiering?</p>
                    <p>Määk Mood fokuserar på seriösa relationer och kräver att alla användare är minst 20 år gamla för att säkerställa mognad och kompatibilitet.</p>
                  </div>
                </div>
              </div>

              <Button 
                type="submit"
                className="w-full h-12 bg-primary hover:bg-primary/90 rounded-[25px]"
                disabled={loading}
              >
                {loading ? "Verifierar..." : "Verifiera ålder"}
              </Button>
            </form>

            <div className="text-center">
              <p className="text-xs text-gray-500 leading-relaxed">
                Din personliga information hanteras säkert enligt vår{" "}
                <span className="text-primary underline">integritetspolicy</span>.
                Födelsedatum används endast för åldersverifiering.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}