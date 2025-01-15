export function cache(key: string, obj: any) {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(obj));
  }
}

export function get(key: string) {
  try {
    return JSON.parse(localStorage.getItem(key) as string);
  } catch {
    return null;
  }
}
