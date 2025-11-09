// Theme Toggle System - Light, Dark, Matrix
document.addEventListener('DOMContentLoaded', function() {
    
    const themes = {
        light: { name: 'Light', icon: '☀️' },
        dark: { name: 'Dark', icon: '🌙' },
        matrix: { name: 'Matrix', icon: '🟢' }
    };
    
    let currentTheme = 'light';
    
    function loadTheme() {
        const saved = localStorage.getItem('currencyConverterTheme');
        if (saved && themes[saved]) {
            currentTheme = saved;
        }
        applyTheme(currentTheme);
    }
    
    function saveTheme(theme) {
        localStorage.setItem('currencyConverterTheme', theme);
    }
    
    function setupThemeButton() {
        const themeBtn = document.getElementById('theme-toggle');
        if (!themeBtn) return;
        
        themeBtn.title = `Theme: ${themes[currentTheme].name}`;
        themeBtn.innerHTML = themes[currentTheme].icon;
        themeBtn.addEventListener('click', cycleTheme);
        return themeBtn;
    }
    
    function cycleTheme() {
        const themeOrder = ['light', 'dark', 'matrix'];
        const currentIndex = themeOrder.indexOf(currentTheme);
        const nextIndex = (currentIndex + 1) % themeOrder.length;
        currentTheme = themeOrder[nextIndex];
        
        applyTheme(currentTheme);
        saveTheme(currentTheme);
        
        const themeBtn = document.getElementById('theme-toggle');
        if (themeBtn) {
            themeBtn.innerHTML = themes[currentTheme].icon;
            themeBtn.title = `Theme: ${themes[currentTheme].name}`;
        }
    }
    
    function applyTheme(theme) {
        const body = document.body;
        body.classList.remove('theme-light', 'theme-dark', 'theme-matrix');
        body.classList.add(`theme-${theme}`);
    }
    
    function initializeThemes() {
        loadTheme();
        setupThemeButton();
    }
    
    setTimeout(initializeThemes, 100);
});
