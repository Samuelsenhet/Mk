import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { sessionlessAuth } from "../utils/auth-sessionless";
import { ArrowLeft, AlertCircle, Apple, Mail } from "lucide-react";

interface AuthScreensProps {
  mode: "login" | "signup";
  onSuccess: (user: any, session: any) => void;
  onBack: () => void;
  onSwitchMode: (mode: "login" | "signup") => void;
}

type AuthStep = "method-selection" | "phone-input" | "phone-verification" | "email-verification" | "verification-problems";

export function AuthScreens({ mode, onSuccess, onBack, onSwitchMode }: AuthScreensProps) {
  const [step, setStep] = useState<AuthStep>("method-selection");
  const [selectedMethod, setSelectedMethod] = useState<"apple" | "google" | "phone" | "">("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+46");
  const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDemoMode, setIsDemoMode] = useState(false);

  const handleMethodSelection = () => {
    if (!selectedMethod) {
      setError("Välj ett inloggningssätt");
      return;
    }

    if (selectedMethod === "apple" || selectedMethod === "google") {
      handleSocialLogin(selectedMethod);
    } else if (selectedMethod === "phone") {
      setStep("phone-input");
    }
  };

  const handleSocialLogin = async (provider: "google" | "apple") => {
    setLoading(true);
    setError("");

    try {
      // For now, use phone method instead of social login to avoid provider errors
      setError("Social inloggning är inte tillgänglig än. Vänligen använd telefonnummer.");
      setSelectedMethod("phone");
      setTimeout(() => {
        setStep("phone-input");
        setError("");
      }, 2000);
    } catch (error) {
      setError("Inloggning misslyckades");
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneSubmit = async () => {
    if (!phoneNumber.trim()) {
      setError("Telefonnummer krävs");
      return;
    }

    if (phoneNumber.length < 7) {
      setError("Ogiltigt telefonnummer");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await sessionlessAuth.loginWithPhone(`${countryCode}${phoneNumber}`);
      
      if (result.success) {
        // Check if we're in demo mode or immediate login
        if (result.isDemo || result.user) {
          console.log('🎭 Sessionless auth: immediate login for:', phoneNumber);
          if (result.user && result.session) {
            onSuccess(result.user, result.session);
            return;
          }
          setIsDemoMode(true);
        } else {
          console.log('📱 SMS skickat till:', phoneNumber);
        }
        setStep("phone-verification");
      } else {
        setError(result.error || "Kunde inte skicka SMS");
      }
    } catch (error) {
      console.error('Phone authentication error:', error);
      setError("SMS kunde inte skickas. Auto error recovery försökte korrigera detta.");
    } finally {
      setLoading(false);
    }
  };

  const handleCodeInput = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }

    // Auto-submit when all digits entered
    if (newCode.every(digit => digit !== "") && index === 5) {
      handleVerificationSubmit(newCode.join(""));
    }
  };

  const handleVerificationSubmit = async (code: string) => {
    setLoading(true);
    setError("");

    try {
      const result = await sessionlessAuth.verifyOTP(`${countryCode}${phoneNumber}`, code);
      
      if (result.success && result.user && result.session) {
        console.log('✅ OTP verification successful with sessionless auth');
        onSuccess(result.user, result.session);
      } else {
        setError(result.error || "Felaktig verifieringskod");
      }
    } catch (error) {
      setError("Verifiering misslyckades (auto error recovery försökte korrigera)");
    } finally {
      setLoading(false);
    }
  };

  const formatPhoneDisplay = () => {
    if (!phoneNumber) return `${countryCode} `;
    
    const formatted = phoneNumber.replace(/(\d{3})(\d{2})(\d{2})(\d{2})/, "$1 $2 $3 $4");
    return `${countryCode} ${formatted}`;
  };

  // Method Selection Screen
  if (step === "method-selection") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 p-6">
        <div className="max-w-md mx-auto">
          <div className="mb-6">
            <Button variant="ghost" onClick={onBack} className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Tillbaka
            </Button>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-[25px] shadow-xl border border-white/20 overflow-hidden">
            <div className="text-center p-6 pb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-[25px] flex items-center justify-center text-white text-3xl mx-auto mb-6 shadow-lg">
                M
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                {mode === "login" ? "Logga in på MÄÄK" : "Skapa konto på MÄÄK"}
              </h2>
              <p className="text-gray-600">
                Välj ditt inloggningssätt
              </p>
            </div>

            <div className="px-6 pb-6 space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-[25px] p-4 flex items-center space-x-3">
                  <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod}>
                <div className="space-y-3">
                  <div className={`flex items-center space-x-4 p-4 rounded-[25px] border-2 transition-all duration-200 cursor-pointer ${
                    selectedMethod === "apple" 
                      ? "border-primary bg-primary/5 shadow-md" 
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}>
                    <RadioGroupItem value="apple" id="apple" className="border-2" />
                    <Label htmlFor="apple" className="flex items-center flex-1 cursor-pointer font-medium">
                      <Apple className="w-6 h-6 mr-3 text-gray-700" />
                      {mode === "login" ? "Logga in med Apple" : "Registrera med Apple"}
                    </Label>
                  </div>

                  <div className={`flex items-center space-x-4 p-4 rounded-[25px] border-2 transition-all duration-200 cursor-pointer ${
                    selectedMethod === "google" 
                      ? "border-primary bg-primary/5 shadow-md" 
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}>
                    <RadioGroupItem value="google" id="google" className="border-2" />
                    <Label htmlFor="google" className="flex items-center flex-1 cursor-pointer font-medium">
                      <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      {mode === "login" ? "Logga in med Google" : "Registrera med Google"}
                    </Label>
                  </div>

                  <div className={`flex items-center space-x-4 p-4 rounded-[25px] border-2 transition-all duration-200 cursor-pointer ${
                    selectedMethod === "phone" 
                      ? "border-primary bg-primary/5 shadow-md" 
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}>
                    <RadioGroupItem value="phone" id="phone" className="border-2" />
                    <Label htmlFor="phone" className="flex items-center flex-1 cursor-pointer font-medium">
                      <Mail className="w-6 h-6 mr-3 text-gray-700" />
                      {mode === "login" ? "Logga in med telefonnummer" : "Registrera med telefonnummer"}
                    </Label>
                  </div>
                </div>
              </RadioGroup>

              <Button 
                className="w-full h-14 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white rounded-[25px] shadow-lg font-semibold tracking-wide transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                onClick={handleMethodSelection}
                disabled={loading || !selectedMethod}
              >
                {loading ? "Laddar..." : "Fortsätt"}
              </Button>

              <div className="text-center mt-6">
                <p className="text-gray-600 text-sm">
                  {mode === "login" ? "Har du inget konto än?" : "Har du redan ett konto?"}
                </p>
                <Button
                  variant="ghost"
                  className="text-primary font-semibold mt-1 rounded-[25px]"
                  onClick={() => onSwitchMode(mode === "login" ? "signup" : "login")}
                >
                  {mode === "login" ? "Skapa ett konto" : "Logga in här"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Phone Input Screen
  if (step === "phone-input") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 p-6">
        <div className="max-w-md mx-auto">
          <div className="mb-6">
            <Button variant="ghost" onClick={() => setStep("method-selection")} className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Tillbaka
            </Button>
          </div>

          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-primary">
                Vad har du för telefonnummer?
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <div>
                  <Label htmlFor="countryCode">Landskod</Label>
                  <Input
                    id="countryCode"
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="rounded-[10px] border-gray-300"
                    disabled={loading}
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Telefonnummer</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Ditt telefonnummer"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                    className="rounded-[10px] border-gray-300"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="bg-blue-50 border-2 border-blue-200 rounded-[25px] p-4">
                <p className="text-sm text-blue-800 mb-2 font-semibold">
                  🚀 Demo-läge aktiverat
                </p>
                <p className="text-xs text-blue-700 mb-2">
                  SMS-leverantör är inte konfigurerad för utvecklingsmiljön. Använd valfritt nummer och koden <span className="font-mono bg-blue-200 px-2 py-1 rounded">123456</span> på nästa steg.
                </p>
                <p className="text-xs text-blue-600">
                  I produktionsläge skickas riktiga SMS med verifieringskoder.
                </p>
              </div>

              <Button 
                className="w-full h-12 bg-primary hover:bg-primary/90 rounded-[25px]"
                onClick={handlePhoneSubmit}
                disabled={loading}
              >
                {loading ? "Skickar SMS..." : "Fortsätt"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Phone Verification Screen
  if (step === "phone-verification") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 p-6">
        <div className="max-w-md mx-auto">
          <div className="mb-6">
            <Button variant="ghost" onClick={() => setStep("phone-input")} className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Tillbaka
            </Button>
          </div>

          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-primary">
                Ange din verifieringskod
              </CardTitle>
              <p className="text-gray-600 text-sm">
                Skickat till {formatPhoneDisplay()} · 
                <Button 
                  variant="link" 
                  className="text-primary p-0 h-auto text-sm ml-1"
                  onClick={() => setStep("phone-input")}
                >
                  Redigera
                </Button>
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex justify-center space-x-3">
                {verificationCode.map((digit, index) => (
                  <Input
                    key={index}
                    id={`code-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeInput(index, e.target.value)}
                    className="w-12 h-12 text-center text-xl rounded-[10px] border-gray-300"
                    disabled={loading}
                  />
                ))}
              </div>

              <div className="text-center">
                <Button 
                  variant="link" 
                  className="text-primary"
                  onClick={() => setStep("verification-problems")}
                >
                  Fick du ingen kod?
                </Button>
              </div>

              <div className={`${isDemoMode ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-50'} rounded-lg p-4 text-center`}>
                {isDemoMode ? (
                  <>
                    <p className="text-sm text-yellow-800 font-medium">
                      🚀 Demo-läge aktiverat
                    </p>
                    <p className="text-xs text-yellow-700 mt-1">
                      SMS-leverantör ej konfigurerad. Använd koden <span className="font-mono bg-yellow-100 px-1 rounded">123456</span> för att fortsätta.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-gray-600">
                      Koden ska komma inom några sekunder
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      För demo-läget: använd koden <span className="font-mono bg-yellow-100 px-1 rounded">123456</span>
                    </p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Verification Problems Screen
  if (step === "verification-problems") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 p-6">
        <div className="max-w-md mx-auto">
          <div className="mb-6">
            <Button variant="ghost" onClick={() => setStep("phone-verification")} className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Tillbaka
            </Button>
          </div>

          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-primary">
                Går det inte att verifiera?
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full h-12 justify-start rounded-[10px]"
                  onClick={() => setStep("phone-verification")}
                >
                  Fick du ingen kod?
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full h-12 justify-start rounded-[10px]"
                  onClick={() => setStep("phone-input")}
                >
                  Redigera telefonnummer
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full h-12 justify-start rounded-[10px]"
                  onClick={handlePhoneSubmit}
                  disabled={loading}
                >
                  {loading ? "Skickar..." : "Skicka kod igen"}
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full h-12 justify-start rounded-[10px] text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => setStep("method-selection")}
                >
                  Avbryt
                </Button>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Tips:</strong> Kontrollera att du har angett rätt telefonnummer och att du har mottagning.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return null;
}