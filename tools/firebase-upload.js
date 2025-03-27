// Script to automatically upload portfolio data to Firebase
const firebase = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin SDK with your service account credentials
// You need to download a service account key file from the Firebase console
// Go to Project settings > Service accounts > Generate new private key
const serviceAccount = require('./firebase-service-account-key.json');

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount)
});

const db = firebase.firestore();

// Your portfolio data
const portfolioData = {
  bio: {
    main: {
      name: "Mohamed Salem Khyarhoum",
      title: "Ingénieur en Sécurité des Systèmes Informatiques et Réseaux",
      description: "Étudiant passionné par la cybersécurité et le développement technologique. À la recherche d'un stage ou d'une opportunité pour mettre en pratique mes compétences techniques.",
      skills: [
        "Linux (Ubuntu, Kali Linux)",
        "Flutter", 
        "Laravel, Django", 
        "MySQL, Oracle Database",
        "Python, PHP, C"
      ]
    }
  },
  projects: [
    {
      id: "project1",
      name: "Gestion-de-Scolarite",
      description: "Plateforme de gestion des inscriptions et des notes scolaires",
      technologies: ["Laravel", "MySQL", "PHP"],
      githubLink: "https://github.com/mohamedsalem00/gestion-scolarite"
    },
    {
      id: "project2",
      name: "ProfsChezVous",
      description: "Application mobile mettant en relation professeurs et élèves pour des cours particuliers",
      technologies: ["Flutter", "Django", "REST API"],
      githubLink: "https://github.com/mohamedsalem00/profshezvous"
    }
  ],
  certifications: {
    list: {
      items: [
        "Oracle SQL (Great Learning)",
        "Introduction to Oracle SQL (DataCamp)"
      ]
    }
  },
  contact: {
    info: {
      email: "mohamedsalemkhyarhoum@gmail.com",
      github: "https://github.com/mohamedsalem",
      linkedin: "https://www.linkedin.com/in/mohamed-salem-kh",
      twitter: "@mohamedsalem"
    }
  },
  experiences: [
    {
      id: "exp1",
      company: "Syskat Technologie",
      position: "Stagiaire",
      period: "Avril 2024 - Juin 2024",
      location: "Tevragh Zeina, Nouakchott Nord, Mauritanie",
      tasks: [
        "Développement de l'application ProfsChezVous avec Flutter (frontend) et Django (backend)",
        "Implémentation de solutions de paiement en ligne et intégration d'APIs REST",
        "Sécurisation des données et gestion de l'authentification des utilisateurs"
      ]
    },
    {
      id: "exp2",
      company: "Syskat Technologie",
      position: "Stagiaire",
      period: "Juillet 2023 - Août 2023",
      location: "Tevragh Zeina, Nouakchott Nord, Mauritanie",
      tasks: [
        "Développement d'une application web de gestion de scolarité avec Laravel",
        "Optimisation des processus administratifs scolaires via une interface intuitive",
        "Conception et gestion de bases de données MySQL"
      ]
    }
  ],
  education: [
    {
      id: "edu1",
      institution: "iTeam University",
      degree: "Ingénieur en Sécurité des Systèmes Informatiques et Réseaux",
      period: "Septembre 2024 - Septembre 2027"
    },
    {
      id: "edu2",
      institution: "ISCAE",
      degree: "Licence en Développement Informatique",
      period: "Janvier 2021 - Juillet 2024"
    }
  ]
};

// Function to upload a document to Firestore
async function uploadDocument(collection, docId, data) {
  try {
    await db.collection(collection).doc(docId).set(data);
    console.log(`✅ Successfully uploaded ${collection}/${docId}`);
  } catch (error) {
    console.error(`❌ Error uploading ${collection}/${docId}:`, error);
  }
}

// Function to upload a collection of documents to Firestore
async function uploadCollection(collectionName, documents) {
  const collection = db.collection(collectionName);
  
  for (const doc of documents) {
    const { id, ...data } = doc;
    try {
      await collection.doc(id).set(data);
      console.log(`✅ Successfully uploaded ${collectionName}/${id}`);
    } catch (error) {
      console.error(`❌ Error uploading ${collectionName}/${id}:`, error);
    }
  }
}

// Main function to upload all data
async function uploadAllData() {
  console.log('🚀 Starting data upload to Firebase...');
  
  // Upload bio data
  await uploadDocument('bio', 'main', portfolioData.bio.main);
  
  // Upload projects
  await uploadCollection('projects', portfolioData.projects);
  
  // Upload certifications
  await uploadDocument('certifications', 'list', portfolioData.certifications.list);
  
  // Upload contact information
  await uploadDocument('contact', 'info', portfolioData.contact.info);
  
  // Upload experiences
  await uploadCollection('experiences', portfolioData.experiences);
  
  // Upload education
  await uploadCollection('education', portfolioData.education);
  
  console.log('✨ All data has been uploaded to Firebase!');
  process.exit(0);
}

// Run the upload
uploadAllData().catch(error => {
  console.error('❌ Fatal error during upload:', error);
  process.exit(1);
});