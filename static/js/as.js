$(document).ready(function() {
    $('#m').keypress(function (e) {
        if (e.which == 13) {
            submitfunction();
        }
    });
    jQuery.fn.orderBy = function(keySelector)
    {
        return this.sort(function(a,b)
        {
            a = keySelector.apply(a);
            b = keySelector.apply(b);
            if (a < b)
                return 1;
            if (a > b)
                return -1;
            return 0;
        });
    };

    if(nochatforusers){
        $('#stchat').html('Connecting...');
        setTimeout( check(), 3000);
        setTimeout( checkforpending(), 15000);
        $('#loadingimg').show();
    }else{
        $('#stchat').html('Online');
        $('#status').removeClass('reconn');
    }
    $('#loadmore').hide();
    $('#msgarea').hide();

    $('#typemsgarea').hide();
    (function($) {
        $.fn.hasScrollBar = function() {
            return this.get(0).scrollHeight > this.height();
        }
    })(jQuery);
    var fixdiv = $('#scrlbx').hasScrollBar();
    if(fixdiv){
        $('#status').addClass('statconmrt5');
        $('.logolis').addClass('logolisprt20');
    }
    $('.prchttimeposclose').click(function(){
        var chanhide = $(this).attr('data-channel');
        var type = $('#tt').val();

        $("#li"+chanhide).css({"visibility":"hidden"});
        $('#li'+chanhide).hide();
        $('#li'+chanhide).remove();
        ordermychat();
        $.ajax({
            type: "POST",
            url: ajaxlink,
            data: {"flow":7,"channel":chanhide, 'type':type},
            error: function() {}
        }).done(function(msg) {});
    });
});
$( document ).ready(function() {
    console.log('page ready');
    $(window).focus(function() {
        winactive = true;
    }).blur(function() {
        winactive = false;
    });
    startch(Mainchannel);
    setch(mgr);
    //showinbox();
    //console.log('winactive : '+winactive);
    // $.ajax({
    //         type: "POST",
    //         url: ajaxlink,
    //         data: {flow:2,recid:ppcd},
    //         error: function() {
    //             console.log('There is some error');
    //         }
    //     }).done(function(data) {
    //         var obj = JSON.parse(data);
    //         console.log(obj['mgr2']);
    //         obj['mgr2'].forEach(function(da){
    //             setTimeout(function() {
    //                 newtest(da);
    //             },5000);
    //         })
    //         //var curr = $('#chatingchannel').val();
    //         //$('#ch'+curr).hide();
    //         //createchatwindow(data,channel);
    //     });
});
function getrelative_date(str){
    var a = new Date(str);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    date = date < 10 ? '0'+date : date;
    var time = date + ' ' + month + ' ' + year ;
    return time;
}
function relative_time(str) {
    var a = new Date(str);
    var hours = a.getHours();
    var minutes = a.getMinutes();
    //var sec = a.getSeconds();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}
Array.prototype.unique = function(a){
    return function(){ return this.filter(a) }
}(function(a,b,c){ return c.indexOf(a,b+1) < 0 });
function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}
function ordermychat(){
    $(".showname").orderBy(function() {return +$(this).attr('data-order');}).appendTo("#mychatlistdiv");
}
function shownew(){
    window.scrollTo(0, document.body.scrollHeight || document.documentElement.scrollHeight);
    $("html, body").animate({ scrollTop: $(document).height() }, 1000);
}
function startch(channels,type=0){
    console.log('channel sub called for : '+channels);
    if(type==2){
        chroom2 = channels.split(",");
    // chroom2.forEach(function(entry) {
        chroom2.forEach(function(c){
            channelarray.push(c);
            channelarray = channelarray.unique();
            var channelsub = [];
            channelsub.push(c);
        });
        pubnub.subscribe({
            channels: channelarray,
            withPresence: true
        });
        //console.log(channelarray);
    }else{
        if(channels!='channels'){
            channelarray.push(channels);
            channelarray = channelarray.unique();
            var channelsub = [];
            channelsub.push(channels);
            pubnub.subscribe({
                channels: channelarray,
                withPresence: true
            });
            //console.log(channelarray);
        }
    }

}
function setch(mgr){
    mgra= [];
    mgra.push(mgr);
    pubnub.subscribe({
        channelGroups: mgra
        //withPresence: true
    });
    console.log('mgr done');
}


