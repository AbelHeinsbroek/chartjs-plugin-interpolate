//import Chart from 'chart.js'

Chart.Interaction.modes['interpolate'] = function(chart, e, options) {

  var items = []

  var xScale = chart.scales['x-axis-0'];
  var yScale = chart.scales['y-axis-0'];

  var xValue = xScale.getValueForPixel(e.x)

  var datasetIndex = 0


  for(var dataset in chart.data.datasets) {

      if(!chart.data.datasets[datasetIndex].interpolate) {
        datasetIndex += 1
        continue
      }

      var data = chart.data.datasets[datasetIndex].data


      var index = data.findIndex(function(o) { return o.x >= xValue })

      if(index == -1) {
        datasetIndex += 1
        continue
      }

      var prev = data[index-1]
      var next = data[index]
      
      
      if(prev && next) {
        var slope = (next.y-prev.y)/(next.x-prev.x)
        var interpolatedValue = prev.y + (xValue - prev.x) * slope
      }

      if(chart.data.datasets[datasetIndex].steppedLine && prev) {
        interpolatedValue = prev.y
      }

      var label = _.round(interpolatedValue, 2)
      

      if(isNaN(interpolatedValue)) {
        datasetIndex += 1
        continue
      }


      var fakePoint = {

        value: interpolatedValue,

        tooltipPosition: function() {
          return this._model
        },
        hasValue: function() {
          return true
        },
        _model: {
            x: e.x,
            y: yScale.getPixelForValue(interpolatedValue)
        },
        _datasetIndex: datasetIndex,
        _index: 0,
        _xScale: {
          getLabelForIndex: function(index, dataset) {
            return xValue
          }
        },
        _yScale: {
          label: label,
          getLabelForIndex: function(index, dataset) {
            return this.label 
          }
        }
      }

      items.push(fakePoint)
      datasetIndex += 1
    }


  // add other items
  var xItems = Chart.Interaction.modes.x(chart, e, options)
  for(var index in xItems) {
    var item = xItems[index]
    if(!chart.data.datasets[item._datasetIndex].interpolate) {
      items.push(item)
    }
  }

  return items 
}
