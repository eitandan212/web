export interface Quote {
  id: number;
  /** The quote itself. */
  text: string;
  author: string;
  /** Free-form labels, handy for filtering. */
  tags: string[];
}

/** Where the quotes file is served from (see `public/quotes.json`). */
export const QUOTES_URL = '/quotes.json';

/** Fetch the quotes served by the dev/preview server. */
export const fetchQuotes = async (signal?: AbortSignal): Promise<Quote[]> => {
  const res = await fetch(QUOTES_URL, { signal });
  if (!res.ok) throw new Error(`Failed to load quotes: ${res.status}`);
  return (await res.json()) as Quote[];
};

/** Pick a random quote from a list (undefined when the list is empty). */
export const randomQuote = (quotes: Quote[]): Quote | undefined =>
  quotes.length ? quotes[Math.floor(Math.random() * quotes.length)] : undefined;

/** Pick the quote of the day — stable for a given date. */
export const quoteOfTheDay = (quotes: Quote[], date = new Date()): Quote | undefined => {
  if (!quotes.length) return undefined;
  const day = Math.floor(date.getTime() / 86_400_000);
  return quotes[day % quotes.length];
};
