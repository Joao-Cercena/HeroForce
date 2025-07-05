import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const heroAvatar = localStorage.getItem('heroAvatar') || 'default-avatar.png';
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [showPopover, setShowPopover] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('heroAvatar');
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="logo" onClick={() => navigate('/dashboard')}>
        HeroForce
      </div>

      <div className="user-info">
        <img
          src={heroAvatar}
          alt="Hero Avatar"
          className="avatar"
          onClick={() => setShowPopover(!showPopover)}
        />

        {showPopover && (
          <div className="popover">
            <p><strong>{user.name}</strong></p>
            <p>{user.email}</p>
            <p>{user.heroCharacter}</p>
          </div>
        )}

        <button className="logout-button" onClick={handleLogout}>
          Sair
        </button>
      </div>
    </header>
  );
};

export default Header;