// pubnub init
var channelarray = [];
var conv2 = false;
var winactive;
var uuid = MainUUID;
var chuser= [];
var host = $('#host').val();
var mt = 0;
var lh = 0;
var sendinglisted = [];
var mainconnect = false;
var pubnub = new PubNub({
    publishKey: key1,
    subscribeKey: key2,
    // authKey: authkey,
    //logVerbosity: true,
    uuid            : MainUUID,
    //heartbeat       : 120,
    //heartbeat_interval: 30
    // ssl : true
    },function(status){
        //console.log(status);
});
// set the time of load
function settime(chroom,data){
    $("input[id=loadtime"+chroom+"]").attr('value',data);
}
// check for connection
function check()
{
    //socket.emit('checkconnection');
    if(conv2){
        $('#stchat').html('Online');
        $('#status').removeClass('reconn');
    }else{
        $('#loadingimg').show();
        $('#status').addClass('reconn');
        $('#stchat').html('Trying to reconnect...');
    }
    setTimeout("check()", 3000);
}
// check for pending msg in cache
function checkforpending(){
    if(sendinglisted.length > 0){
        var f = '';
        for (f in sendinglisted) {
            $('#'+sendinglisted[f].id).removeClass('greytick');
            $('#'+sendinglisted[f].id).addClass('fa fa-warning');
        }
    }
    setTimeout('checkforpending()',10000);
}
remove_item = function (arr, value) {
    var b = '';
    for (b in arr) {
        if (arr[b].id === value) {
            arr.splice(b, 1);
            break;
        }
    }
    return arr;
}
//

window.onload = function() {
    window.addEventListener("beforeunload", function (e) {
        if (sendinglisted.length > 0) {
            var confirmationMessage = 'There are some message which are not sent yet, If you leave now those messages will lost.';
            (e || window.event).returnValue = confirmationMessage; //Gecko + IE
            return confirmationMessage; //Gecko + Webkit, Safari, Chrome etc.
        }else{
            return undefined;
        }
    });
    // Update the online status icon based on connectivity
    window.addEventListener('online', function(e){
        $('#stchat').html('Online');
        $('#status').removeClass('reconn');
        check();
    } );
    window.addEventListener('offline', function(e){
        check();
        $('#loadingimg').show();
        $('#stchat').html('Trying to reconnect...');
        $('#status').addClass('reconn');
        //$('#status').addClass('reconn');
    } );
};

