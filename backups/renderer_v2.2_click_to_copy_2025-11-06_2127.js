const { ipcRenderer } = require('electron');

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
    BTC: 0.0000105, // 1 USD = 0.0000105 BTC (assuming ~$95,000 per BTC)
    SAT: 1050 // 1 USD = 1,050 Satoshis (100M sats per BTC)
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

// Window control buttons
const minimizeBtn = document.getElementById('minimize-btn');
const pinBtn = document.getElementById('pin-btn');
const closeBtn = document.getElementById('close-btn');

// Event listeners
amountInput.addEventListener('input', updateConversions);
currencySelect.addEventListener('change', () => {
    currentBaseCurrency = currencySelect.value;
    updateConversions();
});

// Window controls
minimizeBtn.addEventListener('click', () => {
    ipcRenderer.send('minimize-window');
});

pinBtn.addEventListener('click', () => {
    ipcRenderer.send('toggle-always-on-top');
    pinBtn.classList.toggle('active');
});

closeBtn.addEventListener('click', () => {
    ipcRenderer.send('close-window');
});

// API configuration
const API_ENDPOINTS = [
    {
        name: 'ExchangeRate-API',
        url: 'https://api.exchangerate-api.com/v4/latest/USD',
        parseResponse: (data) => ({
            USD: 1,
            EUR: data.rates.EUR,
            GBP: data.rates.GBP,
            AED: data.rates.AED,
            ZAR: data.rates.ZAR
        })
    },
    {
        name: 'CoinGecko',
        url: 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd',
        parseResponse: (data) => ({
            BTC: 1 / data.bitcoin.usd, // 1 USD = (1/bitcoin_price) BTC
            SAT: 100000000 / data.bitcoin.usd // 1 USD = (100M/bitcoin_price) SAT
        })
    }
];

// Fetch exchange rates from multiple APIs
async function fetchExchangeRates() {
    if (isUpdatingRates) return;
    
    isUpdatingRates = true;
    showLoading(true);
    hideError();

    try {
        const promises = API_ENDPOINTS.map(async (endpoint) => {
            try {
                const response = await fetch(endpoint.url, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                    }
                });
                
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                
                const data = await response.json();
                return endpoint.parseResponse(data);
            } catch (error) {
                console.warn(`Failed to fetch from ${endpoint.name}:`, error.message);
                return null;
            }
        });

        const results = await Promise.all(promises);
        
        // Merge successful results
        let newRates = { ...exchangeRates }; // Keep current rates as fallback
        let hasUpdates = false;

        results.forEach((result, index) => {
            if (result) {
                Object.assign(newRates, result);
                hasUpdates = true;
                console.log(`Updated rates from ${API_ENDPOINTS[index].name}`);
            }
        });

        if (hasUpdates) {
            exchangeRates = newRates;
            lastUpdated = new Date();
            updateLastUpdatedDisplay();
            updateConversions();
            console.log('Exchange rates updated successfully', exchangeRates);
        } else {
            throw new Error('All API endpoints failed');
        }

    } catch (error) {
        console.error('Failed to update exchange rates:', error);
        showError('Unable to fetch latest rates. Using cached data.');
    } finally {
        isUpdatingRates = false;
        showLoading(false);
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
}

// Convert any currency to USD
function convertToUSD(amount, fromCurrency) {
    if (fromCurrency === 'USD') return amount;
    // To convert TO USD, we divide by the exchange rate
    // Example: 1 EUR = 1/0.92 USD = 1.087 USD
    return amount / exchangeRates[fromCurrency];
}

// Convert USD to any currency
function convertFromUSD(usdAmount, toCurrency) {
    if (toCurrency === 'USD') return usdAmount;
    // To convert FROM USD, we multiply by the exchange rate
    // Example: 1 USD = 0.92 EUR
    return usdAmount * exchangeRates[toCurrency];
}

// Update display for a specific currency - FIXED VERSION
function updateCurrencyDisplay(currency, amount) {
    // Find by iterating through currency items (more reliable approach)
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
        if (currency === 'BTC') return '0.00000000';
        if (currency === 'SAT') return '0';
        return '0.00';
    }

    switch (currency) {
        case 'BTC':
            // For Bitcoin, show 8 decimals with comma separators for whole numbers
            const btcFormatted = amount.toFixed(8);
            const parts = btcFormatted.split('.');
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            return parts.join('.');
        case 'SAT':
            return Math.round(amount).toLocaleString();
        default:
            return amount.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
    }
}

// UI helper functions
function showLoading(show) {
    if (loadingDiv) {
        loadingDiv.classList.toggle('hidden', !show);
    }
}

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

// Initialize the app
function initialize() {
    console.log('Currency Converter initialized');
    console.log('Initial exchange rates:', exchangeRates);
    
    // Set initial values
    if (amountInput) amountInput.value = '';
    currentBaseCurrency = 'USD';
    
    // Fetch initial rates
    fetchExchangeRates();
    
    // Set up periodic updates (every 5 minutes)
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

// Integrate with favorites system
const originalUpdateConversions = updateConversions;
updateConversions = function() {
    originalUpdateConversions.call(this);
    // Update favorite values if favorites functionality is loaded
    if (typeof updateFavoriteValues === 'function') {
        setTimeout(updateFavoriteValues, 100);
    }
};
