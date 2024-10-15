// Array of bang configurations
const bangConfigurations = [
    { bang: 'p', destination: 'https://www.perplexity.ai/search?q=' },
    { bang: 'ddg', destination: 'https://duckduckgo.com/?q=' },
    { bang: 'w', destination: 'https://en.wikipedia.org/wiki/Special:Search?search=' },
    { bang: 'g', destination: 'https://www.google.com/?q=' },
    { bang: 'b', destination: 'https://www.bing.com/?q=' },
];

const bangPrefix = '';

// Array of pattern configurations
const patternConfigurations = [
    { // Route to Perplexity if the query is a question
        regex: /^(at what|how to|how does|what does|when does|where does|if the|when the|where to|look up|find the|info on|search for|what is|where is|why does|tell me|write about|explain|who is|look for|identify the|difference between|if a|when a)\s+/i,
        destination: 'https://www.perplexity.ai/search?q='
    },
    { // Catch-all for DuckDuckGo
        regex: /^/,
        destination: 'https://duckduckgo.com/?q='
    }
];

// Function to extract search query from URL
function getSearchQueryFromUrl() {
    const path = window.location.pathname.substring(1); // Remove leading slash
    return path ? decodeURIComponent(path.replace(/\+/g, ' ')) : null;
}

// Function to perform rerouting based on search query
function rerouteSearch(query) {
    if (!query) {
        displayFailureMessage();
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

    displayFailureMessage();
}

// Function to display failure message
function displayFailureMessage() {
    document.getElementById('message').textContent = 'Reroute failed<br>Make sure to provide a valid search query after the forward slash, delimited by + signs, like this: /how+to+do+something';
}

// Execute rerouting on page load
window.onload = function() {
    const searchQuery = getSearchQueryFromUrl();
    rerouteSearch(searchQuery);
};
