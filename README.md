# Augur Fork Meter

A transparent, auditable monitoring system for Augur's fork probability. Provides real-time assessment of the risk that Augur's oracle will enter a fork state based on on-chain dispute activity and security metrics.

## Features

- **Real-time Monitoring**: Hourly automated calculation of fork risk metrics
- **Transparent Architecture**: All calculations performed via public GitHub Actions
- **Auditable History**: Complete audit trail in git repository
- **No Private Infrastructure**: Uses only GitHub Actions and static JSON storage
- **Interactive UI**: Gauge display with both real data and demo modes

## Quick Start

```bash
# Install dependencies
npm install

# Calculate current fork risk (generates data/fork-risk.json)
npm run calculate-fork-risk

# Copy data to public directory for web access
cp data/fork-risk.json public/data/

# Start development server
npm run dev

# Build for production
npm run build
```

## Architecture

### Data Collection
- **GitHub Actions**: Runs hourly to calculate fork risk metrics
- **Ethereum Integration**: Queries Augur contracts via JSON-RPC
- **Static Storage**: Results saved to `data/fork-risk.json`
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

## Configuration

### Environment Variables
```bash
# Required for live data (optional - uses mock data if not provided)
ETH_RPC_URL=https://mainnet.infura.io/v3/YOUR-PROJECT-ID
```

### GitHub Actions Setup
The monitoring system automatically runs via GitHub Actions. See `.github/workflows/fork-monitor.yml` for configuration.

## Development

### Project Structure
```
├── scripts/
│   └── calculate-fork-risk.js     # Main calculation logic
├── contracts/
│   └── augur-abis.json           # Smart contract ABIs
├── data/
│   └── fork-risk.json            # Generated risk data
├── src/
│   ├── components/
│   │   ├── ForkMeter.tsx         # Main UI component
│   │   ├── ForkRiskLoader.tsx    # Data loading component
│   │   └── ...                   # Other UI components
│   └── types/
│       └── gauge.ts              # TypeScript definitions
└── docs/
    └── methodology.md            # Risk calculation methodology
```

### Running Calculations Manually
```bash
# With real Ethereum RPC (requires ETH_RPC_URL)
ETH_RPC_URL="https://mainnet.infura.io/v3/YOUR-KEY" npm run calculate-fork-risk

# With mock data (for testing)
npm run calculate-fork-risk
```

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

## Disclaimer

This tool is for informational purposes only. Fork risk assessment is inherently uncertain and this system may not capture all possible risk factors. Users should conduct their own analysis and not rely solely on these metrics for critical decisions.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run calculate-fork-risk` | Calculate and update fork risk metrics       |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |