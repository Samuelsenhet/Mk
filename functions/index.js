const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.getDailyMatches = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "The function must be called while authenticated."
    );
  }

  const db = admin.firestore();
  const profilesRef = db.collection("profiles");

  const userPersonality = data.userPersonality || "Diplomat";

  const personalityTypes = {
    Diplomat: { similarity: ["Diplomat"], complement: ["Byggare", "Upptäckare"] },
    Byggare: { similarity: ["Byggare"], complement: ["Diplomat", "Strateg"] },
    Upptäckare: { similarity: ["Upptäckare"], complement: ["Strateg", "Diplomat"] },
    Strateg: { similarity: ["Strateg"], complement: ["Upptäckare", "Byggare"] },
  };

  const currentUserPersonality = personalityTypes[userPersonality];

  const calculateCompatibility = (match) => {
    let score = 50;
    return Math.min(100, score + Math.floor(Math.random() * 20));
  };

  const mapProfileData = (profile, matchType) => ({
    id: profile.id,
    name: profile.name || "No Name",
    age: profile.age || 0,
    photos: profile.photos || [],
    bio: profile.bio || "",
    distance: Math.floor(Math.random() * 10),
    personalityType: profile.personality_type || "N/A",
    personalityName: profile.personality_name || "N/A",
    category: profile.category || "Diplomater",
    compatibilityScore: calculateCompatibility(profile),
    matchType: matchType,
    interests: profile.interests || [],
    occupation: profile.occupation || "Unknown",
    location: profile.location || "Unknown",
    isOnline: true,
    verifiedProfile: true,
  });

  const similaritySnapshot = await profilesRef
    .where("category", "in", currentUserPersonality.similarity)
    .limit(3)
    .get();
  const similarityMatches = similaritySnapshot.docs.map((doc) =>
    mapProfileData({ id: doc.id, ...doc.data() }, "similarity")
  );

  const complementSnapshot = await profilesRef
    .where("category", "in", currentUserPersonality.complement)
    .limit(2)
    .get();
  const complementMatches = complementSnapshot.docs.map((doc) =>
    mapProfileData({ id: doc.id, ...doc.data() }, "complement")
  );

  return { similarityMatches, complementMatches };
});
