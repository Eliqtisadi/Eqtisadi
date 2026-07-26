// حذف العروض المنتهية تلقائيًا من content/offers.json
// يُحذف العرض بعد مرور يوم على تاريخ انتهائه.
import { readFileSync, writeFileSync } from "node:fs";

const FILE = "content/offers.json";
const raw = JSON.parse(readFileSync(FILE, "utf8"));
const offers = Array.isArray(raw.offers) ? raw.offers : [];

const today = new Date();
today.setHours(0, 0, 0, 0);
const cutoff = new Date(today);
cutoff.setDate(cutoff.getDate() - 1); // مهلة يوم واحد بعد تاريخ الانتهاء

function endDate(o) {
  if (!o || !o.end) return null;
  const m = String(o.end).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) return new Date(+m[1], +m[2] - 1, +m[3]);
  const d = new Date(o.end);
  return isNaN(d.getTime()) ? null : d;
}

const kept = [];
let removed = 0;
for (const o of offers) {
  const e = endDate(o);
  if (e && e < cutoff) { removed++; continue; }
  kept.push(o);
}

if (removed > 0) {
  raw.offers = kept;
  writeFileSync(FILE, JSON.stringify(raw, null, 2) + "\n");
  console.log(`Removed ${removed} expired offer(s).`);
} else {
  console.log("No expired offers to remove.");
}
