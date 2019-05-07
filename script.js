var dataP = d3.csv("DataBreachData.csv");


dataP.then(function(d)
{

  heirarchy =
  {

    name:"breaches",
    children:conversion(d)

  }
  createSvg()
  drawCircle(heirarchy)


}
,function(err)
{
  console.log(err)
});

var listUpFirst = function(data,attribute)
{
  lists = []
  data.forEach(function(d,i)
  {
    if(i==0){return;}

    if (lists[d[attribute]]==null)
    {
      lists[d[attribute]]=[d];
    }
    else
    {
      lists[d[attribute]].push(d)
    }
  })
  return lists
}


var listUp = function(data,attribute)
{
  lists = []
  data.forEach(function(d,i)
  {
    if (lists[d[attribute]]==null)
    {
      lists[d[attribute]]=[d];
    }
    else
    {
      lists[d[attribute]].push(d)
    }
  })
  return lists
}


var conversion = function(data)
{
  var children = listUpFirst(data,"DATA SENSITIVITY")
  children.shift()

  //children is on top
  var children = children.map(function(d,i)
  {
    var list = listUp(d,"METHOD")
    var keys = Object.keys(list)


    var kiddoes = keys.map(function(d4)
    {
      var sectors = listUp(list[d4],"SECTOR")


      var sectorKeys = Object.keys(sectors)
      var sectorList = sectorKeys.map(function(d5)
      {

        result =
        {
          name:d5,
          children:sectors[d5].map(function(d6)
          {
            result2 =

            {
              value:(d6["records lost"]),
              name:d6["Entity"],
              story:d6["story"]

            }
            return result2



          })



        }
      return result
      })


      result =
      {
        name:d4,
        children:sectorList
      }
      return result
    })

    /*
    var kiddies = keys.map(function(d2)
    {
      result = {
        name:d2,
        children:kiddoes
      }

    return result

    })
    */

    result =
    {

    name:"sensitivity_" +(i+1),
    children:kiddoes
    }
    return result
  })
  return children
}


var createSvg = function()
{
  body = d3.select("body")
  svg = body.append("svg")
            .attr("width",950)
            .attr("height",950)
            .style("display","block")
          
            .classed("graph","true")



}





var traceParents = function(node)
{
  d3.select("#accounts")
    .text("accounts compromised: " + node.value)


  if(node.depth==4)
  {
    d3.select("#story")
      .text("story: " + node.data.story)
  }
  else
  {
    d3.select("#story")
      .text("story: ")
  }

  var depths = ["total","sensitivity","method","sector","company"]
  var values = ["","","","",""]

  while(node.parent != null)
  {
    values[node.depth] = node.data.name
    //console.log(depths[node.depth] + ":" + node.data.name + " accounts compromised: " + node.value)
    //console.log("#" + depths[node.depth])

    var spot = d3.select("#" + depths[node.depth])
                 .text(node.data.name)
    node = node.parent


  }

  values.forEach(function(d,i)
  {
    d3.select("#" + depths[i])
          .text(depths[i] + ": " + values[i])
  })









}






var drawCircle = function(data)
{
  var svg = d3.select("svg"),
      margin = 20,
      diameter = +svg.attr("width"),
      g = svg.append("g")
      .attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");


  var color = d3.scaleLinear()
  .domain([4,-1])
  .range(["hsl(0,100%,100%)", "hsl(300,1%,1%)"])
  .interpolate(d3.interpolateHcl)


  var pack = d3.pack()
  .size([diameter - margin,diameter - margin])
    .padding(14);

  var root = d3.hierarchy(data)
               .sum(function(d)
               {

                 var str = d["value"];
                 if(typeof str != "undefined")
                 {

                   str = str.replace(/,/g,"")
                   return parseInt(str)
                 }



                 return parseInt(d.value);
               })

               .sort(function(a,b){ return b.value - a.value;});
  var focus = root,
    nodes = pack(root).descendants(),
    view;



  var circle = g.selectAll("circle g")
    .data(nodes)
    .enter()
    .append("circle")
    .attr("class",function(d) {return d.parent ? d.children ? "node":"node node--leaf" : "node node--leaf";})
    .style("fill",function(d){return d.children ? color(d.depth):"#696969";})
    .on("click",function(d)
    {
      traceParents(d)
      /*
      if(d.depth == 1){console.log("Sensitivity: " + d.data.name)}
      else if(d.depth ==2){console.log("Method: " + d.data.name)
      console.log(d.value)

      }

      else if(d.depth ==3){console.log("Sector: " + d.data.name)}
      else if(d.depth ==4){console.log("Entity: " + d.data.name)
      console.log(d.data.story)
      */


      if(focus!= d) zoom(d), d3.event.stopPropagation();})

    .on("mouseover",function(d)
    {
        d3.select(this.parent).select("text")
        .text(function(d1)
        {
          console.log(d)
          return d.value
        })


    })



  var text = g.selectAll("text")
    .data(nodes)
    .enter()
    .append("text")
    .attr("class", "label")
    .style("fill-opacity", function(d) { return d.parent === root ? 1 : 0; })
    .style("display", function(d) { return d.parent === root ? "inline" : "none"; })
    .text(function(d) {
      if(d.depth!=5)
      {
        return d.data.name;
      }
    })
    .style("font-size","20pt")
    .attr("fill","black")

  var rect = g.selectAll("rect")
      .data(nodes)
      .enter()
      .append("rect")
      .attr("class", "box")

  var node = g.selectAll("circle,text,rect");

  svg.style("background",color(-1))
    .on("click",function(){zoom(root);});

  zoomTo([root.x, root.y,root.r *2 + margin]);

  function zoom(d)
  {
    var focus0 = focus; focus = d;

    var transition = d3.transition()
      .duration(d3.event.altKey ? 7500 : 750)
      .tween("zoom", function(d){
        var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin]);
                  return function(t) { zoomTo(i(t)); };
                });

    transition.selectAll("text")
        .filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
        .style("fill-opacity", function(d) { return d.parent === focus ? 1 : 0; })
        .on("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
        .on("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
  }


  function zoomTo(v)
  {
    var k = diameter / v[2]; view = v;
    node.attr("transform", function(d) { return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")"; });
    circle.attr("r", function(d) { return d.r * k; });
  }

}