// main pubnub functins here for all msg
pubnub.addListener({
    status: function(statusEvent) {
        if(ccdebug){
            console.log('pubnub status');
            console.log(statusEvent);
        }
        console.log('statusEvent');
        console.log(statusEvent);
                    conv2 = true;
            startch(Mainchannel);
            check();
            mainconnect = true;
            $('#stchat').html('Online');
            $('#status').removeClass('reconn');
            //$('#status').removeClass('statconred');
            $('#loadingimg').hide();
            var userchating = $('#chatingchannel').val();
            if(userchating==='undefined' || userchating==null || userchating==""){
                setTimeout(function(){
                    $('#startmsg').show();
                    $('#loadingimg').hide();
                    //$('#chatarea').hide();
                    chch();
                }, 1500);
            }

            var channels = $('#channels').val();

            startch(channels,1);
            //socket.emit('adduser',channels,host);

            // check for pending msg
            if(sendinglisted.length > 0){
                var f = '';
                for (f in sendinglisted) {
//-----------------------------------------------------------------
//-----------------------------------------------------------------
//-----------------------------------------------------------------
                    // send old msg
              //      socket.emit('chatMessage', sendinglisted[f].chroom, sendinglisted[f].from, sendinglisted[f].message,sendinglisted[f].id);
                    // send notifications
                //    socket.emit('sendnotification', sendinglisted[f].notify, sendinglisted[f].newdata,sendinglisted[f].reciver,sendinglisted[f].from,sendinglisted[f].send_name,sendinglisted[f].send_org,sendinglisted[f].chroom,sendinglisted[f].sendby);
                    // display msg also
                }
            }
            getonlinechk(channels);
            $('#loadingimg').hide();
        }else if(statusEvent.category=='PNConnectedCategory'){
            conv2 = false;
            check();
        }else if(statusEvent.category=='PNTimeoutCategory'){
            conv2 = false;
            check();
        }
    },
    message: function(m) {
        if(ccdebug){
            console.log('pubnub message');
            console.log(m);
        }
        if(m['channel']==Mainchannel){
            console.log('new notification');
            console.log(Mainchannel);
            console.log(m['channel']);
            // console.log($.inArray(channel, channelarray));
            // if($.inArray(channel, openchat)  != -1){
            //     console.log('channel window already created');
            // }else{
            //     //startch(channel);
            //     changechat(m['channel']);
            // }
            //if(winactive){
                //if($.inArray(value, array))

            // }else{
            //     console.log('show notification');
            //     showpushnotification(message);
            // }
        }else{
            // chroom,data,newdata
            console.log('got new msg');
            //console.log(m);
            var chating = $('#chatingchannel').val();
            var data1='';
            chroom = m['channel'];
            var data1 = '';
            var newdata = m['message'];
            if(uuid == newdata['UUID']){
                if(newdata['tt'] >1){
                    newdata['datenew'] = getrelative_date(newdata['time']);
                    newdata['timenew'] = relative_time(newdata['time']);
                    if(uuid == newdata['UUID']){
                        newdata['you'] =1;
                    }else{
                        newdata['you'] = 0;
                    }
                    if(chating==chroom){
                        var dsk = $('#msgarea'+chroom).find('li:last-child').attr("data-name");
                        if(newdata['UUID'] == dsk){
                            data1 = '<li data-name="'+ newdata['UUID'] + '" class="lisclub"><div class="timewaprserclub posrel"><span>'+newdata['timenew']+'</span><p>'+newdata['msg']+'</p>';
                            if(newdata['you']==1){
                                data1 = data1 + '<div class="tickchatim tickchatimtop3 "><span></span></div></div></li>';
                            }else{
                                data1 = data1 + '</div></li>';
                            }
                        }else{
                            if(newdata['you']==1){
                                var newuserimg = $('#img').val();
                                var newname = $('#user').val();
                            }else{
                                var newuserimg = $('#'+chroom+'-userimg').val();
                                var newname = $('#'+chroom+'-name').val();
                            }
                            data1 = '<li data-name="'+ newdata['UUID'] + '"><div class="prchatrightboxchatlischatbox posrel"><img src="'+newuserimg+'" class="userwaim1"/><div class="displbloverfhid"><h4>'+ newname + '<p>'+newdata['msg']+'</p></h4></div><div class="timewaprser"><p>'+newdata['timenew']+'</p>';
                            if(newdata['you']==1){
                                data1 = data1 + '<div class="tickchatim"><span></span></div></div></li>';
                            }else{
                                data1 = data1 + '</div></li>';
                            }
                        }
                    }else{
                        playsound();
                        //console.log(newdata);
                        //$('#msgarea'+chroom).append(data1);
                        var count1 = $('#noti'+chroom).html();
                        count1++;
                        $('#noti'+chroom).html(count1);
                        $('#noti'+chroom).show();
                        //var count2 = $('#bellcount').html();
                        //count2++;
                        //$('#bellcount').html(count2);
                        //$('#bellroc').addClass('prchttimepos');
                        //fixcolor();
                        $('#last_time-'+$('#chroom').val()).html(relative_time(new Date().getTime()));
                        $('#li'+chroom).attr('data-order',new Date().getTime());
                    }
                    $('#msgarea'+chroom).append(data1);
                    //fixcolor();
                    shownew();
                    ordermychat();
                }
            }else{
                newdata['datenew'] = getrelative_date(newdata['time']);
                newdata['timenew'] = relative_time(newdata['time']);
                if(uuid == newdata['UUID']){
                    newdata['you'] =1;
                }else{
                    newdata['you'] = 0;
                }
                if(chating==chroom){
                    var dsk = $('#msgarea'+chroom).find('li:last-child').attr("data-name");
                    if(newdata['UUID'] == dsk){
                        data1 = '<li data-name="'+ newdata['UUID'] + '" class="lisclub"><div class="timewaprserclub posrel"><span>'+newdata['timenew']+'</span><p>'+newdata['msg']+'</p>';
                        if(newdata['you']==1){
                            data1 = data1 + '<div class="tickchatim tickchatimtop3 "><span></span></div></div></li>';
                        }else{
                            data1 = data1 + '</div></li>';
                        }
                    }else{
                        if(newdata['you']==1){
                                var newuserimg = $('#img').val();
                                var newname = $('#user').val();
                            }else{
                                var newuserimg = $('#'+chroom+'-userimg').val();
                                var newname = $('#'+chroom+'-name').val();
                            }
                        data1 = '<li data-name="'+ newdata['UUID'] + '"><div class="prchatrightboxchatlischatbox posrel"><img src="'+newuserimg+'" class="userwaim1"/><div class="displbloverfhid"><h4>'+ newname + '<p>'+newdata['msg']+'</p></h4></div><div class="timewaprser"><p>'+newdata['timenew']+'</p>';
                        if(newdata['you']==1){
                            data1 = data1 + '<div class="tickchatim"><span></span></div></div></li>';
                        }else{
                            data1 = data1 + '</div></li>';
                        }
                    }
                }else{
                    playsound();
                    //console.log(newdata);
                    //$('#msgarea'+chroom).append(data1);
                    var count1 = $('#noti'+chroom).html();
                    count1++;
                    $('#noti'+chroom).html(count1);
                    $('#noti'+chroom).show();
                    //var count2 = $('#bellcount').html();
                    //count2++;
                    //$('#bellcount').html(count2);
                    //$('#bellroc').addClass('prchttimepos');
                    //fixcolor();
                    $('#last_time-'+$('#chroom').val()).html(relative_time(new Date().getTime()));
                    $('#li'+chroom).attr('data-order',new Date().getTime());
                }
                $('#msgarea'+chroom).append(data1);
                //fixcolor();
                shownew();
                ordermychat();
            }

        }


    },
    presence: function(presenceEvent) {
        //console.log('presence');
        //console.log(presenceEvent);
    }
});

