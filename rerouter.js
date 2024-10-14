// Array of search engine configurations
const searchEngines = [
    { regex: /^g\s(.+)/i, destination: 'https://www.google.com/search?q=' },
    { regex: /^b\s(.+)/i, destination: 'https://www.bing.com/search?q=' },
    { regex: /^ddg\s(.+)/i, destination: 'https://duckduckgo.com/?q=' },
    { regex: /^yt\s(.+)/i, destination: 'https://www.youtube.com/results?search_query=' },
];

// Function to extract search query from URL
function getSearchQueryFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('q');
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
