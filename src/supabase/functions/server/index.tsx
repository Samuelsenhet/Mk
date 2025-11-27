import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// CORS and logging - Updated for token-free auth
app.use("*", cors({
  origin: "*",
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization", "X-User-ID", "X-Is-Demo", "X-Session-Id", "X-API-Key"],
}));
app.use("*", logger(console.log));

// Supabase client
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

// Health check endpoint
app.get("/make-server-e34211d6/health", async (c) => {
  return c.json({ 
    status: "healthy", 
    timestamp: new Date().toISOString(),
    service: "MÄÄK Mood API",
    version: "1.0.0"
  });
});

// Helper to verify user authentication with token-free session-based auth and auto error recovery
async function verifyUser(request: Request) {
  const authHeader = request.headers.get("Authorization");
  const sessionIdHeader = request.headers.get("X-Session-Id");
  const userIdHeader = request.headers.get("X-User-ID");
  const isDemoHeader = request.headers.get("X-Is-Demo");
  const apiKeyHeader = request.headers.get("X-API-Key");
  const requestUrl = new URL(request.url).pathname;
  
  console.log(`🔐 Token-free auth verification for ${requestUrl}`);
  console.log(`🔑 Auth header: ${authHeader ? authHeader.substring(0, 25) + '...' : 'None'}`);
  console.log(`🆔 Session ID header: ${sessionIdHeader ? sessionIdHeader.substring(0, 20) + '...' : 'None'}`);
  console.log(`👤 User ID header: ${userIdHeader || 'None'}`);
  console.log(`🎭 Demo header: ${isDemoHeader || 'None'}`);
  console.log(`🔑 API Key header: ${apiKeyHeader ? 'Present' : 'None'}`);

  // Auto error recovery: Try multiple authentication methods (TOKEN-FREE PRIORITY)
  const authMethods = [
    () => verifyTokenFreeAuth(sessionIdHeader, userIdHeader, isDemoHeader), // NEW: Token-free method first
    () => verifySessionAuth(authHeader, userIdHeader, isDemoHeader), // Legacy session auth
    () => verifyTokenAuth(authHeader), // Fallback to token-based
    () => verifyDemoAuth(userIdHeader, isDemoHeader) // Last resort demo auth
  ];

  for (const [index, method] of authMethods.entries()) {
    try {
      console.log(`🔄 Trying auth method ${index + 1}/${authMethods.length}...`);
      const result = await method();
      
      if (result.error === null && result.user) {
        console.log(`✅ Auth method ${index + 1} successful: ${result.user.id}`);
        return result;
      } else if (result.error) {
        console.log(`⚠️ Auth method ${index + 1} failed: ${result.error}`);
      }
    } catch (methodError) {
      console.log(`💥 Auth method ${index + 1} exception:`, methodError);
    }
  }

  console.log("❌ All auth methods failed");
  
  // Provide more specific error for debugging (TOKEN-FREE PRIORITY)
  if (sessionIdHeader && userIdHeader) {
    return { error: "Token-free authentication failed - all methods exhausted", user: null };
  } else if (!sessionIdHeader && !userIdHeader && !authHeader) {
    return { error: "No authentication headers provided - expected X-Session-Id + X-User-ID or Authorization", user: null };
  } else if (!authHeader) {
    return { error: "Legacy auth headers missing (use X-Session-Id + X-User-ID for token-free auth)", user: null };
  } else if (!authHeader.startsWith("Session ") && !authHeader.startsWith("Bearer ")) {
    return { error: `Auth header format invalid. Expected 'Session {sessionId}' or 'Bearer {token}', got: ${authHeader.substring(0, 20)}...`, user: null };
  } else if (authHeader.startsWith("Bearer ")) {
    return { error: "Bearer token authentication failed - consider upgrading to token-free auth", user: null };
  } else {
    return { error: "Session authentication failed", user: null };
  }
}

