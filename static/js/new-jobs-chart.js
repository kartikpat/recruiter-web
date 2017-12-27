$(document).ready(function(){
     google.charts.load('current', {
        'packages': ['corechart']
    }).then(function() {
        drawBarChartGraph(null, 'new-jobs-chart');
    });
})