function getonlinechk(channels){
    var channelsonline =[];
    chroom2 = channels.split(",");
    console.log(channels);
    chroom2.forEach(function(entry) {
        channelsonline.push(entry);
    });
    pubnub.hereNow(
    {
        channels: channelsonline,
        includeUUIDs: true,
    },
    function (status, response) {
        var d = response.channels;
        if(response.totalChannels >0){
            channelsonline.forEach(function(da){
                if(response.channels[da].occupancy >= 2){
                    $('#online-'+da).addClass('gologronlineuser');
                }else{
                    $('#online-'+da).removeClass('gologronlineuser');
                }
            });
        }
    });
}
function chatchanegnew(channel){
    if(conv2){
        $('#noti'+channel).hide();
        var coount = $('#noti'+channel).html();
        $('#noti'+channel).html('');
        //$('#noti'+channel).show();
        var count2 = $('#bellcount').html();
        var ccccc = count2-coount;
        $('#bellcount').html(ccccc);
        $('#bellroc').removeClass('prchttimepos');
        //$('#chatarea').hide();
        $('#startmsg').hide();
        var chating = $('#chatingchannel').val();
        if(chating!=channel){
            $('#li'+chating).removeClass('active');
            $('#li'+chating).removeClass('prechatiinerlisboxblacktex');
            $('#li'+channel).addClass('active');
            $('#li'+channel).addClass('prechatiinerlisboxblacktex');
            $('#msgarea'+chating).hide();
        }
        $('#maincc'+chating).hide();
        var newm = $('#noti'+channel).html();
        var notify = $('#'+channel+'-notify').val();
        var reciver = $('#'+channel+'-reciver').val();
        var name = $('#'+channel+'-name').val();
        var userkey = $('#'+channel+'-userkey').val();
        var userimg = $('#'+channel+'-userimg').val();
        var usercorg = $('#'+channel+'-usercorg').val();
        $('#notify').val(notify);
        $('#reciver').val(reciver);
        $('#send_name').val(name);
        $('#userr').val(userkey);
        $('#startmsg').hide();
        $('#loadingimg').show();
        $('#scrlbx').toggleClass("newscrl");
        $('.scroller').toggleClass("scrollernew");
        $('.coment').toggleClass('cmnewr');
        //$('.loglismain').toggleClass('sd3');
        $('.serchinpfm').toggleClass('sd3');
        setTimeout(function(){
            $('#chatingchannel').val(channel);
            var ddbb = "<ul id='maincc"+channel+"' class='prchatrightboxmore posrel' > <li id='loadmoreimg"+channel+"' class='dtr' onclick="+"getmore('"+channel+"');"+" ><div class='dateewalisi text-center'><span>Load more</span></div> </li> </ul>";
            var data = '<div class="prchatrightbox posrel"><div class="chatminhdrtopprct"><div class="userinfolefy"><div class="privimgelefytbo"><img src="'+userimg+'" class="privimgelefyt" /> </div><h3 class="posrel pr40">'+name+'<p>'+usercorg+'</p></h3></div></div><div class="scrollerb"><div class="chatwalisii">'+ddbb+' ';
            var mainco = data +"<ul class='prchatrightboxchatlis' id='msgarea"+channel+"'></ul><input type='hidden' id='loadtime"+channel+"' value=''></div></div>";
            $('#fullarea').html(mainco);
            $('#chroom').val(channel);
            //$('#loadmoreimg'+channel).show();
            getinitmsg(channel);
            $('#typemsgarea').show();
            setTimeout(function(){
                $("#loadingimg").hide();
                var oldd = $('#msgarea'+channel).html();
                if(oldd ==''){
                    $('#msgarea'+channel).append('<li class="dtr"><div class="dateewalisi text-center"><span>There are no old messages.</span></div></li>');
                }
            },15000);
        }, 3000);
    }
}
function getinitmsg(channel){
    pubnub.history(
    {
        channel: channel,
        count: 50,
        includeTimetoken: true
    },
    function (status, response) {
        if(ccdebug){
                console.log('status init msg');
                console.log(status);
                console.log('response init msg');
                console.log(response);
            }
        if(status['statusCode']==200){
            settime(channel,response['startTimeToken']);
            var chating = $('#chatingchannel').val();
            if(chating==channel){
                b = '';
                date1 = '';
                date2 = '';
                data1 = '';
                newsec = 0;
                response['messages'].forEach(function(da){
                    var item = da['entry'];
                    item['date'] = getrelative_date(item['time']);
                    item['timenew'] = relative_time(item['time']);
                    date1=item['date'];
                    if(uuid == item['UUID']){
                        item['you'] =1;
                    }else{
                        item['you'] = 0;
                    }
                    if(date1==date2){
                        var newsec = 0;
                    }else{
                        data1 = data1 + '<li class="chatdatebox"><div class="dateewalisi text-center"><span>'+ date1 + '</span></div></li>';
                       var newsec = 1;
                    }
                    date2=date1;
                    var a = item['tt'];
                    if(a == b && newsec !=1){
                        data1 = data1 + '<li class="lisclub" data-name="'+ item['UUID'] + '"><div class="timewaprserclub posrel"><span>'+item['timenew']+'</span><p>'+item['msg']+'</p>';
                        if(item['you']==1){
                            data1 = data1 + '<div class="tickchatim tickchatimtop3"><span></span></div></div></li>';
                        }else{
                            data1 = data1 + '</div></li>';
                        }
                    }else{
                        if(item['you']==1){
                                var newuserimg = $('#img').val();
                                var newname = $('#user').val();
                            }else{
                                var newuserimg = $('#'+channel+'-userimg').val();
                                var newname = $('#'+channel+'-name').val();
                            }
                        data1 = data1 +'<li data-name="'+ item['UUID'] + '"><div class="prchatrightboxchatlischatbox posrel"><img src="'+newuserimg+'" class="userwaim1"/><div class="displbloverfhid"><h4>'+ newname + '<p>'+item['msg']+'</p></h4></div><div class="timewaprser"><p>'+item['timenew']+'</p></div>';
                       if(item['you']==1){
                             data1 = data1 + '<div class="tickchatim"><span></span></div></div></li>';
                         }else{
                             data1 = data1 + '</div></li>';
                         }
                    }
                    b=a;
                });
                $('#msgarea'+channel).append(data1);
            }else{
            }
            shownew();
            $('#loadingimg').hide();
            $('#typemsgarea').show();
        }
    });
}
// get channel history functions
function getmore(channel){
    if(mainconnect){
        $("#loadingimg").show();
        $('#startmsg').hide();
        var start = $("#loadtime"+channel).val();
        $("#loadmoreimg"+channel).css({"visibility":"hidden"});
        getmoreload(channel,start,lh);
        $("#loadingimg").show();
    }
}
function getmoreload(channel,start,lh){
    if(start !=0){
        pubnub.history(
        {
            channel: channel,
            count: 50,
            start : start,
            includeTimetoken: true
        },
        function (status, response) {
            if(ccdebug){
                console.log('status load more');
                console.log(status);
                console.log('response load more');
                console.log(response);
            }
            if(status['statusCode']==200){
                b = '';
                date1 = '';
                date2 = '';
                data1 = '';
                newsec = 0;
                settime(channel,response['startTimeToken']);
                response['messages'].forEach(function(da){
                    var item = da['entry'];
                    item['date'] = getrelative_date(item['time']);
                    item['timenew'] = relative_time(item['time']);
                    date1=item['date'];
                    if(date1==date2){
                        var newsec = 0;
                    }else{
                        data1 = data1 + '<li class="chatdatebox"><div class="dateewalisi text-center"><span>'+ date1 + '</span></div></li>';
                        var newsec = 1;
                    }
                    date2=date1;
                    var a = item['tt'];
                    if(a == b && newsec !=1){
                        data1 = data1 + '<li data-name="'+ item['UUID'] + '" class="lisclub"><div class="timewaprserclub posrel"><span>'+item['timenew']+'</span><p>'+item['msg']+'</p>';
                        if(item['you']==1){
                            data1 = data1 + '<div class="tickchatim tickchatimtop3"><span></span></div></div></li>';
                        }else{
                            data1 = data1 + '</div></li>';
                        }
                    }else{
                        if(item['you']==1){
                                var newuserimg = $('#img').val();
                                var newname = $('#user').val();
                            }else{
                                var newuserimg = $('#'+channel+'-userimg').val();
                                var newname = $('#'+channel+'-name').val();
                            }
                        data1 = data1 +'<li data-name="'+ item['UUID'] + '"><div class="prchatrightboxchatlischatbox posrel"><img src="'+newuserimg+'" class="userwaim1"/><div class="displbloverfhid"><h4>'+ newname + '<p>'+item['msg']+'</p></h4></div><div class="timewaprser"><p>'+item['timenew']+'</p>';
                        if(item['you']==1){
                            data1 = data1 + '<div class="tickchatim"><span></span></div></div></li>';
                        }else{
                            data1 = data1 + '</div></li>';
                        }
                    }
                    b=a;
                });
                $('#msgarea'+channel).prepend(data1);
                $("#loadingimg").hide();
            }
            $("#loadmoreimg"+channel).css({"visibility":"visible"});
        });
    }else{
        $('#startmsg').hide();
        $('#loadingimg').hide();
        $("#loadmoreimg").hide();
        $('#maincc'+channel).append('<li class="dtr"><div class="dateewalisi text-center"><span>There are no old messages.</span></div></li>');
    }
    $("#loadingimg").hide();
}

