// project.js - observable
// Author: Thanyared Wong
// Date: 2024.02.26

// Import Observable Plot with the included D3 capabilities
import * as Plot from "https://cdn.jsdelivr.net/npm/@observablehq/plot@0.6/+esm";

async function createGenderDistributionPlot(csvFilePath) {
    // Load the CSV data directly using Plot
    const data = await Plot.csv(csvFilePath);

    // Creating a plot that compares the number of women and men in each major
    const plot = Plot.plot({
        x: {
            grid: true,
            label: "Number of Students"
        },
        y: {
            grid: true,
            label: "Major"
        },
        color: {
            legend: true
        },
        marks: [
            Plot.barY(data, Plot.groupY({x: "sum"}, {y: "name", fill: "gender", z: "count"}))
        ],
        facet: {
            data: data.map(d => ({...d, gender: "Women", count: d.women})).concat(
                   data.map(d => ({...d, gender: "Men", count: d.men}))
                 ),
            y: "gender"
        }
    });

    // Append the plot to the document
    document.body.appendChild(plot);
}

// Call the function with the path to your CSV file
createGenderDistributionPlot("assets/BEgenders.csv");
document.querySelector("#canvs").appendChild(plot);
