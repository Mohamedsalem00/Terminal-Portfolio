/**
 * Firebase configuration
 */
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyDkBwY47n7ZU_wjOEvhOoQCY_q30QYqiyg",
  projectId: "portfilio-data",
  authDomain: "portfilio-data.firebaseapp.com",
  storageBucket: "portfilio-data.appspot.com",
  messagingSenderId: "237586982524",
  appId: "1:237586982524:web:8807bc7670a44c6692cbf9" // Updated with actual app ID
};

// Initialize Firebase once
let firestoreDB;

// Immediately invoke initialization
(function() {
  try {
    firebase.initializeApp(FIREBASE_CONFIG);
    firestoreDB = firebase.firestore();
    console.log("Firebase initialized successfully");
  } catch (error) {
    console.error("Firebase initialization error:", error);
  }
})();

// Get a Firestore instance
let db;
try {
  db = firebase.firestore();
} catch (error) {
  console.error("Error getting Firestore instance:", error);
}

// Function to fetch portfolio data from Firebase
async function fetchPortfolioData() {
  try {
    console.log("Fetching portfolio data from Firebase...");
    
    if (!db) {
      console.error("Firestore instance not available");
      return STATIC_PORTFOLIO_DATA;
    }
    
    // Initialize default data structure
    const portfolioData = {
      bio: {},
      projects: [],
      certifications: [],
      contact: {},
      experiences: [],
      education: []
    };

    // Fetch bio data
    const bioDoc = await db.collection('bio').doc('main').get();
    if (bioDoc.exists) {
      portfolioData.bio = bioDoc.data();
      console.log("Bio data loaded:", portfolioData.bio);
    } else {
      console.warn("Bio document not found in Firestore, using static data");
      portfolioData.bio = STATIC_PORTFOLIO_DATA.bio;
    }

    // Fetch projects
    const projectsSnapshot = await db.collection('projects').get();
    if (!projectsSnapshot.empty) {
      projectsSnapshot.forEach(doc => {
        portfolioData.projects.push(doc.data());
      });
      console.log("Projects loaded:", portfolioData.projects.length);
    } else {
      console.warn("No projects found in Firestore, using static data");
      portfolioData.projects = STATIC_PORTFOLIO_DATA.projects;
    }

    // Fetch certifications
    const certsDoc = await db.collection('certifications').doc('list').get();
    if (certsDoc.exists) {
      portfolioData.certifications = certsDoc.data().items || [];
      console.log("Certifications loaded:", portfolioData.certifications.length);
    } else {
      console.warn("Certifications document not found in Firestore, using static data");
      portfolioData.certifications = STATIC_PORTFOLIO_DATA.certifications;
    }

    // Fetch contact info
    const contactDoc = await db.collection('contact').doc('info').get();
    if (contactDoc.exists) {
      portfolioData.contact = contactDoc.data();
      console.log("Contact data loaded");
    } else {
      console.warn("Contact document not found in Firestore, using static data");
      portfolioData.contact = STATIC_PORTFOLIO_DATA.contact;
    }

    // Fetch experiences
    const experiencesSnapshot = await db.collection('experiences').get();
    if (!experiencesSnapshot.empty) {
      experiencesSnapshot.forEach(doc => {
        portfolioData.experiences.push(doc.data());
      });
      console.log("Experiences loaded:", portfolioData.experiences.length);
    } else {
      console.warn("No experiences found in Firestore, using static data");
      portfolioData.experiences = STATIC_PORTFOLIO_DATA.experiences;
    }

    // Fetch education
    const educationSnapshot = await db.collection('education').get();
    if (!educationSnapshot.empty) {
      educationSnapshot.forEach(doc => {
        portfolioData.education.push(doc.data());
      });
      console.log("Education loaded:", portfolioData.education.length);
    } else {
      console.warn("No education records found in Firestore, using static data");
      portfolioData.education = STATIC_PORTFOLIO_DATA.education;
    }

    // Make the data globally available
    window.PORTFOLIO_DATA = portfolioData;
    console.log('Portfolio data successfully loaded from Firebase');
    
    // Dispatch event that data is loaded
    window.dispatchEvent(new CustomEvent('portfolio-data-loaded'));
    
    return portfolioData;
  } catch (error) {
    console.error('Error fetching portfolio data:', error);
    // Fallback to static data
    console.log('Falling back to static data due to error');
    return STATIC_PORTFOLIO_DATA;
  }
}