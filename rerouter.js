// Array of search engine configurations
const searchEngines = [
    { regex: /^p\+(.+)/i, destination: 'https://www.perplexity.ai/search?q=' },
    { regex: /^ddg\+(.+)/i, destination: 'https://duckduckgo.com/?q=' },
    { regex: /^w\+(.+)/i, destination: 'https://en.wikipedia.org/wiki/Special:Search?search=' },
    { regex: /^(at what|how to|how does|what does|when does|where does|if the|when the|look up|find the|search for|what is|where is|why does)/i, destination: 'https://www.perplexity.ai/search?q=' },
    { regex: /^(.+)/i, destination: 'https://duckduckgo.com/?q=' }, // Catch-all for DuckDuckGo
];

// Function to extract search query from URL
function getSearchQueryFromUrl() {
    const path = window.location.pathname.substring(1); // Remove leading slash
    return path ? decodeURIComponent(path) : null;
}

// Function to perform rerouting based on search query
function rerouteSearch(query) {
    if (!query) {
        displayFailureMessage();
        return;
    }

    for (const engine of searchEngines) {
        const match = query.match(engine.regex);
        if (match) {
            const searchTerm = encodeURIComponent(match[1]);
            window.location.href = `${engine.destination}${searchTerm}`;
            return;
        }
    }

    displayFailureMessage();
}

// Function to display failure message
function displayFailureMessage() {
    document.getElementById('message').textContent = 'Reroute failed';
}

// Execute rerouting on page load
window.onload = function() {
    const searchQuery = getSearchQueryFromUrl();
    rerouteSearch(searchQuery);
};
