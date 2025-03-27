/**
 * Creates matrix rain effect in the specified container
 * @param {number} numColumns Number of columns to create
 */
function createMatrixRain(numColumns = 60) {
    const container = document.getElementById('matrix-container');
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンー日本語';
    const columnWidth = window.innerWidth / numColumns;

    for (let col = 0; col < numColumns; col++) {
        const speed = Math.random() * 15 + 5; // Speed variation
        const delay = Math.random() * -20;
        const fontSize = Math.floor(Math.random() * 5) + 12; // Font size between 12px and 16px
        const opacity = Math.random() * 0.5 + 0.2; // Random opacity for depth effect

        const columnChar = document.createElement('div');
        columnChar.classList.add('matrix-char');
        columnChar.style.left = `${col * columnWidth}px`;
        columnChar.style.animationDuration = `${speed}s`;
        columnChar.style.animationDelay = `${delay}s`;
        columnChar.style.fontSize = `${fontSize}px`;
        columnChar.style.opacity = opacity;
        columnChar.textContent = chars[Math.floor(Math.random() * chars.length)];
        
        // Green color with slight variations
        const greenIntensity = Math.floor(Math.random() * 55) + 200; // 200-255
        columnChar.style.color = `rgb(0, ${greenIntensity}, ${Math.floor(greenIntensity/2)})`;

        container.appendChild(columnChar);
    }
    
    // Add animations to make it look more dynamic
    setInterval(() => {
        const matrixChars = document.querySelectorAll('.matrix-char');
        matrixChars.forEach(char => {
            // Randomly change characters
            if (Math.random() < 0.1) {
                char.textContent = chars[Math.floor(Math.random() * chars.length)];
            }
        });
    }, 1000);
}

/**
 * Clears the matrix rain effect
 */
function clearMatrixRain() {
    const matrixContainer = document.getElementById('matrix-container');
    if (matrixContainer) {
        matrixContainer.innerHTML = '';
    }
}

/**
 * Types text with a typewriter effect
 * @param {Terminal} term - The xterm.js terminal instance
 * @param {string} text - Text to animate
 * @param {number} speed - Typing speed in ms
 * @returns {Promise} Resolves when animation is complete
 */
function typeWriter(term, text, speed = 30) {
    return new Promise(resolve => {
        let i = 0;
        const lines = text.split('\n');
        
        function typeLine(lineIndex) {
            if (lineIndex >= lines.length) {
                resolve();
                return;
            }
            
            const line = lines[lineIndex];
            let charIndex = 0;
            
            function typeChar() {
                if (charIndex < line.length) {
                    term.write(line.charAt(charIndex));
                    charIndex++;
                    setTimeout(typeChar, Math.random() * speed + speed/2);
                } else {
                    term.write('\r\n');
                    setTimeout(() => typeLine(lineIndex + 1), speed);
                }
            }
            
            typeChar();
        }
        
        typeLine(0);
    });
}

/**
 * Creates a simulated network scan animation
 * @param {Terminal} term - The xterm.js terminal instance
 * @returns {Promise} Resolves when animation is complete
 */
