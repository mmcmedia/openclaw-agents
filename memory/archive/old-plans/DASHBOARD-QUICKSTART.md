# Command Center - Quick Start

## 🚀 Easiest Way to Launch

### Option 1: Simple Script (From Anywhere)
```bash
/Users/mmcassistant/clawd/dashboard/launch-dashboard.sh
```

This will:
- ✅ Start the server automatically
- ✅ Open your browser to the dashboard
- ✅ Run in background (you can close terminal)

**Stop the dashboard:**
```bash
/Users/mmcassistant/clawd/dashboard/launch-dashboard.sh stop
```

**Check if running:**
```bash
/Users/mmcassistant/clawd/dashboard/launch-dashboard.sh status
```

---

### Option 2: Even Easier - Add Alias (One-Time Setup)

Add this to your `~/.zshrc` file:
```bash
echo 'alias dashboard="/Users/mmcassistant/clawd/dashboard/launch-dashboard.sh"' >> ~/.zshrc
source ~/.zshrc
```

Then you can just type from anywhere:
```bash
dashboard          # Start and open
dashboard stop     # Stop
dashboard status   # Check if running
```

---

### Option 3: Double-Click (macOS Shortcut)

1. Open **Automator** (in Applications)
2. Create new **Application**
3. Add action: "Run Shell Script"
4. Paste:
   ```bash
   /Users/mmcassistant/clawd/dashboard/launch-dashboard.sh
   ```
5. Save as "Command Center.app" to Desktop
6. Double-click to launch!

---

## 📱 Bookmark It

Once running, bookmark this URL:
**http://localhost:3456**

Then you can just visit the bookmark anytime (server must be running).

---

## 🔄 Auto-Start on Login (Optional)

To have dashboard start automatically when you log in:

1. Open **System Settings** > **General** > **Login Items**
2. Click **+** button
3. Add: `/Users/mmcassistant/clawd/dashboard/launch-dashboard.sh`

---

## ⚡ Recommended Setup

**Easiest for daily use:**
1. Add the alias (Option 2)
2. Bookmark http://localhost:3000
3. Type `dashboard` once in morning
4. Click bookmark anytime during day

**Then:**
- Dashboard stays open in background  
- Just refresh browser to see updates
- Type `dashboard stop` when done for the day

**Note:** Dashboard runs on port 3456 (not 3000)
