import supabase from "../SupabaseClient"
import useStore from "../store"

export const signOut = async () => {
  try {
    console.log("Signing out user...");
    
    
    useStore.getState().setUser(null);
    useStore.getState().setSession(null);
    
  
    await supabase.auth.signOut();
    
    useStore.getState().setSelectedDashboard('landing');
    
  } catch (error) {
    console.error('Error signing out:', error);
  }
};
export async function OauthSignIn(provider) { 
  const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `https://vnhltjxebvjopqujnjww.supabase.co`,
      },
    })
  return { data, error }
}

export async function getProfileData(userId) { 
  let { data: profiles, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
  return { profiles, error }
}

export async function insertProfileData(userId, data) { 
  let { error } = await supabase
    .from('profiles')
    .insert([{ id: userId, ...data }])
  return { error }
}

export async function updateProfileData(userId, data) {
    let { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', userId)
    return { error }
}