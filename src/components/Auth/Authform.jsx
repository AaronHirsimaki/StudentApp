import { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";
import "./Authform.css"

export default function AuthForm({ onClose }) {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="auth-modal">
      <div className="auth-box">
        <button onClick={onClose} className="close-btn">Close</button>
        <div className="tab-buttons">
          <button onClick={() => setIsLogin(true)} className={isLogin ? "active" : ""}>Login</button>
          <button onClick={() => setIsLogin(false)} className={!isLogin ? "active" : ""}>Sign Up</button>
        </div>
        {isLogin ? <Login /> : <Signup />}
      </div>
    </div>
  );
}