function submitfunction() {
    if(conv2){
        $('#startmsg').hide();
        var from = uuid;
        if($('#m').val() !=''){
            var len = $('#m').val().length;
            if(len > 1000){
                var ll = Math.round(len/1000);
                for(l=0;l<ll;l++){
                    l*1000;
                    var tempids = guid();
                    var data = $('#m').val().substr(l*1000,l+1*1000);
                    var message = {"UUID":$('#usrr').val(),"time":new Date().getTime(),"usr":$('#usr').val(),"name":$('#user').val(),"tt":$('#tt').val(),"msg":data,"img":$('#img').val(),"type":1};
                    var chroom = $('#chroom').val();
      //              socket.emit('chatMessage', chroom, from, message,tempids);
                    publishMsgToServer(chroom,message,$('#user').val(),tempids);
                    var dsk = $('#msgarea'+$('#chroom').val()).find('li:last-child').attr("data-name");
                    if(dsk == from){
                        var sendthat = '<li data-name="'+ from + '" class="lisclub"><div class="timewaprserclub posrel"><span>'+relative_time(new Date().getTime())+'</span><p>'+data+'</p><div class="tickchatim tickchatimtop3"><span id="'+tempids+'" class="greytick"></span></div></div></li>'
                    }else{
                        var sendthat = '<li data-name="'+ from + '"><div class="prchatrightboxchatlischatbox posrel"><img src="'+$('#img').val()+'" class="userwaim1"/><div class="displbloverfhid"><h4>'+$('#user').val()+'<p>'+data+'</p></h4></div><div class="timewaprser"><p>'+relative_time(new Date().getTime())+'</p><div class="tickchatim"><span id="'+tempids+'" class="greytick"></span></div></div></li>';
                    }
                    var mmm = data;
                    var reciver = $('#reciver').val();
                    var senddata = $('#user').val()+' : '+mmm;
                    var newdata = {"type":1,"data":senddata,"time":new Date().getTime(),"data1":chroom,"data2":''};
    //                socket.emit('sendnotification', $('#notify').val(), newdata,reciver,from,$('#send_name').val(),$('#send_org').val(),$('#chroom').val(),$('#tt').val());
                    publishNotiToServer($('#notify').val(), newdata,reciver,$('#user').val(),$('#send_org').val(),$('#chroom').val(),$('#tt').val());
                    sendinglisted.push({'id':tempids,'chroom':chroom,'message':message,'reciver':reciver,'from':$('#user').val(),'send_name':$('#send_name').val(),'send_org':$('#send_org').val(),'notify':$('#notify').val(),'newdata':newdata,'sendby':$('#tt').val()});
                    $('#msgarea'+$('#chroom').val()).append(sendthat);
                    $('#last_time-'+$('#chroom').val()).html(relative_time(new Date().getTime()));
                    //fixcolor();
                    shownew();
                }
                $('#m').val('');
            }else{
                var tempids = guid();
                var message = {"UUID":$('#usrr').val(),"time":new Date().getTime(),"usr":$('#usr').val(),"name":$('#user').val(),"tt":$('#tt').val(),"msg":$('#m').val(),"img":$('#img').val(),"type":1};
                var chroom = $('#chroom').val();
  //              socket.emit('chatMessage', chroom, from, message,tempids);
                publishMsgToServer(chroom,message,from,tempids);
                var dsk = $('#msgarea'+$('#chroom').val()).find('li:last-child').attr("data-name");
                if(dsk == from){
                    var sendthat = '<li data-name="'+ from + '" class="lisclub"><div class="timewaprserclub posrel"><span>'+relative_time(new Date().getTime())+'</span><p>'+$('#m').val()+'</p><div class="tickchatim tickchatimtop3"><span id="'+tempids+'" class="greytick"></span></div></div></li>'
                }else{
                    var sendthat = '<li data-name="'+ from + '"><div class="prchatrightboxchatlischatbox posrel"><img src="'+$('#img').val()+'" class="userwaim1"/><div class="displbloverfhid"><h4>'+$('#user').val()+'<p>'+$('#m').val()+'</p></h4></div><div class="timewaprser"><p>'+relative_time(new Date().getTime())+'</p><div class="tickchatim "><span id="'+tempids+'" class="greytick"></span></div></div></li>';
                }
                $('#last_time-'+$('#chroom').val()).html(relative_time(new Date().getTime()));
                $('#msgarea'+$('#chroom').val()).append(sendthat);
                //fixcolor();
                shownew();
                var mmm = $('#m').val();
                var reciver = $('#reciver').val();
                var senddata = $('#user').val()+' : '+mmm;
                var newdata = {"type":1,"data":senddata,"time":new Date().getTime(),"data1":chroom,"data2":''};

//                socket.emit('sendnotification', $('#notify').val(), newdata,reciver,from,$('#send_name').val(),$('#send_org').val(),$('#chroom').val(),$('#tt').val());
                publishNotiToServer($('#notify').val(), newdata,reciver,$('#user').val(),$('#send_org').val(),$('#chroom').val(),$('#tt').val());
                sendinglisted.push({'id':tempids,'chroom':chroom,'message':message,'reciver':reciver,'from':$('#user').val(),'send_name':$('#send_name').val(),'send_org':$('#send_org').val(),'notify':$('#notify').val(),'newdata':newdata,'sendby':$('#tt').val()});
                $('#m').val('');

            }
            $.ajax({
                type: "POST",
                url: ajaxlink,
                data: {"flow":4,"channel":$('#chroom').val(), 'cdata':senddata},
                error: function() {
                }
            }).done(function(msg) {
            });
            //new Date().getTime();attr("href", "http://www.w3schools.com/jquery");
            $('#li'+$('#chroom').val()).attr('data-order',new Date().getTime());
            ordermychat();
        }
    }else{
        check();
    }
}

