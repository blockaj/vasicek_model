var values;

$(document).ready(function(){
	$('.regen').click(function(){
		regenerate();
	});
});

function getInputValues() {
	var rVal = parseFloat($('#r').val()),
		t = parseFloat($('#t').val())
		rateOfReversion = parseFloat($('#a').val()),
		volitility = parseFloat($('#v').val()),
		historicalMean = parseFloat($('#b').val());
	var data = [rVal, t, volitility, rateOfReversion, historicalMean];
	return data;
}

function formatDataForPlotting(input) {
	console.log('Input: ' + input);
	var plottingPoints = vModel(input);
	var dataObj = [];
	var dataObjTwo = [];
	for (var i = 0; i < plottingPoints[1].length; i++) {
		dataObj.push({x: plottingPoints[0][i], y: plottingPoints[1][i]});
		dataObjTwo.push({x: plottingPoints[0][i], y: plottingPoints[2][i]});
	}
	console.log(dataObj);
	return [dataObj, dataObjTwo];
}

function plot() {
	values = getInputValues();
	var dataObj = formatDataForPlotting(values);
	var chart = new CanvasJS.Chart("chartContainer", {
		axisY: {
			title: "S",
			titleFontSize: 18
		},
		axisX: {
			title: "Time",
			titleFontSize: 18
		},
       	data: [
      		{
        		type: "line",
        		dataPoints: dataObj[0]
      		}
      	]	
    });
    
    //chart = {};
    var weinerChart = new CanvasJS.Chart("weinerProcess", {
		axisY: {
			minimum: -2,
			maximum: 2,
			title: "W",
			titleFontSize: 18
		},
		axisX: {
			title: "Time",
			titleFontSize: 18
		},
    	data: [
    		{
    			type: "line",
    			dataPoints: dataObj[1]
    		}
    	]
    });
    weinerChart.render();
    chart.render();
    //weinerChart = {};
}

function vModel(input) {
	var plot;
	var r = [];
	var w = [];
	w[0] = 0;
	if (input[0] !== 0) {
		r[0] = input[0];
		var t = input[1];
		var sigma = input[2];
		var a = input[3];
		var b = input[4];
		
		var dt = 1/(3*365);
		var n = Math.floor(t / dt);
		//var expRD = Math.pow(Math.E, *dt),
		//	expSD = Math.pow(Math.E, Math.pow(sigma, 2)*dt);
		//var down = expRD*(1-Math.sqrt(expSD-1)),
		//	up = expRD*(1+Math.sqrt(expSD-1));
		var dx = Math.sqrt(dt);
		var p = 0.5;
		for (var i = 0; i < n; i++) {
			var trueOrNot = Math.random() < p;
			if (trueOrNot) {
				r[i + 1] = r[i] + a * (b - r[i]) * dt - sigma * dx;
				w[i + 1] = w[i] - dx;
			} else {
				r[i + 1] = r[i] + a * (b - r[i]) * dt + sigma * dx;
				w[i + 1] = w[i] + dx;
			}
		}
		plot = linspace(0, t, n+1);
	}
	console.log(r);
	return [plot, r, w];
}

function linspace(xO, xT, n) {
	var points = [];
	if (!n) {
		n = 100;
	}
	var range = xT - xO;
	var increment = range / n;
	for (var i = 1; i < n+1; i++) {
		var value = increment * i;
		points.push(value);
	} 
	return points;
}

function regenerate() {
	var chartData = formatDataForPlotting(values);
	var chart = new CanvasJS.Chart("chartContainer", {
		axisY: {
			title: "S",
			titleFontSize: 18
		},
		axisX: {
			title: "Time",
			titleFontSize: 18
		},
       	data: [
      		{
        		type: "line",
        		dataPoints: chartData[0]
      		}
      	]	
    });
    
    var weinerChart = new CanvasJS.Chart("weinerProcess", {
		axisY: {
			minimum: -2,
			maximum: 2,
			title: "W",
			titleFontSize: 18
		},
		axisX: {
			title: "Time",
			titleFontSize: 18
		},
    	data: [
    		{
    			type: "line",
    			dataPoints: chartData[1]
    		}
    	]
    });
    weinerChart.render();
    chart.render();
}