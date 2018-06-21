var downloads;
var views;    

function recruiterLimit(){
    
    function saveToStore(aData){
        downloads=aData.data.download;
        views=aData.data.view;
    }    
    

    function getDownloadLimit(){
        return downloads;
    }
    
    function getViewsLimit(){
        return 0;
    }
    
    function updateViewCount(count){
        views=count;
        return
    }
    
    function updateDownloadCount(count){
        downloads=count;
        return
    }

    return{
        saveToStore:saveToStore,
        getDownloadLimit:getDownloadLimit,
        getViewsLimit:getViewsLimit,
        updateViewCount:updateViewCount,
        updateDownloadCount:updateDownloadCount
    }

}