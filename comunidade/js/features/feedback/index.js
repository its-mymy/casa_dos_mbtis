import { initializeFeedbackForm } from "./form.js";
import { initializeFeedbackTracking } from "./tracking.js";

export function initializeFeedback() {
    initializeFeedbackForm();
    initializeFeedbackTracking();
}