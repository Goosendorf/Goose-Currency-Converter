// Click-to-Copy functionality for Currency Converter
document.addEventListener('DOMContentLoaded', function() {
    
    // Add copy functionality to all currency items
    function initializeClickToCopy() {
        const currencyItems = document.querySelectorAll('.currency-item');
        
        currencyItems.forEach(function(item) {
            // Add click handler to the currency value element
            const valueElement = item.querySelector('.currency-value');
            if (valueElement) {
                valueElement.style.cursor = 'pointer';
                valueElement.title = 'Click to copy';
                
                valueElement.addEventListener('click', function(e) {
                    e.stopPropagation();
                    copyValueToClipboard(item);
                });
                
                // Add hover effect
                valueElement.addEventListener('mouseenter', function() {
                    valueElement.style.background = 'rgba(0, 123, 255, 0.1)';
                    valueElement.style.borderRadius = '4px';
                    valueElement.style.padding = '2px 4px';
                });
                
                valueElement.addEventListener('mouseleave', function() {
                    valueElement.style.background = '';
                    valueElement.style.borderRadius = '';
                    valueElement.style.padding = '';
                });
            }
        });
    }
    
    // Copy currency value to clipboard
    function copyValueToClipboard(currencyItem) {
        const codeElement = currencyItem.querySelector('.currency-code');
        const valueElement = currencyItem.querySelector('.currency-value');
        
        if (codeElement && valueElement) {
            const currency = codeElement.textContent.trim();
            const value = valueElement.textContent.trim();
            const textToCopy = `${value} ${currency}`;
            
            // Try to copy to clipboard
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(textToCopy).then(function() {
                    showCopyFeedback(currencyItem, 'Copied!');
                }).catch(function(err) {
                    console.warn('Failed to copy to clipboard:', err);
                    fallbackCopy(textToCopy, currencyItem);
                });
            } else {
                fallbackCopy(textToCopy, currencyItem);
            }
        }
    }
    
    // Fallback copy method for older browsers
    function fallbackCopy(text, currencyItem) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            const successful = document.execCommand('copy');
            document.body.removeChild(textArea);
            if (successful) {
                showCopyFeedback(currencyItem, 'Copied!');
            } else {
                showCopyFeedback(currencyItem, 'Copy failed');
            }
        } catch (err) {
            console.warn('Fallback copy failed:', err);
            document.body.removeChild(textArea);
            showCopyFeedback(currencyItem, 'Copy not supported');
        }
    }
    
    // Show visual feedback when copying
    function showCopyFeedback(currencyItem, message) {
        const feedback = document.createElement('div');
        feedback.className = 'copy-feedback';
        feedback.textContent = message;
        feedback.style.position = 'absolute';
        feedback.style.background = '#4CAF50';
        feedback.style.color = 'white';
        feedback.style.padding = '4px 8px';
        feedback.style.borderRadius = '4px';
        feedback.style.fontSize = '12px';
        feedback.style.zIndex = '1000';
        feedback.style.pointerEvents = 'none';
        feedback.style.opacity = '0';
        feedback.style.transition = 'opacity 0.2s ease';
        
        // Position feedback near the clicked item
        const rect = currencyItem.getBoundingClientRect();
        feedback.style.left = (rect.left + rect.width / 2 - 30) + 'px';
        feedback.style.top = (rect.top - 30) + 'px';
        
        document.body.appendChild(feedback);
        
        // Animate in
        setTimeout(() => {
            feedback.style.opacity = '1';
        }, 10);
        
        // Remove after delay
        setTimeout(() => {
            feedback.style.opacity = '0';
            setTimeout(() => {
                if (feedback.parentNode) {
                    feedback.parentNode.removeChild(feedback);
                }
            }, 200);
        }, 1500);
    }
    
    // Initialize when DOM is ready
    setTimeout(initializeClickToCopy, 600); // Wait for other scripts to add currency items
    
    // Re-initialize when favorites are updated (for dynamically added items)
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // Check if new currency items were added
                const addedNodes = Array.from(mutation.addedNodes);
                const hasCurrencyItems = addedNodes.some(node => 
                    node.nodeType === Node.ELEMENT_NODE && 
                    (node.classList.contains('currency-item') || node.querySelector('.currency-item'))
                );
                
                if (hasCurrencyItems) {
                    setTimeout(initializeClickToCopy, 100);
                }
            }
        });
    });
    
    // Observe the results section for changes
    const resultsSection = document.getElementById('results');
    if (resultsSection) {
        observer.observe(resultsSection, { childList: true, subtree: true });
    }
});
