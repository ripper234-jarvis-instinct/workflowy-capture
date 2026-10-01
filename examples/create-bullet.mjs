// Minimal Workflowy create-bullet client. Node 18+ (global fetch, crypto.randomUUID).
//
// Usage:
//   WORKFLOWY_API_TOKEN=... node create-bullet.mjs "<target internal link>" "text to add" [top|bottom]
//
// The token is read from the environment only. Never commit it.

import { randomUUID } from "node:crypto";

const CREATE_WF_BULLET_URL = "https://beta.workflowy.com/api/bullets/create/";

export async function createBullet({ title, note = "", saveLocationUrl, position }, token) {
  const bullet = {
    new_bullet_id: randomUUID(),
    new_bullet_title: title,
    new_bullet_note: note,
    save_location_url: saveLocationUrl,
  };
  if (position === "top" || position === "bottom") bullet.position = position;

  const res = await fetch(CREATE_WF_BULLET_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(bullet),
  });
  if (!res.ok) throw new Error(`Workflowy create failed: HTTP ${res.status}`);
  return { id: bullet.new_bullet_id, response: await res.json().catch(() => null) };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const token = process.env.WORKFLOWY_API_TOKEN;
  const [saveLocationUrl, title, position] = process.argv.slice(2);
  if (!token || !saveLocationUrl || !title) {
    console.error("Set WORKFLOWY_API_TOKEN and pass: <target internal link> <text> [top|bottom]");
    process.exit(1);
  }
  // Reminder: check the target's children before retrying, the API is not idempotent.
  console.log(await createBullet({ title, saveLocationUrl, position }, token));
}
