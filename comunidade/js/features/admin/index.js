import { isAdministrator } from "../../core/permissions.js";

export function initializeAdmin(profile) {
    const adminView = document.querySelector('[data-view="admin"]');
    if (!adminView) return false;
    return isAdministrator(profile);
}