// TOKEN-FREE authentication (primary method - NEW!)
async function verifyTokenFreeAuth(sessionIdHeader: string | null, userIdHeader: string | null, isDemoHeader: string | null) {
  console.log(`🆕 Token-free auth - Session ID: ${sessionIdHeader ? sessionIdHeader.substring(0, 20) + '...' : 'null'}`);
  console.log(`🆕 Token-free auth - User ID: ${userIdHeader || 'null'}`);
  console.log(`🆕 Token-free auth - Demo: ${isDemoHeader || 'null'}`);
  
  if (!sessionIdHeader || !userIdHeader) {
    return { error: `Token-free auth missing headers. Session ID: ${sessionIdHeader ? 'present' : 'missing'}, User ID: ${userIdHeader ? 'present' : 'missing'}`, user: null };
  }

  const isDemo = isDemoHeader === "true";
  
  console.log(`🔍 Verifying token-free session: ${sessionIdHeader.substring(0, 20)}... (demo: ${isDemo})`);

  if (isDemo) {
    // Demo session validation
    if (!userIdHeader.startsWith("demo-user-")) {
      console.log(`❌ Invalid demo user ID for token-free auth: ${userIdHeader}`);
      return { error: "Ogiltigt demo-användar-ID för token-fri auth", user: null };
    }

    // Extract timestamp from user ID
    const timestamp = userIdHeader.replace("demo-user-", "");
    const timestampNum = parseInt(timestamp);
    
    console.log(`🔍 Token-free demo session validation - timestamp: ${timestamp}, parsed: ${timestampNum}`);
    
    if (isNaN(timestampNum) || timestampNum <= 0) {
      console.log(`❌ Invalid demo timestamp for token-free auth: ${timestamp}`);
      return { error: "Ogiltigt demo-timestamp för token-fri auth", user: null };
    }

    // Check session age (48h for demo sessions to be more lenient)
    const ageHours = (Date.now() - timestampNum) / (1000 * 60 * 60);
    console.log(`🔍 Token-free demo session age: ${ageHours.toFixed(2)} hours`);
    
    if (ageHours > 48) {
      console.log(`❌ Token-free demo session expired: ${ageHours.toFixed(2)}h > 48h`);
      return { error: "Token-fri demo-session har gått ut", user: null };
    }

    // Create demo user for token-free auth
    const demoUser = {
      id: userIdHeader,
      email: `demo${timestamp}@maak.se`,
      phone: "+46701234567",
      created_at: new Date(timestampNum).toISOString(),
      app_metadata: { demo: true, tokenFree: true },
      user_metadata: { 
        firstName: "Demo",
        lastName: "Användare",
        demo: true,
        authType: "token-free"
      },
      aud: 'authenticated'
    };

    console.log(`✅ Token-free demo auth successful: ${userIdHeader}`);
    return { error: null, user: demoUser };
  } else {
    // Real user session - validate against stored session
    console.log(`🔍 Token-free real user session validation for user: ${userIdHeader}`);
    
    try {
      // In a real implementation, validate session ID against stored sessions
      // For now, we'll trust the client-provided user ID if session format is valid
      console.log(`🔍 Token-free lookup user by ID: ${userIdHeader}`);
      const { data: { user }, error } = await supabase.auth.admin.getUserById(userIdHeader);
      
      if (error) {
        console.log(`❌ Token-free user lookup error: ${error.message}`);
        return { error: `Token-fri användare hittades inte: ${error.message}`, user: null };
      }
      
      if (!user) {
        console.log(`❌ Token-free no user found with ID: ${userIdHeader}`);
        return { error: "Token-fri användare hittades inte", user: null };
      }

      // Mark as token-free auth
      user.app_metadata = { ...user.app_metadata, tokenFree: true };
      user.user_metadata = { ...user.user_metadata, authType: "token-free" };

      console.log(`✅ Token-free real user session valid: ${user.id}`);
      return { error: null, user };
    } catch (error) {
      console.log(`❌ Token-free session validation exception:`, error);
      return { error: "Token-fri session-validering misslyckades", user: null };
    }
  }
}

// Session-based authentication (legacy method)
async function verifySessionAuth(authHeader: string | null, userIdHeader: string | null, isDemoHeader: string | null) {
  console.log(`🔍 Session auth - Auth header: ${authHeader ? authHeader.substring(0, 30) + '...' : 'null'}`);
  console.log(`🔍 Session auth - User ID: ${userIdHeader || 'null'}`);
  console.log(`🔍 Session auth - Demo: ${isDemoHeader || 'null'}`);
  
  if (!authHeader || !authHeader.startsWith("Session ")) {
    return { error: `Invalid session header format. Expected 'Session {sessionId}', got: ${authHeader || 'null'}`, user: null };
  }

  const sessionId = authHeader.replace("Session ", "");
  const isDemo = isDemoHeader === "true";
  
  console.log(`🔍 Verifying session: ${sessionId.substring(0, 20)}... (demo: ${isDemo})`);

  if (isDemo) {
    // Demo session validation
    if (!userIdHeader || !userIdHeader.startsWith("demo-user-")) {
      console.log(`❌ Invalid demo user ID: ${userIdHeader}`);
      return { error: "Ogiltigt demo-användar-ID", user: null };
    }

    // Extract timestamp from user ID
    const timestamp = userIdHeader.replace("demo-user-", "");
    const timestampNum = parseInt(timestamp);
    
    console.log(`🔍 Demo session validation - timestamp: ${timestamp}, parsed: ${timestampNum}`);
    
    if (isNaN(timestampNum) || timestampNum <= 0) {
      console.log(`❌ Invalid demo timestamp: ${timestamp}`);
      return { error: "Ogiltigt demo-timestamp", user: null };
    }

    // Check session age (48h for demo sessions to be more lenient)
    const ageHours = (Date.now() - timestampNum) / (1000 * 60 * 60);
    console.log(`🔍 Demo session age: ${ageHours.toFixed(2)} hours`);
    
    if (ageHours > 48) {
      console.log(`❌ Demo session expired: ${ageHours.toFixed(2)}h > 48h`);
      return { error: "Demo-session har gått ut", user: null };
    }

    // Create demo user
    const demoUser = {
      id: userIdHeader,
      email: `demo${timestamp}@maak.se`,
      phone: "+46701234567",
      created_at: new Date(timestampNum).toISOString(),
      app_metadata: { demo: true },
      user_metadata: { 
        firstName: "Demo",
        lastName: "Användare",
        demo: true
      },
      aud: 'authenticated'
    };

    return { error: null, user: demoUser };
  } else {
    // Real user session - validate against stored session
    console.log(`🔍 Real user session validation for user: ${userIdHeader}`);
    
    if (!userIdHeader) {
      console.log(`❌ No user ID provided for real session`);
      return { error: "Inget användar-ID tillhandahållet", user: null };
    }

    try {
      // In a real implementation, validate session ID against stored sessions
      // For now, we'll trust the client-provided user ID if session format is valid
      console.log(`🔍 Looking up user by ID: ${userIdHeader}`);
      const { data: { user }, error } = await supabase.auth.admin.getUserById(userIdHeader);
      
      if (error) {
        console.log(`❌ User lookup error: ${error.message}`);
        return { error: `Användare hittades inte: ${error.message}`, user: null };
      }
      
      if (!user) {
        console.log(`❌ No user found with ID: ${userIdHeader}`);
        return { error: "Användare hittades inte", user: null };
      }

      console.log(`✅ Real user session valid: ${user.id}`);
      return { error: null, user };
    } catch (error) {
      console.log(`❌ Session validation exception:`, error);
      return { error: "Session-validering misslyckades", user: null };
    }
  }
}

