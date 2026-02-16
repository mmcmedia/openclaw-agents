# McKinzie's Full Team Roster
*Updated: Feb 7, 2026*

## Human Team

| Name | Role | Reports To | Responsibilities |
|------|------|-----------|-----------------|
| **McKinzie** | Founder & CEO | — | Final decisions on everything |
| **Dhanielle** | Lead VA / Operations Manager | McKinzie | Oversees all operations, monthly content assignments, keyword monitoring, team coordination, PsalMix oversight, testing. TRUSTED fully. |
| **Deanne** | Content & Pinterest | Dhanielle | Pinterest scheduling, content publishing |
| **Erik** | Music Generator | Dhanielle | PsalMix music generation |
| **Chaz** | Music Generator | Dhanielle | PsalMix music generation |
| **Jan Nicole** | Content Publisher | Collaborates w/ Dhanielle | Blog content publishing |
| **Minxie** | Content Publisher | Collaborates w/ Dhanielle | Blog content publishing |
| **Sandee** | Graphic Designer | McKinzie | Etsy product design, custom graphics |
| **Joshua** | Web Developer | McKinzie | Site development, technical builds |

## AI Team (OpenClaw Agents)

### Mac Mini (Maria's Home Base)
| Agent | Name | Model | Role |
|-------|------|-------|------|
| `main` | 💃🏼 Maria | Claude Opus 4.6 | COO / Chief of Staff — coordinates everything |
| `sonnet` | 💃🏼 Maria (fast) | Claude Sonnet 4.5 | Sub-agent for standard work |
| `haiku` | 💃🏼 Maria (quick) | Claude Haiku 4.5 | Sub-agent for simple tasks |

### Hostinger VPS (Executive Team)
| Agent | Name | Model | Role |
|-------|------|-------|------|
| `psalmix` | 🎵 Milo | Kimi K2.5 Free | PsalMix Brand Manager |
| `webdev` | ⚡ Dev | Kimi K2.5 Free | Web Dev Lead |
| `etsy-director` | 🎯 Scout | Kimi K2.5 Free | Etsy / E-commerce Director |
| `content-seo` | 📊 Sage | Kimi K2.5 Free | Content & SEO Director |
| `designer` | 🎨 Pixel | Kimi K2.5 Free | Design Director |
| `dhanielle` | ✨ Ally | Kimi K2.5 Free | Dhanielle's AI Assistant |

## Infrastructure
- **Mac Mini** (192.168.0.170): Maria + sub-agents, OpenClaw main instance
- **Hostinger VPS** (76.13.108.6 / srv1304127.hstgr.cloud): Executive team, 16GB RAM, 4 CPU
  - User: `openclaw` (isolated from n8n)
  - Service: systemd `openclaw.service`
  - n8n also runs here in Docker (completely separate)
- **DigitalOcean** (206.189.209.132): PocketBase apps, Caddy

## Communication Channels
- McKinzie ↔ Maria: Telegram (group -5126238590)
- Dhanielle ↔ Ally: Telegram (bot TBD — setting up Monday)
- All agents report through Maria or directly via Telegram

## Org Chart
```
McKinzie (CEO)
├── 💃🏼 Maria (AI COO)
│   ├── 🎵 Milo (PsalMix)
│   ├── ⚡ Dev (Web Dev)
│   ├── 🎯 Scout (Etsy)
│   ├── 📊 Sage (SEO/Content)
│   └── 🎨 Pixel (Design)
├── Dhanielle (Lead VA / Ops Manager)
│   ├── ✨ Ally (AI Assistant)
│   ├── Deanne (Pinterest/Content)
│   ├── Erik (Music Gen)
│   ├── Chaz (Music Gen)
│   ├── Jan Nicole (Content)
│   └── Minxie (Content)
├── Sandee (Graphic Designer)
└── Joshua (Web Developer)
```
