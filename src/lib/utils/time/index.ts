function formatTimePretty(msT: number) {
  const safeMs = Math.max(0, msT);

  const m = Math.floor(safeMs / 60_000);
  const s = Math.floor(safeMs / 1000) % 60;

  return `${m}:${s.toString().padStart(2, "0")}`;
}

export { formatTimePretty };
