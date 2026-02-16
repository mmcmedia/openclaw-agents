const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const router = express.Router();

// Import activity logging
const { logActivity } = require('../services/websocket');

// Path to kanban data
const KANBAN_DIR = '/Users/mmcassistant/clawd/dashboard/data';
const KANBAN_FILE = path.join(KANBAN_DIR, 'cards.json');
const BACKUP_DIR = path.join(KANBAN_DIR, 'backups');

// Valid columns and priorities
const VALID_COLUMNS = ['todo', 'inprogress', 'done', 'backlog'];
const VALID_PRIORITIES = ['high', 'medium', 'low'];

// ID validation regex (card-<timestamp>-<random>)
const VALID_ID_REGEX = /^card-\d{13,}-[a-z0-9]{9}$/;

// Simple in-memory lock for concurrency
const fileLock = {
  locked: false,
  queue: [],
  async acquire() {
    if (this.locked) {
      await new Promise(resolve => this.queue.push(resolve));
    }
    this.locked = true;
  },
  release() {
    this.locked = false;
    const next = this.queue.shift();
    if (next) next();
  }
};

// Helper: Sanitize input to prevent XSS
function sanitize(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
}

// Helper: Validate card ID
function isValidId(id) {
  return typeof id === 'string' && VALID_ID_REGEX.test(id);
}

// Helper: Create backup before write
async function createBackup() {
  try {
    await fs.mkdir(BACKUP_DIR, { recursive: true });
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(BACKUP_DIR, `cards-${timestamp}.json`);
    
    try {
      await fs.copyFile(KANBAN_FILE, backupPath);
      // Keep only last 10 backups
      const backups = await fs.readdir(BACKUP_DIR);
      if (backups.length > 10) {
        const sorted = backups.sort();
        for (let i = 0; i < sorted.length - 10; i++) {
          await fs.unlink(path.join(BACKUP_DIR, sorted[i])).catch(() => {});
        }
      }
    } catch (e) {
      // Source file might not exist yet
    }
  } catch (error) {
    console.error('Backup creation failed:', error.message);
  }
}

// Helper: Read kanban file with locking
async function readKanban() {
  await fileLock.acquire();
  try {
    const data = await fs.readFile(KANBAN_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  } finally {
    fileLock.release();
  }
}

// Helper: Write kanban file atomically with backup
async function writeKanban(cards) {
  await fileLock.acquire();
  try {
    await fs.mkdir(KANBAN_DIR, { recursive: true });
    await createBackup();
    
    // Write to temp file first
    const tempFile = `${KANBAN_FILE}.tmp`;
    await fs.writeFile(tempFile, JSON.stringify(cards, null, 2));
    
    // Atomic rename
    await fs.rename(tempFile, KANBAN_FILE);
  } finally {
    fileLock.release();
  }
}

// Helper: Generate ID
function generateId(prefix = 'card') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Helper: Safe error response (don't leak internal details)
function safeError(res, status, message, logDetails = null) {
  if (logDetails) {
    console.error(`[${new Date().toISOString()}] Error:`, logDetails);
  }
  res.status(status).json({
    success: false,
    error: message
  });
}

// GET /api/kanban/cards - List all cards
router.get('/cards', async (req, res) => {
  try {
    const cards = await readKanban();
    
    // Optional filters with sanitization
    const { column, priority, assignee } = req.query;
    let filtered = cards;
    
    if (column && VALID_COLUMNS.includes(column)) {
      filtered = filtered.filter(c => c.column === column);
    }
    if (priority && VALID_PRIORITIES.includes(priority)) {
      filtered = filtered.filter(c => c.priority === priority);
    }
    if (assignee) {
      const cleanAssignee = sanitize(assignee);
      filtered = filtered.filter(c => c.assignee === cleanAssignee);
    }
    
    res.json({
      success: true,
      count: filtered.length,
      cards: filtered
    });
  } catch (error) {
    safeError(res, 500, 'Failed to read kanban data', error.message);
  }
});

// GET /api/kanban/cards/:id - Get specific card
router.get('/cards/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!isValidId(id)) {
      return safeError(res, 400, 'Invalid card ID format');
    }
    
    const cards = await readKanban();
    const card = cards.find(c => c.id === id);
    
    if (!card) {
      return safeError(res, 404, 'Card not found');
    }
    
    res.json({
      success: true,
      card
    });
  } catch (error) {
    safeError(res, 500, 'Failed to read card', error.message);
  }
});

