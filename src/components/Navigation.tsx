import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Heart, MessageCircle, Users, User, Sparkles } from "lucide-react";

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  unreadMessages?: number;
}

export function Navigation({ activeTab, onTabChange, unreadMessages = 0 }: NavigationProps) {
  const tabs = [
    {
      id: "matches",
      label: "Matchning",
      icon: Heart,
      description: "Dina matchningar"
    },
    {
      id: "chats",
      label: "Chatt",
      icon: MessageCircle,
      description: "Meddelanden",
      badge: unreadMessages > 0 ? unreadMessages : undefined
    },
    {
      id: "pairing",
      label: "Community",
      icon: Users,
      description: "Pairing Hub"
    },
    {
      id: "profile",
      label: "Profil",
      icon: User,
      description: "Din profil"
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 max-w-md mx-auto safe-area-bottom">
      <div className="grid grid-cols-4 gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <Button
              key={tab.id}
              variant="ghost"
              className={`flex flex-col items-center justify-center h-14 relative ${
                isActive 
                  ? "text-primary bg-primary/5" 
                  : "text-gray-600 hover:text-gray-800"
              }`}
              onClick={() => onTabChange(tab.id)}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? "text-primary" : ""}`} />
                {tab.badge && (
                  <Badge 
                    className="absolute -top-2 -right-2 w-5 h-5 p-0 bg-red-500 text-white text-xs flex items-center justify-center"
                  >
                    {tab.badge > 9 ? "9+" : tab.badge}
                  </Badge>
                )}
              </div>
              <span className={`text-xs mt-1 ${
                isActive ? "text-primary font-medium" : "text-gray-500"
              }`}>
                {tab.label}
              </span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}