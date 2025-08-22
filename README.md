# Augur Fork Meter

A transparent, auditable monitoring system for Augur's fork probability. Provides real-time assessment of the risk that Augur's oracle will enter a fork state based on on-chain dispute activity and security metrics.

## Features

- **Real-time Monitoring**: Hourly automated calculation of fork risk metrics
- **Transparent Architecture**: All calculations performed via public GitHub Actions
- **Auditable History**: Complete audit trail in git repository
- **No Private Infrastructure**: Uses only GitHub Actions and static JSON storage
- **Interactive UI**: Gauge display with both real data and demo modes

## Quick Start - No API Keys Required!

```bash
# Install dependencies
npm install

# Calculate current fork risk (uses public RPCs automatically!)
npm run build:fork-data

# Start development server
npm run dev

# Build for production
npm run build
```

**✅ Zero Configuration**: The system automatically connects to public Ethereum RPC endpoints - no API keys, no registration, no setup required!

## Architecture

### Data Collection
- **GitHub Actions**: Runs hourly to calculate fork risk metrics
- **Public RPC Endpoints**: Connects to free Ethereum RPC services (no API keys!)
- **Verified Contracts**: Uses official Augur v2 mainnet addresses
- **Static Storage**: Results saved to `public/data/fork-risk.json`
- **Git Audit Trail**: All changes tracked in version control

### Risk Calculation
- **Dispute Bond Tracking**: Monitors size and escalation of dispute bonds
- **Security Ratio**: Assesses REP market cap vs open interest ratio  
- **Fork Threshold**: Calculates percentage of 275,000 REP threshold reached
- **Multi-factor Analysis**: Combines multiple indicators for overall risk level

### UI Components
- **Real Data Mode**: Displays actual fork risk from JSON file
- **Demo Mode**: Interactive controls for testing and demonstration
- **Risk Visualization**: Gauge display with color-coded risk levels
- **Detailed Metrics**: Shows active disputes, REP staked, security ratios

## Documentation

- **[Methodology](docs/methodology.md)**: Complete explanation of risk calculation methodology
- **[Gauge UI](docs/gauge-ui.md)**: UI component documentation
- **[Augur Whitepaper](docs/augur-whitepaper-v2.pdf)**: Core fork mechanics reference

## Risk Levels

| Level | Description | Fork Threshold % | Security Status |
|-------|-------------|------------------|-----------------|
| **Low** | Normal operation | <0.5% | Good |
| **Moderate** | Active disputes | 0.5-2% | Monitoring |
| **High** | Large disputes | 2-5% | Concern |
| **Critical** | Fork imminent | >5% | Alert |

## Public RPC Endpoints (No API Keys!)

The system automatically connects to these free, public Ethereum RPC endpoints:

| Provider | Endpoint | Notes |
|----------|----------|-------|
| **Ankr** | `https://rpc.ankr.com/eth` | Primary endpoint |
| **LlamaRPC** | `https://eth.llamarpc.com` | Public good project |
| **LinkPool** | `https://main-light.eth.linkpool.io` | Community provider |
| **PublicNode** | `https://ethereum.publicnode.com` | Decentralized infrastructure |
| **1RPC** | `https://1rpc.io/eth` | Privacy-focused RPC |

### Failover Strategy
- Automatically tries endpoints in order until one works
- Logs which endpoint is used for transparency
- No rate limiting issues with hourly GitHub Actions
- Zero vendor lock-in - can always switch providers

### Optional Custom RPC
```bash
# Optional: Use your own RPC endpoint
ETH_RPC_URL=https://your-custom-rpc-endpoint.com
```

### GitHub Actions Setup
The monitoring system automatically runs via GitHub Actions. See `.github/workflows/fork-monitor.yml` for configuration.

## Development

### Project Structure
```
├── scripts/
│   └── calculate-fork-risk.ts    # TypeScript calculation logic
├── contracts/
│   └── augur-abis.json           # Smart contract ABIs
├── public/
│   └── data/
│       └── fork-risk.json        # Generated risk data (gitignored)
├── src/
│   ├── components/
│   │   ├── App.tsx               # Root app component with provider
│   │   ├── ForkMeter.tsx         # Main UI component
│   │   └── ...                   # Other UI components
│   ├── contexts/
│   │   └── ForkRiskContext.tsx   # React Context for fork risk data
│   └── types/
│       └── gauge.ts              # TypeScript definitions
├── tsconfig.json                 # Root TypeScript config with project references
├── tsconfig.app.json             # Astro app TypeScript config
├── tsconfig.scripts.json         # Scripts TypeScript config
└── docs/
    └── methodology.md            # Risk calculation methodology
```

### Development & TypeScript

This project uses TypeScript with project references for clean separation:

```bash
# Calculate fork risk data (TypeScript with Node.js 22)
npm run build:fork-data

# Type-check all TypeScript files
npm run typecheck

# Or with a custom RPC endpoint
ETH_RPC_URL="https://your-rpc-endpoint.com" npm run build:fork-data

# Check which RPC was used
cat public/data/fork-risk.json | grep -A 5 "rpcInfo"
```

### TypeScript Configuration
- **`tsconfig.app.json`** - Frontend Astro application
- **`tsconfig.scripts.json`** - Node.js scripts  
- Uses Node.js 22's native TypeScript support (`--experimental-strip-types`)
- Build cache stored in `.tscache/` (gitignored)

### Deployment
The site deploys automatically via GitHub Actions:
- Runs hourly to update fork risk data
- Deploys to `gh-pages` branch (keeps main branch clean)
- Static site build when CI environment detected
- Uses only native git commands (no third-party actions)

## Transparency and Auditability

This project prioritizes transparency:

1. **Open Source**: All calculation logic is public and auditable
2. **Git History**: Every risk calculation is tracked in version control
3. **No Black Boxes**: No private databases or hidden infrastructure
4. **Reproducible**: Anyone can verify calculations using the same inputs

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes with full test coverage
4. Update documentation as needed
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Current Status & Limitations

**✅ What's Working:**
- Real Augur v2 contract addresses and connections
- Public RPC failover system (no API keys needed)
- Transparent, auditable architecture
- Proper error handling (no fake data fallbacks)

**⚠️ Current Limitations:**
- Dispute monitoring uses mock data (real event parsing in development)
- REP price estimation ($15/REP placeholder - price oracle needed)
- Open interest estimates (Universe contract integration pending)
- Limited Augur activity on mainnet (most moved to Polygon)

## Disclaimer

This tool is for informational purposes only. Fork risk assessment is inherently uncertain and this system may not capture all possible risk factors. The current implementation has known limitations documented above. Users should conduct their own analysis and not rely solely on these metrics for critical decisions.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run build:fork-data` | Calculate fork risk data (TypeScript)           |
| `npm run typecheck`       | Type-check all TypeScript files                 |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |