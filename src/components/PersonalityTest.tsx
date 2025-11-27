import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Slider } from "./ui/slider";
import { useAnalytics } from "../utils/analytics";
import { Heart, Brain, Zap, Target, Users, Eye, Lightbulb, Scale, Clock } from "lucide-react";

// MÄÄK PERSONLIGHETSTEST – enligt fullständig specifikation
// STEG 1 - 30 frågor med Likert-skala (1–5) mäter 5 dimensioner
interface Question {
  id: number;
  text: string;
  dimension: 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P' | 'A' | 'T_turbulent';
  category: 'social' | 'information' | 'decisions' | 'structure' | 'confidence';
}

// 30 frågor enligt MÄÄK-specifikationen
const questions: Question[] = [
  // E/I (Extraversion / Introversion) - Social energi - 6 frågor
  { id: 1, text: "Jag trivs bäst i sociala sammanhang med många människor", dimension: "E", category: "social" },
  { id: 2, text: "Jag laddar mina batterier bäst när jag är ensam", dimension: "I", category: "social" },
  { id: 3, text: "Jag är bra på att prata inför grupper", dimension: "E", category: "social" },
  { id: 4, text: "Jag föredrar att umgås med få nära vänner", dimension: "I", category: "social" },
  { id: 5, text: "Jag tar gärna initiativ i sociala situationer", dimension: "E", category: "social" },
  { id: 6, text: "Jag behöver tid för mig själv för att känna mig bekväm", dimension: "I", category: "social" },

  // S/N (Sensing / Intuition) - Informationsbearbetning - 6 frågor  
  { id: 7, text: "Jag föredrar att fokusera på detaljer framför helhetsbilden", dimension: "S", category: "information" },
  { id: 8, text: "Jag reflekterar ofta över djupa, filosofiska frågor", dimension: "N", category: "information" },
  { id: 9, text: "Jag förlitar mig på beprövade metoder", dimension: "S", category: "information" },
  { id: 10, text: "Jag ser ofta mönster och möjligheter andra missar", dimension: "N", category: "information" },
  { id: 11, text: "Jag fokuserar på konkreta fakta när jag fattar beslut", dimension: "S", category: "information" },
  { id: 12, text: "Jag inspireras av framtida visioner och möjligheter", dimension: "N", category: "information" },

  // T/F (Thinking / Feeling) - Beslutsfattande - 6 frågor
  { id: 13, text: "Jag fattar beslut baserat på logik snarare än känslor", dimension: "T", category: "decisions" },
  { id: 14, text: "Jag värderar harmoni och medkänsla högt", dimension: "F", category: "decisions" },
  { id: 15, text: "Jag analyserar situationer objektivt", dimension: "T", category: "decisions" },
  { id: 16, text: "Jag tar hänsyn till andras känslor när jag beslutar", dimension: "F", category: "decisions" },
  { id: 17, text: "Jag värderar rättvisa över personliga relationer", dimension: "T", category: "decisions" },
  { id: 18, text: "Jag strävar efter att förstå och stötta andra", dimension: "F", category: "decisions" },

  // J/P (Judging / Prospecting) - Livsstil och struktur - 6 frågor
  { id: 19, text: "Jag planerar gärna mitt liv i förväg", dimension: "J", category: "structure" },
  { id: 20, text: "Jag föredrar att hålla mina alternativ öppna", dimension: "P", category: "structure" },
  { id: 21, text: "Jag gillar struktur och rutiner", dimension: "J", category: "structure" },
  { id: 22, text: "Jag anpassar mig lätt till oväntade förändringar", dimension: "P", category: "structure" },
  { id: 23, text: "Jag föredrar att ha saker avklarade i tid", dimension: "J", category: "structure" },
  { id: 24, text: "Jag arbetar bäst under tidspress och spontant", dimension: "P", category: "structure" },

  // A/T (Assertive / Turbulent) - Självförtroende och hantering av stress - 6 frågor
  { id: 25, text: "Jag känner mig säker på mina beslut och handlingar", dimension: "A", category: "confidence" },
  { id: 26, text: "Jag söker ofta bekräftelse från andra", dimension: "T_turbulent", category: "confidence" },
  { id: 27, text: "Jag hanterar stress och press utan att påverkas mycket", dimension: "A", category: "confidence" },
  { id: 28, text: "Jag oroar mig ofta för vad andra tycker om mig", dimension: "T_turbulent", category: "confidence" },
  { id: 29, text: "Jag känner mig bekväm med att ta risker", dimension: "A", category: "confidence" },
  { id: 30, text: "Jag strävar ständigt efter att förbättra mig själv", dimension: "T_turbulent", category: "confidence" }
];

