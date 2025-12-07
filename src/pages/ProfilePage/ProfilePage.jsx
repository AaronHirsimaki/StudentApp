import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient"; // varmista että polku on oikein
import "./ProfilePage.css";
import pfp from "../../images/5.png"; // oletuskuva

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const user = supabase.auth.user();
      if (!user) return; // ei ole kirjautunutta käyttäjää

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (!error) setProfile(data);
    };

    fetchProfile();
  }, []);
  return (
    <div className="profile-section">
      <div className="profile">
        <img src={pfp} alt="profileImage" className="profile-image" />
        <h1>{profile.username}</h1>
        <h2>{profile.favourite_spot || "Favourite spot"}</h2>
        <p>{profile.bio || "About you"}</p>
        <p>{profile.badges}</p>
      </div>
    </div>
  );
}
