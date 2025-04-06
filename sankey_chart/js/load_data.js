// Function to load data
async function loadData() {
    try {
        const data = await d3.csv("final_df_cleaned.csv");
        return data;
    } catch (error) {
        console.error("Error loading data:", error);
        return [];
    }
} 