// STEG 2 - MÄÄK:s 16 Archetypes uppdelade i 4 kategorier enligt spec
const archetypes = [
  // DIPLOMATER (NF) - Lila färgkodning
  {
    type: "ENFJ", name: "Protagonisten", category: "Diplomater", 
    color: "bg-gradient-to-br from-purple-500 to-purple-600", icon: Heart,
    description: "Naturliga ledare som inspirerar andra till personlig tillväxt och äkta förbindelser.",
    emotional: "Utåtriktad", intellectual: "Intuitiv", social: "Varm", lifestyle: "Organiserad"
  },
  {
    type: "ENFP", name: "Kampanjören", category: "Diplomater",
    color: "bg-gradient-to-br from-purple-400 to-purple-500", icon: Heart,
    description: "Kreativa upptäckare som ser potentialen i människor och relationer.",
    emotional: "Utåtriktad", intellectual: "Intuitiv", social: "Entusiastisk", lifestyle: "Spontan"
  },
  {
    type: "INFJ", name: "Advokaten", category: "Diplomater",
    color: "bg-gradient-to-br from-purple-600 to-purple-700", icon: Heart,
    description: "Intuitiva idealister som strävar efter autenticitet och djup förståelse.",
    emotional: "Inåtriktad", intellectual: "Intuitiv", social: "Reflekterande", lifestyle: "Planerad"
  },
  {
    type: "INFP", name: "Mediatorn", category: "Diplomater",
    color: "bg-gradient-to-br from-purple-500 to-pink-500", icon: Heart,
    description: "Poetiska drömmare som värderar autenticitet och personliga värderingar.",
    emotional: "Inåtriktad", intellectual: "Intuitiv", social: "Autentisk", lifestyle: "Flexibel"
  },

  // BYGGARE (SJ) - Grön färgkodning  
  {
    type: "ESTJ", name: "Chefen", category: "Byggare",
    color: "bg-gradient-to-br from-green-500 to-green-600", icon: Target,
    description: "Naturliga organisatörer som bygger stabila, pålitliga relationer.",
    emotional: "Utåtriktad", intellectual: "Praktisk", social: "Direkt", lifestyle: "Strukturerad"
  },
  {
    type: "ESFJ", name: "Konsuln", category: "Byggare",
    color: "bg-gradient-to-br from-green-400 to-green-500", icon: Users,
    description: "Omtänksamma vårdare som skapar harmoni och trygghet.",
    emotional: "Utåtriktad", intellectual: "Praktisk", social: "Vårdande", lifestyle: "Organiserad"
  },
  {
    type: "ISTJ", name: "Logistikern", category: "Byggare",
    color: "bg-gradient-to-br from-green-600 to-green-700", icon: Clock,
    description: "Pålitliga realister som värdesätter tradition och stabilitet.",
    emotional: "Inåtriktad", intellectual: "Praktisk", social: "Lojal", lifestyle: "Metodisk"
  },
  {
    type: "ISFJ", name: "Beskyddaren", category: "Byggare",
    color: "bg-gradient-to-br from-green-500 to-teal-500", icon: Heart,
    description: "Varma beskyddare som sätter andras välbefinnande först.",
    emotional: "Inåtriktad", intellectual: "Praktisk", social: "Stödjande", lifestyle: "Stabil"
  },

  // UPPTÄCKARE (SP) - Gul färgkodning
  {
    type: "ESTP", name: "Entreprenören", category: "Upptäckare",
    color: "bg-gradient-to-br from-yellow-500 to-yellow-600", icon: Zap,
    description: "Energiska pragmatiker som lever i nuet och älskar action.",
    emotional: "Utåtriktad", intellectual: "Praktisk", social: "Energisk", lifestyle: "Spontan"
  },
  {
    type: "ESFP", name: "Underhållaren", category: "Upptäckare",
    color: "bg-gradient-to-br from-yellow-400 to-orange-500", icon: Heart,
    description: "Spontana artister som sprider glädje och lever för upplevelser.",
    emotional: "Utåtriktad", intellectual: "Praktisk", social: "Entusiastisk", lifestyle: "Flexibel"
  },
  {
    type: "ISTP", name: "Virtuosen", category: "Upptäckare",
    color: "bg-gradient-to-br from-yellow-600 to-yellow-700", icon: Target,
    description: "Praktiska experimentalister som behärskar verktyg och tekniker.",
    emotional: "Inåtriktad", intellectual: "Praktisk", social: "Oberoende", lifestyle: "Anpassningsbar"
  },
  {
    type: "ISFP", name: "Äventyraren", category: "Upptäckare",
    color: "bg-gradient-to-br from-yellow-500 to-pink-500", icon: Heart,
    description: "Flexibla artister som värdesätter skönhet och harmoni.",
    emotional: "Inåtriktad", intellectual: "Praktisk", social: "Harmonisk", lifestyle: "Spontan"
  },

  // STRATEGER (NT) - Blå färgkodning
  {
    type: "ENTJ", name: "Kommandören", category: "Strateger",
    color: "bg-gradient-to-br from-blue-500 to-blue-600", icon: Target,
    description: "Visionära ledare som bygger system och når ambitiösa mål.",
    emotional: "Utåtriktad", intellectual: "Intuitiv", social: "Beslutsam", lifestyle: "Organiserad"
  },
  {
    type: "ENTP", name: "Debattören", category: "Strateger",
    color: "bg-gradient-to-br from-blue-400 to-blue-500", icon: Lightbulb,
    description: "Smarta innovatörer som älskar intellektuella utmaningar.",
    emotional: "Utåtriktad", intellectual: "Intuitiv", social: "Utmanande", lifestyle: "Flexibel"
  },
  {
    type: "INTJ", name: "Arkitekten", category: "Strateger",
    color: "bg-gradient-to-br from-blue-600 to-blue-700", icon: Brain,
    description: "Oberoende strateger med långsiktig vision.",
    emotional: "Inåtriktad", intellectual: "Intuitiv", social: "Oberoende", lifestyle: "Målmedveten"
  },
  {
    type: "INTP", name: "Tänkaren", category: "Strateger",
    color: "bg-gradient-to-br from-blue-500 to-purple-500", icon: Brain,
    description: "Innovativa tänkare som söker att förstå universum.",
    emotional: "Inåtriktad", intellectual: "Intuitiv", social: "Objektiv", lifestyle: "Flexibel"
  }
];

