// Using native fetch (Node 18+)
async function queryHttpApi() {
  try {
    const res = await fetch('http://2.58.113.84:8081/JSON|GET/STATUS');
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error querying HTTP API:', err.message);
  }
}

queryHttpApi();