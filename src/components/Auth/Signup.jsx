import { useState } from "react";
import { supabase } from "../../supabaseClient";

import avatar1 from "../../images/1.png";
import avatar2 from "../../images/2.png";
import avatar3 from "../../images/3.png";
import avatar4 from "../../images/4.png";
import avatar5 from "../../images/5.png";
import avatar6 from "../../images/6.png";

import "./Authform.css";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [favouriteSpot, setFavouriteSpot] = useState("");
  const [bio, setBio] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("");
  const [error, setError] = useState(null);

  const avatars = [
    { id: "avatar1", src: avatar1 },
    { id: "avatar2", src: avatar2 },
    { id: "avatar3", src: avatar3 },
    { id: "avatar4", src: avatar4 },
    { id: "avatar5", src: avatar5 },
    { id: "avatar6", src: avatar6 },
  ];



  const handleSignup = async () => {
    // 1️⃣ Luo käyttäjä authiin
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { 
          username,
          favourite_spot: favouriteSpot,
          bio,
          avatar_url: selectedAvatar
        },
      },
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

    // // 2️⃣ Lisää profiilitauluun
    // const { error: profileError } = await supabase.from("profiles").insert([
    //   {
    //     id: user.id, // auth users -taulun id
    //     username,
    //     favourite_spot: favouriteSpot,
    //     bio,
    //     avatar_url: selectedAvatar
    //   },
    // ]);

    // if (profileError) {
    //   setError(profileError.message);
    //   return;
    // }

    alert("Käyttäjä luotu onnistuneesti!");
  };

  return (
    <>
      <div className="avatar-selection">
        <p>Choose your avatar</p>
        <div className="avatars">
          {avatars.map((avatar) => (
            <img
              key={avatar.id}
              src={avatar.src}
              alt="avatar"
              className={`avatar-image ${
                selectedAvatar === avatar.id ? "selected" : ""
              }`}
              onClick={() => setSelectedAvatar(avatar.id)}
            />
          ))}

        </div>
      </div>

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
      <input
        type="text"
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="text"
        placeholder="Favourite bar"
        onChange={(e) => setFavouriteSpot(e.target.value)}
      />
      <input
        type="text"
        placeholder="About you"
        onChange={(e) => setBio(e.target.value)}
      />
      <button onClick={handleSignup}>Sign Up</button>
      {error && <p>{error}</p>}
    </>
  );
}