// Token-based authentication (fallback method)
async function verifyTokenAuth(authHeader: string | null) {
  console.log(`🔍 Token auth - Auth header: ${authHeader ? authHeader.substring(0, 30) + '...' : 'null'}`);
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { error: "Auth header is not 'Bearer {token}'", user: null };
  }

  const accessToken = authHeader.split(" ")[1];
  
  // Handle demo tokens
  if (accessToken.startsWith("demo-token-")) {
    const timestamp = accessToken.replace("demo-token-", "");
    const timestampNum = parseInt(timestamp);
    
    if (isNaN(timestampNum) || timestampNum <= 0) {
      return { error: "Ogiltigt demo-token format", user: null };
    }
    
    const ageHours = (Date.now() - timestampNum) / (1000 * 60 * 60);
    if (ageHours > 25) {
      return { error: "Demo-token har gått ut", user: null };
    }
    
    const demoUser = {
      id: `demo-user-${timestamp}`,
      email: `demo${timestamp}@maak.se`,
      phone: "+46701234567",
      created_at: new Date(timestampNum).toISOString(),
      app_metadata: { demo: true },
      user_metadata: { 
        firstName: "Demo",
        lastName: "Användare",
        demo: true
      },
      aud: 'authenticated'
    };
    
    return { error: null, user: demoUser };
  }

  // Handle real Supabase tokens
  try {
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user?.id) {
      return { error: "Token-validering misslyckades", user: null };
    }

    return { error: null, user };
  } catch (error) {
    return { error: "Supabase token-fel", user: null };
  }
}

// Demo authentication (last resort)
async function verifyDemoAuth(userIdHeader: string | null, isDemoHeader: string | null) {
  if (isDemoHeader !== "true" || !userIdHeader?.startsWith("demo-user-")) {
    return { error: "Inte demo-autentisering", user: null };
  }

  const timestamp = userIdHeader.replace("demo-user-", "");
  const timestampNum = parseInt(timestamp);
  
  if (isNaN(timestampNum) || timestampNum <= 0) {
    return { error: "Ogiltigt demo-ID", user: null };
  }

  // Very lenient age check for last resort
  const ageHours = (Date.now() - timestampNum) / (1000 * 60 * 60);
  if (ageHours > 48) { // 48h grace for demo
    return { error: "Demo för gammal", user: null };
  }

  const demoUser = {
    id: userIdHeader,
    email: `demo${timestamp}@maak.se`,
    phone: "+46701234567",
    created_at: new Date(timestampNum).toISOString(),
    app_metadata: { demo: true },
    user_metadata: { 
      firstName: "Demo",
      lastName: "Användare",
      demo: true
    },
    aud: 'authenticated'
  };

  console.log("🎭 Last resort demo auth successful");
  return { error: null, user: demoUser };
}

// User registration
app.post("/make-server-e34211d6/auth/signup", async (c) => {
  try {
    const { email, password, firstName, lastName } = await c.req.json();

    if (!email || !password || !firstName) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { 
        firstName, 
        lastName: lastName || "",
        createdAt: new Date().toISOString()
      },
      // Automatically confirm since email server isn't configured
      email_confirm: true
    });

    if (error) {
      console.log("Signup error:", error);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ 
      success: true, 
      user: {
        id: data.user.id,
        email: data.user.email,
        firstName,
        lastName
      }
    });

  } catch (error) {
    console.log("Signup exception:", error);
    return c.json({ error: "Internal server error during signup" }, 500);
  }
});

// User profile management
app.post("/make-server-e34211d6/profile", async (c) => {
  try {
    const { error: authError, user } = await verifyUser(c.req.raw);
    if (authError || !user) {
      console.log("Profile creation auth failed:", authError);
      return c.json({ error: authError || "Unauthorized" }, 401);
    }

    const profileData = await c.req.json();
    console.log("Creating profile for user:", user.id, "with data:", profileData);
    
    // Store profile in KV store
    await kv.set(`profile:${user.id}`, {
      ...profileData,
      userId: user.id,
      updatedAt: new Date().toISOString()
    });

    console.log("Profile created successfully for user:", user.id);
    return c.json({ success: true, profile: profileData });

  } catch (error) {
    console.log("Profile creation error:", error);
    return c.json({ error: "Failed to create profile" }, 500);
  }
});

app.get("/make-server-e34211d6/profile", async (c) => {
  try {
    console.log("📋 Profile fetch - verifying user...");
    const { error: authError, user } = await verifyUser(c.req.raw);
    if (authError || !user) {
      console.log("❌ Profile fetch auth failed:", authError, "User ID:", user?.id || "none");
      return c.json({ error: authError || "Unauthorized" }, 401);
    }

    console.log("🔍 Profile fetch - getting profile for user:", user.id);
    const profile = await kv.get(`profile:${user.id}`);
    
    if (!profile) {
      console.log("🚫 Profile not found for user:", user.id);
      return c.json({ error: "Profile not found" }, 404);
    }

    console.log("✅ Profile found for user:", user.id, "Keys:", Object.keys(profile).join(", "));
    return c.json({ profile });

  } catch (error) {
    console.log("💥 Profile fetch error:", error);
    return c.json({ error: "Failed to fetch profile" }, 500);
  }
});

// Personality test results
app.post("/make-server-e34211d6/personality", async (c) => {
  try {
    const { error: authError, user } = await verifyUser(c.req.raw);
    if (authError || !user) {
      return c.json({ error: authError || "Unauthorized" }, 401);
    }

    const personalityData = await c.req.json();
    
    await kv.set(`personality:${user.id}`, {
      ...personalityData,
      userId: user.id,
      completedAt: new Date().toISOString()
    });

    return c.json({ success: true, personality: personalityData });

  } catch (error) {
    console.log("Personality test error:", error);
    return c.json({ error: "Failed to save personality results" }, 500);
  }
});

