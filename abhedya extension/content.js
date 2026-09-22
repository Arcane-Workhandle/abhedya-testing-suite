/**
 * @fileoverview Content script injected into host webpages.
 * Collects runtime DOM structure, dispatches scan payload, and controls overlay rendering.
 */

console.info("[Abhedya] Edge Shield content monitoring active.");

/**
 * Extracts payload data from the live document and sends it to the background worker.
 */
function initiateAbhedyaScan() {
    console.info("[Abhedya] Document active. Initiating threat inspection...");

    // Ensure document and body exist before attempting scan
    if (!document.documentElement) {
        setTimeout(initiateAbhedyaScan, 200);
        return;
    }

    const payload = {
        action: "analyzeHTML",
        url: window.location.href,
        html: document.documentElement.outerHTML.substring(0, 5000)
    };

    chrome.runtime.sendMessage(payload, (response) => {
        if (chrome.runtime.lastError) {
            console.warn("[Abhedya] Runtime communication error:", chrome.runtime.lastError.message);
            return;
        }

        if (!response || response.error) {
            console.warn("[Abhedya] Cloud analysis unavailable or timed out:", response?.error);
            return;
        }

        const score = Number(response.ensemble_score ?? 0);
        const rawScores = response.raw_scores || { url_risk: 0, ssl_risk: 0, dom_risk: 0, gemini_risk: 0 };
        const reason = response.ai_analysis?.reason || response.ai_analysis?.verdict || "Critical heuristic or brand impersonation indicators exceeded safe parameters.";

        // Safeguard threshold extraction with strict Number casting
        chrome.storage.local.get({ protectionMode: 65 }, (settings) => {
            const threshold = Number(settings.protectionMode) || 65;

            console.info(`[Abhedya] Scan Result | Score: ${score} | Threshold: ${threshold}`);

            // Enforce block if score exceeds threshold OR if the score is explicitly 100
            if (score > threshold || score === 100) {
                renderBlockScreen(score, threshold, rawScores, reason);
            }
        });
    });
}

/**
 * Replaces page DOM with the standardized zero-day security block screen.
 */
function renderBlockScreen(score, threshold, rawScores, reason) {
    const attachBlockScreen = () => {
        if (!document.body) {
            setTimeout(attachBlockScreen, 50);
            return;
        }

        document.body.style.overflow = "hidden";

        // Prevent underlying page scripts from manipulating scroll or body
        document.documentElement.style.overflow = "hidden";

        document.body.innerHTML = `
            <div class="abhedya-block-overlay">
                <div class="abhedya-badge">
                    <span class="abhedya-pulse-dot"></span>
                    Threat Intercept Protocol Active
                </div>

                <h1 class="abhedya-alert-heading">Access Quarantined</h1>
                <div class="abhedya-alert-subheading">ABHEDYA // ZERO-DAY EDGE DEFENSE</div>
                
                <div class="abhedya-modal-card">
                    <div class="abhedya-score-header">
                        <div class="abhedya-score-meta">
                            <span class="abhedya-score-title">Ensemble Risk Matrix</span>
                            <span class="abhedya-score-threshold">Policy Threshold: ${threshold}</span>
                        </div>
                        <div class="abhedya-score-value">
                            ${score}<span class="abhedya-score-total">/100</span>
                        </div>
                    </div>

                    <div class="abhedya-telemetry-box">
                        <div class="abhedya-telemetry-header">
                            <span>[ Vector Telemetry ]</span>
                            <span>STATUS: BLOCKED</span>
                        </div>
                        <div class="abhedya-telemetry-grid">
                            <div class="abhedya-telemetry-item">
                                <span class="abhedya-metric-label">> URL Entropy</span>
                                <span class="abhedya-metric-value">${rawScores.url_risk ?? 0}/100</span>
                            </div>
                            <div class="abhedya-telemetry-item">
                                <span class="abhedya-metric-label">> SSL/TLS Chain</span>
                                <span class="abhedya-metric-value">${rawScores.ssl_risk ?? 0}/100</span>
                            </div>
                            <div class="abhedya-telemetry-item">
                                <span class="abhedya-metric-label">> DOM Obfuscation</span>
                                <span class="abhedya-metric-value">${rawScores.dom_risk ?? 0}/100</span>
                            </div>
                            <div class="abhedya-telemetry-item">
                                <span class="abhedya-metric-label">> AI Vision Intent</span>
                                <span class="abhedya-metric-value">${rawScores.gemini_risk ?? 0}/100</span>
                            </div>
                        </div>
                    </div>

                    <div class="abhedya-verdict-box">
                        <span class="abhedya-verdict-label">[ Threat Diagnostic Summary ]</span>
                        <p class="abhedya-verdict-text">${reason}</p>
                    </div>
                </div>
            </div>
        `;
    };

    attachBlockScreen();
}

// Coordinate tab visibility triggers
if (document.visibilityState === "visible") {
    initiateAbhedyaScan();
} else {
    const onVisibilityChange = () => {
        if (document.visibilityState === "visible") {
            document.removeEventListener("visibilitychange", onVisibilityChange);
            setTimeout(initiateAbhedyaScan, 400);
        }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
}