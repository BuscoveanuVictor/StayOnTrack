document.addEventListener('DOMContentLoaded', async () => {
    const domainElement = document.getElementById('domain');
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    try {
        const url = new URL(tab.url);
        const hostname = url.hostname;
        domainElement.textContent = hostname;
    

        document.getElementById('blockBtn').addEventListener('click', () => {
            // Salvăm domeniul în lista de block   
            chrome.storage.sync.get({ blockedSites: [] }, (data) => {
                const blocked = data.blockedSites;
                if (!blocked.includes(hostname)) {
                    blocked.push(hostname);
                    chrome.storage.sync.set({ blockedSites: blocked });
                }
            });
        });

        document.getElementById('editBtn').addEventListener('click', () => {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.update(tabs[0].id, {url: "http://localhost:80/block_list"});
            });
        });

    } catch (e) {
    domainElement.textContent = 'Invalid URL';
    }
});