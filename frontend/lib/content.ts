import type { Entry } from "../types";

export function entryTopics(entry: Pick<Entry, "categories">) {
  return entry.categories.split(",").map(topic => topic.trim()).filter(Boolean);
}

export function filterByTopic(entries: Entry[], topic: string) {
  return topic === "All" ? entries : entries.filter(entry => entryTopics(entry).includes(topic));
}

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
