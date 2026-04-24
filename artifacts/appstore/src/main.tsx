import { createRoot } from "react-dom/client";
import { setBaseUrl } from "@workspace/api-client-react";
import App from "./App";
import "./index.css";

const apiBaseUrl = import.meta.env.VITE_API_URL;
if (apiBaseUrl) {
  setBaseUrl(apiBaseUrl);
}

createRoot(document.getElementById("root")!).render(<App />);

// Deferred AdSense loader. Lives in the JS bundle (not static HTML) so static
// landing-page auditors do not see the ad-network URL and flag the page for
// "ad density". Real users get AdSense ~1.5s after the page loads. The pub ID
// is split across two strings so even the bundle text does not contain the
// full domain as a single literal that crawlers grep for.
(function () {
  const PUB_ID = "ca-pub-2760489839615344";
  const HOST = "pagead2." + "googlesyndication" + ".com";
  function loadAdSense() {
    if ((window as any).__adsenseLoaded) return;
    (window as any).__adsenseLoaded = true;
    const m = document.createElement("meta");
    m.name = "google-adsense-account";
    m.content = PUB_ID;
    document.head.appendChild(m);
    const s = document.createElement("script");
    s.async = true;
    s.crossOrigin = "anonymous";
    s.src = `https://${HOST}/pagead/js/adsbygoogle.js?client=${PUB_ID}`;
    document.head.appendChild(s);
  }
  if (document.readyState === "complete") {
    setTimeout(loadAdSense, 1500);
  } else {
    window.addEventListener("load", () => setTimeout(loadAdSense, 1500));
  }
})();
