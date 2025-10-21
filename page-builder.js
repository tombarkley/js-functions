/**
 * HTML Page Builder Library v1.0
 * Complete interface for building HTML documents with charts and structure
 * Provides high-level functions for agents to create reports with minimal code
 */

// =====================================================
// LIBRARY LOADING AND INITIALIZATION
// =====================================================

class PageBuilder {
  constructor() {
    this.isInitialized = false;
    this.currentDocument = null;
    this.chartCounter = 0;
    this.sectionCounter = 0;
  }

  /**
   * Initialize the page builder by loading required libraries
   * Must be called before using any other functions
   */
  async initialize() {
    if (this.isInitialized) return;

    try {
      // Load D3 library if not already loaded
      if (typeof d3 === 'undefined') {
        await this.loadScript('https://cdn.jsdelivr.net/npm/d3@7');
      }

      // Chart functions are now embedded in this file - no need to load externally
      this.isInitialized = true;
      console.log('PageBuilder initialized successfully');
    } catch (error) {
      console.error('Failed to initialize PageBuilder:', error);
      throw error;
    }
  }

  /**
   * Load external script dynamically
   */
  loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  /**
   * Ensure the page builder is initialized
   */
  async ensureInitialized() {
    if (!this.isInitialized) {
      await this.initialize();
    }
  }

  // =====================================================
  // DOCUMENT STRUCTURE BUILDER
  // =====================================================

  /**
   * Create a new document structure with default styling
   */
  createDocument(config = {}) {
    const {
      title = 'Analysis Report',
      subtitle = '',
      includeDefaultStyles = true,
      containerClass = 'report-container'
    } = config;

    // Clear existing content
    document.body.innerHTML = '';

    // Add default styles if requested
    if (includeDefaultStyles) {
      this.addDefaultStyles();
    }

    // Create main container
    const container = document.createElement('div');
    container.className = containerClass;
    container.innerHTML = `
      <header class="report-header">
        <h1 class="report-title">${title}</h1>
        ${subtitle ? `<p class="report-subtitle">${subtitle}</p>` : ''}
      </header>
      <main class="report-content"></main>
    `;

    document.body.appendChild(container);
    this.currentDocument = container;
    return container;
  }

  /**
   * Add default CSS styles to the document
   */
  addDefaultStyles() {
    const styles = `
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f5f5f5;
        }

        .report-container {
          max-width: 1200px;
          margin: 0 auto;
          background: white;
          box-shadow: 0 0 20px rgba(0,0,0,0.1);
          min-height: 100vh;
        }

        .report-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 2rem;
          text-align: center;
        }

        .report-title {
          font-size: 2.5rem;
          font-weight: 300;
          margin-bottom: 0.5rem;
        }

        .report-subtitle {
          font-size: 1.2rem;
          opacity: 0.9;
        }

        .report-content {
          padding: 2rem;
        }

        .section {
          margin-bottom: 3rem;
        }

        .section-header {
          border-bottom: 3px solid #667eea;
          padding-bottom: 0.5rem;
          margin-bottom: 1.5rem;
        }

        .section-title {
          font-size: 1.8rem;
          color: #333;
          font-weight: 600;
        }

        .section-subtitle {
          font-size: 1rem;
          color: #666;
          margin-top: 0.25rem;
        }

        .chart-container {
          height: 400px;
          margin: 20px 0;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 15px;
          background: white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          position: relative;
        }

        .executive-summary {
          background: #f8f9fa;
          border-left: 4px solid #28a745;
          padding: 1.5rem;
          margin: 2rem 0;
          border-radius: 0 8px 8px 0;
        }

        .key-finding {
          background: #fff3cd;
          border-left: 4px solid #ffc107;
          padding: 1rem;
          margin: 1rem 0;
          border-radius: 0 4px 4px 0;
        }

        .recommendation {
          background: #d1ecf1;
          border-left: 4px solid #17a2b8;
          padding: 1rem;
          margin: 1rem 0;
          border-radius: 0 4px 4px 0;
        }

        .metric-highlight {
          font-weight: bold;
          color: #007bff;
        }

        .text-content {
          font-size: 1rem;
          line-height: 1.7;
          margin-bottom: 1rem;
        }

        .content-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin: 2rem 0;
        }

        @media (max-width: 768px) {
          .content-grid {
            grid-template-columns: 1fr;
          }
          
          .report-title {
            font-size: 2rem;
          }
          
          .report-container {
            margin: 0;
            box-shadow: none;
          }
        }
      </style>
    `;

    document.head.insertAdjacentHTML('beforeend', styles);
  }

  /**
   * Create a new section in the document
   */
  createSection(config = {}) {
    const {
      title = `Section ${++this.sectionCounter}`,
      subtitle = '',
      className = 'section',
      containerId = `section-${this.sectionCounter}`
    } = config;

    const content = this.currentDocument.querySelector('.report-content');
    const section = document.createElement('section');
    section.className = className;
    section.id = containerId;

    section.innerHTML = `
      <div class="section-header">
        <h2 class="section-title">${title}</h2>
        ${subtitle ? `<p class="section-subtitle">${subtitle}</p>` : ''}
      </div>
      <div class="section-content"></div>
    `;

    content.appendChild(section);
    return section;
  }

  /**
   * Create a chart container within a section or the main content
   */
  createChartContainer(config = {}) {
    const {
      containerId = `chart-${++this.chartCounter}`,
      title = '',
      className = 'chart-container',
      parentSelector = '.report-content'
    } = config;

    const parent = this.currentDocument.querySelector(parentSelector) || 
                  this.currentDocument.querySelector('.report-content');

    const container = document.createElement('div');
    container.id = containerId;
    container.className = className;

    if (title) {
      const titleElement = document.createElement('h3');
      titleElement.textContent = title;
      titleElement.style.cssText = 'margin-bottom: 1rem; color: #333; text-align: center;';
      container.appendChild(titleElement);
    }

    parent.appendChild(container);
    return containerId;
  }

  // =====================================================
  // CONTENT MANAGEMENT FUNCTIONS
  // =====================================================

  /**
   * Add executive summary section
   */
  addExecutiveSummary(content, parentSelector = '.report-content') {
    const parent = this.currentDocument.querySelector(parentSelector);
    const summary = document.createElement('div');
    summary.className = 'executive-summary';
    summary.innerHTML = `
      <h3>Executive Summary</h3>
      <div class="text-content">${content}</div>
    `;
    parent.appendChild(summary);
    return summary;
  }

  /**
   * Add key finding box
   */
  addKeyFinding(content, parentSelector = '.section-content') {
    const parent = this.currentDocument.querySelector(parentSelector) || 
                  this.currentDocument.querySelector('.report-content');
    const finding = document.createElement('div');
    finding.className = 'key-finding';
    finding.innerHTML = `<div class="text-content">${content}</div>`;
    parent.appendChild(finding);
    return finding;
  }

