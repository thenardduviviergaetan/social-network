
export async function getStatus() {
    return fetch('localhost:8080/').then((res) => res.json());
}