var lockResize = false;
$(document).ready(function(){
     google.charts.load('current', {
        'packages': ['corechart']
    }).then(function() {
        drawBarChartGraph(null, 'new-jobs-chart');
    }); 
})
$(window).resize(function () {
    if(lockResize)
        return
    lockResize = true;
    setTimeout(function(){
        drawBarChartGraph(null, 'new-jobs-chart');
        console.log('calling timer')
        lockResize = false;
    }, 250)
});