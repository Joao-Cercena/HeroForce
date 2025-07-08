import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/components/Header.css';

const Header = () => {
  const navigate = useNavigate();
  const heroAvatar = localStorage.getItem('heroAvatar') || 'default-avatar.png';
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [showPopover, setShowPopover] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('heroAvatar');
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setShowPopover(false);
      }
    };

    if (showPopover) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPopover]);

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
          <div className="popover" ref={popoverRef}>
            <img src={heroAvatar} alt="Hero Avatar" className="popover-avatar" />
            <p>{user.heroName}</p>
            <p><strong>{user.name}</strong></p>
            <p>{user.email}</p>
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
