import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ArrowLeft, Heart, Brain, Zap, Target, ChevronRight, Users, Lightbulb, AlertCircle, MessageCircle } from 'lucide-react';

interface Archetype {
  type: string;
  name: string;
  category: string;
  color: string;
  icon: any;
  description: string;
  strengths: string[];
  challenges: string[];
  datingStyle: string;
  bestMatches: string[];
  worksWith: string[];
  avoidsConflicts: boolean;
  energyLevel: 'Låg' | 'Medium' | 'Hög';
  communicationStyle: string;
}

interface ArchetypeExplorerProps {
  onBack: () => void;
  userPersonality?: any;
}

const archetypes: Archetype[] = [
  // DIPLOMATER (Djup) - Lila gradients
  {
    type: "ENFJ", name: "Författaren", category: "Diplomater", 
    color: "bg-gradient-to-br from-purple-500 to-purple-600", icon: Heart,
    description: "Karismatiska ledare som inspirerar andra till personlig tillväxt. Du ser potentialen i människor och hjälper dem att blomstra.",
    strengths: ["Inspirerande", "Karismatisk", "Empatisk", "Visionär"],
    challenges: ["Perfektionist", "Tar på sig för mycket", "Försummar egna behov"],
    datingStyle: "Söker djupa, meningsfulla relationer med stark emotionell koppling. Vill inspirera och stötta sin partner.",
    bestMatches: ["INFP", "ISFP", "ENFP", "INFJ"],
    worksWith: ["Alla typer, särskilt de som behöver uppmuntran"],
    avoidsConflicts: true,
    energyLevel: "Hög",
    communicationStyle: "Varm, stödjande och inspirerande"
  },
  {
    type: "ENFP", name: "Entusiasten", category: "Diplomater",
    color: "bg-gradient-to-br from-purple-400 to-purple-500", icon: Heart,
    description: "Kreativa upptäckare som ser potentialen i människor och relationer. Du sprider glädje och ser möjligheter överallt.",
    strengths: ["Spontan", "Optimistisk", "Kreativ", "Äkta"],
    challenges: ["Lättdistraherad", "Undviker konflikter", "Idealiserar"],
    datingStyle: "Vill ha äventyrliga, djupa relationer fulla av upptäckter och tillväxt. Söker äkta förbindelser.",
    bestMatches: ["INFJ", "INTJ", "ISFJ", "ISTJ"],
    worksWith: ["Typer som uppskattar spontanitet och kreativitet"],
    avoidsConflicts: true,
    energyLevel: "Hög",
    communicationStyle: "Entusiastisk, kreativ och öppen"
  },
  {
    type: "INFJ", name: "Rådgivaren", category: "Diplomater",
    color: "bg-gradient-to-br from-purple-600 to-purple-700", icon: Heart,
    description: "Intuitiva idealister med djup förståelse för människor. Du ser bakom ytan och värderar autenticitet högt.",
    strengths: ["Insiktsfull", "Tålmodig", "Kreativ", "Principfast"],
    challenges: ["Perfektionist", "Känslig", "Överanalyserar"],
    datingStyle: "Söker sällan, men när de gör det - djupt och meningsfullt. Värdesätter äkta förbindelser över allt annat.",
    bestMatches: ["ENFP", "ENTP", "ISFP", "ESTP"],
    worksWith: ["Typer som respekterar djup och autenticitet"],
    avoidsConflicts: true,
    energyLevel: "Medium",
    communicationStyle: "Djup, genomtänkt och empatisk"
  },
  {
    type: "INFP", name: "Idealisten", category: "Diplomater",
    color: "bg-gradient-to-br from-purple-500 to-pink-500", icon: Heart,
    description: "Poetiska drömmare som värderar autenticitet och personliga värderingar över allt. Du söker mening i allt du gör.",
    strengths: ["Autentisk", "Lojal", "Flexibel", "Kreativ"],
    challenges: ["Känslig för kritik", "Undviker konflikter", "Idealiserar"],
    datingStyle: "Vill ha äkta, djupa förbindelser baserade på gemensamma värderingar. Tar tid att öppna sig.",
    bestMatches: ["ENFJ", "ESFJ", "ISFJ", "ESTJ"],
    worksWith: ["Typer som respekterar individualitet och värderingar"],
    avoidsConflicts: true,
    energyLevel: "Medium",
    communicationStyle: "Autentisk, känslig och genomtänkt"
  },

  // BYGGARE (Trygghet) - Gröna gradients  
  {
    type: "ESTJ", name: "Administratören", category: "Byggare",
    color: "bg-gradient-to-br from-green-500 to-green-600", icon: Target,
    description: "Naturliga organisatörer som bygger stabila strukturer. Du skapar ordning och trygghet för alla omkring dig.",
    strengths: ["Ansvarsfull", "Praktisk", "Lojal", "Organiserad"],
    challenges: ["Stel", "Kritisk", "Arbetsnarkoman"],
    datingStyle: "Söker stabila, långsiktiga relationer med tydliga roller och förväntningar. Traditionell approach.",
    bestMatches: ["ISFP", "INFP", "ESFP", "ISFJ"],
    worksWith: ["Typer som uppskattar stabilitet och struktur"],
    avoidsConflicts: false,
    energyLevel: "Hög",
    communicationStyle: "Direkt, praktisk och målstyrd"
  },
  {
    type: "ESFJ", name: "Vårdaren", category: "Byggare",
    color: "bg-gradient-to-br from-green-400 to-green-500", icon: Target,
    description: "Varma supporters som prioriterar harmoni och omsorg. Du ser till att alla känner sig välkomna och omhändertagna.",
    strengths: ["Omhändertagande", "Lojal", "Pratglad", "Samarbetsvillig"],
    challenges: ["Behöver bekräftelse", "Undviker konflikter", "Kritisk mot sig själv"],
    datingStyle: "Vill ha harmoniska relationer där omsorg och stöd är centralt. Sätter partnerns behov först.",
    bestMatches: ["ISFP", "INFP", "ESTP", "ISTP"],
    worksWith: ["Alla typer, särskilt de som behöver stöd"],
    avoidsConflicts: true,
    energyLevel: "Hög",
    communicationStyle: "Varm, stödjande och omhändertagande"
  },
  {
    type: "ISTJ", name: "Specialisten", category: "Byggare", 
    color: "bg-gradient-to-br from-green-600 to-green-700", icon: Target,
    description: "Pålitliga traditionalister som bygger på beprövade metoder. Du är den stabila klippan som andra kan lita på.",
    strengths: ["Pålitlig", "Metodisk", "Lojal", "Tålmodig"],
    challenges: ["Motstånd till förändring", "Har svårt att uttrycka känslor"],
    datingStyle: "Tar det lugnt, bygger förtroende över tid och söker stabilitet. Långsiktig approach.",
    bestMatches: ["ESFP", "ESTP", "ENFP", "ESFJ"],
    worksWith: ["Typer som uppskattar pålitlighet och stabilitet"],
    avoidsConflicts: false,
    energyLevel: "Medium",
    communicationStyle: "Lugn, faktabaserad och pålitlig"
  },
  {
    type: "ISFJ", name: "Beskyddaren", category: "Byggare",
    color: "bg-gradient-to-br from-green-500 to-emerald-500", icon: Target,
    description: "Omtänksamma beskyddare som sätter andras behov först. Du skapar trygghet genom din omsorg och uppmärksamhet.",
    strengths: ["Stöttande", "Pålitlig", "Tålmodig", "Lojal"],
    challenges: ["Glömmer sig själv", "Undviker konflikter", "Känslig"],
    datingStyle: "Vill ha trygga relationer där de kan ge omsorg och stöd. Behöver uppskattas för sina insatser.",
    bestMatches: ["ESFP", "ESTP", "ENFP", "ESTJ"],
    worksWith: ["Typer som uppskattar omsorg och stabilitet"],
    avoidsConflicts: true,
    energyLevel: "Medium",
    communicationStyle: "Mjuk, omtänksam och stödjande"
  },

  // UPPTÄCKARE (Spontanitet) - Gula gradients
  {
    type: "ESTP", name: "Entreprenören", category: "Upptäckare",
    color: "bg-gradient-to-br from-yellow-500 to-orange-500", icon: Zap,
    description: "Energiska risktagare som lever för stunden. Du förvandlar vardagen till äventyr och ser möjligheter överallt.",
    strengths: ["Spontan", "Pragmatisk", "Energisk", "Anpassningsbar"],
    challenges: ["Otålig", "Risktagande", "Fokuserar på nu"],
    datingStyle: "Vill ha roliga, spontana relationer med mycket aktivitet och äventyr. Lever i nuet.",
    bestMatches: ["ISFJ", "ISTJ", "INFJ", "ISFP"],
    worksWith: ["Typer som uppskattar spontanitet och äventyr"],
    avoidsConflicts: false,
    energyLevel: "Hög",
    communicationStyle: "Direkt, energisk och spontan"
  },
  {
    type: "ESFP", name: "Underhållaren", category: "Upptäckare",
    color: "bg-gradient-to-br from-yellow-400 to-yellow-500", icon: Zap,
    description: "Spontana performers som sprider glädje. Du förvandlar varje situation till en möjlighet att ha kul och skapa minnen.",
    strengths: ["Entusiastisk", "Vänlig", "Spontan", "Praktisk"],
    challenges: ["Lättdistraherad", "Känslostyrda beslut", "Undviker planering"],
    datingStyle: "Söker roliga, ljusa relationer fulla av skratt och spontana äventyr. Vill ha en bästa vän som partner.",
    bestMatches: ["ISFJ", "ISTJ", "ISFP", "INFP"],
    worksWith: ["Typer som uppskattar glädje och spontanitet"],
    avoidsConflicts: true,
    energyLevel: "Hög",
    communicationStyle: "Entusiastisk, varm och uttrycksfull"
  },
  {
    type: "ISTP", name: "Äventyraren", category: "Upptäckare", 
    color: "bg-gradient-to-br from-yellow-600 to-orange-600", icon: Zap,
    description: "Praktiska problemlösare som värdesätter frihet. Du löser utmaningar med lugn kompetens och behöver ditt utrymme.",
    strengths: ["Praktisk", "Flexibel", "Lugn", "Observant"],
    challenges: ["Privat", "Stubbornhet", "Svår att läsa"],
    datingStyle: "Vill ha avslappnade relationer utan för mycket drama eller press. Behöver frihet och respekt.",
    bestMatches: ["ESFJ", "ESTJ", "ESFP", "ESTP"],
    worksWith: ["Typer som respekterar oberoende"],
    avoidsConflicts: false,
    energyLevel: "Medium",
    communicationStyle: "Lugn, praktisk och reserverad"
  },
  {
    type: "ISFP", name: "Konstnären", category: "Upptäckare",
    color: "bg-gradient-to-br from-yellow-500 to-pink-500", icon: Zap,
    description: "Känsliga konstnärer som värdesätter skönhet och autenticitet. Du ser världen genom kreativa ögon och värnar om harmoni.",
    strengths: ["Flexibel", "Omtänksam", "Lojal", "Kreativ"],
    challenges: ["Känslig", "Undviker konflikter", "Självkritisk"],
    datingStyle: "Söker harmoniska relationer med utrymme för kreativitet och personlig tillväxt. Värdesätter äkthet.",
    bestMatches: ["ESFJ", "ESTJ", "ENFJ", "ESFP"],
    worksWith: ["Typer som uppskattar kreativitet och harmoni"],
    avoidsConflicts: true,
    energyLevel: "Medium",
    communicationStyle: "Mjuk, kreativ och autentisk"
  },

  // STRATEGER (Tillväxt) - Blåa gradients
  {
    type: "ENTJ", name: "Strategen", category: "Strateger",
    color: "bg-gradient-to-br from-blue-500 to-blue-600", icon: Brain,
    description: "Naturliga ledare som planerar för framtiden. Du bygger system och strukturer för att uppnå stora visioner.",
    strengths: ["Beslutsam", "Effektiv", "Strategisk", "Självsäker"],
    challenges: ["Outtröttligt", "Otålig", "Kan vara hård"],
    datingStyle: "Söker partners som delar ambitioner och kan bygga något stort tillsammans. Vill ha en jämlik partner.",
    bestMatches: ["INFP", "ISFP", "INTP", "ISTP"],
    worksWith: ["Typer som uppskattar målstyrdhet"],
    avoidsConflicts: false,
    energyLevel: "Hög",
    communicationStyle: "Direkt, strategisk och målstyrd"
  },
  {
    type: "ENTP", name: "Innovatören", category: "Strateger",
    color: "bg-gradient-to-br from-blue-400 to-blue-500", icon: Brain,
    description: "Kreativa visionärer som älskar intellektuella utmaningar. Du ser möjligheter och skapar innovativa lösningar.",
    strengths: ["Innovativ", "Entusiastisk", "Flexibel", "Charismatisk"],
    challenges: ["Lättdistraherad", "Argumenterande", "Undviker rutiner"],
    datingStyle: "Vill ha intellektuellt stimulerande relationer med konstant tillväxt. Söker en debattpartner.",
    bestMatches: ["INFJ", "INTJ", "ISFJ", "ISFP"],
    worksWith: ["Typer som uppskattar innovation och debatt"],
    avoidsConflicts: false,
    energyLevel: "Hög",
    communicationStyle: "Entusiastisk, innovativ och utmanande"
  },
  {
    type: "INTJ", name: "Arkitekten", category: "Strateger",
    color: "bg-gradient-to-br from-blue-600 to-blue-700", icon: Brain,
    description: "Strategiska perfektionister som planerar noga. Du ser stora mönster och arbetar systematiskt mot dina mål.",
    strengths: ["Oberoende", "Strategisk", "Beslutsam", "Innovativ"],
    challenges: ["Överkritisk", "Privat", "Perfektionist"],
    datingStyle: "Tar relationer seriöst, planerar för framtiden och söker djup kompatibilitet. Kvalitet över kvantitet.",
    bestMatches: ["ENFP", "ENTP", "ESFP", "ESTP"],
    worksWith: ["Typer som uppskattar djup och oberoende"],
    avoidsConflicts: false,
    energyLevel: "Medium",
    communicationStyle: "Djup, strategisk och oberoende"
  },
  {
    type: "INTP", name: "Forskaren", category: "Strateger",
    color: "bg-gradient-to-br from-blue-500 to-indigo-500", icon: Brain,
    description: "Logiska tänkare som söker förståelse. Du utforskar idéer och teorier med nyfikenhet och precision.",
    strengths: ["Analytisk", "Original", "Oberoende", "Nyfiken"],
    challenges: ["Distraherad", "Osensibel", "Oorganiserad"],
    datingStyle: "Vill ha intellektuella partners som respekterar deras behov av utrymme. Söker förståelse över passion.",
    bestMatches: ["ESFJ", "ESTJ", "ENFJ", "ENTJ"],
    worksWith: ["Typer som uppskattar intellektuell stimulans"],
    avoidsConflicts: true,
    energyLevel: "Låg",
    communicationStyle: "Analytisk, nyfiken och oberoende"
  }
];

