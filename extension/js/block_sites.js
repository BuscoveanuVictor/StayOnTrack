function localSave(hostname){
    chrome.storage.sync.get({ blockedSites: [] }, (data) => {
        const blocked = data.blockedSites;
        if (!blocked.includes(hostname)) {
            blocked.push(hostname);
            chrome.storage.sync.set({ blockedSites: blocked });
        }
    });
}

function remoteSave(hostname){
    fetch('http://localhost:5000/block-list/add-domain', {
        method: 'POST',
        credentials : "include",
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
}
    
document.addEventListener('DOMContentLoaded', async () => {
    const domainElement = document.getElementById('domain');
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    try {
        const url = new URL(tab.url);
        const hostname = url.hostname;
        domainElement.textContent = hostname;

        document.getElementById('blockBtn').addEventListener('click', () => {
            console.log("salut!!!!")
            localSave(hostname);
            remoteSave(hostname);
        });

        document.getElementById('editBtn').addEventListener('click', () => {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                // Redirectionare catre pagina de site-uri blocate(unde pot sa modific lista)
                chrome.tabs.update(tabs[0].id, {url: "http://localhost:3000/block_list"});
            });
        });

    } catch (e) {
        domainElement.textContent = 'Invalid URL';
    }
});

window.addEventListener('message', (event) => {
    
    if (event.data.type === 'UPDATE_BLOCK_LIST'){
        console.log("SALUT")
        // chrome.storage.sync.set({ blockList : event.data.blockList }, () => {
        //     console.log("Date salvate în sync storage!");
        // });
    }
    // if (event.data.type === 'UPDATE_PROGRESS') {
    //     const { habits, tasks } = event.data.data;
        
    //     // Salveaza in chrome.storage.sync
    //     

    // // Asculta mesaje pentru setarea flag-ului finish
    // if (event.data.type === 'SET_FINISH_FLAG') {
    //     const { finish } = event.data.data;
        
    //     // Salveaza in chrome.storage.sync
    //     chrome.storage.sync.set({ finish: finish }, () => {
    //         console.log('Flag finish setat in chrome.storage.sync:', finish);
    //     });
    // }
});