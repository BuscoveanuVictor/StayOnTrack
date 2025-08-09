document.addEventListener('DOMContentLoaded', async () => {
    const domainElement = document.getElementById('domain');
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    try {
        const url = new URL(tab.url);
        const hostname = url.hostname;
        domainElement.textContent = hostname;
    

        document.getElementById('blockBtn').addEventListener('click', () => {
            // Salvăm domeniul în lista de block   

            fetch('http://localhost:5000/block_list/add_domain', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ domain: hostname })
            })
            .then(response => response.json())
            .then(data => {
                console.log("Domeniu adăugat:", data);
                alert("Domeniul a fost adăugat cu succes la lista de blocare.");
            })
            .catch(error => {
                console.error("Eroare la adăugarea domeniului:", error);
                return;
            });



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