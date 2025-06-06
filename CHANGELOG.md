# Changelog

All notable changes to the KPI Card Advanced extension will be documented in this file.

## [1.0.0] - 2024-06-06

### Added
- Initial release of KPI Card Advanced extension
- Linear gauge visualization for KPIs
- Dynamic grouping system (Group 1: measures 1-3, Group 2: measures 4-6, etc.)
- Expandable line charts with smooth animations
- Comprehensive customization options:
  - Title positioning (left/top) with color and font controls
  - Gauge height, colors, and animation duration
  - Line chart types (line only, area only, line + area)
  - Modern tooltip system with full customization
  - Axis controls (show/hide X/Y axis, colors, grid lines)
  - Smooth line curves vs straight lines
- Modern UI components throughout (sliders, color pickers, dropdowns)
- Data limiting controls to prevent performance issues
- Professional animations and hover effects
- Responsive design for different screen sizes

### Features
- **Chart Types**: Line only, Area chart, Line + Area combination
- **Smooth Animations**: Fast dropdown animations (200ms) with modern easing
- **Color Customization**: All colors properly implemented and working
- **Tooltip Formatting**: Displays proper formatted values (e.g., "45%" instead of "0.453435343")
- **Data Management**: Configurable data point limits (10-200) for optimal performance
- **Accessibility**: Focus styles and keyboard navigation support

### Technical Details
- Compatible with Qlik Sense 3.0+
- Maximum 10 measures supported
- Automatic data pagination for large datasets
- Modern CSS animations with cubic-bezier easing
- SVG-based line charts with gradient fills
- Responsive breakpoints for mobile devices

### Browser Support
- Chrome (recommended)
- Firefox
- Safari
- Edge