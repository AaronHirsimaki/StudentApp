import { supabase } from "../supabaseClient";

export async function fetchBarRatings(barId) {
  const { data, error } = await supabase
    .from("bar_reviews")
    .select("rating")
    .eq("bar_id", barId);

  if (error) {
    console.error("Failed to fetch ratings:", error);
    return [];
  }

  return data;
}

export function calculateAverageRating(reviews) {
  if (!reviews.length) return null;

  const sum = reviews.reduce((total, r) => total + r.rating, 0);
  return (sum / reviews.length).toFixed(1);
}

export async function upsertRating({ barId, rating }) {
  // 1️⃣ hae kirjautunut käyttäjä
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("User not authenticated");
  }

  // 2️⃣ UPSERT SAMAAN TAULUUN
  const { error } = await supabase
    .from("bar_reviews")
    .upsert(
      {
        user_id: user.id,
        bar_id: barId,
        rating,
      },
      {
        onConflict: "user_id,bar_id",
      }
    );

  if (error) {
    throw error;
  }
}
