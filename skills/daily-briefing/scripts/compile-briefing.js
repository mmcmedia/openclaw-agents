#!/usr/bin/env node
/**
 * Daily Briefing Compiler
 * Fetches data from multiple sources and compiles a formatted briefing
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Configuration
const GETLATE_API_KEY = process.env.GETLATE_API_KEY;
const KANBAN_PATH = path.join(__dirname, '../../../dashboard/data/cards.json');

// Utility: Format currency
const formatCurrency = (amount) => `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

// Utility: Format number
const formatNumber = (num) => num.toLocaleString('en-US');

// Fetch GetLate analytics
async function fetchGetLateData() {
  return new Promise((resolve) => {
    if (!GETLATE_API_KEY) {
      console.error('No GetLate API key found');
      resolve(null);
      return;
    }

    const options = {
      hostname: 'getlate.dev',
      path: '/api/v1/accounts/follower-stats',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${GETLATE_API_KEY}`,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          console.error('Failed to parse GetLate response:', e.message);
          resolve(null);
        }
      });
    });

    req.on('error', (e) => {
      console.error('GetLate API error:', e.message);
      resolve(null);
    });

    req.setTimeout(10000, () => {
      req.destroy();
      resolve(null);
    });

    req.end();
  });
}

// Get today's tasks from kanban
function getTodaysTasks() {
  try {
    const cards = JSON.parse(fs.readFileSync(KANBAN_PATH, 'utf8'));
    const mariaCards = cards.filter(c => 
      c.assignee === 'Maria' && 
      (c.column === 'inprogress' || c.column === 'assigned') &&
      c.priority === 'high'
    );
    return mariaCards.slice(0, 5).map(c => ({
      id: c.id,
      title: c.title,
      priority: c.priority,
      due: c.dueDate
    }));
  } catch (e) {
    console.error('Failed to read kanban:', e.message);
    return [];
  }
}

// Get date info
function getDateInfo() {
  const now = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return {
    formatted: now.toLocaleDateString('en-US', options),
    dayOfWeek: now.toLocaleDateString('en-US', { weekday: 'long' }),
    isWeekend: [0, 6].includes(now.getDay())
  };
}

// Compile the briefing
async function compileBriefing() {
  const dateInfo = getDateInfo();
  const tasks = getTodaysTasks();
  
  // Fetch external data
  const socialData = await fetchGetLateData();
  
  let briefing = `
☀️ **DAILY BRIEFING** — ${dateInfo.formatted}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

`;

  // Revenue section (placeholder - needs Mediavine browser automation)
  briefing += `💰 **REVENUE SNAPSHOT**
├─ Mediavine Yesterday: *(fetch via browser)*
├─ Mediavine MTD: *(fetch via browser)*
├─ Etsy Yesterday: *(fetch via browser)*
└─ Est. FB Bonus: *(calculated from views)*

`;

  // Social performance
  if (socialData && socialData.totals) {
    briefing += `📱 **SOCIAL PERFORMANCE** (Yesterday)
├─ Total Views: ${formatNumber(socialData.totals.views || 0)}
├─ Likes: ${formatNumber(socialData.totals.likes || 0)}
├─ Comments: ${formatNumber(socialData.totals.comments || 0)}
└─ Posts Published: ${formatNumber(socialData.totals.posts || 0)}

`;
  } else {
    briefing += `📱 **SOCIAL PERFORMANCE**
└─ *(GetLate data not available)*

`;
  }

  // Tasks
  if (tasks.length > 0) {
    briefing += `🎯 **TODAY'S PRIORITIES**
`;
    tasks.forEach((task, i) => {
      const dueStr = task.due ? ` (due: ${task.due})` : '';
      briefing += `${i === tasks.length - 1 ? '└' : '├'}─ ${i + 1}. ${task.title}${dueStr}
`;
    });
    briefing += '\n';
  }

  // Day context
  if (dateInfo.isWeekend) {
    briefing += `📅 **NOTE:** It's ${dateInfo.dayOfWeek} - lighter workload, good for deep work or catch-up.

`;
  }

  briefing += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*Briefing generated at ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' })}*
`;

  return briefing;
}

// Run if called directly
if (require.main === module) {
  compileBriefing()
    .then(briefing => {
      console.log(briefing);
      // Save to file
      const outputPath = path.join(__dirname, '../output/briefing-' + new Date().toISOString().split('T')[0] + '.md');
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });
      fs.writeFileSync(outputPath, briefing);
      console.log(`\nSaved to: ${outputPath}`);
    })
    .catch(console.error);
}

module.exports = { compileBriefing, fetchGetLateData, getTodaysTasks };
