import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Attach JWT to backend API requests automatically.
// This keeps all existing pages (including those using raw `fetch`) working.
const BACKEND_BASE = "http://localhost:8080/api";

function patchFetchWithJwt() {
  if (typeof window === "undefined") return;
  if (window.__MJ_FETCH_WITH_JWT_PATCHED__) return;

  window.__MJ_FETCH_WITH_JWT_PATCHED__ = true;

  const originalFetch = window.fetch.bind(window);

  const hasAuthorizationHeader = (headers) => {
    if (!headers) return false;
    // Headers object
    if (typeof Headers !== "undefined" && headers instanceof Headers) {
      return headers.has("Authorization");
    }
    // Plain object
    return Object.keys(headers).some((k) => k.toLowerCase() === "authorization");
  };

  window.fetch = (input, init = {}) => {
    try {
      const url = typeof input === "string" ? input : input?.url;
      if (url && url.startsWith(BACKEND_BASE)) {
        const token = sessionStorage.getItem("token");
        if (token && !hasAuthorizationHeader(init?.headers)) {
          const authHeaderValue = `Bearer ${token}`;

          // Preserve header type when possible
          if (typeof Headers !== "undefined" && init?.headers instanceof Headers) {
            init.headers.set("Authorization", authHeaderValue);
          } else if (init?.headers && typeof init.headers === "object") {
            init.headers = { ...init.headers, Authorization: authHeaderValue };
          } else {
            init.headers = { Authorization: authHeaderValue };
          }
        }
      }
    } catch {
      // Never block requests because auth patching failed.
    }

    return originalFetch(input, init);
  };
}

patchFetchWithJwt();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
