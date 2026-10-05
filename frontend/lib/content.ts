import type { Entry } from "../types";

export function searchEntries(entries: Entry[], query: string, limit = 20) {
  const words = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  return entries.filter(entry => {
    const text = `${entry.title} ${entry.description} ${entry.categories} ${entry.text}`.toLowerCase();
    return words.every(word => text.includes(word));
  }).sort((a, b) => {
    const aTitle = words.some(word => a.title.toLowerCase().includes(word));
    const bTitle = words.some(word => b.title.toLowerCase().includes(word));
    return Number(bTitle) - Number(aTitle) || b.date.localeCompare(a.date);
  }).slice(0, Math.min(Math.max(limit, 0), 50));
}
