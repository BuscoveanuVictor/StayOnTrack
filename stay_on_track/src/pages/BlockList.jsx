import React, { useEffect, useState }from 'react';
import styles from './BlockList.module.css';
import Modal from './Modal';

export default function BlockList() {

    // client blockList
    const [blockList, setBlockList] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [blockedDomain, setBlockedDomain] = useState('');


    const updateLocalBlockList = (list) => {
        // !!! Atentie setBlockList este asincron
        // adica blockList se actualizeaza dupa ce
        // functia componenta se termian
        setBlockList(list);
        updateLocalStorageBlockList(list);
        updateExtensionBlockList(list);
    }

    // Pentru atunci cand userul nu are internet
    const updateLocalStorageBlockList = (blockList) => {
        localStorage.setItem('blockList', JSON.stringify(blockList));
    }

    const updateExtensionBlockList = (data) => {
        window.postMessage({ type: 'UPDATE_BLOCK_LIST', blockList: data }, 'http://localhost:3000');
    }

    const loadBlockList = () => {
        fetch('/block-list/blocked-sites.json',{
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            //console.log("Received:", data.block_list);
            updateLocalBlockList(data.block_list);
        })
        .catch((err)=>{
            // In caz ca serverul nu rasp iau ce am salvat pe localStorage
            localStorage.getItem('blockList', (res)=>{
                setBlockList(res.blockList);
            })
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

        updateLocalBlockList([...blockList, domain]);

        // remote
        fetch('http://localhost:5000/block-list/add-domain',{
            method: 'POST',
            credentials: 'include', // IMPORTANT pentru a trimite cookie-urile de sesiune 
                                    // pentru a putea accesa sesiunea utilizatorului
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                domain: domain
            })
        })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(err => console.error('Eroare:', err));
    }

    const removeDomain = (domain)=> { 
        updateLocalBlockList(blockList.filter(site => site !== domain));
        fetch(`http://localhost:5000/block-list/remove/${domain}`,{
            method: 'DELETE',
            credentials: 'include', 
            headers:{
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.status)
        .then((status) => {
            if(status === 200 ){
                console.log("Site-ul a fost sters cu succes:", domain);
            }
        })
        .catch(err => console.error('Eroare:', err));       
    }

    useEffect(()=> {
        // Incarca site-urile blocate la pornirea paginii
        loadBlockList();
    },[]);
    

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

