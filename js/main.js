d3.csv("data/listings.csv").then(listings => {
    d3.csv("data/neighborhoods.csv").then(neighborhoods => {
        d3.csv("data/reviews.csv").then(reviews => {
            const data = processData(listings, neighborhoods, reviews);

            const width = 1000;
            const height = 600;
            const margin = { top: 20, right: 30, bottom: 50, left: 60 };

            const svg = d3.select("#visualization-container")
                .append("svg")
                .attr("width", width)
                .attr("height", height);

            createScene1(svg, data, width, height, margin);
            createScene2(svg, data, width, height, margin);
            createScene3(svg, data, width, height, margin);

            showScene("scene1");
        });
    });
});

function processData(listings, neighborhoods, reviews) {
    // Implement data processing and merging here
    // Example: merging listings with neighborhoods and reviews - to be tested
    return listings.map(listing => {
        const neighborhood = neighborhoods.find(n => n.id === listing.neighbourhood_id);
        const review = reviews.find(r => r.listing_id === listing.id);
        return {
            ...listing,
            neighbourhood: neighborhood ? neighborhood.name : "Unknown",
            review_score: review ? review.score : 0
        };
    });
}

function createScene1(svg, data, width, height, margin) {
    svg.append("text")
        .attr("id", "scene1")
        .attr("x", width / 2)
        .attr("y", height / 2)
        .attr("text-anchor", "middle")
        .text("Introduction to Airbnb Listings")
        .attr("class", "scene annotation");

    svg.append("text")
        .attr("id", "scene1-subtitle")
        .attr("x", width / 2)
        .attr("y", height / 2 + 30)
        .attr("text-anchor", "middle")
        .text("An overview of Airbnb listings, prices, availability, and reviews in NYC")
        .attr("class", "scene annotation");
}

function createScene2(svg, data, width, height, margin) {
    const x = d3.scaleBand()
        .domain(data.map(d => d.neighbourhood))
        .range([margin.left, width - margin.right])
        .padding(0.1);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => +d.price)]).nice()
        .range([height - margin.bottom, margin.top]);

    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x))
        .attr("class", "scene")
        .attr("id", "scene2");

    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y))
        .attr("class", "scene")
        .attr("id", "scene2");

    svg.append("g")
        .selectAll("rect")
        .data(data)
        .enter().append("rect")
        .attr("x", d => x(d.neighbourhood))
        .attr("y", d => y(d.price))
        .attr("height", d => y(0) - y(d.price))
        .attr("width", x.bandwidth())
        .attr("fill", "steelblue")
        .attr("class", "scene")
        .attr("id", "scene2");

    // Add annotations to Scene 2
    svg.append("text")
        .attr("x", margin.left)
        .attr("y", margin.top)
        .attr("text-anchor", "start")
        .text("Bar Chart: Average Prices of Airbnb Listings by Neighborhood")
        .attr("class", "annotation");

    svg.append("text")
        .attr("x", x("Manhattan"))
        .attr("y", y(d3.max(data, d => d.price)) - 10)
        .attr("text-anchor", "middle")
        .text("Manhattan has the highest average price")
        .attr("class", "annotation")
        .attr("fill", "red");
}

function createScene3(svg, data, width, height, margin) {
    svg.append("text")
        .attr("id", "scene3")
        .attr("x", width / 2)
        .attr("y", height / 2)
        .attr("text-anchor", "middle")
        .text("Conclusion and Insights")
        .attr("class", "scene annotation");

    svg.append("text")
        .attr("id", "scene3-summary")
        .attr("x", width / 2)
        .attr("y", height / 2 + 30)
        .attr("text-anchor", "middle")
        .text("Based on the analysis, Manhattan has the highest average Airbnb prices while other neighborhoods vary significantly.")
        .attr("class", "scene annotation");
}

function showScene(sceneId) {
    d3.selectAll(".scene").style("display", "none");
    d3.select(`#${sceneId}`).style("display", "block");
}

showScene("scene1");

d3.select("#scene1").on("click", () => showScene("scene2"));
d3.select("#scene2").on("click", () => showScene("scene3"));