export function ArchetypeExplorer({ onBack, userPersonality }: ArchetypeExplorerProps) {
  const [selectedArchetype, setSelectedArchetype] = useState<Archetype | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('Diplomater');

  const categories = [
    { name: 'Diplomater', icon: Heart, color: 'purple', description: 'Djup och mening' },
    { name: 'Byggare', icon: Target, color: 'green', description: 'Trygghet och stabilitet' },
    { name: 'Upptäckare', icon: Zap, color: 'yellow', description: 'Spontanitet och äventyr' },
    { name: 'Strateger', icon: Brain, color: 'blue', description: 'Tillväxt och innovation' }
  ];

  const getArchetypesByCategory = (category: string) => {
    return archetypes.filter(archetype => archetype.category === category);
  };

  const getCategoryColor = (category: string) => {
    const categoryInfo = categories.find(cat => cat.name === category);
    return categoryInfo?.color || 'gray';
  };

  if (selectedArchetype) {
    const IconComponent = selectedArchetype.icon;
    
    return (
      <div className="max-w-md mx-auto p-6 pb-20">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => setSelectedArchetype(null)} className="mr-4">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-xl">Archetype Djupdyk</h1>
        </div>

        {/* Archetype Header */}
        <Card className="mb-6">
          <div className={`${selectedArchetype.color} text-white p-6 rounded-t-lg relative overflow-hidden`}>
            <div className="absolute top-4 right-4 opacity-30">
              <IconComponent className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold mb-1">{selectedArchetype.name}</h2>
            <p className="text-lg mb-2">{selectedArchetype.type}</p>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              {selectedArchetype.category}
            </Badge>
          </div>
          <CardContent className="p-6">
            <p className="text-gray-700 leading-relaxed">{selectedArchetype.description}</p>
          </CardContent>
        </Card>

        {/* Detailed Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Översikt</TabsTrigger>
            <TabsTrigger value="dating">Dejting</TabsTrigger>
            <TabsTrigger value="compatibility">Kompat.</TabsTrigger>
            <TabsTrigger value="tips">Tips</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Lightbulb className="w-5 h-5 mr-2 text-green-600" />
                  Styrkor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {selectedArchetype.strengths.map((strength, index) => (
                    <Badge key={index} variant="outline" className="justify-center border-green-300 text-green-700">
                      {strength}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <AlertCircle className="w-5 h-5 mr-2 text-yellow-600" />
                  Utvecklingsområden
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-2">
                  {selectedArchetype.challenges.map((challenge, index) => (
                    <Badge key={index} variant="outline" className="justify-center border-yellow-300 text-yellow-700">
                      {challenge}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Kommunikationsstil</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700">{selectedArchetype.communicationStyle}</p>
                <div className="mt-3 flex items-center justify-between text-xs">
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      selectedArchetype.energyLevel === 'Hög' ? 'bg-red-500' :
                      selectedArchetype.energyLevel === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}></div>
                    <span>Energinivå: {selectedArchetype.energyLevel}</span>
                  </div>
                  <div className="flex items-center">
                    <span>Undviker konflikter: {selectedArchetype.avoidsConflicts ? '✅' : '❌'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dating" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <MessageCircle className="w-5 h-5 mr-2 text-pink-600" />
                  Dejtingstil
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 leading-relaxed">{selectedArchetype.datingStyle}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Vad du söker i en partner</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-700">
                  {selectedArchetype.category === 'Diplomater' && (
                    <div className="space-y-1">
                      <p>• Djup emotionell förståelse</p>
                      <p>• Gemensamma värderingar</p>
                      <p>• Autenticitet och ärlighet</p>
                      <p>• Utrymme för personlig tillväxt</p>
                    </div>
                  )}
                  {selectedArchetype.category === 'Byggare' && (
                    <div className="space-y-1">
                      <p>• Stabilitet och trygghet</p>
                      <p>• Lojalitet och pålitlighet</p>
                      <p>• Traditionella värderingar</p>
                      <p>• Gemensam livsstil</p>
                    </div>
                  )}
                  {selectedArchetype.category === 'Upptäckare' && (
                    <div className="space-y-1">
                      <p>• Spontanitet och äventyr</p>
                      <p>• Flexibilitet och anpassningsförmåga</p>
                      <p>• Roliga upplevelser tillsammans</p>
                      <p>• Frihet och utrymme</p>
                    </div>
                  )}
                  {selectedArchetype.category === 'Strateger' && (
                    <div className="space-y-1">
                      <p>• Intellektuell stimulans</p>
                      <p>• Gemensamma mål och ambitioner</p>
                      <p>• Oberoende och respekt</p>
                      <p>• Kontinuerlig utveckling</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compatibility" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Heart className="w-5 h-5 mr-2 text-red-600" />
                  Bästa matchningar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {selectedArchetype.bestMatches.map((match, index) => {
                    const matchedArchetype = archetypes.find(a => a.type === match);
                    return (
                      <Badge 
                        key={index} 
                        variant="outline" 
                        className="justify-center border-red-300 text-red-700 cursor-pointer hover:bg-red-50"
                        onClick={() => matchedArchetype && setSelectedArchetype(matchedArchetype)}
                      >
                        {match}
                      </Badge>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Users className="w-5 h-5 mr-2 text-blue-600" />
                  Funkar bra med
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {selectedArchetype.worksWith.map((works, index) => (
                    <p key={index} className="text-sm text-gray-700">• {works}</p>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tips" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tips för bättre relationer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-gray-700">
                  {selectedArchetype.category === 'Diplomater' && (
                    <div className="space-y-2">
                      <p><strong>Kommunikation:</strong> Var öppen om dina känslor och lyssna aktivt</p>
                      <p><strong>Konflikter:</strong> Adressera problem tidigt istället för att undvika</p>
                      <p><strong>Gränser:</strong> Glöm inte dina egna behov när du hjälper andra</p>
                    </div>
                  )}
                  {selectedArchetype.category === 'Byggare' && (
                    <div className="space-y-2">
                      <p><strong>Flexibilitet:</strong> Våga ibland bryta rutiner för spontanitet</p>
                      <p><strong>Känslor:</strong> Öva på att uttrycka känslor verbalt</p>
                      <p><strong>Förändring:</strong> Se förändring som möjlighet, inte hot</p>
                    </div>
                  )}
                  {selectedArchetype.category === 'Upptäckare' && (
                    <div className="space-y-2">
                      <p><strong>Planering:</strong> Balansera spontanitet med några fasta planer</p>
                      <p><strong>Djup:</strong> Ge djupa samtal en chans, även om det känns tungt</p>
                      <p><strong>Stabilitet:</strong> Bygg små rutiner som skapar trygghet</p>
                    </div>
                  )}
                  {selectedArchetype.category === 'Strateger' && (
                    <div className="space-y-2">
                      <p><strong>Känslor:</strong> Kom ihåg att relationer handlar om mer än logik</p>
                      <p><strong>Tålmodighet:</strong> Alla utvecklas inte i samma takt som du</p>
                      <p><strong>Närhet:</strong> Dela dina tankar och feeling, inte bara idéer</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 pb-20">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={onBack} className="mr-4">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-xl">MÄÄK Archetypes</h1>
          <p className="text-sm text-gray-600">Utforska alla 16 personlighetstyper</p>
        </div>
      </div>

      {/* Category Tabs */}
      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full mb-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="Diplomater" className="flex flex-col items-center p-3">
            <Heart className="w-4 h-4 mb-1" />
            <span className="text-xs">Diplomater</span>
          </TabsTrigger>
          <TabsTrigger value="Byggare" className="flex flex-col items-center p-3">
            <Target className="w-4 h-4 mb-1" />
            <span className="text-xs">Byggare</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsList className="grid w-full grid-cols-2 mt-2">
          <TabsTrigger value="Upptäckare" className="flex flex-col items-center p-3">
            <Zap className="w-4 h-4 mb-1" />
            <span className="text-xs">Upptäckare</span>
          </TabsTrigger>
          <TabsTrigger value="Strateger" className="flex flex-col items-center p-3">
            <Brain className="w-4 h-4 mb-1" />
            <span className="text-xs">Strateger</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Category Description */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center mb-2">
            {categories.find(cat => cat.name === activeCategory)?.icon && 
              React.createElement(categories.find(cat => cat.name === activeCategory)!.icon, { 
                className: `w-5 h-5 mr-2 text-${getCategoryColor(activeCategory)}-600` 
              })
            }
            <h3 className="font-medium">{activeCategory}</h3>
          </div>
          <p className="text-sm text-gray-600">
            {categories.find(cat => cat.name === activeCategory)?.description}
          </p>
        </CardContent>
      </Card>

      {/* Archetype Grid */}
      <div className="grid grid-cols-2 gap-3">
        {getArchetypesByCategory(activeCategory).map((archetype) => {
          const IconComponent = archetype.icon;
          const isUserType = userPersonality?.type === archetype.type;
          
          return (
            <Card 
              key={archetype.type}
              className={`cursor-pointer transition-all hover:shadow-lg hover:scale-105 ${
                isUserType ? 'ring-2 ring-primary border-primary' : ''
              }`}
              onClick={() => setSelectedArchetype(archetype)}
            >
              <div className={`${archetype.color} text-white p-4 rounded-t-lg relative overflow-hidden`}>
                <div className="absolute top-2 right-2 opacity-30">
                  <IconComponent className="w-5 h-5" />
                </div>
                {isUserType && (
                  <div className="absolute top-2 left-2">
                    <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                  </div>
                )}
                <h3 className="font-bold text-sm mb-1">{archetype.name}</h3>
                <p className="text-xs opacity-90">{archetype.type}</p>
              </div>
              <CardContent className="p-3">
                <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                  {archetype.description.substring(0, 80)}...
                </p>
                <div className="flex items-center justify-between mt-2">
                  <Badge variant="outline" className="text-xs">
                    {archetype.energyLevel} energi
                  </Badge>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* User's Type Highlight */}
      {userPersonality && (
        <Card className="mt-6 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center mb-2">
              <div className="w-3 h-3 bg-primary rounded-full mr-2"></div>
              <span className="text-sm font-medium">Din typ</span>
            </div>
            <p className="text-xs text-gray-600">
              Du är en <strong>{userPersonality.name}</strong> ({userPersonality.type}). 
              Utforska liknande typer och se vilka som kompletterar dig bäst!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}