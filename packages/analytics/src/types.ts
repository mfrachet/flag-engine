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
  currentPage: {
    url: string;
    referer?: string;
    viewportWidth: number;
    viewportHeight: number;
  };
}
