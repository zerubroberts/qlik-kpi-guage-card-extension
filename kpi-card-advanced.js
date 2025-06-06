define(["qlik", "jquery", "./src/properties", "text!./kpi-card-advanced.css"], 
function(qlik, $, properties, cssContent) {
    'use strict';

    $("<style>").html(cssContent).appendTo("head");

    return {
        definition: properties,
        initialProperties: {
            qHyperCubeDef: {
                qDimensions: [],
                qMeasures: [],
                qInitialDataFetch: [{
                    qWidth: 11,
                    qHeight: 100
                }],
                qSuppressZero: false,
                qSuppressMissing: false
            },
            props: {
                backgroundColor: "#FFFFFF",
                borderColor: "#E0E0E0",
                borderWidth: 1,
                borderRadius: 12,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                measureSpacing: 16,
                measureGroups: [],
                measureConfigs: [],
                gaugeHeight: 8,
                defaultGaugeColor: "#007A78",
                defaultGaugeBackgroundColor: "#F0F0F0",
                animationDuration: 500,
                titlePosition: "left",
                titleColor: "#666666",
                titleFontSize: 14,
                titleFontWeight: "500",
                enableLineCharts: true,
                lineChartHeight: 200,
                chartType: "line",
                lineColor: "#007A78",
                lineWidth: 3,
                lineStyle: "smooth",
                showDataPoints: true,
                dataPointSize: 5,
                showGrid: false,
                showXAxis: true,
                showYAxis: true,
                axisColor: "#DDDDDD",
                tooltipBackgroundColor: "#2D3748",
                tooltipTextColor: "#FFFFFF",
                tooltipBorderRadius: 8,
                tooltipShadow: true,
                maxDataPointsForLineChart: 50
            }
        },
        support: {
            snapshot: true,
            export: true,
            exportData: true
        },
        
        paint: function($element, layout) {
            var self = this;
            var hypercube = layout.qHyperCube;
            var props = layout.props || {};
            var measureConfigs = props.measureConfigs || [];
            var measureGroups = props.measureGroups || [];
            
            // Request more data if needed for line charts
            var maxDataPoints = props.maxDataPointsForLineChart || 50;
            if (hypercube.qDimensionInfo.length > 0 && hypercube.qDataPages && hypercube.qDataPages[0] && 
                hypercube.qDataPages[0].qMatrix.length < maxDataPoints && 
                hypercube.qSize.qcy > hypercube.qDataPages[0].qMatrix.length) {
                
                // Request more data in chunks
                var requestPages = Math.min(maxDataPoints, hypercube.qSize.qcy);
                self.backendApi.getData('/qHyperCubeDef', 0, requestPages, hypercube.qDimensionInfo.length + hypercube.qMeasureInfo.length).then(function() {
                    // Data updated, repaint will be triggered automatically
                });
                return qlik.Promise.resolve();
            }
            
            // Clear element and add unique ID
            var elementId = 'kpi-card-' + layout.qInfo.qId;
            $element.empty().attr('id', elementId);
            
            // Create main container
            var $container = $('<div class="kpi-card-advanced-container"></div>');
            $container.css({
                'background-color': getColorValue(props.backgroundColor, '#FFFFFF'),
                'border': (props.borderWidth || 1) + 'px solid ' + getColorValue(props.borderColor, '#E0E0E0'),
                'border-radius': (props.borderRadius || 12) + 'px',
                'box-shadow': props.boxShadow || '0 2px 8px rgba(0,0,0,0.1)',
                'padding': '20px',
                'height': '100%',
                'overflow-y': 'auto',
                'overflow-x': 'hidden'
            });
            
            // Get measure values - use first row for summary display, but ensure we have the data
            var measureValues = [];
            var firstDataRow = null;
            
            if (hypercube.qDataPages && hypercube.qDataPages[0] && hypercube.qDataPages[0].qMatrix && hypercube.qDataPages[0].qMatrix.length > 0) {
                firstDataRow = hypercube.qDataPages[0].qMatrix[0];
                if (firstDataRow && firstDataRow.length > hypercube.qDimensionInfo.length) {
                    measureValues = firstDataRow.slice(hypercube.qDimensionInfo.length);
                }
            }
            
            // If no measure values found, create dummy ones to prevent errors
            if (measureValues.length === 0 && hypercube.qMeasureInfo && hypercube.qMeasureInfo.length > 0) {
                measureValues = hypercube.qMeasureInfo.map(function() {
                    return { qNum: 0, qText: '0%' };
                });
            }
            
            // Get dimension data for line charts - collect all data pages (limited)
            var dimensionData = [];
            var maxDataPoints = props.maxDataPointsForLineChart || 50;
            
            if (hypercube.qDimensionInfo.length > 0 && hypercube.qDataPages && hypercube.qDataPages.length > 0) {
                var totalDataPoints = 0;
                
                // Collect data from all pages up to the limit
                hypercube.qDataPages.forEach(function(page) {
                    if (page.qMatrix && page.qMatrix.length > 0 && totalDataPoints < maxDataPoints) {
                        page.qMatrix.forEach(function(row) {
                            if (row && row.length > hypercube.qDimensionInfo.length && totalDataPoints < maxDataPoints) {
                                dimensionData.push({
                                    dimension: row[0] ? (row[0].qText || row[0].qNum || 'Unknown') : 'Unknown',
                                    measures: row.slice(hypercube.qDimensionInfo.length)
                                });
                                totalDataPoints++;
                            }
                        });
                    }
                });
                
                // Sort by dimension if it's a date or looks like a date
                dimensionData.sort(function(a, b) {
                    // Try to parse as dates first
                    var dateA = new Date(a.dimension);
                    var dateB = new Date(b.dimension);
                    if (!isNaN(dateA.getTime()) && !isNaN(dateB.getTime())) {
                        return dateA - dateB;
                    }
                    // Fall back to string comparison
                    return a.dimension.localeCompare(b.dimension);
                });
                
                // Limit to max data points after sorting
                if (dimensionData.length > maxDataPoints) {
                    dimensionData = dimensionData.slice(0, maxDataPoints);
                }
            }
            
            // If groups are defined, render by groups
            if (measureGroups.length > 0) {
                measureGroups.forEach(function(group, groupIndex) {
                    var $group = createGroup(group, groupIndex, measureValues, hypercube, measureConfigs, props, self, layout, dimensionData);
                    if (groupIndex > 0) {
                        $group.css('margin-top', '20px');
                    }
                    $container.append($group);
                });
                
                // Render ungrouped measures
                var groupedMeasures = [];
                measureGroups.forEach(function(group) {
                    for (var i = group.startMeasure - 1; i <= group.endMeasure - 1 && i < measureValues.length; i++) {
                        groupedMeasures.push(i);
                    }
                });
                
                measureValues.forEach(function(value, index) {
                    if (groupedMeasures.indexOf(index) === -1) {
                        var $measure = createMeasure(index, value, hypercube.qMeasureInfo[index], measureConfigs, props, self, layout, dimensionData);
                        $measure.css('margin-top', props.measureSpacing + 'px');
                        $container.append($measure);
                    }
                });
            } else {
                // Render all measures without grouping
                measureValues.forEach(function(value, index) {
                    var $measure = createMeasure(index, value, hypercube.qMeasureInfo[index], measureConfigs, props, self, layout, dimensionData);
                    if (index > 0) {
                        $measure.css('margin-top', props.measureSpacing + 'px');
                    }
                    $container.append($measure);
                });
            }
            
            $element.append($container);
            
            // Apply animations after render
            setTimeout(function() {
                $container.find('.linear-gauge-fill').each(function() {
                    $(this).addClass('animated');
                });
            }, 50);
            
            return qlik.Promise.resolve();
        }
    };
    
    function createGroup(group, groupIndex, measureValues, hypercube, measureConfigs, props, self, layout, dimensionData) {
        var $group = $('<div class="measure-group"></div>');
        $group.css({
            'background-color': getColorValue(group.backgroundColor, '#F5F5F5'),
            'border': '1px solid ' + getColorValue(group.borderColor, '#E0E0E0'),
            'border-radius': '8px',
            'padding': '16px'
        });
        
        if (group.showTitle && group.title) {
            $group.append('<h3 class="group-title">' + group.title + '</h3>');
        }
        
        var $measuresContainer = $('<div class="measures-container"></div>');
        
        for (var i = group.startMeasure - 1; i <= group.endMeasure - 1 && i < measureValues.length; i++) {
            if (measureValues[i] !== undefined) {
                var $measure = createMeasure(i, measureValues[i], hypercube.qMeasureInfo[i], measureConfigs, props, self, layout, dimensionData);
                if (i > group.startMeasure - 1) {
                    $measure.css('margin-top', props.measureSpacing + 'px');
                }
                $measuresContainer.append($measure);
            }
        }
        
        $group.append($measuresContainer);
        return $group;
    }
    
    function createMeasure(measureIndex, measureData, measureInfo, measureConfigs, props, self, layout, dimensionData) {
        var $measure = $('<div class="measure-item"></div>');
        $measure.attr('data-measure-index', measureIndex);
        
        // Find specific config for this measure
        var config = measureConfigs.find(function(c) { return c.measureIndex === measureIndex; }) || {};
        
        var value = measureData.qNum;
        var formattedValue = measureData.qText;
        
        // Create container based on title position
        var $container = props.titlePosition === 'top' ? 
            $('<div class="measure-vertical"></div>') : 
            $('<div class="measure-horizontal"></div>');
        
        // Create title section with optional icon
        var title = config.title || measureInfo.qFallbackTitle;
        var $titleSection = null;
        
        if (title || (config.showIcon && config.iconType)) {
            $titleSection = createTitleWithIcon(title, config, props);
            
            if (props.titlePosition === 'top') {
                $container.append($titleSection);
            }
        }
        
        // Create gauge section
        var $gaugeSection = $('<div class="gauge-section"></div>');
        
        // Create linear gauge
        var $gaugeContainer = $('<div class="linear-gauge-container"></div>');
        var percentage = Math.min(Math.max(value * 100, 0), 100);
        
        var gaugeColor = getColorValue(config.gaugeColor, null) || getColorValue(props.defaultGaugeColor, '#007A78');
        var gaugeBackgroundColor = getColorValue(props.defaultGaugeBackgroundColor, '#F0F0F0');
        var $gauge = createLinearGauge(percentage, gaugeColor, gaugeBackgroundColor, props.gaugeHeight || 8, props.animationDuration || 500);
        $gaugeContainer.append($gauge);
        
        if (config.showDataLabel !== false) {
            var format = config.dataLabelFormat || '0%';
            var $label = $('<span class="gauge-value">' + formatValue(value, format, formattedValue) + '</span>');
            $gaugeContainer.append($label);
        }
        
        $gaugeSection.append($gaugeContainer);
        
        // Add comparison indicator
        if (config.showComparison !== false && config.comparisonValue !== undefined) {
            var $comparison = createComparisonIndicator(config);
            $gaugeSection.append($comparison);
        }
        
        // Add components to container based on layout
        if (props.titlePosition === 'left' && $titleSection) {
            $container.append($titleSection);
        }
        $container.append($gaugeSection);
        
        $measure.append($container);
        
        // Add line chart expansion functionality
        if (props.enableLineCharts && dimensionData.length > 0) {
            $measure.addClass('expandable');
            var $chartContainer = $('<div class="line-chart-container" style="display: none;"></div>');
            $chartContainer.css('height', props.lineChartHeight + 'px');
            $measure.append($chartContainer);
            
            var isExpanded = false;
            $container.on('click', function(e) {
                e.stopPropagation();
                isExpanded = !isExpanded;
                
                if (isExpanded) {
                    $measure.addClass('expanded');
                    
                    // Modern smooth animation
                    $chartContainer.css({
                        'opacity': '0',
                        'transform': 'translateY(-10px)',
                        'display': 'block'
                    }).animate({
                        'opacity': '1'
                    }, {
                        duration: 200,
                        easing: 'swing',
                        step: function(now) {
                            $(this).css('transform', 'translateY(' + (-10 + (10 * now)) + 'px)');
                        }
                    });
                    
                    if ($chartContainer.children().length === 0) {
                        setTimeout(function() {
                            createLineChart($chartContainer, dimensionData, measureIndex, config, props);
                        }, 50);
                    }
                } else {
                    $measure.removeClass('expanded');
                    
                    // Smooth collapse animation
                    $chartContainer.animate({
                        'opacity': '0'
                    }, {
                        duration: 150,
                        easing: 'swing',
                        step: function(now) {
                            $(this).css('transform', 'translateY(' + (-10 * (1 - now)) + 'px)');
                        },
                        complete: function() {
                            $(this).hide();
                        }
                    });
                }
            });
        }
        
        return $measure;
    }
    
    function createLinearGauge(percentage, color, backgroundColor, height, animationDuration) {
        var $gauge = $('<div class="linear-gauge"></div>');
        $gauge.css({
            'background-color': backgroundColor,
            'height': height + 'px'
        });
        
        var $fill = $('<div class="linear-gauge-fill"></div>');
        $fill.css({
            'background-color': color,
            'width': '0%',
            'height': '100%',
            'transition': 'width ' + animationDuration + 'ms cubic-bezier(0.4, 0, 0.2, 1)'
        });
        
        // Set width after a small delay to trigger animation
        setTimeout(function() {
            $fill.css('width', percentage + '%');
        }, 10);
        
        $gauge.append($fill);
        return $gauge;
    }
    
    function createComparisonIndicator(config) {
        var isPositive = config.comparisonValue >= 0;
        var positiveColor = getColorValue(config.positiveColor, '#52C41A');
        var negativeColor = getColorValue(config.negativeColor, '#FF4D4F');
        var color = isPositive ? positiveColor : negativeColor;
        var icon = isPositive ? '▲' : '▼';
        
        var $indicator = $('<div class="comparison-indicator"></div>');
        $indicator.css('background-color', color);
        $indicator.html(icon + ' ' + Math.abs(config.comparisonValue) + '%');
        
        return $indicator;
    }
    
    function createTitleWithIcon(title, config, props) {
        var showIcon = config.showIcon && config.iconType;
        var iconPosition = config.iconPosition || 'before';
        var iconSize = config.iconSize || 16;
        var iconColor = getColorValue(config.iconColor, '#666666');
        
        if (iconPosition === 'above' && showIcon) {
            // Large icon above title layout
            var $titleContainer = $('<div class="title-with-icon-above"></div>');
            
            if (showIcon) {
                var $icon = $('<span class="measure-icon-large"></span>');
                $icon.addClass(config.iconType);
                $icon.css({
                    'color': iconColor,
                    'font-size': Math.max(iconSize * 1.5, 24) + 'px',
                    'display': 'block',
                    'text-align': 'center',
                    'margin-bottom': '8px'
                });
                $titleContainer.append($icon);
            }
            
            if (title) {
                var $title = $('<span class="measure-title"></span>');
                $title.text(title);
                $title.css({
                    'color': getColorValue(props.titleColor, '#666666'),
                    'font-size': (props.titleFontSize || 14) + 'px',
                    'font-weight': props.titleFontWeight || '500',
                    'display': 'block',
                    'text-align': 'center'
                });
                $titleContainer.append($title);
            }
            
            return $titleContainer;
        } else {
            // Icon before title layout (or title only)
            var $titleContainer = $('<div class="title-with-icon-before"></div>');
            
            if (showIcon) {
                var $icon = $('<span class="measure-icon"></span>');
                $icon.addClass(config.iconType);
                $icon.css({
                    'color': iconColor,
                    'font-size': iconSize + 'px',
                    'margin-right': '8px',
                    'vertical-align': 'middle'
                });
                $titleContainer.append($icon);
            }
            
            if (title) {
                var $title = $('<span class="measure-title"></span>');
                $title.text(title);
                $title.css({
                    'color': getColorValue(props.titleColor, '#666666'),
                    'font-size': (props.titleFontSize || 14) + 'px',
                    'font-weight': props.titleFontWeight || '500',
                    'vertical-align': 'middle'
                });
                $titleContainer.append($title);
            }
            
            return $titleContainer;
        }
    }
    
    function createLineChart($container, dimensionData, measureIndex, config, props) {
        // Clear any existing charts
        $container.empty();
        
        var $chart = $('<div class="line-chart"></div>');
        
        // Ensure container has proper dimensions
        var containerWidth = $container.width();
        if (containerWidth < 200) {
            containerWidth = $container.parent().width() - 40;
        }
        
        var width = Math.max(containerWidth, 300);
        var height = Math.max(props.lineChartHeight || 200, 150);
        var margin = { top: 20, right: 30, bottom: 40, left: 60 };
        var chartWidth = width - margin.left - margin.right;
        var chartHeight = height - margin.top - margin.bottom;
        
        // Validate and extract data for this measure
        if (!dimensionData || dimensionData.length === 0) {
            $chart.html('<div style="padding: 20px; text-align: center; color: #666;">No dimension data available.<br/>Add a dimension to enable line charts.</div>');
            $container.append($chart);
            return;
        }
        
        // Debug log for development
        if (window.console && console.log) {
            console.log('Line chart data for measure ' + measureIndex + ':', {
                dimensionDataLength: dimensionData.length,
                sampleData: dimensionData.slice(0, 3),
                measureIndex: measureIndex
            });
        }
        
        var dataPoints = [];
        dimensionData.forEach(function(d, index) {
            if (d.measures && d.measures[measureIndex]) {
                var measureData = d.measures[measureIndex];
                var value = null;
                
                // Try to get numeric value in various ways
                if (typeof measureData.qNum === 'number' && !isNaN(measureData.qNum)) {
                    value = measureData.qNum;
                } else if (typeof measureData === 'number' && !isNaN(measureData)) {
                    value = measureData;
                } else if (measureData.qText && !isNaN(parseFloat(measureData.qText))) {
                    value = parseFloat(measureData.qText);
                }
                
                if (value !== null) {
                    dataPoints.push({
                        dimension: d.dimension || 'Point ' + (index + 1),
                        value: value,
                        text: measureData.qText || value.toString(),
                        rawData: measureData // Keep the original data for formatting
                    });
                }
            }
        });
        
        // Debug log the extracted data points
        if (window.console && console.log) {
            console.log('Extracted data points:', dataPoints);
        }
        
        if (dataPoints.length === 0) {
            $chart.html('<div style="padding: 20px; text-align: center; color: #666;">No valid data points found for measure ' + (measureIndex + 1) + '</div>');
            $container.append($chart);
            return;
        } else if (dataPoints.length === 1) {
            // Create a simple indicator for single data point
            $chart.html('<div style="padding: 20px; text-align: center; color: #666;">Single data point: <strong>' + dataPoints[0].dimension + '</strong><br/>' + dataPoints[0].text + '</div>');
            $container.append($chart);
            return;
        }
        
        // Calculate value range with proper scaling
        var values = dataPoints.map(function(d) { return d.value; });
        var maxValue = Math.max.apply(null, values);
        var minValue = Math.min.apply(null, values);
        var range = maxValue - minValue;
        
        // Handle edge case where all values are the same
        if (range === 0) {
            minValue = minValue - Math.abs(minValue * 0.1) - 0.1;
            maxValue = maxValue + Math.abs(maxValue * 0.1) + 0.1;
            range = maxValue - minValue;
        } else {
            // Add 10% padding to range
            var padding = range * 0.1;
            minValue = minValue - padding;
            maxValue = maxValue + padding;
        }
        
        // Create SVG with proper namespace
        var svg = '<svg width="' + width + '" height="' + height + '" xmlns="http://www.w3.org/2000/svg" style="display: block;">';
        
        // Create gradient
        var lineColor = getColorValue(props.lineColor, '#007A78');
        var gradientId = 'gradient-' + measureIndex + '-' + Date.now();
        svg += '<defs><linearGradient id="' + gradientId + '" x1="0%" y1="0%" x2="0%" y2="100%">';
        svg += '<stop offset="0%" style="stop-color:' + lineColor + ';stop-opacity:0.3" />';
        svg += '<stop offset="100%" style="stop-color:' + lineColor + ';stop-opacity:0.1" />';
        svg += '</linearGradient></defs>';
        
        // Create chart background
        svg += '<rect x="' + margin.left + '" y="' + margin.top + '" width="' + chartWidth + '" height="' + chartHeight + '" fill="none" stroke="none" />';
        
        // Create grid lines (only if enabled)
        if (props.showGrid) {
            for (var i = 1; i < 5; i++) {
                var y = margin.top + (i / 5) * chartHeight;
                svg += '<line x1="' + margin.left + '" y1="' + y + '" x2="' + (margin.left + chartWidth) + '" y2="' + y + '" stroke="#f5f5f5" stroke-width="1" opacity="0.5" />';
            }
        }
        
        // Create axes (only if enabled)
        var axisColor = getColorValue(props.axisColor, '#DDDDDD');
        if (props.showYAxis) {
            svg += '<line x1="' + margin.left + '" y1="' + margin.top + '" x2="' + margin.left + '" y2="' + (margin.top + chartHeight) + '" stroke="' + axisColor + '" stroke-width="1" />';
        }
        if (props.showXAxis) {
            svg += '<line x1="' + margin.left + '" y1="' + (margin.top + chartHeight) + '" x2="' + (margin.left + chartWidth) + '" y2="' + (margin.top + chartHeight) + '" stroke="' + axisColor + '" stroke-width="1" />';
        }
        
        // Calculate points and create paths
        var pathData = '';
        var areaData = '';
        var points = [];
        
        dataPoints.forEach(function(point, index) {
            var x = margin.left + (index / (dataPoints.length - 1)) * chartWidth;
            var normalizedValue = (point.value - minValue) / (maxValue - minValue);
            var y = margin.top + (1 - normalizedValue) * chartHeight;
            
            // Ensure y is within bounds
            y = Math.max(margin.top, Math.min(margin.top + chartHeight, y));
            
            points.push({ x: x, y: y, data: point });
        });
        
        // Create smooth or straight path
        if (props.lineStyle === 'smooth' && points.length > 2) {
            pathData = createSmoothPath(points);
            areaData = createSmoothAreaPath(points, margin.top + chartHeight);
        } else {
            // Straight lines
            points.forEach(function(point, index) {
                if (index === 0) {
                    pathData = 'M' + point.x + ',' + point.y;
                    areaData = 'M' + point.x + ',' + (margin.top + chartHeight) + ' L' + point.x + ',' + point.y;
                } else {
                    pathData += ' L' + point.x + ',' + point.y;
                    areaData += ' L' + point.x + ',' + point.y;
                }
            });
            
            // Close area path
            if (points.length > 0) {
                var lastPoint = points[points.length - 1];
                areaData += ' L' + lastPoint.x + ',' + (margin.top + chartHeight) + ' Z';
            }
        }
        
        // Add area fill (based on chart type)
        if ((props.chartType === 'area' || props.chartType === 'line-area') && areaData) {
            svg += '<path d="' + areaData + '" fill="url(#' + gradientId + ')" />';
        }
        
        // Add line path (based on chart type)
        if ((props.chartType === 'line' || props.chartType === 'line-area') && pathData) {
            svg += '<path d="' + pathData + '" fill="none" stroke="' + lineColor + '" stroke-width="' + (props.lineWidth || 3) + '" stroke-linecap="round" stroke-linejoin="round" />';
        }
        
        // Add data points if enabled
        if (props.showDataPoints !== false) {
            var pointSize = props.dataPointSize || 5;
            points.forEach(function(point, index) {
                // Use the original qText if available, otherwise format the value
                var displayValue = point.data.rawData && point.data.rawData.qText ? 
                    point.data.rawData.qText : 
                    formatValue(point.data.value, config.dataLabelFormat || '0.0%');
                
                svg += '<circle cx="' + point.x + '" cy="' + point.y + '" r="' + pointSize + '" fill="white" stroke="' + lineColor + '" stroke-width="2" class="chart-dot" ' +
                       'data-dimension="' + point.data.dimension + '" ' +
                       'data-value="' + displayValue + '" ' +
                       'style="cursor: pointer;" />';
            });
        }
        
        // Add Y-axis labels (only if Y-axis is enabled)
        if (props.showYAxis) {
            for (var i = 0; i <= 4; i++) {
                var labelValue = minValue + (maxValue - minValue) * (1 - i / 4);
                var labelY = margin.top + (i / 4) * chartHeight;
                var labelText = formatValue(labelValue, config.dataLabelFormat || '0.0%');
                svg += '<text x="' + (margin.left - 10) + '" y="' + (labelY + 4) + '" text-anchor="end" font-size="11" fill="#666">' + labelText + '</text>';
            }
        }
        
        // Add X-axis labels (only if X-axis is enabled)
        if (props.showXAxis && dataPoints.length > 0) {
            var labelIndices = [0];
            if (dataPoints.length > 2) {
                labelIndices.push(Math.floor(dataPoints.length / 2));
            }
            if (dataPoints.length > 1) {
                labelIndices.push(dataPoints.length - 1);
            }
            
            labelIndices.forEach(function(index) {
                var point = points[index];
                if (point) {
                    var labelText = point.data.dimension;
                    if (labelText.length > 8) {
                        labelText = labelText.substring(0, 8) + '...';
                    }
                    svg += '<text x="' + point.x + '" y="' + (margin.top + chartHeight + 20) + '" text-anchor="middle" font-size="11" fill="#666">' + labelText + '</text>';
                }
            });
        }
        
        svg += '</svg>';
        
        $chart.html(svg);
        
        // Add modern hover tooltips
        setTimeout(function() {
            $chart.find('.chart-dot').on('mouseenter', function(e) {
                var $dot = $(this);
                var dimension = $dot.attr('data-dimension');
                var value = $dot.attr('data-value');
                
                // Remove any existing tooltips
                $('.chart-tooltip').remove();
                
                var $tooltip = $('<div class="chart-tooltip modern-tooltip"></div>');
                $tooltip.html('<div class="tooltip-title">' + dimension + '</div><div class="tooltip-value">' + value + '</div>');
                
                var bgColor = getColorValue(props.tooltipBackgroundColor, '#2D3748');
                var textColor = getColorValue(props.tooltipTextColor, '#FFFFFF');
                var borderRadius = (props.tooltipBorderRadius !== undefined ? props.tooltipBorderRadius : 8);
                var shadow = (props.tooltipShadow !== false) ? '0 8px 25px rgba(0, 0, 0, 0.15), 0 3px 10px rgba(0, 0, 0, 0.1)' : 'none';
                
                $tooltip.css({
                    position: 'absolute',
                    background: bgColor,
                    color: textColor,
                    padding: '12px 16px',
                    borderRadius: borderRadius + 'px',
                    fontSize: '13px',
                    fontWeight: '500',
                    pointerEvents: 'none',
                    zIndex: 1000,
                    boxShadow: shadow,
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    minWidth: '120px'
                });
                
                $('body').append($tooltip);
                
                var dotOffset = $dot.get(0).getBoundingClientRect();
                var tooltipWidth = $tooltip.outerWidth();
                var tooltipHeight = $tooltip.outerHeight();
                
                $tooltip.css({
                    top: dotOffset.top + window.scrollY - tooltipHeight - 15,
                    left: dotOffset.left + window.scrollX - tooltipWidth / 2
                });
                
                // Scale up the dot
                var originalSize = props.dataPointSize || 5;
                $dot.attr('r', originalSize + 2);
                
            }).on('mouseleave', function() {
                var originalSize = props.dataPointSize || 5;
                $(this).attr('r', originalSize);
                $('.chart-tooltip').remove();
            });
        }, 100);
        
        $container.append($chart);
    }
    
    // Helper function to extract color value from Qlik color objects
    function getColorValue(colorProp, defaultColor) {
        if (!colorProp) {
            return defaultColor;
        }
        
        // If it's already a valid color string, return it
        if (typeof colorProp === 'string' && colorProp.length > 0) {
            // Handle "none" or "transparent" values
            if (colorProp.toLowerCase() === 'none' || colorProp.toLowerCase() === 'transparent') {
                return defaultColor;
            }
            return colorProp;
        }
        
        // If it's an object with a color property (Qlik color object)
        if (typeof colorProp === 'object' && colorProp !== null) {
            // Check for direct color property
            if (colorProp.color && typeof colorProp.color === 'string') {
                return colorProp.color;
            }
            // Check for value property
            if (colorProp.value && typeof colorProp.value === 'string') {
                return colorProp.value;
            }
            // Check for index (palette color)
            if (typeof colorProp.index === 'number') {
                // Qlik palette colors - return default for now
                return defaultColor;
            }
            // Check for expression-based colors
            if (colorProp.qAttributeExpressions && colorProp.qAttributeExpressions.length > 0) {
                var expr = colorProp.qAttributeExpressions[0];
                if (expr && expr.qExpression && typeof expr.qExpression === 'string') {
                    return expr.qExpression;
                }
            }
            
            // Debug log to see what we're getting
            if (window.console && console.log) {
                console.log('Unhandled color property structure:', JSON.stringify(colorProp));
            }
        }
        
        return defaultColor;
    }
    
    function createSmoothPath(points) {
        if (points.length < 3) {
            return points.map(function(p, i) {
                return (i === 0 ? 'M' : 'L') + p.x + ',' + p.y;
            }).join(' ');
        }
        
        var path = 'M' + points[0].x + ',' + points[0].y;
        
        for (var i = 1; i < points.length; i++) {
            var prev = points[i - 1];
            var curr = points[i];
            var next = points[i + 1];
            
            if (i === 1) {
                // First curve
                var cp1x = prev.x + (curr.x - prev.x) * 0.3;
                var cp1y = prev.y;
                var cp2x = curr.x - (next ? (next.x - prev.x) * 0.15 : (curr.x - prev.x) * 0.3);
                var cp2y = curr.y;
                path += ' C' + cp1x + ',' + cp1y + ' ' + cp2x + ',' + cp2y + ' ' + curr.x + ',' + curr.y;
            } else if (i === points.length - 1) {
                // Last curve
                var cp1x = prev.x + (curr.x - points[i - 2].x) * 0.15;
                var cp1y = prev.y;
                var cp2x = curr.x - (curr.x - prev.x) * 0.3;
                var cp2y = curr.y;
                path += ' C' + cp1x + ',' + cp1y + ' ' + cp2x + ',' + cp2y + ' ' + curr.x + ',' + curr.y;
            } else {
                // Middle curves
                var cp1x = prev.x + (curr.x - points[i - 2].x) * 0.15;
                var cp1y = prev.y;
                var cp2x = curr.x - (next.x - prev.x) * 0.15;
                var cp2y = curr.y;
                path += ' C' + cp1x + ',' + cp1y + ' ' + cp2x + ',' + cp2y + ' ' + curr.x + ',' + curr.y;
            }
        }
        
        return path;
    }
    
    function createSmoothAreaPath(points, bottomY) {
        var linePath = createSmoothPath(points);
        var lastPoint = points[points.length - 1];
        var firstPoint = points[0];
        
        return 'M' + firstPoint.x + ',' + bottomY + ' L' + firstPoint.x + ',' + firstPoint.y + ' ' + 
               linePath.substring(linePath.indexOf(' ') + 1) + // Remove the initial M
               ' L' + lastPoint.x + ',' + bottomY + ' Z';
    }
    
    function createSVG(width, height) {
        return '<svg width="' + width + '" height="' + height + '" xmlns="http://www.w3.org/2000/svg">';
    }
    
    function createAxes(margin, width, height) {
        var axes = '';
        
        // X-axis
        axes += '<line x1="' + margin.left + '" y1="' + (margin.top + height) + '" ' +
                'x2="' + (margin.left + width) + '" y2="' + (margin.top + height) + '" ' +
                'stroke="#E0E0E0" stroke-width="1" />';
        
        // Y-axis
        axes += '<line x1="' + margin.left + '" y1="' + margin.top + '" ' +
                'x2="' + margin.left + '" y2="' + (margin.top + height) + '" ' +
                'stroke="#E0E0E0" stroke-width="1" />';
        
        return axes;
    }
    
    function formatValue(value, format, fallback) {
        try {
            if (format === '0%') {
                return Math.round(value * 100) + '%';
            } else if (format === '0.0%') {
                return (value * 100).toFixed(1) + '%';
            } else if (format === '0.00%') {
                return (value * 100).toFixed(2) + '%';
            } else if (format === '#,##0') {
                return value.toLocaleString('en-US', { maximumFractionDigits: 0 });
            } else if (format === '#,##0.0') {
                return value.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
            }
        } catch (e) {
            // Fall through to fallback
        }
        return fallback || value.toString();
    }
});