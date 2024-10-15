// Function to get cookie value
function getCookie(name) {
    const value = document.cookie.split('; ').find(row => row.startsWith(name + '='));
    return value ? JSON.parse(decodeURIComponent(value.split('=')[1])) : null;
}

// Load configurations from cookies
function loadConfigurationsFromCookies() {
    const cookieData = getCookie('serchData');
    if (cookieData) {
        bangConfigurations.length = 0; // Clear existing configurations
        bangConfigurations.push(...cookieData.bangs);
        bangPrefix = cookieData.prefix;

        patternConfigurations.length = 0; // Clear existing configurations
        patternConfigurations.push(...cookieData.patterns.map(pattern => ({
            regex: new RegExp(pattern.pattern, 'i'),
            destination: pattern.destination
        })));
    }
}

// Array of bang configurations (will be populated from cookies)
let bangConfigurations = [];

let bangPrefix = '';

// Array of pattern configurations (will be populated from cookies)
let patternConfigurations = [];

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

// Function to display failure message
function displaySettingsPage() {
    window.location.href = 'config.html';
}

// Execute rerouting on page load
window.onload = function() {
    loadConfigurationsFromCookies();
    const searchQuery = getSearchQueryFromUrl();
    rerouteSearch(searchQuery);
};
