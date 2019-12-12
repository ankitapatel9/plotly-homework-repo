// Use the D3 library to read in `samples.json`

function optionChanged(value) {

    var demographics = window.rawData.metadata.find(data => data.id === Number(value));
    refreshDemographics(demographics);

    var chartData = window.rawData.samples.find(data => data.id === value);
    

    drawBarChart(chartData);
    drawBubbleChart(chartData);
   
}

function refreshDemographics(demographics) {
    var panel = d3.select("#sample-metadata");
    panel.html("");
    Object.entries(demographics).forEach(([key, value]) => {
        panel.append("span")
            .html(`${key} : ${value}`)
            .append("br");
    });
}


function drawBarChart(chartData) {
    var xData = chartData.sample_values.slice(0, 10).reverse();
    var barLabels = chartData.otu_labels.slice(0, 10).reverse();
    var yData = chartData.otu_ids.map(row => `OTU ${row}`).slice(0, 10).reverse();

    var trace = {
        type: "bar",
        x: xData,
        y: yData,
        text: barLabels,
        orientation: 'h'
    };
    var data = [trace];

    //TODO: Remove top padding
    Plotly.newPlot("bar", data, {}, {
        displayModeBar: false
    });
}

function drawBubbleChart(chartData) {
    var xData = chartData.otu_ids;
    var yData = chartData.sample_values;
    var barLabels = chartData.otu_labels;

    var trace2 = {
        x: xData,
        y: yData,
        mode: 'markers',
        marker: {
            color: xData,
            size: yData,
            colorscale: "Earth"
        },
        text: barLabels
    };

    var data = [trace2];

    var layout = {
        title: 'Marker Size',
        showlegend: false,
        height: 500,
        width: 1100
    };
    Plotly.newPlot('bubble', data, layout);
}

function init() {
    var url = "./samples.json";
    d3.json(url).then(function (data) {
        window.rawData = data;

        // Add default option called Select in the dropdown
        var select = d3.select("#test-subject-dropdown");
        options = select.selectAll('option')
            .data(data.names)
            .enter()
            .append("option")
            .attr("value", value => value)
            .text(text => text);

        if(data.names.length > 0)
        {
            optionChanged(data.names[0]);
        }
    });
}

init();