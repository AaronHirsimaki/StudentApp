import { Routes, Route, NavLink } from 'react-router-dom';
import React from 'react';
import MyMap from './components/Map/myMap';
import BarList from './components/BarList/BarList';
import "./App.css";
import ProfilePage from './pages/ProfilePage/ProfilePage';
import SettingsPage from './pages/SettingsPage/SettingsPage';
import BarPage from './pages/BarPage/BarPage';

function App() {

  return (
    <div className="main-layout">
      <nav className="menu-section">
        <NavLink
          to="/"
          className={({ isActive }) => isActive ? "active-link" : ""}
        >
          Map
        </NavLink>
        <NavLink
          to="/profile"
          className={({ isActive }) => isActive ? "active-link" : ""}
        >
          Profile
        </NavLink>
        <NavLink
          to="/settings"
          className={({ isActive }) => isActive ? "active-link" : ""}
        >
          Settings
        </NavLink>
      </nav>

      <div className='app-layout'>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <div className='map-section'>
                  <MyMap />
                </div>
                <div className='list-section'>
                  <BarList />
                </div>
              </>
            }
          />
          <Route
            path="/profile"
            element={<ProfilePage />}
          />
          <Route
            path="/settings"
            element={<SettingsPage />}
          />
          <Route path="/bar/:id" element={<BarPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;