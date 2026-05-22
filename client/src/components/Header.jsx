import React from "react";
import { useNavigate } from "react-router-dom";
import HighlightIcon from "@mui/icons-material/Highlight";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "../context/AuthContext";

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header>
      <div className="header-left">
        <HighlightIcon />
        <h1>Keeper</h1>
      </div>

      <div className="header-right">
        {user?.avatar && (
          <img
            src={user.avatar}
            alt={user.name}
            className="user-avatar"
            referrerPolicy="no-referrer"
          />
        )}
        <span className="user-name">{user?.name}</span>
        <button className="logout-btn" onClick={handleLogout} title="Logout">
          <LogoutIcon fontSize="small" />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}

export default Header;
