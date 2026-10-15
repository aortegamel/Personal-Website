---
name: 'Stockbot'
description: >-
  Local-first AI investment research system giving individual investors
  hedge-fund-style research infrastructure: a kernel-scheduled agent loop over
  a typed tool registry, 224 deterministic equity calculations, scheduled
  market watches with alerts, and a Vite trading terminal. SEC EDGAR, FINRA,
  13F, and Robinhood data flow through point-in-time known_at handling,
  provenance, and DuckDB analytics over Parquet. The model selects bounded
  tools and explains evidence; code does the arithmetic.
tech_stack:
  - Python
  - TypeScript
  - Vite
  - React
  - FastAPI
  - Cactus Needle 3
  - SEC EDGAR
  - FINRA datasets
  - DuckDB
  - Parquet
  - pytest
  - pyrefly
  - ruff
  - Bun
github: https://github.com/aortegamel/stockbot
featured: true
features:
  - Kernel-scheduled agent loop with JEV tool selection over the full registry
  - Local Needle 3 routing with remote Muse Spark reasoning
  - 224 pure deterministic equity calculations across 7 modules
  - Nine scheduled watch types with a persistent alert ledger
  - Live quality evals with hard gates and an LLM judge
  - Vite trading terminal on keyless real market data
  - SEC extraction with pinned original-byte archives
  - Bulk 13F holdings with both-directions point-in-time lookup
  - Grounded hypotheticals with verbatim quotes and code-computed impacts
  - Read-only Robinhood portfolio and options integration
---

## Overview

Stockbot is a local-first AI investment research system designed to give individual investors hedge-fund-style research infrastructure. It is the research and data foundation for that direction, not an automated trading product: no order placement, no money movement, no scanner writes.

## How It Works

A kernel scheduler owns the agent loop. JEV selects over the whole tool registry every round (around 66 research tools across SEC, FINRA, valuation, web, and thesis domains), Needle 3 fills tool arguments locally, and tools execute against canonical Python handlers. A terminal UI streams progress and renders answers beside immutable source captures.

Local routing runs on Cactus Needle 3 weights; remote reasoning runs on Muse Spark. The LLM selects bounded tools and explains evidence. It is not the primary database or calculator.

## Deterministic Calculations

A stdlib-only library of 224 pure parameterized equity functions covers valuation, fundamentals, factors, technicals, portfolio risk, execution, and performance: DDM and free-cash-flow models, DuPont ROE, Beneish M-score, Piotroski F-score, RSI and MACD, Black-Scholes Greeks, VaR and expected shortfall, Sharpe and Sortino ratios. Every function states its formula in one line and raises on bad domain input. Numbers come from code, never model arithmetic.

## Scheduled Watches

A built-in calendar scheduler runs nine watch types with point-in-time cutoffs and deterministic template summaries: SEC filing watches, FINRA watches, stock price watches, news watches, BTC alerts, thesis ticks and digests, research questions, and script checks. An alert ledger persists every firing; a monitor gate byte-checks outputs before delivery.

## Trading Terminal

A Vite terminal with watchlists, filings, merged multi-source news, and Recharts candles with MA, RSI, and MACD runs on free keyless real data through a FastAPI backend: Yahoo OHLCV, SEC EDGAR filings, and five merged RSS news feeds. Failures render as unavailable, never synthetic data.

## Evidence Approach

Every data point carries point-in-time known_at handling and provenance, so research reflects what was known when. SEC results require a pinned original archive: the call fails when original bytes or hashes cannot be archived or verified. The viewer marks only exact quotes, never fuzzy matches. Re-running any ingestion produces zero duplicate facts through indexed Parquet dedupe.

Hypotheticals are declared assumptions, never evidence. Every impact number cites exact evidence ids plus verbatim source quotes, and code computes the impact (exposure times haircut, divided by 100). Unknown refs and non-verbatim quotes fail closed.

## Data and Integrations

Stockbot archives raw source responses and stores normalized datasets as Parquet for DuckDB analytics. Bulk 13F holdings support both-directions lookup (manager to holdings, issuer to holders) with CUSIP canonicalization. A full-text index with explicit freshness metadata backs BM25 search. Optional read-only Robinhood integration covers portfolio snapshots, quotes, option chains, and saved scanners over a pinned MCP endpoint. Optional Exa-backed web research provides bounded current-evidence highlights alongside canonical financial records.

## Verification

Offline pytest suites with pyrefly typechecking and ruff lint gates run without credentials. A live quality harness runs typed cases through the production route with 13 fail-closed hard gates (fabricated evidence, unsupported numbers, point-in-time crossing, prompt injection) plus a structured LLM judge scoring seven dimensions. Live agent checks and end-to-end verification are opt-in, isolated under timestamped evidence directories, and never part of CI.
