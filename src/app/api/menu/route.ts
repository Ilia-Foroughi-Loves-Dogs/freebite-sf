import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

import { parseMenuItems } from "@/lib/menuParser";

export const runtime = "nodejs";

const FETCH_TIMEOUT_MS = 8_000;
const MAX_RESPONSE_BYTES = 1_500_000;
const MAX_REDIRECTS = 3;
const ROBOT_NAME = "FreeBiteSFMenuFinder";
const USER_AGENT = `${ROBOT_NAME}/1.0`;
const BLOCKED_HOSTS = [
  "doordash.com",
  "google.com",
  "googleusercontent.com",
  "gstatic.com",
  "grubhub.com",
  "order.online",
  "ubereats.com",
  "yelp.com",
];
const BLOCKED_HOST_LABELS = new Set([
  "doordash",
  "google",
  "grubhub",
  "ubereats",
  "yelp",
]);

class MenuUnavailableError extends Error {}

function isBlockedHost(hostname: string) {
  const normalized = hostname.toLowerCase().replace(/\.$/, "");
  return (
    BLOCKED_HOSTS.some(
      (host) => normalized === host || normalized.endsWith(`.${host}`),
    ) ||
    normalized
      .split(".")
      .some((label) => BLOCKED_HOST_LABELS.has(label))
  );
}

function isPrivateIp(address: string) {
  if (address.startsWith("::ffff:")) {
    return isPrivateIp(address.slice(7));
  }

  if (isIP(address) === 4) {
    const [a, b] = address.split(".").map(Number);
    return (
      a === 0 ||
      a === 10 ||
      a === 127 ||
      (a === 100 && b >= 64 && b <= 127) ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      (a === 198 && (b === 18 || b === 19)) ||
      a >= 224
    );
  }

  const normalized = address.toLowerCase();
  return (
    normalized === "::" ||
    normalized === "::1" ||
    normalized.startsWith("fc") ||
    normalized.startsWith("fd") ||
    /^fe[89ab]/.test(normalized)
  );
}

async function validatePublicUrl(value: string) {
  let url: URL;

  try {
    url = new URL(value);
  } catch {
    throw new TypeError("Invalid URL.");
  }

  if (
    !["http:", "https:"].includes(url.protocol) ||
    url.username ||
    url.password ||
    (url.port && !["80", "443"].includes(url.port)) ||
    isBlockedHost(url.hostname)
  ) {
    throw new TypeError("URL is not allowed.");
  }

  const addresses = await lookup(url.hostname, { all: true });
  if (addresses.length === 0 || addresses.some(({ address }) => isPrivateIp(address))) {
    throw new TypeError("URL is not publicly reachable.");
  }

  return url;
}

async function fetchWithRedirects(initialUrl: URL, accept: string) {
  let currentUrl = initialUrl;

  for (let redirectCount = 0; redirectCount <= MAX_REDIRECTS; redirectCount += 1) {
    const response = await fetch(currentUrl, {
      cache: "no-store",
      headers: {
        Accept: accept,
        "User-Agent": USER_AGENT,
      },
      redirect: "manual",
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      if (!location || redirectCount === MAX_REDIRECTS) {
        throw new MenuUnavailableError("Redirect could not be followed.");
      }

      currentUrl = await validatePublicUrl(new URL(location, currentUrl).toString());
      continue;
    }

    return { response, finalUrl: currentUrl };
  }

  throw new MenuUnavailableError("Too many redirects.");
}

function robotsDisallows(robotsText: string, pathname: string) {
  let appliesToUs = false;
  let appliesToAll = false;
  const disallowedForUs: string[] = [];
  const disallowedForAll: string[] = [];

  for (const rawLine of robotsText.split(/\r?\n/)) {
    const line = rawLine.replace(/#.*$/, "").trim();
    const separator = line.indexOf(":");
    if (separator === -1) {
      continue;
    }

    const field = line.slice(0, separator).trim().toLowerCase();
    const value = line.slice(separator + 1).trim();

    if (field === "user-agent") {
      appliesToUs = value.toLowerCase() === ROBOT_NAME.toLowerCase();
      appliesToAll = value === "*";
    } else if (field === "disallow" && value) {
      if (appliesToUs) {
        disallowedForUs.push(value);
      } else if (appliesToAll) {
        disallowedForAll.push(value);
      }
    }
  }

  const rules = disallowedForUs.length > 0 ? disallowedForUs : disallowedForAll;
  return rules.some((rule) => rule === "/" || pathname.startsWith(rule));
}

async function isAllowedByRobots(url: URL) {
  try {
    const robotsUrl = new URL("/robots.txt", url.origin);
    const { response } = await fetchWithRedirects(robotsUrl, "text/plain");

    if (!response.ok) {
      return true;
    }

    const robotsText = (await readLimitedText(response)).slice(0, 250_000);
    return !robotsDisallows(robotsText, url.pathname);
  } catch {
    return true;
  }
}

async function readLimitedText(response: Response) {
  const declaredLength = Number(response.headers.get("content-length"));
  if (declaredLength > MAX_RESPONSE_BYTES) {
    throw new MenuUnavailableError("Page is too large.");
  }

  if (!response.body) {
    return "";
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let received = 0;
  let result = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      return result + decoder.decode();
    }

    received += value.byteLength;
    if (received > MAX_RESPONSE_BYTES) {
      await reader.cancel();
      throw new MenuUnavailableError("Page is too large.");
    }

    result += decoder.decode(value, { stream: true });
  }
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Expected a JSON body." }, { status: 400 });
  }

  if (
    typeof body !== "object" ||
    body === null ||
    !("url" in body) ||
    typeof body.url !== "string"
  ) {
    return Response.json({ error: "A URL is required." }, { status: 400 });
  }

  let url: URL;
  try {
    url = await validatePublicUrl(body.url);
  } catch {
    return Response.json(
      { error: "URL must be a public HTTP or HTTPS page." },
      { status: 400 },
    );
  }

  const checkedAt = new Date().toISOString();

  try {
    if (!(await isAllowedByRobots(url))) {
      return Response.json({ checkedAt, items: [], sourceUrl: url.toString() });
    }

    const { response, finalUrl } = await fetchWithRedirects(
      url,
      "text/html,application/xhtml+xml",
    );
    const contentType = response.headers.get("content-type") ?? "";

    if (!response.ok || !/(?:text\/html|application\/xhtml\+xml)/i.test(contentType)) {
      throw new MenuUnavailableError("Menu page is unavailable.");
    }

    const html = await readLimitedText(response);
    return Response.json({
      checkedAt,
      items: parseMenuItems(html, finalUrl.toString()),
      sourceUrl: finalUrl.toString(),
    });
  } catch (error) {
    if (
      error instanceof MenuUnavailableError ||
      (error instanceof DOMException && error.name === "TimeoutError") ||
      error instanceof TypeError
    ) {
      return Response.json({ checkedAt, items: [], sourceUrl: url.toString() });
    }

    return Response.json({ error: "Could not check menu." }, { status: 500 });
  }
}
