import * as d3 from 'd3'

var colorChooser = (value) => {
  var ramp = d3.scaleLinear().domain([0,1]).range([135,0]);
  return color = "hsl("+ (ramp(value)>75? ramp(value)+135 : ramp(value) ) +", 100%, 50%)";
}

var dataSort = (data) => {
    let statistics = [];
    let total = 0;
    let res = [];
    data.statements.results.bindings.forEach(function(item){
      let prop1 = item.prop1.value,
          prop2 = item.prop2.value;
      console.log(prop1,prop2);
      if( prop1 in statistics){
          if( prop2 in statistics[prop1] ){
            statistics[prop1][prop2] = statistics[prop1][prop2]+1;
            total++;
          }else{
            statistics[prop1][prop2] = 1;
            total++;
          }
      }else{
          statistics[prop1] = [];
          statistics[prop1][prop2] = 1
          total++;
      }
    })
    for (var k1 in statistics){
      for (var k2 in statistics[k1]){
        statistics[k1][k2] = statistics[k1][k2]/total
        var newItem = {};
            newItem.prop1 = k1;
            newItem.prop2 = k2;
            newItem.value = statistics[k1][k2];
        res.push(newItem);
      }
    }
    return res;
}

const create = (el, state) => {
    if(el && state.data.statements) {
    // console.log("CREATE");
    let data = null;
    state.data.forEach(function(item){
      if ( item.zone == state.zone) data = item;
    })
    var div = d3.select("el");
    var width = state.display.zones.main.width,
        height = state.display.zones.main.height;
    data = dataSort(data);

    var x_elements = d3.set(data.map(function( item ) { return item.prop1; } )).values(),
        y_elements = d3.set(data.map(function( item ) { return item.prop2; } )).values()

    var itemSizeX = width/x_elements.length,
        itemSizeY = height.height/y_elements.length

    var xScale = d3.scaleBand()
        .domain(x_elements)
        .range([0, width]);

    var xAxis = d3.axisBottom()
        .scale(xScale)

    var yScale = d3.scaleBand()
        .domain(y_elements)
        .range([0, height]);

    var yAxis = d3.axisLeft()
        .scale(yScale)

      console.log(div);
      var cells = div.selectAll('rect')
          .data(data)
          .enter().append('g').append('rect')
          .attr('class', 'cell')
          .attr('width', itemSizeX)
          .attr('height', itemSizeY)
          .attr('x', function(d) { return xScale(d.prop2); })
          .attr('y', function(d) { return yScale(d.prop2); })
          .attr('fill', function(d) { console.log(colorChooser(d.value));return colorChooser(d.value); });

      div.append("g")
          .attr("class", "y axis")
          .call(yAxis)
          .selectAll('text')
          .attr('font-weight', 'normal');

      div.append("g")
          .attr("class", "x axis")
          .call(xAxis)
          .selectAll('text')
          .attr('font-weight', 'normal')
          .style("text-anchor", "start")
          .attr("dx", ".8em")
          .attr("dy", ".5em")
          .attr("transform", function (d) {
              return "rotate(-65)";
          });
    }
}

const update = (el, state) => {
    // console.log("UPDATE",el);
    // console.log("UPDATE",state);
}

const destroy = (el) => {

}

exports.create = create
exports.destroy = destroy
exports.update = update
