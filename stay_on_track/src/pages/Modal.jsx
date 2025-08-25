import React from "react";

const modalStyles = {
  overlay: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    background: "rgba(44, 51, 73, 0.45)",
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background 0.2s",
  },
  modal: {
    background: "linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)",
    borderRadius: "18px",
    boxShadow: "0 8px 32px rgba(16, 24, 40, 0.18)",
    padding: "36px 32px 28px 32px",
    minWidth: "320px",
    maxWidth: "90vw",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    animation: "modalIn 0.18s",
  },
  closeBtn: {
    position: "absolute",
    top: "16px",
    right: "18px",
    background: "none",
    border: "none",
    fontSize: "1.5rem",
    color: "#667eea",
    cursor: "pointer",
    fontWeight: 700,
    transition: "color 0.18s",
  },
  title: {
    fontSize: "1.3rem",
    fontWeight: 700,
    color: "#23263a",
    marginBottom: "18px",
    textAlign: "center",
    letterSpacing: "0.5px",
  },
  actions: {
    marginTop: "18px",
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
  }
};

// Animatie pentru modal (adaugă în <style> global dacă vrei efect smooth)
const modalKeyframes = `
@keyframes modalIn {
  from { transform: scale(0.96) translateY(20px); opacity: 0.5; }
  to { transform: scale(1) translateY(0); opacity: 1; }
}
`;

export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  return (
    <>
      <style>{modalKeyframes}</style>
      <div style={modalStyles.overlay} onClick={onClose}>
        <div
          style={modalStyles.modal}
          onClick={e => e.stopPropagation()}
        >
          <button
            style={modalStyles.closeBtn}
            onClick={onClose}
            title="Închide"
          >
            ×
          </button>
          {title && <div style={modalStyles.title}>{title}</div>}
          {children}
        </div>
      </div>
    </>
  );
}
