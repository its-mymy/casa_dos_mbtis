export function isAdministrator(profile) {
    const username = String(profile?.username || "").replace(/^@/, "").trim().toLowerCase();
    const cargo = String(profile?.cargo || "").trim().toLowerCase();

    return username === "yu" && cargo === "adm";
}

export function canModerateCommunity(profile) {
    return isAdministrator(profile);
}