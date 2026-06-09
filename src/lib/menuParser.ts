import type { CheapMenuItem } from "@/data/resources";

const MAX_ITEMS = 5;
const MIN_PRICE = 0.5;
const MAX_PRICE = 50;
const PRICE_PATTERN =
  /(?:\$\s*(\d{1,2}(?:\.\d{1,2})?)|USD\s*\$?\s*(\d{1,2}(?:\.\d{1,2})?)|(?<![\d./-])(\d{1,2}\.\d{2})(?!\d))/gi;
const PRICE_TEST_PATTERN =
  /(?:\$\s*\d{1,2}(?:\.\d{1,2})?|USD\s*\$?\s*\d{1,2}(?:\.\d{1,2})?|(?<![\d./-])\d{1,2}\.\d{2}(?!\d))/i;
const NOISE_PATTERN =
  /\b(?:address|delivery\s+fee|fee|gift\s*card|gratuity|minimum|order\s+total|phone|sales\s+tax|service\s+charge|subtotal|tax|tip|total)\b/i;
const NON_ITEM_PATTERN =
  /\b(?:copyright|email|fax|follow\s+us|hours|privacy|reservation|sign\s+up|terms)\b/i;
const BLOCK_TAG_PATTERN =
  /<\/?(?:address|article|aside|blockquote|br|dd|div|dl|dt|figcaption|figure|h[1-6]|hr|li|main|p|section|table|tbody|td|tfoot|th|thead|tr|ul|ol)\b[^>]*>/gi;

function decodeHtmlEntities(value: string) {
  const namedEntities: Record<string, string> = {
    amp: "&",
    apos: "'",
    gt: ">",
    lt: "<",
    nbsp: " ",
    quot: '"',
  };

  return value.replace(
    /&(#x[\da-f]+|#\d+|amp|apos|gt|lt|nbsp|quot);/gi,
    (entity, code: string) => {
      if (code.startsWith("#x")) {
        return String.fromCodePoint(Number.parseInt(code.slice(2), 16));
      }

      if (code.startsWith("#")) {
        return String.fromCodePoint(Number.parseInt(code.slice(1), 10));
      }

      return namedEntities[code.toLowerCase()] ?? entity;
    },
  );
}

function htmlToLines(html: string) {
  const withoutNoise = html
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(
      /<(?:script|style|noscript|svg|nav|footer|header|form)\b[^>]*>[\s\S]*?<\/(?:script|style|noscript|svg|nav|footer|header|form)>/gi,
      " ",
    )
    .replace(BLOCK_TAG_PATTERN, "\n")
    .replace(/<[^>]+>/g, " ");

  return decodeHtmlEntities(withoutNoise)
    .split(/\r?\n/)
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

function cleanName(value: string) {
  const pieces = value
    .replace(PRICE_PATTERN, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(/\s+(?:[|•·]|[-–—]{1,2})\s+|[|•·]/);

  return (pieces.at(-1) ?? "")
    .replace(/^[\s:;,./–—-]+|[\s:;,./–—-]+$/g, "")
    .replace(/\b(?:add|from|starting at)\s*$/i, "")
    .trim();
}

function isLikelyName(value: string) {
  return (
    value.length >= 2 &&
    value.length <= 80 &&
    /[a-z]/i.test(value) &&
    !NOISE_PATTERN.test(value) &&
    !NON_ITEM_PATTERN.test(value) &&
    !/^(?:USD|menu|price)$/i.test(value) &&
    !/\b\d{3}[-.\s]\d{3}[-.\s]\d{4}\b/.test(value) &&
    !/\d{1,5}\s+\w+\s+(?:ave|avenue|blvd|boulevard|rd|road|st|street)\b/i.test(
      value,
    )
  );
}

function getItemName(
  lines: string[],
  lineIndex: number,
  matchIndex: number,
  matchText: string,
) {
  const line = lines[lineIndex];
  const beforePrice = cleanName(line.slice(0, matchIndex));
  const afterPrice = cleanName(line.slice(matchIndex + matchText.length));

  if (isLikelyName(beforePrice)) {
    return beforePrice;
  }

  if (isLikelyName(afterPrice)) {
    return afterPrice;
  }

  const previousLine = cleanName(lines[lineIndex - 1] ?? "");
  return isLikelyName(previousLine) && !PRICE_TEST_PATTERN.test(previousLine)
    ? previousLine
    : null;
}

function normalizeName(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\b(?:small|medium|large|sm|md|lg)\b/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function namesAreSimilar(a: string, b: string) {
  if (a === b) {
    return true;
  }

  const aTokens = new Set(a.split(" "));
  const bTokens = new Set(b.split(" "));
  const shared = [...aTokens].filter((token) => bTokens.has(token)).length;
  return shared / Math.max(aTokens.size, bTokens.size) >= 0.8;
}

export function parseMenuItems(html: string, sourceUrl: string): CheapMenuItem[] {
  const candidates: CheapMenuItem[] = [];
  const lines = htmlToLines(html);

  lines.forEach((line, lineIndex) => {
    if (NOISE_PATTERN.test(line) || /\b(?:19|20)\d{2}\b/.test(line)) {
      return;
    }

    for (const match of line.matchAll(PRICE_PATTERN)) {
      const rawPrice = match[1] ?? match[2] ?? match[3];
      const price = Number.parseFloat(rawPrice);

      if (
        !Number.isFinite(price) ||
        price < MIN_PRICE ||
        price > MAX_PRICE ||
        match.index === undefined
      ) {
        continue;
      }

      const name = getItemName(lines, lineIndex, match.index, match[0]);
      if (!name) {
        continue;
      }

      candidates.push({
        name,
        price,
        priceText: match[0].replace(/\s+/g, " ").trim(),
        sourceType: "live_menu",
        verified: false,
        sourceUrl,
      });
    }
  });

  const uniqueItems: CheapMenuItem[] = [];

  for (const item of candidates.sort(
    (a, b) => a.price - b.price || a.name.localeCompare(b.name),
  )) {
    const normalized = normalizeName(item.name);
    if (
      !normalized ||
      uniqueItems.some((existing) =>
        namesAreSimilar(normalized, normalizeName(existing.name)),
      )
    ) {
      continue;
    }

    uniqueItems.push(item);
    if (uniqueItems.length === MAX_ITEMS) {
      break;
    }
  }

  return uniqueItems;
}
