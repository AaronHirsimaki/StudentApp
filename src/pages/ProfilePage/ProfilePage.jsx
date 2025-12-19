import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient"; // varmista että polku on oikein
import { useNavigate } from "react-router-dom";
import "./ProfilePage.css";
import avatar1 from "../../images/1.png";
import avatar2 from "../../images/2.png";
import avatar3 from "../../images/3.png";
import avatar4 from "../../images/4.png";
import avatar5 from "../../images/5.png";
import avatar6 from "../../images/6.png";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const avatarMap = {
    avatar1,
    avatar2,
    avatar3,
    avatar4,
    avatar5,
    avatar6,
  };


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
        <img
          src={avatarMap[profile?.avatar_url]}
          alt="profileImage"
          className="profile-image"
        />
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
