// Mock data exakt enligt Figma-fixarna
export const mockData = {
  // Exakt "Emma L"-exempel från Figma-fix
  matches: [
    {
      id: "1",
      name: 'Emma L',
      age: 26,
      location: 'Täby',
      mainArchetype: 'Diplomat, INFP',
      archetypes: [
        'Emotionell: Vårdande',
        'Intellektuell: Analytisk', 
        'Fysisk: Äventyrlig',
        'Andlig: Visionär'
      ],
      bio: 'Älskar att upptäcka nya ställen och träffa intressanta människor.',
      photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b372?w=300',
      interests: ['Resor', 'Fotografi', 'Konst'],
      prompt: 'Mitt favoritminne? En spontan roadtrip. Vad är ditt?'
    },
    // 4 fler för 5 dagliga matches
    {
      id: "2",
      name: 'Lisa M',
      age: 24,
      location: 'Stockholm',
      mainArchetype: 'Upptäckare, ESFP',
      archetypes: [
        'Emotionell: Spontan',
        'Intellektuell: Kreativ',
        'Fysisk: Aktiv', 
        'Andlig: Jordnära'
      ],
      bio: 'Dansar genom livet med glädje och energi.',
      photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300',
      interests: ['Dans', 'Musik', 'Festival']
    },
    {
      id: "3", 
      name: 'Anna K',
      age: 28,
      location: 'Göteborg',
      mainArchetype: 'Byggare, ESTJ',
      archetypes: [
        'Emotionell: Stabil',
        'Intellektuell: Praktisk',
        'Fysisk: Disciplinerad',
        'Andlig: Traditionell'
      ],
      bio: 'Gillar struktur men också spontana äventyr.',
      photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300',
      interests: ['Ledarskap', 'Träning', 'Resor']
    },
    {
      id: "4",
      name: 'Sara J',
      age: 27,
      location: 'Malmö', 
      mainArchetype: 'Strateg, INTJ',
      archetypes: [
        'Emotionell: Analytisk',
        'Intellektuell: Visionär',
        'Fysisk: Fokuserad',
        'Andlig: Filosofisk'
      ],
      bio: 'Tänker djupt och planerar för framtiden.',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
      interests: ['Filosofi', 'Teknik', 'Läsning']
    },
    {
      id: "5",
      name: 'Maria R',
      age: 25,
      location: 'Uppsala',
      mainArchetype: 'Diplomat, ENFJ',
      archetypes: [
        'Emotionell: Empatisk',
        'Intellektuell: Inspirerande', 
        'Fysisk: Energisk',
        'Andlig: Vägledande'
      ],
      bio: 'Hjälper andra att blomstra och växa.',
      photo: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=300',
      interests: ['Coaching', 'Psykologi', 'Yoga']
    }
  ],

  // Para ihop-data för PairingHub  
  pairing: {
    left: {
      id: "p1",
      name: 'Emma L',
      age: 26,
      location: 'Täby',
      mainArchetype: 'Diplomat, INFP',
      archetypes: [
        'Emotionell: Vårdande',
        'Intellektuell: Analytisk',
        'Fysisk: Äventyrlig', 
        'Andlig: Visionär'
      ],
      photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b372?w=300'
    },
    right: {
      id: "p2", 
      name: 'Alex T',
      age: 29,
      location: 'Uppsala',
      mainArchetype: 'Byggare, ESTP',
      archetypes: [
        'Emotionell: Stabil',
        'Intellektuell: Praktisk',
        'Fysisk: Aktiv',
        'Andlig: Jordnära'
      ],
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300'
    }
  },

  // Kategorier för pills
  categories: ['Likhetsmatch', 'Motsatsmatch'],
  
  // Archetype-färger
  archetypeColors: {
    'Diplomat': '#A8E6CF',
    'Byggare': '#FFD3E0', 
    'Upptäckare': '#FFEAA7',
    'Strateg': '#DDA0DD'
  }
};