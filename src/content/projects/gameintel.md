---
name: 'GameIntel'
description: >-
  Evidence-aware source intelligence platform normalizing material into claims
  with provenance, policy gates, and human review.
tech_stack:
  - TypeScript
  - Bun
  - PostgreSQL
  - Hono
  - Astro
  - Docker
github: https://github.com/aortegamel/GameIntel
features:
  - Claim normalization
  - Provenance tracking
  - Policy gates
  - Human review
  - Versioned JSON artifacts
---

## Overview

GameIntel is an evidence-aware source intelligence platform. It ingests source material and normalizes it into claims carrying provenance.

## Pipeline

A TypeScript/Bun monorepo backs the system. Hono APIs serve requests, PostgreSQL stores state, Dockerized workers run ingestion, and each run emits versioned JSON artifacts.

## Publication Controls

Policy gates and human review stand between ingestion and publication. Nothing ships without passing the gates and, where required, a human check.
