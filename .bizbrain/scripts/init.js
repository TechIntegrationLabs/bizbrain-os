#!/usr/bin/env node
// Minimal init script — called by Claude Code after onboarding
// Reads onboarding-context.json and activates starter plugins

const path = require('path');
const { initFromProfile } = require('./plugin-manager');

console.log('BizBrain OS v3.0 — Plugin Initialization');
console.log('');

initFromProfile();
