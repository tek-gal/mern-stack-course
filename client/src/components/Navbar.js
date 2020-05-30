import React, { useContext } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';


export const Navbar = () => {
  const history = useHistory();
  const { logout } = useContext(AuthContext);
  const handleLogout = (event) => {
    event.preventDefault();
    logout();
    history.push('/');
  };

  return (
    <nav>
      <div className="nav-wrapper">
        <a href="/create" className="brand-logo">Сокращение ссылок</a>
        <ul id="nav-mobile" className="right hide-on-med-and-down">
          <li><NavLink to="/create">Создать</NavLink></li>
          <li><NavLink to="/links">Ссылки</NavLink></li>
          <li><a href="/" onClick={handleLogout}>Выйти</a></li>
        </ul>
      </div>
    </nav>
  );
};
