// Enhanced cache utility with TTL support for different data types
class Cache {
  constructor() {
    this.store = new Map();
    this.defaultTTL = 15 * 60 * 1000; // 15 minutes default
  }

  set(key, value, customTTL = null) {
    const ttl = customTTL || this.defaultTTL;
    const expires = Date.now() + ttl;
    this.store.set(key, { value, expires });
  }

  get(key) {
    const item = this.store.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expires) {
      this.store.delete(key);
      return null;
    }
    
    return item.value;
  }

  delete(key) {
    this.store.delete(key);
  }

  clear() {
    this.store.clear();
  }

  // Helper to check if a GA4 response contains sampled data
  static isSampled(response) {
    if (!response || !response.metadata) return false;
    
    // Check for sampling metadata
    if (response.metadata.samplingMetadatas && response.metadata.samplingMetadatas.length > 0) {
      return true;
    }
    
    // Check for data loss from other rows (another sampling indicator)
    if (response.metadata.dataLossFromOtherRow) {
      return true;
    }
    
    // Check if samplesReadCounts is significantly different from rowCount
    if (response.metadata.samplesReadCounts && response.metadata.rowsCount) {
      const samples = parseInt(response.metadata.samplesReadCounts[0]?.value || 0, 10);
      const rows = parseInt(response.metadata.rowsCount, 10);
      if (samples > 0 && samples < rows) {
        return true;
      }
    }
    
    return false;
  }
}

module.exports = new Cache();