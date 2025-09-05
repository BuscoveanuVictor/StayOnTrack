// Content.js este injectat in fiecare pagina web

// Si asculta mesajele de la pagina web pentru actualizare(update local storage etc.)
// deci e un middle man intre pagina web si extensie

window.addEventListener('message', (event) => {
    // acept mesaje doar de la domeniul nostru
    const origin = event.origin || (event.source && event.source.origin);
    if (origin && !origin.includes('stayontrack.site') && !origin.includes('localhost')) return;

    if (event.data.type === 'update-block-list-data'){
        chrome.storage.sync.set({ blockList : event.data.list }, () => {
            console.log("Sync storage updated!");
        });
    }

    if (event.data.type === 'update-task-list-data'){
        chrome.storage.sync.set({ taskList : event.data.list }, () => {
            console.log("Sync storage updated!");
        });
    }

    if (event.data.type === 'update-allow-list-data'){
        chrome.storage.sync.set({ allowList : event.data.list }, () => {
            console.log("Sync storage updated!");
        });
    }

    if (event.data.type === 'SET_MODE'){
        console.log("SET_MODE received in content.js:", event.data.mode);
        chrome.storage.sync.set({ mode : event.data.mode }, () => {
            console.log("Sync storage updated!");
        });
    }
});
