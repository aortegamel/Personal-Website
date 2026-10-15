---
name: 'JunkFortress'
description: >-
  Physics-driven browser game. Build a fortress from junk, then defend its core
  against armed zombies. Supports and chains hold the structure, wood absorbs
  bullets, and metal ricochets turn zombie fire back on the horde.
tech_stack:
  - TypeScript
  - Phaser 3
  - Matter.js
  - Vite
  - Vitest
github: https://github.com/aortegamel/junkfortress
demo: https://junkfortress.arainey555.workers.dev/
featured: false
---

## Overview

JunkFortress is a browser game built with Phaser 3 and Matter.js physics. It has one arena and one wave. The player builds a fortress from junk, then defends its core against zombies that shoot back.

## Gameplay

In the build phase, the player places, rotates, and moves junk pieces. Planks and metal sheets need support underneath. Chains hang heavy pieces as swinging loads.

In the wave phase, zombies advance on the core and fire pistols. Wood absorbs bullets and breaks. Metal deflects them. A zombie bullet that ricochets off metal or a chain kills zombies. Pieces that lose support collapse, and falling junk crushes zombies by mass and speed.

## Implementation

A support graph over touching pieces and chains decides which pieces stay frozen and which fall. Chains are Matter constraints. All sprites and sounds are generated in code. Seeded runs make each layout reproducible. The repository includes Vitest unit tests.
