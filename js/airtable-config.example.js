// ==============================================
// AIRTABLE CONFIGURATION EXAMPLE
// ==============================================
// 📋 SETUP INSTRUCTIONS:
// 1. Copy this file to: js/airtable-config.js
// 2. Fill in your actual Airtable credentials below
// 3. Never commit airtable-config.js (it's in .gitignore)

const AIRTABLE_CONFIG_CREDENTIALS = {
  pat: 'PASTE_YOUR_PAT_HERE',      // Personal Access Token from https://airtable.com/create/tokens
  baseId: 'PASTE_YOUR_BASE_ID',     // Base ID (starts with 'app...')
  tableId: 'PASTE_YOUR_TABLE_ID'    // Table ID (starts with 'tbl...') or table name
};

// Export to window for use in airtable-service.js
window.AIRTABLE_CONFIG_CREDENTIALS = AIRTABLE_CONFIG_CREDENTIALS;
