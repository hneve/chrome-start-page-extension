class LinkManager {
    constructor() {
        this.groups = [];
        this.links = [];
        this.isDarkMode = true; // Default to dark mode
        this.colorSettings = {
            darkMode: {
                background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 25%, #2d2d2d 50%, #404040 75%, #525252 100%)',
                glassOpacity: 0.4,
                glassBackground: 'rgba(0, 0, 0, 0.4)',
                textColor: 'rgba(255, 255, 255, 0.75)'
            },
            lightMode: {
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)',
                glassOpacity: 0.25,
                glassBackground: 'rgba(255, 255, 255, 0.25)',
                textColor: 'rgba(255, 255, 255, 0.9)'
            }
        };
        this.init();
    }

    async init() {
        await this.loadData();
        this.applyGlassmorphism();
        this.attachEventListeners();
        this.render();
    }

    async loadData() {
        try {
            console.log('Loading data from storage...');
            const result = await chrome.storage.sync.get(['groups', 'links', 'isDarkMode', 'colorSettings']);
            console.log('Raw storage result:', result);
            
            this.groups = result.groups || [];
            this.links = result.links || [];
            this.isDarkMode = result.isDarkMode !== undefined ? result.isDarkMode : true;
            
            // Load custom color settings or use defaults
            if (result.colorSettings) {
                this.colorSettings = result.colorSettings;
            }
            
            // Clean up any old settings data
            await chrome.storage.sync.remove('settings');
            console.log('Removed old settings data from storage');
            
            console.log('Main page loaded groups:', this.groups.length);
            console.log('Main page loaded links:', this.links.length);
            console.log('Theme mode:', this.isDarkMode ? 'dark' : 'light');
            
        } catch (error) {
            console.error('Error loading from storage:', error);
        }
    }

    async saveData() {
        await chrome.storage.sync.set({
            groups: this.groups,
            links: this.links,
            isDarkMode: this.isDarkMode,
            colorSettings: this.colorSettings
        });
    }

    applyGlassmorphism() {
        // Apply beautiful glassmorphism styling to the page
        const body = document.body;
        const currentTheme = this.isDarkMode ? 'darkMode' : 'lightMode';
        const colors = this.colorSettings[currentTheme];
        
        // Theme-specific background
        body.style.cssText = `
            margin: 0;
            padding: 0;
            min-height: 100vh;
            background: ${colors.background};
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            overflow: hidden;
        `;

        // Add theme-aware CSS
        const style = document.createElement('style');
        style.textContent = this.isDarkMode ? this.getDarkModeCSS() : this.getLightModeCSS();
        document.head.appendChild(style);
    }

    getDarkModeCSS() {
        return `
            .glass-container {
                background: rgba(0, 0, 0, 0.4);
                backdrop-filter: blur(20px);
                -webkit-backdrop-filter: blur(20px);
                border-radius: 20px;
                border: 1px solid rgba(255, 255, 255, 0.08);
                box-shadow: 
                    0 8px 32px 0 rgba(0, 0, 0, 0.6),
                    inset 0 0 20px rgba(0, 0, 0, 0.3);
                padding: 2rem;
                width: 90%;
                height: 90vh;
                max-width: none;
                max-height: none;
                overflow-y: auto;
                overflow-x: hidden;
                box-sizing: border-box;
            }

            .glass-container::-webkit-scrollbar {
                width: 8px;
            }

            .glass-container::-webkit-scrollbar-track {
                background: rgba(0, 0, 0, 0.2);
                border-radius: 10px;
            }

            .glass-container::-webkit-scrollbar-thumb {
                background: rgba(255, 255, 255, 0.1);
                border-radius: 10px;
            }

            .glass-container::-webkit-scrollbar-thumb:hover {
                background: rgba(255, 255, 255, 0.2);
            }

            h1, h2, h3 {
                color: rgba(255, 255, 255, 0.85);
                text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
                margin-bottom: 1rem;
            }

            .group {
                background: rgba(0, 0, 0, 0.3);
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
                border-radius: 15px;
                border: 1px solid rgba(255, 255, 255, 0.05);
                padding: 1.5rem;
                margin-bottom: 0;
                box-shadow: 
                    0 4px 16px 0 rgba(0, 0, 0, 0.4),
                    inset 0 0 10px rgba(0, 0, 0, 0.2);
                min-width: 400px;
                max-width: 500px;
            }

            .links-grid {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 0.4rem;
                justify-content: center;
            }

            .link-item {
                background: rgba(0, 0, 0, 0.25);
                backdrop-filter: blur(8px);
                -webkit-backdrop-filter: blur(8px);
                border-radius: 8px;
                border: 1px solid rgba(255, 255, 255, 0.08);
                padding: 0.5rem;
                text-decoration: none;
                color: rgba(255, 255, 255, 0.75);
                transition: all 0.3s ease;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 0.5rem;
                min-width: 60px;
                max-width: 100px;
                text-align: center;
                box-shadow: 
                    0 2px 8px 0 rgba(0, 0, 0, 0.3),
                    inset 0 0 8px rgba(0, 0, 0, 0.1);
            }

            .link-item:hover {
                background: rgba(0, 0, 0, 0.35);
                transform: translateY(-2px);
                box-shadow: 
                    0 6px 20px 0 rgba(0, 0, 0, 0.5),
                    inset 0 0 12px rgba(0, 0, 0, 0.2);
                color: rgba(255, 255, 255, 0.9);
            }

            .link-icon {
                width: 24px;
                height: 24px;
                border-radius: 6px;
                background: rgba(0, 0, 0, 0.2);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                color: rgba(255, 255, 255, 0.6);
            }

            .link-text {
                font-weight: 500;
                font-size: 11px;
                line-height: 1.1;
                word-break: break-word;
                max-width: 100%;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
            }

            .add-btn {
                background: rgba(0, 0, 0, 0.3);
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.08);
                border-radius: 12px;
                color: rgba(255, 255, 255, 0.75);
                padding: 0.75rem 1.5rem;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 14px;
                font-weight: 500;
                box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.4);
            }

            .add-btn:hover {
                background: rgba(0, 0, 0, 0.4);
                transform: translateY(-1px);
                box-shadow: 0 6px 20px 0 rgba(0, 0, 0, 0.6);
                color: rgba(255, 255, 255, 0.9);
            }

            .add-group-btn {
                background: rgba(0, 0, 0, 0.3);
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.08);
                border-radius: 12px;
                color: rgba(255, 255, 255, 0.75);
                padding: 0.75rem 1.5rem;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 14px;
                font-weight: 500;
                box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.4);
            }

            .add-group-btn:hover {
                background: rgba(0, 0, 0, 0.4);
                transform: translateY(-1px);
                box-shadow: 0 6px 20px 0 rgba(0, 0, 0, 0.6);
                color: rgba(255, 255, 255, 0.9);
            }

            .theme-toggle-btn {
                background: rgba(0, 0, 0, 0.3);
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.08);
                border-radius: 12px;
                color: rgba(255, 255, 255, 0.75);
                padding: 0.75rem 1.5rem;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 14px;
                font-weight: 500;
                box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.4);
            }

            .theme-toggle-btn:hover {
                background: rgba(0, 0, 0, 0.4);
                transform: translateY(-1px);
                box-shadow: 0 6px 20px 0 rgba(0, 0, 0, 0.6);
                color: rgba(255, 255, 255, 0.9);
            }

            .color-settings-btn {
                background: rgba(0, 0, 0, 0.3);
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.08);
                border-radius: 12px;
                color: rgba(255, 255, 255, 0.75);
                padding: 0.75rem 1.5rem;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 14px;
                font-weight: 500;
                box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.4);
            }

            .color-settings-btn:hover {
                background: rgba(0, 0, 0, 0.4);
                transform: translateY(-1px);
                box-shadow: 0 6px 20px 0 rgba(0, 0, 0, 0.6);
                color: rgba(255, 255, 255, 0.9);
            }

            .menu-container {
                position: relative;
                display: inline-block;
                margin-bottom: 1rem;
            }

            .menu-toggle-btn {
                background: rgba(0, 0, 0, 0.3);
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.08);
                border-radius: 12px;
                color: rgba(255, 255, 255, 0.75);
                padding: 0.75rem 1.5rem;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 18px;
                font-weight: 500;
                box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.4);
                display: flex;
                align-items: center;
                justify-content: center;
                min-width: 50px;
            }

            .menu-toggle-btn:hover {
                background: rgba(0, 0, 0, 0.4);
                transform: translateY(-1px);
                box-shadow: 0 6px 20px 0 rgba(0, 0, 0, 0.6);
                color: rgba(255, 255, 255, 0.9);
            }

            .accordion-menu {
                position: absolute;
                top: 100%;
                left: 0;
                margin-top: 0.5rem;
                background: rgba(0, 0, 0, 0.4);
                backdrop-filter: blur(20px);
                -webkit-backdrop-filter: blur(20px);
                border-radius: 12px;
                border: 1px solid rgba(255, 255, 255, 0.08);
                box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.6);
                overflow: hidden;
                opacity: 0;
                visibility: hidden;
                transform: translateY(-10px);
                transition: all 0.3s ease;
                z-index: 1000;
                min-width: 200px;
            }

            .accordion-menu.active {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
            }

            .menu-item {
                background: transparent;
                border: none;
                color: rgba(255, 255, 255, 0.75);
                padding: 0.75rem 1rem;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 14px;
                font-weight: 500;
                text-align: left;
                width: 100%;
                display: block;
                border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            }

            .menu-item:last-child {
                border-bottom: none;
            }

            .menu-item:hover {
                background: rgba(255, 255, 255, 0.1);
                color: rgba(255, 255, 255, 0.9);
            }

            .menu-item:active {
                background: rgba(255, 255, 255, 0.15);
            }

            .empty-state {
                text-align: center;
                color: rgba(255, 255, 255, 0.5);
                font-style: italic;
                padding: 3rem;
            }

            .groups-container {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 2rem;
                padding: 1rem 0;
                overflow-y: auto;
                overflow-x: hidden;
                min-height: 400px;
                justify-items: center;
                align-items: start;
            }

            .groups-container::-webkit-scrollbar {
                width: 8px;
            }

            .groups-container::-webkit-scrollbar-track {
                background: rgba(0, 0, 0, 0.2);
                border-radius: 10px;
            }

            .groups-container::-webkit-scrollbar-thumb {
                background: rgba(255, 255, 255, 0.1);
                border-radius: 10px;
            }

            .groups-container::-webkit-scrollbar-thumb:hover {
                background: rgba(255, 255, 255, 0.2);
            }
        `;
    }

    getLightModeCSS() {
        return `
            .glass-container {
                background: rgba(255, 255, 255, 0.25);
                backdrop-filter: blur(20px);
                -webkit-backdrop-filter: blur(20px);
                border-radius: 20px;
                border: 1px solid rgba(255, 255, 255, 0.3);
                box-shadow: 
                    0 8px 32px 0 rgba(31, 38, 135, 0.15),
                    inset 0 0 20px rgba(255, 255, 255, 0.2);
                padding: 2rem;
                width: 90%;
                height: 90vh;
                max-width: none;
                max-height: none;
                overflow-y: auto;
                overflow-x: hidden;
                box-sizing: border-box;
            }

            .glass-container::-webkit-scrollbar {
                width: 8px;
            }

            .glass-container::-webkit-scrollbar-track {
                background: rgba(255, 255, 255, 0.1);
                border-radius: 10px;
            }

            .glass-container::-webkit-scrollbar-thumb {
                background: rgba(255, 255, 255, 0.4);
                border-radius: 10px;
            }

            .glass-container::-webkit-scrollbar-thumb:hover {
                background: rgba(255, 255, 255, 0.6);
            }

            h1, h2, h3 {
                color: rgba(255, 255, 255, 0.95);
                text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
                margin-bottom: 1rem;
            }

            .group {
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
                border-radius: 15px;
                border: 1px solid rgba(255, 255, 255, 0.2);
                padding: 1.5rem;
                margin-bottom: 0;
                box-shadow: 
                    0 4px 16px 0 rgba(31, 38, 135, 0.1),
                    inset 0 0 10px rgba(255, 255, 255, 0.05);
                min-width: 400px;
                max-width: 500px;
            }

            .links-grid {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 0.4rem;
                justify-content: center;
            }

            .link-item {
                background: rgba(255, 255, 255, 0.2);
                backdrop-filter: blur(8px);
                -webkit-backdrop-filter: blur(8px);
                border-radius: 8px;
                border: 1px solid rgba(255, 255, 255, 0.25);
                padding: 0.5rem;
                text-decoration: none;
                color: rgba(255, 255, 255, 0.9);
                transition: all 0.3s ease;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 0.5rem;
                min-width: 60px;
                max-width: 100px;
                text-align: center;
                box-shadow: 
                    0 2px 8px 0 rgba(31, 38, 135, 0.1),
                    inset 0 0 8px rgba(255, 255, 255, 0.02);
            }

            .link-item:hover {
                background: rgba(255, 255, 255, 0.3);
                transform: translateY(-2px);
                box-shadow: 
                    0 6px 20px 0 rgba(31, 38, 135, 0.2),
                    inset 0 0 12px rgba(255, 255, 255, 0.15);
                color: rgba(255, 255, 255, 1);
            }

            .link-icon {
                width: 24px;
                height: 24px;
                border-radius: 6px;
                background: rgba(255, 255, 255, 0.15);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                color: rgba(255, 255, 255, 0.7);
            }

            .link-text {
                font-weight: 500;
                font-size: 11px;
                line-height: 1.1;
                word-break: break-word;
                max-width: 100%;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
            }

            .add-btn {
                background: rgba(255, 255, 255, 0.2);
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.25);
                border-radius: 12px;
                color: rgba(255, 255, 255, 0.9);
                padding: 0.75rem 1.5rem;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 14px;
                font-weight: 500;
                box-shadow: 0 4px 16px 0 rgba(31, 38, 135, 0.1);
            }

            .add-btn:hover {
                background: rgba(255, 255, 255, 0.3);
                transform: translateY(-1px);
                box-shadow: 0 6px 20px 0 rgba(31, 38, 135, 0.2);
                color: rgba(255, 255, 255, 1);
            }

            .add-group-btn {
                background: rgba(255, 255, 255, 0.2);
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.25);
                border-radius: 12px;
                color: rgba(255, 255, 255, 0.9);
                padding: 0.75rem 1.5rem;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 14px;
                font-weight: 500;
                box-shadow: 0 4px 16px 0 rgba(31, 38, 135, 0.1);
            }

            .add-group-btn:hover {
                background: rgba(255, 255, 255, 0.3);
                transform: translateY(-1px);
                box-shadow: 0 6px 20px 0 rgba(31, 38, 135, 0.2);
                color: rgba(255, 255, 255, 1);
            }

            .theme-toggle-btn {
                background: rgba(255, 255, 255, 0.2);
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.25);
                border-radius: 12px;
                color: rgba(255, 255, 255, 0.9);
                padding: 0.75rem 1.5rem;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 14px;
                font-weight: 500;
                box-shadow: 0 4px 16px 0 rgba(31, 38, 135, 0.1);
            }

            .theme-toggle-btn:hover {
                background: rgba(255, 255, 255, 0.3);
                transform: translateY(-1px);
                box-shadow: 0 6px 20px 0 rgba(31, 38, 135, 0.2);
                color: rgba(255, 255, 255, 1);
            }

            .color-settings-btn {
                background: rgba(255, 255, 255, 0.2);
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.25);
                border-radius: 12px;
                color: rgba(255, 255, 255, 0.9);
                padding: 0.75rem 1.5rem;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 14px;
                font-weight: 500;
                box-shadow: 0 4px 16px 0 rgba(31, 38, 135, 0.1);
            }

            .color-settings-btn:hover {
                background: rgba(255, 255, 255, 0.3);
                transform: translateY(-1px);
                box-shadow: 0 6px 20px 0 rgba(31, 38, 135, 0.2);
                color: rgba(255, 255, 255, 1);
            }

            .menu-container {
                position: relative;
                display: inline-block;
                margin-bottom: 1rem;
            }

            .menu-toggle-btn {
                background: rgba(255, 255, 255, 0.2);
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.25);
                border-radius: 12px;
                color: rgba(255, 255, 255, 0.9);
                padding: 0.75rem 1.5rem;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 18px;
                font-weight: 500;
                box-shadow: 0 4px 16px 0 rgba(31, 38, 135, 0.1);
                display: flex;
                align-items: center;
                justify-content: center;
                min-width: 50px;
            }

            .menu-toggle-btn:hover {
                background: rgba(255, 255, 255, 0.3);
                transform: translateY(-1px);
                box-shadow: 0 6px 20px 0 rgba(31, 38, 135, 0.2);
                color: rgba(255, 255, 255, 1);
            }

            .accordion-menu {
                position: absolute;
                top: 100%;
                left: 0;
                margin-top: 0.5rem;
                background: rgba(255, 255, 255, 0.25);
                backdrop-filter: blur(20px);
                -webkit-backdrop-filter: blur(20px);
                border-radius: 12px;
                border: 1px solid rgba(255, 255, 255, 0.25);
                box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
                overflow: hidden;
                opacity: 0;
                visibility: hidden;
                transform: translateY(-10px);
                transition: all 0.3s ease;
                z-index: 1000;
                min-width: 200px;
            }

            .accordion-menu.active {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
            }

            .menu-item {
                background: transparent;
                border: none;
                color: rgba(255, 255, 255, 0.9);
                padding: 0.75rem 1rem;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 14px;
                font-weight: 500;
                text-align: left;
                width: 100%;
                display: block;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }

            .menu-item:last-child {
                border-bottom: none;
            }

            .menu-item:hover {
                background: rgba(255, 255, 255, 0.15);
                color: rgba(255, 255, 255, 1);
            }

            .menu-item:active {
                background: rgba(255, 255, 255, 0.2);
            }

            .empty-state {
                text-align: center;
                color: rgba(255, 255, 255, 0.8);
                font-style: italic;
                padding: 3rem;
            }

            .groups-container {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 2rem;
                padding: 1rem 0;
                overflow-y: auto;
                overflow-x: hidden;
                min-height: 400px;
                justify-items: center;
                align-items: start;
            }

            .groups-container::-webkit-scrollbar {
                width: 8px;
            }

            .groups-container::-webkit-scrollbar-track {
                background: rgba(255, 255, 255, 0.1);
                border-radius: 10px;
            }

            .groups-container::-webkit-scrollbar-thumb {
                background: rgba(255, 255, 255, 0.4);
                border-radius: 10px;
            }

            .groups-container::-webkit-scrollbar-thumb:hover {
                background: rgba(255, 255, 255, 0.6);
            }
        `;
    }

    attachEventListeners() {
        const menuToggleBtn = document.getElementById('menuToggleBtn');
        const accordionMenu = document.getElementById('accordionMenu');
        
        if (menuToggleBtn && accordionMenu) {
            menuToggleBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                accordionMenu.classList.toggle('active');
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!menuToggleBtn.contains(e.target) && !accordionMenu.contains(e.target)) {
                    accordionMenu.classList.remove('active');
                }
            });
        }

        const addNewBtn = document.getElementById('addNewBtn');
        if (addNewBtn) {
            addNewBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                accordionMenu.classList.remove('active');
                this.showQuickAddDialog();
            });
        }

        const addGroupBtn = document.getElementById('addGroupBtn');
        if (addGroupBtn) {
            addGroupBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                accordionMenu.classList.remove('active');
                this.showAddGroupDialog();
            });
        }

        const colorSettingsBtn = document.getElementById('colorSettingsBtn');
        if (colorSettingsBtn) {
            colorSettingsBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                accordionMenu.classList.remove('active');
                this.showColorSettingsDialog();
            });
        }

        const themeToggleBtn = document.getElementById('themeToggleBtn');
        if (themeToggleBtn) {
            // Update button text based on current theme
            themeToggleBtn.textContent = this.isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode';
            
            themeToggleBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                accordionMenu.classList.remove('active');
                this.toggleTheme();
            });
        }

        const exportBtn = document.getElementById('exportBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                accordionMenu.classList.remove('active');
                this.exportData();
            });
        }

        const importBtn = document.getElementById('importBtn');
        if (importBtn) {
            importBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                accordionMenu.classList.remove('active');
                this.importData();
            });
        }
    }

    toggleTheme() {
        this.isDarkMode = !this.isDarkMode;
        this.saveData();
        
        // Update theme toggle button text
        const themeToggleBtn = document.getElementById('themeToggleBtn');
        if (themeToggleBtn) {
            themeToggleBtn.textContent = this.isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode';
        }
        
        // Reapply glassmorphism with new theme
        this.applyGlassmorphism();
    }

    exportData() {
        // Create export data object with all user data
        const exportData = {
            version: '1.0',
            exportDate: new Date().toISOString(),
            data: {
                groups: this.groups,
                links: this.links,
                isDarkMode: this.isDarkMode,
                colorSettings: this.colorSettings
            }
        };

        // Convert to JSON string
        const jsonString = JSON.stringify(exportData, null, 2);
        
        // Create blob and download
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        // Create download link
        const downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.download = `start-page-backup-${new Date().toISOString().split('T')[0]}.json`;
        
        // Trigger download
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        
        // Clean up
        URL.revokeObjectURL(url);
        
        // Show success message
        this.showNotification('Data exported successfully!', 'success');
    }

    importData() {
        // Create file input
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.json';
        
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const importedData = JSON.parse(event.target.result);
                    
                    // Validate data structure
                    if (!importedData.data || !importedData.data.groups || !importedData.data.links) {
                        throw new Error('Invalid backup file format');
                    }
                    
                    // Show confirmation dialog
                    this.showImportConfirmation(importedData);
                    
                } catch (error) {
                    this.showNotification('Error importing data: ' + error.message, 'error');
                }
            };
            
            reader.readAsText(file);
        });
        
        // Trigger file selection
        fileInput.click();
    }

    showImportConfirmation(importedData) {
        const dialog = document.createElement('div');
        dialog.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            z-index: 10000;
            min-width: 400px;
            max-width: 90%;
        `;
        
        const groupsCount = importedData.data.groups.length;
        const linksCount = importedData.data.links.length;
        const exportDate = new Date(importedData.exportDate).toLocaleDateString();
        
        dialog.innerHTML = `
            <h3 style="margin: 0 0 1rem 0; color: #333;">Import Confirmation</h3>
            
            <div style="margin-bottom: 1.5rem;">
                <p style="margin: 0 0 0.5rem 0; color: #666; font-size: 14px;">
                    <strong>Backup from:</strong> ${exportDate}
                </p>
                <p style="margin: 0 0 0.5rem 0; color: #666; font-size: 14px;">
                    <strong>Groups:</strong> ${groupsCount}
                </p>
                <p style="margin: 0 0 0.5rem 0; color: #666; font-size: 14px;">
                    <strong>Links:</strong> ${linksCount}
                </p>
                <p style="margin: 1rem 0 0.5rem 0; color: #d32f2f; font-size: 14px; font-weight: 500;">
                    ⚠️ This will replace all your current data
                </p>
            </div>
            
            <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
                <button id="cancelImportBtn" style="padding: 0.5rem 1rem; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer;">Cancel</button>
                <button id="confirmImportBtn" style="padding: 0.5rem 1rem; background: #d32f2f; color: white; border: none; border-radius: 4px; cursor: pointer;">Import Data</button>
            </div>
        `;
        
        document.body.appendChild(dialog);
        
        return new Promise((resolve) => {
            const cancelBtn = document.getElementById('cancelImportBtn');
            const confirmBtn = document.getElementById('confirmImportBtn');
            
            const cancelImport = () => {
                document.body.removeChild(dialog);
                resolve(false);
            };
            
            const confirmImport = () => {
                // Apply imported data
                this.groups = importedData.data.groups || [];
                this.links = importedData.data.links || [];
                this.isDarkMode = importedData.data.isDarkMode !== undefined ? importedData.data.isDarkMode : true;
                this.colorSettings = importedData.data.colorSettings || this.getDefaultColorSettings();
                
                // Save and refresh
                this.saveData();
                this.applyGlassmorphism();
                this.render();
                
                // Update theme button text
                const themeToggleBtn = document.getElementById('themeToggleBtn');
                if (themeToggleBtn) {
                    themeToggleBtn.textContent = this.isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode';
                }
                
                document.body.removeChild(dialog);
                this.showNotification('Data imported successfully!', 'success');
                resolve(true);
            };
            
            cancelBtn.addEventListener('click', cancelImport);
            confirmBtn.addEventListener('click', confirmImport);
        });
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10001;
            opacity: 0;
            transform: translateY(-20px);
            transition: all 0.3s ease;
            max-width: 300px;
        `;
        
        // Set background color based on type
        if (type === 'success') {
            notification.style.background = '#4caf50';
        } else if (type === 'error') {
            notification.style.background = '#f44336';
        } else {
            notification.style.background = '#2196f3';
        }
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 100);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    showColorSettingsDialog() {
        // Create a color settings dialog
        const dialog = document.createElement('div');
        dialog.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            z-index: 10000;
            min-width: 500px;
            max-width: 90%;
            max-height: 80vh;
            overflow-y: auto;
        `;
        
        const currentTheme = this.isDarkMode ? 'darkMode' : 'lightMode';
        const currentColors = this.colorSettings[currentTheme];
        
        dialog.innerHTML = `
            <h3 style="margin: 0 0 1rem 0; color: #333;">Color Settings</h3>
            
            <div style="margin-bottom: 1.5rem;">
                <h4 style="margin: 0 0 0.5rem 0; color: #666; font-size: 14px;">Current Theme: ${this.isDarkMode ? 'Dark Mode' : 'Light Mode'}</h4>
                
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem; color: #666; font-size: 12px;">Background Gradient:</label>
                    <textarea id="bgGradient" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px; font-family: monospace; font-size: 11px; height: 60px; resize: vertical;">${currentColors.background}</textarea>
                </div>
                
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem; color: #666; font-size: 12px;">Glass Opacity (0.1 - 0.9):</label>
                    <input type="range" id="glassOpacity" min="0.1" max="0.9" step="0.05" value="${currentColors.glassOpacity}" style="width: 100%;">
                    <span id="opacityValue" style="color: #666; font-size: 12px;">${currentColors.glassOpacity}</span>
                </div>
                
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem; color: #666; font-size: 12px;">Glass Background Color:</label>
                    <input type="text" id="glassBackground" value="${currentColors.glassBackground}" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px; font-family: monospace; font-size: 12px;">
                </div>
                
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem; color: #666; font-size: 12px;">Text Color:</label>
                    <input type="text" id="textColor" value="${currentColors.textColor}" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px; font-family: monospace; font-size: 12px;">
                </div>
            </div>
            
            <div style="margin-bottom: 1.5rem;">
                <h4 style="margin: 0 0 0.5rem 0; color: #666; font-size: 14px;">Preset Themes</h4>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.5rem;">
                    <button class="preset-btn" data-preset="dark-professional" style="padding: 0.5rem; background: #2c3e50; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">Dark Professional</button>
                    <button class="preset-btn" data-preset="dark-minimal" style="padding: 0.5rem; background: #1a1a1a; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">Dark Minimal</button>
                    <button class="preset-btn" data-preset="dark-ocean" style="padding: 0.5rem; background: #1e3c72; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">Dark Ocean</button>
                    <button class="preset-btn" data-preset="dark-forest" style="padding: 0.5rem; background: #1a4314; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">Dark Forest</button>
                    <button class="preset-btn" data-preset="dark-sunset" style="padding: 0.5rem; background: #4a1a4a; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">Dark Sunset</button>
                    <button class="preset-btn" data-preset="dark-midnight" style="padding: 0.5rem; background: #0f0f1e; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">Dark Midnight</button>
                    <button class="preset-btn" data-preset="light-vibrant" style="padding: 0.5rem; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">Light Vibrant</button>
                    <button class="preset-btn" data-preset="light-soft" style="padding: 0.5rem; background: #89f7fe; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">Light Soft</button>
                    <button class="preset-btn" data-preset="light-coral" style="padding: 0.5rem; background: #ff6b6b; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">Light Coral</button>
                    <button class="preset-btn" data-preset="light-mint" style="padding: 0.5rem; background: #4ecdc4; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">Light Mint</button>
                    <button class="preset-btn" data-preset="light-lavender" style="padding: 0.5rem; background: #a8e6cf; color: #333; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">Light Lavender</button>
                    <button class="preset-btn" data-preset="light-peach" style="padding: 0.5rem; background: #ffd3b6; color: #333; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">Light Peach</button>
                </div>
            </div>
            
            <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
                <button id="resetColorsBtn" style="padding: 0.5rem 1rem; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer;">Reset to Default</button>
                <button id="saveColorsBtn" style="padding: 0.5rem 1rem; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer;">Apply Changes</button>
                <button id="cancelColorsBtn" style="padding: 0.5rem 1rem; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer;">Cancel</button>
            </div>
        `;
        
        document.body.appendChild(dialog);
        
        return new Promise((resolve) => {
            const saveBtn = document.getElementById('saveColorsBtn');
            const cancelBtn = document.getElementById('cancelColorsBtn');
            const resetBtn = document.getElementById('resetColorsBtn');
            const opacitySlider = document.getElementById('glassOpacity');
            const opacityValue = document.getElementById('opacityValue');
            
            // Update opacity value display
            opacitySlider.addEventListener('input', (e) => {
                opacityValue.textContent = e.target.value;
            });
            
            // Preset buttons
            const presetButtons = dialog.querySelectorAll('.preset-btn');
            presetButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    this.applyPreset(e.target.dataset.preset);
                });
            });
            
            const saveColors = () => {
                const newColors = {
                    background: document.getElementById('bgGradient').value.trim(),
                    glassOpacity: parseFloat(document.getElementById('glassOpacity').value),
                    glassBackground: document.getElementById('glassBackground').value.trim(),
                    textColor: document.getElementById('textColor').value.trim()
                };
                
                this.colorSettings[currentTheme] = newColors;
                this.saveData();
                this.applyGlassmorphism();
                
                document.body.removeChild(dialog);
                resolve();
            };
            
            const cancelColors = () => {
                document.body.removeChild(dialog);
                resolve();
            };
            
            const resetColors = () => {
                // Reset to default colors
                const defaults = this.getDefaultColorSettings();
                this.colorSettings[currentTheme] = defaults[currentTheme];
                this.saveData();
                this.applyGlassmorphism();
                
                document.body.removeChild(dialog);
                resolve();
            };
            
            saveBtn.addEventListener('click', saveColors);
            cancelBtn.addEventListener('click', cancelColors);
            resetBtn.addEventListener('click', resetColors);
        });
    }

    getDefaultColorSettings() {
        return {
            darkMode: {
                background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 25%, #2d2d2d 50%, #404040 75%, #525252 100%)',
                glassOpacity: 0.4,
                glassBackground: 'rgba(0, 0, 0, 0.4)',
                textColor: 'rgba(255, 255, 255, 0.75)'
            },
            lightMode: {
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)',
                glassOpacity: 0.25,
                glassBackground: 'rgba(255, 255, 255, 0.25)',
                textColor: 'rgba(255, 255, 255, 0.9)'
            }
        };
    }

    sortLinksByOrder() {
        // Sort links by order, then by name for ties, then by creation date
        this.links.sort((a, b) => {
            // First sort by order
            if (a.order !== b.order) {
                return (a.order || 0) - (b.order || 0);
            }
            // If orders are the same, sort by name
            return a.name.localeCompare(b.name);
        });
        
        // Update order indices to be sequential
        this.links.forEach((link, index) => {
            link.order = index;
        });
    }

    applyPreset(presetName) {
        const presets = {
            'dark-professional': {
                background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #7e8ba3 100%)',
                glassOpacity: 0.3,
                glassBackground: 'rgba(0, 0, 0, 0.3)',
                textColor: 'rgba(255, 255, 255, 0.8)'
            },
            'dark-minimal': {
                background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #2d2d2d 100%)',
                glassOpacity: 0.5,
                glassBackground: 'rgba(0, 0, 0, 0.5)',
                textColor: 'rgba(255, 255, 255, 0.7)'
            },
            'dark-ocean': {
                background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 25%, #7e8ba3 50%, #4a90e2 75%, #87ceeb 100%)',
                glassOpacity: 0.35,
                glassBackground: 'rgba(30, 60, 114, 0.4)',
                textColor: 'rgba(255, 255, 255, 0.85)'
            },
            'dark-forest': {
                background: 'linear-gradient(135deg, #1a4314 0%, #2d5f2d 25%, #3e7e3e 50%, #4a9d4a 75%, #5cb85c 100%)',
                glassOpacity: 0.4,
                glassBackground: 'rgba(26, 67, 20, 0.4)',
                textColor: 'rgba(255, 255, 255, 0.8)'
            },
            'dark-sunset': {
                background: 'linear-gradient(135deg, #4a1a4a 0%, #8b2c5c 25%, #c73e5e 50%, #ff6b6b 75%, #ffa500 100%)',
                glassOpacity: 0.3,
                glassBackground: 'rgba(74, 26, 74, 0.4)',
                textColor: 'rgba(255, 255, 255, 0.85)'
            },
            'dark-midnight': {
                background: 'linear-gradient(135deg, #0f0f1e 0%, #1a1a3e 25%, #2d2d5e 50%, #40407e 75%, #5252a3 100%)',
                glassOpacity: 0.45,
                glassBackground: 'rgba(15, 15, 30, 0.4)',
                textColor: 'rgba(255, 255, 255, 0.75)'
            },
            'light-vibrant': {
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 25%, #4facfe 50%, #00f2fe 75%, #43e97b 100%)',
                glassOpacity: 0.2,
                glassBackground: 'rgba(255, 255, 255, 0.2)',
                textColor: 'rgba(0, 0, 0, 0.8)'
            },
            'light-soft': {
                background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 25%, #ff9a9e 50%, #fecfef 75%, #fecfef 100%)',
                glassOpacity: 0.3,
                glassBackground: 'rgba(255, 255, 255, 0.3)',
                textColor: 'rgba(0, 0, 0, 0.7)'
            },
            'light-coral': {
                background: 'linear-gradient(135deg, #ff6b6b 0%, #ff8e53 25%, #ff6b9d 50%, #c44569 75%, #a8365d 100%)',
                glassOpacity: 0.25,
                glassBackground: 'rgba(255, 255, 255, 0.25)',
                textColor: 'rgba(0, 0, 0, 0.75)'
            },
            'light-mint': {
                background: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 25%, #3eb8ac 50%, #2ecc71 75%, #27ae60 100%)',
                glassOpacity: 0.3,
                glassBackground: 'rgba(255, 255, 255, 0.3)',
                textColor: 'rgba(0, 0, 0, 0.7)'
            },
            'light-lavender': {
                background: 'linear-gradient(135deg, #a8e6cf 0%, #dcedc1 25%, #ffd3b6 50%, #ffaaa5 75%, #ff8b94 100%)',
                glassOpacity: 0.35,
                glassBackground: 'rgba(255, 255, 255, 0.35)',
                textColor: 'rgba(0, 0, 0, 0.65)'
            },
            'light-peach': {
                background: 'linear-gradient(135deg, #ffd3b6 0%, #ffaaa5 25%, #ff8b94 50%, #ff6b6b 75%, #ff5252 100%)',
                glassOpacity: 0.3,
                glassBackground: 'rgba(255, 255, 255, 0.3)',
                textColor: 'rgba(0, 0, 0, 0.7)'
            }
        };
        
        const preset = presets[presetName];
        if (preset) {
            document.getElementById('bgGradient').value = preset.background;
            document.getElementById('glassOpacity').value = preset.glassOpacity;
            document.getElementById('opacityValue').textContent = preset.glassOpacity;
            document.getElementById('glassBackground').value = preset.glassBackground;
            document.getElementById('textColor').value = preset.textColor;
        }
    }

    showAddGroupDialog() {
        // Create an add group dialog
        const dialog = document.createElement('div');
        dialog.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            z-index: 10000;
            min-width: 400px;
            max-width: 90%;
            max-height: 80vh;
            overflow-y: auto;
        `;
        
        // Create group list for deletion
        const groupList = this.groups.map(group => 
            `<div class="group-item" data-group-id="${group.id}" style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem; margin-bottom: 0.5rem; background: #f8f9fa; border-radius: 4px;">
                <span style="color: #333;">${group.name}</span>
                <button class="delete-group-btn" data-group-id="${group.id}" data-group-name="${group.name}" style="padding: 0.25rem 0.5rem; background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">Delete</button>
            </div>`
        ).join('');
        
        dialog.innerHTML = `
            <h3 style="margin: 0 0 1rem 0; color: #333;">Manage Groups</h3>
            
            <div style="margin-bottom: 1.5rem;">
                <h4 style="margin: 0 0 0.5rem 0; color: #666; font-size: 14px;">Add New Group</h4>
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem; color: #666; font-size: 12px;">Group Name:</label>
                    <input type="text" id="groupName" placeholder="Enter group name" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px;">
                </div>
                <button id="saveGroupBtn" style="padding: 0.5rem 1rem; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer;">Add Group</button>
            </div>
            
            <div style="margin-bottom: 1.5rem;">
                <h4 style="margin: 0 0 0.5rem 0; color: #666; font-size: 14px;">Delete Groups</h4>
                <div style="max-height: 200px; overflow-y: auto; border: 1px solid #ddd; border-radius: 4px; padding: 0.5rem;">
                    ${this.groups.length > 0 ? groupList : '<p style="color: #999; font-style: italic; margin: 0;">No groups to delete</p>'}
                </div>
            </div>
            
            <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
                <button id="cancelGroupBtn" style="padding: 0.5rem 1rem; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer;">Close</button>
            </div>
        `;
        
        document.body.appendChild(dialog);
        
        // Focus and select the name input
        const nameInput = document.getElementById('groupName');
        nameInput.focus();
        
        return new Promise((resolve) => {
            const saveBtn = document.getElementById('saveGroupBtn');
            const cancelBtn = document.getElementById('cancelGroupBtn');
            
            const saveGroup = () => {
                const groupName = nameInput.value.trim();
                
                if (groupName) {
                    const newGroup = {
                        id: this.generateId(),
                        name: groupName
                    };
                    this.groups.push(newGroup);
                    this.saveData();
                    this.render();
                    
                    // Clear input and refresh dialog
                    nameInput.value = '';
                    this.refreshGroupDialog(dialog);
                }
            };
            
            const cancelGroup = () => {
                document.body.removeChild(dialog);
                resolve();
            };
            
            const deleteGroup = (e) => {
                const groupId = e.target.dataset.groupId;
                const groupName = e.target.dataset.groupName;
                
                // Check if group has links
                const groupLinks = this.links.filter(link => link.groupId === groupId);
                
                let confirmMessage = `Are you sure you want to delete "${groupName}"?`;
                if (groupLinks.length > 0) {
                    confirmMessage += `\n\nThis will also delete ${groupLinks.length} link(s) in this group.`;
                }
                
                if (confirm(confirmMessage)) {
                    // Remove group
                    const groupIndex = this.groups.findIndex(g => g.id === groupId);
                    if (groupIndex !== -1) {
                        this.groups.splice(groupIndex, 1);
                    }
                    
                    // Remove links in this group
                    this.links = this.links.filter(link => link.groupId !== groupId);
                    
                    this.saveData();
                    this.render();
                    this.refreshGroupDialog(dialog);
                }
            };
            
            saveBtn.addEventListener('click', saveGroup);
            cancelBtn.addEventListener('click', cancelGroup);
            
            // Add delete event listeners to all delete buttons
            const deleteButtons = dialog.querySelectorAll('.delete-group-btn');
            deleteButtons.forEach(btn => {
                btn.addEventListener('click', deleteGroup);
            });
            
            // Also save on Enter key, cancel on Escape
            nameInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') saveGroup();
                if (e.key === 'Escape') cancelGroup();
            });
        });
    }

    refreshGroupDialog(dialog) {
        // Refresh the group list in the dialog
        const groupList = this.groups.map(group => 
            `<div class="group-item" data-group-id="${group.id}" style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem; margin-bottom: 0.5rem; background: #f8f9fa; border-radius: 4px;">
                <span style="color: #333;">${group.name}</span>
                <button class="delete-group-btn" data-group-id="${group.id}" data-group-name="${group.name}" style="padding: 0.25rem 0.5rem; background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">Delete</button>
            </div>`
        ).join('');
        
        const deleteSection = dialog.querySelector('div[style*="max-height: 200px"]');
        if (deleteSection) {
            deleteSection.innerHTML = this.groups.length > 0 ? groupList : '<p style="color: #999; font-style: italic; margin: 0;">No groups to delete</p>';
            
            // Re-attach delete event listeners
            const deleteButtons = deleteSection.querySelectorAll('.delete-group-btn');
            deleteButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const groupId = e.target.dataset.groupId;
                    const groupName = e.target.dataset.groupName;
                    
                    // Check if group has links
                    const groupLinks = this.links.filter(link => link.groupId === groupId);
                    
                    let confirmMessage = `Are you sure you want to delete "${groupName}"?`;
                    if (groupLinks.length > 0) {
                        confirmMessage += `\n\nThis will also delete ${groupLinks.length} link(s) in this group.`;
                    }
                    
                    if (confirm(confirmMessage)) {
                        // Remove group
                        const groupIndex = this.groups.findIndex(g => g.id === groupId);
                        if (groupIndex !== -1) {
                            this.groups.splice(groupIndex, 1);
                        }
                        
                        // Remove links in this group
                        this.links = this.links.filter(link => link.groupId !== groupId);
                        
                        this.saveData();
                        this.render();
                        this.refreshGroupDialog(dialog);
                    }
                });
            });
        }
    }

    async editLink(link) {
        // Create a more user-friendly edit dialog
        const dialog = document.createElement('div');
        dialog.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            z-index: 10000;
            min-width: 300px;
            max-width: 90%;
        `;
        
        // Create group select options
        const groupOptions = this.groups.map(group => 
            `<option value="${group.id}" ${link.groupId === group.id ? 'selected' : ''}>${group.name}</option>`
        ).join('');
        
        dialog.innerHTML = `
            <h3 style="margin: 0 0 1rem 0; color: #333;">Edit Link</h3>
            <div style="margin-bottom: 1rem;">
                <label style="display: block; margin-bottom: 0.5rem; color: #666;">Link Name:</label>
                <input type="text" id="editLinkName" value="${link.name}" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px;">
            </div>
            <div style="margin-bottom: 1rem;">
                <label style="display: block; margin-bottom: 0.5rem; color: #666;">Group:</label>
                <select id="editLinkGroup" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px;">
                    ${groupOptions}
                </select>
            </div>
            <div style="margin-bottom: 1rem;">
                <label style="display: block; margin-bottom: 0.5rem; color: #666;">URL:</label>
                <input type="text" id="editLinkUrl" value="${link.url}" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px;">
            </div>
            <div style="margin-bottom: 1rem;">
                <label style="display: block; margin-bottom: 0.5rem; color: #666;">Order (for sorting):</label>
                <input type="number" id="editLinkOrder" value="${link.order || 0}" min="0" max="999" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px;">
                <small style="color: #999; font-size: 12px;">Lower numbers appear first. Links with same order keep their current position.</small>
            </div>
            <div style="margin-bottom: 1rem;">
                <label style="display: block; margin-bottom: 0.5rem; color: #666;">Favicon URL (optional):</label>
                <input type="text" id="editLinkFavicon" value="${link.faviconUrl || ''}" placeholder="https://example.com/icon.png" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px;">
            </div>
            <div style="display: flex; gap: 0.5rem; justify-content: space-between; align-items: center;">
                <button id="deleteEditBtn" style="padding: 0.5rem 1rem; background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer;">Delete</button>
                <div style="display: flex; gap: 0.5rem;">
                    <button id="saveEditBtn" style="padding: 0.5rem 1rem; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer;">Save</button>
                    <button id="cancelEditBtn" style="padding: 0.5rem 1rem; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer;">Cancel</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(dialog);
        
        // Focus and select the name input
        const nameInput = document.getElementById('editLinkName');
        nameInput.focus();
        nameInput.select();
        
        return new Promise((resolve) => {
            const saveBtn = document.getElementById('saveEditBtn');
            const cancelBtn = document.getElementById('cancelEditBtn');
            const deleteBtn = document.getElementById('deleteEditBtn');
            
            const saveEdit = () => {
                const newName = nameInput.value.trim();
                const newUrl = document.getElementById('editLinkUrl').value.trim();
                const newFaviconUrl = document.getElementById('editLinkFavicon').value.trim();
                const newGroupId = document.getElementById('editLinkGroup').value;
                const newOrder = parseInt(document.getElementById('editLinkOrder').value) || 0;
                
                if (newName && newUrl) {
                    const linkIndex = this.links.findIndex(l => l.id === link.id);
                    if (linkIndex !== -1) {
                        this.links[linkIndex].name = newName;
                        this.links[linkIndex].url = newUrl;
                        this.links[linkIndex].groupId = newGroupId;
                        this.links[linkIndex].order = newOrder;
                        if (newFaviconUrl) {
                            this.links[linkIndex].faviconUrl = newFaviconUrl;
                        }
                        
                        // Sort all links by order to maintain proper sequence
                        this.sortLinksByOrder();
                        
                        this.saveData();
                        this.render();
                    }
                }
                
                document.body.removeChild(dialog);
                resolve();
            };
            
            const cancelEdit = () => {
                document.body.removeChild(dialog);
                resolve();
            };
            
            const deleteLink = () => {
                // Confirm deletion
                if (confirm(`Are you sure you want to delete "${link.name}"?`)) {
                    const linkIndex = this.links.findIndex(l => l.id === link.id);
                    if (linkIndex !== -1) {
                        this.links.splice(linkIndex, 1);
                        this.saveData();
                        this.render();
                    }
                    document.body.removeChild(dialog);
                    resolve();
                }
            };
            
            saveBtn.addEventListener('click', saveEdit);
            cancelBtn.addEventListener('click', cancelEdit);
            deleteBtn.addEventListener('click', deleteLink);
            
            // Also save on Enter key
            nameInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') saveEdit();
                if (e.key === 'Escape') cancelEdit();
            });
        });
    }

    showQuickAddDialog() {
        // Create a quick add dialog
        const dialog = document.createElement('div');
        dialog.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            z-index: 10000;
            min-width: 300px;
            max-width: 90%;
        `;
        
        // Create group select options
        const groupOptions = this.groups.map(group => 
            `<option value="${group.id}">${group.name}</option>`
        ).join('');
        
        dialog.innerHTML = `
            <h3 style="margin: 0 0 1rem 0; color: #333;">Add New Link</h3>
            <div style="margin-bottom: 1rem;">
                <label style="display: block; margin-bottom: 0.5rem; color: #666;">Group:</label>
                <select id="quickAddGroup" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px;">
                    <option value="">Select group</option>
                    ${groupOptions}
                </select>
            </div>
            <div style="margin-bottom: 1rem;">
                <label style="display: block; margin-bottom: 0.5rem; color: #666;">Link Name:</label>
                <input type="text" id="quickAddName" placeholder="Link name" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px;">
            </div>
            <div style="margin-bottom: 1rem;">
                <label style="display: block; margin-bottom: 0.5rem; color: #666;">URL:</label>
                <input type="text" id="quickAddUrl" placeholder="URL" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px;">
            </div>
            <div style="margin-bottom: 1rem;">
                <label style="display: block; margin-bottom: 0.5rem; color: #666;">Favicon URL (optional):</label>
                <input type="text" id="quickAddFavicon" placeholder="https://example.com/icon.png" style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px;">
            </div>
            <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
                <button id="saveQuickAddBtn" style="padding: 0.5rem 1rem; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer;">Add Link</button>
                <button id="cancelQuickAddBtn" style="padding: 0.5rem 1rem; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer;">Cancel</button>
            </div>
        `;
        
        document.body.appendChild(dialog);
        
        // Focus and select the name input
        const nameInput = document.getElementById('quickAddName');
        nameInput.focus();
        
        return new Promise((resolve) => {
            const saveBtn = document.getElementById('saveQuickAddBtn');
            const cancelBtn = document.getElementById('cancelQuickAddBtn');
            
            const saveQuickAdd = () => {
                const name = nameInput.value.trim();
                const url = document.getElementById('quickAddUrl').value.trim();
                const faviconUrl = document.getElementById('quickAddFavicon').value.trim();
                const groupId = document.getElementById('quickAddGroup').value;
                
                if (name && url && groupId) {
                    // Get the highest order number for this group
                    const groupLinks = this.links.filter(l => l.groupId === groupId);
                    const maxOrder = groupLinks.length > 0 ? Math.max(...groupLinks.map(l => l.order || 0)) : -1;
                    
                    const newLink = {
                        id: this.generateId(),
                        name: name,
                        url: url.startsWith('http') ? url : 'https://' + url,
                        groupId: groupId,
                        order: maxOrder + 1,
                        faviconUrl: faviconUrl || undefined
                    };
                    this.links.push(newLink);
                    this.sortLinksByOrder();
                    this.saveData();
                    this.render();
                }
                
                document.body.removeChild(dialog);
                resolve();
            };
            
            const cancelQuickAdd = () => {
                document.body.removeChild(dialog);
                resolve();
            };
            
            saveBtn.addEventListener('click', saveQuickAdd);
            cancelBtn.addEventListener('click', cancelQuickAdd);
            
            // Also save on Enter key
            nameInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') saveQuickAdd();
                if (e.key === 'Escape') cancelQuickAdd();
            });
        });
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    applySettings() {
        console.log('Applying settings:', this.settings);
        
        if (this.settings.darkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
        
        // Apply custom gradient colors
        document.body.style.background = `linear-gradient(135deg, ${this.settings.bgColor} 0%, ${this.settings.bgColor2} 100%)`;
        
        // Apply group background color (with gradient and opacity support)
        const groups = document.querySelectorAll('.group');
        console.log('Found groups:', groups.length);
        console.log('Group background color:', this.settings.groupBgColor);
        console.log('Group background color 2:', this.settings.groupBgColor2);
        console.log('Group opacity:', this.settings.groupBgOpacity);
        console.log('Group header color:', this.settings.groupHeaderColor);
        console.log('Link text color:', this.settings.linkTextColor);
        console.log('Link background color:', this.settings.linkBgColor);
        console.log('Link background color 2:', this.settings.linkBgColor2);
        console.log('Link opacity:', this.settings.linkBgOpacity);
        
        groups.forEach(group => {
            // Apply gradient background with opacity if both colors are set
            if (this.settings.groupBgColor2 && this.settings.groupBgColor2 !== this.settings.groupBgColor) {
                const color1 = this.hexToRgba(this.settings.groupBgColor, this.settings.groupBgOpacity / 100);
                const color2 = this.hexToRgba(this.settings.groupBgColor2, this.settings.groupBgOpacity / 100);
                group.style.background = `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`;
            } else {
                const color = this.hexToRgba(this.settings.groupBgColor, this.settings.groupBgOpacity / 100);
                group.style.background = color;
            }
            
            const groupTitle = group.querySelector('h2');
            if (groupTitle) {
                groupTitle.style.color = this.settings.groupHeaderColor;
            }
            
            // Apply link text color to all links
            const links = group.querySelectorAll('.link-text');
            links.forEach(link => {
                link.style.color = this.settings.linkTextColor;
            });
            
            // Apply link background color with opacity and gradient to all links
            const linkItems = group.querySelectorAll('.link-item');
            linkItems.forEach(item => {
                if (this.settings.linkBgColor2 && this.settings.linkBgColor2 !== this.settings.linkBgColor) {
                    const color1 = this.hexToRgba(this.settings.linkBgColor, this.settings.linkBgOpacity / 100);
                    const color2 = this.hexToRgba(this.settings.linkBgColor2, this.settings.linkBgOpacity / 100);
                    item.style.background = `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`;
                } else {
                    const color = this.hexToRgba(this.settings.linkBgColor, this.settings.linkBgOpacity / 100);
                    item.style.background = color;
                }
            });
        });
        
        // Apply admin button color in dark mode
        const adminBtn = document.getElementById('adminBtn');
        if (adminBtn) {
            if (this.settings.darkMode) {
                adminBtn.style.color = '#e0e0e0';
            } else {
                adminBtn.style.color = this.settings.groupHeaderColor;
            }
        }
        
        // Apply add button color in dark mode
        const addBtn = document.getElementById('addNewBtn');
        if (addBtn) {
            if (this.settings.darkMode) {
                addBtn.style.color = '#e0e0e0';
            } else {
                addBtn.style.color = this.settings.groupHeaderColor;
            }
        }
    }

    hexToRgba(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    getFaviconUrl(url) {
        try {
            const domain = new URL(url).hostname;
            return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
        } catch (e) {
            return 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23667eea"><path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/></svg>';
        }
    }

    getInitials(name) {
        return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 1);
    }

    createLinkElement(link) {
        const linkElement = document.createElement('div');
        linkElement.className = 'link-item';
        linkElement.style.cursor = 'pointer';
        
        // Add long press functionality for editing
        let pressTimer;
        let isLongPress = false;
        
        const handleStart = (e) => {
            e.preventDefault();
            e.stopPropagation();
            isLongPress = false;
            pressTimer = setTimeout(() => {
                isLongPress = true;
                this.editLink(link);
            }, 500); // 500ms for long press
        };
        
        const handleEnd = (e) => {
            e.preventDefault();
            e.stopPropagation();
            clearTimeout(pressTimer);
            if (!isLongPress) {
                // Normal click - navigate to link
                window.location.href = link.url;
            }
        };
        
        const handleMove = (e) => {
            e.preventDefault();
            e.stopPropagation();
            clearTimeout(pressTimer);
        };
        
        // Mouse events
        linkElement.addEventListener('mousedown', handleStart);
        linkElement.addEventListener('mouseup', handleEnd);
        linkElement.addEventListener('mouseleave', handleMove);
        linkElement.addEventListener('mousemove', handleMove);
        
        // Touch events for mobile
        linkElement.addEventListener('touchstart', handleStart, {passive: false});
        linkElement.addEventListener('touchend', handleEnd, {passive: false});
        linkElement.addEventListener('touchcancel', handleEnd, {passive: false});
        linkElement.addEventListener('touchmove', handleMove, {passive: false});

        const iconContainer = document.createElement('div');
        iconContainer.className = 'link-icon';
        
        const url = new URL(link.url);
        const hostname = url.hostname;
        const port = url.port;
        const fullUrl = url.origin + url.pathname; // e.g., http://localhost:8080/myapp/
        
        // Bulletproof favicon system with manual override
        const img = document.createElement('img');
        img.style.width = '32px';
        img.style.height = '32px';
        img.style.objectFit = 'contain';
        img.alt = '';
        
        // Check if link has custom favicon URL
        if (link.faviconUrl) {
            console.log(`Using custom favicon for ${link.url}:`, link.faviconUrl);
            
            // Check if custom favicon URL is local
            const isLocalFavicon = link.faviconUrl.startsWith('file://') || 
                                 link.faviconUrl.startsWith('http://localhost') || 
                                 link.faviconUrl.startsWith('http://127.0.0.1') ||
                                 link.faviconUrl.startsWith('http://192.168.') ||
                                 link.faviconUrl.startsWith('http://10.') ||
                                 link.faviconUrl.startsWith('http://172.');
            
            // Only set crossOrigin for external URLs
            if (!isLocalFavicon) {
                img.crossOrigin = 'anonymous';
            }
            
            img.onload = () => {
                if (img.naturalWidth > 0 && img.naturalHeight > 0) {
                    console.log(`Successfully loaded custom favicon for ${link.url}:`, link.faviconUrl);
                    iconContainer.innerHTML = '';
                    iconContainer.appendChild(img);
                } else {
                    console.log(`Custom favicon loaded but invalid dimensions for ${link.url}, using fallback`);
                    iconContainer.innerHTML = '';
                    iconContainer.textContent = this.getInitials(link.name);
                    iconContainer.classList.add('fallback');
                }
            };
            
            img.onerror = () => {
                console.log(`Custom favicon failed for ${link.url}:`, link.faviconUrl);
                iconContainer.innerHTML = '';
                iconContainer.textContent = this.getInitials(link.name);
                iconContainer.classList.add('fallback');
            };
            
            img.src = link.faviconUrl;
        } else {
            // Standard favicon loading
            const url = new URL(link.url);
            const hostname = url.hostname;
            const port = url.port;
            const fullUrl = url.origin + url.pathname;
            const hostnameWithPort = port ? `${hostname}:${port}` : hostname;
            const isLocalServer = hostname.startsWith('192.168.') || hostname.startsWith('127.0.0.1') || hostname.startsWith('10.') || hostname.startsWith('172.') || hostname.includes('localhost');
            
            // Simple, reliable favicon URLs
            const faviconUrls = [
                `https://${hostnameWithPort}/favicon.ico`,
                `http://${hostnameWithPort}/favicon.ico`,
                `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`,
                `https://icons.duckduckgo.com/ip3/${hostname}.ico`
            ];
            
            let currentUrlIndex = 0;
            let loadAttempts = 0;
            
            const tryNextFavicon = () => {
                if (currentUrlIndex < faviconUrls.length && loadAttempts < 5) {
                    const faviconUrl = faviconUrls[currentUrlIndex];
                    console.log(`Trying favicon ${loadAttempts + 1} for ${link.url}:`, faviconUrl);
                    img.crossOrigin = isLocalServer ? '' : 'anonymous';
                    img.src = faviconUrl;
                    currentUrlIndex++;
                    loadAttempts++;
                } else {
                    // All favicon sources failed, show fallback
                    console.log(`All favicon sources failed for ${link.url}, using fallback`);
                    iconContainer.innerHTML = '';
                    iconContainer.textContent = this.getInitials(link.name);
                    iconContainer.classList.add('fallback');
                }
            };
            
            img.onload = () => {
                // Check if image loaded successfully and is not a default icon
                if (img.naturalWidth > 0 && img.naturalHeight > 0) {
                    // Check if it's a default/generic icon (usually small or square)
                    const isDefaultIcon = img.naturalWidth === 16 && img.naturalHeight === 16 || 
                                       img.naturalWidth === 32 && img.naturalHeight === 32;
                    
                    if (isDefaultIcon) {
                        console.log(`Default/generic icon detected for ${link.url}, using fallback`);
                        iconContainer.innerHTML = '';
                        iconContainer.textContent = this.getInitials(link.name);
                        iconContainer.classList.add('fallback');
                    } else {
                        console.log(`Successfully loaded favicon for ${link.url}:`, faviconUrls[currentUrlIndex - 1]);
                        iconContainer.innerHTML = '';
                        iconContainer.appendChild(img);
                    }
                } else {
                    console.log(`Favicon loaded but invalid dimensions for ${link.url}, trying next...`);
                    tryNextFavicon();
                }
            };
            
            img.onerror = () => {
                console.log(`Favicon failed for ${link.url}:`, faviconUrls[currentUrlIndex - 1]);
                tryNextFavicon();
            };
            
            // Start with first favicon URL
            tryNextFavicon();
        }
        
        const linkName = document.createElement('span');
        linkName.textContent = link.name;
        linkName.className = 'link-text';
        
        linkElement.appendChild(iconContainer);
        linkElement.appendChild(linkName);
        
        return linkElement;
    }

    createGroupElement(group) {
        const groupElement = document.createElement('div');
        groupElement.className = 'group';
        
        const groupTitle = document.createElement('h2');
        groupTitle.textContent = group.name;

        const linksGrid = document.createElement('div');
        linksGrid.className = 'links-grid';

        const groupLinks = this.links.filter(link => link.groupId === group.id);
        
        if (groupLinks.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'empty-state';
            emptyMessage.textContent = 'No links in this group';
            linksGrid.appendChild(emptyMessage);
        } else {
            groupLinks.forEach(link => {
                linksGrid.appendChild(this.createLinkElement(link));
            });
        }

        groupElement.appendChild(groupTitle);
        groupElement.appendChild(linksGrid);

        return groupElement;
    }

    render() {
        const container = document.getElementById('groupsContainer');
        const emptyState = document.getElementById('emptyState');

        container.innerHTML = '';

        if (this.groups.length === 0) {
            container.style.display = 'none';
            emptyState.style.display = 'block';
            return;
        }

        container.style.display = 'grid';
        emptyState.style.display = 'none';

        this.groups.forEach(group => {
            container.appendChild(this.createGroupElement(group));
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const linkManager = new LinkManager();
});
