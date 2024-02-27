
export async function getStatus(){
  const res = await fetch('http://localhost:8080/');
  const data = res.json();
  return data;
}