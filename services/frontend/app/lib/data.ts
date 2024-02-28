export async function getStatus() {
  const res = await fetch("http://localhost:8000/api/status");
  const data = res.json();
  return data;
}
