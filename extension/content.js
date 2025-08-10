// Citeste site-urile blocate
chrome.storage.sync.get({ blockedSites: [] }, (data) => {
    const blocked = data.blockedSites;
    console.log("Site-uri blocate:", blocked);
    // trimite datele catre pagina web
    window.postMessage({ type: 'BLOCKED_SITES', data: blocked }, '*');
});

// Citeste obiectivele si task-urile
chrome.storage.sync.get({ habits: [], tasks: [] }, (data) => {
    const habits = data.habits;
    const tasks = data.tasks;
    console.log("Obiective:", habits);
    console.log("Task-uri:", tasks);
    // trimite datele catre pagina web
    window.postMessage({ type: 'PROGRESS_DATA', data: { habits, tasks } }, '*');
});

// Asculta mesaje de la pagina web pentru actualizarea progress-ului
window.addEventListener('message', (event) => {
    if (event.data.type === 'UPDATE_BLOCK_LIST'){
        const { blockedSites } = event.data.data;
        console.log("Actualizare lista de site-uri blocate:", blockedSites);
        // Salveaza in chrome.storage.sync
        chrome.storage.sync.set({ blockedSites: blockedSites }, () => {
            console.log('Lista de site-uri blocate actualizata in chrome.storage.sync');
        });
    }


    if (event.data.type === 'UPDATE_PROGRESS') {
        const { habits, tasks } = event.data.data;
        
        // Salveaza in chrome.storage.sync
        chrome.storage.sync.set({ 
            habits: habits,
            tasks: tasks
        }, () => {
            console.log('Progress actualizat in chrome.storage.sync');
        });
    }

    // Asculta mesaje pentru setarea flag-ului finish
    if (event.data.type === 'SET_FINISH_FLAG') {
        const { finish } = event.data.data;
        
        // Salveaza in chrome.storage.sync
        chrome.storage.sync.set({ finish: finish }, () => {
            console.log('Flag finish setat in chrome.storage.sync:', finish);
        });
    }
});