  /**
   * Add recommendation box
   */
  addRecommendation(content, priority = '', parentSelector = '.section-content') {
    const parent = this.currentDocument.querySelector(parentSelector) || 
                  this.currentDocument.querySelector('.report-content');
    const recommendation = document.createElement('div');
    recommendation.className = 'recommendation';
    
    const priorityText = priority ? `<strong>${priority}:</strong> ` : '';
    recommendation.innerHTML = `<div class="text-content">${priorityText}${content}</div>`;
    parent.appendChild(recommendation);
    return recommendation;
  }

  /**
   * Add regular text content
   */
  addTextContent(content, parentSelector = '.section-content') {
    const parent = this.currentDocument.querySelector(parentSelector) || 
                  this.currentDocument.querySelector('.report-content');
    const textDiv = document.createElement('div');
    textDiv.className = 'text-content';
    textDiv.innerHTML = content;
    parent.appendChild(textDiv);
    return textDiv;
  }

  /**
   * Create a two-column grid layout
   */
  createContentGrid(parentSelector = '.section-content') {
    const parent = this.currentDocument.querySelector(parentSelector) || 
                  this.currentDocument.querySelector('.report-content');
    const grid = document.createElement('div');
    grid.className = 'content-grid';
    parent.appendChild(grid);
    return grid;
  }

  // =====================================================
  // CHART INTERFACE FUNCTIONS
  // =====================================================

  /**
   * Create multi-series bar chart with simplified interface
   */
  async createMultiSeriesChart(config) {
    await this.ensureInitialized();
    
    const {
      containerId,
      title = '',
      labels,
      datasets,
      yAxisTitle = 'Value',
      parentSelector = '.section-content'
    } = config;

    const chartId = containerId || this.createChartContainer({ 
      title, 
      parentSelector 
    });

    // Wait a moment for DOM to update
    setTimeout(() => {
      createMultiSeriesBarChart(chartId, labels, datasets, { yAxisTitle });
    }, 100);

    return chartId;
  }

  /**
   * Create percentage bar chart
   */
  async createPercentageChart(config) {
    await this.ensureInitialized();
    
    const {
      containerId,
      title = '',
      labels,
      data,
      yAxisTitle = 'Percentage (%)',
      colorType = 'single',
      parentSelector = '.section-content'
    } = config;

    const chartId = containerId || this.createChartContainer({ 
      title, 
      parentSelector 
    });

    setTimeout(() => {
      createPercentageBarChart(chartId, labels, data, { 
        yAxisTitle, 
        colorType 
      });
    }, 100);

    return chartId;
  }

  /**
   * Create multi-color bar chart
   */
  async createMultiColorChart(config) {
    await this.ensureInitialized();
    
    const {
      containerId,
      title = '',
      labels,
      data,
      yAxisTitle = 'Value',
      parentSelector = '.section-content'
    } = config;

    const chartId = containerId || this.createChartContainer({ 
      title, 
      parentSelector 
    });

    setTimeout(() => {
      createMultiColorBarChart(chartId, labels, data, { yAxisTitle });
    }, 100);

    return chartId;
  }

  /**
   * Create comparison bar chart
   */
  async createComparisonChart(config) {
    await this.ensureInitialized();
    
    const {
      containerId,
      title = '',
      labels,
      dataset1,
      dataset2,
      label1 = 'Series 1',
      label2 = 'Series 2',
      yAxisTitle = 'Value',
      parentSelector = '.section-content'
    } = config;

    const chartId = containerId || this.createChartContainer({ 
      title, 
      parentSelector 
    });

    setTimeout(() => {
      createComparisonBarChart(chartId, labels, dataset1, dataset2, {
        label1,
        label2,
        yAxisTitle
      });
    }, 100);

    return chartId;
  }

  /**
   * Create pie chart
   */
  async createPieChart(config) {
    await this.ensureInitialized();
    
    const {
      containerId,
      title = '',
      labels,
      data,
      showLegend = true,
      parentSelector = '.section-content'
    } = config;

    const chartId = containerId || this.createChartContainer({ 
      title, 
      parentSelector 
    });

    setTimeout(() => {
      createPieChart(chartId, labels, data, { showLegend });
    }, 100);

    return chartId;
  }

  /**
   * Create data table
   */
  async createDataTable(config) {
    await this.ensureInitialized();
    
    const {
      containerId,
      title = '',
      labels,
      data,
      headers = ['Metric', 'Value'],
      formatValue = null,
      parentSelector = '.section-content'
    } = config;

    const chartId = containerId || this.createChartContainer({ 
      title, 
      parentSelector 
    });

    setTimeout(() => {
      createDataTable(chartId, labels, data, {
        title,
        headers,
        formatValue
      });
    }, 100);

    return chartId;
  }

  /**
   * Create multi-scale bar chart
   */
  async createMultiScaleChart(config) {
    await this.ensureInitialized();
    
    const {
      containerId,
      title = '',
      labels,
      datasets,
      yAxisTitle = 'Assorted Variables',
      showOriginalValues = true,
      parentSelector = '.section-content'
    } = config;

    const chartId = containerId || this.createChartContainer({ 
      title, 
      parentSelector 
    });

    setTimeout(() => {
      createMultiScaleBarChart(chartId, labels, datasets, {
        yAxisTitle,
        showOriginalValues
      });
    }, 100);

    return chartId;
  }

  /**
   * Create doughnut chart
   */
  async createDoughnutChart(config) {
    await this.ensureInitialized();
    
    const {
      containerId,
      title = '',
      labels,
      data,
      showLegend = true,
      cutout = '50%',
      centerTitle = '',
      parentSelector = '.section-content'
    } = config;

    const chartId = containerId || this.createChartContainer({ 
      title, 
      parentSelector 
    });

    setTimeout(() => {
      createDoughnutChart(chartId, labels, data, {
        showLegend,
        cutout,
        title: centerTitle
      });
    }, 100);

    return chartId;
  }

  // =====================================================
  // UTILITY AND HELPER FUNCTIONS
  // =====================================================

  /**
   * Format numbers with appropriate separators and decimals
   */
  formatNumber(value, type = 'number') {
    if (typeof value !== 'number') return value;

    switch (type) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(value);
      
      case 'percentage':
        return `${value.toFixed(1)}%`;
      
      case 'decimal':
        return value.toFixed(2);
      
      default:
        return value.toLocaleString();
    }
  }

  /**
   * Highlight metrics in text content
   */
  highlightMetric(value, type = 'number') {
    const formatted = this.formatNumber(value, type);
    return `<span class="metric-highlight">${formatted}</span>`;
  }

  /**
   * Validate chart data
   */
  validateChartData(labels, data) {
    if (!Array.isArray(labels) || !Array.isArray(data)) {
      throw new Error('Labels and data must be arrays');
    }
    
    if (labels.length !== data.length) {
      console.warn('Labels and data arrays have different lengths');
    }
    
    return true;
  }

  /**
   * Get current section for appending content
   */
  getCurrentSection() {
    const sections = this.currentDocument.querySelectorAll('.section');
    return sections[sections.length - 1] || null;
  }

  /**
   * Export current document as HTML string
   */
  exportHTML() {
    return document.documentElement.outerHTML;
  }

  /**
   * Clear all content and reset counters
   */
  reset() {
    if (this.currentDocument) {
      this.currentDocument.innerHTML = '';
    }
    this.chartCounter = 0;
    this.sectionCounter = 0;
  }
}

