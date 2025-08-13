function updateBlockList(){

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
