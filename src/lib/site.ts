/**
 * Canonical site URL — configurable, never hard-coded to a fake domain.
 * Set NEXT_PUBLIC_SITE_URL in the deployment environment (e.g.
 * "https://ahnab.dev"); it falls back to localhost for local preview.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/+$/, "");

export const SITE_TITLE = "Ahnab Rashid — Computer Science Student | AI Enthusiast";
export const SITE_DESCRIPTION =
  "Portfolio of Ahnab Rashid, a Computer Science student exploring Artificial Intelligence, AI Agents, AI Chatbots, intelligent automation and Python projects.";
