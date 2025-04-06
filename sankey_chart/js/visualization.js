// Set the dimensions and margins of the visualization
const margin = {top: 10, right: 10, bottom: 10, left: 10};
const width = 1100 - margin.left - margin.right;
const height = 800 - margin.top - margin.bottom;

// Create the SVG container
const svg = d3.select("#visualization")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Initialize sankey generator
const sankey = d3.sankey()
    .nodeWidth(20)
    .nodePadding(10)
    .extent([[0, 0], [width, height]]);

// Load and process data
let allData = [];
let currentPlatform = "all";

// Initialize the visualization
async function initVisualization() {
    allData = await loadData();
    updateVisualization();
    
    // Setup platform selector
    const platformSelector = document.getElementById("platform-selector");
    if (platformSelector) {
        platformSelector.addEventListener("change", function() {
            currentPlatform = this.value;
            updateVisualization();
        });
    }
}

// Update the visualization based on selected platform
function updateVisualization() {
    // Clear previous visualization
    svg.selectAll("*").remove();
    
    // Process data for current platform
    const sankeyData = processDataForSankey(allData, currentPlatform);
    
    // Run the Sankey layout
    const { nodes, links } = sankey({
        nodes: sankeyData.nodes.map(d => Object.assign({}, d)),
        links: sankeyData.links.map(d => Object.assign({}, d))
    });

    // Draw the links
    const link = svg.append("g")
        .selectAll(".link")
        .data(links)
        .enter()
        .append("path")
        .attr("class", "link")
        .attr("d", d3.sankeyLinkHorizontal())
        .style("stroke-width", d => Math.max(1, d.width))
        .style("stroke", d => {
            // You can customize link colors based on source/target
            return "#aaa";
        });

    // Add hover effect to links
    link.append("title")
        .text(d => `${d.source.name} → ${d.target.name}: ${d.value} songs`);

    // Draw the nodes
    const node = svg.append("g")
        .selectAll(".node")
        .data(nodes)
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("transform", d => `translate(${d.x0},${d.y0})`);

    // Add rectangles for nodes
    node.append("rect")
        .attr("height", d => d.y1 - d.y0)
        .attr("width", d => d.x1 - d.x0)
        .attr("class", d => d.type)
        .append("title")
        .text(d => `${d.name}: ${d.value} songs`);

    // Add labels for nodes
    node.append("text")
        .attr("x", d => d.x0 < width / 2 ? (d.x1 - d.x0) + 6 : -6)
        .attr("y", d => (d.y1 - d.y0) / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end")
        .text(d => d.name)
        .style("fill", "#000")
        .style("font-size", "10px");
}

// Initialize the visualization when the page loads
document.addEventListener("DOMContentLoaded", initVisualization); 