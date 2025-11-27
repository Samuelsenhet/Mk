import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Sparkles, Send, RefreshCw, MessageCircle } from "lucide-react";
import { ThreeDRobot } from "./ThreeDRobot";

interface IcebreakerSuggestion {
  type: "question" | "comment" | "compliment";
  text: string;
  context: string;
}

const generateIcebreakers = (profileData: any, userPersonality: any): IcebreakerSuggestion[] => {
  const archetypeBasedIcebreakers: { [key: string]: IcebreakerSuggestion[] } = {
    // Diplomater (Djup och mening)
    "Författaren": [
      {
        type: "question",
        text: "Som Författare ser jag att du inspirerar andra. Vad fick dig att välja din nuvarande väg i livet?",
        context: "Baserat på din Författare-archetype som värdesätter inspiration och personlig tillväxt"
      },
      {
        type: "comment",
        text: "Din profil visar verkligen Författarens karisma! Jag kan föreställa mig att du hjälper många människor att blomstra.",
        context: "Erkänner din naturliga ledarskapsförmåga som Författare"
      }
    ],
    "Entusiasten": [
      {
        type: "question", 
        text: "Som Entusiast märker jag din kreativa energi! Vilket är ditt senaste spontana äventyr?",
        context: "Baserat på Entusiastens kärlek till spontanitet och nya upplevelser"
      },
      {
        type: "compliment",
        text: "Din Entusiast-energi lyser igenom profilen! Du verkar vara typen som får alla att skratta.",
        context: "Uppskattar Entusiastens förmåga att sprida glädje"
      }
    ],
    "Rådgivaren": [
      {
        type: "question",
        text: "Som Rådgivare verkar du ha djup insikt. Vad tror du är nyckeln till äkta förbindelser?",
        context: "Erkänner Rådgivarens visdom och djupa förståelse"
      },
      {
        type: "comment",
        text: "Jag känner igen Rådgivarens reflektion i din profil. Du verkar se människor på riktigt djupet.",
        context: "Uppskattar Rådgivarens intuitiva förmågor"
      }
    ],
    "Idealisten": [
      {
        type: "question",
        text: "Som Idealist märker jag dina starka värderingar. Vilket är det viktigaste för dig i en relation?",
        context: "Baserat på Idealistens fokus på autenticitet och värderingar"
      },
      {
        type: "compliment",
        text: "Din Idealist-själ skiner igenom! Du verkar vara någon som verkligen står för det du tror på.",
        context: "Uppskattar Idealistens äkthet och principfasthet"
      }
    ],

    // Byggare (Trygghet och stabilitet)
    "Administratören": [
      {
        type: "question",
        text: "Som Administratör imponeras jag av din organisationsförmåga. Vad är din bästa effektivitetstips?",
        context: "Erkänner Administratörens naturliga ledarskap och struktur"
      },
      {
        type: "comment",
        text: "Jag känner igen Administratörens pålitlighet i din profil. Du verkar vara typen man kan lita på 100%.",
        context: "Uppskattar Administratörens stabilitet"
      }
    ],
    "Vårdaren": [
      {
        type: "question",
        text: "Som Vårdare ser jag din omtanke. Vad är din favoritväg att visa omsorg för människor du bryr dig om?",
        context: "Baserat på Vårdarens naturliga empati och omtanke"
      },
      {
        type: "compliment",
        text: "Din Vårdare-värme lyser igenom profilen! Du verkar skapa trygghet överallt du går.",
        context: "Uppskattar Vårdarens förmåga att ge omsorg"
      }
    ],
    "Specialisten": [
      {
        type: "question",
        text: "Som Specialist uppskattar jag din grundlighet. Vad har du blivit riktigt expert på genom åren?",
        context: "Erkänner Specialistens djupa kunskap och tålmodighet"
      },
      {
        type: "comment",
        text: "Jag känner igen Specialistens kvalitetstänk. Du verkar vara typen som gör saker rätt från början.",
        context: "Uppskattar Specialistens metodiska approach"
      }
    ],
    "Beskyddaren": [
      {
        type: "question",
        text: "Som Beskyddare ser jag din omtänksamhet. Vad inspirerar dig mest att hjälpa andra?",
        context: "Baserat på Beskyddarens vilja att stötta och skydda"
      },
      {
        type: "compliment",
        text: "Din Beskyddare-själ skiner igenom! Du verkar vara typen som alltid finns där för sina vänner.",
        context: "Uppskattar Beskyddarens lojalitet och stöd"
      }
    ],

    // Upptäckare (Spontanitet och äventyr)
    "Entreprenören": [
      {
        type: "question",
        text: "Som Entreprenör känner jag din energi! Vilket är ditt bästa spontana äventyr hittills?",
        context: "Baserat på Entreprenörens kärlek till action och spontanitet"
      },
      {
        type: "comment",
        text: "Jag känner igen Entreprenörens 'live in the moment'-attityd. Du verkar vara redo för vad som helst!",
        context: "Uppskattar Entreprenörens spontanitet"
      }
    ],
    "Underhållaren": [
      {
        type: "question",
        text: "Som Underhållare märker jag din glädje! Vad är ditt bästa sätt att få folk att skratta?",
        context: "Baserat på Underhållarens förmåga att sprida glädje"
      },
      {
        type: "compliment",
        text: "Din Underhållare-spirit lyser upp! Du verkar vara typen som gör alla fester roligare.",
        context: "Uppskattar Underhållarens förmåga att underhålla"
      }
    ],
    "Äventyraren": [
      {
        type: "question",
        text: "Som Äventyrare respekterar jag din frihet. Vilket äventyr har format dig mest som person?",
        context: "Erkänner Äventyrarens behov av frihet och utmaning"
      },
      {
        type: "comment",
        text: "Jag känner igen Äventyrarens oberoendehet. Du verkar vara typen som klarar vad som helst!",
        context: "Uppskattar Äventyrarens praktiska kompetens"
      }
    ],
    "Konstnären": [
      {
        type: "question",
        text: "Som Konstnär ser jag din kreativitet. Vad inspirerar dig mest i ditt konstnärliga uttryck?",
        context: "Baserat på Konstnärens kreativa själ och känsla för skönhet"
      },
      {
        type: "compliment",
        text: "Din Konstnär-själ skiner igenom! Du verkar se skönhet där andra bara ser vardaglighet.",
        context: "Uppskattar Konstnärens artistiska sensibilitet"
      }
    ],

    // Strateger (Tillväxt och innovation)
    "Strategen": [
      {
        type: "question",
        text: "Som Strateg imponeras jag av din visionära tänk. Vad är ditt största mål för framtiden?",
        context: "Erkänner Strategens naturliga ledarskap och långsiktiga tänk"
      },
      {
        type: "comment",
        text: "Jag känner igen Strategens målstyrdhet. Du verkar vara typen som får saker att hända!",
        context: "Uppskattar Strategens effektivitet och vision"
      }
    ],
    "Innovatören": [
      {
        type: "question",
        text: "Som Innovatör fascineras jag av dina idéer! Vilket är ditt senaste kreativa projekt?",
        context: "Baserat på Innovatörens kärlek till nya idéer och möjligheter"
      },
      {
        type: "compliment",
        text: "Din Innovatör-energi är smittsam! Du verkar vara typen som alltid ser nya möjligheter.",
        context: "Uppskattar Innovatörens kreativitet och entusiasm"
      }
    ],
    "Arkitekten": [
      {
        type: "question",
        text: "Som Arkitekt respekterar jag din strategiska tanke. Vad planerar du för de närmaste åren?",
        context: "Erkänner Arkitektens systematiska approach och framtidsfokus"
      },
      {
        type: "comment",
        text: "Jag känner igen Arkitektens precision i ditt uttryck. Du verkar tänka flera steg framåt!",
        context: "Uppskattar Arkitektens strategiska kompetens"
      }
    ],
    "Forskaren": [
      {
        type: "question",
        text: "Som Forskare uppskattar jag din intellektuella nyfikenhet. Vad fascinerar dig mest just nu?",
        context: "Baserat på Forskarens kärlek till kunskap och förståelse"
      },
      {
        type: "compliment",
        text: "Din Forskare-intellekt skiner igenom! Du verkar vara typen som alltid lär sig något nytt.",
        context: "Uppskattar Forskarens analytiska förmåga"
      }
    ]
  };

  const profileArchetype = profileData.archetype || "Entusiasten";
  const baseIcebreakers = archetypeBasedIcebreakers[profileArchetype] || archetypeBasedIcebreakers["Entusiasten"];
  
  // Add interest-based icebreakers
  const interestIcebreakers: IcebreakerSuggestion[] = [];
  
  if (profileData.interests?.includes("Fotografi")) {
    interestIcebreakers.push({
      type: "question",
      text: "Jag såg att du älskar fotografi! Vilket motiv jagar du efter just nu?",
      context: "Gemensamt intresse för fotografi"
    });
  }
  
  if (profileData.interests?.includes("Resor")) {
    interestIcebreakers.push({
      type: "question",
      text: "Som reseälskare själv - vilket är nästa stopp på din bucket list?",
      context: "Gemensamt intresse för resor"
    });
  }
  
  if (profileData.interests?.includes("Matlagning")) {
    interestIcebreakers.push({
      type: "question",
      text: "Såg att du gillar matlagning! Vad är din signaturrätt?",
      context: "Gemensamt intresse för matlagning"
    });
  }

  // Combine and limit to 3 suggestions
  const allIcebreakers = [...baseIcebreakers, ...interestIcebreakers];
  return allIcebreakers.slice(0, 3);
};