// =====================================================
// COMPLETE BUILD ORCHESTRATION
// =====================================================

/**
 * High-level function to create a complete demographics report
 */
PageBuilder.prototype.buildDemographicsReport = async function(reportData) {
  const {
    title = 'Member Demographics Analysis',
    subtitle = 'Comprehensive demographic insights and recommendations',
    executiveSummary = '',
    sections = []
  } = reportData;

  // Initialize and create document structure
  await this.ensureInitialized();
  this.createDocument({ title, subtitle });

  // Add executive summary if provided
  if (executiveSummary) {
    this.addExecutiveSummary(executiveSummary);
  }

  // Process each section
  for (const sectionData of sections) {
    const section = this.createSection({
      title: sectionData.title,
      subtitle: sectionData.subtitle
    });

    // Add charts
    if (sectionData.charts) {
      for (const chartConfig of sectionData.charts) {
        chartConfig.parentSelector = `#${section.id} .section-content`;
        
        switch (chartConfig.type) {
          case 'multiSeries':
            await this.createMultiSeriesChart(chartConfig);
            break;
          case 'percentage':
            await this.createPercentageChart(chartConfig);
            break;
          case 'multiColor':
            await this.createMultiColorChart(chartConfig);
            break;
          case 'comparison':
            await this.createComparisonChart(chartConfig);
            break;
          case 'pie':
            await this.createPieChart(chartConfig);
            break;
          case 'table':
            await this.createDataTable(chartConfig);
            break;
          case 'multiScale':
            await this.createMultiScaleChart(chartConfig);
            break;
          case 'doughnut':
            await this.createDoughnutChart(chartConfig);
            break;
        }
      }
    }

    // Add text content
    if (sectionData.content) {
      sectionData.content.forEach(content => {
        switch (content.type) {
          case 'finding':
            this.addKeyFinding(content.text, `#${section.id} .section-content`);
            break;
          case 'recommendation':
            this.addRecommendation(content.text, content.priority, `#${section.id} .section-content`);
            break;
          default:
            this.addTextContent(content.text, `#${section.id} .section-content`);
        }
      });
    }
  }

  return this.currentDocument;
};

// =====================================================
// GLOBAL INSTANCE AND SIMPLE INTERFACE
// =====================================================

// Create global instance
window.pageBuilder = new PageBuilder();

// Expose simple functions for basic usage
window.initPageBuilder = () => window.pageBuilder.initialize();
window.createDocument = (config) => window.pageBuilder.createDocument(config);
window.createSection = (config) => window.pageBuilder.createSection(config);
window.addChart = async (type, config) => {
  switch (type) {
    case 'multiSeries':
      return await window.pageBuilder.createMultiSeriesChart(config);
    case 'percentage':
      return await window.pageBuilder.createPercentageChart(config);
    case 'multiColor':
      return await window.pageBuilder.createMultiColorChart(config);
    case 'comparison':
      return await window.pageBuilder.createComparisonChart(config);
    case 'pie':
      return await window.pageBuilder.createPieChart(config);
    case 'table':
      return await window.pageBuilder.createDataTable(config);
    case 'multiScale':
      return await window.pageBuilder.createMultiScaleChart(config);
    case 'doughnut':
      return await window.pageBuilder.createDoughnutChart(config);
  }
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PageBuilder;
}

// =====================================================
// EMBEDDED D3 CHART FUNCTIONS LIBRARY
// =====================================================

/**
 * D3.js Chart Functions Library v1.0 - Development Version
 * Provides reusable chart functions with automatic color assignment
 * Compatible with D3.js v7+
 * Embedded in PageBuilder for single-file convenience
 */

// Chart copy functionality
function addCopyButton(svg, containerId) {
  const container = d3.select(`#${containerId}`);
  
  // Add copy button to container
  const copyButton = container
    .insert('div', ':first-child')
    .style('position', 'absolute')
    .style('top', '10px')
    .style('right', '10px')
    .style('z-index', 1000)
    .append('button')
    .style('background', '#007bff')
    .style('color', 'white')
    .style('border', 'none')
    .style('padding', '8px 12px')
    .style('border-radius', '4px')
    .style('cursor', 'pointer')
    .style('font-size', '12px')
    .style('box-shadow', '0 2px 4px rgba(0,0,0,0.2)')
    .text('📋 Copy Chart')
    .on('mouseover', function() {
      d3.select(this).style('background', '#0056b3');
    })
    .on('mouseout', function() {
      d3.select(this).style('background', '#007bff');
    })
    .on('click', function() {
      copyChartToClipboard(svg.node(), this);
    });
  
  // Set container position relative for absolute positioning
  container.style('position', 'relative');
  
  return copyButton;
}

async function copyChartToClipboard(svgElement, buttonElement) {
  try {
    // Show loading state
    const originalText = buttonElement.textContent;
    buttonElement.textContent = '⏳ Copying...';
    buttonElement.disabled = true;
    
    // Get SVG dimensions
    const svgRect = svgElement.getBoundingClientRect();
    const svgData = new XMLSerializer().serializeToString(svgElement);
    
    // Create a canvas to render the SVG
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    // Set canvas size (scale up for better quality)
    const scale = 2;
    canvas.width = svgRect.width * scale;
    canvas.height = svgRect.height * scale;
    ctx.scale(scale, scale);
    
    // Create blob URL for SVG
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    
    return new Promise((resolve, reject) => {
      img.onload = async function() {
        // Draw image to canvas
        ctx.fillStyle = 'white'; // White background
        ctx.fillRect(0, 0, svgRect.width, svgRect.height);
        ctx.drawImage(img, 0, 0);
        
        // Convert to blob
        canvas.toBlob(async function(blob) {
          try {
            // Copy to clipboard
            await navigator.clipboard.write([
              new ClipboardItem({
                'image/png': blob
              })
            ]);
            
            // Success feedback
            buttonElement.textContent = '✅ Copied!';
            buttonElement.style.background = '#28a745';
            
            setTimeout(() => {
              buttonElement.textContent = originalText;
              buttonElement.style.background = '#007bff';
              buttonElement.disabled = false;
            }, 2000);
            
            resolve();
          } catch (err) {
            console.error('Failed to copy to clipboard:', err);
            // Fallback: Download the image
            const link = document.createElement('a');
            link.download = 'chart.png';
            link.href = canvas.toDataURL();
            link.click();
            
            buttonElement.textContent = '💾 Downloaded';
            buttonElement.style.background = '#17a2b8';
            
            setTimeout(() => {
              buttonElement.textContent = originalText;
              buttonElement.style.background = '#007bff';
              buttonElement.disabled = false;
            }, 2000);
            
            resolve();
          }
        }, 'image/png');
        
        URL.revokeObjectURL(url);
      };
      
      img.onerror = function(err) {
        console.error('Failed to load SVG:', err);
        buttonElement.textContent = '❌ Error';
        buttonElement.style.background = '#dc3545';
        
        setTimeout(() => {
          buttonElement.textContent = originalText;
          buttonElement.style.background = '#007bff';
          buttonElement.disabled = false;
        }, 2000);
        
        reject(err);
      };
      
      img.src = url;
    });
    
  } catch (err) {
    console.error('Copy operation failed:', err);
    buttonElement.textContent = '❌ Error';
    buttonElement.style.background = '#dc3545';
    
    setTimeout(() => {
      buttonElement.textContent = originalText;
      buttonElement.style.background = '#007bff';
      buttonElement.disabled = false;
    }, 2000);
  }
}

