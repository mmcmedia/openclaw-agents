# Kanban Board Visibility Bug

## Issue
After implementing collapsible filters, kanban board is not visible on page load.

## Quick Fix (Temporary)
Clear localStorage to reset collapsed state:
```javascript
localStorage.removeItem('mmc_toolbar_collapsed');
localStorage.removeItem('mmc_quickfilters_collapsed');
```

Then reload the page.

## Root Cause
The collapse logic might be interfering with board rendering or the board container has a display issue.

## Proper Fix (In Overnight Redesign)
The web-developer redesign will:
1. Rebuild the entire layout structure
2. Ensure board is always visible as primary content
3. Implement proper progressive disclosure
4. Test all views and states

## Workaround for Now
Open browser console and run:
```javascript
document.getElementById('boardView').style.display = 'block';
```

This will force the board to show while we wait for the full redesign.
