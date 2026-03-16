import { API_BASE } from "./api";

export async function signUpFetch(enter_username: string, password: string) {
  const res = await fetch(`${API_BASE}/signUp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: enter_username,
      password: password,
    }),
  });

  const data = await res.json();
  console.log(data);

  if (res.ok) {
    return data;
  }
}
