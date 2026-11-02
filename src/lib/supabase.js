import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";

//The URL and the public key of the project are in .env (the public key is meant to be in the
//app, the safety is in the rules of the database, see supabase/ratings.sql)
const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

//Null without the keys: the app keeps working, only the votes are off
export const supabase =
  url && key
    ? createClient(url, key, {
        auth: {
          //The web version is first prepared on the computer (no window there), where there is
          //no storage to keep the session in
          storage: typeof window === "undefined" ? undefined : AsyncStorage,
          autoRefreshToken: typeof window !== "undefined",
          persistSession: typeof window !== "undefined",
          detectSessionInUrl: false,
        },
      })
    : null;

//The user of the votes. Without an account the person is an anonymous user, created the first
//time it is needed and kept on the phone
export async function ensureUser() {
  if (!supabase) throw new Error("no-backend");
  const { data } = await supabase.auth.getSession();
  if (data.session) return data.session.user;

  const { data: created, error } = await supabase.auth.signInAnonymously();
  if (error) throw error;
  return created.user;
}
