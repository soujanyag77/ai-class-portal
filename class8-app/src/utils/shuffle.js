export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function shuffleDifferent(arr) {
  if (arr.length < 2) return [...arr];
  let out = shuffle(arr);
  let tries = 0;
  while (out.every((v, i) => v === arr[i]) && tries < 8) {
    out = shuffle(arr);
    tries++;
  }
  return out;
}