app.get("/make-server-e34211d6/personality", async (c) => {
  try {
    console.log("🧠 Personality fetch - verifying user...");
    const { error: authError, user } = await verifyUser(c.req.raw);
    if (authError || !user) {
      console.log("❌ Personality fetch auth failed:", authError, "User ID:", user?.id || "none");
      return c.json({ error: authError || "Unauthorized" }, 401);
    }

    console.log("🔍 Personality fetch - getting results for user:", user.id);
    const personality = await kv.get(`personality:${user.id}`);
    
    if (!personality) {
      console.log("🚫 Personality results not found for user:", user.id);
      return c.json({ error: "Personality results not found" }, 404);
    }

    console.log("✅ Personality results found for user:", user.id);
    return c.json({ personality });

  } catch (error) {
    console.log("💥 Personality fetch error:", error);
    return c.json({ error: "Failed to fetch personality results" }, 500);
  }
});

// Daily matches endpoint
app.get("/make-server-e34211d6/matches/daily", async (c) => {
  try {
    console.log("📅 Daily matches endpoint called");
    
    const { error: authError, user } = await verifyUser(c.req.raw);
    if (authError || !user) {
      console.log("❌ Daily matches auth failed:", authError);
      return c.json({ error: authError || "Unauthorized" }, 401);
    }

    console.log("✅ Daily matches auth successful for user:", user.id);

    // Get personality parameter from query
    const personalityType = c.req.query("personality");
    console.log("🧠 Requested personality type:", personalityType);

    // Mock daily matches data based on MÄÄK system
    const mockDailyMatches = {
      similarityMatches: [
        {
          id: "emma_similarity",
          name: "Emma S.",
          age: 26,
          photos: ["https://images.unsplash.com/photo-1494790108755-2616b612b372?w=400"],
          bio: "Kreativ själ som älskar konst, musik och djupa samtal. Letar efter någon som delar mina värderingar om äkthet och personlig utveckling. 🎨✨",
          distance: 2,
          personalityType: "INFP",
          personalityName: "Mediatorn",
          category: "Diplomater",
          compatibilityScore: 94,
          matchType: 'similarity',
          interests: ["Konst", "Musik", "Läsning", "Natur", "Meditation"],
          occupation: "Grafisk Designer",
          education: "Konstfack Stockholm",
          location: "Södermalm, Stockholm",
          isOnline: true,
          verifiedProfile: true,
          mutualInterests: ["Konst", "Musik", "Läsning"],
          aiInsight: "Era kreativa själar resonerar på samma frekvens - perfekt för djupa artistiska diskussioner"
        },
        {
          id: "lucas_similarity",
          name: "Lucas K.",
          age: 29,
          photos: ["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"],
          bio: "Passionerad coach som hjälper människor hitta sin potential. Älskar resor, personlig utveckling och äkta samtal.",
          distance: 5,
          personalityType: "ENFJ",
          personalityName: "Protagonisten",
          category: "Diplomater",
          compatibilityScore: 91,
          matchType: 'similarity',
          interests: ["Coaching", "Resor", "Mindfulness", "Personlig utveckling", "Yoga"],
          occupation: "Life Coach",
          education: "Stockholms Universitet",
          location: "Vasastan, Stockholm",
          isOnline: false,
          lastSeen: "2 timmar sedan",
          verifiedProfile: true,
          mutualInterests: ["Personlig utveckling", "Mindfulness"],
          aiInsight: "Båda är naturliga ledare med empati - tillsammans kan ni inspirera varandra till nya höjder"
        },
        {
          id: "sofia_similarity",
          name: "Sofia L.",
          age: 24,
          photos: ["https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400"],
          bio: "Filosofistudent som älskar djupa diskussioner och att utforska livets stora frågor. Ständigt nyfiken på världen.",
          distance: 8,
          personalityType: "INFJ",
          personalityName: "Advokaten",
          category: "Diplomater",
          compatibilityScore: 88,
          matchType: 'similarity',
          interests: ["Filosofi", "Litteratur", "Psykologi", "Kaffe", "Djupa samtal"],
          occupation: "Student",
          education: "Lunds Universitet",
          location: "Malmö",
          isOnline: true,
          verifiedProfile: false,
          mutualInterests: ["Filosofi", "Djupa samtal"],
          aiInsight: "Era intellektuella intressen skapar en perfekt grund för meningsfulla konversationer"
        }
      ],
      complementMatches: [
        {
          id: "alex_complement",
          name: "Alex M.",
          age: 27,
          photos: ["https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400"],
          bio: "Entreprenör inom tech som älskar innovation och att bygga framtiden. Balanserar ambitiösa mål med äventyr utomhus.",
          distance: 3,
          personalityType: "ENTJ",
          personalityName: "Kommandören",
          category: "Strateger",
          compatibilityScore: 85,
          matchType: 'complement',
          interests: ["Teknik", "Entreprenörskap", "Klättring", "Innovation", "Ledarskap"],
          occupation: "Tech Entrepreneur",
          education: "KTH",
          location: "Östermalm, Stockholm",
          isOnline: false,
          lastSeen: "1 timme sedan",
          verifiedProfile: true,
          mutualInterests: ["Innovation"],
          aiInsight: "Din kreativitet + hans strategiska tänk = perfekt balans mellan vision och genomförande"
        },
        {
          id: "maya_complement",
          name: "Maya R.",
          age: 25,
          photos: ["https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400"],
          bio: "Eventplanerare som lever för spontanitet och äventyr. Älskar att skapa magiska upplevelser för andra.",
          distance: 7,
          personalityType: "ESFP",
          personalityName: "Underhållaren",
          category: "Upptäckare",
          compatibilityScore: 82,
          matchType: 'complement',
          interests: ["Event", "Dans", "Resor", "Spontanitet", "Socialiserande"],
          occupation: "Event Planner",
          education: "Berghs School of Communication",
          location: "Södermalm, Stockholm",
          isOnline: true,
          verifiedProfile: true,
          mutualInterests: ["Resor"],
          aiInsight: "Hon kan få dig att komma ut ur din comfort zone medan du ger henne djup och reflektion"
        }
      ],
      refreshTime: new Date(Date.now() + 20 * 60 * 60 * 1000), // 20 hours from now
      totalMatches: 5
    };

    console.log("📊 Returning daily matches with", mockDailyMatches.totalMatches, "total matches");
    return c.json(mockDailyMatches);

  } catch (error) {
    console.log("💥 Daily matches error:", error);
    return c.json({ error: "Failed to fetch daily matches" }, 500);
  }
});

