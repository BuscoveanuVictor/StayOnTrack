import React, { useEffect, useState }from 'react';
import styles from './BlockList.module.css';
import Modal from './Modal';



function BlockList() {

    const [blockList, setBlockList] = React.useState([]);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [blockedDomain, setBlockedDomain] = React.useState('');

    const loadBlockList = () => {
        fetch('/block-list/blocked-sites.json',{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {

            console.log("Raspuns primit: ", data);
            //blockList = data['block_list'] || [];

            setBlockList(data.block_list || []);

            localStorage.setItem('blockList', JSON.stringify(blockList));
            console.log("Site-uri blocate incarcate!!!!:", blockList);
        })
    }

  
    const addToBlockList = (domain) => {
        if (!domain) {
            alert('Te rog introdu un domeniu!');
            return;
        }

        if (blockList.includes(domain)) {
            alert('Acest domeniu este deja in lista!');
            return;
        }

        fetch('http://localhost:5000/block-list/add-domain',{
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                domain: domain
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log("Raspuns primit: ", data)
            setBlockList(blockList => [...blockList, domain]);
        })
        .catch(err => console.error('Eroare:', err));
    }

   

    const removeDomain = (domain)=> { 
        console.log("Sterg site-ul:", domain);
        fetch(`http://localhost:5000/block-list/remove-domain`,{
            method: 'DELETE',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                domain: domain
            })
        })
        .then(response => response.json())
        .then(data => {
            setBlockList(blockList.filter(site => site !== domain));
            localStorage.setItem('blockList', JSON.stringify(blockList));
        })
        .catch(err => console.error('Eroare:', err));       
    }

    useEffect(()=> {
        blockList.map((item, index) => (
            <li key={index} className={styles.blockedItem}>
                <span className={styles.siteName}>🌐 {item}</span>
                <button className={styles.removeBtn} onClick={() => removeDomain(item)}>Sterge</button>
            </li>
        ))
        // Incarca site-urile blocate la pornirea paginii
        loadBlockList();
    }, []);
    

    const handleSave = () => {
      addToBlockList(blockedDomain);
      setIsModalOpen(false);
    };

    function BlockList({ children }) {
        return (
          <ul id="blockedItems" className={styles.blockedList}>
            {React.Children.map(children, (child) => (
                <li
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "4px 0"
                    }}
                >

                {child}
                
                <span
                    onClick={() => removeDomain(child)}
                    style={{
                        marginLeft: "8px",
                        cursor: "pointer",
                        userSelect: "none",
                        transition: "transform 0.1s ease"
                    }}
                    onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.85)")}
                    onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                    🗑️
                </span>
                </li>
            ))}
          </ul>
        );
    }

    return (

    <div>
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Block List</h1>
            </div>

            <div className={styles.content}>
                <div className={styles.section}>
                    <h2>Gestionare Site-uri Blocate</h2>

                    <button className={styles.addBtn} onClick={() => setIsModalOpen(true)}>
                        + Adauga Site Blocat
                    </button>

                    <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                        
                        <input
                        type="text"
                        placeholder="Introdu domeniul de blocat"
                        value={blockedDomain}
                        onChange={(e) => setBlockedDomain(e.target.value)}
                        style={{ padding: '8px', width: '100%', marginBottom: '12px' }}
                        />

                        <button onClick={handleSave}>Blochează domeniul</button>
                    </Modal>
                   
                </div>

                <div className={styles.section}>
                    <h2>Site-uri Blocate</h2>
                    <BlockList>
                    {
                        blockList
                    }   
                    </BlockList>
                </div>
            </div>
        </div>
    </div>

  );
}

export default BlockList;