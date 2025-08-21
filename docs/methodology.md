# Augur Fork Risk Methodology

## Overview

The Augur Fork Meter provides transparent monitoring of the risk that Augur's oracle will enter a fork state. This document outlines the methodology, calculations, and data sources used to assess this risk.

## Fork Mechanics Background

Based on the Augur v2 whitepaper, forks are triggered when:

1. **A dispute bond reaches ≥2.5% of all theoretical REP** (275,000 REP out of 11 million total)
2. **This creates a 60-day forking period** where REP holders must migrate to child universes
3. **The universe with the most migrated REP becomes the "winning" universe**

## Risk Calculation Framework

### Primary Risk Indicators

#### 1. Dispute Bond Size Analysis
- **Current Dispute Bonds**: Track all active dispute bonds across markets
- **Escalation Patterns**: Monitor how dispute bonds grow through successive rounds
- **Fork Threshold Progress**: Calculate percentage of 275,000 REP threshold reached

**Formula**: `Fork Threshold % = (Largest Dispute Bond / 275,000) * 100`

#### 2. Security Ratio Assessment
- **REP Market Cap**: Current market value of all REP tokens
- **Open Interest**: Total DAI locked in non-finalized markets
- **Security Multiplier**: Ratio of market cap to open interest

**Formula**: `Security Ratio = REP Market Cap / Native Open Interest`

**Targets**:
- Minimum safe ratio: 3x
- Target ratio: 5x

#### 3. Dispute Activity Metrics
- **Active Markets**: Number of markets currently in dispute
- **Dispute Round Depth**: How many escalation rounds have occurred
- **Time Analysis**: Days remaining in dispute windows

### Risk Level Determination

The system assigns risk levels based on combined analysis:

#### Base Risk from Dispute Bond Size
```
if dispute_bond_percent < 0.5%:   BASE_RISK = LOW
if dispute_bond_percent < 2.0%:   BASE_RISK = MODERATE  
if dispute_bond_percent < 5.0%:   BASE_RISK = HIGH
if dispute_bond_percent >= 5.0%:  BASE_RISK = CRITICAL
```

#### Security Ratio Adjustment
If the security ratio falls below the minimum threshold (3x), risk is amplified:
```
if security_ratio < 3.0:
    adjusted_risk = base_risk * (3.0 / security_ratio)
```

#### Final Risk Percentage Calculation
```
Base Risk Score = min(50, (dispute_bond_percent / 10) * 50)
Security Risk Score = max(0, (5 - security_ratio) / 5 * 50) 
Final Risk Percentage = Base Risk Score + Security Risk Score
```

### Risk Levels

| Level | Range | Description | Color |
|-------|--------|-------------|--------|
| **Low** | 0-25% | Normal operation, small or no disputes | Green |
| **Moderate** | 26-50% | Active disputes but manageable size | Yellow |
| **High** | 51-75% | Large disputes approaching concern levels | Orange |
| **Critical** | 76-100% | Very large disputes, fork risk imminent | Red (pulsing) |

## Data Sources and Architecture

### Blockchain Data Collection
- **Ethereum Mainnet**: Primary data source via JSON-RPC
- **Augur Contracts**: Universe, Market, and DisputeCrowdsourcer contracts
- **Event Monitoring**: DisputeCrowdsourcerCreated, DisputeCrowdsourcerCompleted events

### Infrastructure Design
- **GitHub Actions**: Hourly automated calculations (sufficient for 7-day dispute windows)
- **Static JSON Storage**: Results saved to version-controlled JSON file
- **Audit Trail**: All calculations and changes tracked in git history
- **No Private Database**: Fully transparent and auditable

### Update Frequency
- **Calculation**: Every hour via GitHub Actions
- **UI Refresh**: Every 5 minutes (data changes hourly)
- **Manual Triggers**: Available for testing and immediate updates

## Transparency and Auditability

### Open Source Approach
1. **Calculation Script**: All logic is open source and auditable
2. **Git History**: Complete audit trail of all risk calculations
3. **Public Data**: JSON results available for external verification
4. **Methodology Documentation**: This document provides full transparency

### Verification Process
Anyone can verify calculations by:
1. Reviewing the calculation script: `scripts/calculate-fork-risk.js`
2. Checking historical data in git commits
3. Running calculations independently using the same inputs
4. Comparing results with the published JSON data

## Limitations and Considerations

### Known Limitations
1. **REP Price Data**: Currently relies on external price oracles
2. **Market Cap Estimation**: May have slight variations based on data sources
3. **Future Scenarios**: Cannot predict unknown attack vectors or governance changes

### Timing Considerations
- **Dispute Windows**: 7 days each, hourly monitoring is sufficient
- **Fork Duration**: Up to 60 days, providing ample warning time
- **Escalation Speed**: Multiple rounds required, attacks develop over days/weeks

### Risk Factors Not Captured
- **Coordination Attacks**: Difficult to detect until they occur
- **External Governance**: Changes to Augur parameters
- **Market Psychology**: REP holder behavior during stress

## Technical Implementation

### Contract Addresses (Mainnet)
```json
{
  "universe": "0x1f732847fbbcc46ffe859f28e916d993b2b08831",
  "repToken": "0x1985365e9f78359a9B6AD760e32412f4a445E862"
}
```

### Key Events Monitored
- `DisputeCrowdsourcerCreated`: New dispute bonds created
- `DisputeCrowdsourcerCompleted`: Dispute bonds filled
- `UniverseForked`: Fork has been triggered

### Calculation Schedule
```yaml
# GitHub Actions Schedule
schedule:
  - cron: '5 * * * *'  # Every hour at minute 5
workflow_dispatch:     # Manual trigger available
```

## Historical Context

### Augur's Fork History
- **Genesis Launch**: No forks have occurred in production to date
- **Theoretical Framework**: Fork mechanism designed as "nuclear option"
- **Economic Security**: Designed to make attacks prohibitively expensive

### Risk Assessment Evolution
This methodology may evolve based on:
- Actual fork events (if they occur)
- Community feedback and governance decisions  
- New attack vectors discovered
- Changes to Augur protocol parameters

## References

1. [Augur v2 Whitepaper](../docs/augur-whitepaper-v2.pdf) - Core fork mechanics
2. [Augur Documentation](https://docs.augur.net/) - Technical specifications
3. [GitHub Repository](/) - Source code and audit trail

---

**Last Updated**: August 21, 2025  
**Version**: 1.0  
**Maintained By**: Augur Fork Meter Project