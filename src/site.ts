// Single source for site identity + public contact links.
// Content markdown keeps its own per-project links; only the portfolio
// owner's shared identity lives here.
export const site = {
  name: 'Angel Ortega-Melton',
  shortName: 'Angleito',
  tagline: 'DeFi, AI, and blockchain projects',
  description:
    'Portfolio of Angel Ortega-Melton: DeFi, AI, and blockchain projects.',
  email: 'contact@angleito.dev',
  social: {
    github: 'https://github.com/angleito',
    linkedin: 'https://linkedin.com/in/angelortegamelton',
    twitter: 'https://twitter.com/angleito5',
  },
} as const
