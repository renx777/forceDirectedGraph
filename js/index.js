let request = new XMLHttpRequest();
request.addEventListener("load", loaded);

function loaded() {
  const data = JSON.parse(request.responseText);

  var nodes = data.nodes;
  var links = data.links;

  // sets up svg
  var svg = d3.select("svg"),
      width = +svg.attr("width"),
      height = +svg.attr("height");

  // handle color of the nodes i gueess,gotta know what schemeCategory method does
  var color = d3.scaleOrdinal(d3.schemeCategory20);

//  fit graph within boundaries
 const forceX = d3.forceX(width / 4).strength(0.05)
const forceY = d3.forceY(height / 4).strength(0.05)


  
  
  
  var simulation = d3
  
  .forceSimulation()
//  changing link distance troubled me so much,but at end was so simple
  .force("link", d3.forceLink().distance(100))
 
  .force('x', forceX)
  .force('y',  forceY)
  
  .force("charge", d3.forceManyBody())
  .force("center", d3.forceCenter(width /2, height / 2))
  

  
  
  
  // creates lines in graph,
  var link = svg
  .append("g")
  .attr("class", "links")
  .selectAll("line")
  .data(links)
  .enter()
  .append("line")
  .attr("stroke-width", function(d) {
    return Math.sqrt(3);
  });

  //creates nodes..for this example,you need to set node to images
  var node = svg
  .append("g")
  .attr("class", "nodes")
  .selectAll(".node")
  //pass node data
  .data(nodes)
  .enter()
.append("image")
      .attr("xlink:href",function(d){return "https://cdn.rawgit.com/hjnilsson/country-flags/master/svg/"+d.code+".svg" })
      .attr("x", -8)
      .attr("y", -8)
      .attr("width", 16)
      .attr("height", 16)
 
      
  
  .call(
    d3
    .drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended)
  );

  
  
  node.append("title")
      .text(function(d) { return d.country; });
  
  simulation.nodes(nodes).on("tick", ticked);

  simulation.force("link").links(links);

  function ticked() {
    link
      .attr("x1", function(d) {
      return d.source.x;
    })
      .attr("y1", function(d) {
      return d.source.y;
    })
      .attr("x2", function(d) {
      return d.target.x;
    })
      .attr("y2", function(d) {
      return d.target.y;
    });

    node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
    
    
  }

  function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
}
request.open(
  "GET",
  "https://www.cs.mun.ca/~h65ped/Public/country%20data%20for%20force%20directed%20graph/countries.json",
  true
);
request.send(null);