let blockedSitesCache = [];

// Citeste site-urile blocate o singura data la pornirea extensiei
chrome.storage.sync.get({ blockedSites: [] }, (data) => {
    blockedSitesCache = data.blockedSites;
});

// Asculta schimbarile din storage pentru a actualiza cache-ul
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'sync' && changes.blockedSites) {
        blockedSitesCache = changes.blockedSites.newValue;
    }
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status === 'loading' || changeInfo.status === 'complete' && tab.active && tab.url) {
        try {
            const urlObj = new URL(tab.url);
            const hostname = urlObj.hostname;
            console.log("Hostname accesat:", hostname);

            // Foloseste cache-ul in loc sa citesti din storage
            if (blockedSitesCache.includes(hostname)) {
                console.log("Site-ul este blocat:", hostname);
                chrome.tabs.update(tabId, { url: "http://localhost"}); //aici era "http://localhost/progress"
            }
        } catch (e) {
            console.error("Eroare la procesarea URL-ului:", e);
        }
    }
});