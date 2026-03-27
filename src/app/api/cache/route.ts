import { clearServerCache } from "@/lib/yahoo";

export const dynamic = "force-dynamic";

export async function DELETE() {
  clearServerCache();
  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" },
  });
}