// Color configuration
const CHART_COLORS = {
  primary: '#3498db',
  secondary: '#2ecc71',
  accent: '#f39c12',
  palette: [
    '#3498db', '#2ecc71', '#f39c12', '#e74c3c', '#9b59b6', 
    '#1abc9c', '#34495e', '#f1c40f', '#e67e22', '#95a5a6',
    '#2980b9', '#27ae60', '#d35400', '#c0392b', '#8e44ad'
  ],
  gender: {
    male: '#4a90e2',
    female: '#50e3c2'
  }
};

// Helper function to get colors
function getColors(count, type = 'palette') {
  if (type === 'gender') {
    return [CHART_COLORS.gender.male, CHART_COLORS.gender.female];
  }
  const colors = [];
  for (let i = 0; i < count; i++) {
    colors.push(CHART_COLORS.palette[i % CHART_COLORS.palette.length]);
  }
  return colors;
}

/**
 * Adds right-click context menu with copy option
 */
function addRightClickCopy(svg, containerId) {
  // Create context menu element
  const contextMenuId = `context-menu-${containerId}`;
  
  // Remove existing context menu if it exists
  d3.select(`#${contextMenuId}`).remove();
  
  const contextMenu = d3.select('body').append('div')
    .attr('id', contextMenuId)
    .style('position', 'absolute')
    .style('display', 'none')
    .style('background', 'white')
    .style('border', '1px solid #ccc')
    .style('border-radius', '4px')
    .style('box-shadow', '0 2px 8px rgba(0,0,0,0.15)')
    .style('padding', '8px 0')
    .style('z-index', '1000')
    .style('font-family', 'Arial, sans-serif')
    .style('font-size', '14px')
    .style('min-width', '180px');

  // Add copy option
  const copyOption = contextMenu.append('div')
    .style('padding', '8px 16px')
    .style('cursor', 'pointer')
    .style('color', '#333')
    .html('📋 Copy Chart to Clipboard')
    .on('mouseover', function() {
      d3.select(this).style('background', '#f0f0f0');
    })
    .on('mouseout', function() {
      d3.select(this).style('background', 'white');
    })
    .on('click', function() {
      contextMenu.style('display', 'none');
      
      // Create a temporary status element for feedback
      const statusDiv = d3.select(this);
      copyChartToClipboard(svg.node(), {
        textContent: '📋 Copy Chart to Clipboard',
        set textContent(value) {
          statusDiv.html(value);
        },
        get textContent() {
          return statusDiv.text();
        },
        disabled: false,
        style: {
          background: '#f0f0f0',
          set background(value) {
            statusDiv.style('background', value);
          }
        }
      });
    });

  // Add right-click event to SVG
  svg.on('contextmenu', function(event) {
    event.preventDefault();
    
    // Hide any existing context menus
    d3.selectAll('[id^="context-menu-"]').style('display', 'none');
    
    // Show this context menu
    contextMenu
      .style('left', (event.pageX) + 'px')
      .style('top', (event.pageY) + 'px')
      .style('display', 'block');
  });

  // Hide context menu when clicking elsewhere
  document.addEventListener('click', function(event) {
    if (!contextMenu.node().contains(event.target)) {
      contextMenu.style('display', 'none');
    }
  });

  // Also hide on escape key
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
      contextMenu.style('display', 'none');
    }
  });

  return contextMenu;
}

// SVG setup helper
function setupSVG(containerId, width = 800, height = 400) {
  const container = d3.select(`#${containerId}`);
  container.selectAll('*').remove(); // Clear existing content
  
  const margin = { top: 60, right: 80, bottom: 80, left: 80 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.bottom - margin.top;
  
  const svg = container
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .style('background', 'white');
    
  const g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);
    
  return { svg, g, width: innerWidth, height: innerHeight, margin };
}

// Tooltip helper
function createTooltip() {
  return d3.select('body')
    .append('div')
    .style('position', 'absolute')
    .style('background', 'rgba(0,0,0,0.8)')
    .style('color', 'white')
    .style('padding', '8px 12px')
    .style('border-radius', '4px')
    .style('font-size', '12px')
    .style('pointer-events', 'none')
    .style('opacity', 0)
    .style('z-index', 1000);
}

/**
 * Creates a multi-series bar chart for comparing data across categories
 */
function createMultiSeriesBarChart(containerId, labels, datasets, options = {}) {
  if (!d3) {
    console.error('D3.js not loaded');
    return null;
  }
  
  const { svg, g, width, height } = setupSVG(containerId);
  
  // Color datasets automatically
  const coloredDatasets = datasets.map((dataset, index) => ({
    ...dataset,
    backgroundColor: dataset.label === 'Male' ? CHART_COLORS.gender.male :
                    dataset.label === 'Female' ? CHART_COLORS.gender.female :
                    CHART_COLORS.palette[index % CHART_COLORS.palette.length]
  }));
  
  // Process data for D3
  const groupedData = [];
  labels.forEach((label, i) => {
    const group = { label };
    coloredDatasets.forEach((dataset) => {
      group[dataset.label] = dataset.data[i];
    });
    groupedData.push(group);
  });
  
  const seriesNames = coloredDatasets.map(d => d.label);
  
  // Scales
  const x0 = d3.scaleBand()
    .domain(labels)
    .rangeRound([0, width])
    .paddingInner(0.1);
    
  const x1 = d3.scaleBand()
    .domain(seriesNames)
    .rangeRound([0, x0.bandwidth()])
    .padding(0.05);
    
  const y = d3.scaleLinear()
    .domain([0, d3.max(groupedData, d => d3.max(seriesNames, key => d[key]))])
    .nice()
    .range([height, 0]);
  
  // Color scale
  const color = d3.scaleOrdinal()
    .domain(seriesNames)
    .range(coloredDatasets.map(d => d.backgroundColor));
  
  // Tooltip
  const tooltip = createTooltip();
  
  // Draw bars
  const groups = g.selectAll('.group')
    .data(groupedData)
    .enter().append('g')
    .attr('class', 'group')
    .attr('transform', d => `translate(${x0(d.label)},0)`);
  
  groups.selectAll('.bar')
    .data(d => seriesNames.map(key => ({ key, value: d[key], label: d.label })))
    .enter().append('rect')
    .attr('class', 'bar')
    .attr('x', d => x1(d.key))
    .attr('y', d => y(d.value))
    .attr('width', x1.bandwidth())
    .attr('height', d => height - y(d.value))
    .attr('fill', d => color(d.key))
    .on('mouseover', function(event, d) {
      tooltip.style('opacity', 1)
        .html(`${d.label}<br/>${d.key}: ${Number(d.value).toLocaleString(undefined, {maximumFractionDigits: 3})}`)
        .style('left', (event.pageX + 10) + 'px')
        .style('top', (event.pageY - 10) + 'px');
    })
    .on('mouseout', () => tooltip.style('opacity', 0));
  
  // Axes
  g.append('g')
    .attr('class', 'axis axis--x')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x0));
    
  g.append('g')
    .attr('class', 'axis axis--y')
    .call(d3.axisLeft(y));
  
  // Y-axis label
  if (options.yAxisTitle) {
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2 - 60)
      .attr('y', 20)
      .style('text-anchor', 'middle')
      .style('font-size', '14px')
      .text(options.yAxisTitle);
  }
  
  // Add right-click context menu for copying
  const contextMenu = addRightClickCopy(svg, containerId);
  
  return { svg, tooltip, contextMenu };
}