export function AICompanion({ 
  matchProfile,
  userPersonality,
  onSendMessage 
}: { 
  matchProfile: any;
  userPersonality: any;
  onSendMessage: (message: string) => void;
}) {
  const [icebreakers, setIcebreakers] = useState<IcebreakerSuggestion[]>(
    generateIcebreakers(matchProfile, userPersonality)
  );
  const [customMessage, setCustomMessage] = useState("");
  const [selectedIcebreaker, setSelectedIcebreaker] = useState<IcebreakerSuggestion | null>(null);
  const [step, setStep] = useState<"choose" | "review" | "customize">("choose");

  const refreshIcebreakers = () => {
    // Generate fresh archetype-based icebreakers
    const newSuggestions = generateIcebreakers(matchProfile, userPersonality);
    
    // Add some randomized alternatives
    const alternativeIcebreakers = [
      {
        type: "question" as const,
        text: `Som ${userPersonality?.name || 'MÄÄK-användare'} är jag nyfiken - vad motiverar dig mest i vardagen?`,
        context: `Personlighetsmatchning mellan ${userPersonality?.name || 'dig'} och ${matchProfile.archetype}`
      },
      {
        type: "comment" as const,
        text: `Jag märkte att vi båda är från samma område! Har du hittat några dolda pärlor här i närheten?`,
        context: "Geografisk närhet och lokala upptäckter"
      },
      {
        type: "compliment" as const,
        text: `Din ${matchProfile.archetype}-energi kombinerat med [specifikt intresse] är verkligen attraktivt!`,
        context: `Uppskattar kombinationen av archetype och intressen`
      }
    ];
    
    // Mix new suggestions with alternatives
    const mixedSuggestions = [...newSuggestions.slice(0, 2), ...alternativeIcebreakers.slice(0, 1)];
    setIcebreakers(mixedSuggestions);
  };

  const handleSelectIcebreaker = (icebreaker: IcebreakerSuggestion) => {
    setSelectedIcebreaker(icebreaker);
    setCustomMessage(icebreaker.text);
    setStep("review");
  };

  const handleSendMessage = () => {
    if (customMessage.trim()) {
      onSendMessage(customMessage);
    }
  };

  if (step === "review" && selectedIcebreaker) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
        {/* 3D Robot Background */}
        <div className="absolute inset-0 z-0">
          <ThreeDRobot className="w-full h-full opacity-90" />
        </div>
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/80 to-white/90 z-10"></div>
        
        <div className="max-w-md mx-auto p-6 relative z-20">
          <div className="mb-4 pt-16">
            <Button 
              variant="ghost" 
              onClick={() => setStep("choose")}
              className="mb-4 bg-white/80 backdrop-blur-sm"
            >
              ← Tillbaka till förslag
            </Button>
          </div>

          <Card className="mb-6 bg-white/90 backdrop-blur-sm shadow-xl border-0">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-primary" />
                Granska ditt meddelande
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600 mb-2 block">Ditt meddelande till {matchProfile.name}</label>
                  <Textarea
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    className="min-h-[100px]"
                    placeholder="Skriv ditt meddelande här..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {customMessage.length}/500 tecken
                  </p>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg">
                  <h4 className="text-sm font-medium mb-1">AI-tips:</h4>
                  <p className="text-xs text-gray-600">
                    {selectedIcebreaker.context}
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setStep("choose")}
                  >
                    Ändra meddelande
                  </Button>
                  <Button 
                    className="flex-1 bg-primary hover:bg-primary/90"
                    onClick={handleSendMessage}
                    disabled={!customMessage.trim()}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Skicka
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
      {/* 3D Robot Background enligt bild 3 */}
      <div className="absolute inset-0 z-0">
        <ThreeDRobot className="w-full h-full opacity-90" />
      </div>
      
      {/* Gradient overlay för bättre läsbarhet */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/80 to-white/90 z-10"></div>
      
      <div className="max-w-md mx-auto p-6 relative z-20">
        {/* AI Companion Header enligt bild 3 */}
        <div className="text-center mb-8 pt-16">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Your ✨ AI
          </h1>
          <h2 className="text-2xl font-medium text-gray-600 mb-4">
            Companion for
          </h2>
          <h3 className="text-2xl font-bold text-gray-800">
            Everyday
          </h3>
          
          {/* Robot Speech Bubble som i bild 3 */}
          <div className="relative mt-8 mb-6">
            <div className="bg-white rounded-2xl px-4 py-3 shadow-lg inline-block relative">
              <p className="text-sm font-medium text-gray-800">
                Hey there! 👋 Need a boost?
              </p>
              {/* Speech bubble tail */}
              <div className="absolute bottom-0 left-6 transform translate-y-full">
                <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white"></div>
              </div>
            </div>
          </div>
        </div>

      <Card className="mb-6 bg-white/90 backdrop-blur-sm shadow-xl border-0">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-primary" />
            AI Isbrytare
          </CardTitle>
          <p className="text-sm text-gray-600">
            Personliga förslag baserat på era gemensamma intressen och personligheter
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-primary text-white text-xs">AI</AvatarFallback>
              </Avatar>
              <span className="text-sm">MÄÄK AI Coach</span>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={refreshIcebreakers}
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-3 rounded-lg mb-4">
            <p className="text-sm text-gray-700">
              Baserat på att ni båda är <strong>{userPersonality?.name}</strong> och 
              har gemensamma intressen som <strong>fotografi</strong> och <strong>resor</strong>,
              här är mina förslag:
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3 mb-6">
        {icebreakers.map((icebreaker, index) => (
          <Card 
            key={index}
            className="cursor-pointer hover:shadow-md transition-shadow border-l-4 bg-white/90 backdrop-blur-sm"
            style={{
              borderLeftColor: 
                icebreaker.type === "question" ? "#FF6B6B" :
                icebreaker.type === "comment" ? "#4ECDC4" : "#9B5DE5"
            }}
            onClick={() => handleSelectIcebreaker(icebreaker)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <Badge 
                  variant="secondary"
                  className={
                    icebreaker.type === "question" ? "bg-red-100 text-red-700" :
                    icebreaker.type === "comment" ? "bg-teal-100 text-teal-700" :
                    "bg-purple-100 text-purple-700"
                  }
                >
                  {icebreaker.type === "question" ? "Fråga" :
                   icebreaker.type === "comment" ? "Kommentar" : "Komplimang"}
                </Badge>
                <MessageCircle className="w-4 h-4 text-gray-400" />
              </div>
              
              <p className="text-sm text-gray-800 mb-2 leading-relaxed">
                "{icebreaker.text}"
              </p>
              
              <p className="text-xs text-gray-500">
                {icebreaker.context}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-white/90 backdrop-blur-sm">
        <CardContent className="p-4">
          <h4 className="text-sm font-medium mb-2">Eller skriv ditt eget meddelande</h4>
          <Textarea
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            placeholder="Skriv något personligt..."
            className="mb-3"
          />
          <Button 
            className="w-full bg-primary hover:bg-primary/90"
            onClick={handleSendMessage}
            disabled={!customMessage.trim()}
          >
            <Send className="w-4 h-4 mr-2" />
            Skicka meddelande
          </Button>
        </CardContent>
      </Card>

      {/* Bottom control buttons enligt bild 3 */}
      <div className="flex justify-center items-center mt-8 space-x-8">
        <Button 
          variant="ghost" 
          size="lg"
          className="w-16 h-16 rounded-full bg-gray-800 text-white hover:bg-gray-700 flex items-center justify-center"
        >
          <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
            <span className="text-gray-800 text-xs">📅</span>
          </div>
        </Button>
        
        {/* Central circular button med animering */}
        <div className="relative">
          <Button 
            variant="ghost"
            size="lg"
            className="w-20 h-20 rounded-full border-4 border-blue-200 bg-transparent hover:bg-blue-50 flex items-center justify-center"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center animate-pulse">
              <div className="w-8 h-8 rounded-full bg-white/30"></div>
            </div>
          </Button>
          
          {/* Animerad ring omkring knappen */}
          <div className="absolute inset-0 rounded-full border-2 border-blue-300 animate-ping opacity-30"></div>
        </div>
        
        <Button 
          variant="ghost" 
          size="lg"
          className="w-16 h-16 rounded-full bg-gray-800 text-white hover:bg-gray-700 flex items-center justify-center"
        >
          <div className="flex flex-col space-y-0.5">
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <div className="w-1 h-1 bg-white rounded-full"></div>
          </div>
        </Button>
      </div>

      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500">
          💡 Tips: Personliga meddelanden som visar att du läst profilen får flest svar
        </p>
      </div>
    </div>
    </div>
  );
}