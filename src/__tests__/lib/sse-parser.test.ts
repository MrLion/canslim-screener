import { describe, it, expect } from "vitest";
import { parseSSEStream } from "@/lib/sse-parser";

function makeReader(chunks: string[]): ReadableStreamDefaultReader<Uint8Array> {
  const encoder = new TextEncoder();
  let i = 0;
  return {
    read: async () => {
      if (i >= chunks.length) return { done: true, value: undefined } as ReadableStreamReadDoneResult;
      return { done: false, value: encoder.encode(chunks[i++]) } as ReadableStreamReadValueResult<Uint8Array>;
    },
    cancel: async () => {},
    releaseLock: () => {},
    closed: Promise.resolve(undefined),
  } as ReadableStreamDefaultReader<Uint8Array>;
}

async function collect(reader: ReadableStreamDefaultReader<Uint8Array>) {
  const events = [];
  for await (const e of parseSSEStream(reader)) {
    events.push(e);
  }
  return events;
}

describe("parseSSEStream", () => {
  it("parses well-formed SSE events", async () => {
    const reader = makeReader([
      'event: market\ndata: {"trend":"uptrend"}\n\n',
      'event: stock\ndata: {"symbol":"AAPL"}\n\n',
    ]);
    const events = await collect(reader);
    expect(events).toHaveLength(2);
    expect(events[0]).toEqual({ event: "market", data: { trend: "uptrend" } });
    expect(events[1]).toEqual({ event: "stock", data: { symbol: "AAPL" } });
  });

  it("skips malformed JSON", async () => {
    const reader = makeReader([
      'event: stock\ndata: {bad json}\n\nevent: stock\ndata: {"symbol":"MSFT"}\n\n',
    ]);
    const events = await collect(reader);
    expect(events).toHaveLength(1);
    expect(events[0].data).toEqual({ symbol: "MSFT" });
  });

  it("handles split chunks", async () => {
    const reader = makeReader([
      'event: mar',
      'ket\ndata: {"trend":"neutral"}\n\n',
    ]);
    const events = await collect(reader);
    expect(events).toHaveLength(1);
    expect(events[0]).toEqual({ event: "market", data: { trend: "neutral" } });
  });

  it("handles empty lines between events", async () => {
    const reader = makeReader([
      'event: progress\ndata: {"scanned":5}\n\n\n\nevent: done\ndata: {"ts":"now"}\n\n',
    ]);
    const events = await collect(reader);
    expect(events).toHaveLength(2);
  });

  it("ignores data lines without a preceding event type", async () => {
    const reader = makeReader([
      'data: {"orphan":true}\n\nevent: stock\ndata: {"symbol":"GOOG"}\n\n',
    ]);
    const events = await collect(reader);
    expect(events).toHaveLength(1);
    expect(events[0].event).toBe("stock");
  });

  it("returns empty for no input", async () => {
    const reader = makeReader([]);
    const events = await collect(reader);
    expect(events).toHaveLength(0);
  });
});
