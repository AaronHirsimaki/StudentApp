import { useNavigate } from "react-router-dom";
import "./BackButton.css";

export default function BackButton({ label = "Back" }) {
  const navigate = useNavigate();

  return (
    <button className="back-btn" onClick={() => navigate(-1)}>
      ← {label}
    </button>
  );
}
