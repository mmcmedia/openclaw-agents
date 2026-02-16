# VPS Security Audit — Feb 11, 2026
**Server:** 76.13.108.6 (Hostinger)

## Findings & Fixes

| Issue | Risk | Status |
|-------|------|--------|
| Ports 3001, 3021 exposed to internet | 🔴 HIGH | ✅ FIXED — blocked via UFW |
| env-joshua, env-key2 world-readable | 🔴 HIGH | ✅ FIXED — chmod 600 |
| Fail2ban inactive | 🟡 MEDIUM | ✅ FIXED — installed & started |
| Port 3050 open in firewall (unused) | 🟢 LOW | ✅ FIXED — blocked |
| SSH password auth disabled | 🟢 GOOD | No action needed |
| SSH root key-only | 🟢 GOOD | No action needed |
| OpenClaw gateways on loopback | 🟢 GOOD | No action needed |
| Unattended upgrades installed | 🟢 GOOD | No action needed |
| Main env file locked down | 🟢 GOOD | No action needed |

## Services Running
- OpenClaw gateways: 5 instances (ports 19000-19010), all on loopback ✅
- nginx: 80/443 (public, expected) ✅
- Analytics API: port 3001 (now blocked from internet)
- Image Forge: port 3021 (now blocked from internet)
- n8n: Docker on localhost:5678 ✅
- Monarx agent: localhost only ✅

## Overall: 🟢 SECURE (after fixes)
The VPS was NOT one of the totally exposed instances the video warned about — our OpenClaw gateways were already properly locked down. The exposed ports were app servers that should've been behind nginx only.
