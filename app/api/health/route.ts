export async function GET() {
  return Response.json({
    ok: true,
    service: "made-by-ai",
    now: new Date().toISOString()
  });
}
