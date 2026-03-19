import { API_BASE } from "./api";
import * as Types from "@/types/types"

export async function authFetch({endpoint,enterUsername, password}: Types.AuthFetchType) {
  const res = await fetch(`${API_BASE}/${endpoint}`, {
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

  throw new Error(data.message)
}
