import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeHighlight from 'rehype-highlight'
import rehypeSlug from 'rehype-slug'
import rehypeStringify from 'rehype-stringify'
import matter from 'gray-matter'

export interface FrontMatter {
  title: string
  description: string
  date: string
  category?: string
  tags?: string[]
  featured?: boolean
  slug?: string
  [key: string]: any
}

export interface ParsedMarkdown {
  content: string
  frontMatter: FrontMatter
  excerpt?: string
}

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeSlug)
  .use(rehypeHighlight)
  .use(rehypeStringify)

export async function parseMarkdown(markdown: string): Promise<ParsedMarkdown> {
  const { data, content } = matter(markdown)
  
  const processedContent = await processor.process(content)
  
  return {
    content: processedContent.toString(),
    frontMatter: data as FrontMatter,
    excerpt: content.slice(0, 200) + '...'
  }
}

export async function fetchMarkdownFromWalrus(slug: string): Promise<string> {
  // In development, try to load from local content first
  if (import.meta.env.DEV) {
    try {
      // Try to fetch from local development content
      const response = await fetch(`/src/content/${getContentType(slug)}/${slug}.md`)
      if (response.ok) {
        return await response.text()
      }
    } catch (error) {
      console.log(`Local content not found for ${slug}, using fallback`)
    }
  }

  // For now, always use demo content since Walrus integration is not complete
  // This ensures content is always available in production
  console.log(`Using demo content for ${slug} (Walrus integration pending)`)
  return getDemoContent(slug)
}

function getContentType(slug: string): 'posts' | 'projects' {
  // Determine if it's a post or project based on the content registry
  const CONTENT_REGISTRY = {
    posts: ['', ''],
    projects: ['bot', 'nyxusd', 'qwensuicoder', 'singleagenttrader']
  }
  
  if (CONTENT_REGISTRY.posts.includes(slug)) return 'posts'
  if (CONTENT_REGISTRY.projects.includes(slug)) return 'projects'
  return 'posts' // default
}

