# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Core Development**
- `npm run dev` - Start Astro dev server at localhost:4321
- `npm run build` - Build production site to ./dist/
- `npm run preview` - Preview build locally before deploying

**Data & Risk Calculation**
- `npm run build:fork-data` - Calculate fork risk data using TypeScript scripts (requires Node.js 22+ with --experimental-strip-types)
- Check RPC endpoint used: `cat public/data/fork-risk.json | grep -A 3 "rpcInfo"`

**Code Quality**
- `npm run typecheck` - Type-check all TypeScript files using project references
- `npm run lint` - Run Biome linter with tab indentation and single quotes

**Deployment**
- `npm run deploy` - Deploy to Cloudflare (requires wrangler setup)
- `npm run cf-typegen` - Generate Cloudflare types

## Project Architecture

### Dual Runtime Architecture
This project uses TypeScript project references to separate two distinct runtime environments:

**Frontend (Astro + React)**
- Config: `tsconfig.app.json` 
- Location: `src/` directory
- Purpose: Interactive web UI with gauge visualization and data panels
- Key components: React Context for state management, SVG gauge display, demo/debug modes

**Backend Scripts (Node.js)**
- Config: `tsconfig.scripts.json`
- Location: `scripts/` directory  
- Purpose: Ethereum blockchain data collection and risk calculation
- Uses Node.js 22's native TypeScript support via --experimental-strip-types

### Data Flow Architecture
1. **Collection**: GitHub Actions runs `calculate-fork-risk.ts` hourly
2. **Storage**: Results saved to `public/data/fork-risk.json` (gitignored)
3. **Consumption**: Frontend loads JSON via ForkRiskContext provider
4. **Visualization**: React components render risk data in interactive gauge

### Key Architectural Patterns

**React Context Pattern**
- `ForkRiskContext.tsx` - Manages fork risk data state and provides refetch capability
- `DemoContext.tsx` - Handles demo mode state for testing and presentations  
- Auto-refetch every 5 minutes with loading/error states

**Progressive Disclosure UI**
- Healthy state: Clean "no disputes" message
- Active disputes: Detailed metrics panels with market addresses
- Responsive: Stacked mobile layout, 3-column desktop grid

**Dual Deployment Strategy**
- CI Detection: `astro.config.mjs` detects GitHub Actions environment
- Static build for GitHub Pages deployment in CI
- Cloudflare adapter for local development and production

### TypeScript Configuration Strategy
- Root `tsconfig.json` uses project references (no files directly)
- `tsconfig.app.json` - Astro frontend with React integration
- `tsconfig.scripts.json` - Node.js scripts with experimental TypeScript support
- Build cache in `.tscache/` (gitignored)

### External Dependencies
- **Blockchain**: ethers.js v6 for Ethereum contract interaction
- **UI Framework**: Astro + React 19 with TypeScript
- **Styling**: TailwindCSS v4 with custom gauge SVG components
- **RPC Access**: Automatic failover across 5 public Ethereum RPC endpoints (no API keys required)

## Augur-Specific Context

**Fork Risk Calculation**
- Monitors largest active dispute bond vs 275,000 REP fork threshold
- Simple formula: (Largest Dispute Bond / 275,000 REP) × 100 = Risk %
- Real-time assessment without complex multi-factor analysis

**Smart Contract Integration**
- Uses official Augur v2 mainnet contract addresses
- ABI definitions in `contracts/augur-abis.json`
- Connects to DisputeCrowdsourcer and Universe contracts

## Code Style Guidelines

**Biome Configuration**
- Tab indentation (not spaces)
- Single quotes for strings
- Semicolons only when needed (ASI enabled)
- Auto-organize imports enabled

NEVER: use emojis in documentations

# important-instruction-reminders
Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.
