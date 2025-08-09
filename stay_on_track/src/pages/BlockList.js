import React, { useState } from 'react';
import styles from './BlockList.module.css';

function BlockList() {

    let blockedSites = [];

    function openModal() {
        document.getElementById('blockModal').style.display = 'block';
    }

    function closeModal() {
        document.getElementById('blockModal').style.display = 'none';
        document.getElementById('domainInput').value = '';
    }

    function addDomain() {
        const input = document.getElementById('domainInput');
        const domain = input.value.trim();
        
        if (!domain) {
            alert('Te rog introdu un domeniu!');
            return;
        }

        if (blockedSites.includes(domain)) {
            alert('Acest domeniu este deja in lista!');
            return;
        }

        blockedSites.push(domain);

        fetch('http://localhost:5000/block_list/add_domain',{
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                domain: domain
            })
        })
        .then(response => response.json())
        .then(data => console.log("Raspuns primit: ", data))
        .catch(err => console.error('Eroare:', err));
        
        displayBlockedSites();
        closeModal();
    }

    function removeDomain(domain) {
        // if (confirm(`Esti sigur ca vrei sa elimini "${domain}" din lista?`)) {
        //     blockedSites = blockedSites.filter(site => site !== domain);
        //     localStorage.setItem('blockedSites', JSON.stringify(blockedSites));
        //     displayBlockedSites();
        // }
    }

    function displayBlockedSites() {
        const blockedItems = document.getElementById('blockedItems');
        
        if (blockedSites.length === 0) {
            blockedItems.innerHTML = '<div class="empty-state">Nu ai site-uri blocate momentan</div>';
            return;
        }

        blockedItems.innerHTML = blockedSites.map(site => `
            <li class="blocked-item">
                <span class="site-name">🌐 ${site}</span>
                <button class="remove-btn" onclick="removeDomain('${site}')">Sterge</button>
            </li>
        `).join('');
    }

    // Inchide modal-ul cand se apasa in afara lui
    window.onclick = function(event) {
        const modal = document.getElementById('blockModal');
        if (event.target === modal) {
            closeModal();
        }
    }

    // Incarca site-urile blocate la pornirea paginii
    document.addEventListener('DOMContentLoaded', () => {
        // fetch('block_list/load_block_list',{
        //     method: 'GET',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     }
        // })
        // .then(response => response.json())
        // .then(data => {
        //     console.log("Raspuns primit: ", data);
        //     blockedSites = data['block_list'] || [];
        //     localStorage.setItem('blockedSites', JSON.stringify(blockedSites));
        //     displayBlockedSites();
        // })
        // .catch(err => console.error('Eroare la incarcarea site-urilor blocate:', err));

      

    });

    // Asculta mesaje de la extensie
    window.addEventListener('message', (event) => {
        if (event.data.type === 'BLOCKED_SITES') {
            blockedSites = event.data.data;
            displayBlockedSites();
        }
    });

    return (

    <div>
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Block List</h1>
            </div>

            <div className={styles.content}>
                <div className={styles.section}>
                    <h2>Gestionare Site-uri Blocate</h2>
                    <button className={styles.addBtn} onClick={openModal}>+ Adauga Site Blocat</button>
                </div>

                <div className={styles.section}>
                    <h2>Site-uri Blocate</h2>
                    <ul id="blockedItems" className={styles.blockedList}>
                        {/* Aici vor fi afisate site-urile blocate */}
                    </ul>
                </div>
            </div>
        </div>


        <div id="blockModal" className={styles.modal}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <div className={styles.modalTitle}>Adauga Site Blocat</div>
                    <span className={styles.close} onClick={closeModal}>&times;</span>
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="domainInput">Domeniu:</label>
                    <input type="text" id="domainInput" placeholder="ex: example.com" />
                </div>
                <div className={styles.modalButtons}>
                    <button className={styles.btnSecondary} onClick={closeModal}>Anuleaza</button>
                    <button className={styles.btnPrimary} onClick={addDomain}>Adauga</button>
                </div>
            </div>
        </div>
    </div>

  );
}

export default BlockList;