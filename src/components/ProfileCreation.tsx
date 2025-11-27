import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Progress } from "./ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { PhotoUpload } from "./PhotoUpload";
import { AgeVerification } from "./AgeVerification";
import { Mic } from "lucide-react";

interface ProfileData {
  // Del 1 - Grundläggande Information
  firstName: string;
  lastName?: string;
  birthDate: string;
  age: number;
  pronouns?: string[];
  gender: string;
  sexuality: string;
  datingPreferences: string[];
  ethnicity?: string;
  datingIntentions?: string;
  relationshipType?: string;
  height?: string;
  hasChildren?: string;
  familyPlans?: string;
  
  // Del 2 - Bakgrund & Livsstil  
  location: string;
  hometown?: string;
  workplace?: string;
  jobTitle?: string;
  education?: string;
  educationLevel?: string;
  religion?: string;
  politics?: string;
  
  // Livsstilsvanor
  lifestyle: {
    alcohol?: string;
    smoking?: string;
    cannabis?: string;
    drugs?: string;
  };
  
  // Del 3 - Profil Personlig Görande
  interests: string[];
  photos: string[];
  voiceIntro?: string;
  personalAnswers?: {
    question1?: string;
    question2?: string;
    question3?: string;
  };
  
  // Integritetsinställningar
  privacy: {
    showAge: boolean;
    showJob: boolean;
    showEducation: boolean;
    showLastName: boolean;
    allowMarketing: boolean;
  };
}

const steps = [
  "Åldersverifiering",
  "Grundläggande info",
  "Identitet & preferenser",
  "Bakgrund & livsstil", 
  "Livsstilsvanor",
  "Intressen & hobbies",
  "Bilder & presentation",
  "Personliga svar",
  "Integritet & slutförande"
];

const interests = [
  "Resor", "Matlagning", "Film", "Musik", "Sport", "Läsning", "Konst", 
  "Natur", "Fotografi", "Dans", "Yoga", "Gaming", "Politik", "Teknik",
  "Mode", "Djur", "Volontärarbete", "Entreprenörskap"
];