/**
 * Creates a percentage bar chart with automatic % formatting
 */
function createPercentageBarChart(containerId, labels, data, config = {}) {
  if (!d3) {
    console.error('D3.js not loaded');
    return null;
  }
  
  const {
    label = 'Share (%)',
    yAxisTitle = 'Percentage',
    showLegend = false,
    horizontal = false,
    colorType = 'single'
  } = config;

  const { svg, g, width, height } = setupSVG(containerId);
  
  // Color handling
  const backgroundColor = colorType === 'multi' ? getColors(data.length) : [CHART_COLORS.primary];
  const colors = Array.isArray(backgroundColor) ? backgroundColor : new Array(data.length).fill(backgroundColor);
  
  // Scales
  let x, y;
  if (horizontal) {
    x = d3.scaleLinear()
      .domain([0, d3.max(data)])
      .nice()
      .range([0, width]);
    y = d3.scaleBand()
      .domain(labels)
      .range([0, height])
      .padding(0.1);
  } else {
    x = d3.scaleBand()
      .domain(labels)
      .range([0, width])
      .padding(0.1);
    y = d3.scaleLinear()
      .domain([0, d3.max(data)])
      .nice()
      .range([height, 0]);
  }
  
  const tooltip = createTooltip();
  
  // Draw bars
  const bars = g.selectAll('.bar')
    .data(data)
    .enter().append('rect')
    .attr('class', 'bar')
    .attr('fill', (d, i) => colors[i % colors.length]);
  
  if (horizontal) {
    bars
      .attr('x', 0)
      .attr('y', (d, i) => y(labels[i]))
      .attr('width', d => x(d))
      .attr('height', y.bandwidth());
  } else {
    bars
      .attr('x', (d, i) => x(labels[i]))
      .attr('y', d => y(d))
      .attr('width', x.bandwidth())
      .attr('height', d => height - y(d));
  }
  
  // Tooltips
  bars.on('mouseover', function(event, d, i) {
      const labelText = labels[data.indexOf(d)];
      tooltip.style('opacity', 1)
        .html(`${labelText}<br/>${label}: ${Number(d).toFixed(1)}%`)
        .style('left', (event.pageX + 10) + 'px')
        .style('top', (event.pageY - 10) + 'px');
    })
    .on('mouseout', () => tooltip.style('opacity', 0));
  
  // Axes
  if (horizontal) {
    g.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).tickFormat(d => d + '%'));
    g.append('g')
      .attr('class', 'axis axis--y')
      .call(d3.axisLeft(y));
  } else {
    g.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x));
    g.append('g')
      .attr('class', 'axis axis--y')
      .call(d3.axisLeft(y).tickFormat(d => d + '%'));
  }
  
  // Y-axis label
  if (!horizontal && yAxisTitle) {
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2 - 60)
      .attr('y', 20)
      .style('text-anchor', 'middle')
      .style('font-size', '14px')
      .text(yAxisTitle);
  }
  
  // Add right-click context menu for copying
  const contextMenu = addRightClickCopy(svg, containerId);
  
  return { svg, tooltip, contextMenu };
}

/**
 * Creates a multi-color bar chart where each bar has a different color
 */
function createMultiColorBarChart(containerId, labels, data, config = {}) {
  if (!d3) {
    console.error('D3.js not loaded');
    return null;
  }
  
  const {
    label = 'Share (%)',
    yAxisTitle = 'Percentage',
    showLegend = false
  } = config;

  const { svg, g, width, height } = setupSVG(containerId);
  const colors = getColors(data.length);
  
  // Scales
  const x = d3.scaleBand()
    .domain(labels)
    .range([0, width])
    .padding(0.1);
    
  const y = d3.scaleLinear()
    .domain([0, d3.max(data)])
    .nice()
    .range([height, 0]);
  
  const tooltip = createTooltip();
  
  // Draw bars
  g.selectAll('.bar')
    .data(data)
    .enter().append('rect')
    .attr('class', 'bar')
    .attr('x', (d, i) => x(labels[i]))
    .attr('y', d => y(d))
    .attr('width', x.bandwidth())
    .attr('height', d => height - y(d))
    .attr('fill', (d, i) => colors[i])
    .on('mouseover', function(event, d, i) {
      const labelText = labels[data.indexOf(d)];
      tooltip.style('opacity', 1)
        .html(`${labelText}<br/>${label}: ${Number(d).toFixed(1)}%`)
        .style('left', (event.pageX + 10) + 'px')
        .style('top', (event.pageY - 10) + 'px');
    })
    .on('mouseout', () => tooltip.style('opacity', 0));
  
  // Axes
  g.append('g')
    .attr('class', 'axis axis--x')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x));
    
  g.append('g')
    .attr('class', 'axis axis--y')
    .call(d3.axisLeft(y));
  
  // Y-axis label
  if (yAxisTitle) {
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2 - 60)
      .attr('y', 20)
      .style('text-anchor', 'middle')
      .style('font-size', '14px')
      .text(yAxisTitle);
  }
  
  // Add right-click context menu for copying
  const contextMenu = addRightClickCopy(svg, containerId);
  
  return { svg, tooltip, contextMenu };
}

/**
 * Creates a pie chart for part-to-whole relationships
 */
