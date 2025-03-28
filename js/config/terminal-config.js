/**
 * Terminal configuration settings
 */
const TERMINAL_CONFIG = {
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
};

// Helper function to get appropriate banner based on screen size
function getTerminalBanner() {
    // Use a smaller banner for mobile devices
    if (window.innerWidth < 768) {
        return `
    ███╗   ███╗ ███████╗
    ████╗ ████║ ██╔════╝
    ██╔████╔██║ ███████╗
    ██║╚██╔╝██║ ╚════██║
    ██║ ╚═╝ ██║ ███████║
    ╚═╝     ╚═╝ ╚══════╝
    
    \x1b[1m\x1b[38;5;47m👋 Mohamed Salem Terminal Portfolio\x1b[0m
    \x1b[1m\x1b[38;5;39m╭─────────────────────╮\x1b[0m
    \x1b[1m\x1b[38;5;39m│\x1b[0m \x1b[1m\x1b[38;5;47mv1.3.7 \x1b[38;5;220m[BETA]\x1b[0m \x1b[1m\x1b[38;5;39m│\x1b[0m
    \x1b[1m\x1b[38;5;39m╰─────────────────────╯\x1b[0m
    
    \x1b[38;5;220m📚 Commands:\x1b[0m \x1b[1mhelp\x1b[0m, \x1b[1mls\x1b[0m, \x1b[1mcd\x1b[0m, \x1b[1mcat\x1b[0m
    \x1b[38;5;81m✨ Try:\x1b[0m \x1b[1mhack\x1b[0m, \x1b[1mmatrix\x1b[0m, \x1b[1mgithub\x1b[0m
    \x1b[38;5;213m🔍 Content:\x1b[0m \x1b[1mprojects\x1b[0m, \x1b[1mexperience\x1b[0m
    
    Type \x1b[1mhelp\x1b[0m for more info
        `;
    }
    
    // Use medium banner for tablets
    if (window.innerWidth < 1024) {
        return `
    ███╗   ███╗ ██████╗ ██╗  ██╗ █████╗ ███╗   ███╗███████╗██████╗ 
    ████╗ ████║██╔═══██╗██║  ██║██╔══██╗████╗ ████║██╔════╝██╔══██╗
    ██╔████╔██║██║   ██║███████║███████║██╔████╔██║█████╗  ██║  ██║
    ██║╚██╔╝██║██║   ██║██╔══██║██╔══██║██║╚██╔╝██║██╔══╝  ██║  ██║
    ██║ ╚═╝ ██║╚██████╔╝██║  ██║██║  ██║██║ ╚═╝ ██║███████╗██████╔╝
    ╚═╝     ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝╚══════╝╚═════╝ 

    \x1b[1m\x1b[38;5;47mMohamed Salem - Terminal Portfolio\x1b[0m
    \x1b[1m\x1b[38;5;39m╭───────────────────────────────╮\x1b[0m
    \x1b[1m\x1b[38;5;39m│\x1b[0m \x1b[1m\x1b[38;5;47m🚀 v1.3.7 \x1b[38;5;220m[BETA]\x1b[0m \x1b[1m\x1b[38;5;39m│\x1b[0m
    \x1b[1m\x1b[38;5;39m╰───────────────────────────────╯\x1b[0m
    
    \x1b[1m\x1b[38;5;47mWelcome to my interactive terminal portfolio!\x1b[0m
    
    \x1b[38;5;220m📚 Available Commands:\x1b[0m
    • \x1b[1mhelp\x1b[0m - See all commands
    • \x1b[1mls\x1b[0m, \x1b[1mcd\x1b[0m, \x1b[1mcat\x1b[0m - Navigate files
    • \x1b[1mmatrix\x1b[0m, \x1b[1mhack\x1b[0m - Animations
    • \x1b[1mprojects\x1b[0m, \x1b[1mexperience\x1b[0m - View my work
    
    \x1b[38;5;74m💡 Tip:\x1b[0m Use \x1b[1mbrowse\x1b[0m command for easier navigation
        `;
    }
    
    // Full banner for desktop
    return `
    ███╗   ███╗ ██████╗ ██╗  ██╗ █████╗ ███╗   ███╗███████╗██████╗ 
    ████╗ ████║██╔═══██╗██║  ██║██╔══██╗████╗ ████║██╔════╝██╔══██╗
    ██╔████╔██║██║   ██║███████║███████║██╔████╔██║█████╗  ██║  ██║
    ██║╚██╔╝██║██║   ██║██╔══██║██╔══██║██║╚██╔╝██║██╔══╝  ██║  ██║
    ██║ ╚═╝ ██║╚██████╔╝██║  ██║██║  ██║██║ ╚═╝ ██║███████╗██████╔╝
    ╚═╝     ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝╚══════╝╚═════╝ 
    \x1b[1m\x1b[38;5;39m╭────────────────────────────────────╮\x1b[0m
    \x1b[1m\x1b[38;5;39m│\x1b[0m \x1b[1m\x1b[38;5;47m🚀 Terminal Portfolio v1.3.7 \x1b[38;5;220m[BETA]\x1b[0m \x1b[1m\x1b[38;5;39m│\x1b[0m
    \x1b[1m\x1b[38;5;39m╰────────────────────────────────────╯\x1b[0m
                                                                                                                                        
    \x1b[1m\x1b[38;5;47mHey there! 👋 Welcome to my interactive terminal portfolio!\x1b[0m
    
    \x1b[38;5;220m📚 Quick Start Guide:\x1b[0m
    • Type \x1b[1mhelp\x1b[0m to see all available commands
    • Use \x1b[1mls\x1b[0m to explore files in the current directory
    • Navigate with \x1b[1mcd\x1b[0m (try \x1b[1mcd projects\x1b[0m to see my work)
    • View files with \x1b[1mcat\x1b[0m (e.g. \x1b[1mcat about.txt\x1b[0m)
    • Press \x1b[1mTab\x1b[0m for smart command/path completion
    • Use \x1b[1marrow keys\x1b[0m to access command history

    \x1b[38;5;81m✨ Cool Things to Try:\x1b[0m
    • \x1b[1mhack\x1b[0m - Watch a simulated hacking sequence
    • \x1b[1mmatrix\x1b[0m - Activate the Matrix effect
    • \x1b[1mgithub\x1b[0m - Visit my GitHub profile
    • \x1b[1mnmap\x1b[0m localhost - Run a network scan simulation
    • \x1b[1msudo\x1b[0m - See what happens when you try to use sudo 😉

    \x1b[38;5;213m🔍 Discover My Work:\x1b[0m
    • \x1b[1mprojects\x1b[0m - View my portfolio projects
    • \x1b[1mexperience\x1b[0m - Check my work history
    • \x1b[1mskills\x1b[0m - See my technical skills
    • \x1b[1mcontact\x1b[0m - Find ways to get in touch

    \x1b[38;5;74m💡 Tip:\x1b[0m Type \x1b[1mbrowse\x1b[0m for an easy-to-use file browser
    `;
}

// Expose the function globally for responsive handler to use
window.getTerminalBanner = getTerminalBanner;

// Export the banner using the helper function
const TERMINAL_BANNER = getTerminalBanner();