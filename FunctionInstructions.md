# Page Builder Library Reference

## High-Level Report Builder

Use `pageBuilder.buildDemographicsReport()` to create complete reports with a single function call:

```javascript
const reportData = {
    title: "Demographics Analysis Report",
    subtitle: "Member insights and recommendations", 
    executiveSummary: "HTML content with <span class='metric-highlight'>highlighted metrics</span>",
    sections: [
        {
            title: "Section Title",
            subtitle: "Optional section subtitle",
            charts: [
                {
                    type: 'multiSeries', // Chart type
                    title: 'Chart Title',
                    labels: ['Category A', 'Category B', 'Category C'],
                    datasets: [
                        {label: 'Series 1', data: [10, 20, 30]},
                        {label: 'Series 2', data: [15, 25, 35]}
                    ],
                    yAxisTitle: 'Y-axis Label'
                }
            ],
            content: [
                {
                    type: 'finding',
                    text: 'Key finding with <span class="metric-highlight">42%</span> metric'
                },
                {
                    type: 'recommendation', 
                    priority: 'High Priority',
                    text: 'Action item or recommendation'
                },
                {
                    type: 'text',
                    text: 'Regular paragraph content'
                }
            ]
        }
    ]
};

await pageBuilder.buildDemographicsReport(reportData);
```

## Chart Types Reference

### Multi-Series Bar Chart (`multiSeries`)
**Use for**: Age by gender, comparing multiple data series across categories

```javascript
{
    type: 'multiSeries',
    title: 'Age Distribution by Gender',
    labels: ['18-25', '26-35', '36-45', '46-55', '55+'],
    datasets: [
        {label: 'Male', data: [127, 286, 328, 303, 299]},
        {label: 'Female', data: [104, 251, 241, 202, 256]}
    ],
    yAxisTitle: 'Member Count'
}
```

### Percentage Bar Chart (`percentage`)
**Use for**: Income distribution, single-series percentage data

```javascript
{
    type: 'percentage',
    title: 'Income Distribution',
    labels: ['<$30K', '$30-50K', '$50-75K', '$75K+'],
    data: [15.2, 22.8, 28.5, 33.5],
    yAxisTitle: 'Percentage (%)',
    colorType: 'single' // or 'multi'
}
```

### Multi-Color Bar Chart (`multiColor`)
**Use for**: Race/ethnicity, categorical data with distinct colors

```javascript
{
    type: 'multiColor',
    title: 'Race/Ethnicity Distribution',
    labels: ['White', 'Hispanic', 'Black', 'Asian', 'Other'],
    data: [56.5, 18.2, 12.4, 8.9, 4.0],
    yAxisTitle: 'Percentage (%)'
}
```

### Comparison Bar Chart (`comparison`)
**Use for**: Credit union vs peer, direct comparison of two entities

```javascript
{
    type: 'comparison',
    title: 'Credit Union vs Peer Comparison',
    labels: ['18-25', '26-35', '36-45', '46-55', '55+'],
    dataset1: [127, 286, 328, 303, 299],
    dataset2: [104, 251, 241, 202, 256],
    label1: 'XYZ Credit Union',
    label2: 'Peer Average',
    yAxisTitle: 'Member Count'
}
```

### Pie Chart (`pie`)
**Use for**: Market share, part-to-whole relationships

```javascript
{
    type: 'pie',
    title: 'Market Share Distribution',
    labels: ['Segment A', 'Segment B', 'Segment C'],
    data: [45, 35, 20],
    showLegend: true
}
```

### Data Table (`table`)
**Use for**: Mixed units, detailed metrics that don't warrant visualization

```javascript
{
    type: 'table',
    title: 'Housing & Economic Metrics',
    labels: ['Owner-occupied (%)', 'Median home value (USD)', 'Median rent (USD)'],
    data: [75.6, 388926, 1107],
    headers: ['Metric', 'Value'],
    formatValue: (value, row, col) => {
        if (labels[row].includes('USD')) {
            return '$' + value.toLocaleString();
        } else if (labels[row].includes('%')) {
            return value + '%';
        }
        return value;
    }
}
```

### Multi-Scale Bar Chart (`multiScale`)
**Use for**: Comparing variables with different units/scales (percentages, dollars, counts)

```javascript
{
    type: 'multiScale',
    title: 'Mixed Metrics Comparison',
    labels: ['Ownership Rate', 'Median Income', 'Member Count'],
    datasets: [
        {label: 'XYZ Credit Union', data: [75.6, 65000, 15847]},
        {label: 'Peer Average', data: [68.2, 58000, 12500]}
    ],
    yAxisTitle: 'Normalized Scale',
    showOriginalValues: true
}
```

### Doughnut Chart (`doughnut`)
**Use for**: Part-to-whole relationships with center space for emphasis

```javascript
{
    type: 'doughnut',
    title: 'Account Type Distribution',
    labels: ['Checking', 'Savings', 'Loans', 'Investments'],
    data: [35, 28, 25, 12],
    showLegend: true,
    cutout: '60%',
    centerTitle: 'Account Mix'
}
```

## Content Types

### Executive Summary
HTML content with highlighted metrics:

```javascript
executiveSummary: `
    <p>Organization serves <span class="metric-highlight">15,847 members</span> with key insights.</p>
    <p>Analysis reveals <span class="metric-highlight">67.3%</span> earn over $50K annually.</p>
`
```

### Content Array Items

```javascript
content: [
    {
        type: 'text',
        text: 'Regular paragraph text content'
    },
    {
        type: 'finding', 
        text: 'Key insight with <span class="metric-highlight">42%</span> highlighted metrics'
    },
    {
        type: 'recommendation',
        priority: 'High Priority', // Optional
        text: 'Strategic action item or recommendation'
    }
]
```

## CSS Classes for Styling

- `.metric-highlight` - Blue bold text for emphasizing numbers
- `.executive-summary` - Green left border summary box
- `.key-finding` - Yellow left border finding box  
- `.recommendation` - Blue left border recommendation box
- `.text-content` - Standard paragraph formatting

## Features Included

- **Automatic chart coloring** - Gender-aware and palette-based
- **Copy/clipboard functionality** - Right-click to copy charts
- **Responsive design** - Mobile-friendly layouts
- **Professional styling** - Modern, clean appearance
- **Interactive tooltips** - Hover for detailed information
- **Export capabilities** - HTML export and table copying

## Example Complete Usage

```javascript
// Wait for page to load
window.addEventListener('DOMContentLoaded', async () => {
    const reportData = {
        title: "XYZ Credit Union Demographics",
        subtitle: "Member analysis and strategic insights",
        executiveSummary: `
            <p>XYZ Credit Union serves <span class="metric-highlight">15,847 members</span> with strong demographic diversity.</p>
        `,
        sections: [
            {
                title: "Age Analysis",
                charts: [{
                    type: 'multiSeries',
                    title: 'Member Age by Gender',
                    labels: ['18-25', '26-35', '36-45', '46-55', '55+'],
                    datasets: [
                        {label: 'Male', data: [127, 286, 328, 303, 299]},
                        {label: 'Female', data: [104, 251, 241, 202, 256]}
                    ]
                }],
                content: [{
                    type: 'finding',
                    text: 'Members aged 35-54 represent the largest segment at <span class="metric-highlight">42%</span>.'
                }]
            }
        ]
    };
    
    await pageBuilder.buildDemographicsReport(reportData);
});
```
