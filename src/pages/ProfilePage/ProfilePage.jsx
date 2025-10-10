import "./ProfilePage.css";
import pfp from "../../images/5.png";

export default function ProfilePage() {
    return (
        <div className="profile-section">
            <div className="profile">
                <img src={pfp} alt="profileImage" className="profile-image" />
                <h1>Your name</h1>
                <h2>Favourite spot</h2>
                <p>About You</p>
                <p>Badges</p>
            </div>
        </div>
    );
}