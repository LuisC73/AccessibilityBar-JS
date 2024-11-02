import { createAccessibilityBar } from "./src/accessibility-bar.js";

const container = document.getElementById('accessibility-bar');
const config = { language: 'es' };

createAccessibilityBar(container, config);