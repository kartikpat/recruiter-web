 $.when(fetchJob(), fetchCalendars()).then(function(a, b){
        pubsub.publish("callJobList", 1);
    });
     return