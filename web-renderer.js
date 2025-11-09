// Web-compatible version of renderer.js (no Electron dependencies)

// Exchange rates storage - all rates represent "1 USD equals this many units of currency"
let exchangeRates = {
    USD: 1, // 1 USD = 1 USD
    EUR: 0.92, // 1 USD = 0.92 EUR 
    GBP: 0.79, // 1 USD = 0.79 GBP
    JPY: 150,
    CAD: 1.37,
    AUD: 1.53,
    CHF: 0.89,
    CNY: 7.25,
    INR: 83.5,
    AED: 3.67,
    ZAR: 18.75, // 1 USD = 18.75 ZAR
    BTC: 0.0000135, // 1 USD = 0.0000135 BTC (assuming ~$74,000 per BTC)
    SAT: 1350 // 1 USD = 1,350 Satoshis (100M sats per BTC)
};

let lastUpdated = null;
let currentBaseCurrency = 'USD';
let isUpdatingRates = false;

// DOM elements
const amountInput = document.getElementById('amount-input');
const currencySelect = document.getElementById('currency-select');
const loadingDiv = document.getElementById('loading');
const lastUpdatedDiv = document.getElementById('last-updated');
const errorDiv = document.getElementById('error');

// Web-compatible window controls (no Electron IPC)
const minimizeBtn = document.getElementById('minimize-btn');
const pinBtn = document.getElementById('pin-btn');
const closeBtn = document.getElementById('close-btn');

// Web version - hide window controls since they won't work
if (minimizeBtn) minimizeBtn.style.display = 'none';
if (pinBtn) pinBtn.style.display = 'none';
if (closeBtn) closeBtn.style.display = 'none';

// API endpoints for fetching exchange rates
const APIs = [
    {
        name: 'ExchangeRate-API',
        url: 'https://api.exchangerate-api.com/v4/latest/USD',
        parseResponse: (data) => ({
            USD: 1,
            EUR: data.rates.EUR,
            GBP: data.rates.GBP,
            AED: data.rates.AED,
            ZAR: data.rates.ZAR,
            JPY: data.rates.JPY,
            CAD: data.rates.CAD,
            AUD: data.rates.AUD,
            CHF: data.rates.CHF,
            CNY: data.rates.CNY,
            INR: data.rates.INR
        })
    }
];

// Fetch exchange rates from APIs
async function fetchExchangeRates() {
    if (isUpdatingRates) return;
    isUpdatingRates = true;
    showLoading(true);
    hideError();

    try {
        const response = await fetch(APIs[0].url);
        if (!response.ok) throw new Error('Failed to fetch rates');
        
        const data = await response.json();
        const rates = APIs[0].parseResponse(data);
        
        // Update exchange rates
        Object.assign(exchangeRates, rates);
        
        lastUpdated = new Date();
        updateLastUpdatedDisplay();
        updateConversions();
        
        console.log('Exchange rates updated successfully');
    } catch (error) {
        console.warn('Failed to fetch exchange rates:', error);
        showError('Failed to update exchange rates. Using cached values.');
    } finally {
        showLoading(false);
        isUpdatingRates = false;
    }
}

// Update conversions based on current input
function updateConversions() {
    const amount = parseFloat(amountInput.value) || 0;
    const baseCurrency = currentBaseCurrency;
    
    console.log(`Updating conversions: ${amount} ${baseCurrency}`);
    
    if (amount <= 0) {
        // Reset all values to zero
        Object.keys(exchangeRates).forEach(currency => {
            updateCurrencyDisplay(currency, 0);
        });
        return;
    }

    // Convert input amount to USD first, then to all other currencies
    const amountInUSD = convertToUSD(amount, baseCurrency);
    console.log(`${amount} ${baseCurrency} = ${amountInUSD} USD`);
    
    Object.keys(exchangeRates).forEach(currency => {
        const convertedAmount = convertFromUSD(amountInUSD, currency);
        updateCurrencyDisplay(currency, convertedAmount);
        console.log(`${amountInUSD} USD = ${convertedAmount} ${currency}`);
    });
    
    // Update favorite values if favorites functionality is loaded
    if (typeof updateFavoriteValues === 'function') {
        setTimeout(updateFavoriteValues, 100);
    }
}

// Convert any currency to USD
function convertToUSD(amount, fromCurrency) {
    if (fromCurrency === 'USD') return amount;
    return amount / exchangeRates[fromCurrency];
}

// Convert USD to any currency
function convertFromUSD(usdAmount, toCurrency) {
    return usdAmount * exchangeRates[toCurrency];
}

// Update display for a specific currency
function updateCurrencyDisplay(currency, amount) {
    const currencyItems = document.querySelectorAll('.currency-item');
    currencyItems.forEach(item => {
        const codeElement = item.querySelector('.currency-code');
        if (codeElement && codeElement.textContent.trim() === currency) {
            const valueElement = item.querySelector('.currency-value');
            if (valueElement) {
                valueElement.textContent = formatCurrency(amount, currency);
            }
        }
    });
}

// Format currency values appropriately
function formatCurrency(amount, currency) {
    if (amount === 0) {
        return currency === 'BTC' ? '0.00000000' : 
               ['JPY', 'SAT'].includes(currency) ? '0' : '0.00';
    }
    
    const decimals = currency === 'BTC' ? 8 : 
                    ['JPY', 'SAT'].includes(currency) ? 0 : 2;
    
    return amount.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    });
}

// Show/hide loading indicator
function showLoading(show) {
    if (loadingDiv) {
        loadingDiv.classList.toggle('hidden', !show);
    }
}

// Show error message
function showError(message) {
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.classList.remove('hidden');
        setTimeout(() => hideError(), 5000);
    }
}

function hideError() {
    if (errorDiv) {
        errorDiv.classList.add('hidden');
    }
}

function updateLastUpdatedDisplay() {
    if (lastUpdated && lastUpdatedDiv) {
        const timeStr = lastUpdated.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
        });
        lastUpdatedDiv.textContent = `Last updated: ${timeStr}`;
    }
}

// Event listeners
function setupEventListeners() {
    if (amountInput) {
        amountInput.addEventListener('input', updateConversions);
    }
    
    if (currencySelect) {
        currencySelect.addEventListener('change', (e) => {
            currentBaseCurrency = e.target.value;
            updateConversions();
        });
    }
}

// Initialize the application
function initialize() {
    setupEventListeners();
    
    // Fetch rates on startup
    fetchExchangeRates();
    
    // Auto-refresh every 5 minutes
    setInterval(fetchExchangeRates, 5 * 60 * 1000);
    
    // Initial display update
    updateConversions();
}

// Start the application when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
} else {
    initialize();
}
