// Cand se afieseaza pagina externsiei 
// de blocare a site-urilor sa vada userul
// ce site vrea sa blocheze

let currentSite;
window.addEventListener('load',()=>{
    chrome.storage.local.get(['currentSite'],(data)=>{
        currentSite = data.currentSite;
        chrome.storage.sync.get(['blockList'], (result) => {
            const blockList = result.blockList || [];
            const isBlocked = blockList.includes(currentSite);

            document.getElementById('domain').textContent = currentSite;

            if(isBlocked){
                document.getElementById('blockBtn').disabled = true;
                document.getElementById('blockBtn').textContent = "Site blocat";
            }
        });
    })
})

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

const WEB_URL = "http://localhost:3000";
function localSave(blockList){
    chrome.storage.sync.set({ blockList : blockList}, () => {
        console.log("Domain salvat în sync storage!");
    });
}

document.getElementById('blockBtn').addEventListener('click', async() => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    try {
       
        if(currentSite.includes('Invalid')) throw new Error("Invalid site");

        chrome.storage.sync.get(['blockList'] , function(result) {
            const blockList = result.blockList || [];
            // console.log(blockList)
            if(!blockList.includes(currentSite)){
                remoteSave(currentSite);
                localSave([...blockList, currentSite])
                showNotification("Domeniul a fost adăugat cu succes la lista de blocare.");
            } else {
                showNotification('Acest domeniu este deja in lista!', "#dc3545");
            }
        });

    } catch (e) {
        showNotification("Nu poti adauga acest domain", "#dc3545"); // roșu pentru eroare
    }
});

function showNotification(message, color = "#34c38f") {
    const notif = document.getElementById('notification');
    notif.textContent = message;
    notif.style.display = "block";
    notif.style.background = color;
    notif.style.color = "#fff";
    notif.style.transition = "opacity 0.3s";
    notif.style.opacity = 1;
    setTimeout(() => {
        notif.style.opacity = 0;
        setTimeout(() => notif.style.display = "none", 300);
    }, 2000);
}