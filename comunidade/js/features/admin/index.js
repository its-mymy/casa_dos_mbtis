import { isAdministrator } from "../../core/permissions.js";
import { initializeModeration } from "./moderation.js";

export function initializeAdmin(profile) {
    const adminView = document.querySelector('[data-view="admin"]');
    const adminTab = document.querySelector("[data-admin-tab]");
    if (!adminView) return false;
    const allowed = isAdministrator(profile);
    if (adminTab) adminTab.hidden = !allowed;
    if (allowed) initializeModeration();
    return allowed;
}