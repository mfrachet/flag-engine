export const setup = () => {
  const scriptEl = window.document.currentScript;
  const endpoint = process.env.API_ENDPOINT;

  const clientKey = scriptEl?.getAttribute("data-client-key");

  if (!clientKey) {
    throw new Error(
      "[Flag Engine]: [data-client-key] attribute should be set on the script tag."
    );
  }

  const bSixtyFour = btoa(clientKey);
  return { endpoint, bSixtyFour };
};
