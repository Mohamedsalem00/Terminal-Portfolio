/**
 * Mobile Input Helper
 * Provides explicit keyboard controls for mobile devices
 */

document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for the terminal to fully initialize
    setTimeout(() => {
        setupMobileInputHelper();
    }, 1000);
    
    function setupMobileInputHelper() {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        
        // Create mobile input container
        const mobileInputContainer = document.createElement('div');
        mobileInputContainer.id = 'mobile-keyboard-helper';
        mobileInputContainer.innerHTML = `
            <div class="mobile-keyboard-bar">
                <button class="key-btn" data-key="Tab">Tab</button>
                <button class="key-btn" data-key="Enter">Enter</button>
                <button class="key-btn" data-key="ArrowUp">↑</button>
                <button class="key-btn" data-key="ArrowDown">↓</button>
                <button class="key-btn" data-key="ArrowLeft">←</button>
                <button class="key-btn" data-key="ArrowRight">→</button>
                <button class="key-btn" data-key="Ctrl-C">Ctrl+C</button>
                <button class="key-btn" data-key="clear">Clear</button>
            </div>
        `;
        document.body.appendChild(mobileInputContainer);
        
        // Add mobile-specific styles
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            #mobile-keyboard-helper {
                position: fixed;
                bottom: 0;
                left: 0;
                width: 100%;
                background-color: #1e293b;
                padding: 8px;
                z-index: 1000;
                display: block;
            }
            
            .mobile-keyboard-bar {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                justify-content: center;
            }
            
            .key-btn {
                background-color: #334155;
                color: #10b981;
                border: none;
                border-radius: 4px;
                padding: 12px 16px;
                font-weight: bold;
                font-size: 16px;
                min-width: 60px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            }
            
            .key-btn:active {
                background-color: #0f172a;
                transform: translateY(2px);
            }
            
            /* Hide on desktop */
            @media (min-width: 768px) {
                #mobile-keyboard-helper {
                    display: none;
                }
            }
            
            /* Adjust terminal padding when mobile keyboard is shown */
            .mobile-keyboard-active #terminal {
                padding-bottom: 70px;
            }
        `;
        document.head.appendChild(styleElement);
        
        // Only show on mobile devices
        if (!isMobile && !window.location.search.includes('showmobilekeyboard')) {
            mobileInputContainer.style.display = 'none';
        } else {
            document.body.classList.add('mobile-keyboard-active');
        }
        
        // Add click handlers to all buttons
        const keyButtons = document.querySelectorAll('.key-btn');
        keyButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const keyAction = this.getAttribute('data-key');
                handleKeyAction(keyAction);
            });
        });
        
        // Function to handle different key actions
        function handleKeyAction(action) {
            // Make sure the terminal exists
            if (!window.term) {
                console.error('Terminal not found');
                return;
            }
            
            // Handle special cases
            if (action === 'clear') {
                // Call the clear command
                if (typeof window.commands === 'object' && typeof window.commands.clear === 'function') {
                    window.commands.clear();
                } else {
                    // Fallback to direct terminal clear
                    window.term.clear();
                }
                return;
            }
            
            if (action === 'Ctrl-C') {
                // Call the global handler directly to avoid event triggering
                if (typeof window.handleCtrlC === 'function') {
                    window.handleCtrlC();
                } else {
                    // Fallback implementation if handler isn't available
                    console.log('Fallback Ctrl+C handler called'); // For debugging
                    
                    if (window.term) {
                        // Write ^C to indicate interrupt
                        window.term.write('^C');
                        
                        // Clear current command buffer
                        if (window.commandBuffer !== undefined) {
                            window.commandBuffer = '';
                        }
                        
                        // Reset cursor position
                        if (window.cursorPosition !== undefined) {
                            window.cursorPosition = 0;
                        }
                        
                        // Write a new line and prompt
                        window.term.write('\r\n');
                        
                        // Get current directory for prompt
                        let currentDir = "/";
                        if (typeof window.commands !== 'undefined' && 
                            typeof window.commands.pwd === 'function') {
                            currentDir = window.commands.pwd();
                        }
                        
                        // Write a new prompt
                        window.term.write(`mohamedsalem:${currentDir}$ `);
                    }
                }
                return;
            }
            
            if (action === 'Tab') {
                // Tab completion logic
                simulateKeyEvent('Tab');
                
                // Try direct tab completion if simulation doesn't work
                if (typeof window.handleTabCompletion === 'function') {
                    setTimeout(() => window.handleTabCompletion(), 10);
                }
                return;
            }
            
            if (action === 'Enter') {
                // Process the current command
                simulateKeyEvent('Enter');
                
                // Also try direct command execution to ensure it works
                if (typeof window.processCommand === 'function') {
                    setTimeout(() => window.processCommand(), 10);
                } else if (typeof window.handleEnterKey === 'function') {
                    setTimeout(() => window.handleEnterKey(), 10);
                }
                return;
            }
            
            // Handle arrow keys
            if (action.startsWith('Arrow')) {
                simulateKeyEvent(action);
                return;
            }
        }
        
        // Function to simulate keyboard events
        function simulateKeyEvent(keyName) {
            // Make sure term and term.textarea exist
            if (!window.term || !window.term.textarea) {
                console.error('Terminal textarea not found');
                return;
            }
            
            // Focus the terminal input
            window.term.textarea.focus();
            
            // Create and dispatch keydown event
            const event = new KeyboardEvent('keydown', {
                key: keyName,
                code: keyName === 'Tab' ? 'Tab' : 
                       keyName === 'Enter' ? 'Enter' : 
                       keyName,
                keyCode: keyName === 'Tab' ? 9 : 
                         keyName === 'Enter' ? 13 :
                         keyName === 'ArrowUp' ? 38 :
                         keyName === 'ArrowDown' ? 40 :
                         keyName === 'ArrowLeft' ? 37 :
                         keyName === 'ArrowRight' ? 39 : 0,
                which: keyName === 'Tab' ? 9 : 
                       keyName === 'Enter' ? 13 :
                       keyName === 'ArrowUp' ? 38 :
                       keyName === 'ArrowDown' ? 40 :
                       keyName === 'ArrowLeft' ? 37 :
                       keyName === 'ArrowRight' ? 39 : 0,
                bubbles: true,
                cancelable: true
            });
            
            // Dispatch the event
            window.term.textarea.dispatchEvent(event);
        }
    }
});