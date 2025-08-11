let blockedSitesCache = [];

// // Citeste site-urile blocate o singura data la pornirea extensiei
// chrome.storage.sync.get({ blockedSites: [] }, (data) => {
//     blockedSitesCache = data.blockedSites;
// });

// // Asculta schimbarile din storage pentru a actualiza cache-ul
// chrome.storage.onChanged.addListener((changes, namespace) => {
//     if (namespace === 'sync' && changes.blockedSites) {
//         blockedSitesCache = changes.blockedSites.newValue;
//     }
// });

function updateLocalBlockList() {
    fetch('http://localhost:5000/block-list/blocked-sites.json')
    .then(response => response.json())
    .then(data => {
        
        console.log("Site-uri blocate obtinute:", data.blockedSites);
        chrome.storage.local.set(
        {
            blockedSites: {
                block_list : data.block_list, 
                last_updated : data.last_updated
            }
        })

        blockedSitesCache = data.block_list || [];
    })
    .catch(error => {
        console.error("Eroare la obtinerea site-urilor blocate:", error);
    });
}


chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    //console.log("Tab updated:", tabId, changeInfo, tab);
    if (changeInfo.status === 'loading' ||
         changeInfo.status === 'complete' && tab.active && tab.url) 
    {
        
        try {
            const urlObj = new URL(tab.url);
            const hostname = urlObj.hostname;
            //console.log("Hostname accesat:", hostname);

            chrome.storage.local.get(['blockedSites'], (result) => {
                // Verifica daca cache-ul este gol sau nu
              
                if(result.blockedSites == undefined || result.blockedSites.length == 0) {
                    updateLocalBlockList();
                }
                // Daca cache-ul nu este gol, verificam cand a fost ultima data actualizat
                else {
                    fetch('http://localhost:5000/blocked-sites.json/last-updated')
                    .then(response => response.json())
                    .then(data => {
                        //console.log("Ultima actualizare:", data.last_updated);
                        if (data.last_updated > result.blockedSites.last_updated) {
                            // Actualizeaza cache-ul cu site-urile blocate
                            updateLocalBlockList();
                        } else {
                            blockedSitesCache = result.blockedSites.block_list || [];
                            console.log("Lista site uri blocate la zi");
                        }
                    })
                    .catch(error => {
                        console.error("Eroare la verificarea ultimei actualizari:", error);
                    });
                }
            })


            if (blockedSitesCache.includes(hostname)) {
                console.log("Site-ul este blocat:", hostname);
                chrome.tabs.update(tabId, { url: "http://localhost:3000"}); //aici era "http://localhost/progress"
                //chrome.tabs.update(tabId, { url: chrome.runtime.getURL("blocked.html") });
            }

        } catch (e) {
            console.error("Eroare la procesarea URL-ului:", e);
        }
    }
});