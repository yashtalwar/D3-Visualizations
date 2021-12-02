// **** Example of how to create padding and spacing for trellis plot****
var svg = d3.select('svg');

// Hand code the svg dimensions, you can also use +svg.attr('width') or +svg.attr('height')
var svgWidth = +svg.attr('width');
var svgHeight = +svg.attr('height');

// Define a padding object
// This will space out the trellis subplots
var padding = {t: 20, r: 20, b: 60, l: 60};

// Compute the dimensions of the trellis plots, assuming a 2x2 layout matrix.
trellisWidth = svgWidth / 2 - padding.l - padding.r;
trellisHeight = svgHeight / 2 - padding.t - padding.b;

// As an example for how to layout elements with our variables
// Lets create .background rects for the trellis plots
svg.selectAll('.background')
    .data(['A', 'B', 'C', 'C']) // dummy data
    .enter()
    .append('rect') // Append 4 rectangles
    .attr('class', 'background')
    .attr('width', trellisWidth) // Use our trellis dimensions
    .attr('height', trellisHeight)
    .attr('transform', function(d, i) {
        // Position based on the matrix array indices.
        // i = 1 for column 1, row 0)
        var tx = (i % 2) * (trellisWidth + padding.l + padding.r) + padding.l;
        var ty = Math.floor(i / 2) * (trellisHeight + padding.t + padding.b) + padding.t;
        return 'translate('+[tx, ty]+')';
    });

var parseDate = d3.timeParse('%b %Y');
// To speed things up, we have already computed the domains for your scales
var dateDomain = [new Date(2000, 0), new Date(2010, 2)];
var priceDomain = [0, 223.02];

// **** How to properly load data ****

d3.csv('stock_prices.csv').then(function(dataset) {

// **** Your JavaScript code goes here ****
    dataset.forEach(function(d){
        d.date = parseDate(d.date);
    });

   let x =  d3.nest()
      .key(function(d){
        return d.company
      })
      .entries(dataset)
      console.log(x);

    let groups = d3.select("svg").selectAll(".trellis")
        .data(x)
        .enter()
        .append("g")
        .attr("class",".trellis")
        .attr("transform",function(d,i){
            var tx = (i % 2) * (trellisWidth + padding.l + padding.r) + padding.l;
            var ty = Math.floor(i / 2) * (trellisHeight + padding.t + padding.b) + padding.t;
            return 'translate('+[tx, ty]+')';
        })

    let xScale = d3.scaleTime().domain(dateDomain).range([0,trellisWidth])
    let yScale = d3.scaleLinear().domain(priceDomain).range([trellisHeight,0])

    let line = d3.line()
        .x(function(d){return xScale(d.date)})
        .y(function(d){return yScale(d.price)})

    color = d3.scaleOrdinal(d3.schemeCategory10)
    color.domain(x.map(function(d){return d.company;}))

    groups.selectAll(".line-plot")
        .data(function(d){
            let arr = [];
            arr.push(d.values)
            return arr;
        })
        .enter()
        .append("path")
        .attr("class",".line-plot")
        .style("stroke",function(d){return color(d[0].company)})
        .style("fill","#eee")
        .attr("d",line)


    let xAxis = d3.axisBottom(xScale);
    let yAxis = d3.axisLeft(yScale);

    groups.append("g")
    .attr("class",".x axis")
    .attr("transform","translate(0,"+trellisHeight+")")
    .call(xAxis)
    groups.append("g")
    .attr("class",".y axis")
    .attr("transform","translate(0,0)")
    .call(yAxis)


    groups.append("text")
          .attr("fill",function(d){return color(d.key)})
          .attr("class",".company-label")
          .text(function(d){return d.key})  
          .attr("transform",function(d){
            return "translate("+trellisWidth /2.5 + "," +trellisHeight / 2+")"
          })
    groups.append("text")
        .attr("transform", "translate("+ trellisWidth/2 +","+ (trellisHeight + 34)+")")
        .attr("class",".x axis-label")
        .text("Date (by Month)")

    groups.append("text")
        .attr("class",".y axis-label")
        .attr("transform", "translate("+ -30 + "," + trellisHeight / 2 + ")" + "rotate(-90)")
        .text("Stock Price (USD)");

    var xGrid = d3.axisTop(xScale)
    .tickSize(-trellisHeight, 0, 0)
    .tickFormat("");

    var yGrid = d3.axisLeft(yScale)
    .tickSize(-trellisWidth, 0, 0)
    .tickFormat("")

    groups.append("g")
        .call(xGrid)
        .attr("class",".x grid")

    groups.append("g")
        .call(yGrid)
        .attr("class",".y grid")

});

// Remember code outside of the data callback function will run before the data loads