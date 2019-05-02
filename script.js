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

    name:"sensitivity_" + (i+1),
    children:kiddoes
    }
    return result
  })
  return children
}


var createSvg = function(data)
{
  body = d3.select("body")
  svg = body.append("svg")
            .attr("width",700)
            .attr("height",700)
            .style("display","block")
            .style("margin","auto")
            .style("background-color","red")
  svg.append('g')

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
  .range(["hsl(0,100%,100%)", "hsl(100,0%,0%)"])
  .interpolate(d3.interpolateHcl)


  var pack = d3.pack()
  .size([diameter - margin,diameter - margin])
    .padding(10);

  var root = d3.hierarchy(data)
               .sum(function(d)
               {

                 var str = d["value"];
                 if(typeof str != "undefined")
                 {

                   str = str.replace(/,/g,"")
                   console.log(str)
                   return parseInt(str)
                 }



                 return parseInt(d.value);



               })
               .sort(function(a,b){ return b.value - a.value;});
  console.log(root)
  var focus = root,
    nodes = pack(root).descendants(),
    view;


  var circle = g.selectAll("circle g")
    .data(nodes)
    .enter()
    .append("circle")
    .attr("class",function(d) {return d.parent ? d.children ? "node":"node node--leaf" : "node node--leaf";})
    .style("fill",function(d){return d.children ? color(d.depth):"#696969";})
    .on("click",function(d){if(focus!= d) zoom(d), d3.event.stopPropagation();});

  var text = g.selectAll("text")
    .data(nodes)
    .enter()
    .append("text")
    .attr("class", "label")
    .style("fill-opacity", function(d) { return d.parent === root ? 1 : 0; })
    .style("display", function(d) { return d.parent === root ? "inline" : "none"; })
    .text(function(d) {
      if(d.depth==6){return d.data.name + " accounts compromised " + d.value}
      else
      {
        return d.data.name;}
      })
    .attr("fill","red");


  var node = g.selectAll("circle,text");

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
