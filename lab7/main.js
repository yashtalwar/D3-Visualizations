var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([-12, 0])
    .html(function(d) {
        return "<h5>"+d['movie_title']+"("+d["content_rating"]+")"+"</h5>";
    });
var svg = d3.select('svg');
svg.call(toolTip);

function categoryX() {
    let select = d3.select('#xAxisSelect').node();
    // Get current value of select element
    let category = select.options[select.selectedIndex].value;
    // Update chart with the selected category of letters
    return category
  }
  function categoryY() {
    let select = d3.select('#yAxisSelect').node();
    // Get current value of select element
    let category = select.options[select.selectedIndex].value;
    // Update chart with the selected category of letters
    return category
  }
  function categoryYear() {
    let select = d3.select('#yearSelect').node();
    // Get current value of select element
    let category = select.options[select.selectedIndex].value;
    // Update chart with the selected category of letters
    return category
  }
  function onChanged(){
      let categoryX2 = categoryX()
      let categoryY2 = categoryY()
      let categoryYear2 = categoryYear()
      updateChart(categoryX2,categoryY2,categoryYear2)
  }


colors = {2010:"red",2011:"blue",2012:"green",2013:"purple",2014:"orange",2015:"aqua",2016:"chrome"}

years = [2010,2011,2012,2013,2014,2015,2016]

d3.csv("movies.csv").then(function(dataset){
    movies = dataset
    updateChart("duration","imdb_score","all")
})
function updateChart(xAxis,yAxis,year){
    d3.select(".xaxis").remove()
    d3.select(".yaxis").remove()
    d3.select("#con").remove()
    datafilter = []
    movies.forEach(function(d){
        datafilter.push(d)
    })
    xData = []
    yData = []
    datafilter.forEach(function(d){
        xData.push(parseFloat(d[xAxis]))
        yData.push(parseFloat(d[yAxis]))
    })
    xMin = d3.min(xData)
    xMax = d3.max(xData)
    yMin = d3.min(yData)
    yMax = d3.max(yData)
    
    xScale = d3.scaleLinear()
    .domain([xMin * 0.9,Math.ceil(xMax)]).range([90,760]);
    
    yScale = d3.scaleLinear()
    .domain([Math.floor(yMin),Math.ceil(yMax)]).range([670,20]);
    
    d3.select('#scatterplot').append('g').attr('class', 'xaxis')
    .attr('transform', 'translate(-20,670)')
    .call(d3.axisBottom(xScale).ticks(6).tickFormat(function(d){
        format = d3.format(",");
        return format(d)}));
    
    d3.select('#scatterplot').append('g').attr('class', 'yaxis')
    .attr('transform', 'translate(70,0)')
    .call(d3.axisLeft(yScale).ticks(6).tickFormat(function(d){
        format = d3.format(",");
        return format(d)}));
    let dataFilter2 = []
    if(year === "all"){
        dataFilter2 = datafilter
    }else{
        let year2 = parseInt(year)
        movies.forEach(function(d){
            if(year2 === parseFloat(d["title_year"])){
                dataFilter2.push(d)
            }
        })
    }
    d3.select("#scatterplot").append("g").attr("id","con")
    d3.select("#scatterplot").select("#con").selectAll("g")
        .data(dataFilter2)
        .enter()
        .append("g")
        .attr("class","git1")
        .attr("transform",function(d){
          x = xScale((d[xAxis])) - 20
          y = yScale(d[yAxis])
          return "translate(" + x + " " + y + ")"
        })
        .append("circle")
        .attr("r",4)
        .style("fill",function(d){
            return colors[d.title_year]
        })
    d3.select("svg").append("g").attr("class","legend").selectAll("g")
    .data(years)
    .enter()
    .append("g")
    .append("rect")
    .style("fill","black")
    .attr("x",900)
    .attr("y",function(d,i){return 50 + (i * 20)})
    .attr("width",10)
    .attr("height",10)
    .style("fill",function(d){return colors[d]})

    d3.select(".legend").selectAll("g")
    .append("text")
    .attr("x",920)
    .attr("y",function(d,i){return 60 + (i * 20)})
    .text(function(d){return d})
    .attr("onmousedown","false")

    d3.select(".legend").append("g")
    .append("text")
    .attr("x",890)
    .attr("y",35)
    .text("Movie Year")
    .style("text-decoration","underline")

    d3.selectAll("circle")
    .on('mouseover', toolTip.show)
    .on('mouseout', toolTip.hide);
    
    d3.selectAll("circle")
    .on("click",function(d){
        createBarChart(d)
    })

    let circles = document.getElementsByClassName("git1")
    for (var i = 0; i < circles.length; i++) {
        circles[i].addEventListener("dblclick", event => {
            console.log("Double-click detected")
            clearBarChart()
          })
      }
}

function createBarChart(data){
    clearBarChart()
    let hashmap = {"actor_1_facebook_likes":parseFloat(data["actor_1_facebook_likes"]),"actor_2_facebook_likes":parseFloat(data["actor_2_facebook_likes"]),"actor_3_facebook_likes":parseFloat(data["actor_3_facebook_likes"]),"director_facebook_likes":parseFloat(data["director_facebook_likes"]),"cast_total_facebook_likes":parseFloat(data["cast_total_facebook_likes"]),"movie_facebook_likes":parseFloat(data["movie_facebook_likes"])}
    let dataList = []
    console.log(hashmap)
    dataList.push(parseFloat(data["actor_1_facebook_likes"]))
    dataList.push(parseFloat(data["actor_2_facebook_likes"]))
    dataList.push(parseFloat(data["actor_3_facebook_likes"]))
    dataList.push(parseFloat(data["director_facebook_likes"]))
    dataList.push(parseFloat(data["cast_total_facebook_likes"]))
    dataList.push(parseFloat(data["movie_facebook_likes"]))
    dataListCat = ["actor_1_facebook_likes","actor_2_facebook_likes","actor_3_facebook_likes","director_facebook_likes","cast_total_facebook_likes","movie_facebook_likes"]
    let bar_chart = d3.select("#scatterplot").append("g").attr("id","barChart")
   let xAxisBar =  d3.scaleLinear().range([ 100, 650 ]).domain([0,d3.max(dataList)]);
   bar_chart.append("g").attr("class","xaxisBar")
   .attr('transform', 'translate(800,590)')
   .call(d3.axisBottom(xAxisBar))

   let yAxisBar = d3.scaleBand().range([ 150, 500 ]).domain(dataListCat.map(function(d) { return d })).padding(0.2);
   bar_chart.append("g").attr('class', 'yaxisBar')
   .attr('transform', 'translate(900,90)')
   .call(d3.axisLeft(yAxisBar).ticks(6));
   bar_chart.append("g").append("text").text(""+data["movie_title"]).attr("x",1100).attr("y",200)
   bar_chart.selectAll("rect")
   .data(dataListCat)
   .enter()
   .append("rect")
   .attr("x", function(d,i){ return 900})
   .attr("y", function (d,i){ return 92 + yAxisBar(d)})
   .attr("width", function(d){  
    return  xAxisBar(hashmap[d]) - xAxisBar(0)})
   .attr("height",40)
   .style("fill","DarkBlue")
}

function clearBarChart(){
    d3.select("#barChart").remove()
}


 


