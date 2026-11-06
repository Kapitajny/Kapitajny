/** Wspólne ustawienia paska dostępności (bez "use client" – używane też w layoutcie na serwerze). */
export const A11Y_KEY = "vm-a11y";

/** Skrypt uruchamiany przed renderem – nakłada zapisane ustawienia bez mignięcia strony. */
export const a11yBootScript = `try{var p=JSON.parse(localStorage.getItem("${A11Y_KEY}")||"null");if(p){if(p.size)document.documentElement.dataset.textSize=String(p.size);if(p.contrast)document.documentElement.dataset.contrast="high"}}catch(e){}`;
