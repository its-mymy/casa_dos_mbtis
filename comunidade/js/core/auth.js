import { supabase } from "./supabase.js";

const loginLink = document.getElementById("login-link");
const accountLink = document.getElementById("account-link");
const accountAvatar = document.getElementById("account-avatar");
const accountAvatarFallback = document.getElementById("account-avatar-fallback");

let currentUser = null;
let currentProfile = null;

function showVisitor() {
    loginLink.hidden = false;
    accountLink.hidden = true;
}

function showAccount(profile) {
    loginLink.hidden = true;
    accountLink.hidden = false;

    const avatarUrl = String(profile?.avatar_url || "").trim();

    if (avatarUrl) {
        accountAvatar.src = avatarUrl;
        accountAvatar.hidden = false;
        accountAvatarFallback.hidden = true;
        return;
    }

    accountAvatar.removeAttribute("src");
    accountAvatar.hidden = true;
    accountAvatarFallback.hidden = false;
}

export async function initializeAuth() {
    try {
        const { data, error } = await supabase.auth.getUser();
        if (error) throw error;

        currentUser = data?.user || null;

        if (!currentUser) {
            showVisitor();
            return { user: null, profile: null };
        }

        const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("id, nome, username, avatar_url, avatar_tipo, cargo")
            .eq("id", currentUser.id)
            .maybeSingle();

        if (profileError) throw profileError;

        currentProfile = profile || null;
        showAccount(currentProfile);

        return { user: currentUser, profile: currentProfile };
    } catch (error) {
        console.error("Não foi possível carregar a sessão da comunidade:", error);
        showVisitor();
        return { user: null, profile: null, error };
    }
}

export function getCurrentUser() {
    return currentUser;
}

export function getCurrentProfile() {
    return currentProfile;
}

export function onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(async () => {
        const state = await initializeAuth();
        callback?.(state);
    });
}