import { useState } from "react";
import StarRating from "../StarRating/StarRating";

export default function ReviewForm({ onSubmit }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({ rating, comment });
    setRating(0);
    setComment("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Anna arvostelu</h3>
      <StarRating onRatingSelect={(value) => setRating(value)} />
      <textarea
        placeholder="Kirjoita kommentti..."
        value={comment}
        onChange={(event) => setComment(event.target.value)}
      />
      <button type="submit">Lähetä</button>
    </form>
  );
}
