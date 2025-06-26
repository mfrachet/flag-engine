export interface TrackOpts {
  posX?: number;
  posY?: number;
  selector?: string;
  data?: string;
}

export type TrackFn = (eventName: string, opts?: TrackOpts) => Promise<void>;

export interface AnalyticsEvent {
  name: string;
  opts?: TrackOpts;
}