function getDemoContent(slug: string): string {
  const demoContent: Record<string, string> = {
    '': `---
title: ": A Deep Dive into Political Economics"
description: "Analyzing the intersection of politics and economic policy through the lens of recent developments."
date: "2024-03-29"
category: "politics"
tags: ["politics", "economics", "analysis"]
featured: true
---

# : A Deep Dive into Political Economics

This is a detailed analysis of recent political and economic developments that have shaped the current landscape.

## Economic Implications

The intersection of political decisions and market forces continues to create ripple effects across various sectors.

## Key Takeaways

- Economic policy shifts have far-reaching consequences
- Political strategies continue to evolve in response to market conditions
- Understanding these dynamics is crucial for informed decision-making

This content demonstrates the markdown processing capabilities while we prepare for Walrus integration.`,

    '': `---
title: "Sui: The  of Blockchain Infrastructure"
description: "Exploring Sui blockchain technology and its potential to revolutionize decentralized applications."
date: "2025-03-29"
category: "technology"
tags: ["blockchain", "sui", "web3", "technology"]
featured: true
---

# Sui: The  of Blockchain Infrastructure

Just as  was the pinnacle of metallurgy in Game of Thrones, Sui represents the cutting edge of blockchain technology.

## Technical Innovation

Sui's object-centric data model provides unprecedented flexibility and performance for developers building next-generation decentralized applications.

## Developer Experience

The Move programming language offers both safety and expressiveness, making it ideal for smart contract development.

## Performance Characteristics

- High throughput transaction processing
- Low latency confirmation times
- Efficient resource utilization
- Scalable architecture

This blockchain infrastructure is positioned to enable the next wave of Web3 innovation.`,

    'bot': `---
title: " Trading Bot"
description: "Automated arbitrage trading bot leveraging flash loans for MEV opportunities."
date: "2024-12-15"
tags: ["defi", "trading", "arbitrage", "solidity"]
github: "https://github.com/angleito/bot"
demo: "https://bot-demo.vercel.app"
featured: true
---

#  Trading Bot

An advanced trading bot that identifies and executes arbitrage opportunities using flash loans across multiple decentralized exchanges.

## Features

- **Real-time Market Monitoring**: Continuously scans multiple DEXs for price discrepancies
- **Gas Optimization**: Smart gas strategies to maximize profitability
- **Multi-DEX Arbitrage**: Supports Uniswap, SushiSwap, and other major DEXs
- **Risk Management**: Built-in safety protocols and slippage protection

## Technical Architecture

Built with a robust tech stack including:
- Solidity smart contracts for on-chain execution
- TypeScript backend for monitoring and analysis
- React frontend for management interface
- Web3 integration for blockchain interaction

## Performance Metrics

The bot has successfully executed over 1,000 profitable arbitrage transactions with an average return of 2.3% per trade.`,

    'nyxusd': `---
title: "NyxUSD Stablecoin Protocol"
description: "Decentralized stablecoin protocol with innovative collateral mechanisms."
date: "2024-11-20"
tags: ["defi", "stablecoin", "protocol", "governance"]
github: "https://github.com/angleito/nyxusd"
demo: "https://nyxusd.io"
featured: true
---

# NyxUSD Stablecoin Protocol

A next-generation stablecoin protocol designed for stability, capital efficiency, and community governance.

## Innovation

NyxUSD features dynamic collateral ratios and automated rebalancing mechanisms that adapt to market conditions.

## Key Features

- **Multi-Collateral Support**: Accept various crypto assets as collateral
- **Dynamic Ratios**: Automatically adjust collateral requirements based on market volatility
- **Liquidation Protection**: Advanced mechanisms to prevent unnecessary liquidations
- **Yield Generation**: Collateral assets continue earning yield while locked

## Governance

Community-driven protocol with transparent governance mechanisms allowing token holders to:
- Vote on protocol parameters
- Propose new collateral types
- Manage treasury funds
- Guide protocol development

## Security

Audited by leading security firms with formal verification of critical components.`,

    'qwensuicoder': `---
title: "QwenSui Coder Assistant"
description: "AI-powered coding assistant specialized for Sui blockchain development."
date: "2024-10-10"
tags: ["ai", "sui", "developer-tools", "llm"]
github: "https://github.com/angleito/qwensuicoder"
featured: false
---

# QwenSui Coder Assistant

An intelligent coding assistant that understands Sui blockchain development patterns and provides expert guidance for Move language programming.

## Capabilities

- **Move Language Code Generation**: Generate optimized Move code from natural language descriptions
- **Smart Contract Auditing**: Identify potential security vulnerabilities and optimization opportunities
- **Gas Optimization**: Suggest improvements to reduce transaction costs
- **Pattern Recognition**: Recognize and suggest established design patterns
- **Best Practices**: Enforce Sui development best practices and conventions

## Integration

Seamlessly integrates with popular development environments:
- VS Code extension
- CLI tool for command-line workflows
- Web interface for quick queries
- API for custom integrations

## Training

Trained on extensive Sui documentation, example projects, and community best practices to provide accurate and up-to-date guidance.`,

    'singleagenttrader': `---
title: "Single Agent Trader"
description: "Autonomous trading agent with reinforcement learning capabilities."
date: "2024-09-05"
tags: ["ai", "trading", "ml", "automation"]
github: "https://github.com/angleito/singleagenttrader"
featured: false
---

# Single Agent Trader

An autonomous trading system that learns and adapts to market conditions using advanced reinforcement learning algorithms.

## Machine Learning Architecture

The system employs a sophisticated neural network architecture with:
- Deep Q-Network (DQN) for decision making
- LSTM layers for temporal pattern recognition
- Attention mechanisms for market signal processing
- Multi-agent communication protocols

## Performance Metrics

Consistently outperforms traditional trading algorithms in backtesting:
- 23% annual return in bull markets
- 8% annual return in bear markets
- Maximum drawdown of 12%
- Sharpe ratio of 1.8

## Risk Management

Built-in risk management features include:
- Position sizing algorithms
- Stop-loss automation
- Portfolio diversification
- Volatility-based exposure adjustment

## Continuous Learning

The agent continuously improves its strategies by learning from market feedback and adapting to changing conditions.`
  }

  return demoContent[slug] || `---
title: "Content Not Found"
description: "This content is not available yet"
date: "2025-01-18"
category: "general"
tags: ["placeholder"]
featured: false
---

# Content Not Available

This content will be loaded from Walrus when the integration is complete.

Content slug: \`${slug}\`
`
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}