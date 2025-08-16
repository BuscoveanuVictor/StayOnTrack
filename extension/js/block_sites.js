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
      
    })
    .catch(error => {
        console.error("Eroare la adăugarea domeniului:", error);
        return;
    });
}

function localSave(list){
    chrome.storage.sync.set({ blockList : list}, () => {
        console.log("Domain salvat în sync storage!");
    });
}

document.getElementById('blockBtn').addEventListener('click', async() => {
    const domainElement = document.getElementById('domain');
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    try {
        const url = new URL(tab.url);
        const hostname = url.hostname;
        domainElement.textContent = hostname;

        chrome.storage.sync.get(['blockList'] , function(result) {
            const blockList = result.blockList || [];
            console.log(blockList)
            if(!blockList.includes(hostname)){
                remoteSave(hostname);
                localSave([...blockList, hostname])
                alert("Domeniul a fost adăugat cu succes la lista de blocare.");
            }
        });

    } catch (e) {
        domainElement.textContent = 'Invalid URL';
    }
});