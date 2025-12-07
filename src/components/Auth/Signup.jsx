import { useState } from 'react';
import { supabase } from '../../supabaseClient';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState(null);

  const handleSignup = async () => {
    // 1️⃣ Luo käyttäjä authiin
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });
  
    if (signUpError) {
      setError(signUpError.message);
      return;
    }
  
    // 🔍 data.user = luotu käyttäjä
    const user = data.user;
  
    if (!user) {
      setError("User data missing after signup.");
      return;
    }
  
    // 2️⃣ Lisää profiilitauluun
    const { error: profileError } = await supabase
      .from("profiles")
      .insert([
        {
          id: user.id,      // auth users -taulun id
          username: username,
        }
      ]);
  
    if (profileError) {
      setError(profileError.message);
      return;
    }
  
    alert("Käyttäjä luotu onnistuneesti!");
  };

  return (
    <div>
      <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
      <button onClick={handleSignup}>Sign Up</button>
      {error && <p>{error}</p>}
    </div>
  );
}
