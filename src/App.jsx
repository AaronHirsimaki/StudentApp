import { Routes, Route, NavLink } from "react-router-dom";
import React, { useState, useEffect } from "react";
import MyMap from "./components/Map/MyMap";
import BarList from "./components/BarList/BarList";
import "./App.css";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import SettingsPage from "./pages/SettingsPage/SettingsPage";
import BarPage from "./pages/BarPage/BarPage";
import { supabase } from "./supabaseClient";
import AuthForm from "./components/Auth/Authform.jsx";

function App() {
  const [visibleBars, setVisibleBars] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getSession();
      const currentUser = data.session?.user || null;
      if (!currentUser) setShowAuth(true);
      setUser(currentUser);
    };

    fetchUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
        setShowAuth(!session?.user);
      },
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <>
      {showAuth && <AuthForm onClose={() => setShowAuth(false)} />}
      {!showAuth && (
        <div className="main-layout">
          <button
            className="hamburger-button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            ☰
          </button>
          <nav className={`menu-section ${isMenuOpen ? "open" : ""}`}>
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? "active-link" : "")}
              onClick={() => setIsMenuOpen(false)}
            >
              Map
            </NavLink>
            <NavLink
              to="/profile"
              className={({ isActive }) => (isActive ? "active-link" : "")}
              onClick={() => setIsMenuOpen(false)}
            >
              Profile
            </NavLink>
            <NavLink
              to="/settings"
              className={({ isActive }) => (isActive ? "active-link" : "")}
              onClick={() => setIsMenuOpen(false)}
            >
              Settings
            </NavLink>
          </nav>

          <div className="app-layout">
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <div className="map-section">
                      <MyMap setVisibleBars={setVisibleBars} />
                    </div>
                    <div className="list-section">
                      <BarList visibleBars={visibleBars} />
                    </div>
                  </>
                }
              />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/bar/:id" element={<BarPage />} />
            </Routes>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
