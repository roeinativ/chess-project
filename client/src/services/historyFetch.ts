import { API_BASE } from "./api";

export async function historyFetch(username: string) {
  const res = await fetch(`${API_BASE}/history`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
    }),
  });

  const data = await res.json();
  console.log(data);

  if (res.ok) {
    return data;
  }
}
