# KPI Card Advanced - Usage Guide

## Table of Contents
1. [Getting Started](#getting-started)
2. [Basic Configuration](#basic-configuration)
3. [Advanced Features](#advanced-features)
4. [Grouping System](#grouping-system)
5. [Title Positioning](#title-positioning)
6. [Examples](#examples)
7. [Troubleshooting](#troubleshooting)

## Getting Started

### Adding the Extension
1. In edit mode, drag the "KPI Card Advanced" extension from the visualization panel to your sheet
2. The extension will prompt you to add at least one measure

### Adding Measures
1. Click "Add measure" in the data panel
2. Select a field or create a calculated measure
3. Add up to 10 measures for comprehensive KPI tracking

### Adding a Dimension (Optional)
- Add a time-based dimension (e.g., Date, Month) to enable line chart functionality
- The dimension will be used for the expandable trend charts

## Basic Configuration

### Setting Up Your First KPI

1. **Add a Measure**
   - Click "Add measure"
   - Select your KPI field (e.g., Sales, Profit Margin)

2. **Configure General Appearance**
   - Go to "Appearance" > "General Settings"
   - Use the **color picker** for background and border colors
   - Adjust border width with the **slider** (0-10px)
   - Set border radius with the **slider** (0-30px)
   - Choose box shadow from the **dropdown**

3. **Style the Gauge**
   - Go to "Gauge Styling"
   - Adjust gauge line height with the **slider** (4-20px)
   - Set default colors using **color pickers**
   - Control animation duration with the **slider** (0-2000ms)

## Advanced Features

### Title Positioning and Styling

1. **Position Options**
   - Go to "Title Styling"
   - Choose "Left of Gauge" or "Above Gauge" from the dropdown
   - Use the color picker for title color
   - Adjust font size with the slider (10-24px)
   - Select font weight from the dropdown

2. **Title Position Examples**
   - **Left Position**: Title appears to the left, gauge and value on the right
   - **Top Position**: Title above, gauge and value below in vertical layout

### Comparison Indicators

Show performance changes:
1. In "Individual Measure Settings", expand a measure
2. Expand "Comparison Indicator"
3. Enable "Show Comparison"
4. Set the comparison value (e.g., 5 for +5%)
5. Use color pickers for positive/negative colors (default: green/red)

### Expandable Line Charts

View historical trends:
1. Add a time dimension to your visualization
2. Go to "Line Chart Settings"
3. Enable "Enable Expandable Line Charts"
4. Adjust chart height with the slider (100-400px)
5. Set line color with the color picker
6. Toggle data points on/off
7. Click on any measure in the visualization to see its trend

## Grouping System

### Creating Dynamic Groups

The new grouping system allows you to create multiple groups with customizable measure ranges:

1. **Add a Group**
   - Go to "Measure Groups"
   - Click "Add Group"
   - Set a group title (e.g., "Financial Metrics")

2. **Configure Group Range**
   - Set **Start Measure Index** (1-based, e.g., 1 for first measure)
   - Set **End Measure Index** (1-based, e.g., 3 for third measure)
   - This creates Group 1 with measures 1-3

3. **Style the Group**
   - Use color pickers for group background and border
   - Toggle group title visibility

4. **Multiple Groups Example**
   - Group 1: Measures 1-3 (Financial KPIs)
   - Group 2: Measures 4-6 (Operational KPIs)
   - Group 3: Measures 7-10 (Customer KPIs)

## Examples

### Example 1: Sales Dashboard with Groups

```
Group 1: "Financial Performance" (Measures 1-3)
- Revenue Growth: 12% (with +8% green indicator)
- Profit Margin: 45%
- Cost Ratio: 55%

Group 2: "Customer Metrics" (Measures 4-5)
- Satisfaction: 92% (with trend chart)
- Retention: 87%

Ungrouped:
- Market Share: 23% (Measure 6)
```

### Configuration for Example 1:

1. **Create Group 1**
   - Title: "Financial Performance"
   - Start Measure: 1, End Measure: 3
   - Background: Light blue, Border: Blue

2. **Create Group 2**
   - Title: "Customer Metrics"
   - Start Measure: 4, End Measure: 5
   - Background: Light green, Border: Green

3. **Individual Measure Settings**
   - Measure 1 (Revenue): Add comparison +8%
   - Measure 4 (Satisfaction): Enable line chart

### Example 2: Process Optimization Card

```
All measures with titles positioned above gauges:
- Process Efficiency: 80%
- Quality Score: 95%
- Downtime: 3% (with red indicator -2%)
- Throughput: 87%
```

### Configuration for Example 2:

1. **Title Styling**
   - Position: "Above Gauge"
   - Font Size: 16px
   - Font Weight: Medium

2. **No Grouping**
   - Leave "Measure Groups" empty for flat layout

3. **Comparison Indicator**
   - Measure 3 (Downtime): -2% comparison

## Animation Features

### Hover Effects
- **Gauge Scale**: Gauges scale up slightly on hover
- **Value Pop**: Values scale and brighten on hover
- **Card Lift**: Expandable measures lift up with shadow on hover

### Loading Animations
- **Staggered Entry**: Measures animate in with delays
- **Gauge Fill**: Gauges animate their fill from 0 to value
- **Shimmer Effect**: Subtle shimmer animation on gauge fills

## Troubleshooting

### Measures Not Displaying
- Ensure measures are properly defined and return numeric values
- Check that measure index in individual settings matches actual measure order
- Verify data is available for the current selections

### Line Charts Not Working
- Confirm a dimension is added to the visualization
- Check that "Enable Expandable Line Charts" is turned on
- Ensure dimension contains time-based or sequential data
- Verify the dimension has multiple values

### Grouping Issues
- Check measure indices are within the available measure range
- Ensure Start Measure Index ≤ End Measure Index
- Verify measure indices don't overlap between groups

### UI Elements Not Appearing
- Clear browser cache if sliders/color pickers don't show
- Check Qlik Sense version compatibility
- Ensure extension is properly loaded

### Performance Optimization
- Limit to 7-10 measures for optimal performance
- Use simple calculations where possible
- Consider data reduction if working with large datasets
- Disable animations if performance is slow

## Best Practices

1. **Measure Organization**
   - Group related measures together
   - Use descriptive group titles
   - Keep groups to 3-4 measures for readability

2. **Title Positioning**
   - Use "Left" position for longer titles
   - Use "Top" position for short titles and vertical layouts

3. **Color Consistency**
   - Use consistent colors across similar measure types
   - Reserve red/green for negative/positive indicators
   - Consider color-blind accessibility

4. **Animation Balance**
   - Keep animation duration reasonable (300-800ms)
   - Disable animations for performance-critical dashboards
   - Use hover effects to guide user interaction

5. **Line Chart Usage**
   - Ensure meaningful time dimension
   - Use line charts for trend analysis
   - Keep chart height appropriate for container size