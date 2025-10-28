import React from "react";

function Header({ botName = "Naffa3", avatarUrl, isFullScreen, setIsOpen, setIsFullScreen }) {

  return (
    <header style={styles.header}>
      <div style={styles.leftSection}>
        <div style={styles.avatar}>
          {avatarUrl ? (
            <img src={avatarUrl} alt={botName} style={styles.avatarImage} />
          ) : (
            <div style={styles.avatarPlaceholder}>
              {botName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <h1 style={styles.botName}>{botName}</h1>
      </div>

      <div style={styles.rightSection}>
        <span style={styles.betaBadge}>BETA</span>
        <button onClick={() => setIsFullScreen(!isFullScreen)} style={styles.iconButton} aria-label="Resize">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="2" y="2" width="12" height="12" stroke="currentColor" strokeWidth="2" fill="none"/>
            <rect x="4" y="4" width="8" height="8" stroke="currentColor" strokeWidth="2" fill="none"/>
          </svg>
        </button>
        <button onClick={() => setIsOpen(false)} style={styles.iconButton} aria-label="Close">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M4 4L12 12M12 4L4 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </header>
  );
}

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 24px",
    borderBottom: "1px solid #e0e0e0",
    backgroundColor: "#ffffff",
  },
  leftSection: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  avatarPlaceholder: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0984e3",
    color: "white",
    fontSize: "18px",
    fontWeight: "600",
  },
  botName: {
    margin: 0,
    fontSize: "20px",
    fontWeight: "600",
    color: "#2d3436",
  },
  rightSection: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  betaBadge: {
    backgroundColor: "#d63031",
    color: "white",
    padding: "4px 12px",
    borderRadius: "4px",
    fontSize: "12px",
    fontWeight: "700",
    letterSpacing: "0.5px",
  },
  iconButton: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    padding: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#636e72",
    transition: "color 0.2s",
  },
};

export default Header;
