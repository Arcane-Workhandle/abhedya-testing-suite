/**
 * @fileoverview Background Service Worker for Abhedya Edge Shield.
 * Coordinates threat syncs, memory caching, and API routing.
 */

const CLOUD_ENGINE_URL = "https://project-abhedya-6fnx.onrender.com/analyze";
const OPENPHISH_FEED_URL = "https://openphish.com/feed.txt";
const SYNC_ALARM_NAME = "DailyThreatSync";
const SYNC_INTERVAL_MINUTES = 1440;

/** @type {Object<string, Object>} */
const sessionCache = {};

/**
 * Downloads community threat feeds to populate local quick-block sets.
 */
async function syncThreatList() {
  console.info("[Abhedya:Sync] Downloading daily threat intelligence feed...");
  try {
    const response = await fetch(OPENPHISH_FEED_URL);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const textData = await response.text();
    const urls = textData.split("\n");
    
    const domains = urls
      .map((url) => {
        try { 
          return new URL(url.trim()).hostname.replace("www.", ""); 
        } catch { 
          return null; 
        }
      })
      .filter((domain) => domain !== null && domain !== "");

    chrome.storage.local.set({ dynamicBlocklist: domains }, () => {
      console.info(`[Abhedya:Sync] Successfully cached ${domains.length} threat domains.`);
    });
  } catch (error) {
    console.error("[Abhedya:Sync] Threat sync operation failed:", error);
  }
}

chrome.runtime.onInstalled.addListener(() => {
  syncThreatList();
  chrome.alarms.create(SYNC_ALARM_NAME, { periodInMinutes: SYNC_INTERVAL_MINUTES });
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === SYNC_ALARM_NAME) {
    syncThreatList();
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action !== "analyzeHTML") return false;

  let targetDomain;
  try {
    targetDomain = new URL(request.url).hostname.replace("www.", "");
  } catch {
    console.warn("[Abhedya:Error] Discarding invalid URL.");
    sendResponse({ error: "Invalid URL" });
    return true;
  }

  chrome.storage.local.get(["dynamicBlocklist", "userWhitelist"], (data) => {
    const blocklist = data.dynamicBlocklist || [];
    const whitelist = data.userWhitelist || [];

    // LAYER 0: The User Whitelist Override
    if (whitelist.includes(targetDomain)) {
      console.info(`[Abhedya:Whitelist] Bypassing scan for trusted domain: ${targetDomain}`);
      sendResponse({ 
        ensemble_score: 0, 
        ai_analysis: { reason: "User explicitly whitelisted this domain." },
        raw_scores: { url_risk: 0, dom_risk: 0, ssl_risk: 0, gemini_risk: 0 }
      });
      return; 
    }

    // LAYER 1: Static Threat Feed Interception
    if (blocklist.includes(targetDomain)) {
      console.warn(`[Abhedya:Shield] Blocklist hit: ${targetDomain}`);
      sendResponse({ 
        ensemble_score: 99, 
        ai_analysis: { reason: "Domain listed in current global phishing feed." },
        raw_scores: { url_risk: 100, dom_risk: 0, ssl_risk: 0, gemini_risk: 0 }
      });
      return; 
    }

    // LAYER 2: In-memory session check
    if (sessionCache[targetDomain]) {
      console.info(`[Abhedya:Cache] Memory hit: ${targetDomain}`);
      sendResponse(sessionCache[targetDomain]);
      return;
    }

    // LAYER 3: Live multimodal inspection
    console.info(`[Abhedya:Cloud] Dispatching payload for: ${targetDomain}`);
    
    chrome.tabs.captureVisibleTab(sender.tab.windowId, { format: "jpeg", quality: 30 }, (screenshotUrl) => {
      const visualPayload = chrome.runtime.lastError ? null : screenshotUrl;

      fetch(CLOUD_ENGINE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          url: request.url, 
          html_content: request.html,
          screenshot_base64: visualPayload
        })
      })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
        return res.json();
      })
      .then((result) => {
        sessionCache[targetDomain] = result;
        sendResponse(result);
      })
      .catch((err) => {
        console.error("[Abhedya:Cloud] Request pipeline failed:", err);
        sendResponse({ error: "Cloud engine failed or timed out." });
      });
    });
  });

  return true;
});