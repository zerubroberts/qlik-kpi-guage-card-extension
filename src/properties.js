define([], function() {
    "use strict";

    var appearanceSection = {
        uses: "settings",
        items: {
            general: {
                label: "General Settings",
                type: "items",
                items: {
                    backgroundColor: {
                        ref: "props.backgroundColor",
                        label: "Background Color",
                        type: "string",
                        component: "color-picker",
                        defaultValue: "#FFFFFF"
                    },
                    borderColor: {
                        ref: "props.borderColor",
                        label: "Border Color",
                        type: "string",
                        component: "color-picker",
                        defaultValue: "#E0E0E0"
                    },
                    borderWidth: {
                        ref: "props.borderWidth",
                        label: "Border Width",
                        type: "number",
                        component: "slider",
                        min: 0,
                        max: 10,
                        step: 1,
                        defaultValue: 1
                    },
                    borderRadius: {
                        ref: "props.borderRadius",
                        label: "Border Radius",
                        type: "number",
                        component: "slider",
                        min: 0,
                        max: 30,
                        step: 1,
                        defaultValue: 12
                    },
                    boxShadow: {
                        ref: "props.boxShadow",
                        label: "Box Shadow",
                        type: "string",
                        component: "dropdown",
                        options: [{
                            value: "none",
                            label: "None"
                        }, {
                            value: "0 1px 3px rgba(0,0,0,0.1)",
                            label: "Light"
                        }, {
                            value: "0 2px 8px rgba(0,0,0,0.1)",
                            label: "Medium"
                        }, {
                            value: "0 4px 16px rgba(0,0,0,0.15)",
                            label: "Heavy"
                        }],
                        defaultValue: "0 2px 8px rgba(0,0,0,0.1)"
                    },
                    measureSpacing: {
                        ref: "props.measureSpacing",
                        label: "Spacing Between Measures",
                        type: "number",
                        component: "slider",
                        min: 0,
                        max: 50,
                        step: 2,
                        defaultValue: 16
                    }
                }
            }
        }
    };

    var gaugeStyleSection = {
        label: "Gauge Styling",
        type: "items",
        items: {
            gaugeHeight: {
                ref: "props.gaugeHeight",
                label: "Gauge Line Height",
                type: "number",
                component: "slider",
                min: 4,
                max: 20,
                step: 2,
                defaultValue: 8
            },
            gaugeColor: {
                ref: "props.defaultGaugeColor",
                label: "Default Gauge Color",
                type: "string",
                component: "color-picker",
                defaultValue: "#007A78"
            },
            gaugeBackgroundColor: {
                ref: "props.defaultGaugeBackgroundColor",
                label: "Gauge Background Color",
                type: "string",
                component: "color-picker",
                defaultValue: "#F0F0F0"
            },
            animationDuration: {
                ref: "props.animationDuration",
                label: "Animation Duration (ms)",
                type: "number",
                component: "slider",
                min: 0,
                max: 2000,
                step: 100,
                defaultValue: 500
            }
        }
    };

    var titleStyleSection = {
        label: "Title Styling",
        type: "items",
        items: {
            titlePosition: {
                ref: "props.titlePosition",
                label: "Title Position",
                type: "string",
                component: "dropdown",
                options: [{
                    value: "left",
                    label: "Left of Gauge"
                }, {
                    value: "top",
                    label: "Above Gauge"
                }],
                defaultValue: "left"
            },
            titleColor: {
                ref: "props.titleColor",
                label: "Title Color",
                type: "string",
                component: "color-picker",
                defaultValue: "#666666"
            },
            titleFontSize: {
                ref: "props.titleFontSize",
                label: "Title Font Size",
                type: "number",
                component: "slider",
                min: 10,
                max: 24,
                step: 1,
                defaultValue: 14
            },
            titleFontWeight: {
                ref: "props.titleFontWeight",
                label: "Title Font Weight",
                type: "string",
                component: "dropdown",
                options: [{
                    value: "300",
                    label: "Light"
                }, {
                    value: "400",
                    label: "Normal"
                }, {
                    value: "500",
                    label: "Medium"
                }, {
                    value: "600",
                    label: "Bold"
                }],
                defaultValue: "500"
            }
        }
    };

    var groupingSection = {
        type: "items",
        component: "expandable-items",
        label: "Measure Groups",
        items: {
            groups: {
                type: "array",
                ref: "props.measureGroups",
                label: "Groups",
                itemTitleRef: function(data, index) {
                    return data.title || "Group " + (index + 1);
                },
                allowAdd: true,
                allowRemove: true,
                addTranslation: "Add Group",
                items: {
                    title: {
                        type: "string",
                        ref: "title",
                        label: "Group Title",
                        expression: "optional",
                        defaultValue: ""
                    },
                    startMeasure: {
                        type: "integer",
                        ref: "startMeasure",
                        label: "Start Measure Index (1-based)",
                        component: "slider",
                        min: 1,
                        max: 10,
                        step: 1,
                        defaultValue: 1
                    },
                    endMeasure: {
                        type: "integer",
                        ref: "endMeasure",
                        label: "End Measure Index (1-based)",
                        component: "slider",
                        min: 1,
                        max: 10,
                        step: 1,
                        defaultValue: 3
                    },
                    backgroundColor: {
                        type: "string",
                        ref: "backgroundColor",
                        label: "Group Background Color",
                        component: "color-picker",
                        defaultValue: "#F5F5F5"
                    },
                    borderColor: {
                        type: "string",
                        ref: "borderColor",
                        label: "Group Border Color",
                        component: "color-picker",
                        defaultValue: "#E0E0E0"
                    },
                    showTitle: {
                        type: "boolean",
                        ref: "showTitle",
                        label: "Show Group Title",
                        defaultValue: true
                    }
                }
            }
        }
    };

    var measuresSection = {
        type: "items",
        component: "expandable-items",
        label: "Individual Measure Settings",
        items: {
            measuresList: {
                type: "array",
                ref: "props.measureConfigs",
                label: "Measure Overrides",
                itemTitleRef: function(data, index) {
                    return data.title || "Measure " + (data.measureIndex + 1);
                },
                allowAdd: true,
                allowRemove: true,
                addTranslation: "Add Measure Configuration",
                items: {
                    measureIndex: {
                        type: "integer",
                        ref: "measureIndex",
                        label: "Measure Index (0-based)",
                        component: "slider",
                        min: 0,
                        max: 9,
                        step: 1,
                        defaultValue: 0
                    },
                    title: {
                        type: "string",
                        ref: "title",
                        label: "Title Override",
                        expression: "optional",
                        defaultValue: ""
                    },
                    showDataLabel: {
                        type: "boolean",
                        ref: "showDataLabel",
                        label: "Show Data Label",
                        defaultValue: true
                    },
                    dataLabelFormat: {
                        type: "string",
                        ref: "dataLabelFormat",
                        label: "Data Label Format",
                        component: "dropdown",
                        options: [{
                            value: "0%",
                            label: "0%"
                        }, {
                            value: "0.0%",
                            label: "0.0%"
                        }, {
                            value: "0.00%",
                            label: "0.00%"
                        }, {
                            value: "#,##0",
                            label: "#,##0"
                        }, {
                            value: "#,##0.0",
                            label: "#,##0.0"
                        }],
                        defaultValue: "0%",
                        show: function(data) {
                            return data.showDataLabel;
                        }
                    },
                    gaugeColor: {
                        type: "string",
                        ref: "gaugeColor",
                        label: "Gauge Color Override",
                        component: "color-picker",
                        defaultValue: ""
                    },
                    comparison: {
                        type: "items",
                        label: "Comparison Indicator",
                        items: {
                            showComparison: {
                                type: "boolean",
                                ref: "showComparison",
                                label: "Show Comparison",
                                defaultValue: true
                            },
                            comparisonValue: {
                                type: "number",
                                ref: "comparisonValue",
                                label: "Comparison Value (%)",
                                expression: "optional",
                                defaultValue: 0,
                                show: function(data) {
                                    return data.showComparison;
                                }
                            },
                            positiveColor: {
                                type: "string",
                                ref: "positiveColor",
                                label: "Positive Color",
                                component: "color-picker",
                                defaultValue: "#52C41A",
                                show: function(data) {
                                    return data.showComparison;
                                }
                            },
                            negativeColor: {
                                type: "string",
                                ref: "negativeColor",
                                label: "Negative Color",
                                component: "color-picker",
                                defaultValue: "#FF4D4F",
                                show: function(data) {
                                    return data.showComparison;
                                }
                            }
                        }
                    }
                }
            }
        }
    };

    var lineChartSection = {
        label: "Line Chart Settings",
        type: "items",
        items: {
            enableLineCharts: {
                type: "boolean",
                ref: "props.enableLineCharts",
                label: "Enable Expandable Line Charts",
                defaultValue: true
            },
            lineChartHeight: {
                type: "number",
                ref: "props.lineChartHeight",
                label: "Chart Height",
                component: "slider",
                min: 100,
                max: 500,
                step: 20,
                defaultValue: 200,
                show: function(data) {
                    return data.props && data.props.enableLineCharts;
                }
            },
            chartType: {
                type: "string",
                ref: "props.chartType",
                label: "Chart Type",
                component: "dropdown",
                options: [{
                    value: "line",
                    label: "Line Only"
                }, {
                    value: "area",
                    label: "Area Chart"
                }, {
                    value: "line-area",
                    label: "Line + Area"
                }],
                defaultValue: "line",
                show: function(data) {
                    return data.props && data.props.enableLineCharts;
                }
            },
            lineColor: {
                type: "string",
                ref: "props.lineColor",
                label: "Line Color",
                component: "color-picker",
                defaultValue: "#007A78",
                show: function(data) {
                    return data.props && data.props.enableLineCharts;
                }
            },
            lineWidth: {
                type: "number",
                ref: "props.lineWidth",
                label: "Line Width",
                component: "slider",
                min: 1,
                max: 8,
                step: 1,
                defaultValue: 3,
                show: function(data) {
                    return data.props && data.props.enableLineCharts;
                }
            },
            lineStyle: {
                type: "string",
                ref: "props.lineStyle",
                label: "Line Style",
                component: "dropdown",
                options: [{
                    value: "straight",
                    label: "Straight Lines"
                }, {
                    value: "smooth",
                    label: "Smooth Curves"
                }],
                defaultValue: "smooth",
                show: function(data) {
                    return data.props && data.props.enableLineCharts;
                }
            },
            showDataPoints: {
                type: "boolean",
                ref: "props.showDataPoints",
                label: "Show Data Points",
                defaultValue: true,
                show: function(data) {
                    return data.props && data.props.enableLineCharts;
                }
            },
            dataPointSize: {
                type: "number",
                ref: "props.dataPointSize",
                label: "Data Point Size",
                component: "slider",
                min: 2,
                max: 10,
                step: 1,
                defaultValue: 5,
                show: function(data) {
                    return data.props && data.props.enableLineCharts && data.props.showDataPoints;
                }
            },
            showGrid: {
                type: "boolean",
                ref: "props.showGrid",
                label: "Show Grid Lines",
                defaultValue: false,
                show: function(data) {
                    return data.props && data.props.enableLineCharts;
                }
            },
            showXAxis: {
                type: "boolean",
                ref: "props.showXAxis",
                label: "Show X-Axis",
                defaultValue: true,
                show: function(data) {
                    return data.props && data.props.enableLineCharts;
                }
            },
            showYAxis: {
                type: "boolean",
                ref: "props.showYAxis",
                label: "Show Y-Axis",
                defaultValue: true,
                show: function(data) {
                    return data.props && data.props.enableLineCharts;
                }
            },
            axisColor: {
                type: "string",
                ref: "props.axisColor",
                label: "Axis Color",
                component: "color-picker",
                defaultValue: "#DDDDDD",
                show: function(data) {
                    return data.props && data.props.enableLineCharts && (data.props.showXAxis || data.props.showYAxis);
                }
            },
            tooltipStyle: {
                type: "items",
                label: "Tooltip Styling",
                show: function(data) {
                    return data.props && data.props.enableLineCharts;
                },
                items: {
                    tooltipBackgroundColor: {
                        type: "string",
                        ref: "props.tooltipBackgroundColor",
                        label: "Tooltip Background",
                        component: "color-picker",
                        defaultValue: "#2D3748"
                    },
                    tooltipTextColor: {
                        type: "string",
                        ref: "props.tooltipTextColor",
                        label: "Tooltip Text Color",
                        component: "color-picker",
                        defaultValue: "#FFFFFF"
                    },
                    tooltipBorderRadius: {
                        type: "number",
                        ref: "props.tooltipBorderRadius",
                        label: "Tooltip Border Radius",
                        component: "slider",
                        min: 0,
                        max: 20,
                        step: 2,
                        defaultValue: 8
                    },
                    tooltipShadow: {
                        type: "boolean",
                        ref: "props.tooltipShadow",
                        label: "Tooltip Shadow",
                        defaultValue: true
                    }
                }
            },
            dataLimits: {
                type: "items",
                label: "Data Limits",
                show: function(data) {
                    return data.props && data.props.enableLineCharts;
                },
                items: {
                    maxDataPointsForLineChart: {
                        type: "number",
                        ref: "props.maxDataPointsForLineChart",
                        label: "Max Data Points for Line Chart",
                        component: "slider",
                        min: 10,
                        max: 200,
                        step: 10,
                        defaultValue: 50
                    }
                }
            }
        }
    };

    return {
        type: "items",
        component: "accordion",
        items: {
            dimensions: {
                uses: "dimensions",
                min: 0,
                max: 1
            },
            measures: {
                uses: "measures",
                min: 1,
                max: 10
            },
            appearance: appearanceSection,
            gaugeStyle: gaugeStyleSection,
            titleStyle: titleStyleSection,
            grouping: groupingSection,
            measuresConfig: measuresSection,
            lineChart: lineChartSection,
            settings: {
                uses: "settings"
            }
        }
    };
});