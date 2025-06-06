# KPI Card Advanced - Qlik Sense Extension

A modern, customizable KPI Card extension for Qlik Sense featuring linear gauges with expandable line charts, dynamic grouping, and extensive styling options.

## Features

- **Linear Gauges**: Clean, minimal progress bar visualization for all KPIs
- **Dynamic Grouping**: Create multiple groups with customizable measure ranges (e.g., Group 1: measures 1-3, Group 2: measures 4-6)
- **Flexible Title Positioning**: Display titles to the left or above gauges
- **Advanced Styling**: 
  - Customizable gauge height with slider control
  - Color pickers for all color options
  - Font size and weight controls
  - Border radius and shadow options
- **Comparison Indicators**: Show performance changes with animated colored indicators
- **Expandable Line Charts**: Click any measure to reveal smooth, animated historical trend data
- **Modern Animations**: Subtle hover effects, smooth transitions, and loading animations
- **Responsive Design**: Adapts to different screen sizes
- **Qlik UI Integration**: Uses native Qlik UI components (sliders, dropdowns, color pickers)

## What's New

- Removed donut chart visualization - now exclusively using linear gauges
- Enhanced grouping system with dynamic measure ranges
- Added title positioning options (left/top)
- Implemented proper Qlik UI elements throughout
- Added modern hover animations and effects
- Fixed line chart rendering with improved tooltips
- Customizable gauge line height

## Installation

1. Download the `kpi-card-advanced.zip` file
2. Open Qlik Sense Desktop or QMC (Qlik Management Console)
3. Navigate to Extensions
4. Import the zip file
5. The extension will appear in your visualization panel as "KPI Card Advanced"

## Quick Start

1. Add the KPI Card Advanced extension to your sheet
2. Add at least one measure
3. Optionally add a dimension for line chart functionality
4. Configure appearance, grouping, and individual measure settings

## Configuration Options

### General Settings
- **Background Color**: Card background with color picker
- **Border**: Color picker, width slider (0-10), radius slider (0-30)
- **Box Shadow**: Dropdown with predefined shadow options
- **Measure Spacing**: Slider control (0-50px)

### Gauge Styling
- **Gauge Line Height**: Slider control (4-20px)
- **Default Colors**: Color pickers for gauge fill and background
- **Animation Duration**: Slider for transition speed (0-2000ms)

### Title Styling
- **Position**: Left of gauge or above gauge
- **Color**: Color picker
- **Font Size**: Slider (10-24px)
- **Font Weight**: Dropdown (Light/Normal/Medium/Bold)

### Dynamic Grouping
Create multiple groups with:
- **Group Title**: Custom name for each group
- **Measure Range**: Start and end measure indices (sliders)
- **Group Styling**: Background and border colors
- **Show/Hide Title**: Toggle group title visibility

### Individual Measure Settings
Override settings for specific measures:
- **Title Override**: Custom title for the measure
- **Data Label Format**: Dropdown with format options
- **Gauge Color**: Override default color
- **Comparison Indicator**: Value, positive/negative colors

### Line Chart Settings
- **Enable/Disable**: Toggle expandable charts
- **Chart Height**: Slider control (100-400px)
- **Line Color**: Color picker
- **Show Data Points**: Toggle dots on the line

## Architecture

```
kpi-card-advanced/
├── kpi-card-advanced.qext    # Extension metadata
├── kpi-card-advanced.js      # Main extension logic
├── kpi-card-advanced.css     # Styling with animations
├── src/
│   └── properties.js         # Properties panel with Qlik UI components
├── docs/
│   ├── README.md            # This file
│   └── USAGE.md            # Detailed usage guide
└── build/                   # Build artifacts
```

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## License

MIT License

## Support

For issues or feature requests, please contact the development team.