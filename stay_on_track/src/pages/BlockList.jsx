import React, { useEffect, useState, useRef } from 'react';
import Modal from './Modal';
import useListManager from './ListManager';
import apiFetch from './ApiFetch';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const WEB_URL = process.env.REACT_WEB_URL || "http://localhost:3000";

export default function BlockList() {
    const [list, setList] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [blockedDomain, setBlockedDomain] = useState('');
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [mode, setMode] = useState(() => {
        return window.localStorage.getItem("mode") || "block";
    });
    const [showRulesModal, setShowRulesModal] = useState(false);
    const [breakChecked, setBreakChecked] = useState(false);
    const [breakCount, setBreakCount] = useState(1);
    const [breakTime, setBreakTime] = useState(5);
    const [passwordChecked, setPasswordChecked] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordInput, setPasswordInput] = useState('');
    const pendingActionRef = useRef(null);

    const { loadList, updateList } = useListManager({
        list: list,
        setList: setList,
        label: mode === "block" ? "block-list" : "allow-list"
    });

    useEffect(() => {
        loadList();
    }, [mode]);

    window.addEventListener("message", (event) => {
        if (event.data.type === "SET_MODE") {
            setMode(event.data.mode);
        }
    });

    async function ensureCanModify(callback) {
        try {
            const rules = await apiFetch(`${API_URL}/rules`);
            const passwordEnabled = rules && rules.passwordEnabled;
            const passwordValidated = rules && rules.passwordValidated;
            if (passwordEnabled && !passwordValidated) {
                pendingActionRef.current = callback;
                setShowPasswordModal(true);
                return;
            }
        } catch (e) {

            alert('Nu pot verifica regulile. Incearca din nou.');
            return;
        }
        callback && callback();
    }

    function addToBlockList(domain) {
        if (!domain) {
            alert('Please enter a domain!');
            return;
        }
        if (list.includes(domain)) {
            alert('This domain is already in the list!');
            return;
        }
        ensureCanModify(() => updateList([...list, domain]));
    }

    const removeDomain = (domain) => {
        ensureCanModify(() => updateList(list.filter(site => site !== domain)));
    };

    const handleSave = () => {
        addToBlockList(blockedDomain);
        setIsModalOpen(false);
        setBlockedDomain('');
    };

    const handleChangeMode = () => {
        ensureCanModify(() => {
            // salvez modul pe extensie pentru background.js sa verifice site-urile
            window.postMessage({ type: "SET_MODE", mode: mode === "block" ? "allow" : "block" }, WEB_URL);
            // salvez modul local ca atunci cand intru in pagina sa fie acelasi
            window.localStorage.setItem("mode", mode === "block" ? "allow" : "block");
            // actualizez starea
            setMode(mode === "block" ? "allow" : "block");
        });
    };


    const handleRules = async () => {
        ensureCanModify(() => setShowRulesModal(true));
    };

    const handleValidatePassword = async () => {
        if (!passwordInput) {
            alert('Introdu parola');
            return;
        }
        try {
            const result = await apiFetch(`${API_URL}/auth/validate-password`, 'POST', { password: passwordInput });
            if (result && result.passwordValidated) {
                setShowPasswordModal(false);
                setPasswordInput('');
                const cb = pendingActionRef.current;
                pendingActionRef.current = null;
                cb && cb();
            } else {
                alert('Parola incorecta');
            }
        } catch (e) {
            alert('Parola incorecta');
        }
    };

    const handleSaveRules = async () => {
        if (passwordChecked && password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        const payload = {
            breakEnabled: breakChecked,
            breakCount,
            breakTime,
            passwordEnabled: passwordChecked,
            password: passwordChecked ? password : undefined
        };
        try {
            const response = await apiFetch(`${API_URL}/rules`, 'POST', payload);
            if (response) {
                alert("Rules saved!");
                setShowRulesModal(false);
            } else {
                alert("Failed to save rules!");
            }
        } catch (e) {
            alert("Server error!");
        }
    };


    const isAllow = mode === "allow";
    const mainColor = isAllow
        ? 'linear-gradient(135deg, #06b6d4 0%, #818cf8 100%)'
        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    const btnColor = isAllow
        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        : 'linear-gradient(135deg, #06b6d4 0%, #818cf8 100%)';

  return (
    <div style={{ ...styles.body, background: mainColor }}>
      <div style={styles.container}>
        <div style={{ ...styles.header, background: mainColor }}>
          <h1 style={styles.headerH1}>{isAllow ? "Allow List" : "Block List"}</h1>
        </div>
        <div style={styles.content}>
          <div style={styles.section}>
            <h2 style={styles.sectionH2}>{isAllow ? "Manage Allowed Sites" : "Manage Blocked Sites"}</h2>
            <div style={{ display: "flex", gap: "18px", marginBottom: "24px", justifyContent: "center", flexWrap: "wrap" }}>
              <button
                style={{
                  ...styles.actionBtn,
                  background: btnColor,
                  ...(hoveredIndex === 'add' ? styles.actionBtnHover : {})
                }}
                onMouseEnter={() => setHoveredIndex('add')}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => setIsModalOpen(true)}
              >
                {isAllow ? "+ Add allowed site" : "+ Add blocked site"}
              </button>
              <button
                style={{
                  ...styles.actionBtn,
                  background: mainColor,
                  ...(hoveredIndex === 'mode' ? styles.actionBtnHover : {})
                }}
                onMouseEnter={() => setHoveredIndex('mode')}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={handleChangeMode}
              >
                Change mode
              </button>
              <button
                style={{
                  ...styles.actionBtn,
                  background: "linear-gradient(90deg, #818cf8 0%, #a21caf 100%)",
                  color: "#fff",
                  ...(hoveredIndex === 'rules' ? styles.actionBtnHover : {}),
                }}
                onMouseEnter={() => setHoveredIndex('rules')}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={handleRules}
              >
                Rules
              </button>
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isAllow ? "Add allowed domain" : "Add blocked domain"}>
              <input
                type="text"
                placeholder={isAllow ? "Enter domain to allow" : "Enter domain to block"}
                value={blockedDomain}
                onChange={(e) => setBlockedDomain(e.target.value.replace('www.', ''))}
                style={{ padding: '8px', width: '100%', marginBottom: '12px' }}
              />
              <button onClick={handleSave}>{isAllow ? "Allow domain" : "Block domain"}</button>
            </Modal>
          </div>
          <div style={styles.section}>
            <h2 style={styles.sectionH2}>{isAllow ? "Allowed Sites" : "Blocked Sites"}</h2>
            <ul style={styles.blockedList}>
              {list.length === 0 && (
                <div style={styles.emptyState}>{isAllow ? "No allowed sites." : "No blocked sites."}</div>
              )}
              {list.map((domain, idx) => (
                <li
                  key={domain}
                  style={{
                    ...styles.blockedItem,
                    ...(hoveredIndex === idx ? styles.blockedItemHover : {})
                  }}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <span style={styles.siteName}>{domain}</span>
                  <button
                    style={{
                      ...styles.removeBtn,
                      ...(hoveredIndex === `remove-${idx}` ? styles.removeBtnHover : {})
                    }}
                    onMouseEnter={() => setHoveredIndex(`remove-${idx}`)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    onClick={() => removeDomain(domain)}
                  >
                    🗑️
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <Modal isOpen={showRulesModal} onClose={() => setShowRulesModal(false)} title="Rules">
          <div style={{ display: "flex", alignItems: "center", marginBottom: 18 }}>
            <input
              type="checkbox"
              checked={breakChecked}
              onChange={e => setBreakChecked(e.target.checked)}
              style={{ marginRight: 10, width: 18, height: 18 }}
              id="breakCheck"
            />
            <label htmlFor="breakCheck" style={{ fontWeight: 600, fontSize: "1.08rem", cursor: "pointer" }}>
              Break time
            </label>
          </div>
          {breakChecked && (
            <div style={{ marginLeft: 28, marginBottom: 18 }}>
              <label style={{ fontSize: "0.98rem", marginRight: 8 }}>
                Number per day:
                <input
                  type="number"
                  min={1}
                  value={breakCount}
                  onChange={e => setBreakCount(Number(e.target.value))}
                  style={{ marginLeft: 8, width: 60, padding: 4, borderRadius: 6, border: "1px solid #ddd" }}
                />
              </label>
              <br />
              <label style={{ fontSize: "0.98rem", marginTop: 8 }}>
                Minutes per break:
                <input
                  type="number"
                  min={1}
                  value={breakTime}
                  onChange={e => setBreakTime(Number(e.target.value))}
                  style={{ marginLeft: 8, width: 60, padding: 4, borderRadius: 6, border: "1px solid #ddd" }}
                />
              </label>
            </div>
          )}
          <div style={{ display: "flex", alignItems: "center", marginBottom: 18 }}>
            <input
              type="checkbox"
              checked={passwordChecked}
              onChange={e => setPasswordChecked(e.target.checked)}
              style={{ marginRight: 10, width: 18, height: 18 }}
              id="passwordCheck"
            />
            <label htmlFor="passwordCheck" style={{ fontWeight: 600, fontSize: "1.08rem", cursor: "pointer" }}>
              Add password
            </label>
          </div>
          {passwordChecked && (
            <div style={{ marginLeft: 28 }}>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ display: "block", marginBottom: 10, width: "90%", padding: 7, borderRadius: 6, border: "1px solid #ddd" }}
              />
              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                style={{ display: "block", width: "90%", padding: 7, borderRadius: 6, border: "1px solid #ddd" }}
              />
            </div>
          )}
          {/* Butoane Edit și Save la finalul modalului */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 24 }}>
            <button
              style={{
                background: "#e0e7ef",
                color: "#23263a",
                border: "none",
                borderRadius: 8,
                padding: "8px 22px",
                fontWeight: 600,
                fontSize: "1rem",
                cursor: "pointer",
                marginRight: 4
              }}
              onClick={() => alert("Edit rules (implement logic here)")}
            >
              Edit
            </button>
            <button
              style={{
                background: "linear-gradient(90deg, #818cf8 0%, #a21caf 100%)",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "8px 22px",
                fontWeight: 600,
                fontSize: "1rem",
                cursor: "pointer"
              }}
              onClick={handleSaveRules}
            >
              Save
            </button>
          </div>
        </Modal>
        <Modal isOpen={showPasswordModal} onClose={() => { setShowPasswordModal(false); pendingActionRef.current = null; }} title="Introdu parola">
          <div>
            <input
              type="password"
              placeholder="Parola"
              value={passwordInput}
              onChange={e => setPasswordInput(e.target.value)}
              style={{ display: 'block', marginBottom: 10, width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ddd' }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button onClick={() => { setShowPasswordModal(false); pendingActionRef.current = null; }}>Anuleaza</button>
              <button onClick={handleValidatePassword}>Confirma</button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}

const styles = {
  body: {
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
    margin: 0,
    padding: '20px',
    minHeight: '100vh',
    transition: 'background 0.3s'
  },
  container: {
    maxWidth: '600px',
    margin: '40px auto',
    background: 'white',
    borderRadius: '15px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
    overflow: 'hidden',
    padding: '0',
    fontFamily: 'inherit',
  },
  header: {
    color: 'white',
    padding: '30px',
    textAlign: 'center',
    transition: 'background 0.3s'
  },
  headerH1: {
    margin: 0,
    fontSize: '2.5em',
    fontWeight: 300,
  },
  content: {
    padding: '30px',
  },
  section: {
    background: '#f8f9fa',
    borderRadius: '10px',
    padding: '25px',
    marginBottom: '30px',
    border: '2px solid #e9ecef',
  },
  sectionH2: {
    color: '#495057',
    marginTop: 0,
    marginBottom: '20px',
    fontSize: '24px',
    fontWeight: 600,
  },
  actionBtn: {
    color: 'white',
    border: 'none',
    padding: '14px 28px',
    fontSize: '1.08rem',
    borderRadius: '18px',
    cursor: 'pointer',
    transition: 'all 0.18s',
    boxShadow: '0 4px 18px rgba(99,102,241,0.13)',
    fontWeight: 600,
    letterSpacing: "0.5px",
    minWidth: 160,
    margin: 0,
    outline: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  actionBtnHover: {
    transform: 'translateY(-2px) scale(1.04)',
    boxShadow: '0 8px 24px rgba(99,102,241,0.18)',
    filter: "brightness(1.08)"
  },
  blockedList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  blockedItem: {
    background: 'white',
    border: '1px solid #e9ecef',
    borderRadius: '8px',
    padding: '15px 20px',
    marginBottom: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
  },
  blockedItemHover: {
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    transform: 'translateY(-2px)',
  },
  siteName: {
    fontSize: '16px',
    color: '#495057',
    fontWeight: 500,
  },
  removeBtn: {
    background: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '12px',
    transition: 'all 0.3s ease',
  },
  removeBtnHover: {
    background: '#c82333',
    transform: 'scale(1.05)',
  },
  emptyState: {
    textAlign: 'center',
    color: '#6c757d',
    fontSize: '16px',
    padding: '40px 20px',
  }
};
