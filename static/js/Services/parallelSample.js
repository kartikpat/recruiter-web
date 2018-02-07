 $.when(fetchJobApplications(334895), fetchJob()).then(function(a, b){
        console.log(a, b);
    });
     return