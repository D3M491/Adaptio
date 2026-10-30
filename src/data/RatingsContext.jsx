import { createContext, useContext, useState, useEffect } from "react";
import { supabase, ensureUser } from "../lib/supabase";

//Votes of the workouts, from 1 to 5 stars. The totals of everybody come from the database,
//the votes of this person are kept here too so the stars answer at once.
//summaries: { [workoutId]: { average, votes, score } }, myVotes: { [workoutId]: stars }
const RatingsContext = createContext({
  summaries: {},
  myVotes: {},
  available: false,
  rate: async () => {},
  refresh: async () => {},
});

export function RatingsProvider({ children }) {
  const [summaries, setSummaries] = useState({});
  const [myVotes, setMyVotes] = useState({});

  async function refresh() {
    if (!supabase) return;

    const { data: totals } = await supabase.from("workout_ratings").select("*");
    if (totals) {
      setSummaries(Object.fromEntries(totals.map((row) => [row.workout_id, row])));
    }

    //The own votes only exist after the first vote (before there is no user)
    const { data: session } = await supabase.auth.getSession();
    if (session.session) {
      const { data: mine } = await supabase.from("ratings").select("workout_id, stars");
      if (mine) {
        setMyVotes(Object.fromEntries(mine.map((row) => [row.workout_id, row.stars])));
      }
    }
  }

  useEffect(() => {
    refresh().catch(() => {});
  }, []);

  //stars is 1..5, or null to remove the vote. Throws if the vote cannot be saved
  async function rate(workoutId, stars) {
    const user = await ensureUser();
    const result =
      stars === null
        ? await supabase
            .from("ratings")
            .delete()
            .eq("user_id", user.id)
            .eq("workout_id", workoutId)
        : await supabase.from("ratings").upsert({
            user_id: user.id,
            workout_id: workoutId,
            stars,
            updated_at: new Date().toISOString(),
          });
    if (result.error) throw result.error;

    setMyVotes((prev) => {
      const next = { ...prev };
      if (stars === null) delete next[workoutId];
      else next[workoutId] = stars;
      return next;
    });
    await refresh();
  }

  return (
    <RatingsContext.Provider
      value={{ summaries, myVotes, available: supabase !== null, rate, refresh }}
    >
      {children}
    </RatingsContext.Provider>
  );
}

export function useRatings() {
  return useContext(RatingsContext);
}
