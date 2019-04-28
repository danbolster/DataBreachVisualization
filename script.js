var dataP = d3.csv("DataBreachData.csv");


dataP.then(function(d)
{
  createSvg(d)
  conversion(d)
}
,function(err)
{
  console.log(err)
});


var convertToHierarchy = function(data,attribute,value)
{
  if (attribute == "entity"){return leafNodes(data)}

  else
  {
    return {
      name:value,
      children:listUp(data,attribute)
    }
  }
}


var listUp = function(data,attribute)
{
  lists = {}
  data.forEach(function(d)
  {
    if (lists.hasOwnProperty(d[attribute]) == false)
    {
      lists[d[attribute]]=[d];
    }
    else
    {
      lists[d[attribute]].push(d)
    }
  })
  console.log(lists)
}

var conversion = function(data)
{
  var children = listUp(data,"DATA SENSITIVITY")
  {
    children.forEach(function(d))

  }
}

var leafNodes = function(data)
{
  var leaves = data.map(function(d)
  {
    return {
      entity:d.Entity,
      recordsLost:d["records lost"],
      story:d.story
    }
  })
return leaves
}

var createSvg = function(data)
{
  body = d3.select("body")
  svg = body.append("svg")
            .attr("width",800)
            .attr("height",800)
            .style("background-color","orange")
            .style("display","block")
            .style("margin","auto")

}
