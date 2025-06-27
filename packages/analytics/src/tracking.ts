import { AnalyticsEvent, TrackFn } from "./types";

let eventsBuffer: Array<AnalyticsEvent> = [];
const MAX_BATCH_SIZE = 10;
const FLUSH_INTERVAL = 5000;

export const makeTracker = ({
  endpoint,
  bSixtyFour,
}: {
  endpoint: string;
  bSixtyFour: string;
}) => {
  const track: TrackFn = (eventName, opts = {}) => {
    eventsBuffer.push({ name: eventName, opts });

    if (eventsBuffer.length >= MAX_BATCH_SIZE) {
      flushEvents();
    }

    return Promise.resolve(undefined);
  };

  const flushEvents = () => {
    const payloads = eventsBuffer.map((ev) => ({
      name: ev.name,
      url: window.location.href,
      referer: window.document.referrer || undefined,
      viewportWidth: window.innerWidth,
      viewportHeight: document.documentElement.scrollHeight,
      posX: ev.opts?.posX,
      posY: ev.opts?.posY,
      selector: ev.opts?.selector,
      data: ev.opts?.data
        ? typeof ev.opts.data === "string"
          ? ev.opts.data
          : JSON.stringify(ev.opts.data)
        : undefined,
    }));

    // Reset the buffer when it's mapped to the payloads object so that we can continue feeding it
    eventsBuffer = [];

    return fetch(`${endpoint}/api/v1/events/${bSixtyFour}`, {
      method: "POST",
      body: JSON.stringify(payloads),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .catch(() => {
        // Expected silent fail
      });
  };

  const startIntervalFlushing = () => {
    setInterval(() => {
      if (eventsBuffer.length > 0) {
        flushEvents();
      }
    }, FLUSH_INTERVAL);
  };

  return { track, flushEvents, startIntervalFlushing };
};
