var dataP = d3.csv("DataBreachData.csv");


dataP.then(function(d)
{
  //createSvg(d)
  heirarchy =
  {
    name:"breaches",
    children:conversion(d)

  }
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

    // is second
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
              value:parseInt(d6["records lost"]),
              entity:d6["Entity"],
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


    var kiddies = keys.map(function(d2)
    {
      result = {
        name:d2,
        children:kiddoes
      }

    return result
    })


    result =
    {

    name:"sensitivity_" + (i+1),
    children:kiddies
    }
    return result
  })
  return children
}

var createSvg = function(data)
{
  body = d3.select("body")
  svg = body.append("svg")
            .attr("width",800)
            .attr("height",800)
            .style("display","block")
            .style("margin","auto")
  svg.append('g')
  svg.append('g')
  svg.append('g')

}



var drawCircle = function(data)
{
  var root = d3.hierarchy(data)
  var pack = d3.pack(root)
    .size([800,800])
    .padding(10)
  var hierarchy = d3.hierarchy(root)
    .sum(function(d){return d.value})
    .sort(function(a,b){b.value-a.value})
  var color = d3.scaleLinear()
    .domain([0,5])
    .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])

  var svg = d3.select("svg g")
    .style("display", "block")
    .style("margin", "0 -14px")
    .style("width", "calc(100% + 28px)")
    .style("height", "auto")
    .style("background", color(0))
    .style("cursor", "pointer")
    .on("click", () => zoom(root));







  var node = svg.append("g")
        .selectAll("circle")
        .data(root.descendants().slice(1))
        .join("circle")
        .attr("fill",d=>d.children ? color(d.depth):"white")
        .attr("pointer-events", d=> !d.children ? "none":null)
        .on("mouseover", function() { d3.select(this).attr("stroke", "#000"); })
        .on("mouseout", function() { d3.select(this).attr("stroke", null); })
        .on("click", d => focus !== d && (zoom(d), d3.event.stopPropagation()));

}
