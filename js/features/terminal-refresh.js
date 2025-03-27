/**
 * Terminal Refresh Utility
 * Provides functions to refresh the terminal display
 */

// Function to refresh the terminal with the appropriate banner
function refreshTerminalDisplay(terminalInstance, currentPath = '/') {
    if (!terminalInstance || !window.getTerminalBanner) return;
    
    // Clear the terminal
    terminalInstance.clear();
    
    // Get appropriate banner based on screen size
    const banner = window.getTerminalBanner();
    
    // Write the banner
    terminalInstance.write(banner + '\r\n');
    
    // Show prompt with the current directory
    terminalInstance.write(`mohamedsalem:${currentPath}$ `);
}

// Export the refresh function to window for global access
window.refreshTerminalDisplay = refreshTerminalDisplay;

// Add event listener for screen size changes
window.addEventListener('resize', function() {
    // Store current state
    const oldWidth = window.innerWidth;
    
    // Use setTimeout to detect when resize is complete
    clearTimeout(window.resizeTimer);
    window.resizeTimer = setTimeout(function() {
        // Check if we crossed a breakpoint
        const wasMobile = oldWidth < 768;
        const wasTablet = oldWidth >= 768 && oldWidth < 1024;
        
        const isMobile = window.innerWidth < 768;
        const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
        
        // If we've crossed a breakpoint, refresh the terminal
        if ((wasMobile !== isMobile) || (wasTablet !== isTablet)) {
            if (window.term && typeof window.getCurrentPath === 'function') {
                refreshTerminalDisplay(window.term, window.getCurrentPath());
            }
        }
    }, 250);
});