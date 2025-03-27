/**
 * Firebase utility functions for data retrieval
 */

/**
 * Fetch portfolio data from Firebase Firestore 
 * @returns {Promise<Object>} Portfolio data object
 */
async function fetchPortfolioData() {
  if (!firestoreDB) {
    console.warn("Firestore not initialized, using static data");
    return STATIC_PORTFOLIO_DATA;
  }

  try {
    console.log("Fetching portfolio data from Firebase...");
    
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
    const bioDoc = await firestoreDB.collection('bio').doc('main').get();
    if (bioDoc.exists) {
      portfolioData.bio = bioDoc.data();
      console.log("Bio data loaded");
    } else {
      portfolioData.bio = STATIC_PORTFOLIO_DATA.bio;
      console.warn("Bio document not found in Firestore, using static data");
    }

    // Fetch projects
    const projectsSnapshot = await firestoreDB.collection('projects').get();
    if (!projectsSnapshot.empty) {
      projectsSnapshot.forEach(doc => {
        portfolioData.projects.push(doc.data());
      });
      console.log("Projects loaded:", portfolioData.projects.length);
    } else {
      portfolioData.projects = STATIC_PORTFOLIO_DATA.projects;
      console.warn("No projects found in Firestore, using static data");
    }

    // Fetch certifications
    const certsDoc = await firestoreDB.collection('certifications').doc('list').get();
    if (certsDoc.exists) {
      portfolioData.certifications = certsDoc.data().items || [];
      console.log("Certifications loaded");
    } else {
      portfolioData.certifications = STATIC_PORTFOLIO_DATA.certifications;
      console.warn("Certifications document not found in Firestore, using static data");
    }

    // Fetch contact info
    const contactDoc = await firestoreDB.collection('contact').doc('info').get();
    if (contactDoc.exists) {
      portfolioData.contact = contactDoc.data();
      console.log("Contact data loaded");
    } else {
      portfolioData.contact = STATIC_PORTFOLIO_DATA.contact;
      console.warn("Contact document not found in Firestore, using static data");
    }

    // Fetch experiences
    const experiencesSnapshot = await firestoreDB.collection('experiences').get();
    if (!experiencesSnapshot.empty) {
      experiencesSnapshot.forEach(doc => {
        portfolioData.experiences.push(doc.data());
      });
      console.log("Experiences loaded:", portfolioData.experiences.length);
    } else {
      portfolioData.experiences = STATIC_PORTFOLIO_DATA.experiences;
      console.warn("No experiences found in Firestore, using static data");
    }

    // Fetch education
    const educationSnapshot = await firestoreDB.collection('education').get();
    if (!educationSnapshot.empty) {
      educationSnapshot.forEach(doc => {
        portfolioData.education.push(doc.data());
      });
      console.log("Education loaded:", portfolioData.education.length);
    } else {
      portfolioData.education = STATIC_PORTFOLIO_DATA.education;
      console.warn("No education records found in Firestore, using static data");
    }

    // Update global portfolio data
    PORTFOLIO_DATA = portfolioData;
    console.log('Portfolio data successfully loaded from Firebase');
    
    // Notify that data is loaded
    window.dispatchEvent(new CustomEvent('portfolio-data-loaded'));
    
    return portfolioData;
  } catch (error) {
    console.error('Error fetching portfolio data:', error);
    console.log('Falling back to static data due to error');
    return STATIC_PORTFOLIO_DATA;
  }
}