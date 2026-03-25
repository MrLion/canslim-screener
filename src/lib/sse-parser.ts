/**
 * AsyncGenerator-based SSE parser.
 *
 * Reads from a ReadableStream and yields parsed { event, data } objects.
 * Handles: buffer accumulation, event/data line parsing, malformed JSON (skip + continue).
 */

export interface SSEEvent {
  event: string;
  data: unknown;
}

export async function* parseSSEStream(
  reader: ReadableStreamDefaultReader<Uint8Array>
): AsyncGenerator<SSEEvent> {
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    let eventType = "";
    for (const line of lines) {
      if (line.startsWith("event: ")) {
        eventType = line.slice(7);
      } else if (line.startsWith("data: ") && eventType) {
        try {
          const data = JSON.parse(line.slice(6));
          yield { event: eventType, data };
        } catch {
          // skip malformed JSON
        }
        eventType = "";
      }
    }
  }
}
