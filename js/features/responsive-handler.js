/**
 * Responsive features for the terminal portfolio
 * Handles device-specific behaviors and adaptations
 */

document.addEventListener('DOMContentLoaded', () => {
    // Get terminal instance from window
    let terminalInstance = null;
    let fitAddon = null;
    let fontSize = 15; // Default font size
    
    // Wait for terminal to be initialized
    const checkForTerminal = setInterval(() => {
        if (window.term) {
            terminalInstance = window.term;
            if (window.fitAddon) {
                fitAddon = window.fitAddon;
            }
            clearInterval(checkForTerminal);
            setupResponsiveFeatures();
        }
    }, 100);
    
    function setupResponsiveFeatures() {
        // Initialize based on device type
        updateDisplayForScreenSize();
        
        // Setup font size controls
        setupFontSizeControls();
        
        // Handle orientation changes
        window.addEventListener('orientationchange', handleOrientationChange);
        window.addEventListener('resize', debounce(handleResize, 200));
        
        // Initial orientation check
        checkOrientation();
    }
    
    function updateDisplayForScreenSize() {
        const isMobile = window.innerWidth < 768;
        const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
        
        // Set font size based on device
        if (isMobile) {
            fontSize = 13;
        } else if (isTablet) {
            fontSize = 14;
        } else {
            fontSize = 15;
        }
        
        // Apply font size
        if (terminalInstance) {
            terminalInstance.options.fontSize = fontSize;
            if (fitAddon) {
                fitAddon.fit();
            }
        }
        
        // Update terminal commands display if needed
        if (window.updateTerminalForScreenSize) {
            window.updateTerminalForScreenSize();
        }
    }
    
    function setupFontSizeControls() {
        const increaseBtn = document.getElementById('font-increase');
        const decreaseBtn = document.getElementById('font-decrease');
        
        if (increaseBtn && decreaseBtn && terminalInstance) {
            increaseBtn.addEventListener('click', () => {
                if (fontSize < 24) {
                    fontSize += 1;
                    terminalInstance.options.fontSize = fontSize;
                    if (fitAddon) {
                        fitAddon.fit();
                    }
                }
            });
            
            decreaseBtn.addEventListener('click', () => {
                if (fontSize > 10) {
                    fontSize -= 1;
                    terminalInstance.options.fontSize = fontSize;
                    if (fitAddon) {
                        fitAddon.fit();
                    }
                }
            });
        }
    }
    
    function handleOrientationChange() {
        // Small delay to ensure dimensions have updated
        setTimeout(() => {
            updateDisplayForScreenSize();
            checkOrientation();
        }, 200);
    }
    
    function handleResize() {
        const prevIsMobile = window.innerWidth < 768;
        const prevIsTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
        
        // Let the terminal resize first
        updateDisplayForScreenSize();
        checkOrientation();
        
        // Check if we crossed a breakpoint
        const isMobile = window.innerWidth < 768;
        const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
        
        // If we've crossed a breakpoint boundary, we should refresh the terminal display
        if ((prevIsMobile !== isMobile) || (prevIsTablet !== isTablet)) {
            if (terminalInstance && window.getTerminalBanner) {
                // Clear terminal
                terminalInstance.clear();
                
                // Display updated banner
                const newBanner = window.getTerminalBanner();
                terminalInstance.write(newBanner + '\r\n');
                
                // Add prompt (simple version - app.js will handle the full version)
                terminalInstance.write('mohamedsalem:~$ ');
            }
        }
    }
    
    function checkOrientation() {
        const landscapeHint = document.querySelector('.landscape-hint');
        if (!landscapeHint) return;
        
        const isLandscape = window.innerWidth > window.innerHeight;
        const isSmallScreen = window.innerWidth < 768;
        
        if (isLandscape && isSmallScreen) {
            landscapeHint.style.display = 'block';
        } else {
            landscapeHint.style.display = 'none';
        }
    }
    
    // Utility: Debounce function to limit rapid function calls
    function debounce(func, delay) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), delay);
        };
    }
    
    // Add keyboard detection
    document.addEventListener('keydown', handleKeyboardDetection);
    
    // Touch events will help detect mobile/tablet usage
    document.addEventListener('touchstart', handleTouchDetection, {passive: true});
    
    function handleKeyboardDetection() {
        // Set flag to indicate a hardware keyboard was detected
        window.hasHardwareKeyboard = true;
        // Remove listener once detected
        document.removeEventListener('keydown', handleKeyboardDetection);
    }
    
    function handleTouchDetection() {
        // Set flag to indicate touch device was detected
        window.isTouchDevice = true;
        
        // For touch devices, add special hover handling
        if (terminalInstance) {
            const terminalContainer = document.querySelector('.terminal-container');
            const controls = document.querySelector('.terminal-controls');
            
            if (terminalContainer && controls) {
                // For touch devices, show controls on tap
                terminalContainer.addEventListener('touchstart', () => {
                    controls.style.opacity = '1';
                    setTimeout(() => {
                        controls.style.opacity = '0.3';
                    }, 3000);
                }, {passive: true});
            }
        }
        
        // Remove listener once detected
        document.removeEventListener('touchstart', handleTouchDetection);
    }
});