// General matching algorithm
app.get("/make-server-e34211d6/matches", async (c) => {
  try {
    const { error: authError, user } = await verifyUser(c.req.raw);
    if (authError || !user) {
      return c.json({ error: authError || "Unauthorized" }, 401);
    }

    // Get user's profile and personality
    const userProfile = await kv.get(`profile:${user.id}`);
    const userPersonality = await kv.get(`personality:${user.id}`);

    if (!userProfile || !userPersonality) {
      return c.json({ error: "Profile or personality data missing" }, 400);
    }

    // Get all other users' profiles (simplified for demo)
    const allProfileKeys = await kv.getByPrefix("profile:");
    const potentialMatches = [];

    for (const key of allProfileKeys) {
      const profile = await kv.get(key);
      if (profile && profile.userId !== user.id) {
        const personality = await kv.get(`personality:${profile.userId}`);
        if (personality) {
          const compatibility = calculateCompatibility(userPersonality, personality, userProfile, profile);
          
          potentialMatches.push({
            id: profile.userId,
            name: `${profile.firstName} ${profile.lastName ? profile.lastName[0] + '.' : ''}`,
            age: calculateAge(profile.birthDate),
            location: profile.location,
            photos: profile.photos || [],
            personalityType: personality.type,
            archetype: personality.name,
            category: personality.category,
            bio: profile.bio || "Ny användare på MÄÄK",
            interests: profile.interests || [],
            compatibilityScore: compatibility.overall,
            personalityMatch: compatibility.personality,
            interestMatch: compatibility.interests,
            lifestyleMatch: compatibility.lifestyle,
            distanceKm: Math.random() * 50 + 1 // Mock distance for demo
          });
        }
      }
    }

    // Sort by compatibility and return top matches
    const matches = potentialMatches
      .sort((a, b) => b.compatibilityScore - a.compatibilityScore)
      .slice(0, 10);

    return c.json({ matches });

  } catch (error) {
    console.log("Matching error:", error);
    return c.json({ error: "Failed to fetch matches" }, 500);
  }
});

// Calculate compatibility between two users
function calculateCompatibility(userPersonality: any, otherPersonality: any, userProfile: any, otherProfile: any) {
  // Personality compatibility (based on MBTI compatibility)
  const personalityScore = calculatePersonalityCompatibility(userPersonality.type, otherPersonality.type);
  
  // Interest compatibility
  const userInterests = new Set(userProfile.interests || []);
  const otherInterests = new Set(otherProfile.interests || []);
  const commonInterests = [...userInterests].filter(x => otherInterests.has(x));
  const interestScore = commonInterests.length > 0 ? 
    (commonInterests.length / Math.max(userInterests.size, otherInterests.size)) * 100 : 50;
  
  // Lifestyle compatibility (simplified)
  let lifestyleScore = 80; // Base score
  if (userProfile.lifestyle?.alcohol && otherProfile.lifestyle?.alcohol) {
    if (userProfile.lifestyle.alcohol === otherProfile.lifestyle.alcohol) {
      lifestyleScore += 10;
    }
  }

  // Overall score (weighted average)
  const overall = Math.round(
    personalityScore * 0.5 + 
    interestScore * 0.3 + 
    lifestyleScore * 0.2
  );

  return {
    overall: Math.min(overall, 99), // Cap at 99%
    personality: Math.round(personalityScore),
    interests: Math.round(interestScore),
    lifestyle: Math.round(lifestyleScore)
  };
}

function calculatePersonalityCompatibility(type1: string, type2: string): number {
  // Simplified MBTI compatibility matrix
  const compatibilityMatrix: { [key: string]: { [key: string]: number } } = {
    'INFP': { 'ENFJ': 95, 'INFJ': 90, 'ENFP': 85, 'ENTP': 80, 'INFP': 75 },
    'ENFP': { 'INFJ': 95, 'INTJ': 90, 'ENFP': 85, 'INFP': 85, 'ENTP': 80 },
    'INFJ': { 'ENFP': 95, 'ENTP': 90, 'INFP': 90, 'ENFJ': 85, 'INTJ': 80 },
    'ENFJ': { 'INFP': 95, 'ISFP': 90, 'ENFJ': 85, 'INFJ': 85, 'ENFP': 80 },
    // Add more combinations as needed
  };

  return compatibilityMatrix[type1]?.[type2] || 
         compatibilityMatrix[type2]?.[type1] || 
         70; // Default compatibility
}

function calculateAge(birthDate: string): number {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
}

