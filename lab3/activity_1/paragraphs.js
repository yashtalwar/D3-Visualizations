// **** Your JavaScript code goes here ****


d3.select("body").select("#headerTable").style("background","lightgray").style("font-family","Sans-serif")

d3.csv("baseball_hr_leaders_2017.csv").then(function(dataset) {

	d3.select("body").select("#homerun-leaders").selectAll("p")
	  .data(dataset)
	  .enter()
	  .append("p")
	  .text(function(d,i){return (i +1) + ". " + d.name + " rank: " + d.rank + " homeruns: " + d.homeruns})
	  .style("font-weight",function(d){
	  	if(d.name == "Giancarlo Stanton"){
	  		return "bold"
	  	}else{
	  		return "normal"
	  	}
	  })

	d3.select("body").select("#homerun-table").select("tbody").selectAll("tr")
	  .data(dataset)
	  .enter()
	  .append("tr")
	  .append("td")
	  .text(function(d){return d.rank})
	  .style("text-align","center")

	 var tr = d3.select("tbody").selectAll("tr").append("td").text(function(d){return d.name})
	 tr = d3.select("tbody").selectAll("tr").append("td").text(function(d){return d.homeruns}).style("text-align","center")
})
