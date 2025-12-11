import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient"; // varmista että polku on oikein
import { useNavigate } from "react-router-dom";
import "./ProfilePage.css";
import pfp from "../../images/5.png"; // oletuskuva

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/login");
  }

  useEffect(() => {
    const fetchProfile = async () => {
      // 1️⃣ Hae käyttäjä V2-tyylillä
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.log("No user logged in.");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Profile fetch error:", error);
      } else {
        setProfile(data);
      }

      setLoading(false);
    };

    fetchProfile();
  }, []);

  // 3️⃣ Näytä lataus
  if (loading) return <p>Loading profile...</p>;

  // 4️⃣ Jos profiilia ei löytynyt
  if (!profile) return <p>No profile found.</p>;

  return (
    <div className="profile-section">
      <div className="profile">
        <img src={pfp} alt="profileImage" className="profile-image" />
        <h1>{profile.username}</h1>
        <h2>Favourite spot: {profile.favourite_spot || "Favourite spot"}</h2>
        <h2>About You</h2>
        <p>{profile.bio}</p>
        <p>{profile.badges}</p>
        <button onClick={handleLogout} className="profile-logout-button">
          Log out
        </button>
      </div>
    </div>
  );
}
