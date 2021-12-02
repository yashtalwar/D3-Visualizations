function onCategoryChanged() {
  var select = d3.select('#categorySelect').node();
  // Get current value of select element
  var category = select.options[select.selectedIndex].value;
  // Update chart with the selected category of letters
  updateChart(category,categoryY())
  return category;
}
function categoryY() {
  var select = d3.select('#categorySelect2').node();
  // Get current value of select element
  var category = select.options[select.selectedIndex].value;
  // Update chart with the selected category of letters
  return category
}
var colors = {3:"blue",4:"red",5:"green", 6:"orange",8:"purple"}

xScale = d3.scaleLinear()
.domain([3,8]).range([60,700]);

yScale = d3.scaleLinear()
.domain([-1,230]).range([340,20]);


d3.select('#scatterplot').append('g').attr('class', 'xaxis')
.attr('transform', 'translate(0,345)')
.call(d3.axisBottom(xScale).tickFormat(function(d){return d;}));

d3.select('#scatterplot').append('g').attr('class', 'yaxis')
.attr('transform', 'translate(55,0)')
.call(d3.axisLeft(yScale));

d3.select("#scatterplot").append('text')
.attr('id', 'xAxisLabel')
.attr('transform','translate(340,390)')
.text("cylinders");
d3.select("#scatterplot").append('text')
.attr('id', 'yAxisLabel')
.attr('transform','translate(15,200) rotate(-90)')
.text("power");

var brushCell;
  function graphCell(type){
    this.type = type;
  }
  listOfCells = []
  listOfCells.push(new graphCell("scatterplot"))
  listOfCells.push(new graphCell("barchart"))

  var brush = d3.brush()
     .extent([[55, 0], [720, 345]])
     .on("start", brushstart)
     .on("brush", brushmove)
     .on("end", brushend);

function brushstart(cell){
    if(cell.type === "scatterplot"){
      d3.select("#bar_chart").select(".brush").call(brush.move,null)
    }
    if(cell.type === "barchart"){
      d3.select("#scatterplot").select(".brush").call(brush.move,null)
    }
    if(brushCell !== this){
      brush.move(d3.select(brushCell), null);
      brushCell = this
    }
  }
function brushmove(cell){
    if(cell.type == "scatterplot"){
      Xcategory = onCategoryChanged()
      Ycategory = categoryY()
      let set = new Set()
      let e = d3.event.selection;
      d3.selectAll("circle")
      .classed("hidden", function(d){
          let check =  e[0][0] > xScale(d[Xcategory]) || xScale(d[Xcategory]) > e[1][0]
              || e[0][1] > yScale(d[Ycategory]) || yScale(d[Ycategory]) > e[1][1];
          if(!check){
            set.add(d.cylinders)
          }
          return check;
      })
      d3.selectAll("rect").classed("hidden",function(d){
        return !set.has(d.key)
      })
    }else if(cell.type == "barchart"){
      let e = d3.event.selection;
      xMin = e[0][0];
      xMax = e[1][0];
      yMax = e[1][1];
      let set2 = new Set();
      d3.selectAll("rect")
      .classed("hidden", function(d){
        
        let check =  !(
          ((xMin > bar_cylinder_scale(d.key) && xMin < (bar_cylinder_scale(d.key) + bar_cylinder_scale.bandwidth())) ||
                (xMax > bar_cylinder_scale(d.key) && xMin < (bar_cylinder_scale(d.key) + bar_cylinder_scale.bandwidth())) ||
                (xMin < bar_cylinder_scale(d.key) && xMax > (bar_cylinder_scale(d.key) + bar_cylinder_scale.bandwidth()))) &&
                yMax > bar_count_scale(d.value)
        )
        if(check){
          set2.add(d.key)
        }
        return check;
      })
       d3.selectAll("circle")
       .classed("hidden", function(d){
         return set2.has(d.cylinders)
       })
    }
  }
function brushend(){
    if(!d3.event.selection) {
      // Bring back all hidden .dot elements
      d3.selectAll('.hidden').classed('hidden', false);
      // Return the state of the active brushCell to be undefined
      brushCell = undefined;
    }
  }
  
