import { API_BASE } from "./api";

export async function signInFetch(enterUsername: string, password: string) {
  const res = await fetch(`${API_BASE}/signIn`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: enterUsername,
      password: password,
    }),
  });

  const data = await res.json();
  console.log(data);

  if (res.ok) {
    return data;
  }
}
