import { useState } from 'react';
import { supabase } from '../../supabaseClient';
import { useNavigate } from "react-router-dom";
import "./Authform.css"

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });


    if (error) {
      setError(error.message);
      return;
    }

    navigate("/");
  };

  return (
    <>
      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
  
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
  
      <button onClick={handleLogin}>Login</button>
  
      {error && <p>{error}</p>}
    </>
  );

}