d3.csv("cars.csv").then(function(dataset) {
  cars = dataset;
    d3.select("#scatterplot").append("g").attr("id","con")
    d3.select("#scatterplot").select("#con").selectAll("g")
        .data(dataset)
        .enter()
        .append("g")
        .attr("class","git1")
        .attr("transform",function(d){
          x = xScale(d.cylinders)
          y = yScale(d.power)
          return "translate(" + x + " " + y + ")"
        })
        .append("circle")
        .attr("r",2)
        .style("fill",function(d){
            return colors[d.cylinders]
        })
    var bars = d3.nest()
    .key(function(d){
      return d.cylinders
    })
    .rollup(function(v){return v.length;})
    .entries(cars)

    bars.sort(function(x,y){return x.key - y.key})

    let bar_chart = d3.select("#bar_chart")

    bar_cylinder_scale = d3.scaleBand().range([ 60, 700 ]).domain(bars.map(function(d) { return d.key; })).padding(0.2);
    
    bar_chart.append("g").attr("class","xaxisBar")
    .attr('transform', 'translate(0,345)')
    .call(d3.axisBottom(bar_cylinder_scale).ticks(6).tickFormat(function(d){return d;}));

     bar_count_scale = d3.scaleLinear().domain([0,400]).range([340,20]);

    bar_chart.append("g").attr('class', 'yaxis')
    .attr('transform', 'translate(55,0)')
    .call(d3.axisLeft(bar_count_scale).ticks(6));

    bar_chart.selectAll("rect")
    .data(bars)
    .enter()
    .append("rect")
    .attr("x", function(d){return bar_cylinder_scale(d.key)})
    .attr("y", function (d){return bar_count_scale(d.value) })
    .attr("width", bar_cylinder_scale.bandwidth())
    .attr("height", function(d) { return 345 - bar_count_scale(d.value)})
    .style("fill",function(d,i){return colors[d.key]})

    bar_chart.append('text')
      .attr('id', 'xAxisLabel2')
      .attr('transform','translate(340,390)')
      .text("cylinders");
    bar_chart.append('text')
      .attr('id', 'yAxisLabel2')
      .attr('transform','translate(15,200) rotate(-90)')
      .text("count");

    cellEnter = d3.selectAll("svg")
    .data(listOfCells)
    .enter()
    .append('g')
    .attr('class', 'cell')


    bar_chart.append("g")
      .attr("class","brush")
      .call(brush)
    d3.select("#scatterplot").append("g")
    .attr("class","brush")
    .call(brush)
})

function updateChart(xAxis,yAxis){
  d3.select(".xaxis").remove()
  min = 0
  max = 0
  if(xAxis === "economy"){
    min = -1
    max = 46.6
  }else if(xAxis === "cylinders"){
    min = 3
    max = 8
  }else if(xAxis === "displacement"){
    min = 68
    max = 455
  }else if(xAxis === "power"){
    min = -1
    max = 230
  }else if(xAxis === "weight"){
    min = 1613
    max = 5140
  }else if(xAxis === "mph"){
    min = 8
    max = 24.8
  }
  else if(xAxis === "year"){
    min = 70
    max = 82
  }
  xScale.domain([min,max]).range([60,700]);
  d3.select('#scatterplot').append('g').attr('class', 'xaxis')
  .attr('transform', 'translate(0,345)')
  .call(d3.axisBottom(xScale).tickFormat(function(d){return d;}));


  d3.select(".yaxis").remove()
  let min2 = 0;
  let max2 = 0;
  if(yAxis === "economy"){
    min2 = -1
    max2 = 46.6
  }else if(yAxis === "cylinders"){
    min2 = 3
    max2 = 8
  }else if(yAxis === "displacement"){
    min2 = 68
    max2 = 455
  }else if(yAxis === "power"){
    min2 = -1
    max2 = 230
  }else if(yAxis === "weight"){
    min2 = 1613
    max2 = 5140
  }else if(yAxis === "mph"){
    min2 = 8
    max2 = 24.8
  }
  else if(yAxis === "year"){
    min2 = 70
    max2 = 82
  }
  yScale.domain([min2,max2]).range([340,20]);
  var svg2 = d3.select('svg');
  svg2.append('g').attr('class', 'yaxis')
  .attr('transform', 'translate(55,0)')
  .call(d3.axisLeft(yScale));
  d3.select("#scatterplot").select("#con").selectAll("g").remove()
  d3.select("#scatterplot").select("#con").selectAll("g")
  .data(cars)
  .enter()
  .append("g")
  .attr("class","git1")
  .attr("transform",function(d){  
    x = xScale(d[xAxis])
    y = yScale(d[yAxis])
    return "translate(" + x + " " + y + ")"
  })
  .append("circle")
  .attr("r",2)
  .style("fill",function(d){
      return colors[d.cylinders]
  })

  d3.select("#xAxisLabel").remove()
  d3.select("#yAxisLabel").remove()
  d3.select("#scatterplot").append('text')
    .attr('id', 'xAxisLabel')
    .attr('transform','translate(340,390)')
    .text("" + xAxis);
  d3.select("#scatterplot").append('text')
    .attr('id', 'yAxisLabel')
    .attr('transform','translate(15,200) rotate(-90)')
    .text("" + yAxis);
}

