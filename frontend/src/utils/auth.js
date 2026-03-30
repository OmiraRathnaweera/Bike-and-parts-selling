const TIMEOUT_MS   = 60 * 60 * 1000; // 60 minutes
const TIMER_KEY    = "_session_expiry";

//  Save login data
export function saveSession(data) {
  Object.entries(data).forEach(([k, v]) => sessionStorage.setItem(k, v));
  resetTimer();
}

// Read a session value (replaces localStorage.getItem)
export function getSession(key) {
  return sessionStorage.getItem(key);
}

// Clear entire session (call on logout or delete account)
export function clearSession() {
  sessionStorage.clear();
}

// Check if someone is logged in
export function isLoggedIn() {
  return !!sessionStorage.getItem("userId");
}

// Reset the 30-min inactivity timer
export function resetTimer() {
  sessionStorage.setItem(TIMER_KEY, Date.now() + TIMEOUT_MS);
}

// Check if the session has expired
export function isSessionExpired() {
  const expiry = sessionStorage.getItem(TIMER_KEY);
  if (!expiry) return false;
  return Date.now() > Number(expiry);
}

// Start watching for inactivity - call once in App.js
// Resets timer on any user activity (mouse, keyboard, touch, scroll).
// Checks every 60 seconds if session has expired and logs out if so.
export function startInactivityWatcher(onExpire) {
  const events = ["mousemove", "mousedown", "keydown", "touchstart", "scroll", "click"];

  const handleActivity = () => {
    if (isLoggedIn()) resetTimer();
  };

  events.forEach(e => window.addEventListener(e, handleActivity, { passive: true }));

  const interval = setInterval(() => {
    if (isLoggedIn() && isSessionExpired()) {
      clearSession();
      onExpire();
    }
  }, 360_000); // check every 360 seconds

  return () => {
    events.forEach(e => window.removeEventListener(e, handleActivity));
    clearInterval(interval);
  };
}