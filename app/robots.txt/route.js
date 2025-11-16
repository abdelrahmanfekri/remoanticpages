export function GET() {
  const body = `User-agent: *
Disallow: /`;

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain"
    }
  });
}