function createPieChart(containerId, labels, data, config = {}) {
  if (!d3) {
    console.error('D3.js not loaded');
    return null;
  }
  
  const { showLegend = true } = config;
  const { svg, g, width, height } = setupSVG(containerId);
  
  const radius = Math.min(width, height) / 2;
  const colors = getColors(data.length);
  
  g.attr('transform', `translate(${width / 2}, ${height / 2})`);
  
  // Pie and arc generators
  const pie = d3.pie()
    .value(d => d.value)
    .sort(null);
    
  const arc = d3.arc()
    .innerRadius(0)
    .outerRadius(radius - 10);
  
  // Data preparation
  const pieData = labels.map((label, i) => ({ label, value: data[i] }));
  const tooltip = createTooltip();
  
  // Draw pie slices
  const arcs = g.selectAll('.arc')
    .data(pie(pieData))
    .enter().append('g')
    .attr('class', 'arc');
  
  arcs.append('path')
    .attr('d', arc)
    .attr('fill', (d, i) => colors[i])
    .on('mouseover', function(event, d) {
      tooltip.style('opacity', 1)
        .html(`${d.data.label}: ${Number(d.data.value).toFixed(1)}%`)
        .style('left', (event.pageX + 10) + 'px')
        .style('top', (event.pageY - 10) + 'px');
    })
    .on('mouseout', () => tooltip.style('opacity', 0));
  
  // Add text labels
  arcs.append('text')
    .attr('transform', d => `translate(${arc.centroid(d)})`)
    .attr('dy', '0.35em')
    .style('text-anchor', 'middle')
    .style('font-size', '12px')
    .style('fill', 'white')
    .text(d => d.data.value > 5 ? `${d.data.value.toFixed(1)}%` : '');
  
  // Legend (removed per user request in production)
  if (showLegend) {
    const legend = svg.append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${width - 120}, 60)`);
      
    const legendItems = legend.selectAll('.legend-item')
      .data(pieData)
      .enter().append('g')
      .attr('class', 'legend-item')
      .attr('transform', (d, i) => `translate(0, ${i * 20})`);
      
    legendItems.append('rect')
      .attr('width', 15)
      .attr('height', 15)
      .attr('fill', (d, i) => colors[i]);
      
    legendItems.append('text')
      .attr('x', 20)
      .attr('y', 12)
      .style('font-size', '12px')
      .text(d => d.label);
  }
  
  // Add right-click context menu for copying
  const contextMenu = addRightClickCopy(svg, containerId);
  
  return { svg, tooltip, contextMenu };
}

/**
 * Creates a multi-scale bar chart that normalizes different units for visual comparison
 * CRITICAL for mixed data types (percentages, dollars, counts)
 */
function createMultiScaleBarChart(containerId, labels, datasets, config = {}) {
  if (!d3) {
    console.error('D3.js not loaded');
    return null;
  }
  
  const {
    yAxisTitle = 'Assorted Variables',
    showOriginalValues = true
  } = config;

  // Normalize within each variable (column) from zero to maximum (or handle negatives)
  const normalizedDatasets = datasets.map((dataset, datasetIndex) => {
    const normalizedData = [];
    const originalData = dataset.data;
    
    // For each variable position, find min/max across all datasets
    for (let i = 0; i < originalData.length; i++) {
      const valuesForThisVariable = datasets.map(ds => ds.data[i]);
      const min = Math.min(...valuesForThisVariable);
      const max = Math.max(...valuesForThisVariable);
      
      if (min === max) {
        // All values are the same
        normalizedData.push(50);
      } else if (min >= 0) {
        // All values are positive - normalize from 0 to max
        normalizedData.push((originalData[i] / max) * 100);
      } else if (max <= 0) {
        // All values are negative - normalize from min to 0
        normalizedData.push((originalData[i] / Math.abs(min)) * 100);
      } else {
        // Mix of positive and negative - normalize across maximum absolute value
        const maxAbs = Math.max(Math.abs(min), Math.abs(max));
        normalizedData.push((originalData[i] / maxAbs) * 50 + 50);
      }
    }

    return {
      ...dataset,
      data: normalizedData,
      originalData: originalData,
      backgroundColor: dataset.backgroundColor || CHART_COLORS.palette[datasetIndex % CHART_COLORS.palette.length]
    };
  });

  const { svg, g, width, height } = setupSVG(containerId);
  
  // Process data for D3
  const groupedData = [];
  labels.forEach((label, i) => {
    const group = { label };
    normalizedDatasets.forEach((dataset) => {
      group[dataset.label] = { 
        normalized: dataset.data[i], 
        original: dataset.originalData[i] 
      };
    });
    groupedData.push(group);
  });
  
  const seriesNames = normalizedDatasets.map(d => d.label);
  
  // Scales
  const x0 = d3.scaleBand()
    .domain(labels)
    .rangeRound([0, width])
    .paddingInner(0.1);
    
  const x1 = d3.scaleBand()
    .domain(seriesNames)
    .rangeRound([0, x0.bandwidth()])
    .padding(0.05);
    
  const y = d3.scaleLinear()
    .domain([0, 100])
    .range([height, 0]);
  
  const color = d3.scaleOrdinal()
    .domain(seriesNames)
    .range(normalizedDatasets.map(d => d.backgroundColor));
  
  const tooltip = createTooltip();
  
  // Draw bars
  const groups = g.selectAll('.group')
    .data(groupedData)
    .enter().append('g')
    .attr('class', 'group')
    .attr('transform', d => `translate(${x0(d.label)},0)`);
  
  groups.selectAll('.bar')
    .data(d => seriesNames.map(key => ({ 
      key, 
      value: d[key].normalized, 
      original: d[key].original,
      label: d.label 
    })))
    .enter().append('rect')
    .attr('class', 'bar')
    .attr('x', d => x1(d.key))
    .attr('y', d => y(d.value))
    .attr('width', x1.bandwidth())
    .attr('height', d => height - y(d.value))
    .attr('fill', d => color(d.key))
    .on('mouseover', function(event, d) {
      const originalValue = typeof d.original === 'number' ? 
        (d.original >= 1000 ? Number(d.original).toLocaleString() : Number(d.original).toFixed(1)) :
        d.original;
      
      tooltip.style('opacity', 1)
        .html(`${d.label}<br/>${d.key}: ${originalValue}`)
        .style('left', (event.pageX + 10) + 'px')
        .style('top', (event.pageY - 10) + 'px');
    })
    .on('mouseout', () => tooltip.style('opacity', 0));
  
  // Axes
  g.append('g')
    .attr('class', 'axis axis--x')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x0));
    
  g.append('g')
    .attr('class', 'axis axis--y')
    .call(d3.axisLeft(y).tickFormat(() => ''));
  
  // Y-axis label
  if (yAxisTitle) {
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2 - 60)
      .attr('y', 20)
      .style('text-anchor', 'middle')
      .style('font-size', '14px')
      .text(yAxisTitle);
  }
  
  // Add right-click context menu for copying
  const contextMenu = addRightClickCopy(svg, containerId);
  
  return { svg, tooltip, contextMenu };
}

/**
 * Creates a comparison bar chart for exactly two data series
 */
function createComparisonBarChart(containerId, labels, dataset1, dataset2, config = {}) {
  if (!d3) {
    console.error('D3.js not loaded');
    return null;
  }
  
  const {
    label1 = 'Series 1',
    label2 = 'Series 2',
    yAxisTitle = 'Value',
    showAsPercentage = false,
    color1 = 'rgba(54,162,235,0.75)',
    color2 = 'rgba(255,99,132,0.75)'
  } = config;

  const { svg, g, width, height } = setupSVG(containerId);
  
  // Process data
  const groupedData = [];
  labels.forEach((label, i) => {
    groupedData.push({
      label,
      [label1]: dataset1[i],
      [label2]: dataset2[i]
    });
  });
  
  const seriesNames = [label1, label2];
  
  // Scales
  const x0 = d3.scaleBand()
    .domain(labels)
    .rangeRound([0, width])
    .paddingInner(0.1);
    
  const x1 = d3.scaleBand()
    .domain(seriesNames)
    .rangeRound([0, x0.bandwidth()])
    .padding(0.05);
    
  const y = d3.scaleLinear()
    .domain([0, d3.max(groupedData, d => d3.max(seriesNames, key => d[key]))])
    .nice()
    .range([height, 0]);
  
  const color = d3.scaleOrdinal()
    .domain(seriesNames)
    .range([color1, color2]);
  
  const tooltip = createTooltip();
  
  // Draw bars
  const groups = g.selectAll('.group')
    .data(groupedData)
    .enter().append('g')
    .attr('class', 'group')
    .attr('transform', d => `translate(${x0(d.label)},0)`);
  
  groups.selectAll('.bar')
    .data(d => seriesNames.map(key => ({ key, value: d[key], label: d.label })))
    .enter().append('rect')
    .attr('class', 'bar')
    .attr('x', d => x1(d.key))
    .attr('y', d => y(d.value))
    .attr('width', x1.bandwidth())
    .attr('height', d => height - y(d.value))
    .attr('fill', d => color(d.key))
    .on('mouseover', function(event, d) {
      const value = showAsPercentage ? 
        Number(d.value).toFixed(1) + '%' : 
        Number(d.value).toLocaleString(undefined, {maximumFractionDigits: 2});
      tooltip.style('opacity', 1)
        .html(`${d.label}<br/>${d.key}: ${value}`)
        .style('left', (event.pageX + 10) + 'px')
        .style('top', (event.pageY - 10) + 'px');
    })
    .on('mouseout', () => tooltip.style('opacity', 0));
  
  // Axes
  g.append('g')
    .attr('class', 'axis axis--x')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x0));
    
  g.append('g')
    .attr('class', 'axis axis--y')
    .call(showAsPercentage ? d3.axisLeft(y).tickFormat(d => d + '%') : d3.axisLeft(y));
  
  // Y-axis label
  if (yAxisTitle) {
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2 - 60)
      .attr('y', 20)
      .style('text-anchor', 'middle')
      .style('font-size', '14px')
      .text(yAxisTitle);
  }
  
  // Add right-click context menu for copying
  const contextMenu = addRightClickCopy(svg, containerId);
  
  return { svg, tooltip, contextMenu };
}

/**
 * Creates a doughnut chart with center space for text or emphasis
 */
function createDoughnutChart(containerId, labels, data, config = {}) {
  if (!d3) {
    console.error('D3.js not loaded');
    return null;
  }
  
  const {
    showLegend = true,
    cutout = '50%',
    title = ''
  } = config;

  const { svg, g, width, height } = setupSVG(containerId);
  const radius = Math.min(width, height) / 2;
  const colors = getColors(data.length);
  const innerRadius = parseInt(cutout) * radius / 100;
  
  g.attr('transform', `translate(${width / 2}, ${height / 2})`);
  
  // Pie and arc generators
  const pie = d3.pie()
    .value(d => d.value)
    .sort(null);
    
  const arc = d3.arc()
    .innerRadius(innerRadius)
    .outerRadius(radius - 10);
  
  // Data preparation
  const pieData = labels.map((label, i) => ({ label, value: data[i] }));
  const tooltip = createTooltip();
  
  // Draw doughnut slices
  const arcs = g.selectAll('.arc')
    .data(pie(pieData))
    .enter().append('g')
    .attr('class', 'arc');
  
  arcs.append('path')
    .attr('d', arc)
    .attr('fill', (d, i) => colors[i])
    .attr('stroke', 'white')
    .attr('stroke-width', 2)
    .on('mouseover', function(event, d) {
      const total = pieData.reduce((a, b) => a + b.value, 0);
      const percentage = ((d.data.value / total) * 100).toFixed(1);
      tooltip.style('opacity', 1)
        .html(`${d.data.label}: ${Number(d.data.value).toFixed(1)} (${percentage}%)`)
        .style('left', (event.pageX + 10) + 'px')
        .style('top', (event.pageY - 10) + 'px');
    })
    .on('mouseout', () => tooltip.style('opacity', 0));
  
  // Center title
  if (title) {
    svg.append('text')
      .attr('x', width / 2 + 80)
      .attr('y', 30)
      .style('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .text(title);
  }
  
  // Legend (removed per user request in production)
  if (showLegend) {
    const legend = svg.append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${width - 120}, 60)`);
      
    const legendItems = legend.selectAll('.legend-item')
      .data(pieData)
      .enter().append('g')
      .attr('class', 'legend-item')
      .attr('transform', (d, i) => `translate(0, ${i * 20})`);
      
    legendItems.append('rect')
      .attr('width', 15)
      .attr('height', 15)
      .attr('fill', (d, i) => colors[i]);
      
    legendItems.append('text')
      .attr('x', 20)
      .attr('y', 12)
      .style('font-size', '12px')
      .text(d => d.label);
  }
  
  // Add right-click context menu for copying
  const contextMenu = addRightClickCopy(svg, containerId);
  
  return { svg, tooltip, contextMenu };
}

