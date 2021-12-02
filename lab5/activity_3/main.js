// Global function called when select element is changed
function onCategoryChanged() {
    var select = d3.select('#categorySelect').node();
    // Get current value of select element
    var category = select.options[select.selectedIndex].value;
    // Update chart with the selected category of letters
    updateChart(category,cuttOff);
}

// recall that when data is loaded into memory, numbers are loaded as strings
// this function helps convert numbers into string during data preprocessing
function dataPreprocessor(row) {
    return {
        letter: row.letter,
        frequency: +row.frequency
    };
}

var svg = d3.select('svg');

// Get layout parameters
var svgWidth = +svg.attr('width');
var svgHeight = +svg.attr('height');

var padding = {t: 60, r: 40, b: 30, l: 40};

// Compute chart dimensions
var chartWidth = svgWidth - padding.l - padding.r;
var chartHeight = svgHeight - padding.t - padding.b;

// Compute the spacing for bar bands based on all 26 letters
var barBand = chartHeight / 26;
var barHeight = barBand * 0.7;

// Create a group element for appending chart elements
var chartG = svg.append('g')
    .attr('transform', 'translate('+[padding.l, padding.t]+')');

// A map with arrays for each category of letter sets
var lettersMap = {
    'all-letters': 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
    'only-consonants': 'BCDFGHJKLMNPQRSTVWXZ'.split(''),
    'only-vowels': 'AEIOUY'.split('')
};

d3.csv('letter_freq.csv', dataPreprocessor).then(function(dataset) {
    // Create global variables here and intialize the chart
    letters = dataset
    let maxValue = .12702
    widthScale = d3.scaleLinear().domain([0,maxValue]).range([0,chartWidth])
    var main = document.getElementById('main');
    cuttOff = 0.0
    filterButton = d3.select(main)
        .append('p')
        .append('button')
        .style("border", "1px solid black")
        .text('Filter Data')
        .on('click', function() {
            // Add code here
            var select = d3.select('#categorySelect').node();
            var category = select.options[select.selectedIndex].value;
            cuttOff = parseFloat(document.getElementById("cutoff").value)
            updateChart(category,cuttOff)
        });
    // **** Your JavaScript code goes here ****
    d3.select("svg").append("text")
    .text("Letter Frequency(%)")
    .attr("transform","translate(90,30)")
    let topAxis = d3.axisTop(widthScale).ticks(8).tickFormat(function(d){return d * 100 + "%"})
    let bottomAxis = d3.axisBottom(widthScale).ticks(8).tickFormat(function(d){return d * 100 + "%"})
    d3.select("svg").append("g")
    .attr("transform","translate(40,60)")
    .call(topAxis)
    d3.select("svg").append("g")
    .attr("transform","translate(40,570)")
    .call(bottomAxis)

    // Update the chart for all letters to initialize
    updateChart('all-letters',cuttOff);
});


function updateChart(filterKey,value) {
    // Create a filtered array of letters based on the filterKey
    var filteredLetters = letters.filter(function(d){
        return lettersMap[filterKey].indexOf(d.letter) >= 0 && parseFloat(d.frequency) >= value;
    });
    // **** Draw and Update your chart here ****
    //update selection
    let updateGroup = chartG.selectAll(".bar")
    .data(filteredLetters,function(d){
        return d.letter;
    })
    .attr("transform",function(d,i){return "translate(0," + ((i + 0.2) * barBand) + ")"})
    
    //enter selection
    let enterSelection = updateGroup.enter()
    .append("g")
    .attr("class","bar")
    .attr("transform",function(d,i){return "translate(0," + ((i + 0.2) * barBand) + ")"})
    enterSelection.append("rect")
        .attr("height",barHeight)
        .attr("width",function(d){return widthScale(d.frequency)})
    enterSelection.append("text")
        .text(function(d){return d.letter})
        .attr("transform","translate(-15,12)")
    
    //exit selection
    let exitSelection = updateGroup.exit()
    exitSelection.remove()
}

// Remember code outside of the data callback function will run before the data loads