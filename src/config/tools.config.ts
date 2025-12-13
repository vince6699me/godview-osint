import { OSINTTool, ToolCategory } from '@/types/osint.types';

export const OSINT_TOOLS: OSINTTool[] = [
  // Username & People Search
  {
    id: 'sherlock',
    name: 'Sherlock',
    category: 'username',
    description: 'Hunt down social media accounts by username across social networks',
    command: 'sherlock',
    parameters: [
      {
        name: 'username',
        type: 'string',
        required: true,
        description: 'Username to search for',
        validation: '^[a-zA-Z0-9_-]+$',
      },
      {
        name: 'timeout',
        type: 'number',
        required: false,
        description: 'Timeout in seconds',
      },
    ],
    outputFormat: 'text',
    estimatedDuration: 30,
    icon: 'Search',
  },
  {
    id: 'maigret',
    name: 'Maigret',
    category: 'username',
    description: 'Collect information about username from 2500+ sites',
    command: 'maigret',
    parameters: [
      {
        name: 'username',
        type: 'string',
        required: true,
        description: 'Username to search for',
      },
    ],
    outputFormat: 'json',
    estimatedDuration: 60,
    icon: 'UserSearch',
  },
  {
    id: 'whatsmyname',
    name: 'WhatsMyName',
    category: 'username',
    description: 'Enumerate usernames across many websites',
    command: 'whatsmyname',
    parameters: [
      {
        name: 'username',
        type: 'string',
        required: true,
        description: 'Username to search for',
      },
    ],
    outputFormat: 'json',
    estimatedDuration: 45,
    icon: 'Users',
  },

  // Email Investigation
  {
    id: 'theharvester',
    name: 'theHarvester',
    category: 'email',
    description: 'Gather emails, subdomains, hosts, employee names, open ports and banners',
    command: 'theHarvester',
    parameters: [
      {
        name: 'domain',
        type: 'string',
        required: true,
        description: 'Domain to search',
      },
      {
        name: 'source',
        type: 'select',
        required: false,
        description: 'Data source',
        options: ['all', 'google', 'bing', 'linkedin', 'twitter'],
      },
    ],
    outputFormat: 'json',
    estimatedDuration: 120,
    icon: 'Mail',
  },
  {
    id: 'ghunt',
    name: 'GHunt',
    category: 'email',
    description: 'Investigate Google accounts using OSINT',
    command: 'ghunt',
    parameters: [
      {
        name: 'email',
        type: 'string',
        required: true,
        description: 'Email address to investigate',
        validation: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
      },
    ],
    outputFormat: 'json',
    estimatedDuration: 20,
    icon: 'Search',
  },
  {
    id: 'holehe',
    name: 'Holehe',
    category: 'email',
    description: 'Check if an email is attached to an account on sites like twitter, instagram',
    command: 'holehe',
    parameters: [
      {
        name: 'email',
        type: 'string',
        required: true,
        description: 'Email address to check',
        validation: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
      },
    ],
    outputFormat: 'json',
    estimatedDuration: 30,
    icon: 'AtSign',
  },

  // Phone Number
  {
    id: 'phoneinfoga',
    name: 'PhoneInfoga',
    category: 'phone',
    description: 'Advanced information gathering tool for phone numbers',
    command: 'phoneinfoga',
    parameters: [
      {
        name: 'number',
        type: 'string',
        required: true,
        description: 'Phone number with country code (e.g., +1234567890)',
        validation: '^\\+?[1-9]\\d{1,14}$',
      },
    ],
    outputFormat: 'json',
    estimatedDuration: 15,
    icon: 'Phone',
  },

  // Web Scraping
  {
    id: 'recon-ng',
    name: 'Recon-ng',
    category: 'webscraping',
    description: 'Full-featured reconnaissance framework',
    command: 'recon-ng',
    parameters: [
      {
        name: 'domain',
        type: 'string',
        required: true,
        description: 'Target domain',
      },
      {
        name: 'module',
        type: 'select',
        required: false,
        description: 'Recon module to use',
        options: ['whois', 'dns', 'ports', 'all'],
      },
    ],
    outputFormat: 'json',
    estimatedDuration: 180,
    icon: 'Globe',
  },
  {
    id: 'spiderfoot',
    name: 'SpiderFoot',
    category: 'webscraping',
    description: 'Automate OSINT collection across 200+ data sources',
    command: 'spiderfoot',
    parameters: [
      {
        name: 'target',
        type: 'string',
        required: true,
        description: 'Target (domain, IP, email, etc.)',
      },
    ],
    outputFormat: 'json',
    estimatedDuration: 300,
    icon: 'Network',
  },

  // Social Media
  {
    id: 'twint',
    name: 'Twint',
    category: 'socialmedia',
    description: 'Twitter intelligence tool for scraping tweets',
    command: 'twint',
    parameters: [
      {
        name: 'username',
        type: 'string',
        required: true,
        description: 'Twitter username (without @)',
      },
      {
        name: 'limit',
        type: 'number',
        required: false,
        description: 'Number of tweets to fetch',
      },
    ],
    outputFormat: 'json',
    estimatedDuration: 60,
    icon: 'Twitter',
  },
  {
    id: 'osintgram',
    name: 'Osintgram',
    category: 'socialmedia',
    description: 'Instagram OSINT and reconnaissance tool',
    command: 'osintgram',
    parameters: [
      {
        name: 'username',
        type: 'string',
        required: true,
        description: 'Instagram username',
      },
    ],
    outputFormat: 'json',
    estimatedDuration: 45,
    icon: 'Instagram',
  },

  // Breach Data
  {
    id: 'snusbase',
    name: 'Snusbase',
    category: 'breach',
    description: 'Search through data breaches',
    command: 'snusbase',
    parameters: [
      {
        name: 'query',
        type: 'string',
        required: true,
        description: 'Email or username to search',
      },
      {
        name: 'type',
        type: 'select',
        required: false,
        description: 'Search type',
        options: ['email', 'username', 'password', 'hash'],
      },
    ],
    outputFormat: 'json',
    estimatedDuration: 10,
    icon: 'Database',
  },
  {
    id: 'hibp',
    name: 'HaveIBeenPwned',
    category: 'breach',
    description: 'Check if email has been compromised in a data breach',
    command: 'hibp',
    parameters: [
      {
        name: 'email',
        type: 'string',
        required: true,
        description: 'Email address to check',
        validation: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
      },
    ],
    outputFormat: 'json',
    estimatedDuration: 5,
    icon: 'ShieldAlert',
  },

  // Dark Web
  {
    id: 'onionsearch',
    name: 'OnionSearch',
    category: 'darkweb',
    description: 'Search engine for onion services',
    command: 'onionsearch',
    parameters: [
      {
        name: 'query',
        type: 'string',
        required: true,
        description: 'Search query',
      },
    ],
    outputFormat: 'json',
    estimatedDuration: 120,
    icon: 'Eye',
  },
  {
    id: 'ahmia',
    name: 'Ahmia',
    category: 'darkweb',
    description: 'Search hidden services on the Tor network',
    command: 'ahmia',
    parameters: [
      {
        name: 'query',
        type: 'string',
        required: true,
        description: 'Search query',
      },
    ],
    outputFormat: 'json',
    estimatedDuration: 90,
    icon: 'EyeOff',
  },
];

export const TOOL_CATEGORIES: ToolCategory[] = [
  { id: 'username', name: 'Username & People Search', icon: 'Users', description: 'Find social media accounts and profiles' },
  { id: 'email', name: 'Email Investigation', icon: 'Mail', description: 'Investigate email addresses and domains' },
  { id: 'phone', name: 'Phone Number OSINT', icon: 'Phone', description: 'Analyze phone numbers and carriers' },
  { id: 'webscraping', name: 'Search & Web Scraping', icon: 'Globe', description: 'Web reconnaissance and data gathering' },
  { id: 'socialmedia', name: 'Social Media', icon: 'Share2', description: 'Social media intelligence gathering' },
  { id: 'breach', name: 'Breach Data', icon: 'ShieldAlert', description: 'Check for compromised credentials' },
  { id: 'darkweb', name: 'Dark Web', icon: 'Eye', description: 'Search hidden services and onion sites' },
  { id: 'automation', name: 'Automation & Frameworks', icon: 'Workflow', description: 'Automated OSINT workflows' },
];

export const getToolsByCategory = (category: string) => 
  OSINT_TOOLS.filter(tool => tool.category === category);

export const getToolById = (id: string) => 
  OSINT_TOOLS.find(tool => tool.id === id);
