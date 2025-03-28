document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM loaded, initializing terminal...');

    // First make sure the terminal container is visible
    const terminalElement = document.getElementById('terminal');
    if (!terminalElement) {
        console.error('Terminal element not found!');
        return;
    }

    // Check if Terminal class exists before anything else
    if (typeof Terminal === 'undefined') {
        console.error('Terminal is not defined! Make sure xterm.js is loaded properly.');
        return;
    }

    // Fetch portfolio data from Firebase (but don't await it yet to avoid blocking UI)
    let portfolioDataPromise;
    if (typeof fetchPortfolioData === 'function') {
        portfolioDataPromise = fetchPortfolioData().catch(error => {
            console.error('Error loading portfolio data:', error);
            console.warn('Firebase data fetching failed, using static data.');
            return STATIC_PORTFOLIO_DATA;
        });
    }

    // Initialize the terminal first to show UI immediately
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
        fontSize: 15, // Will be adjusted by responsive handler
        lineHeight: 1.2,
        letterSpacing: 0,
        fontWeight: 'normal',
        rendererType: 'canvas',
        scrollback: 1000,
        convertEol: true,
        disableStdin: false,
        rightClickSelectsWord: true,
        allowProposedApi: true
    });

    // Expose terminal instance to window for responsive handler
    window.term = term;

    // Setup FitAddon
    let fitAddon;
    try {
        if (typeof FitAddon !== 'undefined') {
            fitAddon = new FitAddon.FitAddon();
            window.fitAddon = fitAddon; // Expose fit addon to window
        } else if (typeof window.FitAddon !== 'undefined') {
            fitAddon = new window.FitAddon.FitAddon();
            window.fitAddon = fitAddon; // Expose fit addon to window
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

    // Fit terminal immediately
    if (fitAddon) {
        try {
            fitAddon.fit();
            console.log('Initial terminal fit successful');
        } catch (error) {
            console.error('Error fitting terminal:', error);
        }
    }

    // Now wait for the data before showing content
    if (portfolioDataPromise) {
        await portfolioDataPromise;
    }

    // ASCII Art Welcome Banner
    const banner = TERMINAL_BANNER;

    // Command history
    const commandHistory = [];
    let historyIndex = -1;

    // Create terminal commands
    const commands = createTerminalCommands(term);
    
    // List of available commands for tab completion
    const availableCommands = Object.keys(commands);

    // Write banner to terminal with proper line ending for proper cursor positioning
    term.write(banner + '\r\n');
    term.write('mohamedsalem:/$ '); // Initial prompt shows directory

    let commandBuffer = '';
    let cursorPosition = 0; // Track cursor position within the command

    // Setup key handler
    term.onKey(e => {
        const ev = e.domEvent;
        const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey;

        // Handle special keys
        if (ev.keyCode === 13) { // Enter
            handleEnterKey();
        } else if (ev.keyCode === 8) { // Backspace
            handleBackspaceKey();
        } else if (ev.keyCode === 9) { // Tab
            handleTabKey(ev);
        } else if (ev.keyCode === 37) { // Left arrow
            handleLeftArrow();
        } else if (ev.keyCode === 39) { // Right arrow
            handleRightArrow();  
        } else if (ev.keyCode === 38) { // Up arrow
            handleUpArrow();
        } else if (ev.keyCode === 40) { // Down arrow
            handleDownArrow();
        } else if (ev.keyCode === 46) { // Delete key
            handleDeleteKey();
        } else if (ev.keyCode === 36) { // Home key
            handleHomeKey();
        } else if (ev.keyCode === 35) { // End key
            handleEndKey();
        } else if (printable) {
            // Insert character at cursor position
            handleCharacterInput(e.key);
        }
    });

    // Handler for Enter key
    function handleEnterKey() {
        term.write('\r\n');
        
        // Process command
        const trimmedCommand = commandBuffer.trim();
        if (trimmedCommand) {
            // Add to command history
            commandHistory.push(trimmedCommand);
            historyIndex = commandHistory.length;

            // Split command and arguments
            const [cmd, ...args] = trimmedCommand.split(' ');
            
            // Set a flag for "command in progress" for animated commands
            let commandInProgress = false;
            
            // Execute command
            const commandFunc = commands[cmd];
            if (commandFunc) {
                const result = commandFunc(args);
                
                // If the command returns an empty string but isn't done (animation)
                // then it's still processing and we don't want to show the prompt yet
                if (result === "" && (cmd === "hack" || (cmd === "nmap" && args[0]))) {
                    commandInProgress = true;
                    
                    // Listen for a one-time event that signals animation completed
                    const animationDoneHandler = function() {
                        // Update prompt with current directory
                        let currentDir = "/";
                        if (commands.pwd && typeof commands.pwd === 'function') {
                            currentDir = commands.pwd();
                        }
                        term.write(`\r\nmohamedsalem:${currentDir}$ `);
                        window.removeEventListener('animation-complete', animationDoneHandler);
                    };
                    
                    window.addEventListener('animation-complete', animationDoneHandler);
                    
                    // Add a timeout fallback in case the event never fires
                    setTimeout(() => {
                        if (document.body.contains(animationDoneHandler)) {
                            window.removeEventListener('animation-complete', animationDoneHandler);
                            
                            // Update prompt with current directory
                            let currentDir = "/";
                            if (commands.pwd && typeof commands.pwd === 'function') {
                                currentDir = commands.pwd();
                            }
                            term.write(`\r\nmohamedsalem:${currentDir}$ `);
                        }
                    }, 30000); // 30 second timeout
                } else if (result) {
                    term.write(result + '\r\n');
                }
            } else if (cmd) {
                term.write(`\x1b[31mCommand not found: ${cmd}\x1b[0m\r\n`);
                term.write(`Tip: Type \x1b[33mhelp\x1b[0m to see available commands.\r\n`);
            }
            
            // Only show prompt if command isn't still processing
            if (!commandInProgress) {
                // Reset for next command
                commandBuffer = '';
                cursorPosition = 0;
                
                // Get current directory for prompt
                let currentDir = "/";
                if (commands.pwd && typeof commands.pwd === 'function') {
                    currentDir = commands.pwd();
                }
                
                // Update prompt with current directory
                term.write(`mohamedsalem:${currentDir}$ `);
            } else {
                // Just reset the buffer but don't show prompt yet
                commandBuffer = '';
                cursorPosition = 0;
            }
        } else {
            // Empty command, just show prompt
            commandBuffer = '';
            cursorPosition = 0;
            
            let currentDir = "/";
            if (commands.pwd && typeof commands.pwd === 'function') {
                currentDir = commands.pwd();
            }
            term.write(`mohamedsalem:${currentDir}$ `);
        }
    }

    // New improved handler for Backspace key
    function handleBackspaceKey() {
        if (cursorPosition > 0) {
            // Remove character at cursor position - 1
            const newBuffer = commandBuffer.substring(0, cursorPosition - 1) + 
                             commandBuffer.substring(cursorPosition);
            
            // Get current directory for prompt prefix
            let currentDir = "/";
            if (commands.pwd && typeof commands.pwd === 'function') {
                currentDir = commands.pwd();
            }
            
            // Redraw entire command line
            const promptPrefix = `mohamedsalem:${currentDir}$ `;
            term.write('\r' + promptPrefix);
            term.write(' '.repeat(commandBuffer.length)); // Clear the old command
            term.write('\r' + promptPrefix); // Write prompt again
            
            // Update buffer and cursor
            commandBuffer = newBuffer;
            cursorPosition--;
            
            // Write the updated command
            term.write(commandBuffer);
            
            // Move cursor back to correct position if needed
            if (cursorPosition < commandBuffer.length) {
                term.write('\b'.repeat(commandBuffer.length - cursorPosition));
            }
        }
    }

    // New function to handle character input at cursor position
    function handleCharacterInput(key) {
        // Insert character at cursor position
        const newBuffer = commandBuffer.substring(0, cursorPosition) + 
                         key + 
                         commandBuffer.substring(cursorPosition);
        
        // Get current directory for prompt prefix
        let currentDir = "/";
        if (commands.pwd && typeof commands.pwd === 'function') {
            currentDir = commands.pwd();
        }
        
        // Redraw entire command line
        const promptPrefix = `mohamedsalem:${currentDir}$ `;
        term.write('\r' + promptPrefix);
        term.write(' '.repeat(commandBuffer.length)); // Clear the old command
        term.write('\r' + promptPrefix); // Write prompt again
        
        // Update buffer and cursor
        commandBuffer = newBuffer;
        cursorPosition++;
        
        // Write the updated command
        term.write(commandBuffer);
        
        // Move cursor back to correct position if needed
        if (cursorPosition < commandBuffer.length) {
            term.write('\b'.repeat(commandBuffer.length - cursorPosition));
        }
    }

    // Handler for Left arrow key
    function handleLeftArrow() {
        if (cursorPosition > 0) {
            cursorPosition--;
            term.write('\b'); // Move cursor left
        }
    }

    // Handler for Right arrow key
    function handleRightArrow() {
        if (cursorPosition < commandBuffer.length) {
            term.write(commandBuffer[cursorPosition]); // Move cursor right
            cursorPosition++;
        }
    }

    // Handler for Delete key
    function handleDeleteKey() {
        if (cursorPosition < commandBuffer.length) {
            // Remove character at cursor position
            const newBuffer = commandBuffer.substring(0, cursorPosition) + 
                             commandBuffer.substring(cursorPosition + 1);
            
            // Get current directory for prompt prefix
            let currentDir = "/";
            if (commands.pwd && typeof commands.pwd === 'function') {
                currentDir = commands.pwd();
            }
            
            // Redraw entire command line
            const promptPrefix = `mohamedsalem:${currentDir}$ `;
            term.write('\r' + promptPrefix);
            term.write(' '.repeat(commandBuffer.length)); // Clear the old command
            term.write('\r' + promptPrefix); // Write prompt again
            
            // Update buffer
            commandBuffer = newBuffer;
            
            // Write the updated command
            term.write(commandBuffer);
            
            // Move cursor back to correct position
            if (cursorPosition < commandBuffer.length) {
                term.write('\b'.repeat(commandBuffer.length - cursorPosition));
            }
        }
    }

    // Handler for Home key
    function handleHomeKey() {
        // Move cursor to beginning of command
        if (cursorPosition > 0) {
            term.write('\b'.repeat(cursorPosition));
            cursorPosition = 0;
        }
    }

    // Handler for End key
    function handleEndKey() {
        // Move cursor to end of command
        if (cursorPosition < commandBuffer.length) {
            term.write(commandBuffer.substring(cursorPosition));
            cursorPosition = commandBuffer.length;
        }
    }

    // Update your handleUpArrow function
    function handleUpArrow() {
        if (historyIndex > 0) {
            historyIndex--;
            
            // Get current directory
            let currentDir = "/";
            if (commands.pwd && typeof commands.pwd === 'function') {
                currentDir = commands.pwd();
            }
            
            // Clear current line
            const promptPrefix = `mohamedsalem:${currentDir}$ `;
            term.write('\r' + promptPrefix);
            term.write(' '.repeat(commandBuffer.length)); // Clear the old command
            term.write('\r' + promptPrefix); // Write prompt again
            
            // Set and display command from history
            commandBuffer = commandHistory[historyIndex];
            cursorPosition = commandBuffer.length; // Move cursor to end
            term.write(commandBuffer);
        }
    }

    // Update your handleDownArrow function
    function handleDownArrow() {
        // Get current directory
        let currentDir = "/";
        if (commands.pwd && typeof commands.pwd === 'function') {
            currentDir = commands.pwd();
        }
        
        // Clear current line
        const promptPrefix = `mohamedsalem:${currentDir}$ `;
        term.write('\r' + promptPrefix);
        term.write(' '.repeat(commandBuffer.length)); // Clear the old command
        term.write('\r' + promptPrefix); // Write prompt again
        
        if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
            
            // Set and display command from history
            commandBuffer = commandHistory[historyIndex];
            cursorPosition = commandBuffer.length; // Move cursor to end
            term.write(commandBuffer);
        } else if (historyIndex === commandHistory.length - 1) {
            // Reset to empty command
            historyIndex = commandHistory.length;
            commandBuffer = '';
            cursorPosition = 0;
        }
    }

    // Improved tab completion handler with better display and user experience
    function handleTabKey(ev) {
        ev.preventDefault(); // Prevent default tab behavior
        
        if (commandBuffer.length === 0) {
            // If command is empty, show all available commands
            term.write('\r\n');
            
            // Group commands by category for better organization
            const systemCommands = ['ls', 'cd', 'cat', 'pwd', 'clear', 'help'];
            const navigationCommands = ['browse', 'open', 'goto'];
            const portfolioCommands = ['whoami', 'projects', 'experience', 'education', 'certs', 'contact'];
            const funCommands = ['matrix', 'hack', 'nmap', 'sudo'];
            
            term.write('\x1b[1;33mSystem Commands:\x1b[0m ' + systemCommands.join(', ') + '\r\n');
            term.write('\x1b[1;33mNavigation Commands:\x1b[0m ' + navigationCommands.join(', ') + '\r\n');
            term.write('\x1b[1;33mPortfolio Commands:\x1b[0m ' + portfolioCommands.join(', ') + '\r\n');
            term.write('\x1b[1;33mFun Commands:\x1b[0m ' + funCommands.join(', ') + '\r\n');
            
            // Update prompt
            let currentDir = commands.pwd ? commands.pwd() : "/";
            term.write(`\r\nmohamedsalem:${currentDir}$ `);
            return;
        }
        
        // Get completion suggestions
        const matches = commands.tabComplete(commandBuffer);
        
        if (matches.length === 1) {
            // Exact match - complete the command
            let currentDir = "/";
            if (commands.pwd && typeof commands.pwd === 'function') {
                currentDir = commands.pwd();
            }
            
            const promptPrefix = `mohamedsalem:${currentDir}$ `;
            term.write('\r' + promptPrefix);
            term.write(' '.repeat(commandBuffer.length)); // Clear old command
            term.write('\r' + promptPrefix);
            
            // Update command and cursor
            commandBuffer = matches[0];
            cursorPosition = commandBuffer.length;
            term.write(commandBuffer);
        } else if (matches.length > 1) {
            // Multiple matches - show options
            term.write('\r\n');
            
            let commonPrefix = matches[0];
            const isPathCompletion = matches[0].includes(' ');
            
            if (isPathCompletion) {
                // Path completion - show in columns with colors
                const paths = matches.map(m => {
                    const parts = m.split(' ');
                    return parts.slice(1).join(' ');
                });
                
                // Create formatted columns with colors
                const maxLength = Math.max(...paths.map(p => p.length)) + 2;
                const termWidth = term.cols;
                const colsPerRow = Math.max(1, Math.floor(termWidth / maxLength));
                
                for (let i = 0; i < paths.length; i += colsPerRow) {
                    const row = paths.slice(i, i + colsPerRow);
                    let rowText = '';
                    
                    for (const path of row) {
                        // Color directories blue, executables green
                        if (path.endsWith('/')) {
                            rowText += `\x1b[1;34m${path.padEnd(maxLength)}\x1b[0m`;
                        } else if (path.includes('/bin/')) {
                            rowText += `\x1b[1;32m${path.padEnd(maxLength)}\x1b[0m`;
                        } else {
                            rowText += path.padEnd(maxLength);
                        }
                    }
                    
                    term.write(rowText + '\r\n');
                }
            } else {
                // Command completion - show in a single row
                term.write(matches.join('  ') + '\r\n');
            }
            
            // Find common prefix to auto-complete partial command
            for (let i = 1; i < matches.length; i++) {
                let j = 0;
                while (j < commonPrefix.length && j < matches[i].length && 
                       commonPrefix[j] === matches[i][j]) {
                    j++;
                }
                commonPrefix = commonPrefix.substring(0, j);
            }
            
            // Get current directory
            let currentDir = "/";
            if (commands.pwd && typeof commands.pwd === 'function') {
                currentDir = commands.pwd();
            }
            
            // Redraw command line with common prefix if applicable
            const promptPrefix = `mohamedsalem:${currentDir}$ `;
            term.write(promptPrefix);
            
            if (commonPrefix.length > commandBuffer.length) {
                commandBuffer = commonPrefix;
                cursorPosition = commandBuffer.length;
            }
            
            term.write(commandBuffer);
        } else {
            // No matches - maybe give a helpful hint?
            term.write('\r\n');
            term.write('\x1b[33mNo matching commands or files.\x1b[0m\r\n');
            
            // Give more context if they're trying to tab complete a path
            if (commandBuffer.includes(' ')) {
                term.write('\x1b[33mTip: Use "ls" to see available files in the current directory.\x1b[0m\r\n');
            } else {
                term.write('\x1b[33mTip: Type "help" to see all available commands.\x1b[0m\r\n');
            }
            
            // Update prompt
            let currentDir = commands.pwd ? commands.pwd() : "/";
            term.write(`mohamedsalem:${currentDir}$ ${commandBuffer}`);
        }
    }

    // Make the terminal window responsive
    window.addEventListener('resize', () => {
        if (fitAddon) {
            try {
                fitAddon.fit();
            } catch (error) {
                console.error('Error resizing terminal:', error);
            }
        }
    });

    // Add this code after the existing resize handler in your app.js file (around line 496)

    // Add a global function to update terminal content based on screen size
    window.updateTerminalForScreenSize = function() {
        // Only run this if we have the terminal and commands initialized
        if (window.term && window.getTerminalBanner) {
            const isMobile = window.innerWidth < 768; 
            const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
            
            // Add a command to dynamically switch banners
            if (!commands.screen) {
                commands.screen = function() {
                    // Clear the terminal
                    term.clear();
                    
                    // Get the appropriate banner for current screen size
                    const updatedBanner = window.getTerminalBanner();
                    
                    // Write banner to terminal
                    term.write(updatedBanner + '\r\n');
                    
                    // Get current directory for prompt
                    let currentDir = "/";
                    if (commands.pwd && typeof commands.pwd === 'function') {
                        currentDir = commands.pwd();
                    }
                    
                    // Update prompt with current directory
                    term.write(`mohamedsalem:${currentDir}$ `);
                    
                    return '';
                };
            }
        }
    };

    // Make the terminal window fully responsive with content adjustment
    window.addEventListener('resize', debounce(() => {
        // First fit the terminal to the new size
        if (fitAddon) {
            try {
                fitAddon.fit();
            } catch (error) {
                console.error('Error resizing terminal:', error);
            }
        }
        
        // Then check if we need to adjust content for screen size
        const wasMobile = window.lastScreenState === 'mobile';
        const wasTablet = window.lastScreenState === 'tablet';
        const wasDesktop = window.lastScreenState === 'desktop';
        
        const isMobile = window.innerWidth < 768;
        const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
        const isDesktop = window.innerWidth >= 1024;
        
        // Save current state for next comparison
        window.lastScreenState = isMobile ? 'mobile' : (isTablet ? 'tablet' : 'desktop');
        
        // If we cross a breakpoint boundary, clear the terminal and show the new banner
        if ((wasMobile && !isMobile) || (!wasMobile && isMobile) ||
            (wasTablet && !isTablet) || (!wasTablet && isTablet) ||
            (wasDesktop && !isDesktop) || (!wasDesktop && isDesktop)) {
            
            // Clear the terminal
            term.clear();
            
            // Get the appropriate banner for the new screen size
            const updatedBanner = window.getTerminalBanner(); 
            
            // Write the updated banner
            term.write(updatedBanner + '\r\n');
            
            // Restore prompt with current directory
            let currentDir = "/";
            if (commands.pwd && typeof commands.pwd === 'function') {
                currentDir = commands.pwd();
            }
            
            // Update prompt with current directory
            term.write(`mohamedsalem:${currentDir}$ `);
            
            // Update font size based on screen size
            if (isMobile) {
                term.options.fontSize = 13;
            } else if (isTablet) {
                term.options.fontSize = 14;
            } else {
                term.options.fontSize = 15;
            }
            
            // Refit terminal after font size change
            if (fitAddon) {
                setTimeout(() => {
                    try {
                        fitAddon.fit();
                    } catch (error) {
                        console.error('Error fitting terminal after font size change:', error);
                    }
                }, 50);
            }
        }
    }, 300));

    // Utility function to debounce resize events
    function debounce(func, delay) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), delay);
        };
    }

    // Initialize screen state on first load
    window.lastScreenState = window.innerWidth < 768 ? 'mobile' : 
                            (window.innerWidth < 1024 ? 'tablet' : 'desktop');

    // Add interaction for terminal header buttons
    const closeButton = document.querySelector('.terminal-button.close');
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            const container = document.querySelector('.terminal-container');
            if (container.style.display === 'none') {
                container.style.display = 'block';
            } else {
                container.style.display = 'none';
                setTimeout(() => {
                    container.style.display = 'block';
                }, 1000);
            }
        });
    }

    // Log successful initialization
    console.log('Terminal initialized successfully');

    // Add this inside your DOMContentLoaded event listener, right after the key handler setup

    // Single consolidated Ctrl+C handler
    let ctrlCHandlerInstalled = false; // Flag to prevent duplicate handlers
    let ctrlCInProgress = false; // Flag to prevent multiple executions

    // Only install the handler if it hasn't been installed yet
    if (!ctrlCHandlerInstalled) {
        // First, remove any existing handlers
        if (term._customKeyEventHandler) {
            console.log('Removing existing key event handler');
            term._customKeyEventHandler = null;
        }

        // Then attach the single handler
        console.log('Attaching new key event handler');
        term.attachCustomKeyEventHandler((e) => {
            // Check for Ctrl+C
            if (e.ctrlKey && (e.key === 'c' || e.keyCode === 67)) {
                console.log('Ctrl+C detected');
                
                // Prevent multiple executions from rapid key presses
                if (ctrlCInProgress) {
                    console.log('Ctrl+C already in progress, ignoring duplicate');
                    return false;
                }
                
                // Set flag to prevent duplicate execution
                ctrlCInProgress = true;
                
                // Write ^C to indicate SIGINT
                term.write('^C');
                
                // Clear current command
                commandBuffer = '';
                cursorPosition = 0;
                
                // Write a new line and prompt
                term.write('\r\n');
                
                // Get current directory for prompt
                let currentDir = "/";
                if (commands.pwd && typeof commands.pwd === 'function') {
                    currentDir = commands.pwd();
                }
                
                // Update prompt with current directory
                term.write(`mohamedsalem:${currentDir}$ `);
                
                // Reset the flag after a short delay
                setTimeout(() => {
                    ctrlCInProgress = false;
                }, 200);
                
                return false; // Prevent default handling
            }
            
            return true; // Let other key events be processed normally
        });
        
        ctrlCHandlerInstalled = true;
    }

    // Define window.handleCtrlC for mobile helper to use
    window.handleCtrlC = function() {
        console.log('Mobile Ctrl+C handler called');
        
        // Prevent multiple executions
        if (ctrlCInProgress) {
            console.log('Ctrl+C already in progress, ignoring duplicate');
            return;
        }
        
        // Set flag to prevent duplicate execution
        ctrlCInProgress = true;
        
        // Write ^C to indicate SIGINT
        term.write('^C');
        
        // Clear current command
        commandBuffer = '';
        cursorPosition = 0;
        
        // Write a new line and prompt
        term.write('\r\n');
        
        // Get current directory for prompt
        let currentDir = "/";
        if (commands.pwd && typeof commands.pwd === 'function') {
            currentDir = commands.pwd();
        }
        
        // Update prompt with current directory
        term.write(`mohamedsalem:${currentDir}$ `);
        
        // Reset the flag after a short delay
        setTimeout(() => {
            ctrlCInProgress = false;
        }, 200);
    };

    // EXPOSE FUNCTIONS FOR MOBILE INPUT HELPER (consolidated in one place)
    // ----------------------------------------------------------------
    // Make these available globally for mobile helper
    window.term = term;
    window.commands = commands;
    window.commandBuffer = commandBuffer;
    window.cursorPosition = cursorPosition;
    
    // Function to process commands
    window.processCommand = function() {
        if (commandBuffer.trim()) {
            // Save command to history
            if (commandHistory.length === 0 || commandHistory[commandHistory.length - 1] !== commandBuffer) {
                commandHistory.push(commandBuffer);
            }
            historyIndex = commandHistory.length;
            
            // Process the command
            const command = commandBuffer.trim();
            const [cmd, ...args] = command.split(' ');
            
            const commandFunc = commands[cmd];
            if (commandFunc) {
                const result = commandFunc(args);
                if (result) {
                    term.write(result + '\r\n');
                }
            } else if (cmd) {
                term.write(`\x1b[31mCommand not found: ${cmd}\x1b[0m\r\n`);
                term.write(`Tip: Type \x1b[33mhelp\x1b[0m to see available commands.\r\n`);
            }
            
            // Reset buffer and cursor
            commandBuffer = '';
            cursorPosition = 0;
            
            // Show new prompt
            term.write('\r\n');
            
            // Get current directory for prompt
            let currentDir = "/";
            if (commands.pwd && typeof commands.pwd === 'function') {
                currentDir = commands.pwd();
            }
            
            // Update prompt with current directory
            term.write(`mohamedsalem:${currentDir}$ `);
        } else {
            // Empty command, just show a new prompt
            term.write('\r\n');
            
            // Get current directory for prompt
            let currentDir = "/";
            if (commands.pwd && typeof commands.pwd === 'function') {
                currentDir = commands.pwd();
            }
            
            // Update prompt with current directory
            term.write(`mohamedsalem:${currentDir}$ `);
        }
    };
    
    // Function for Tab completion
    window.handleTabCompletion = function() {
        handleTabKey({ preventDefault: () => {} });
    };
    
    // Function for Ctrl+C handling that mobile helper can call
    window.handleCtrlC = function() {
        // Write ^C to indicate SIGINT
        term.write('^C');
        
        // Clear current command
        commandBuffer = '';
        cursorPosition = 0;
        
        // Write a new line and prompt
        term.write('\r\n');
        
        // Get current directory for prompt
        let currentDir = "/";
        if (commands.pwd && typeof commands.pwd === 'function') {
            currentDir = commands.pwd();
        }
        
        // Update prompt with current directory
        term.write(`mohamedsalem:${currentDir}$ `);
    };
    
    // Function to get current path
    window.getCurrentPath = function() {
        if (commands.pwd && typeof commands.pwd === 'function') {
            return commands.pwd();
        }
        return '/';
    };
    
    // Helper function to run commands
    window.runCommand = function() {
        handleEnterKey();
    };
    
    // Additional helper for mobile Enter key
    term.textarea.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.keyCode === 13) {
            e.preventDefault();
            handleEnterKey();
            return false;
        }
    });
    
    // Detect iOS for mobile-specific fixes
    const isMobileIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    if (isMobileIOS) {
        // Add iOS-specific handlers here if needed
    }
    
    // End of the DOMContentLoaded event handler
});