/**
 * Creates a professional data table for metrics that don't warrant visualization
 * Perfect for mixed metrics, single data series, or detailed breakdowns
 */
function createDataTable(containerId, labels, data, config = {}) {
  const {
    headers = ['Metric', 'Value'],
    title = '',
    formatValue = null,
    sortable = false,
    showIndex = false,
    className = 'data-table'
  } = config;

  const container = d3.select(`#${containerId}`);
  container.selectAll('*').remove(); // Clear existing content
  
  // Set container position for right-click menu
  container.style('position', 'relative');
  
  // Add title if provided
  if (title) {
    container.append('h4')
      .style('margin', '0 0 10px 0')
      .style('color', '#2c5282')
      .style('font-size', '16px')
      .text(title);
  }
  
  // Create table
  const table = container.append('table')
    .attr('class', className)
    .style('width', '100%')
    .style('border-collapse', 'collapse')
    .style('background', 'white')
    .style('border-radius', '6px')
    .style('overflow', 'hidden')
    .style('box-shadow', '0 1px 3px rgba(0,0,0,0.1)');
  
  // Create header
  const thead = table.append('thead');
  const headerRow = thead.append('tr')
    .style('background', '#f8f9fa')
    .style('border-bottom', '2px solid #dee2e6');
  
  if (showIndex) {
    headerRow.append('th')
      .style('padding', '12px 8px')
      .style('text-align', 'left')
      .style('font-weight', 'bold')
      .style('color', '#495057')
      .text('#');
  }
  
  headers.forEach(header => {
    headerRow.append('th')
      .style('padding', '12px 8px')
      .style('text-align', 'left')
      .style('font-weight', 'bold')
      .style('color', '#495057')
      .style('cursor', sortable ? 'pointer' : 'default')
      .text(header);
  });
  
  // Create body
  const tbody = table.append('tbody');
  
  // Process data - handle both array of values and array of objects
  let tableData;
  if (Array.isArray(data[0])) {
    // Array of arrays [[label, value], [label, value]]
    tableData = data;
  } else if (typeof data[0] === 'object') {
    // Array of objects [{label: 'X', value: 'Y'}]
    tableData = data.map(item => [item.label || item.name || item.key, item.value]);
  } else {
    // Parallel arrays: labels and data
    tableData = labels.map((label, i) => [label, data[i]]);
  }
  
  // Add rows
  tableData.forEach((rowData, i) => {
    const row = tbody.append('tr')
      .style('border-bottom', '1px solid #dee2e6')
      .on('mouseover', function() {
        d3.select(this).style('background', '#f8f9fa');
      })
      .on('mouseout', function() {
        d3.select(this).style('background', i % 2 === 0 ? 'white' : '#f8f9fa');
      });
    
    // Set alternating row colors
    row.style('background', i % 2 === 0 ? 'white' : '#f8f9fa');
    
    if (showIndex) {
      row.append('td')
        .style('padding', '10px 8px')
        .style('color', '#6c757d')
        .style('font-size', '12px')
        .text(i + 1);
    }
    
    rowData.forEach((cellData, j) => {
      const cell = row.append('td')
        .style('padding', '10px 8px')
        .style('color', '#495057');
      
      if (j === 0) {
        // First column (labels) - left align
        cell.style('font-weight', '500');
      } else {
        // Data columns - right align numbers
        cell.style('text-align', 'right');
        if (typeof cellData === 'number') {
          cell.style('font-family', 'monospace');
        }
      }
      
      // Format value if formatter provided
      let displayValue = cellData;
      if (j > 0 && formatValue && typeof formatValue === 'function') {
        displayValue = formatValue(cellData, i, j);
      } else if (typeof cellData === 'number') {
        // Default number formatting
        if (cellData >= 1000) {
          displayValue = cellData.toLocaleString();
        } else if (cellData % 1 !== 0) {
          displayValue = cellData.toFixed(1);
        }
      }
      
      cell.text(displayValue);
    });
  });
  
  // Add right-click context menu for copying table
  const contextMenu = addRightClickCopyTable(table, containerId);
  
  return { table, contextMenu };
}

