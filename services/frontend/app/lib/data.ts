export async function getStatus() {
  const res = await fetch("/api/status");
  const data = res.json();
  return data;
}