export function ProfileCreation({ onComplete }: { onComplete: (data: ProfileData) => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: "",
    birthDate: "",
    age: 0,
    gender: "",
    sexuality: "",
    datingPreferences: [],
    location: "",
    lifestyle: {},
    interests: [],
    photos: [],
    privacy: {
      showAge: true,
      showJob: true,
      showEducation: true,
      showLastName: false,
      allowMarketing: false
    }
  });

  const updateData = (updates: Partial<ProfileData>) => {
    setProfileData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    console.log('[PROFILE CREATION] nextStep() anropad, currentStep:', currentStep, 'av totalt', steps.length - 1);
    if (currentStep < steps.length - 1) {
      console.log('[PROFILE CREATION] Går till nästa steg:', currentStep + 1);
      setCurrentStep(currentStep + 1);
    } else {
      console.log('[PROFILE CREATION] Sista steget nått, anropar onComplete med data:', profileData);
      onComplete(profileData);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const addInterest = (interest: string) => {
    if (!profileData.interests.includes(interest)) {
      updateData({ interests: [...profileData.interests, interest] });
    }
  };

  const removeInterest = (interest: string) => {
    updateData({ interests: profileData.interests.filter(i => i !== interest) });
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleAgeVerification = (birthDate: string, age: number) => {
    updateData({ birthDate, age });
    nextStep();
  };

  const canContinueStep = (step: number): boolean => {
    let canContinue = false;
    switch (step) {
      case 0: // Age verification - handled by AgeVerification component
        canContinue = true;
        break;
      case 1: // Basic info
        canContinue = !!(profileData.firstName && profileData.gender);
        console.log('[PROFILE CREATION] Step 1 validation:', { firstName: profileData.firstName, gender: profileData.gender, canContinue });
        break;
      case 2: // Identity & preferences  
        canContinue = !!(profileData.sexuality && profileData.datingPreferences.length > 0);
        console.log('[PROFILE CREATION] Step 2 validation:', { sexuality: profileData.sexuality, datingPrefs: profileData.datingPreferences.length, canContinue });
        break;
      case 3: // Background
        canContinue = !!profileData.location;
        console.log('[PROFILE CREATION] Step 3 validation:', { location: profileData.location, canContinue });
        break;
      case 4: // Lifestyle habits
        canContinue = true; // All optional
        break;
      case 5: // Interests
        canContinue = profileData.interests.length > 0;
        console.log('[PROFILE CREATION] Step 5 validation:', { interests: profileData.interests.length, canContinue });
        break;
      case 6: // Photos
        canContinue = true; // Temporärt - gör foton valfria så användaren kan slutföra profilen
        console.log('[PROFILE CREATION] Step 6 validation (photos optional):', { photos: profileData.photos.length, canContinue });
        break;
      case 7: // Personal answers
        canContinue = true; // Optional creative answers
        break;
      case 8: // Privacy & completion
        canContinue = true;
        console.log('[PROFILE CREATION] Step 8 (final) validation:', { canContinue });
        break;
      default:
        canContinue = true;
    }
    
    return canContinue;
  };

  // Age verification step
  if (currentStep === 0) {
    return (
      <AgeVerification
        onVerified={handleAgeVerification}
        onBack={() => {}} // Could implement back to auth
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="max-w-md mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-[25px] flex items-center justify-center text-white text-2xl mx-auto mb-4 shadow-lg">
            M
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Du är unik. Det ska även din profil vara.</h2>
          
          {/* Progress */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">Steg {currentStep + 1} av {steps.length}</span>
              <span className="text-sm font-semibold text-primary">{Math.round(progress)}%</span>
            </div>
            <div className="relative">
              <Progress value={progress} className="h-3 rounded-[25px]" />
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-20 rounded-[25px]"></div>
            </div>
            <p className="text-center text-sm text-gray-700 mt-2 font-medium">{steps[currentStep]}</p>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-[25px] shadow-xl border border-white/20 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800">{steps[currentStep]}</h3>
          </div>
          <div className="p-6 space-y-6">
          
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <>
              <div className="bg-green-50 border-2 border-green-200 rounded-[25px] p-4 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white text-sm shadow-md">
                    ✓
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-green-800">Ålder verifierad</p>
                    <p className="text-xs text-green-600">{profileData.age} år gammal</p>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="firstName" className="text-gray-700 font-medium">Förnamn *</Label>
                <Input
                  id="firstName"
                  value={profileData.firstName}
                  onChange={(e) => updateData({ firstName: e.target.value })}
                  placeholder="Ditt förnamn"
                  className="mt-2 h-12 rounded-[25px] border-2 border-gray-200 focus:border-primary transition-colors"
                />
              </div>
              
              <div>
                <Label htmlFor="lastName" className="text-gray-700 font-medium">Efternamn (valfritt)</Label>
                <Input
                  id="lastName"
                  value={profileData.lastName || ""}
                  onChange={(e) => updateData({ lastName: e.target.value })}
                  placeholder="Ditt efternamn"
                  className="mt-2 h-12 rounded-[25px] border-2 border-gray-200 focus:border-primary transition-colors"
                />
                <p className="text-xs text-gray-500 mt-1">
                  För din säkerhet visas endast första bokstaven
                </p>
              </div>

              <div>
                <Label className="text-gray-700 font-medium">Kön *</Label>
                <Select value={profileData.gender} onValueChange={(value) => updateData({ gender: value })}>
                  <SelectTrigger className="mt-2 h-12 rounded-[25px] border-2 border-gray-200 focus:border-primary">
                    <SelectValue placeholder="Välj kön" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="man">Man</SelectItem>
                    <SelectItem value="kvinna">Kvinna</SelectItem>
                    <SelectItem value="ickebinar">Icke-binär</SelectItem>
                    <SelectItem value="annan">Annan</SelectItem>
                  </SelectContent>
                </Select>
              </div>

            </>
          )}

          {/* Step 2: Identity & Preferences */}
          {currentStep === 2 && (
            <>
              <div>
                <Label className="text-gray-700 font-medium">Pronomen (välj upp till 4)</Label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {['hon/henne/hennes', 'han/honom/hans', 'hen/hen/hens', 'den/den/dens'].map((pronoun) => (
                    <div key={pronoun} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={pronoun}
                        checked={profileData.pronouns?.includes(pronoun) || false}
                        onChange={(e) => {
                          const current = profileData.pronouns || [];
                          if (e.target.checked && current.length < 4) {
                            updateData({ pronouns: [...current, pronoun] });
                          } else if (!e.target.checked) {
                            updateData({ pronouns: current.filter(p => p !== pronoun) });
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor={pronoun} className="text-sm">{pronoun}</Label>
                    </div>
                  ))}
                </div>
                <div className="mt-2 flex items-center text-xs text-gray-600">
                  <input type="checkbox" className="mr-1" defaultChecked />
                  <span>Synlig på profilen</span>
                </div>
              </div>

              <div>
                <Label className="text-gray-700 font-medium">Sexualitet *</Label>
                <Select value={profileData.sexuality} onValueChange={(value) => updateData({ sexuality: value })}>
                  <SelectTrigger className="mt-2 h-12 rounded-[25px] border-2 border-gray-200 focus:border-primary">
                    <SelectValue placeholder="Välj sexualitet" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="föredrar-inte-säga">Föredrar att inte säga något</SelectItem>
                    <SelectItem value="hetero">Hetero</SelectItem>
                    <SelectItem value="gay">Gay</SelectItem>
                    <SelectItem value="lesbisk">Lesbisk</SelectItem>
                    <SelectItem value="bisexuell">Bisexuell</SelectItem>
                    <SelectItem value="allosexuell">Allosexuell</SelectItem>
                    <SelectItem value="androsexuell">Androsexuell</SelectItem>
                  </SelectContent>
                </Select>
                <div className="mt-2 flex items-center text-xs text-gray-600">
                  <input type="checkbox" className="mr-1" defaultChecked />
                  <span>Synlig på profilen</span>
                </div>
              </div>

              <div>
                <Label className="text-gray-700 font-medium">Vem vill du dejta? *</Label>
                <p className="text-sm text-gray-600 mb-2">Välj alla som du är öppen för att träffa</p>
                <div className="space-y-2">
                  {['Män', 'Kvinnor', 'Icke-binära personer', 'Alla'].map((pref) => (
                    <div key={pref} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={pref}
                        checked={profileData.datingPreferences.includes(pref)}
                        onChange={(e) => {
                          const current = profileData.datingPreferences;
                          if (e.target.checked) {
                            updateData({ datingPreferences: [...current, pref] });
                          } else {
                            updateData({ datingPreferences: current.filter(p => p !== pref) });
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor={pref} className="text-sm">{pref}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-gray-700 font-medium">Etnisk tillhörighet (valfritt)</Label>
                <Select value={profileData.ethnicity || ""} onValueChange={(value) => updateData({ ethnicity: value })}>
                  <SelectTrigger className="mt-2 h-12 rounded-[25px] border-2 border-gray-200">
                    <SelectValue placeholder="Välj etnisk tillhörighet" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="föredrar-inte-säga">Föredrar att inte säga något</SelectItem>
                    <SelectItem value="amerikansk-urinvånare">Amerikansk urinvånare</SelectItem>
                    <SelectItem value="latinamerikansk">Latinamerikansk/latino</SelectItem>
                    <SelectItem value="mellanöstern">Mellanöstern</SelectItem>
                    <SelectItem value="östasiatisk">Östasiatisk</SelectItem>
                    <SelectItem value="stillahavsöarna">Stillahavsöarna</SelectItem>
                    <SelectItem value="svart-afrikansk">Svart/afrikansk härkomst</SelectItem>
                    <SelectItem value="sydasiatisk">Sydasiatisk</SelectItem>
                    <SelectItem value="sydostasiatisk">Sydostasiatisk</SelectItem>
                    <SelectItem value="vit-kaukasisk">Vit/kaukasisk</SelectItem>
                    <SelectItem value="annat">Annat</SelectItem>
                  </SelectContent>
                </Select>
                <div className="mt-2 flex items-center text-xs text-gray-600">
                  <input type="checkbox" className="mr-1" defaultChecked />
                  <span>Synlig på profilen</span>
                </div>
              </div>

              <div>
                <Label className="text-gray-700 font-medium">Dejtingavsikter</Label>
                <Select value={profileData.datingIntentions || ""} onValueChange={(value) => updateData({ datingIntentions: value })}>
                  <SelectTrigger className="mt-2 h-12 rounded-[25px] border-2 border-gray-200">
                    <SelectValue placeholder="Vad har du för avsikt med att dejta?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="livspartner">Livspartner</SelectItem>
                    <SelectItem value="långsiktigt">Långsiktigt förhållande</SelectItem>
                    <SelectItem value="långsiktigt-öppen-kort">Långsiktigt förhållande, öppen för kortvarigt</SelectItem>
                    <SelectItem value="kortsiktigt-öppen-lång">Kortsiktigt förhållande, öppen för långvarigt</SelectItem>
                    <SelectItem value="kortsiktigt">Kortsiktigt förhållande</SelectItem>
                    <SelectItem value="osäker">Håller på att klura ut mina dejtingsmål</SelectItem>
                  </SelectContent>
                </Select>
                <div className="mt-2">
                  <Textarea
                    placeholder="Berätta mer med egna ord om vad du söker..."
                    className="rounded-[25px] border-2 border-gray-200"
                    rows={2}
                  />
                </div>
                <div className="mt-2 flex items-center text-xs text-gray-600">
                  <input type="checkbox" className="mr-1" defaultChecked />
                  <span>Synlig på profilen</span>
                </div>
              </div>

              <div>
                <Label className="text-gray-700 font-medium">Relationstyp</Label>
                <Select value={profileData.relationshipType || ""} onValueChange={(value) => updateData({ relationshipType: value })}>
                  <SelectTrigger className="mt-2 h-12 rounded-[25px] border-2 border-gray-200">
                    <SelectValue placeholder="Vilken typ av relation söker du?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monogam">Monogam</SelectItem>
                    <SelectItem value="icke-monogami">Icke-monogami</SelectItem>
                    <SelectItem value="ta-reda-på">Ta reda på min relationstyp</SelectItem>
                  </SelectContent>
                </Select>
                <div className="mt-2">
                  <Textarea
                    placeholder="Berätta mer med egna ord..."
                    className="rounded-[25px] border-2 border-gray-200"
                    rows={2}
                  />
                </div>
              </div>

              <div>
                <Label className="text-gray-700 font-medium">Kroppslängd</Label>
                <Select value={profileData.height || ""} onValueChange={(value) => updateData({ height: value })}>
                  <SelectTrigger className="mt-2 h-12 rounded-[25px] border-2 border-gray-200">
                    <SelectValue placeholder="Hur lång är du?" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 50 }, (_, i) => 150 + i).map(height => (
                      <SelectItem key={height} value={`${height}cm`}>{height} cm</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-1">Alltid synlig på profilen</p>
              </div>

              <div>
                <Label className="text-gray-700 font-medium">Har du barn?</Label>
                <Select value={profileData.hasChildren || ""} onValueChange={(value) => updateData({ hasChildren: value })}>
                  <SelectTrigger className="mt-2 h-12 rounded-[25px] border-2 border-gray-200">
                    <SelectValue placeholder="Välj alternativ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="har-inga-barn">Har inga barn</SelectItem>
                    <SelectItem value="har-barn">Har barn</SelectItem>
                    <SelectItem value="föredrar-inte-säga">Föredrar att inte säga något</SelectItem>
                  </SelectContent>
                </Select>
                <div className="mt-2 flex items-center text-xs text-gray-600">
                  <input type="checkbox" className="mr-1" defaultChecked />
                  <span>Synlig på profilen</span>
                </div>
              </div>

              <div>
                <Label className="text-gray-700 font-medium">Familjeplaner</Label>
                <Select value={profileData.familyPlans || ""} onValueChange={(value) => updateData({ familyPlans: value })}>
                  <SelectTrigger className="mt-2 h-12 rounded-[25px] border-2 border-gray-200">
                    <SelectValue placeholder="Vad har du för familjeplaner?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vill-inte-ha-barn">Vill inte ha barn</SelectItem>
                    <SelectItem value="vill-ha-barn">Vill ha barn</SelectItem>
                    <SelectItem value="öppen-för-barn">Öppen för barn</SelectItem>
                    <SelectItem value="inte-säker">Inte säker</SelectItem>
                    <SelectItem value="föredrar-inte-säga">Föredrar att inte säga något</SelectItem>
                  </SelectContent>
                </Select>
                <div className="mt-2 flex items-center text-xs text-gray-600">
                  <input type="checkbox" className="mr-1" defaultChecked />
                  <span>Synlig på profilen</span>
                </div>
              </div>
            </>
          )}

          {/* Step 3: Background & Lifestyle */}
          {currentStep === 3 && (
            <>
              <div>
                <Label htmlFor="location" className="text-gray-700 font-medium">Var bor du? *</Label>
                <p className="text-xs text-gray-600 mb-2">Endast områdets namn visas på din profil</p>
                <Input
                  id="location"
                  value={profileData.location}
                  onChange={(e) => updateData({ location: e.target.value })}
                  placeholder="Skriv in din adress, ditt område eller ditt postnummer..."
                  className="mt-2 h-12 rounded-[25px] border-2 border-gray-200 focus:border-primary"
                />
                <div className="mt-2 space-y-1 text-xs text-gray-500">
                  <p>• Solna (Zooma in på ditt område)</p>
                  <p>• Stockholm</p>
                  <p>• Tusca</p>
                  <p>• Södermalm</p>
                  <p>• Östermalm</p>
                </div>
              </div>

              <div>
                <Label htmlFor="hometown" className="text-gray-700 font-medium">Hemstad (valfritt)</Label>
                <Input
                  id="hometown"
                  value={profileData.hometown || ""}
                  onChange={(e) => updateData({ hometown: e.target.value })}
                  placeholder="Var finns din hemstad?"
                  className="mt-2 h-12 rounded-[25px] border-2 border-gray-200 focus:border-primary"
                />
              </div>

              <div>
                <Label htmlFor="workplace" className="text-gray-700 font-medium">Arbetsplats (valfritt)</Label>
                <Input
                  id="workplace"
                  value={profileData.workplace || ""}
                  onChange={(e) => updateData({ workplace: e.target.value })}
                  placeholder="Var arbetar du?"
                  className="mt-2 h-12 rounded-[25px] border-2 border-gray-200 focus:border-primary"
                />
              </div>

              <div>
                <Label htmlFor="jobTitle" className="text-gray-700 font-medium">Jobbtitel (valfritt)</Label>
                <Input
                  id="jobTitle"
                  value={profileData.jobTitle || ""}
                  onChange={(e) => updateData({ jobTitle: e.target.value })}
                  placeholder="Vad är din jobbtitel?"
                  className="mt-2 h-12 rounded-[25px] border-2 border-gray-200 focus:border-primary"
                />
              </div>

              <div>
                <Label className="text-gray-700 font-medium">Skola (valfritt)</Label>
                <Button variant="outline" className="w-full mt-2 h-12 rounded-[25px] border-2 border-gray-200">
                  Lägg till en skola
                </Button>
              </div>

              <div>
                <Label className="text-gray-700 font-medium">Utbildningsnivå (valfritt)</Label>
                <Select value={profileData.educationLevel || ""} onValueChange={(value) => updateData({ educationLevel: value })}>
                  <SelectTrigger className="mt-2 h-12 rounded-[25px] border-2 border-gray-200">
                    <SelectValue placeholder="Vilken är den högsta utbildningsnivån du uppnått?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gymnasium">Gymnasium</SelectItem>
                    <SelectItem value="grundnivå">Grundnivå högskola/universitet</SelectItem>
                    <SelectItem value="forskarutbildning">Forskarutbildning</SelectItem>
                    <SelectItem value="föredrar-inte-säga">Föredrar att inte säga något</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-gray-700 font-medium">Religiös tillhörighet (valfritt)</Label>
                <Select value={profileData.religion || ""} onValueChange={(value) => updateData({ religion: value })}>
                  <SelectTrigger className="mt-2 h-12 rounded-[25px] border-2 border-gray-200">
                    <SelectValue placeholder="Vilken är din religiösa tillhörighet?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="agnostiker">Agnostiker</SelectItem>
                    <SelectItem value="ateist">Ateist</SelectItem>
                    <SelectItem value="buddhist">Buddhist</SelectItem>
                    <SelectItem value="katolik">Katolik</SelectItem>
                    <SelectItem value="kristen">Kristen</SelectItem>
                    <SelectItem value="hindu">Hindu</SelectItem>
                    <SelectItem value="judisk">Judisk</SelectItem>
                    <SelectItem value="muslim">Muslim</SelectItem>
                    <SelectItem value="sikh">Sikh</SelectItem>
                    <SelectItem value="andlig">Andlig</SelectItem>
                    <SelectItem value="annat">Annat</SelectItem>
                    <SelectItem value="föredrar-inte-säga">Föredrar att inte säga något</SelectItem>
                  </SelectContent>
                </Select>
                <div className="mt-2 flex items-center text-xs text-gray-600">
                  <input type="checkbox" className="mr-1" />
                  <span>Synlig på profilen</span>
                </div>
              </div>

              <div>
                <Label className="text-gray-700 font-medium">Politiska åsikter (valfritt)</Label>
                <Select value={profileData.politics || ""} onValueChange={(value) => updateData({ politics: value })}>
                  <SelectTrigger className="mt-2 h-12 rounded-[25px] border-2 border-gray-200">
                    <SelectValue placeholder="Vilka är dina politiska åsikter?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="social-liberal">Social/Liberal</SelectItem>
                    <SelectItem value="mitten">I mitten</SelectItem>
                    <SelectItem value="konservativ">Konservativ</SelectItem>
                    <SelectItem value="inte-politisk">Inte politisk</SelectItem>
                    <SelectItem value="annat">Annat</SelectItem>
                    <SelectItem value="föredrar-inte-säga">Föredrar att inte säga något</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {/* Step 4: Livsstilsvanor */}
          {currentStep === 4 && (
            <>
              <div>
                <Label className="text-gray-700 font-medium">Dricker du?</Label>
                <div className="mt-2 space-y-2">
                  {['Ja', 'Ibland', 'Nej', 'Föredrar att inte säga något'].map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id={`alcohol-${option}`}
                        name="alcohol"
                        value={option}
                        checked={profileData.lifestyle.alcohol === option}
                        onChange={(e) => updateData({ 
                          lifestyle: { ...profileData.lifestyle, alcohol: e.target.value }
                        })}
                        className="border-gray-300"
                      />
                      <Label htmlFor={`alcohol-${option}`} className="text-sm">{option}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-gray-700 font-medium">Röker du tobak?</Label>
                <div className="mt-2 space-y-2">
                  {['Ja', 'Ibland', 'Nej', 'Föredrar att inte säga något'].map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id={`smoking-${option}`}
                        name="smoking"
                        value={option}
                        checked={profileData.lifestyle.smoking === option}
                        onChange={(e) => updateData({ 
                          lifestyle: { ...profileData.lifestyle, smoking: e.target.value }
                        })}
                        className="border-gray-300"
                      />
                      <Label htmlFor={`smoking-${option}`} className="text-sm">{option}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-gray-700 font-medium">Röker du gräs?</Label>
                <div className="mt-2 space-y-2">
                  {['Ja', 'Ibland', 'Nej', 'Föredrar att inte säga något'].map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id={`cannabis-${option}`}
                        name="cannabis"
                        value={option}
                        checked={profileData.lifestyle.cannabis === option}
                        onChange={(e) => updateData({ 
                          lifestyle: { ...profileData.lifestyle, cannabis: e.target.value }
                        })}
                        className="border-gray-300"
                      />
                      <Label htmlFor={`cannabis-${option}`} className="text-sm">{option}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-gray-700 font-medium">Använder du droger?</Label>
                <div className="mt-2 space-y-2">
                  {['Ja', 'Ibland', 'Nej', 'Föredrar att inte säga något'].map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id={`drugs-${option}`}
                        name="drugs"
                        value={option}
                        checked={profileData.lifestyle.drugs === option}
                        onChange={(e) => updateData({ 
                          lifestyle: { ...profileData.lifestyle, drugs: e.target.value }
                        })}
                        className="border-gray-300"
                      />
                      <Label htmlFor={`drugs-${option}`} className="text-sm">{option}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium mb-2">Livsstilskompatibilitet</h4>
                <p className="text-xs text-gray-600">
                  Dessa frågor hjälper oss att matcha dig med personer som har kompatibla livsstilsval. 
                  All information är valfri och kan ändras senare.
                </p>
              </div>
            </>
          )}

          {/* Step 5: Interests & Hobbies */}
          {currentStep === 5 && (
            <>
              <div>
                <Label className="text-gray-700 font-medium">Intressen & hobbies</Label>
                <p className="text-sm text-gray-600 mb-3">Välj upp till 8 intressen som beskriver dig</p>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {interests.map(interest => (
                    <Badge
                      key={interest}
                      variant={profileData.interests.includes(interest) ? "default" : "outline"}
                      className={`cursor-pointer text-center justify-center p-2 transition-all ${
                        profileData.interests.includes(interest) 
                          ? "bg-primary text-white" 
                          : "hover:bg-primary/10"
                      }`}
                      onClick={() => 
                        profileData.interests.includes(interest) 
                          ? removeInterest(interest)
                          : profileData.interests.length < 8 && addInterest(interest)
                      }
                    >
                      {interest}
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-gray-500">
                  {profileData.interests.length}/8 intressen valda
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium mb-2">💡 Tips för bättre matchningar</h4>
                <p className="text-xs text-gray-600">
                  Välj intressen som verkligen speglar vem du är. Detta hjälper oss att hitta personer 
                  med liknande passioner och livsstil.
                </p>
              </div>
            </>
          )}

          {/* Step 6: Bilder & Presentation */}
          {currentStep === 6 && (
            <>
              <div>
                <h3 className="text-lg font-medium mb-2">Visa personen bakom profilen</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Använd bilder, videor och personliga svar för att skapa en autentisk profil som reflekterar den du är.
                </p>
              </div>

              <div>
                <Label className="text-gray-700 font-medium">Välj dina foton och videor</Label>
                <p className="text-sm text-gray-600 mb-3">4-6 bilder rekommenderas för bästa resultat</p>
                <PhotoUpload
                  photos={profileData.photos}
                  onPhotosChange={(photos) => updateData({ photos })}
                  maxPhotos={6}
                  required={true}
                />
                <div className="mt-2 p-3 bg-yellow-50 rounded-lg">
                  <p className="text-xs text-yellow-800">
                    💡 Tips: Flera olika poser och miljöer fungerar bäst för att visa olika sidor av din personlighet.
                  </p>
                </div>
              </div>

              <div>
                <Label className="text-gray-700 font-medium">Röstpresentation (valfritt)</Label>
                <p className="text-sm text-gray-600 mb-3">Spela in en 30-sekunders introduktion</p>
                <Button variant="outline" className="w-full h-12 rounded-[25px] border-2 border-gray-200" disabled>
                  <Mic className="w-4 h-4 mr-2" />
                  Spela in röstintro
                </Button>
                <p className="text-xs text-gray-500 mt-1">Röstfunktion kommer snart</p>
              </div>
            </>
          )}

          {/* Step 7: Personliga svar */}
          {currentStep === 7 && (
            <>
              <div>
                <h3 className="text-lg font-medium mb-2">Personliga profilsvar</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Besvara några kreativa frågor för att visa mer av din personlighet
                </p>
              </div>

              <div>
                <Label className="text-gray-700 font-medium">Vad gör dig genuint lycklig?</Label>
                <Textarea
                  placeholder="Berätta vad som verkligen får dig att le..."
                  className="mt-2 rounded-[25px] border-2 border-gray-200 focus:border-primary"
                  rows={3}
                  value={profileData.personalAnswers?.question1 || ""}
                  onChange={(e) => updateData({
                    personalAnswers: {
                      ...profileData.personalAnswers,
                      question1: e.target.value
                    }
                  })}
                />
              </div>

              <div>
                <Label className="text-gray-700 font-medium">Beskriv din perfekta helgdag</Label>
                <Textarea
                  placeholder="Hur ser din drömhelg ut?"
                  className="mt-2 rounded-[25px] border-2 border-gray-200 focus:border-primary"
                  rows={3}
                  value={profileData.personalAnswers?.question2 || ""}
                  onChange={(e) => updateData({
                    personalAnswers: {
                      ...profileData.personalAnswers,
                      question2: e.target.value
                    }
                  })}
                />
              </div>

              <div>
                <Label className="text-gray-700 font-medium">Vad är du mest stolt över i ditt liv?</Label>
                <Textarea
                  placeholder="Dela något som du verkligen är stolt över..."
                  className="mt-2 rounded-[25px] border-2 border-gray-200 focus:border-primary"
                  rows={3}
                  value={profileData.personalAnswers?.question3 || ""}
                  onChange={(e) => updateData({
                    personalAnswers: {
                      ...profileData.personalAnswers,
                      question3: e.target.value
                    }
                  })}
                />
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium mb-2">✨ Skapa äkta kopplingar</h4>
                <p className="text-xs text-gray-600">
                  Personliga svar får 3x fler meddelanden och hjälper till att starta meningsfulla konversationer.
                </p>
              </div>
            </>
          )}

          {/* Step 8: Integritet & slutförande */}
          {currentStep === 8 && (
            <>
              <div>
                <h3 className="text-lg font-medium mb-2">Vi värdesätter din integritet</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Kontrollera dina integritetsinställningar innan du slutför din profil
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <h4 className="font-medium mb-3">Synlighetsalternativ</h4>
                <div className="space-y-3">
                  <label className="flex items-center justify-between">
                    <span className="text-sm">Visa min ålder</span>
                    <input 
                      type="checkbox" 
                      checked={profileData.privacy.showAge}
                      onChange={(e) => updateData({
                        privacy: { ...profileData.privacy, showAge: e.target.checked }
                      })}
                      className="rounded border-gray-300"
                    />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-sm">Visa mitt jobb</span>
                    <input 
                      type="checkbox" 
                      checked={profileData.privacy.showJob}
                      onChange={(e) => updateData({
                        privacy: { ...profileData.privacy, showJob: e.target.checked }
                      })}
                      className="rounded border-gray-300"
                    />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-sm">Visa min utbildning</span>
                    <input 
                      type="checkbox" 
                      checked={profileData.privacy.showEducation}
                      onChange={(e) => updateData({
                        privacy: { ...profileData.privacy, showEducation: e.target.checked }
                      })}
                      className="rounded border-gray-300"
                    />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-sm">Visa mitt efternamn för matchningar</span>
                    <input 
                      type="checkbox" 
                      checked={profileData.privacy.showLastName}
                      onChange={(e) => updateData({
                        privacy: { ...profileData.privacy, showLastName: e.target.checked }
                      })}
                      className="rounded border-gray-300"
                    />
                  </label>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h4 className="font-medium mb-3">Datanvändning</h4>
                <p className="text-xs text-gray-600 mb-3">
                  Vi använder analysverktyg för att mäta appens räckvidd, anpassa upplevelsen och förbättra tjänsten. 
                  <strong> Dessa verktyg spårar inte dig över olika appar eller webbplatser.</strong>
                </p>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      checked={!profileData.privacy.allowMarketing}
                      onChange={(e) => updateData({
                        privacy: { ...profileData.privacy, allowMarketing: !e.target.checked }
                      })}
                      className="rounded border-gray-300"
                    />
                    <span className="text-xs">Endast nödvändiga tjänster (rekommenderas)</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      checked={profileData.privacy.allowMarketing}
                      onChange={(e) => updateData({
                        privacy: { ...profileData.privacy, allowMarketing: e.target.checked }
                      })}
                      className="rounded border-gray-300"
                    />
                    <span className="text-xs">Tillåt marknadsföringsanpassning</span>
                  </label>
                </div>
              </div>

              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">
                  ✓
                </div>
                <h3 className="text-lg font-medium mb-2">Din profil är klar!</h3>
                <p className="text-sm text-gray-600">
                  Grattis! Nu kan du börja matcha med andra autentiska personer på MÄÄK.
                </p>
              </div>
            </>
          )}
          </div>
        </div>

        <div className="flex justify-between mt-6 px-2">
          <Button 
            variant="outline" 
            onClick={prevStep}
            disabled={currentStep === 1} // Can't go back from first real step
            className="rounded-[25px] border-2 border-gray-300 h-12 px-6 font-medium"
          >
            Tillbaka
          </Button>
          
          <div className="flex gap-2">
            {/* Test data button för utveckling */}
            {process.env.NODE_ENV === 'development' && (
              <Button 
                variant="outline"
                onClick={() => {
                  console.log('[PROFILE CREATION] Fyller i testdata...');
                  updateData({
                    firstName: "Emma",
                    lastName: "Larsson", 
                    birthDate: "1996-05-15",
                    age: 26,
                    gender: "Kvinna",
                    sexuality: "Hetero",
                    datingPreferences: ["Män"],
                    location: "Stockholm",
                    interests: ["Konst", "Musik", "Resor", "Matlagning"],
                    photos: ["test1.jpg", "test2.jpg"] // Mock photos
                  });
                  console.log('[PROFILE CREATION] Testdata ifylld');
                }}
                className="rounded-[25px] border-2 border-blue-300 text-blue-600 h-12 px-4 text-sm"
              >
                📝 Test
              </Button>
            )}
            
            <Button 
              className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white rounded-[25px] shadow-lg h-12 px-8 font-semibold transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              onClick={() => {
                console.log('[PROFILE CREATION] Knapp klickad på steg', currentStep, 'kan fortsätta:', canContinueStep(currentStep));
                nextStep();
              }}
              disabled={!canContinueStep(currentStep)}
            >
              {currentStep === steps.length - 1 ? "Slutför profil" : "Nästa"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}