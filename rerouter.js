// Function to get cookie value
function getCookie(name) {
    const value = document.cookie.split('; ').find(row => row.startsWith(name + '='));
    return value ? JSON.parse(decodeURIComponent(value.split('=')[1])) : null;
}

// Load configurations from cookies
function loadConfigurationsFromCookies() {
    const cookieData = getCookie('serchData');
    if (cookieData) {
        bangConfigurations = cookieData.bangs;
        bangPrefix = cookieData.prefix;

        patternConfigurations = cookieData.patterns.map(pattern => ({
            regex: new RegExp(pattern.pattern, 'i'),
            destination: pattern.destination
        }));

        includeDdgBangs = cookieData.includeDdgBangs;
        currentTheme = cookieData.theme;
    }
}

// Array of bang configurations (will be populated from cookies)
let bangConfigurations = [];

let bangPrefix = '';

// Array of pattern configurations (will be populated from cookies)
let patternConfigurations = [];

// Flag for including DuckDuckGo bangs
let includeDdgBangs = false;

// Current theme
let currentTheme = 'light';

// Function to extract search query from URL
function getSearchQueryFromUrl() {
    const path = window.location.pathname.substring(1); // Remove leading slash
    return path ? decodeURIComponent(path.replace(/\+/g, ' ')) : null;
}

// Function to perform rerouting based on search query
function rerouteSearch(query) {
    if (!query) {
        displaySettingsPage();
        return;
    }

    // Check for bangs first
    for (const config of bangConfigurations) {
        if (query.startsWith(bangPrefix + config.bang + ' ')) {
            const cleanedQuery = query.substring(bangPrefix.length + config.bang.length + 1);
            const encodedSearchTerm = encodeURIComponent(cleanedQuery).replace(/%20/g, '+');
            window.location.href = `${config.destination}${encodedSearchTerm}`;
            return;
        }
    }

    // Check DDG bangs if enabled
    if (includeDdgBangs) {
        if (query.startsWith(bangPrefix)) {
            const bangWithSpace = query.substring(bangPrefix.length).split(' ')[0] + ' ';
            for (const ddgBang of ddgBangs) {
                if (query.substring(bangPrefix.length).startsWith(ddgBang.t + ' ')) {
                    const cleanedQuery = query.substring(bangPrefix.length + ddgBang.t.length + 1);
                    const encodedSearchTerm = encodeURIComponent(cleanedQuery).replace(/%20/g, '+');
                    window.location.href = `${ddgBang.d}${encodedSearchTerm}`;
                    return;
                }
            }
        }
    }

    // Check for patterns second
    for (const pattern of patternConfigurations) {
        if (pattern.regex.test(query)) {
            const encodedSearchTerm = encodeURIComponent(query).replace(/%20/g, '+');
            window.location.href = `${pattern.destination}${encodedSearchTerm}`;
            return;
        }
    }

    displaySettingsPage();
}

// Function to display settings page
function displaySettingsPage() {
    window.location.href = 'config.html';
}

// Function to apply theme
function applyTheme(theme) {
    document.body.style.backgroundColor = theme === 'dark' ? '#1a1a1a' : '#ffffff';
    // Add more theme-related styles here if needed
}

// Execute rerouting on page load
window.onload = async function() {
    if (includeDdgBangs) {
        await loadDdgBangs();
    }
    loadConfigurationsFromCookies();
    applyTheme(currentTheme);
    const searchQuery = getSearchQueryFromUrl();
    rerouteSearch(searchQuery);
};

let ddgBangs = []; // This will store the bangs from bangs.json

// Function to load DDG bangs
async function loadDdgBangs() {
    try {
        const response = await fetch('bangs.json');
        ddgBangs = await response.json();
    } catch (error) {
        console.error('Error loading DDG bangs:', error);
    }
}