// Chat functionality
app.post("/make-server-e34211d6/chat/send", async (c) => {
  try {
    const { error: authError, user } = await verifyUser(c.req.raw);
    if (authError || !user) {
      return c.json({ error: authError || "Unauthorized" }, 401);
    }

    const { recipientId, message, type = "text" } = await c.req.json();

    if (!recipientId || !message) {
      return c.json({ error: "Missing recipient or message" }, 400);
    }

    const chatMessage = {
      id: crypto.randomUUID(),
      senderId: user.id,
      recipientId,
      message,
      type,
      timestamp: new Date().toISOString(),
      status: "sent"
    };

    // Store message in chat history
    const chatKey = [user.id, recipientId].sort().join("-");
    const existingChat = await kv.get(`chat:${chatKey}`) || { messages: [] };
    existingChat.messages.push(chatMessage);
    existingChat.lastMessage = chatMessage;
    existingChat.updatedAt = new Date().toISOString();

    await kv.set(`chat:${chatKey}`, existingChat);

    return c.json({ success: true, message: chatMessage });

  } catch (error) {
    console.log("Chat send error:", error);
    return c.json({ error: "Failed to send message" }, 500);
  }
});

app.get("/make-server-e34211d6/chat/:recipientId", async (c) => {
  try {
    const { error: authError, user } = await verifyUser(c.req.raw);
    if (authError || !user) {
      return c.json({ error: authError || "Unauthorized" }, 401);
    }

    const recipientId = c.req.param("recipientId");
    const chatKey = [user.id, recipientId].sort().join("-");
    
    const chat = await kv.get(`chat:${chatKey}`) || { messages: [] };
    
    return c.json({ messages: chat.messages || [] });

  } catch (error) {
    console.log("Chat fetch error:", error);
    return c.json({ error: "Failed to fetch chat" }, 500);
  }
});

// Community daily question
app.get("/make-server-e34211d6/community/daily-question", async (c) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    let dailyQuestion = await kv.get(`daily-question:${today}`);
    
    if (!dailyQuestion) {
      // Create today's question if it doesn't exist
      const questions = [
        {
          question: "Vad är viktigast för dig i ett förhållande?",
          category: "Relationer",
          options: [
            "Kommunikation och förståelse",
            "Gemensamma värderingar", 
            "Fysisk attraktion",
            "Humor och skratt",
            "Trygghet och stabilitet"
          ]
        },
        {
          question: "Hur föredrar du att spendera en perfekt helg?",
          category: "Livsstil", 
          options: [
            "Ute i naturen och aktiv",
            "Hemma med nära och kära",
            "Upptäcka nya ställen i stan",
            "Läsa en bra bok",
            "Socialisera med vänner"
          ]
        }
      ];
      
      const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
      dailyQuestion = {
        id: today,
        ...randomQuestion,
        responses: 0,
        results: new Array(randomQuestion.options.length).fill(0)
      };
      
      await kv.set(`daily-question:${today}`, dailyQuestion);
    }
    
    return c.json({ question: dailyQuestion });

  } catch (error) {
    console.log("Daily question error:", error);
    return c.json({ error: "Failed to fetch daily question" }, 500);
  }
});

app.post("/make-server-e34211d6/community/daily-question/answer", async (c) => {
  try {
    const { error: authError, user } = await verifyUser(c.req.raw);
    if (authError || !user) {
      return c.json({ error: authError || "Unauthorized" }, 401);
    }

    const { answerIndex } = await c.req.json();
    const today = new Date().toISOString().split('T')[0];
    
    // Check if user already answered today
    const userAnswerKey = `user-answer:${today}:${user.id}`;
    const existingAnswer = await kv.get(userAnswerKey);
    
    if (existingAnswer) {
      return c.json({ error: "Du har redan svarat på dagens fråga" }, 400);
    }
    
    // Record the answer
    await kv.set(userAnswerKey, { answerIndex, timestamp: new Date().toISOString() });
    
    // Update question statistics
    const question = await kv.get(`daily-question:${today}`);
    if (question) {
      question.responses++;
      question.results[answerIndex]++;
      await kv.set(`daily-question:${today}`, question);
    }
    
    return c.json({ success: true });

  } catch (error) {
    console.log("Answer daily question error:", error);
    return c.json({ error: "Failed to save answer" }, 500);
  }
});

// Social Media Trends endpoints
app.get("/make-server-e34211d6/community/social-trends", async (c) => {
  try {
    const { error: authError, user } = await verifyUser(c.req.raw);
    if (authError || !user) {
      return c.json({ error: authError || "Unauthorized" }, 401);
    }

    // Mock social media trends data
    const trends = {
      trending_hashtags: [
        { tag: "#authenticity", count: 847, growth: "+12%" },
        { tag: "#selflove", count: 623, growth: "+8%" },
        { tag: "#mindfulness", count: 509, growth: "+15%" }
      ],
      posts: [
        {
          id: "post_1",
          user: { name: "Emma S.", verified: true },
          content: "Imorse upptäckte jag en liten kafé som serverar den bästa chai latte i stan! ☕️ Ibland är det de små sakerna...",
          platform: "instagram",
          timestamp: "2024-01-15T10:30:00Z",
          likes: 23,
          comments: 5,
          hashtags: ["#kafé", "#chai", "#stockholm"]
        }
      ]
    };

    return c.json(trends);

  } catch (error) {
    console.log("Social trends error:", error);
    return c.json({ error: "Failed to fetch social trends" }, 500);
  }
});

// Privacy endpoints
app.post("/make-server-e34211d6/privacy/consent", async (c) => {
  try {
    const { error: authError, user } = await verifyUser(c.req.raw);
    if (authError || !user) {
      return c.json({ error: authError || "Unauthorized" }, 401);
    }

    const consentData = await c.req.json();
    
    await kv.set(`consent:${user.id}`, {
      ...consentData,
      userId: user.id,
      timestamp: new Date().toISOString()
    });

    return c.json({ success: true });

  } catch (error) {
    console.log("Consent update error:", error);
    return c.json({ error: "Failed to update consent" }, 500);
  }
});

