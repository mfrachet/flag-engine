import { setup } from "./setup";
import { setupNavigationListeners } from "./setup-navigation-listeners";
import { setupQualitativeTracking } from "./setup-qualitative-tracking";
import { makeTracker } from "./tracking";

const { endpoint, bSixtyFour } = setup();
const { track, flushEvents, startIntervalFlushing } = makeTracker({
  endpoint,
  bSixtyFour,
});

const trackPageView = () => track("Page View");

startIntervalFlushing();
setupNavigationListeners(trackPageView);
setupQualitativeTracking(track, flushEvents);
trackPageView();