/**
 * Right-click copy functionality specifically for tables
 */
function addRightClickCopyTable(table, containerId) {
  const contextMenuId = `context-menu-table-${containerId}`;
  
  // Remove existing context menu if it exists
  d3.select(`#${contextMenuId}`).remove();
  
  const contextMenu = d3.select('body').append('div')
    .attr('id', contextMenuId)
    .style('position', 'absolute')
    .style('display', 'none')
    .style('background', 'white')
    .style('border', '1px solid #ccc')
    .style('border-radius', '4px')
    .style('box-shadow', '0 2px 8px rgba(0,0,0,0.15)')
    .style('padding', '8px 0')
    .style('z-index', '1000')
    .style('font-family', 'Arial, sans-serif')
    .style('font-size', '14px')
    .style('min-width', '200px');

  // Add copy options
  const copyTableOption = contextMenu.append('div')
    .style('padding', '8px 16px')
    .style('cursor', 'pointer')
    .style('color', '#333')
    .html('📋 Copy Table to Clipboard')
    .on('mouseover', function() {
      d3.select(this).style('background', '#f0f0f0');
    })
    .on('mouseout', function() {
      d3.select(this).style('background', 'white');
    })
    .on('click', function() {
      contextMenu.style('display', 'none');
      copyTableToClipboard(table.node(), d3.select(this));
    });

  const copyTSVOption = contextMenu.append('div')
    .style('padding', '8px 16px')
    .style('cursor', 'pointer')
    .style('color', '#333')
    .html('📊 Copy as Excel Data')
    .on('mouseover', function() {
      d3.select(this).style('background', '#f0f0f0');
    })
    .on('mouseout', function() {
      d3.select(this).style('background', 'white');
    })
    .on('click', function() {
      contextMenu.style('display', 'none');
      copyTableAsTSV(table.node(), d3.select(this));
    });

  // Add right-click event to table
  table.on('contextmenu', function(event) {
    event.preventDefault();
    
    // Hide any existing context menus
    d3.selectAll('[id^="context-menu-"]').style('display', 'none');
    
    // Show this context menu
    contextMenu
      .style('left', (event.pageX) + 'px')
      .style('top', (event.pageY) + 'px')
      .style('display', 'block');
  });

  // Hide context menu when clicking elsewhere
  document.addEventListener('click', function(event) {
    if (!contextMenu.node().contains(event.target)) {
      contextMenu.style('display', 'none');
    }
  });

  // Also hide on escape key
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
      contextMenu.style('display', 'none');
    }
  });

  return contextMenu;
}

async function copyTableToClipboard(tableElement, statusElement) {
  try {
    // Show loading state
    const originalText = statusElement.html();
    statusElement.html('⏳ Copying...');
    
    // Extract table data as HTML
    const tableHTML = tableElement.outerHTML;
    
    // Copy to clipboard as HTML
    await navigator.clipboard.write([
      new ClipboardItem({
        'text/html': new Blob([tableHTML], { type: 'text/html' }),
        'text/plain': new Blob([tableElement.innerText], { type: 'text/plain' })
      })
    ]);
    
    // Success feedback
    statusElement.html('✅ Copied!')
      .style('background', '#d4edda')
      .style('color', '#155724');
    
    setTimeout(() => {
      statusElement.html(originalText)
        .style('background', 'white')
        .style('color', '#333');
    }, 2000);
    
  } catch (err) {
    console.error('Failed to copy table:', err);
    statusElement.html('❌ Error')
      .style('background', '#f8d7da')
      .style('color', '#721c24');
    
    setTimeout(() => {
      statusElement.html(originalText)
        .style('background', 'white')
        .style('color', '#333');
    }, 2000);
  }
}

async function copyTableAsTSV(tableElement, statusElement) {
  try {
    // Show loading state
    const originalText = statusElement.html();
    statusElement.html('⏳ Copying...');
    
    // Extract table data as TSV
    const rows = Array.from(tableElement.querySelectorAll('tr'));
    const tsvData = rows.map(row => {
      const cells = Array.from(row.querySelectorAll('td, th'));
      return cells.map(cell => cell.textContent.trim()).join('\t');
    }).join('\n');
    
    // Copy to clipboard as TSV (Excel-friendly)
    await navigator.clipboard.writeText(tsvData);
    
    // Success feedback
    statusElement.html('✅ Copied!')
      .style('background', '#d4edda')
      .style('color', '#155724');
    
    setTimeout(() => {
      statusElement.html(originalText)
        .style('background', 'white')
        .style('color', '#333');
    }, 2000);
    
  } catch (err) {
    console.error('Failed to copy table as TSV:', err);
    statusElement.html('❌ Error')
      .style('background', '#f8d7da')
      .style('color', '#721c24');
    
    setTimeout(() => {
      statusElement.html(originalText)
        .style('background', 'white')
        .style('color', '#333');
    }, 2000);
  }
}

console.log('PageBuilder library with embedded chart functions loaded successfully');
