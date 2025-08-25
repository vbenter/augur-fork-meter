# Fork Meter UI Components

This document describes the React/TypeScript implementation of the Augur Fork Meter's user interface components.

## Architecture Overview

The UI is built with:
- **React 19** with TypeScript
- **Astro** for static site generation
- **Tailwind CSS** for styling
- **SVG** for gauge visualization
- **Context API** for state management

## Component Hierarchy

```
App (Provider Wrapper)
└── ForkMeter (Main Container)
    ├── Top Bar (Fixed Position)
    │   ├── Demo Mode Indicator
    │   ├── Settings/Demo Button
    │   └── Reset Button (Demo Only)
    ├── Main Content
    │   ├── Title & Subtitle
    │   ├── GaugeDisplay (SVG Visualization)
    │   ├── DataPanels (Risk Level & Metrics)
    │   └── Last Updated Info
    └── DebugSidebar (Overlay)
        ├── Live Data Section
        └── Demo Controls Section
```

## Core Components

### 1. ForkMeter.tsx
Main container component that orchestrates the entire interface.

**Features:**
- Fixed top bar with demo mode status and controls
- State management for demo vs live data
- Layout coordination between main content and debug sidebar

**Key State:**
- `isDemoMode`: Boolean flag for demo/live state
- `isDebugOpen`: Controls debug sidebar visibility
- `demoData`: Simulated data when in demo mode

### 2. GaugeDisplay.tsx
SVG-based semicircular gauge for risk visualization.

**Features:**
- Dynamic arc rendering based on percentage (0-100%)
- Gradient color mapping from green (safe) to red (critical)
- Smooth CSS transitions for value changes
- Responsive design with viewBox scaling

**Visual Elements:**
- Background track (full semicircle)
- Colored progress arc with gradient
- Large percentage text display
- "FORK PRESSURE" label

### 3. DebugSidebar.tsx
Slide-out panel with live data display and demo controls.

**Features:**
- **Live Data Section**: Formatted display of real fork risk metrics
- **Demo Controls Section**: Interactive controls for testing scenarios
- Mobile-responsive width (full width on mobile, fixed width on desktop)
- Backdrop overlay with click-to-close functionality

**Live Data Display:**
- Risk Level & Percentage
- Active Disputes with details
- REP Market Cap (formatted currency)
- Open Interest (formatted currency)
- Security Ratio (with decimal precision)
- RPC Endpoint & Latency
- Block Number
- Last Updated timestamp

**Demo Controls:**
- Manual percentage slider (0-100%)
- Risk preset buttons (Low/Medium/High)
- Reset to Live Data button (when in demo mode)

### 4. DataPanels.tsx
Three-column display of key metrics below the gauge.

**Displays:**
- **Fork Risk Level**: Low/Medium/High/Critical with color coding
- **REP Staked in Disputes**: Formatted number with "REP" suffix
- **Active Disputes**: Count of current dispute activity

### 5. RiskBadge.tsx
Color-coded risk level indicator with dynamic styling.

**Risk Levels:**
- **Low**: Green background
- **Medium**: Yellow background
- **High**: Orange background
- **Critical**: Red background (with pulsing animation)

## State Management

### ForkRiskContext.tsx
React Context providing fork risk data throughout the component tree.

**Provides:**
- `gaugeData`: Processed data for gauge display
- `riskLevel`: Current risk level assessment
- `lastUpdated`: Formatted timestamp
- `isLoading`: Loading state
- `error`: Error message if data fetch fails
- `rawData`: Complete JSON data from API
- `refetch`: Function to manually refresh data

**Data Flow:**
1. Context fetches from `/data/fork-risk.json` on mount
2. Data is processed and formatted for UI consumption
3. Auto-refresh every 5 minutes
4. Fallback to default data if fetch fails

## Styling System

### Tailwind Configuration
- **Custom Colors**: Primary green theme with variants
- **Typography**: Handjet font for retro terminal aesthetic
- **Responsive Design**: Mobile-first approach
- **Dark Theme**: Stone/slate color palette

### CSS Custom Properties
Used for gauge visualization:
```css
--gauge-color-safe: #10b981
--gauge-color-safe-mid: #eab308
--gauge-color-warning: #f59e0b
--gauge-color-danger: #ef4444
--gauge-color-critical: #dc2626
```

## Interface Modes

### Live Data Mode (Default)
- Displays real blockchain data from `fork-risk.json`
- Top bar nearly invisible (transparent background)
- "Demo" button available in top-right (subtle styling)
- Main content shows actual risk metrics

### Demo Mode
- Activated via debug controls or demo presets
- Top bar becomes visible with green background
- "Demo Mode" text appears on left
- "Settings" and "Reset" buttons on right
- Main content shows simulated data

## Responsive Design

### Breakpoints
- **Mobile**: `< 640px` - Full width sidebar, stacked layout
- **Tablet**: `640px - 1024px` - Partial width sidebar
- **Desktop**: `> 1024px` - Fixed width sidebar (28rem)

### Mobile Optimizations
- Debug sidebar covers full screen width
- Touch-friendly button sizes
- Simplified gauge scaling
- Reduced text sizes where appropriate

## Data Processing

### Risk Level Calculation
```typescript
// Convert backend risk levels to display format
const convertToRiskLevel = (data: ForkRiskData): RiskLevel => {
  switch (data.riskLevel) {
    case 'low': return { level: 'Low' }
    case 'moderate': return { level: 'Medium' }  
    case 'high': return { level: 'High' }
    case 'critical': return { level: 'Critical' }
    default: return { level: 'Low' }
  }
}
```

### Number Formatting
- **Currency**: `Intl.NumberFormat` with USD formatting
- **Large Numbers**: Comma-separated thousands
- **Percentages**: Dynamic decimal places based on precision needed
- **Timestamps**: Localized date/time display

## Performance Considerations

### Optimization Features
- React Context prevents prop drilling
- Memoized callback functions to prevent re-renders
- Efficient SVG rendering with minimal DOM updates
- CSS transitions for smooth animations
- Lazy loading of debug sidebar content

### Update Strategy
- Data fetching only when component mounts or manually triggered
- Local state updates for demo mode (no API calls)
- Debounced slider updates to prevent excessive re-renders

## Accessibility

### Features Implemented
- Proper ARIA labels for interactive elements
- Keyboard navigation support
- Screen reader friendly text alternatives
- High contrast color schemes
- Focus indicators on interactive elements

## Future Enhancements

### Planned Improvements
- Real-time WebSocket data updates
- Historical data visualization
- Customizable alert thresholds
- Export functionality for data
- Advanced filtering options in debug panel

---

**Last Updated**: August 24, 2025
**Component Version**: 2.0 (React Implementation)