interface PersonalityTestProps {
  onComplete: (result: any) => void;
}

export function PersonalityTest({ onComplete }: PersonalityTestProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [showResult, setShowResult] = useState(false);
  const [personalityResult, setPersonalityResult] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { trackPersonalityTestStart, trackPersonalityTestComplete } = useAnalytics();

  useEffect(() => {
    // Track test start
    trackPersonalityTestStart('current-user');
  }, [trackPersonalityTestStart]);

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswer = (value: number) => {
    const newAnswers = { ...answers, [questions[currentQuestion].id]: value };
    setAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResult();
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // STEG 1 - Beräkna personlighetstyp enligt 5 dimensioner
  const calculateResult = async () => {
    setIsSubmitting(true);
    
    try {
      // Räkna poäng per dimension
      const scores = {
        E: 0, I: 0,
        S: 0, N: 0,
        T: 0, F: 0,
        J: 0, P: 0,
        A: 0, T_turbulent: 0
      };

      // Sammanräkna poäng per dimension
      questions.forEach(question => {
        const answer = answers[question.id] || 3; // Default middle value
        scores[question.dimension] += answer;
      });

      // Bestäm dominant dimension i varje kategori (den med högst poäng vinner)
      const personalityType = 
        (scores.E > scores.I ? 'E' : 'I') +
        (scores.S > scores.N ? 'S' : 'N') +
        (scores.T > scores.F ? 'T' : 'F') +
        (scores.J > scores.P ? 'J' : 'P');
      
      const assertiveness = scores.A > scores.T_turbulent ? 'A' : 'T';

      // Hitta matchande arketyp
      const archetype = archetypes.find(a => a.type === personalityType) || archetypes[0];

      // STEG 2 - Skapa resultat med kategori
      const result = {
        type: personalityType,
        name: archetype.name,
        category: archetype.category,
        assertiveness: assertiveness,
        fullType: personalityType + '-' + assertiveness,
        scores: scores,
        description: archetype.description,
        emotional: archetype.emotional,
        intellectual: archetype.intellectual,
        social: archetype.social,
        lifestyle: archetype.lifestyle,
        color: archetype.color,
        icon: archetype.icon,
        dimensionStrengths: {
          social: scores.E > scores.I ? 'Utåtriktad energi' : 'Inåtriktad reflektion',
          information: scores.S > scores.N ? 'Praktisk fokus' : 'Intuitiv vision',
          decisions: scores.T > scores.F ? 'Logisk analys' : 'Värdebaserat',
          structure: scores.J > scores.P ? 'Strukturerad approach' : 'Flexibel anpassning',
          confidence: assertiveness === 'A' ? 'Självsäker' : 'Utvecklingsinriktad'
        }
      };

      setPersonalityResult(result);
      setShowResult(true);

      // Track test completion
      trackPersonalityTestComplete('current-user', result);
      
      console.log('✅ MÄÄK Personlighetstest slutförd:', result);
    } catch (error) {
      console.error('Failed to calculate personality result:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleComplete = () => {
    console.log('[PERSONALITY TEST] handleComplete anropad med resultat:', personalityResult);
    onComplete(personalityResult);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'social': return Users;
      case 'information': return Eye;
      case 'decisions': return Scale;
      case 'structure': return Clock;
      case 'confidence': return Target;
      default: return Brain;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'social': return 'from-blue-500 to-blue-600';
      case 'information': return 'from-green-500 to-green-600';
      case 'decisions': return 'from-purple-500 to-purple-600';
      case 'structure': return 'from-orange-500 to-orange-600';
      case 'confidence': return 'from-red-500 to-red-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  if (showResult && personalityResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="max-w-md mx-auto p-6">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-4 shadow-lg">
              {personalityResult.type}
            </div>
            <h1 className="text-2xl font-bold mb-2">Din Personlighetstyp</h1>
            <p className="text-gray-600">MÄÄK Smart Matchning aktiverad</p>
          </div>

          {/* Main Result Card */}
          <Card className="mb-6 bg-white/90 backdrop-blur-sm shadow-xl border-0 rounded-[25px]">
            <CardContent className="p-6">
              {/* Archetype med färgkodning enligt STEG 2 */}
              <div className={`bg-gradient-to-r ${personalityResult.color.replace('bg-gradient-to-br', '')} p-6 rounded-[20px] text-white mb-6`}>
                <div className="text-center">
                  <personalityResult.icon className="w-12 h-12 mx-auto mb-3" />
                  <h2 className="text-2xl font-bold mb-1">{personalityResult.name}</h2>
                  <Badge className="bg-white/20 text-white border-0 mb-3">
                    {personalityResult.category}
                  </Badge>
                  <p className="text-sm opacity-90 leading-relaxed">
                    {personalityResult.description}
                  </p>
                </div>
              </div>

              {/* STEG 2 - 4 Archetyp-dimensioner */}
              <div className="space-y-3 mb-6">
                <h3 className="font-semibold text-center mb-4">Dina 4 Arketyper</h3>
                
                <div className="grid grid-cols-1 gap-3">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Emotionell:</span>
                      <span className="text-sm text-blue-700 font-semibold">{personalityResult.emotional}</span>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Intellektuell:</span>
                      <span className="text-sm text-green-700 font-semibold">{personalityResult.intellectual}</span>
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Social:</span>
                      <span className="text-sm text-purple-700 font-semibold">{personalityResult.social}</span>
                    </div>
                  </div>
                  
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Livsstil:</span>
                      <span className="text-sm text-orange-700 font-semibold">{personalityResult.lifestyle}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* STEG 3 - Smart Matchning Preview */}
              <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-4 rounded-lg mb-6">
                <h4 className="font-semibold mb-2 text-center">🎯 Smart Matchning Aktiverad</h4>
                <p className="text-sm text-gray-700 text-center">
                  MÄÄK kommer nu att hitta kompatibla profiler baserat på både likhet och komplement för optimal {personalityResult.category.toLowerCase()}-kompatibilitet.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Action Button */}
          <Button
            className="w-full h-14 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white rounded-[25px] shadow-lg font-semibold"
            onClick={handleComplete}
          >
            Starta MÄÄK Matchning
          </Button>

          <p className="text-center text-xs text-gray-500 mt-4">
            Baserat på 30 frågor och 5 personlighetsdimensioner enligt MÄÄK-algoritmen
          </p>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const CategoryIcon = getCategoryIcon(currentQ.category);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="max-w-md mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4 shadow-lg">
            <Brain className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold mb-2">MÄÄK Personlighetstest</h1>
          <p className="text-gray-600 text-sm">30 frågor • 5 dimensioner • Smart matchning</p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">
              Fråga {currentQuestion + 1} av {questions.length}
            </span>
            <span className="text-sm font-semibold text-primary">
              {Math.round(progress)}%
            </span>
          </div>
          <Progress value={progress} className="h-3 rounded-full" />
        </div>

        {/* Question Card */}
        <Card className="mb-8 bg-white/90 backdrop-blur-sm shadow-xl border-0 rounded-[25px]">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-center mb-4">
              <div className={`w-12 h-12 bg-gradient-to-r ${getCategoryColor(currentQ.category)} rounded-full flex items-center justify-center text-white`}>
                <CategoryIcon className="w-6 h-6" />
              </div>
            </div>
            <Badge className="mx-auto bg-gray-100 text-gray-700">
              {currentQ.category === 'social' ? 'Social energi' :
               currentQ.category === 'information' ? 'Informationsbearbetning' :
               currentQ.category === 'decisions' ? 'Beslutsfattande' :
               currentQ.category === 'structure' ? 'Livsstil & struktur' :
               'Självförtroende'}
            </Badge>
          </CardHeader>
          
          <CardContent>
            <h3 className="text-lg font-medium text-center mb-6 leading-relaxed">
              {currentQ.text}
            </h3>

            {/* Likert Scale (1-5) */}
            <div className="space-y-4">
              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>Instämmer inte alls</span>
                <span>Instämmer helt</span>
              </div>
              
              <div className="flex justify-between items-center px-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <Button
                    key={value}
                    variant={answers[currentQ.id] === value ? "default" : "outline"}
                    className={`w-12 h-12 rounded-full font-semibold transition-all duration-200 ${
                      answers[currentQ.id] === value 
                        ? `bg-gradient-to-r ${getCategoryColor(currentQ.category)} text-white` 
                        : 'border-2 border-gray-200 hover:border-primary'
                    }`}
                    onClick={() => handleAnswer(value)}
                  >
                    {value}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test button för utveckling */}
        {process.env.NODE_ENV === 'development' && Object.keys(answers).length === 0 && (
          <div className="mb-4">
            <Button 
              variant="outline"
              onClick={() => {
                console.log('[PERSONALITY TEST] Fyller i slumpmässiga svar...');
                const testAnswers: { [key: number]: number } = {};
                questions.forEach(q => {
                  testAnswers[q.id] = Math.floor(Math.random() * 5) + 1;
                });
                setAnswers(testAnswers);
                console.log('[PERSONALITY TEST] Testdata ifylld, hoppar till slutet...');
                setCurrentQuestion(questions.length - 1);
              }}
              className="w-full rounded-[25px] border-2 border-blue-300 text-blue-600"
            >
              🧪 Fyll i slumpmässiga testsvar
            </Button>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between gap-4">
          <Button
            variant="outline"
            onClick={prevQuestion}
            disabled={currentQuestion === 0}
            className="flex-1 h-12 rounded-[25px] border-2 border-gray-300"
          >
            Föregående
          </Button>
          
          <Button
            onClick={nextQuestion}
            disabled={!answers[currentQ.id] || isSubmitting}
            className="flex-1 h-12 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white rounded-[25px] shadow-lg font-semibold"
          >
            {currentQuestion === questions.length - 1 
              ? (isSubmitting ? 'Beräknar...' : 'Slutför test')
              : 'Nästa'
            }
          </Button>
        </div>

        {/* Progress indicator */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            Kategori: {currentQ.category === 'social' ? 'Social energi' :
                      currentQ.category === 'information' ? 'Informationsbearbetning' :
                      currentQ.category === 'decisions' ? 'Beslutsfattande' :
                      currentQ.category === 'structure' ? 'Livsstil & struktur' :
                      'Självförtroende'}
          </p>
        </div>
      </div>
    </div>
  );
}