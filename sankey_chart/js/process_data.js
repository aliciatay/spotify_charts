// Function to process data for Sankey diagram
function processDataForSankey(data, selectedPlatform = "all") {
    // Extract platform and genre information
    const nodes = [];
    const links = [];
    
    // Add all platforms as nodes
    const platforms = [
        "Spotify",
        "YouTube",
        "TikTok",
        "Apple_Music",
        "SiriusXM",
        "Deezer",
        "Amazon",
        "Pandora",
        "Shazam"
    ];
    
    // Get unique genres
    const genres = [...new Set(data.map(d => d.genre))];
    
    // Create nodes for platforms
    platforms.forEach((platform, index) => {
        nodes.push({
            id: platform,
            name: platform.replace('_', ' '),
            type: "platform"
        });
    });
    
    // Create nodes for genres
    genres.forEach((genre, index) => {
        nodes.push({
            id: genre,
            name: genre,
            type: "genre"
        });
    });
    
    // Create links between platforms and genres
    platforms.forEach(platform => {
        // Skip if a specific platform is selected and this isn't it
        if (selectedPlatform !== "all" && platform !== selectedPlatform) return;
        
        // Group data by genre for this platform
        const platformHitColumn = platform + "_Hit";
        
        genres.forEach(genre => {
            // Count songs in this genre that are hits on this platform
            const count = data.filter(d => 
                d.genre === genre && 
                d[platformHitColumn] === "True"
            ).length;
            
            if (count > 0) {
                links.push({
                    source: platform,
                    target: genre,
                    value: count
                });
            }
        });
    });
    
    return { nodes, links };
} 