function publishMsgToServer(chroom,msg,from,tempid){
    pubnub.publish(
    {
        message: msg,
        channel: chroom,
        sendByPost: true, // true to send via post
        storeInHistory: true, //override default storage options
        // meta: {
        //     "cool": "meta"
        // }   // publish extra meta with the request
    }, function (status, response) {
        if(ccdebug){
                console.log('status publish msg to server');
                console.log(status);
                console.log('response publish msg to server');
                console.log(response);
            }
        if (status.error) {
            // handle error
            console.log(status);
        } else {
            console.log("message Published w/ timetoken", response.timetoken);
            $('#'+tempid).removeClass('greytick');
            $('#'+tempid).removeClass('fa fa-warning');
            remove_item(sendinglisted,tempid);
        }
    });
}

function publishNotiToServer(chroom,message,reciver,from,org,subchroom,sendby) {
    pubnub.publish(
    {
        message: message,
        channel: chroom,
        sendByPost: true, // true to send via post
        storeInHistory: true, //override default storage options
        // meta: {
        //     "cool": "meta"
        // }   // publish extra meta with the request
    }, function (status, response) {
        if(ccdebug){
                console.log('status notiserver');
                console.log(status);
                console.log('response notiserver');
                console.log(response);
            }
        if (status.error) {
            // handle error
            console.log(status)
        } else {
            console.log("notify Published w/ timetoken", response.timetoken)
        }
    });
    $.ajax({
        type: "POST",
        url: ajaxlink,
        data: {"flow":61,"channel":chroom,"sendby":sendby,"from":from,"org":org,"subchroom":subchroom,"msg":message},
        error: function() {
            console.log('there is some error please check it');
        }
    }).done(function(msg) {
        //console.log(msg);
    });
}
