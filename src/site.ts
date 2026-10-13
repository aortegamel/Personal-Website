// Single source for site identity + public contact links.
// Content markdown keeps its own per-project links; only the portfolio
// owner's shared identity lives here.
export const site = {
  name: 'Angel Ortega-Melton',
  shortName: 'Angel Ortega-Melton',
  url: 'https://angelortegamelton.github.io',
  tagline: 'AI-integrated applications, agent tooling, and data pipelines',
  description:
    'Portfolio of Angel Ortega-Melton: AI-integrated applications, agent tooling, and data pipelines.',
  email: 'aortegamelton@gmail.com',
  social: {
    github: 'https://github.com/aortegamel',
    linkedin: 'https://linkedin.com/in/angel-ortega-melton',
  },
} as const