// POST /api/kanban/cards - Create new card
router.post('/cards', async (req, res) => {
  try {
    let { title, description, column = 'todo', priority = 'medium', assignee, category, tags, estimatedHours } = req.body;
    
    // Sanitize inputs
    title = sanitize(title);
    description = sanitize(description);
    assignee = sanitize(assignee || 'Maria');
    category = sanitize(category || 'General');
    
    // Validation
    if (!title || title.length === 0) {
      return safeError(res, 400, 'Title is required');
    }
    
    if (title.length > 200) {
      return safeError(res, 400, 'Title must be less than 200 characters');
    }
    
    if (!VALID_COLUMNS.includes(column)) {
      return safeError(res, 400, `Invalid column. Must be one of: ${VALID_COLUMNS.join(', ')}`);
    }
    
    if (!VALID_PRIORITIES.includes(priority)) {
      return safeError(res, 400, `Invalid priority. Must be one of: ${VALID_PRIORITIES.join(', ')}`);
    }
    
    // Validate tags array
    let cleanTags = [];
    if (Array.isArray(tags)) {
      cleanTags = tags.map(t => sanitize(t)).filter(t => t.length > 0 && t.length <= 50).slice(0, 10);
    }
    
    // Validate estimatedHours
    const hours = estimatedHours ? parseInt(estimatedHours, 10) : null;
    if (hours !== null && (isNaN(hours) || hours < 0 || hours > 1000)) {
      return safeError(res, 400, 'Estimated hours must be between 0 and 1000');
    }
    
    const cards = await readKanban();
    
    const newCard = {
      id: generateId(),
      title,
      description,
      column,
      priority,
      assignee,
      category,
      tags: cleanTags,
      estimatedHours: hours,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    cards.push(newCard);
    await writeKanban(cards);
    
    // Log activity
    try {
      await logActivity({
        type: 'card-created',
        action: 'created',
        cardId: newCard.id,
        cardTitle: newCard.title,
        column: newCard.column,
        priority: newCard.priority,
        agent: req.user?.username || 'unknown',
        assignee: newCard.assignee
      });
    } catch (logError) {
      console.error('[Activity] Failed to log create:', logError);
    }
    
    console.log(`[${new Date().toISOString()}] Card created: ${newCard.id} by ${req.user?.username || 'unknown'}`);
    
    res.status(201).json({
      success: true,
      message: 'Card created successfully',
      card: newCard
    });
  } catch (error) {
    safeError(res, 500, 'Failed to create card', error.message);
  }
});

// PUT /api/kanban/cards/:id - Update card
router.put('/cards/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!isValidId(id)) {
      return safeError(res, 400, 'Invalid card ID format');
    }
    
    let { title, description, priority, assignee, category, tags, estimatedHours } = req.body;
    
    const cards = await readKanban();
    const cardIndex = cards.findIndex(c => c.id === id);
    
    if (cardIndex === -1) {
      return safeError(res, 404, 'Card not found');
    }
    
    // Build updates object with sanitization
    const updates = {};
    
    if (title !== undefined) {
      const cleanTitle = sanitize(title);
      if (cleanTitle.length === 0) {
        return safeError(res, 400, 'Title cannot be empty');
      }
      if (cleanTitle.length > 200) {
        return safeError(res, 400, 'Title must be less than 200 characters');
      }
      updates.title = cleanTitle;
    }
    
    if (description !== undefined) {
      updates.description = sanitize(description);
    }
    
    if (priority !== undefined) {
      if (!VALID_PRIORITIES.includes(priority)) {
        return safeError(res, 400, `Invalid priority. Must be one of: ${VALID_PRIORITIES.join(', ')}`);
      }
      updates.priority = priority;
    }
    
    if (assignee !== undefined) {
      updates.assignee = sanitize(assignee);
    }
    
    if (category !== undefined) {
      updates.category = sanitize(category);
    }
    
    if (tags !== undefined) {
      if (Array.isArray(tags)) {
        updates.tags = tags.map(t => sanitize(t)).filter(t => t.length > 0 && t.length <= 50).slice(0, 10);
      }
    }
    
    if (estimatedHours !== undefined) {
      const hours = parseInt(estimatedHours, 10);
      if (isNaN(hours) || hours < 0 || hours > 1000) {
        return safeError(res, 400, 'Estimated hours must be between 0 and 1000');
      }
      updates.estimatedHours = hours;
    }
    
    updates.updatedAt = new Date().toISOString();
    
    cards[cardIndex] = { ...cards[cardIndex], ...updates };
    await writeKanban(cards);
    
    console.log(`[${new Date().toISOString()}] Card updated: ${id} by ${req.user?.username || 'unknown'}`);
    
    res.json({
      success: true,
      message: 'Card updated successfully',
      card: cards[cardIndex]
    });
  } catch (error) {
    safeError(res, 500, 'Failed to update card', error.message);
  }
});

