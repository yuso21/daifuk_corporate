export function onRequest() {
  return new Response(JSON.stringify({ error: 'Not Found' }), {
    status: 410,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}
