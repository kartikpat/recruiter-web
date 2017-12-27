var MasterColorArray = function(){
    return ['#28354F', '#3A4C70', '#53688c', '#6A82B3', '#9AAACB', '#DAE2F4'];
}
var ColumnChartOptions = function() {
    this.isStacked= true;
    this.tooltip= {
        isHtml: true
    };
    this.chartArea= {
        width: "80%",
        height: "80%"
    };
    this.height= 380;
    this.width= '100%';
    this.legend= {
        position: "top"
    };
    // this.bar= {
    //     groupWidth: 50
    // };
    // this.hAxis= {
    //     baseline: 1,
    //     minValue: 0,
    //     textStyle: {
    //         fontSize: 12,
    //         color: '#757575',
    //         fontName: 'Arial'
    //     }
    // };
    // this.vAxis= {
    //     minValue: 0,
    //     baseline: 0,
    //     baselineColor: '#e8e8e8',
    //     gridlines: {
    //         color: '#e8e8e8'
    //     },
    //     textStyle: {
    //         fontSize: 12,
    //         color: '#757575',
    //         fontName: 'Droid Sans'
    //     }
    // }
};

function drawBarChartGraph(response, elementID) {
    var chartData = new google.visualization.arrayToDataTable([
            ['Active jobs', 'Shortlisted', 'Viewed', 'Saved', 'rejected'],
            ['Job 1', 30, 20, 35, 40],
            ['Job 2', 46, 21, 34, 48],
            ['Job 3', 16, 41, 14, 38],
            ['Job 4', 26, 21, 64, 10]
        ])
    var chart = new google.visualization.BarChart(document.getElementById(elementID));
    var options = new ColumnChartOptions();
    options.colors = new MasterColorArray()
    // options.colors.shift();
    // options.vAxis.title = "No. of Alumni";
    // options.vAxis.titleTextStyle= {
    //         italic:false,
    //         fontSize:12,
    //         color:'#555',
    //         fontName:'Droid Sans'
    // };
    chart.draw(chartData, options);
}