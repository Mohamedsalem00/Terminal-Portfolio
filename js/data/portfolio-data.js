/**
 * Static portfolio data - used as fallback if Firebase fails
 */
const STATIC_PORTFOLIO_DATA = {
    bio: {
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
    },
    projects: [
        {
            name: "Gestion-de-Scolarite",
            description: "Plateforme de gestion des inscriptions et des notes scolaires",
            technologies: ["Laravel", "MySQL", "PHP"],
            githubLink: "https://github.com/mohamedsalem00/gestion-scolarite"
        },
        {
            name: "ProfsChezVous",
            description: "Application mobile mettant en relation professeurs et élèves pour des cours particuliers",
            technologies: ["Flutter", "Django", "REST API"],
            githubLink: "https://github.com/mohamedsalem00/profshezvous"
        }
    ],
    certifications: [
        "Oracle SQL (Great Learning)",
        "Introduction to Oracle SQL (DataCamp)"
    ],
    contact: {
        email: "mohamedsalemkhyarhoum@gmail.com",
        uiportfilio: "https://mohamedsalemkh.me",
        github: "https://github.com/mohamedsalem00",
        linkedin: "https://www.linkedin.com/in/mohamed-salem-kh",
        twitter: "@mohamedsalem"
    },
    experiences: [
        {
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
            institution: "iTeam University",
            degree: "Ingénieur en Sécurité des Systèmes Informatiques et Réseaux",
            period: "Septembre 2024 - Septembre 2027"
        },
        {
            institution: "ISCAE",
            degree: "Licence en Développement Informatique",
            period: "Janvier 2021 - Juillet 2024"
        }
    ]
};

// Initialize global portfolio data with static data first
let PORTFOLIO_DATA = STATIC_PORTFOLIO_DATA;

// Create a function to load data and set up event listeners
function initializePortfolioData() {
    // Create a custom event for when data is loaded
    const dataLoadedEvent = new CustomEvent('portfolio-data-loaded');
    
    // Function to fetch and update data
    async function loadPortfolioData() {
        try {
            // Only proceed if Firebase is available
            if (typeof firebase !== 'undefined' && firebase.firestore) {
                console.log('Firebase is available, attempting to fetch data...');
                
                // Check if our fetchPortfolioData function is available from firebase-utils.js
                if (typeof fetchPortfolioData === 'function') {
                    const firebaseData = await fetchPortfolioData();
                    PORTFOLIO_DATA = firebaseData;
                    console.log('Firebase data loaded successfully!');
                } else {
                    console.warn('Firebase utility functions not available, using static data');
                }
            } else {
                console.warn('Firebase not initialized, using static data');
            }
        } catch (error) {
            console.error('Error loading data from Firebase:', error);
            console.log('Falling back to static data');
        } finally {
            // Dispatch event regardless of data source
            window.dispatchEvent(dataLoadedEvent);
        }
    }
    
    // Load data once the DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadPortfolioData);
    } else {
        // If already loaded, fetch data immediately
        loadPortfolioData();
    }
}

// Initialize the portfolio data system
initializePortfolioData();

document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM loaded, initializing terminal...');

    // Fetch portfolio data from Firebase
    if (typeof fetchPortfolioData === 'function') {
        try {
            await fetchPortfolioData();
        } catch (error) {
            console.error('Error loading portfolio data:', error);
            console.warn('Firebase data fetching function not found, using static data.');
        }
    }

    // First make sure the terminal container is visible
    const terminalElement = document.getElementById('terminal');
    if (!terminalElement) {
        console.error('Terminal element not found!');
        return;
    }

    // Check if Terminal class exists
    if (typeof Terminal === 'undefined') {
        console.error('Terminal is not defined! Make sure xterm.js is loaded properly.');
        return;
    }

    const term = new Terminal({
        cursorBlink: true,
        theme: {
            background: '#111827',
            foreground: '#10b981',
            cursor: '#10b981',
            black: '#1e293b',
            brightBlack: '#334155',
            red: '#ef4444',
            brightRed: '#f87171',
            green: '#10b981',
            brightGreen: '#34d399',
            yellow: '#f59e0b',
            brightYellow: '#fbbf24',
            blue: '#3b82f6',
            brightBlue: '#60a5fa',
            magenta: '#a855f7',
            brightMagenta: '#c084fc',
            cyan: '#06b6d4',
            brightCyan: '#22d3ee',
            white: '#e2e8f0',
            brightWhite: '#f8fafc'
        },
        fontFamily: 'Courier New, monospace',
        fontSize: 15,
        lineHeight: 1.2,
        letterSpacing: 0,
        fontWeight: 'normal',
        rendererType: 'canvas',
        scrollback: 1000,
        convertEol: true
    });

    // Make sure FitAddon is properly loaded
    let fitAddon;
    try {
        if (typeof FitAddon !== 'undefined') {
            fitAddon = new FitAddon.FitAddon();
        } else if (typeof window.FitAddon !== 'undefined') {
            fitAddon = new window.FitAddon.FitAddon();
        } else {
            console.error('FitAddon not found! Terminal may not resize properly.');
        }

        if (fitAddon) {
            term.loadAddon(fitAddon);
        }
    } catch (error) {
        console.error('Error initializing FitAddon:', error);
    }

    // Open the terminal in the container
    term.open(terminalElement);

    // Try to fit terminal after a short delay
    if (fitAddon) {
        setTimeout(() => {
            try {
                fitAddon.fit();
                console.log('Terminal fit successful');
            } catch (error) {
                console.error('Error fitting terminal:', error);
            }
        }, 100);
    }
    }
);

// ASCII Art Welcome Banner - with slight indentation for better appearance