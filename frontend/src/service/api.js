const BASE = "http://localhost:8080/api";

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json();
  data._status = res.status;
  return data;
}


export async function registerUser(payload) {
  return request("/users/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function loginUser(email, password) {
  const data = await request("/users/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  if (data.success && data.data) {
    // Backend returns: data.data = { user: <UserDTO>, token: <jwt> }
    const payload = data.data;
    const u = payload.user ?? payload; // fallback for older response shapes
    const token = payload.token;

    sessionStorage.setItem("userId",    u.id);
    sessionStorage.setItem("userRole",  u.role);
    sessionStorage.setItem("userName",  `${u.firstName} ${u.lastName}`);
    sessionStorage.setItem("userEmail", u.email);
    if (token) sessionStorage.setItem("token", token);

    import("../utils/auth").then(({ resetTimer }) => resetTimer());
  }

  return data;
}

export async function getUserById(id) {
  return request(`/users/${id}`);
}

export async function updateUser(id, payload) {
  return request(`/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteUser(id) {
  return request(`/users/${id}`, { method: "DELETE" });
}

export const getCurrentUserId = () => sessionStorage.getItem("userId");
export const getCurrentRole   = () => sessionStorage.getItem("userRole");
export const isLoggedIn       = () => Boolean(sessionStorage.getItem("userId"));

export const isAdmin = () =>
  ["OWNER", "ACCOUNTANT", "SALES_REP", "STAFF"].includes(getCurrentRole());

export function logout(redirectTo = "/") {
  sessionStorage.clear();
  window.location.href = redirectTo;
}