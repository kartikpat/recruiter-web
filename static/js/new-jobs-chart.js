var lockResize = false;
$(document).ready(function(){
     loadChartsLibrary();
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

function loadChartsLibrary(){
    google.charts.load('current', {
        'packages': ['corechart']
    })
    google.charts.setOnLoadCallback(function(){
        console.log('loaded charts library');
        pubsub.publish("loadedChartLibrary", 1)
    })
}