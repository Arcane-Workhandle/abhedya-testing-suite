# 🛡️ Abhedya Beta: Testing & Evaluation Hub

![Version](https://img.shields.io/badge/version-1.0_Beta-blue.svg)[cite: 3, 10]
![Platform](https://img.shields.io/badge/platform-Chrome_Extension_(MV3)-yellow.svg)[cite: 14]
![Backend](https://img.shields.io/badge/backend-Flask_%7C_Gunicorn-009688.svg)
![AI Engine](https://img.shields.io/badge/AI-Gemini_2.5_Flash-orange.svg)[cite: 3, 10]

**Created by:** Shivang Kaushal & Sambit Kumar Garanayak[cite: 3, 10]  
**Version:** 1.0 (Edge Shield Beta)[cite: 3, 10]

Welcome to the **Abhedya** (Sanskrit for *Impenetrable*) Beta Testing Hub[cite: 3, 10]. 

Traditional security tools rely on outdated static blacklists, leaving internet users vulnerable to newly created zero-day phishing sites[cite: 3, 10]. Abhedya defends against these threats by combining local heuristic analysis with Google's **Gemini 2.5 Flash** vision AI to evaluate visual mismatches and deceptive intent before credentials can be compromised[cite: 3, 10].

This repository contains the standalone Chrome extension build pre-configured to communicate directly with our live cloud backend[cite: 11, 14].

---

## ⚡ Quick Start Installation (Under 1 Minute)

Follow these steps to load the extension into Google Chrome:

1. **Download the Repository:** Click the green **Code** button at the top of this repository, choose **Download ZIP**, and extract it to a permanent folder on your computer.
2. **Open Extensions Management:** In Google Chrome, navigate to `chrome://extensions/`[cite: 3, 10].
3. **Enable Developer Mode:** Turn **ON** the **Developer mode** toggle in the upper right corner[cite: 3, 10].
4. **Load the Unpacked Folder:**
   * Click **Load unpacked** in the top left corner[cite: 3, 10].
   * Select the **`extension/`** folder from the extracted repository files[cite: 3, 10].
5. **Pin the Shield:** Pin the 🛡️ Abhedya icon to your Chrome toolbar for quick access to settings and threat controls[cite: 3, 10].

*Note: You do not need to install Python, configure databases, or obtain API keys. The extension connects directly to the production engine[cite: 11].*

---

## 🎛️ Adaptive Threat Thresholds

Clicking the Abhedya icon opens the settings popup, allowing you to customize protection sensitivity based on your browsing environment[cite: 3, 10, 13]:

* 🔴 **Paranoid Mode (Blocks > 35):** Maximum lockdown[cite: 3, 10, 13]. Flags any destination exhibiting minor heuristic entropy[cite: 3, 10]. Recommended for public Wi-Fi networks[cite: 3, 10].
* 🟠 **Guarded Mode (Blocks > 50):** Enhanced protection for navigating unfamiliar sites or following unverified links[cite: 3, 10, 13].
* 🟢 **Standard Mode (Blocks > 65):** The default operational mode[cite: 3, 10, 13, 16]. Balances everyday browsing against active phishing and typosquatting vectors[cite: 3, 10].
* 🔵 **Relaxed Mode (Blocks > 80):** Low-friction profile[cite: 3, 10, 13]. Intercepts only confirmed, high-confidence malicious threats and explicit content[cite: 3, 10].

---

## 🧠 The 5-Pillar Ensemble Engine

Every inspected webpage is scored on a scale from 0 to 100 via an ensemble scoring pipeline[cite: 3, 10]:

1. **URL Impersonation (15%):** Mathematical sequence comparison against high-profile domains to detect typosquatting[cite: 3, 10]. Verified entities receive a score pardon via the Tranco Top 1000 index[cite: 3, 10].
2. **SSL Chain Analysis (15%):** Inspects certificate issuers and flags newly registered certificates under 14 days old[cite: 3, 10].
3. **Domain Age (20%):** Executes a live registry lookup, heavily penalizing domains registered under 30 days ago[cite: 3, 10].
4. **DOM Risk (20%):** Evaluates obfuscated scripts, hidden form fields, and suspicious credential inputs[cite: 3, 10].
5. **Gemini Multimodal AI (30%):** Correlates viewport visuals with source structure to identify brand spoofing[cite: 3, 10]. If flagged as critical, an instant override locks the score to 100[cite: 3, 10].

*Results are cached via PostgreSQL for 24 hours to prevent recurring scan latency[cite: 3, 10].*

---

## 📝 Reporting False Positives, Missed Threats & Feedback

As a beta tester, your feedback directly tunes our heuristic weightings and AI detection parameters.

Please report issues using our centralized submission form:

### 👉 **https://forms.gle/q1WQzMXTKK36NniV7**

### What to Report:
* ⚠️ **False Positives:** A legitimate, safe website was incorrectly intercepted by the red block screen.
* 🚨 **False Negatives:** A deceptive, phishing, look-alike, or explicit website bypassed the shield without being blocked.
* 🐛 **Extension Glitches:** Visual rendering flaws, frozen popup menus, or browser performance slowdowns.
* 💡 **Feature Requests:** Suggestions for threshold controls, UI enhancements, or usability improvements.

---

## 🔒 Privacy Architecture

Abhedya is designed to inspect security integrity without monitoring user history[cite: 3, 10]:
* Scans activate only during active webpage navigation[cite: 3, 10].
* Document content is transmitted solely for real-time safety classification and discarded after analysis[cite: 3, 10].
* Personal browsing histories are never collected, logged, or distributed[cite: 3, 10].
