// Favorites functionality for Currency Converter
let favorites = new Set();

// Load favorites from localStorage
function loadFavorites() {
    try {
        const saved = localStorage.getItem('currencyFavorites');
        if (saved) {
            favorites = new Set(JSON.parse(saved));
        }
    } catch (error) {
        console.warn('Could not load favorites:', error);
        favorites = new Set();
    }
}

// Save favorites to localStorage
function saveFavorites() {
    try {
        localStorage.setItem('currencyFavorites', JSON.stringify([...favorites]));
    } catch (error) {
        console.warn('Could not save favorites:', error);
    }
}

// Toggle favorite status
function toggleFavorite(currency) {
    if (favorites.has(currency)) {
        favorites.delete(currency);
    } else {
        favorites.add(currency);
    }
    saveFavorites();
    updateStarButtons();
    updateFavoritesDisplay();
}

// Update star button appearances
function updateStarButtons() {
    const starButtons = document.querySelectorAll('.star-btn');
    starButtons.forEach(btn => {
        const currencyItem = btn.closest('.currency-item');
        const currency = currencyItem.getAttribute('data-currency');
        
        if (favorites.has(currency)) {
            btn.innerHTML = '★';
            btn.classList.add('active');
            btn.title = 'Remove from favorites';
            currencyItem.classList.add('favorite');
        } else {
            btn.innerHTML = '☆';
            btn.classList.remove('active');
            btn.title = 'Add to favorites';
            currencyItem.classList.remove('favorite');
        }
    });
}

// Create favorites section in DOM
function createFavoritesSection() {
    const resultsSection = document.getElementById('results');
    const conversionGrid = resultsSection.querySelector('.conversion-grid');
    
    // Create favorites container
    const favoritesContainer = document.createElement('div');
    favoritesContainer.id = 'favorites-container';
    favoritesContainer.style.display = 'none';
    
    const favoritesSection = document.createElement('div');
    favoritesSection.className = 'favorites-section';
    
    const favoritesTitle = document.createElement('div');
    favoritesTitle.className = 'favorites-title';
    favoritesTitle.innerHTML = '⭐ Favorites';
    
    const favoritesGrid = document.createElement('div');
    favoritesGrid.id = 'favorites-grid';
    favoritesGrid.className = 'conversion-grid';
    
    favoritesSection.appendChild(favoritesTitle);
    favoritesSection.appendChild(favoritesGrid);
    favoritesContainer.appendChild(favoritesSection);
    
    // Insert before the main conversion grid
    resultsSection.insertBefore(favoritesContainer, conversionGrid);
}

// Update favorites display section
function updateFavoritesDisplay() {
    let favoritesContainer = document.getElementById('favorites-container');
    if (!favoritesContainer) {
        createFavoritesSection();
        favoritesContainer = document.getElementById('favorites-container');
    }
    
    const favoritesGrid = document.getElementById('favorites-grid');
    
    // Clear existing favorites
    favoritesGrid.innerHTML = '';
    
    if (favorites.size === 0) {
        favoritesContainer.style.display = 'none';
        return;
    }
    
    // Show favorites section
    favoritesContainer.style.display = 'block';
    
    // Add favorite currencies to the grid (sorted alphabetically)
    const sortedFavorites = [...favorites].sort();
    sortedFavorites.forEach(currency => {
        // Find the original currency item to get current value
        const mainItem = document.querySelector(`.currency-item[data-currency="${currency}"]`);
        if (!mainItem) return;
        
        const currentValue = mainItem.querySelector('.currency-value').textContent;
        
        // Create favorite currency item
        const currencyItem = document.createElement('div');
        currencyItem.className = 'currency-item favorite';
        currencyItem.setAttribute('data-currency', currency);
        
        currencyItem.innerHTML = `
            <span class="currency-code">${currency}</span>
            <span class="currency-value">${currentValue}</span>
            <button class="star-btn active" title="Remove from favorites">★</button>
        `;
        
        // Add click handler for star button
        const starBtn = currencyItem.querySelector('.star-btn');
        starBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleFavorite(currency);
        });
        
        favoritesGrid.appendChild(currencyItem);
    });
}

// Update favorites values when main conversion updates
function updateFavoriteValues() {
    const favoritesGrid = document.getElementById('favorites-grid');
    if (!favoritesGrid) return;
    
    const favoriteItems = favoritesGrid.querySelectorAll('.currency-item');
    favoriteItems.forEach(item => {
        const currency = item.getAttribute('data-currency');
        const mainItem = document.querySelector(`#results .conversion-grid .currency-item[data-currency="${currency}"]`);
        
        if (mainItem) {
            const currentValue = mainItem.querySelector('.currency-value').textContent;
            const favoriteValueElement = item.querySelector('.currency-value');
            if (favoriteValueElement) {
                favoriteValueElement.textContent = currentValue;
            }
        }
    });
}

// Initialize favorites functionality
function initializeFavorites() {
    loadFavorites();
    
    // Wait a moment for the star buttons to be created
    setTimeout(() => {
        updateStarButtons();
        updateFavoritesDisplay();
    }, 500);
}

// Override the original toggleFavorite function from add_stars.js
window.toggleFavorite = toggleFavorite;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeFavorites();
});

// Export functions for use by main app
window.updateFavoriteValues = updateFavoriteValues;
