/**
 * Creates and returns all terminal commands
 * @param {Terminal} term xterm.js Terminal instance 
 * @returns {Object} Object with command functions
 */
function createTerminalCommands(term) {
    // File system structure
    const fileSystem = {
        // Root directory
        "/": {
            type: "directory",
            children: {
                "about.txt": { type: "file", content: () => generateAboutContent() },
                "contact.txt": { type: "file", content: () => generateContactContent() },
                "skills.txt": { type: "file", content: () => generateSkillsContent() },
                "README.md": { type: "file", content: () => `# Welcome to Mohamed Salem's Terminal Portfolio\n\nNavigate through my portfolio using Linux-like commands.\nType 'help' to see available commands.\n` },
                "projects": {
                    type: "directory",
                    children: {}
                },
                "education": {
                    type: "directory",
                    children: {
                        "diplomas.txt": { type: "file", content: () => generateEducationContent() }
                    }
                },
                "experience": {
                    type: "directory",
                    children: {
                        "resume.txt": { type: "file", content: () => generateExperienceContent() }
                    }
                },
                "certifications": {
                    type: "directory",
                    children: {
                        "certs.txt": { type: "file", content: () => generateCertificationsContent() }
                    }
                },
                "bin": {
                    type: "directory",
                    children: {
                        "email": { type: "executable", action: () => openEmail() },
                        "gui": { type: "executable", action: () => openUIportfilio() },
                        "github": { type: "executable", action: () => openGithub() },
                        "linkedin": { type: "executable", action: () => openLinkedin() },
                        "twitter": { type: "executable", action: () => openTwitter() },
                        "matrix": { type: "executable", action: () => runMatrix() },
                        "hack": { type: "executable", action: () => runHack() },
                        "clear": { type: "executable", action: () => runClear() }
                    }
                }
            }
        }
    };
    
    // Add projects dynamically
    if (PORTFOLIO_DATA && PORTFOLIO_DATA.projects) {
        PORTFOLIO_DATA.projects.forEach(project => {
            fileSystem["/"].children.projects.children[project.name] = {
                type: "file",
                content: () => generateProjectContent(project)
            };
        });
    }
    
    // Current directory path (starting at root)
    let currentPath = "/";
    
    // Helper function to get current directory
    function getCurrentDirectory() {
        let dir = fileSystem["/"];
        if (currentPath === "/") return dir;
        
        const parts = currentPath.split("/").filter(Boolean);
        for (const part of parts) {
            dir = dir.children[part];
        }
        return dir;
    }
    
    // Helper function to resolve a path (absolute or relative)
    function resolvePath(path) {
        // Handle absolute paths
        if (path.startsWith("/")) {
            return path;
        }
        
        // Handle . and ..
        const parts = path.split("/");
        const currentParts = currentPath.split("/").filter(Boolean);
        
        for (const part of parts) {
            if (part === ".") continue;
            if (part === "..") {
                if (currentParts.length > 0) {
                    currentParts.pop();
                }
                continue;
            }
            currentParts.push(part);
        }
        
        return "/" + currentParts.join("/");
    }
    
    // Functions to generate content for different files
    function generateAboutContent() {
        const { name, title, description } = PORTFOLIO_DATA.bio;
        return `
[🕵️] ${name}
${title}

${description}
        `;
    }
    
    function generateSkillsContent() {
        const { skills } = PORTFOLIO_DATA.bio;
        return `
[🛠] Skills:
${skills.map(skill => `  • ${skill}`).join('\n')}
        `;
    }
    
    function generateContactContent() {
        const { email, github, linkedin, twitter } = PORTFOLIO_DATA.contact;
        return `
[📞] Contact Information:
  • Email:    ${email}
  • GitHub:   ${github}
  • LinkedIn: ${linkedin}
  • Twitter:  ${twitter}

# Run executables in /bin to open links directly:
  $ ./bin/email
  $ ./bin/github
  $ ./bin/linkedin
  $ ./bin/twitter
        `;
    }
    
    function generateProjectContent(project) {
        return `
[🔬] Project: ${project.name}
Description: ${project.description}

Technologies:
${project.technologies.map(tech => `  • ${tech}`).join('\n')}

GitHub: ${project.githubLink}
        `;
    }
    
    function generateEducationContent() {
        return `
[🎓] Education:
${PORTFOLIO_DATA.education.map(ed => 
    `  • ${ed.degree}
    ${ed.institution}
    ${ed.period}`
).join('\n\n')}
        `;
    }
    
    function generateExperienceContent() {
        return `
[💼] Professional Experience:
${PORTFOLIO_DATA.experiences.map(exp => 
    `  • ${exp.position} at ${exp.company}
    ${exp.period}
    ${exp.location}
    
    Tasks:
    ${exp.tasks.map(task => `      - ${task}`).join('\n')}`
).join('\n\n')}
        `;
    }
    
    function generateCertificationsContent() {
        return `
[🏆] Certifications:
${PORTFOLIO_DATA.certifications.map((cert, index) => 
    `  ${index + 1}. ${cert}`
).join('\n')}
        `;
    }
    
    // Action functions for executables
    function openEmail() {
        window.open(`mailto:${PORTFOLIO_DATA.contact.email}`);
        return `Opening email client with ${PORTFOLIO_DATA.contact.email}`;
    }
    function openUIportfilio() {
        window.open(PORTFOLIO_DATA.contact.uiportfilio, '_blank');
        return `Opening UI portfolio in new tab...`;
    }
    
    function openGithub() {
        window.open(PORTFOLIO_DATA.contact.github, '_blank');
        return `Opening GitHub profile in new tab...`;
    }
    
    function openLinkedin() {
        window.open(PORTFOLIO_DATA.contact.linkedin, '_blank');
        return `Opening LinkedIn profile in new tab...`;
    }
    
    function openTwitter() {
        window.open(PORTFOLIO_DATA.contact.twitter, '_blank');
        return `Opening Twitter profile in new tab...`;
    }
    
    function runMatrix() {
        const matrixContainer = document.getElementById('matrix-container');
        matrixContainer.innerHTML = ''; 
        createMatrixRain(50);
        return 'Matrix rain effect activated. Run "clear" to stop.';
    }
    
    function runHack() {
        return `
\x1b[31m
██╗░░██╗░█████╗░░█████╗░██╗░░██╗██╗███╗░░██╗░██████╗░...
██║░░██║██╔══██╗██╔══██╗██║░██╔╝██║████╗░██║██╔════╝░...
███████║███████║██║░░╚═╝█████═╝░██║██╔██╗██║██║░░██╗░...
██╔══██║██╔══██║██║░░██╗██╔═██╗░██║██║╚████║██║░░╚██╗...
██║░░██║██║░░██║╚█████╔╝██║░╚██╗██║██║░╚███║╚██████╔╝...
╚═╝░░╚═╝╚═╝░░╚═╝░╚════╝░╚═╝░░╚═╝╚═╝╚═╝░░╚══╝░╚═════╝░
\x1b[0m
Bypassing Firewall...
Cracking Encryption...
SYSTEM INFILTRATION IN PROGRESS...
        `;
    }
    
    function runClear() {
        clearMatrixRain();
        term.clear();
        return null;
    }

    // Add this function to your file system utilities to make navigation more user-friendly
    function autoCorrectPath(path) {
        // Handle special cases like typos or common errors
        
        // Convert paths with multiple slashes to single slashes
        path = path.replace(/\/+/g, '/');
        
        // Remove trailing slash (except for root)
        if (path !== '/' && path.endsWith('/')) {
            path = path.slice(0, -1);
        }
        
        // Case-insensitive matching for common directories
        if (path.toLowerCase() === '/projects' && !fileSystem['/'].children['projects']) {
            const possibleMatches = Object.keys(fileSystem['/'].children)
                .filter(name => name.toLowerCase() === 'projects');
            
            if (possibleMatches.length === 1) {
                return '/' + possibleMatches[0];
            }
        }
        
        // Auto-complete unique prefixes for common directories
        if (path.startsWith('/p')) {
            const rootDirs = Object.keys(fileSystem['/'].children)
                .filter(name => name.startsWith('p'));
            
            if (rootDirs.length === 1) {
                return '/' + rootDirs[0];
            }
        }
        
        return path;
    }

    // Map of executable commands that should be available globally
    const globalCommands = {
        'email': () => openEmail(),
        'gui': () => openUIportfilio(),
        'github': () => openGithub(),
        'linkedin': () => openLinkedin(), 
        'twitter': () => openTwitter(),
        'matrix': () => runMatrix(),
        'hack': () => runHack(),
        'clear': () => runClear()
    };

    // Terminal commands
    const commands = {
        pwd: () => {
            return currentPath;
        },
        
        ls: (args) => {
            let targetPath = currentPath;
            if (args.length > 0) {
                targetPath = resolvePath(args[0]);
            }
            
            // Navigate to the target directory
            let current = fileSystem["/"];
            if (targetPath !== "/") {
                const parts = targetPath.split("/").filter(Boolean);
                for (const part of parts) {
                    if (!current.children || !current.children[part]) {
                        return `ls: cannot access '${targetPath}': No such file or directory`;
                    }
                    current = current.children[part];
                }
            }
            
            if (current.type !== "directory") {
                return `ls: cannot list '${targetPath}': Not a directory`;
            }
            
            // List contents
            const contents = Object.entries(current.children).map(([name, item]) => {
                if (item.type === "directory") {
                    return `\x1b[1;34m${name}/\x1b[0m`;  // Blue for directories
                } else if (item.type === "executable") {
                    return `\x1b[1;32m${name}*\x1b[0m`;  // Green for executables
                } else {
                    return name;
                }
            });
            
            return contents.join("  ");
        },
        
        cd: (args) => {
            if (args.length === 0 || args[0] === "~") {
                currentPath = "/";
                return "";
            }
            
            let rawPath = args[0];
            // Auto-correct the path for typos and common errors
            if (rawPath.startsWith('/')) {
                rawPath = autoCorrectPath(rawPath);
            }
            
            const newPath = resolvePath(rawPath);
            
            // Check if the path exists and is a directory
            let current = fileSystem["/"];
            if (newPath !== "/") {
                const parts = newPath.split("/").filter(Boolean);
                for (const part of parts) {
                    if (!current.children || !current.children[part]) {
                        return `cd: ${args[0]}: No such file or directory`;
                    }
                    current = current.children[part];
                }
            }
            
            if (current.type !== "directory") {
                return `cd: ${args[0]}: Not a directory`;
            }
            
            // Update current path
            currentPath = newPath;
            return "";
        },
        
        cat: (args) => {
            if (args.length === 0) {
                return "Usage: cat <filename>";
            }
            
            const filePath = resolvePath(args[0]);
            const pathParts = filePath.split("/").filter(Boolean);
            const fileName = pathParts.pop();
            
            let current = fileSystem["/"];
            for (const part of pathParts) {
                if (!current.children || !current.children[part]) {
                    return `cat: ${args[0]}: No such file or directory`;
                }
                current = current.children[part];
            }
            
            if (!current.children || !current.children[fileName]) {
                return `cat: ${args[0]}: No such file or directory`;
            }
            
            const file = current.children[fileName];
            if (file.type !== "file") {
                return `cat: ${args[0]}: Not a regular file`;
            }
            
            return file.content();
        },
        
        // Execute a file (for bin executables)
        exec: (args) => {
            if (args.length === 0) {
                return "Usage: ./filename or exec filename";
            }
            
            let filename = args[0];
            // Strip ./ prefix if present
            if (filename.startsWith("./")) {
                filename = filename.substring(2);
            }
            
            const filePath = resolvePath(filename);
            const pathParts = filePath.split("/").filter(Boolean);
            const execName = pathParts.pop();
            
            let current = fileSystem["/"];
            for (const part of pathParts) {
                if (!current.children || !current.children[part]) {
                    return `exec: ${args[0]}: No such file or directory`;
                }
                current = current.children[part];
            }
            
            if (!current.children || !current.children[execName]) {
                return `exec: ${args[0]}: No such file or directory`;
            }
            
            const file = current.children[execName];
            if (file.type !== "executable") {
                return `exec: ${args[0]}: Permission denied`;
            }
            
            return file.action();
        },
        
        // Shorthand for running executables with ./name syntax
        ".": (args) => {
            if (args.length < 2 || args[0] !== "/") {
                return `Usage: ./filename`;
            }
            return commands.exec([args.slice(1).join("")]);
        },
        
        // Keep old command names for backward compatibility
        whoami: () => {
            return commands.cat(["about.txt"]) + commands.cat(["skills.txt"]);
        },
        
        projects: () => {
            commands.cd(["projects"]);
            return commands.ls([]);
        },
        
        experience: () => {
            return commands.cat(["experience/resume.txt"]);
        },
        
        education: () => {
            return commands.cat(["education/diplomas.txt"]);
        },
        
        certs: () => {
            return commands.cat(["certifications/certs.txt"]);
        },
        
        contact: () => {
            return commands.cat(["contact.txt"]);
        },
        
        matrix: () => {
            return commands.exec(["bin/matrix"]);
        },
        
        hack: () => {
            // Start animation and return empty to not interfere
            animateHack(term)
                .then(result => {
                    // Animation completes here
                });
            return "";
        },
        
        clear: () => {
            return commands.exec(["bin/clear"]);
        },
        
        // Special sudo command
        sudo: (args) => {
            if (args[0] === 'su') {
                return `
\x1b[31m[!] ACCESS DENIED
Unauthorized Privilege Escalation Attempt Detected
Incident Logged @ ${new Date().toISOString()}
System Lockdown Initiated...
\x1b[0m
                `;
            }
            return 'Usage: sudo su';
        },
        
        // nmap command
        nmap: (args) => {
            if (args[0] === '127.0.0.1' || args[0] === 'localhost') {
                // Return immediately to allow the terminal to continue
                animateScan(term, args[0])
                    .then(result => {
                        // This will run after the animation completes
                        // We don't need to do anything here as the animation
                        // already writes to the terminal
                    });
                return "";  // Return empty string to not interfere with animation
            }
            return 'Usage: nmap 127.0.0.1 or nmap localhost';
        },
        
        help: () => {
            return `
[💡] \x1b[1mAvailable Linux-like Commands:\x1b[0m
  • \x1b[33mpwd\x1b[0m                - Print working directory
  • \x1b[33mls\x1b[0m [path]          - List directory contents
  • \x1b[33mcd\x1b[0m [path]          - Change directory
  • \x1b[33mcat\x1b[0m [file]         - View file contents
  • \x1b[33m./[executable]\x1b[0m     - Run executable files in /bin
  
[📁] \x1b[1mFile System Structure:\x1b[0m
  • \x1b[34m/\x1b[0m                        - Root directory
  • \x1b[34m/about.txt\x1b[0m               - My professional bio
  • \x1b[34m/skills.txt\x1b[0m              - My technical skills
  • \x1b[34m/contact.txt\x1b[0m             - Contact information
  • \x1b[34m/projects/\x1b[0m               - My portfolio projects
  • \x1b[34m/experience/resume.txt\x1b[0m   - Work experience
  • \x1b[34m/education/diplomas.txt\x1b[0m  - Academic background
  • \x1b[34m/certifications/certs.txt\x1b[0m - Professional certifications
  • \x1b[34m/bin/\x1b[0m                    - Executable commands
  
[🚀] \x1b[1mGlobal Commands (Available Anywhere):\x1b[0m
  • \x1b[32memail\x1b[0m              - Open email client
  • \x1b[32mgui\x1b[0m                - Open UI portfolio
  • \x1b[32mgithub\x1b[0m             - Open GitHub profile
  • \x1b[32mlinkedin\x1b[0m           - Open LinkedIn profile
  • \x1b[32mtwitter\x1b[0m            - Open Twitter profile
  • \x1b[32mmatrix\x1b[0m             - Activate matrix effect
  • \x1b[32mhack\x1b[0m               - Simulate hacking animation
  • \x1b[32mclear\x1b[0m              - Clear the terminal
  • \x1b[32mreset\x1b[0m              - Reset view for current screen size
  • \x1b[32mrefresh\x1b[0m            - Reload data from Firebase
  
[📔] \x1b[1mUsage Examples:\x1b[0m
  • \x1b[33mcd projects\x1b[0m                - Navigate to projects directory
  • \x1b[33mls /bin\x1b[0m                    - List all executables
  • \x1b[33mcat /projects/ProfsChezVous\x1b[0m - View project details
  • \x1b[33memail\x1b[0m                      - Open email client from anywhere
  • \x1b[33mpwd\x1b[0m                        - Show your current directory
  
[⌨️] \x1b[1mNavigation Tips:\x1b[0m
  • Use \x1b[33mTab\x1b[0m key for command and path completion
  • Use \x1b[33mUp/Down\x1b[0m arrow keys to navigate command history
  • Type \x1b[33mclear\x1b[0m to clear the terminal screen
`;
        }
    };

    // Add a friendly file browser command
    commands.browse = () => {
        const current = getCurrentDirectory();
        
        // Create a numbered list of files and directories
        const entries = Object.entries(current.children).sort(([nameA, itemA], [nameB, itemB]) => {
            // Sort directories first, then files
            if (itemA.type === 'directory' && itemB.type !== 'directory') return -1;
            if (itemA.type !== 'directory' && itemB.type === 'directory') return 1;
            return nameA.localeCompare(nameB);
        });

        let result = `\x1b[1;36m===== File Browser: ${currentPath} =====\x1b[0m\r\n\r\n`;
        
        if (currentPath !== '/') {
            result += `0. \x1b[1;34m..\x1b[0m (Parent Directory)\r\n`;
        }
        
        entries.forEach(([name, item], index) => {
            if (item.type === 'directory') {
                result += `${index + 1}. \x1b[1;34m${name}/\x1b[0m\r\n`;
            } else if (item.type === 'executable') {
                result += `${index + 1}. \x1b[1;32m${name}*\x1b[0m\r\n`;
            } else {
                result += `${index + 1}. ${name}\r\n`;
            }
        });
          
        result += `\r\n\x1b[33mType 'open [number]' to view a file or enter a directory\x1b[0m`;
        return result;
    };

    // Add a command to navigate based on the number from browse
    commands.open = (args) => {
        if (args.length === 0 || !/^\d+$/.test(args[0])) {
            return "Usage: open [number] - Open a file or directory listed by 'browse'";
        }
        
        const number = parseInt(args[0], 10);
        const current = getCurrentDirectory();
        const entries = Object.entries(current.children).sort(([nameA, itemA], [nameB, itemB]) => {
            if (itemA.type === 'directory' && itemB.type !== 'directory') return -1;
            if (itemA.type !== 'directory' && itemB.type === 'directory') return 1;
            return nameA.localeCompare(nameB);
        });
        
        if (number === 0 && currentPath !== '/') {
            // Go to parent directory
            const parts = currentPath.split('/').filter(Boolean);
            parts.pop();
            currentPath = '/' + parts.join('/');
            return commands.browse();
        }
        
        if (number < 1 || number > entries.length) {
            return `Error: No item with number ${number}`;
        }
        
        const [name, item] = entries[number - 1];
        
        if (item.type === 'directory') {
            // Navigate to directory
            currentPath = currentPath === '/' ? `/${name}` : `${currentPath}/${name}`;
            return commands.browse();
        } else if (item.type === 'file') {
            // View file contents
            return item.content();
        } else if (item.type === 'executable') {
            // Execute command
            return item.action();
        }
                
        return `Error: Couldn't open ${name}`;
    };

    // Update the tabComplete method to be more robust
    commands.tabComplete = (partialCommand) => {
        if (!partialCommand) return [];
        
        // Handle command completion when there's no space
        if (!partialCommand.includes(' ')) {
            // Filter commands that start with the partial input
            const cmdMatches = Object.keys(commands)
                .filter(cmd => 
                    cmd.startsWith(partialCommand) && 
                    typeof commands[cmd] === 'function' &&
                    !['tabComplete', '.'].includes(cmd)
                );
            return cmdMatches;
        }
        
        // Handle path completion for commands like cd, ls, cat
        const parts = partialCommand.split(' ');
        const cmd = parts[0];
        
        // Only process tab completion for file-related commands
        if (['cd', 'ls', 'cat', 'open', 'exec'].includes(cmd)) {
            const argPart = parts.slice(1).join(' ').trim();
            
            // Get the directory path and filename prefix to complete
            const lastSlashIndex = argPart.lastIndexOf('/');
            let dirPath, filePrefix;
            
            if (lastSlashIndex === -1) {
                // No slash - we're looking in the current directory
                dirPath = currentPath;
                filePrefix = argPart;
            } else if (lastSlashIndex === 0) {
                // Starts with / - absolute path
                dirPath = '/';
                filePrefix = argPart.substring(1);
            } else {
                // Path with directories
                const pathPart = argPart.substring(0, lastSlashIndex);
                filePrefix = argPart.substring(lastSlashIndex + 1);
                   
                // Resolve the directory path (could be relative or absolute)
                dirPath = resolvePath(pathPart);
            }
            
            // Navigate to the target directory in our virtual filesystem
            let currentDir = fileSystem["/"];
            if (dirPath !== "/" && dirPath !== "") {
                const pathParts = dirPath.split("/").filter(Boolean);
                let valid = true;
                
                for (const part of pathParts) {
                    if (!currentDir.children[part] || 
                        currentDir.children[part].type !== 'directory') {
                        valid = false;
                        break;
                    }
                    currentDir = currentDir.children[part];
                }
                
                if (!valid) return [];
            }
            
            // Find matching files and directories
            const matches = Object.entries(currentDir.children)
                .filter(([name]) => name.startsWith(filePrefix))
                .map(([name, item]) => {
                    // Format the path properly
                    let fullPath;
                    if (dirPath === '/') {
                        fullPath = '/' + name;
                    } else if (dirPath.endsWith('/')) {
                        fullPath = dirPath + name;
                    } else {
                        fullPath = dirPath + '/' + name;
                    }
                    
                    // Add trailing slash for directories
                    if (item.type === 'directory') {
                        fullPath += '/';
                    }
                            
                    return `${cmd} ${fullPath}`;
                });
                
            return matches;
        }
                
        return [];
    };

    // Add an easy-to-use goto command
    commands.goto = (args) => {
        if (args.length === 0) {
            return `
\x1b[1;36m===== Quick Navigation =====\x1b[0m

Choose a destination:
1. \x1b[34mProjects\x1b[0m           - View my portfolio projects
2. \x1b[34mExperience\x1b[0m         - See my work experience
3. \x1b[34mEducation\x1b[0m          - Check my academic background
4. \x1b[34mCertifications\x1b[0m     - View my certifications
5. \x1b[34mHome Directory\x1b[0m     - Return to root (/)
6. \x1b[34mBin Directory\x1b[0m      - Go to executable commands

Type \x1b[33mgoto [number]\x1b[0m to navigate.
`;
        }

        const destination = args[0];
        
        switch(destination) {
            case '1':
                currentPath = '/projects';
                return commands.ls([]);
            case '2':
                currentPath = '/experience';
                return commands.cat(['resume.txt']);
            case '3':
                currentPath = '/education';
                return commands.cat(['diplomas.txt']);
            case '4':
                currentPath = '/certifications';
                return commands.cat(['certs.txt']);
            case '5':
                currentPath = '/';
                return commands.ls([]);
            case '6':
                currentPath = '/bin';
                return commands.ls([]);
            default:
                return `Invalid destination. Type \x1b[33mgoto\x1b[0m without arguments to see available options.`;
        }
    };

    // Inside your commands object, add these handlers for the direct commands
    Object.keys(globalCommands).forEach(cmdName => {
        commands[cmdName] = () => {
            return globalCommands[cmdName]();
        };
    });

    // Add a screen reset command
    commands.reset = () => {
        if (typeof window.updateTerminalForScreenSize === 'function') {
            term.clear();
            
            // Get current banner
            const currentBanner = window.getTerminalBanner();
            term.write(currentBanner + '\r\n');
            
            // Show current directory in prompt
            let currentDir = commands.pwd();
            term.write(`mohamedsalem:${currentDir}$ `);
            
            return '';
        } else {
            return "Screen reset not available.";
        }
    };

    // Expose the current path for the terminal refresh utility
    window.getCurrentPath = () => currentPath;

    return commands;
}