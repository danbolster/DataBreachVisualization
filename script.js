var dataP = d3.csv("DataBreachData.csv");



dataP.then(function(d)
{
  createSvg(d)
  getSensitivities(d)
}
,function(err)
{
  console.log(err)
});


var getSensitivities = function(data)
{
  console.log("hi")
  data.forEach(function(d,i)
  {




    if(i!=0)
  })
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