function animateScan(term, target) {
    return new Promise(resolve => {
        term.write(`[🔍] Starting scan of ${target}...\r\n\r\n`);
        
        // Initial scan steps
        const scanSteps = [
            "Performing host discovery...",
            "Initiating ARP ping scan...",
            "Host is up (0.0042s latency).",
            "Scanning 1000 common ports...",
            "Service detection initiated..."
        ];
        
        // Open ports to display with animations
        const openPorts = [
            { port: 22, service: "ssh", banner: "OpenSSH 8.2p1" },
            { port: 80, service: "http", banner: "nginx 1.18.0" },
            { port: 443, service: "https", banner: "TLS v1.3" },
            { port: 3306, service: "mysql", banner: "MySQL 8.0.27" }
        ];
        
        // Animate the scan steps
        let stepIndex = 0;
        
        function showNextStep() {
            if (stepIndex < scanSteps.length) {
                term.write(`${scanSteps[stepIndex]}\r\n`);
                stepIndex++;
                setTimeout(showNextStep, 500);
            } else {
                showPortResults();
            }
        }
        
        function showPortResults() {
            term.write("\r\nPORT      STATE   SERVICE     VERSION\r\n");
            term.write("------------------------------------------\r\n");
            
            let portIndex = 0;
            
            function showNextPort() {
                if (portIndex < openPorts.length) {
                    const port = openPorts[portIndex];
                    // Simulate scanning progress
                    term.write(`Analyzing port ${port.port}... `);
                    
                    setTimeout(() => {
                        term.write(`\r${port.port}/tcp   open    ${port.service.padEnd(10)} ${port.banner}\r\n`);
                        portIndex++;
                        setTimeout(showNextPort, 800);
                    }, 600);
                } else {
                    finishScan();
                }
            }
            
            showNextPort();
        }
        
        function finishScan() {
            term.write("\r\nScan completed: 4 services detected\r\n");
            term.write("Scan duration: 5.78 seconds\r\n");
            
            setTimeout(() => {
                window.dispatchEvent(new CustomEvent('animation-complete', { detail: 'nmap' }));
                resolve();
            }, 500);
        }
        
        showNextStep();
    });
}

/**
 * Creates a hacking animation
 * @param {Terminal} term - The xterm.js terminal instance
 * @returns {Promise} Resolves when animation is complete
 */
async function animateHack(term) {
    // The hacking banner in green
    const hackBanner = `\x1b[32m
██╗░░██╗░█████╗░░█████╗░██╗░░██╗██╗███╗░░██╗░██████╗░
██║░░██║██╔══██╗██╔══██╗██║░██╔╝██║████╗░██║██╔════╝░
███████║███████║██║░░╚═╝█████═╝░██║██╔██╗██║██║░░██╗░
██╔══██║██╔══██║██║░░██╗██╔═██╗░██║██║╚████║██║░░╚██╗
██║░░██║██║░░██║╚█████╔╝██║░╚██╗██║██║░╚███║╚██████╔╝
╚═╝░░╚═╝╚═╝░░╚═╝░╚════╝░╚═╝░░╚═╝╚═╝╚═╝░░╚══╝░╚═════╝░
\x1b[0m`;
    
    // Display the banner first
    term.write(hackBanner + '\r\n\r\n');
    
    // Hack sequence steps
    const hackSteps = [
        { text: "Bypassing security measures...", delay: 1000 },
        { text: "Analyzing network topology...", delay: 800 },
        { text: "Searching for vulnerabilities...", delay: 1200 },
        { text: "CVE-2023-9876 detected! Exploiting...", delay: 1500 },
        { text: "\x1b[31mAccess denied. Initiating brute force...\x1b[0m", delay: 1000 },
        { text: "Generating password combinations...", delay: 900 },
        { text: "Testing password: ********", delay: 600 },
        { text: "Testing password: ************", delay: 500 },
        { text: "Testing password: **************", delay: 400 },
        { text: "\x1b[32mPassword match found!\x1b[0m", delay: 1000 },
        { text: "Establishing secure connection...", delay: 800 },
        { text: "Bypassing 2FA mechanisms...", delay: 1100 },
        { text: "Escalating privileges...", delay: 900 },
        { text: "\x1b[32mRoot access granted!\x1b[0m", delay: 1200 },
        { text: "Downloading sensitive data...", delay: 1500 },
        { text: "Covering tracks...", delay: 1000 },
        { text: "Erasing system logs...", delay: 700 },
        { text: "Implementing backdoor for future access...", delay: 1300 },
        { text: "\x1b[32mSystem compromised successfully!\x1b[0m", delay: 1000 }
    ];
    
    // Animate each step
    for (const step of hackSteps) {
        await typeWriter(term, step.text, 20);
        await new Promise(resolve => setTimeout(resolve, step.delay));
    }
    
    // Final message
    term.write('\r\n\r\n\x1b[33mDISCLAIMER: This is just a simulation! No actual hacking occurred.\x1b[0m\r\n');
    
    // Dispatch event that animation is complete
    window.dispatchEvent(new CustomEvent('animation-complete', { detail: 'hack' }));

    return "Hack simulation complete.";
}
