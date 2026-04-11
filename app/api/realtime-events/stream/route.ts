import { getRealtimeEvents } from "@/lib/server/realtime-events-store";

export const runtime = "nodejs";

export async function GET() {
  const encoder = new TextEncoder();
  const sentIds = new Set<string>();
  let interval: NodeJS.Timeout | null = null;
  let heartbeat: NodeJS.Timeout | null = null;

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const pushEvents = async () => {
        const events = await getRealtimeEvents(25);

        for (const event of [...events].reverse()) {
          if (sentIds.has(event.id)) {
            continue;
          }

          sentIds.add(event.id);
          controller.enqueue(encoder.encode(`id: ${event.id}\ndata: ${JSON.stringify(event)}\n\n`));
        }
      };

      await pushEvents();
      interval = setInterval(() => {
        void pushEvents();
      }, 3000);
      heartbeat = setInterval(() => {
        controller.enqueue(encoder.encode(": keepalive\n\n"));
      }, 15000);
    },
    cancel() {
      if (interval) {
        clearInterval(interval);
      }

      if (heartbeat) {
        clearInterval(heartbeat);
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      Connection: "keep-alive",
      "Cache-Control": "no-cache, no-transform",
    },
  });
}