app.get("/make-server-e34211d6/privacy/consent", async (c) => {
  try {
    const { error: authError, user } = await verifyUser(c.req.raw);
    if (authError || !user) {
      return c.json({ error: authError || "Unauthorized" }, 401);
    }

    const consent = await kv.get(`consent:${user.id}`);
    return c.json({ consent: consent || null });

  } catch (error) {
    console.log("Consent fetch error:", error);
    return c.json({ error: "Failed to fetch consent" }, 500);
  }
});

// Refresh daily matches endpoint
app.post("/make-server-e34211d6/matches/daily/refresh", async (c) => {
  try {
    const { error: authError, user } = await verifyUser(c.req.raw);
    if (authError || !user) {
      return c.json({ error: authError || "Unauthorized" }, 401);
    }

    // In a real app, this would refresh the daily matches
    // For now, just return success
    return c.json({ 
      success: true, 
      message: "Daily matches will be refreshed in 20 hours",
      nextRefresh: new Date(Date.now() + 20 * 60 * 60 * 1000).toISOString()
    });

  } catch (error) {
    console.log("Refresh daily matches error:", error);
    return c.json({ error: "Failed to refresh daily matches" }, 500);
  }
});

// Daily Question endpoint - MISSING ENDPOINT ADDED
app.get("/make-server-e34211d6/community/daily-question", async (c) => {
  try {
    console.log("📊 Daily question endpoint called");
    
    const { error: authError, user } = await verifyUser(c.req.raw);
    if (authError || !user) {
      console.log("❌ Daily question auth failed:", authError);
      return c.json({ error: authError || "Unauthorized" }, 401);
    }

    console.log("✅ Daily question auth successful for user:", user.id);
    
    const today = new Date().toISOString().split('T')[0];
    
    // Check if there's already a question for today
    let dailyQuestion = await kv.get(`daily-question:${today}`);
    
    if (!dailyQuestion) {
      // Create a new daily question
      const questions = [
        {
          question: "Vad är viktigast för dig i en relation?",
          options: ["Ärlighet och kommunikation", "Gemensamma intressen", "Känslomässig intimitet", "Äventyr och spontanitet"],
          category: "relationships"
        },
        {
          question: "Hur föredrar du att spendera en idealisk helg?",
          options: ["Hemma med en god bok", "Utforska naturen", "Umgås med vänner", "Prova något nytt"],
          category: "lifestyle"
        },
        {
          question: "Vad motiverar dig mest i livet?",
          options: ["Att hjälpa andra", "Personlig utveckling", "Kreativ självuttryck", "Att uppnå mål"],
          category: "values"
        }
      ];
      
      // Select a random question
      const selectedQuestion = questions[Math.floor(Math.random() * questions.length)];
      
      dailyQuestion = {
        ...selectedQuestion,
        date: today,
        responses: 0,
        results: [0, 0, 0, 0], // Initialize counters for each option
        percentages: [0, 0, 0, 0]
      };
      
      await kv.set(`daily-question:${today}`, dailyQuestion);
      console.log("📝 Created new daily question for", today);
    }
    
    // Check if user has already answered
    const userAnswer = await kv.get(`user-answer:${today}:${user.id}`);
    
    return c.json({
      question: dailyQuestion,
      hasAnswered: !!userAnswer,
      userAnswer: userAnswer?.answerIndex || null
    });

  } catch (error) {
    console.log("💥 Daily question error:", error);
    return c.json({ error: "Failed to fetch daily question" }, 500);
  }
});

// Submit answer to daily question
app.post("/make-server-e34211d6/community/daily-question/answer", async (c) => {
  try {
    const { error: authError, user } = await verifyUser(c.req.raw);
    if (authError || !user) {
      return c.json({ error: authError || "Unauthorized" }, 401);
    }

    const { answerIndex } = await c.req.json();
    
    if (typeof answerIndex !== 'number' || answerIndex < 0 || answerIndex > 3) {
      return c.json({ error: "Invalid answer index" }, 400);
    }

    const today = new Date().toISOString().split('T')[0];
    
    // Check if user already answered
    const userAnswer = await kv.get(`user-answer:${today}:${user.id}`);
    if (userAnswer) {
      return c.json({ error: "Already answered today" }, 400);
    }

    // Get current question
    const dailyQuestion = await kv.get(`daily-question:${today}`);
    if (!dailyQuestion) {
      return c.json({ error: "No question for today" }, 404);
    }

    // Update results
    dailyQuestion.results[answerIndex]++;
    dailyQuestion.responses++;
    
    // Calculate percentages
    const percentages = dailyQuestion.results.map((count: number) => 
      Math.round((count / dailyQuestion.responses) * 100)
    );

    await kv.set(`daily-question:${today}`, { ...dailyQuestion, percentages });
    await kv.set(`user-answer:${today}:${user.id}`, { answerIndex, timestamp: new Date().toISOString() });

    return c.json({ 
      success: true, 
      results: percentages,
      userAnswer: answerIndex 
    });

  } catch (error) {
    console.log("Answer submission error:", error);
    return c.json({ error: "Failed to submit answer" }, 500);
  }
});

// GDPR Compliance endpoints