// PUT /api/kanban/cards/:id/move - Move card to different column
router.put('/cards/:id/move', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!isValidId(id)) {
      return safeError(res, 400, 'Invalid card ID format');
    }
    
    let { toColumn, reason } = req.body;
    
    if (!toColumn) {
      return safeError(res, 400, 'toColumn is required');
    }
    
    if (!VALID_COLUMNS.includes(toColumn)) {
      return safeError(res, 400, `Invalid column. Must be one of: ${VALID_COLUMNS.join(', ')}`);
    }
    
    const cards = await readKanban();
    const cardIndex = cards.findIndex(c => c.id === id);
    
    if (cardIndex === -1) {
      return safeError(res, 404, 'Card not found');
    }
    
    const oldColumn = cards[cardIndex].column;
    
    // No-op if moving to same column
    if (oldColumn === toColumn) {
      return res.json({
        success: true,
        message: `Card already in ${toColumn}`,
        card: cards[cardIndex]
      });
    }
    
    cards[cardIndex].column = toColumn;
    cards[cardIndex].updatedAt = new Date().toISOString();
    
    // Add move history
    if (!cards[cardIndex].moveHistory) {
      cards[cardIndex].moveHistory = [];
    }
    cards[cardIndex].moveHistory.push({
      from: oldColumn,
      to: toColumn,
      reason: sanitize(reason || ''),
      movedAt: new Date().toISOString(),
      movedBy: req.user?.username || 'unknown'
    });
    
    await writeKanban(cards);
    
    // Log activity
    try {
      await logActivity({
        type: 'card-moved',
        action: 'moved',
        cardId: id,
        cardTitle: cards[cardIndex].title,
        fromColumn: oldColumn,
        toColumn: toColumn,
        reason: sanitize(reason || ''),
        agent: req.user?.username || 'unknown',
        assignee: cards[cardIndex].assignee
      });
    } catch (logError) {
      console.error('[Activity] Failed to log move:', logError);
    }
    
    console.log(`[${new Date().toISOString()}] Card moved: ${id} from ${oldColumn} to ${toColumn} by ${req.user?.username || 'unknown'}`);
    
    res.json({
      success: true,
      message: `Card moved to ${toColumn}`,
      card: cards[cardIndex],
      previousColumn: oldColumn
    });
  } catch (error) {
    safeError(res, 500, 'Failed to move card', error.message);
  }
});

// DELETE /api/kanban/cards/:id - Archive (soft delete) card
router.delete('/cards/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!isValidId(id)) {
      return safeError(res, 400, 'Invalid card ID format');
    }
    
    const cards = await readKanban();
    const cardIndex = cards.findIndex(c => c.id === id);
    
    if (cardIndex === -1) {
      return safeError(res, 404, 'Card not found');
    }
    
    // Soft delete
    const archivedCard = {
      ...cards[cardIndex],
      column: 'archived',
      archivedAt: new Date().toISOString(),
      archivedBy: req.user?.username || 'unknown',
      updatedAt: new Date().toISOString()
    };
    
    cards[cardIndex] = archivedCard;
    await writeKanban(cards);
    
    console.log(`[${new Date().toISOString()}] Card archived: ${id} by ${req.user?.username || 'unknown'}`);
    
    res.json({
      success: true,
      message: 'Card archived successfully',
      card: archivedCard
    });
  } catch (error) {
    safeError(res, 500, 'Failed to archive card', error.message);
  }
});

// GET /api/kanban/columns - List valid columns
router.get('/columns', (req, res) => {
  res.json({
    success: true,
    columns: VALID_COLUMNS
  });
});

// GET /api/kanban/stats - Get kanban statistics
router.get('/stats', async (req, res) => {
  try {
    const cards = await readKanban();
    
    const stats = {
      total: cards.length,
      byColumn: {},
      byPriority: {},
      byAssignee: {},
      archived: 0
    };
    
    cards.forEach(card => {
      // By column
      if (card.column === 'archived') {
        stats.archived++;
      } else {
        stats.byColumn[card.column] = (stats.byColumn[card.column] || 0) + 1;
      }
      
      // By priority
      stats.byPriority[card.priority] = (stats.byPriority[card.priority] || 0) + 1;
      
      // By assignee
      stats.byAssignee[card.assignee] = (stats.byAssignee[card.assignee] || 0) + 1;
    });
    
    res.json({
      success: true,
      stats
    });
  } catch (error) {
    safeError(res, 500, 'Failed to get statistics', error.message);
  }
});

// GET /api/kanban/health - Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    features: {
      sanitization: true,
      validation: true,
      locking: true,
      backups: true
    }
  });
});

module.exports = router;
