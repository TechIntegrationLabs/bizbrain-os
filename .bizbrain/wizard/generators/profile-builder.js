#!/usr/bin/env node
// Profile Builder - Extracts structured data from natural language input

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..', '..');

function extractProfile(text) {
  const profile = {
    businessName: null,
    userName: null,
    userRole: null,
    businessType: null,
    industry: null,
    description: null,
    teamSize: null,
    existingTools: [],
    painPoints: [],
    clientCount: null,
    rawText: text
  };

  // Business type detection
  const typePatterns = {
    'solo-freelancer': /\b(freelanc|solo|independent|one.?man|just me|by myself|solopreneur)\b/i,
    'small-agency': /\b(agency|studio|shop|team of|small team|we have|employees|staff)\b/i,
    'startup': /\b(startup|start.?up|launching|building a|saas|product|mvp|seed|series)\b/i,
    'consultancy': /\b(consult|advise|advisory|counsel|strategy firm)\b/i
  };

  for (const [type, pattern] of Object.entries(typePatterns)) {
    if (pattern.test(text)) {
      profile.businessType = type;
      break;
    }
  }

  // Tool detection
  const tools = [
    'github', 'gitlab', 'bitbucket', 'netlify', 'vercel',
    'notion', 'slack', 'discord', 'trello', 'asana', 'jira',
    'stripe', 'supabase', 'firebase', 'aws', 'heroku', 'railway',
    'figma', 'sketch', 'canva', 'photoshop', 'illustrator',
    'gmail', 'outlook', 'mailchimp', 'sendgrid', 'resend',
    'shopify', 'wordpress', 'webflow', 'squarespace', 'wix',
    'clerk', 'auth0', 'nextauth',
    'linear', 'monday', 'clickup', 'basecamp',
    'docker', 'kubernetes', 'terraform',
    'airtable', 'google sheets', 'excel',
    'hubspot', 'salesforce', 'pipedrive',
    'zapier', 'make', 'n8n',
    'twilio', 'whatsapp'
  ];

  tools.forEach(tool => {
    // Use word boundary for short tool names, looser match for multi-word
    const pattern = tool.includes(' ')
      ? new RegExp(tool.replace(/\s+/g, '\\s+'), 'i')
      : new RegExp(`\\b${tool}\\b`, 'i');
    if (pattern.test(text)) {
      profile.existingTools.push(tool);
    }
  });

  // Team size detection
  const teamMatch = text.match(/(\d+)\s*(people|person|team\s*members?|employees?|devs?|developers?|designers?|staff|contractors?)/i);
  if (teamMatch) {
    profile.teamSize = parseInt(teamMatch[1]);
  } else if (/\bjust me\b|solo|alone|one.?man|by myself\b/i.test(text)) {
    profile.teamSize = 1;
  } else {
    // Try "team of X" or "X of us"
    const altMatch = text.match(/team\s+of\s+(\d+)/i) || text.match(/(\d+)\s+of\s+us/i);
    if (altMatch) {
      profile.teamSize = parseInt(altMatch[1]);
    }
  }

  // Client count detection
  const clientMatch = text.match(/(\d+)\s*(clients?|customers?|accounts?)/i);
  if (clientMatch) {
    profile.clientCount = parseInt(clientMatch[1]);
  } else {
    // Ranges like "10-20 clients"
    const rangeMatch = text.match(/(\d+)\s*[-to]+\s*(\d+)\s*(clients?|customers?|accounts?)/i);
    if (rangeMatch) {
      profile.clientCount = Math.round((parseInt(rangeMatch[1]) + parseInt(rangeMatch[2])) / 2);
    }
  }

  // Industry detection
  const industries = {
    'web-development': /\b(web dev|website|web app|frontend|backend|full.?stack|next\.?js|react|vue|angular)\b/i,
    'mobile-development': /\b(mobile|ios|android|react native|flutter|swift|kotlin)\b/i,
    'design': /\b(design|ui|ux|graphic|brand|visual|creative)\b/i,
    'marketing': /\b(marketing|seo|social media|content market|advertising|ads|ppc|growth)\b/i,
    'ecommerce': /\b(ecommerce|e.?commerce|shopify|store|retail|products|online shop)\b/i,
    'saas': /\b(saas|software as a service|subscription|platform|b2b software)\b/i,
    'consulting': /\b(consulting|advisory|strategy|management consult)\b/i,
    'healthcare': /\b(health|medical|dental|clinic|patient|telehealth|pharma)\b/i,
    'education': /\b(education|teaching|training|course|learning|edtech|lms)\b/i,
    'finance': /\b(finance|fintech|banking|investment|accounting|bookkeeping)\b/i,
    'real-estate': /\b(real estate|property|realty|proptech|rental)\b/i,
    'media': /\b(media|content|video|podcast|publishing|journalism|news)\b/i,
    'ai-ml': /\b(ai|artificial intelligence|machine learning|deep learning|nlp|llm|gpt)\b/i
  };

  for (const [industry, pattern] of Object.entries(industries)) {
    if (pattern.test(text)) {
      profile.industry = industry;
      break;
    }
  }

  // Pain point detection
  const painPatterns = [
    { pattern: /\b(disorganiz|messy|scattered|all over the place|can't find)\b/i, label: 'Organization' },
    { pattern: /\b(time track|billing|invoice|hours|late payment)\b/i, label: 'Time tracking & billing' },
    { pattern: /\b(forget|forgetful|drop.?the.?ball|fall.?through|slip)\b/i, label: 'Task management' },
    { pattern: /\b(communi|email|message|slack|too many|overwhelm)\b/i, label: 'Communication overload' },
    { pattern: /\b(manual|tedious|repetitive|automat|streamline)\b/i, label: 'Manual processes' },
    { pattern: /\b(client.?manage|crm|track.?client|client.?info)\b/i, label: 'Client management' },
    { pattern: /\b(project.?manage|deadline|scope|deliver)\b/i, label: 'Project management' },
    { pattern: /\b(content|social|post|blog|publish)\b/i, label: 'Content creation' },
    { pattern: /\b(deploy|hosting|server|devops|ci.?cd)\b/i, label: 'Deployment & DevOps' },
    { pattern: /\b(scale|growth|growing|expand)\b/i, label: 'Scaling' }
  ];

  painPatterns.forEach(({ pattern, label }) => {
    if (pattern.test(text)) {
      profile.painPoints.push(label);
    }
  });

  // Name extraction (best effort)
  const namePatterns = [
    /(?:my name is|I'm|I am|this is|call me)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/,
    /^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\s+here/m
  ];

  for (const pattern of namePatterns) {
    const match = text.match(pattern);
    if (match) {
      profile.userName = match[1].trim();
      break;
    }
  }

  // Business name extraction (best effort)
  const bizPatterns = [
    /(?:company|business|called|named|run|own|started)\s+(?:is\s+)?([A-Z][A-Za-z0-9\s&]+?)(?:\.|,|\s+and\b|\s+which\b|\s+that\b|\s+is\b)/,
    /(?:at|for|with)\s+([A-Z][A-Za-z0-9\s&]+?)(?:\.|,|\s+and\b|\s+where\b|\s+doing\b)/,
    /([A-Z][A-Za-z0-9\s&]+?)\s+(?:LLC|Inc|Ltd|Corp|Co\b|Agency|Studio|Labs?|Digital|Media)/
  ];

  for (const pattern of bizPatterns) {
    const match = text.match(pattern);
    if (match) {
      profile.businessName = match[1].trim();
      break;
    }
  }

  // Role extraction
  const rolePatterns = [
    /(?:I'm|I am|work as|role is|position is)\s+(?:a |an |the )?([A-Za-z\s]+?)(?:\s+at\b|\s+for\b|\.|,)/i
  ];

  for (const pattern of rolePatterns) {
    const match = text.match(pattern);
    if (match) {
      const role = match[1].trim().toLowerCase();
      // Filter out non-role matches
      const validRoles = ['ceo', 'cto', 'founder', 'co-founder', 'owner', 'developer',
        'designer', 'manager', 'director', 'lead', 'freelancer', 'consultant',
        'engineer', 'architect', 'principal', 'partner', 'vp', 'head'];
      if (validRoles.some(r => role.includes(r))) {
        profile.userRole = match[1].trim();
      }
    }
  }

  return profile;
}

// If run directly
if (require.main === module) {
  const inputFile = process.argv[2] || path.join(ROOT, '.bizbrain', 'wizard', 'voice-buffer.txt');

  if (process.argv[2] === '--stdin') {
    // Read from stdin
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', chunk => { data += chunk; });
    process.stdin.on('end', () => {
      const profile = extractProfile(data);
      console.log(JSON.stringify(profile, null, 2));
    });
  } else if (fs.existsSync(inputFile)) {
    const text = fs.readFileSync(inputFile, 'utf8');
    const profile = extractProfile(text);
    console.log(JSON.stringify(profile, null, 2));
  } else {
    console.error('No input file found. Provide a file path as argument or use --stdin.');
    console.error(`Looked for: ${inputFile}`);
    process.exit(1);
  }
}

module.exports = { extractProfile };