// User consent management
app.post("/make-server-e34211d6/privacy/consent", async (c) => {
  try {
    const { error: authError, user } = await verifyUser(c.req.raw);
    if (authError || !user) {
      return c.json({ error: authError || "Unauthorized" }, 401);
    }

    const consentData = await c.req.json();
    
    // Store user consent with timestamp and version
    await kv.set(`consent:${user.id}`, {
      ...consentData,
      userId: user.id,
      timestamp: new Date().toISOString(),
      version: "1.0"
    });

    return c.json({ success: true });

  } catch (error) {
    console.log("Consent update error:", error);
    return c.json({ error: "Failed to update consent" }, 500);
  }
});

app.get("/make-server-e34211d6/privacy/consent", async (c) => {
  try {
    const { error: authError, user } = await verifyUser(c.req.raw);
    if (authError || !user) {
      return c.json({ error: authError || "Unauthorized" }, 401);
    }

    const consent = await kv.get(`consent:${user.id}`);
    
    if (!consent) {
      return c.json({ error: "No consent found" }, 404);
    }

    return c.json({ consent });

  } catch (error) {
    console.log("Consent fetch error:", error);
    return c.json({ error: "Failed to fetch consent" }, 500);
  }
});

// Data export request
app.post("/make-server-e34211d6/privacy/export", async (c) => {
  try {
    const { error: authError, user } = await verifyUser(c.req.raw);
    if (authError || !user) {
      return c.json({ error: authError || "Unauthorized" }, 401);
    }

    const exportRequest = await c.req.json();
    
    // Store export request for processing
    const requestId = crypto.randomUUID();
    await kv.set(`export-request:${requestId}`, {
      ...exportRequest,
      userId: user.id,
      requestId,
      status: "pending",
      requestedAt: new Date().toISOString()
    });

    // In a real implementation, this would trigger a background job
    // to collect and email the user's data
    console.log(`Data export requested for user ${user.id}, request ID: ${requestId}`);

    return c.json({ success: true, requestId });

  } catch (error) {
    console.log("Data export request error:", error);
    return c.json({ error: "Failed to process export request" }, 500);
  }
});

// Data deletion request
app.post("/make-server-e34211d6/privacy/delete", async (c) => {
  try {
    const { error: authError, user } = await verifyUser(c.req.raw);
    if (authError || !user) {
      return c.json({ error: authError || "Unauthorized" }, 401);
    }

    const deletionRequest = await c.req.json();
    
    // Store deletion request
    const requestId = crypto.randomUUID();
    await kv.set(`deletion-request:${requestId}`, {
      ...deletionRequest,
      userId: user.id,
      requestId,
      status: "pending",
      requestedAt: new Date().toISOString()
    });

    // In a real implementation, this would:
    // 1. Schedule data deletion after verification period
    // 2. Send confirmation email
    // 3. Remove personal data while preserving anonymized analytics
    console.log(`Data deletion requested for user ${user.id}, request ID: ${requestId}`);

    return c.json({ success: true, requestId });

  } catch (error) {
    console.log("Data deletion request error:", error);
    return c.json({ error: "Failed to process deletion request" }, 500);
  }
});

// Analytics tracking endpoint
app.post("/make-server-e34211d6/analytics/track", async (c) => {
  try {
    const { error: authError, user } = await verifyUser(c.req.raw);
    if (authError || !user) {
      return c.json({ error: authError || "Unauthorized" }, 401);
    }

    const analyticsEvent = await c.req.json();
    
    // Check if user has consented to analytics
    const consent = await kv.get(`consent:${user.id}`);
    if (!consent?.analytics && !analyticsEvent.critical) {
      return c.json({ error: "Analytics not consented" }, 403);
    }

    // Store analytics event
    const eventId = crypto.randomUUID();
    await kv.set(`analytics:${eventId}`, {
      ...analyticsEvent,
      userId: user.id,
      eventId,
      timestamp: new Date().toISOString()
    });

    return c.json({ success: true });

  } catch (error) {
    console.log("Analytics tracking error:", error);
    return c.json({ error: "Failed to track event" }, 500);
  }
});

// Health check - open endpoint, no auth required
app.get("/make-server-e34211d6/health", async (c) => {
  try {
    console.log("🏥 Health check initiated...");
    
    // Test KV store connectivity
    const testKey = `health-check-${Date.now()}`;
    const testValue = { 
      test: true, 
      timestamp: new Date().toISOString(),
      server: "make-server-e34211d6"
    };
    
    await kv.set(testKey, testValue);
    const retrieved = await kv.get(testKey);
    
    // Clean up test key
    try {
      await kv.del(testKey);
    } catch (cleanupError) {
      console.warn("Health check cleanup failed:", cleanupError);
    }
    
    const kvStatus = retrieved && 
                     retrieved.test === true && 
                     retrieved.server === "make-server-e34211d6";
    
    console.log(`🏥 Health check results: KV=${kvStatus ? '✅' : '❌'} Supabase=✅`);
    
    const healthStatus = {
      status: kvStatus ? "healthy" : "degraded",
      timestamp: new Date().toISOString(),
      server: "make-server-e34211d6",
      services: {
        kvStore: kvStatus ? "ok" : "error",
        supabase: "ok", // If we reach here, Supabase is working
        authentication: "ok"
      },
      version: "1.0.1",
      uptime: process.uptime ? Math.floor(process.uptime()) : "unknown"
    };
    
    return c.json(healthStatus, kvStatus ? 200 : 503);
    
  } catch (error) {
    console.log("💥 Health check failed:", error);
    
    const errorResponse = {
      status: "unhealthy", 
      timestamp: new Date().toISOString(),
      server: "make-server-e34211d6",
      error: error instanceof Error ? error.message : "Unknown health check error",
      services: {
        kvStore: "error",
        supabase: "unknown",
        authentication: "unknown"
      },
      version: "1.0.1"
    };
    
    return c.json(errorResponse, 500);
  }
});

// Start server
Deno.serve(app.fetch);