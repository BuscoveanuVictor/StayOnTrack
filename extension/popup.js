// document.addEventListener('DOMContentLoaded', () => {
//     console.log("Script loaded!");
  
//     document.querySelectorAll('button').forEach(btn => {
//       btn.addEventListener('click', () => {
//         alert(`Ai apăsat: ${btn.innerText}`);
//       });
//     });
//   });

 // Setează culorile în funcție de mode din chrome.storage.sync
function setModeColors(mode) {
    if (mode === "allow") {
        document.body.style.setProperty('--main-bg', 'linear-gradient(135deg, #06b6d4 0%, #818cf8 100%)');
        document.body.style.setProperty('--nav-bg', '#0ea5e9');
        document.body.style.setProperty('--btn-color', '#6366f1');
        document.body.style.setProperty('--btn-hover', 'linear-gradient(90deg, #818cf8 0%, #06b6d4 100%)');
    } else {
        document.body.style.setProperty('--main-bg', 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)');
        document.body.style.setProperty('--nav-bg', '#23263a');
        document.body.style.setProperty('--btn-color', '#a5b4fc');
        document.body.style.setProperty('--btn-hover', 'linear-gradient(90deg, #6366f1 0%, #a21caf 100%)');
    }
}

// Setează textul butonului din navbar în funcție de mod
function setNavLabels(mode) {
    const btnBlock = document.getElementById('btnBlock');
    if (btnBlock) {
        btnBlock.innerHTML = mode === "allow" ? "Allow List" : "Block List";
    }
}

// Inițializare temă și label-uri la încărcare
if (chrome && chrome.storage && chrome.storage.sync) {
    chrome.storage.sync.get(['mode'], (data) => {
        const mode = data.mode || "block";
        setModeColors(mode);
        setNavLabels(mode);
    });
    // Ascultă schimbarea modului în timp real
    if (chrome.storage.onChanged) {
        chrome.storage.onChanged.addListener((changes, area) => {
            if (area === "sync" && changes.mode) {
                setModeColors(changes.mode.newValue || "block");
                setNavLabels(changes.mode.newValue || "block");
            }
        });
    }
} else {
    setModeColors("block");
    setNavLabels("block");
}

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

document.addEventListener('DOMContentLoaded', () => {

    btnBlock.addEventListener('click', () => {
        iframe.src = "templates/blockSites.html";
    });

    btnBreak.addEventListener('click', () => {
        iframe.src = "templates/breakTime.html";
    });

    btnTasks.addEventListener('click', () => {
        iframe.src = "templates/taskTracker.html";
    });
});
