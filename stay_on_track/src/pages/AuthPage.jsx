import React from "react";
import stepImg from "../assets/step_by_step.jpg";

const API_URL = process.env.REACT_APP_API_URL;

const Home = () => {
  // Stiluri moderne
  const containerStyle = {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)",
    fontFamily: "Inter, Arial, sans-serif",
  };

  const cardStyle = {
    display: "flex",
    background: "#fff",
    borderRadius: "24px",
    boxShadow: "0 8px 32px rgba(16, 24, 40, 0.12)",
    overflow: "hidden",
    maxWidth: "900px",
    width: "100%",
    minHeight: "480px",
  };

  const leftStyle = {
    background: "#1e293b",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "380px",
    minHeight: "480px",
  };

  const rightStyle = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "48px 32px",
    background: "linear-gradient(135deg, #f1f5f9 0%, #e0e7ff 100%)",
  };

  const titleStyle = {
    fontSize: "2.5rem",
    fontWeight: 800,
    color: "#1e293b",
    marginBottom: "24px",
    letterSpacing: "-1px",
  };

  const descStyle = {
    fontSize: "1.1rem",
    color: "#475569",
    marginBottom: "40px",
    textAlign: "center",
    maxWidth: "340px",
    lineHeight: 1.5,
  };

  const buttonStyle = {
    padding: "14px 36px",
    borderRadius: "12px",
    background: "linear-gradient(90deg, #6366f1 0%, #a21caf 100%)",
    color: "#fff",
    fontWeight: 700,
    fontSize: "1.1rem",
    border: "none",
    boxShadow: "0 4px 16px rgba(99,102,241,0.15)",
    cursor: "pointer",
    transition: "transform 0.1s, box-shadow 0.1s, background 0.2s",
    outline: "none",
  };

  const buttonHoverStyle = {
    background: "linear-gradient(90deg, #4f46e5 0%, #7c3aed 100%)",
    transform: "scale(1.04)",
    boxShadow: "0 6px 20px rgba(99,102,241,0.18)",
  };

  // Pentru efect hover pe buton
  const [hover, setHover] = React.useState(false);

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={leftStyle}>
          <img src={stepImg} alt="Descrierea imaginii" style={{ width: "100%", height: "100%", borderRadius: "16px", objectFit: "cover" }} />
          <div style={{ width: "320px", height: "420px", background: "transparent" }}>
            {/* Imaginea ta va fi aici */}
          </div>
        </div>
        <div style={rightStyle}>
          <div style={titleStyle}>Stay on Track</div>
          <div style={descStyle}>
            The first step shouldn't always be the hardest.<br />
            <span style={{ color: "#a21caf", fontWeight: 600 }}>Start your journey now!</span>
          </div>
          <button
            style={hover ? { ...buttonStyle, ...buttonHoverStyle } : buttonStyle}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onClick={() => window.location.href = `${API_URL}/auth/google`}
          >
            Authentificate with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;