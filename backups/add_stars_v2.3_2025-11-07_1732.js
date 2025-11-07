// Simple script to add star buttons to currency items
document.addEventListener('DOMContentLoaded', function() {
    const currencyItems = document.querySelectorAll('.currency-item');
    
    currencyItems.forEach(function(item) {
        // Get the currency code from the text content
        const codeElement = item.querySelector('.currency-code');
        if (codeElement) {
            const currency = codeElement.textContent.trim();
            
            // Add data attribute
            item.setAttribute('data-currency', currency);
            
            // Create star button
            const starBtn = document.createElement('button');
            starBtn.className = 'star-btn';
            starBtn.innerHTML = '☆';
            starBtn.title = 'Add to favorites';
            
            // Add click handler
            starBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                toggleFavorite(currency);
            });
            
            // Append to currency item
            item.appendChild(starBtn);
        }
    });
});

// Placeholder for favorites functionality
function toggleFavorite(currency) {
    console.log('Toggle favorite for:', currency);
    // We'll add the real logic later
}
