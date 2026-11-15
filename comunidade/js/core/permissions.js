export function isAdministrator(profile) {
    return String(profile?.cargo || "").trim().toLowerCase() === "adm";
}

export function canModerateCommunity(profile) {
    return isAdministrator(profile);
}