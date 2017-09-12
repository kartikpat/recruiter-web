var ajaxlink = "http://www.iimjobs.com/pub_chat/chat_ajax.php"


var channelarray = [];
var chatenable = true;
var conv2 = false;
var winactive = true;
var uuid = MainUUID;
var chuser = [];
var openchat = [];
var hidechat = [];
var chathh = {};
var maxopenchat;
var pubnub = new PubNub({
    publishKey: key1,
    subscribeKey: key2,
    uuid: MainUUID
}, function(status) {});
$(document).ready(function() {
    $(window).focus(function() {
        winactive = true
    }).blur(function() {
        winactive = false
    });
    if ($(window).width() < 900) {
        chatenable = false;
        maxopenchat = 1
    } else {
        if ($(document).width() < 1000) {
            chatenable = true;
            maxopenchat = 1
        } else {
            if ($(document).width() < 1450) {
                chatenable = true;
                maxopenchat = 2
            } else {
                chatenable = true;
                maxopenchat = 3
            }
        }
    }
    if (chatenable) {
        startch(Mainchannel, 0);
        setch(mgr);
        showinbox()
    }
});

function removetypinginco() {
    setTimeout(function() {
        $(".nchatmndivperch").find(".typing-show").remove();
        removetypinginco()
    }, 5000)
}

function startch(channels, type) {
    if (type == 1) {
        channels.forEach(function(c) {
            channelarray.push(c);
            channelarray = channelarray.filter(onlyUnique);
            var channelsub = [];
            channelsub.push(c)
        });
        pubnub.subscribe({
            channels: channelarray,
            withPresence: true
        })
    } else {
        if (channels != "channels") {
            channelarray.push(channels);
            channelarray = channelarray.filter(onlyUnique);
            var channelsub = [];
            channelsub.push(channels);
            pubnub.subscribe({
                channels: channelarray,
                withPresence: true
            })
        }
    }
}

function setch(mgr) {
    mgra = [];
    mgra.push(mgr);
    pubnub.subscribe({
        channelGroups: mgra
    })
}

function showpushnotification(message) {
    var data = message;
    var msg = data["data"];
    keepupdatetitle("New message received");
    var noticount = $("#notifycount").attr("data-value");
    noticount++;
    $("#notifycount").attr("data-value", noticount);
    $("#notifycount").html(noticount);
    $("#notifycount").show();
    $("#notifymain").removeClass("notifynone");
    if ((navigator.userAgent.indexOf("Opera") || navigator.userAgent.indexOf("OPR")) != -1) {
        if (!window.Notification) {
            console.log("Oops, your browser does not support the Web Notifications API!")
        } else {
            Notification.requestPermission(function() {
                if (Notification.permission === "granted") {
                    spawnNotification(msg, notificationicon, HostName, url)
                }
            })
        }
    } else {
        if (navigator.userAgent.indexOf("Chrome") != -1) {
            document.addEventListener("DOMContentLoaded", function() {
                if (Notification.permission !== "granted") {
                    Notification.requestPermission()
                }
            });
            if (!Notification) {
                console.log("Desktop notifications not available in your browser. Try Chromium.");
                return
            }
            if (Notification.permission !== "granted") {
                Notification.requestPermission()
            } else {
                spawnNotification(msg, notificationicon, HostName, url)
            }
        } else {
            if (navigator.userAgent.indexOf("Safari") != -1) {
                if (!"Notification" in window) {
                    console.log("Web Notification Not Supported.");
                    return
                }
                if (Notification.permission === "default") {
                    Notification.requestPermission(function() {
                        spawnNotification(msg, notificationicon, HostName, url)
                    })
                } else {
                    if (Notification.permission === "granted") {
                        spawnNotification(msg, notificationicon, HostName, url)
                    } else {
                        if (Notification.permission === "denied") {
                            console.log("Web Notification denied.");
                            return
                        }
                    }
                }
            } else {
                if (navigator.userAgent.indexOf("Firefox") != -1) {
                    if (!("Notification" in window)) {
                        console.log("Web Notification Not Supported.")
                    } else {
                        if (Notification.permission === "granted") {
                            spawnNotification(msg, notificationicon, HostName, url)
                        } else {
                            if (Notification.permission !== "denied") {
                                Notification.requestPermission(function(permission) {
                                    if (permission === "granted") {
                                        spawnNotification(msg, notificationicon, HostName, url)
                                    }
                                })
                            }
                        }
                    }
                } else {
                    if ((navigator.userAgent.indexOf("MSIE") != -1) || (!!document.documentMode == true)) {
                        console.log("Web Notification Not Supported.")
                    } else {
                        console.log("Web Notification Not Supported.")
                    }
                }
            }
        }
    }
}

function showchatwindow(message) {
    var data = message["message"];
    var channel = data["data1"];
    changechat(channel)
}

function closechat(chatid) {
    $("#ch" + chatid).remove();
    $("li[data-li-channel='" + chatid + "']").removeClass("chat-active");
    reopenhidechat();
    removeopenchat(chatid, openchat)
}

function removeopenchat(item, arr) {
    for (var i = arr.length; i--;) {
        if (arr[i] === item) {
            arr.splice(i, 1)
        }
    }
}

function createchatwindow(data, channel) {
    var obj = JSON.parse(data);
    openchat = openchat.filter(onlyUnique);
    if (openchat.length == 1) {
        if (opchat) {
            var chats = (openchat.length + 1) * 280
        } else {
            var chats = 280
        }
    } else {
        var chats = (openchat.length + 1) * 280
    }
    if (opchat) {
        var pfix = 'style="right:' + chats + 'px; z-index:2; "'
    } else {
        var pfix = 'style="right:' + chats + 'px; z-index: 2;"'
    }
    var htmlhead = '<div class="nchatmndivperch" id="ch' + channel + '" ' + pfix + '><div data-altid="' + channel + '" data-altname="' + obj["name"] + '" class="chat-window"><div class="chat-window-container"><div class="chat-window-header posrel user-offline" id="chstatus' + channel + '"><span class="nchatclperch1 minimize-icon" id="chopenj' + channel + '"></span><span class="nchatclperch close-icon" id="' + channel + '" onclick="closechat(this.id);"></span><h2 class="name-field" id="chopenj2' + channel + '"><span class="user-online-indicator" style="display:none" id="uonline' + channel + '"></span><span>' + obj["name"] + '</span><span class="user-meta"></span><span class="user-offline"  id="uoffline' + channel + '">' + obj["lastactive"] + '</span></h2></div><div class="chat-screen">';
    var htmlbody = '<ul class="nchatscrolllisperch " id="showchat' + channel + '"><div class="connection-lost" style="bottom:0px;" ><h2>Connection lost. Please wait.</h2></div><div id="loading' + channel + '" class="loading-content"></div></ul><input type="hidden" id="loadtime' + channel + '" value="">';
    var htmlfooter = '<div class="form-group nchatwriteperch"><input type="hidden" id="usr' + channel + '" value="' + obj["usr"] + '"><input type="hidden" id="usrr' + channel + '" value="' + obj["usrr"] + '"><input type="hidden" id="chroom' + channel + '" value="' + channel + '"><input type="hidden" id="user' + channel + '" value="' + obj["name"] + '"><input type="hidden" id="jname' + channel + '" value="' + obj["jname"] + '"><input type="hidden" id="jname1' + channel + '" value="' + obj["jname1"] + '"><input type="hidden" id="rcomp' + channel + '" value="' + obj["curr_organization"] + '"><input type="hidden" id="reciver' + channel + '" value="' + obj["reciver"] + '"><textarea style="height:36px;" onkeyup="textAreaAdjust(this);" type="text" mydata="' + channel + '" id="m' + channel + '" class="form-control borderradiusnone writemsgperch" placeholder="Write a message"></textarea></div></div></div></div><script type="text/javascript">$("#showchat' + channel + '").scroll(function(){if($(this).scrollTop() === 0){ loadmore("' + channel + '"); } dispelFloatingNow("ch' + channel + '")}); $(function(){$("textarea#m' + channel + '").on("keydown", function(e) { usertyping("' + channel + '"); if(e.which ==13){   e.preventDefault();  submitfunction(this); }else if (e.which == 13 && ! e.shiftKey) { submitfunction(this);  }else if(e.which == 13 &&  e.shiftKey){ textAreaAdjust(this); }else{textAreaAdjust(this); } }); }); $("textarea#m' + channel + '").focus(function(e){ jQuery("#ch' + channel + '").find(".chat-window-container").removeClass("pulsing"); });   <\/script></div>';
    var html = htmlhead + htmlbody + htmlfooter;
    if (jQuery(".chat-window").length < maxopenchat) {
        $("#current-chat-window").prepend(html)
    } else {
        if (jQuery(".collapsed_chats").length == 0) {
            morechats()
        }
        lastid = jQuery(".chat-window").last().attr("data-altid");
        var name = jQuery(".chat-window").last().attr("data-altname");
        reposition_chat_windows();
        chathh[lastid] = jQuery(".chat-window").last().parent().detach();
        $("#ch" + lastid).remove();
        hidechat.push(lastid);
        jQuery(".collapsed_chats .collapsed-list").append("<li data-channel-hide='" + lastid + "'><span id='hidehhstattus" + lastid + "' class='user-offline'></span><span onclick='reopenhidechatv2(&quot;" + lastid + "&quot;);'>" + name + "</span><span class='clear-collapsed'></span></li>");
        jQuery(".collapsed_chats").show();
        $("#current-chat-window").prepend(html)
    }
    createinfobox(channel);
    reposition_chat_windows();
    getinitmsg(channel);
    oochan = [];
    oochan.push(channel);
    getOnline(oochan)
}

function createinfobox(channel) {
    infotext = $("li[data-li-channel='" + channel + "']").attr("data-infobox");
    infobtext = $("li[data-li-channel='" + channel + "']").attr("data-infotext");
    if (infobtext == undefined) {
        infobtext = "&nbsp;"
    }
    if (infotext == undefined) {
        infotext = "You can start chat."
    }
    pic = $("#imguser-" + channel).attr("src");
    if (pic == undefined) {
        pic = defpic
    }
    htmldata = '<div class="floating_metainfo expanded" style="width: 268px;"><span class="close_metainfo" onclick="close_metainfo(this);"><i class="fa fa-close"></i></span><div class="new_conversation_placeholder"><div class="profile_image"><img src="' + pic + '"></div><div class="chat_information"><p class="header">' + infobtext + '</p><p class="subtext">' + infotext + "</p></div></div></div>";
    $("#showchat" + channel).append(htmldata);
    $("#showchat" + channel).find(".floating_metainfo").css("width", $("#showchat" + channel).closest(".chat-window-header").next().find(".nchatscrolllisperch").prop("clientWidth"))
}

function close_metainfo(element) {
    jQuery(element).parent().removeClass("expanded")
}

function morechats() {
    var morechatdata = '<div class="collapsed_chats" style=""><div class="collapsed-chat-container"><ul class="collapsed-list inboxhide"></ul><div class="collapsed_trigger"></div></div></div>';
    $("#current-chat-window").append(morechatdata)
}

function reopenhidechat() {
    if (jQuery(".chat-window").length < maxopenchat) {
        if (hidechat.length > 0) {
            var lastEl = hidechat[hidechat.length - 1];
            $("#current-chat-window").append(chathh[lastEl]);
            jQuery("#showchat" + lastEl).scrollTop(jQuery("#showchat" + lastEl).prop("scrollHeight"));
            removeopenchat(lastEl, hidechat);
            removeopenchat(lastEl, chathh);
            jQuery(".collapsed_chats .collapsed-list li[data-channel-hide='" + lastEl + "']").remove()
        } else {}
    }
    if (hidechat.length == 0) {
        jQuery(".collapsed_chats").addClass("inboxhide");
        jQuery(".collapsed_chats").hide()
    } else {
        jQuery(".collapsed_chats").removeClass("inboxhide");
        jQuery(".collapsed_chats").show()
    }
    if (jQuery(".collapsed-list li").length == 0) {
        jQuery(".collapsed_chats").addClass("inboxhide");
        jQuery(".collapsed_chats").hide()
    }
    reposition_chat_windows()
}

function reopenhidechatv2(ccc) {
    lastid = jQuery(".chat-window").last().attr("data-altid");
    var name = jQuery(".chat-window").last().attr("data-altname");
    jQuery(".collapsed_chats .collapsed-list li[data-channel-hide='" + ccc + "']").remove();
    reposition_chat_windows();
    chathh[lastid] = jQuery(".chat-window").last().parent().detach();
    hidechat.push(lastid);
    jQuery(".collapsed_chats .collapsed-list").append("<li data-channel-hide='" + lastid + "'><span id='hidehhstattus" + lastid + "' class='user-offline'></span><span onclick='reopenhidechatv2(&quot;" + lastid + "&quot;);'>" + name + "</span><span class='clear-collapsed'></span></li>");
    jQuery(".collapsed_chats").show();
    $("#current-chat-window").append(chathh[ccc]);
    jQuery("#showchat" + ccc).scrollTop(jQuery("#showchat" + ccc).prop("scrollHeight"));
    removeopenchat(ccc, hidechat);
    removeopenchat(ccc, chathh);
    reposition_chat_windows()
}

function getinitmsg(channel) {
    pubnub.history({
        channel: channel,
        count: 10,
        includeTimetoken: true
    }, function(status, response) {
        if (status["statusCode"] == 200) {
            b = "";
            date1 = "";
            date2 = "";
            data1 = "";
            newsec = 0;
            settime(channel, response["startTimeToken"]);
            response["messages"].forEach(function(da) {
                var item = da["entry"];
                item["datenew"] = getrelative_date(item["time"]);
                item["timenew"] = relative_time(item["time"]);
                if (uuid == item["UUID"]) {
                    item["you"] = 1
                } else {
                    item["you"] = 0
                }
                date1 = item["datenew"];
                if (date1 == date2) {
                    var newsec = 0
                } else {
                    data1 = data1 + '<div class="date-separator date' + channel + '" data-date="' + date1 + '"><span class="date">' + date1 + "</span></div>";
                    var newsec = 1
                }
                date2 = date1;
                var a = item["tt"];
                if (a == b && newsec != 1) {
                    if (item["you"] == 1) {
                        data1 = data1 + '<li class="clubbed" data-name="' + item["UUID"] + '"><div class="chat-message sent posrel"><div class="displbloverfhid" data-toggle="tooltip" title="' + date1 + ", " + item["timenew"] + '"data-placement="right"><p>' + item["msg"] + "</p></div></li>"
                    } else {
                        data1 = data1 + '<li class="clubbed received" data-name="' + item["UUID"] + '" ><div class="chat-message received posrel"><div class="displbloverfhid" data-toggle="tooltip" title="' + date1 + ", " + item["timenew"] + '" data-placement="left"><p>' + item["msg"] + "</p></div></li>"
                    }
                } else {
                    if (item["you"] == 1) {
                        data1 = data1 + '<li data-name="' + item["UUID"] + '"><div class="chat-message sent posrel"><div class="displbloverfhid" data-toggle="tooltip" title="' + date1 + ", " + item["timenew"] + '" data-placement="right"><div class="caret"></div><p>' + item["msg"] + "</p></div></div></li>"
                    } else {
                        data1 = data1 + '<li data-name="' + item["UUID"] + '"><div class="chat-message received posrel"><img src="' + item["img"] + '" class="userwaim1"><div class="displbloverfhid" data-toggle="tooltip" title="' + date1 + ", " + item["timenew"] + '" data-placement="left"><div class="caret"></div><p>' + item["msg"] + "</p></div></div></li>"
                    }
                }
                b = a
            });
            $("#showchat" + channel).append(data1);
            jQuery("[data-toggle='tooltip']").tooltip({
                container: "body",
                trigger: "hover"
            });
            $("#loading" + channel).slideUp()
        }
        jQuery("#showchat" + channel).scrollTop(jQuery("#showchat" + channel).prop("scrollHeight"));
        jQuery(document.getElementById("ch" + channel)).find(".floating_metainfo").css("width", jQuery(document.getElementById("showchat" + channel)).prop("clientWidth"));
        jQuery(document.getElementById("ch" + channel)).find(".floating_metainfo").addClass("expanded");
        dispelFloating("ch" + channel)
    })
}

function loadmore(channel) {
    var starttime = $("#loadtime" + channel).val();
    if (starttime != 0) {
        $("#loading" + channel).slideDown();
        pubnub.history({
            channel: channel,
            count: 10,
            start: starttime,
            includeTimetoken: true
        }, function(status, response) {
            if (response["startTimeToken"] != starttime) {
                if (status["statusCode"] == 200) {
                    b = "";
                    date1 = "";
                    date2 = "";
                    data1 = "";
                    newsec = 0;
                    settime(channel, response["startTimeToken"]);
                    response["messages"].forEach(function(da) {
                        var item = da["entry"];
                        item["datenew"] = getrelative_date(item["time"]);
                        item["timenew"] = relative_time(item["time"]);
                        if (uuid == item["UUID"]) {
                            item["you"] = 1
                        } else {
                            item["you"] = 0
                        }
                        date1 = item["datenew"];
                        if (date1 == date2) {
                            var newsec = 0
                        } else {
                            $(".date" + channel).filter(function() {
                                return $(this).data("date") === date1
                            }).remove();
                            data1 = data1 + '<div class="date-separator date' + channel + '" data-date="' + date1 + '"><span class="date">' + date1 + "</span></div>";
                            var newsec = 1
                        }
                        date2 = date1;
                        var a = item["tt"];
                        if (a == b && newsec != 1) {
                            if (item["you"] == 1) {
                                data1 = data1 + '<li class="clubbed" data-name="' + item["UUID"] + '"><div class="chat-message sent posrel"><div class="displbloverfhid" data-toggle="tooltip" title="' + date1 + ", " + item["timenew"] + '"data-placement="right"><p>' + item["msg"] + "</p></div></li>"
                            } else {
                                data1 = data1 + '<li class="clubbed received" data-name="' + item["UUID"] + '" ><div class="chat-message received posrel"><div class="displbloverfhid" data-toggle="tooltip" title="' + date1 + " , " + item["timenew"] + '" data-placement="left"><p>' + item["msg"] + "</p></div></li>"
                            }
                        } else {
                            if (item["you"] == 1) {
                                data1 = data1 + '<li data-name="' + item["UUID"] + '"><div class="chat-message sent posrel"><div class="displbloverfhid" data-toggle="tooltip" title="' + date1 + ", " + item["timenew"] + '" data-placement="right"><div class="caret"></div><p>' + item["msg"] + "</p></div></div></li>"
                            } else {
                                data1 = data1 + '<li data-name="' + item["UUID"] + '"><div class="chat-message received posrel"><img src="' + item["img"] + '" class="userwaim1"><div class="displbloverfhid" data-toggle="tooltip" title="' + date1 + " , " + item["timenew"] + '" data-placement="left"><div class="caret"></div><p>' + item["msg"] + "</p></div></div></li>"
                            }
                        }
                        b = a
                    });
                    jQuery(document.getElementById("showchat" + channel)).find(".loading-content").remove();
                    data1 = '<div id="loading' + channel + '" class="loading-content"></div>' + data1;
                    $("#showchat" + channel).prepend(data1);
                    jQuery("[data-toggle='tooltip']").tooltip({
                        container: "body",
                        trigger: "hover"
                    });
                    $("#loading" + channel).slideUp()
                }
            }
        })
    } else {
        $("#loading" + channel).slideUp()
    }
}

function settime(chroom, data) {
    $("input[id=loadtime" + chroom + "]").attr("value", data)
}

function showinbox() {
    if (opchat) {
        var pfix = 'style="right:10px; z-index:2; "'
    } else {
        var pfix = 'style="right:10px; z-index: 2;"'
    }
    var mainhtml = '<div class="current-active-users inboxhide" ' + pfix + '><p class="posrel closingusli inbox-header inboxhide">Inbox<span id="scrlbxband"></span></p><ul class="current-active-users-list " style="cursor:pointer;" id="onlineitem"></ul></div>';
    $("#showinbox").append(mainhtml);
    $.ajax({
        type: "POST",
        url: ajaxlink,
        crossDomain: true,
        data: {
            flow: 51,
            chatid: ppcd,
            tt: ChatTT
        },
        error: function(data) {},
        success: function(data) {
            var item = "";
            var obj = JSON.parse(data);
            if (obj["status"] == 200) {
                if (obj["list"] != null) {
                    obj["list"].forEach(function(d) {
                        chuser.push(d.channel);
                        var item = '<li data-li-channel="' + d.channel + '" onclick="changechat(&quot;' + d.channel + '&quot;);" data-infobox="' + d.infobox + '" data-infotext="' + d.infotext + '"><div class="user-container"><div class="user-profile-image"><div class="nchatimbperchsmallwinchat posrel"><div class="user-indicator"><div id="online-' + d.channel + '"></div></div><img src="' + d.pic + '" id="imguser-' + d.channel + '" class="nchatimgimusperchsmallwinchat"></div></div><div class="new-conversation-label posrel"><p>' + d.name + "</p><span>" + d.des + "</span><span></span></div></div></li>";
                        $("#onlineitem").append(item)
                    });
                    startch(chuser, 1);
                    getOnline(chuser);
                    $("#showinbox").show()
                } else {
                    $("#showinbox").hide()
                }
            } else {
                $("#showinbox").hide()
            }
        }
    })
}

function usertyping(channel) {
    typingch = [];
    jQuery("#ch" + channel).find(".chat-window-container").removeClass("pulsing");
    typingch.push(channel);
    pubnub.setState({
        channels: typingch,
        state: {
            "typing": "true"
        },
        callback: function(status) {}
    })
}

function usertypingstop(channel) {
    typingch = [];
    typingch.push(channel);
    pubnub.setState({
        channels: typingch,
        state: {
            "typing": "false"
        },
        callback: function(status) {}
    })
}

function updateinbox() {
    $.ajax({
        type: "POST",
        url: ajaxlink,
        crossDomain: true,
        data: {
            flow: 151,
            chatid: ppcd,
            tt: ChatTT,
            uuid: uuid
        },
        error: function(data) {},
        success: function(data) {
            $("#onlineitem").html("");
            var item = "";
            var obj = JSON.parse(data);
            if (obj["status"] == 200) {
                $("#showinbox").show();
                obj["list"].forEach(function(d) {
                    chuser.push(d.channel);
                    var item = '<li onclick="changechat(&quot;' + d.channel + '&quot;);"><div class="user-container"><div class="user-profile-image"><div class="nchatimbperchsmallwinchat posrel"><div class="user-indicator"><div id="online-' + d.channel + '"></div></div><img src="' + d.pic + '" class="nchatimgimusperchsmallwinchat"></div></div><div class="new-conversation-label posrel"><p>' + d.name + "</p><span>" + d.des + "</span><span></span></div></div></li>";
                    $("#onlineitem").append(item)
                })
            } else {}
            startch(chuser, 1);
            getOnline(chuser);
            $("#showinbox").show()
        }
    })
}

function changechat(channel) {
    jQuery("li[data-li-channel='" + channel + "']").attr("onclick", "");
    if ($.inArray(channel, openchat) == -1) {
        $.ajax({
            type: "POST",
            url: ajaxlink,
            crossDomain: true,
            data: {
                flow: 141,
                channel: channel,
                uuid: uuid,
                tt: ChatTT
            },
            error: function(data) {
                jQuery("li[data-li-channel='" + channel + "']").attr("onclick", "changechat('" + channel + "')")
            },
            success: function(data) {
                startch(channel, 0);
                openchat.push(channel);
                openchat = openchat.filter(onlyUnique);
                createchatwindow(data, channel);
                jQuery("li[data-li-channel='" + channel + "']").attr("onclick", "changechat('" + channel + "')")
            },
            complete: function(data) {
                jQuery("li[data-li-channel='" + channel + "']").attr("onclick", "changechat('" + channel + "')")
            }
        })
    } else {
        if (jQuery(".collapsed_chats .collapsed-list li[data-channel-hide='" + channel + "']").length != 0) {
            if ($("#ch" + channel).length != 0) {
                jQuery("li[data-li-channel='" + channel + "']").attr("onclick", "changechat('" + channel + "')")
            } else {
                jQuery("li[data-li-channel='" + channel + "']").attr("onclick", "changechat('" + channel + "')");
                reopenhidechatv2(channel)
            }
        } else {
            jQuery("li[data-li-channel='" + channel + "']").attr("onclick", "changechat('" + channel + "')")
        }
    }
    if (ChatTT == "1") {
        var ga_action = "rtClickCandidate";
        var ga_pagename = location.pathname.substring(1);
        var ga_label = "Origin--" + ga_pagename + "_UserId--" + ppcd + "_channel--" + channel
    } else {
        var ga_action = "jsClickRecruiter";
        var ga_pagename = location.pathname.substring(1);
        var ga_label = "Origin--" + ga_pagename + "_UserId--" + ppcd + "_channel--" + channel
    }
    _gaq.push(["_trackEvent", "site_chat", ga_action, ga_label])
}

function keepupdatetitle(newdata) {
    if (winactive) {
        var oldtitle = document.title;
        if (oldtitle == "New message received") {
            document.title = newdata
        }
    } else {
        var oldtitle = document.title;
        document.title = newdata;
        setTimeout(function() {
            keepupdatetitle(oldtitle)
        }, 2000)
    }
}
$(document).ready(function() {
    removetypinginco();
    reposition_chat_windows();
    $(document).on("click", ".user-meta", function(e) {
        if (jQuery(this).closest(".nchatmndivperch").hasClass("minimized")) {
            jQuery(this).closest(".chat-window-header").next().find(".floating_metainfo").addClass("expanded");
            jQuery(this).closest(".chat-window-header").next().find(".floating_metainfo").css("width", jQuery(this).closest(".chat-window-header").next().find(".nchatscrolllisperch").prop("clientWidth"))
        } else {
            e.stopPropagation();
            jQuery(this).closest(".chat-window-header").next().find(".floating_metainfo").toggleClass("expanded");
            jQuery(this).closest(".chat-window-header").next().find(".floating_metainfo").css("width", jQuery(this).closest(".chat-window-header").next().find(".nchatscrolllisperch").prop("clientWidth"))
        }
    });
    $(".nchatscrolllisperch, .current-active-users-list").on("mousewheel DOMMouseScroll", function(e) {
        var delta = -e.originalEvent.wheelDelta || e.originalEvent.detail;
        var scrollTop = this.scrollTop;
        if ((delta < 0 && scrollTop === 0) || (delta > 0 && this.scrollHeight - this.clientHeight - scrollTop === 0)) {
            e.preventDefault()
        }
    });
    $(document).on("click", ".chat-window-header", function(e) {
        if ($(e.target).hasClass("close-icon")) {
            $(this).closest(".nchatmndivperch").remove();
            reposition_chat_windows()
        } else {
            $(this).closest(".nchatmndivperch").toggleClass("minimized")
        }
        if (jQuery(this).parents(".chat-window-container").hasClass("pulsing")) {
            jQuery(this).parents(".chat-window-container").removeClass("pulsing")
        }
    });
    $(".inbox-header").on("click", function(e) {
        $(this).closest(".current-active-users").toggleClass("inboxhide");
        if (ChatTT == "1") {
            if ($(this).closest(".current-active-users").hasClass("inboxhide")) {
                var ga_action = "rtCollapseInbox"
            } else {
                var ga_action = "rtExpandInbox"
            }
            var ga_pagename = location.pathname.substring(1);
            var ga_label = "Origin--" + ga_pagename + "_UserId--" + ppcd
        } else {
            if ($(this).closest(".current-active-users").hasClass("inboxhide")) {
                var ga_action = "jsCollapseInbox"
            } else {
                var ga_action = "jsExpandInbox"
            }
            var ga_pagename = location.pathname.substring(1);
            var ga_label = "Origin--" + ga_pagename + "_UserId--" + ppcd
        }
        _gaq.push(["_trackEvent", "site_chat", ga_action, ga_label])
    });
    jQuery(".current-active-users-list").on("click", "li", function() {
        if (jQuery(this).find(".new-conversation-label").hasClass("unread")) {
            jQuery(this).find(".unread-count").hide();
            jQuery(this).find(".unread-count").text("0");
            jQuery(this).find(".new-conversation-label").removeClass("unread")
        }
        if (!jQuery(this).hasClass("chat-active")) {
            jQuery(this).addClass("chat-active")
        }
    });
    jQuery(document).on("click", "li span.clear-collapsed", function(e) {
        chanid = jQuery(this).parent().attr("data-channel-hide");
        $("li[data-li-channel='" + chanid + "']").removeClass("chat-active");
        closechat(chanid);
        removeopenchat(chanid, hidechat);
        removeopenchat(chanid, chathh);
        jQuery(this).parent().remove();
        if (jQuery(".collapsed-list li").length == 0) {
            jQuery(".collapsed_chats").hide()
        }
    });
    jQuery(document).on("click", ".collapsed_trigger", function() {
        jQuery(this).toggleClass("active");
        jQuery(this).parent().find(".collapsed-list").toggleClass("inboxhide")
    });
    jQuery(document).on("scroll", ".chat-window", function() {})
});

function reposition_chat_windows() {
    var rightOffset = 10;
    if (opchat) {
        rightOffset = rightOffset + 280 + 190
    } else {
        rightOffset = rightOffset + 280
    }
    jQuery(".chat-window").each(function(i, el) {
        jQuery(this).parent().css("right", rightOffset);
        rightOffset = rightOffset + 280
    });
    position_collapsed_chat();
    $(".nchatscrolllisperch").on("mousewheel DOMMouseScroll", function(e) {
        var delta = -e.originalEvent.wheelDelta || e.originalEvent.detail;
        var scrollTop = this.scrollTop;
        if ((delta < 0 && scrollTop === 0) || (delta > 0 && this.scrollHeight - this.clientHeight - scrollTop === 0)) {
            e.preventDefault()
        }
    })
}

function position_collapsed_chat() {
    var windowNum = jQuery(".chat-window").length;
    var chatContainerW = windowNum * jQuery(".chat-window").width() + windowNum * 10;
    var inboxW = jQuery(".current-active-users").width();
    var totalOffset = chatContainerW + inboxW;
    if (opchat) {
        jQuery(".collapsed_chats").css("right", totalOffset + 210)
    } else {
        jQuery(".collapsed_chats").css("right", totalOffset + 20)
    }
}

function dispelFloating(selector) {
    setTimeout(function() {
        jQuery("#" + selector).find(".floating_metainfo").removeClass("expanded");
        animateInfo(selector)
    }, 5000)
}

function dispelFloatingNow(selector) {
    jQuery("#" + selector).find(".floating_metainfo").removeClass("expanded")
}

function animateInfo(selector) {
    jQuery("#" + selector).find("span.user-meta").stop().animate({
        "opacity": 0
    }, 500, function() {
        jQuery(this).stop().animate({
            "opacity": 1
        }, 500)
    })
}

function textAreaAdjust(o) {
    o.style.height = "3px";
    o.style.height = (o.scrollHeight + 2) + "px";
    if (navigator.userAgent.indexOf("IE") > 0) {
        o.parentNode.previousSibling.style.height = 341 - o.scrollHeight + "px";
        o.parentNode.previousSibling.scrollTop = 9001
    } else {
        o.parentNode.previousSibling.previousSibling.style.height = (341 - o.scrollHeight - 1) + "px";
        o.parentNode.previousSibling.scrollTop = 9001
    }
}

function getrelative_date(str) {
    var a = new Date(str);
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    date = date < 10 ? "0" + date : date;
    var time = date + " " + month + " " + year;
    return time
}

function relative_time(str) {
    var a = new Date(str);
    var hours = a.getHours();
    var minutes = a.getMinutes();
    var ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    var strTime = hours + ":" + minutes + " " + ampm;
    return strTime
}

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index
}
pubnub.addListener({
    status: function(statusEvent) {
        if (statusEvent.category == "PNConnectedCategory") {
            conv2 = true;
            startch(Mainchannel, 0);
            jQuery(".connection-lost").css("bottom", 0);
            jQuery(".connection-lost").hide()
        } else {
            if (statusEvent.category == "PNTimeoutCategory") {
                conv2 = false;
                if (!navigator.onLine) {
                    jQuery(".connection-lost").css("bottom", "36px");
                    jQuery(".connection-lost").css("width", jQuery(this).prop("clientWidth"));
                    jQuery(".connection-lost").show()
                }
            } else {
                if (statusEvent.category == "PNNetworkDownCategory") {
                    conv2 = false;
                    if (!navigator.onLine) {
                        jQuery(".connection-lost").css("bottom", "36px");
                        jQuery(".connection-lost").css("width", jQuery(this).prop("clientWidth"));
                        jQuery(".connection-lost").show()
                    }
                } else {
                    if (statusEvent.category == "PNNetworkUpCategory") {
                        conv2 = false;
                        if (navigator.onLine) {
                            jQuery(".connection-lost").css("bottom", 0);
                            jQuery(".connection-lost").hide()
                        }
                    }
                }
            }
        }
    },
    message: function(m) {
        var from = uuid;
        if (m["channel"] == Mainchannel) {
            if ($.inArray(m["channel"], channelarray) != -1) {} else {
                updateinbox();
                data1 = m["message"];
                changechat(data1["data1"]);
                playsound();
                reposition_chat_windows()
            }
            if (winactive) {} else {
                showpushnotification(m["message"])
            }
        } else {
            if ($.inArray(m["channel"], hidechat) != -1) {
                reopenhidechatv2(m["channel"])
            }
            if ($.inArray(m["channel"], openchat) != -1) {
                chroom = m["channel"];
                var data1 = "";
                var item = m["message"];
                muuid = item[""];
                item["datenew"] = getrelative_date(item["time"]);
                item["timenew"] = relative_time(item["time"]);
                if (uuid == item["UUID"]) {
                    item["you"] = 1
                } else {
                    item["you"] = 0
                }
                date1 = item["datenew"];
                if (date1 == date2) {
                    var newsec = 0
                } else {
                    data1 = data1 + '<div class="date-separator date' + chroom + '" data-date="' + date1 + '"><span class="date">' + date1 + "</span></div>";
                    var newsec = 1
                }
                date2 = date1;
                var dsk = $("#showchat" + chroom).find("li").last().attr("data-name");
                if (dsk == undefined) {
                    var dsk = $("#showchat" + chroom).find("li:last-child").attr("data-name")
                }
                if (item["you"] == 0) {
                    if (dsk == from) {
                        data1 = '<li data-name="' + item["UUID"] + '"><div class="chat-message received posrel"><img src="' + item["img"] + '" class="userwaim1"><div class="displbloverfhid" data-toggle="tooltip" title="' + date1 + ", " + item["timenew"] + '" data-placement="left"><div class="caret"></div><p>' + item["msg"] + "</p></div></div></li>"
                    } else {
                        if (dsk == undefined) {
                            data1 = '<li data-name="' + item["UUID"] + '"><div class="chat-message received posrel"><img src="' + item["img"] + '" class="userwaim1"><div class="displbloverfhid" data-toggle="tooltip" title="' + date1 + ", " + item["timenew"] + '" data-placement="left"><div class="caret"></div><p>' + item["msg"] + "</p></div></div></li>"
                        } else {
                            data1 = '<li class="clubbed received" data-name="' + item["UUID"] + '" ><div class="chat-message received posrel"><div class="displbloverfhid" data-toggle="tooltip" title="' + date1 + ", " + item["timenew"] + '" data-placement="left"><p>' + item["msg"] + "</p></div></li>"
                        }
                    }
                    $("#showchat" + chroom).append(data1);
                    jQuery("[data-toggle='tooltip']").tooltip({
                        container: "body",
                        trigger: "hover"
                    });
                    jQuery("#showchat" + chroom).scrollTop(jQuery("#showchat" + chroom).prop("scrollHeight"));
                    $("#showchat" + chroom).closest(".chat-window-container").addClass("pulsing");
                    playsound()
                } else {
                    if (item["you"] == 1) {
                        if (dsk == from) {
                            var data1 = '<li class="clubbed" data-name="' + item["UUID"] + '"><div class="chat-message sent posrel"><div class="displbloverfhid" data-toggle="tooltip" title="' + date1 + ", " + item["timenew"] + '"data-placement="right"><p>' + item["msg"] + "</p></div></li>"
                        } else {
                            var data1 = '<li data-name="' + item["UUID"] + '"><div class="chat-message sent posrel"><div class="displbloverfhid" data-toggle="tooltip" title="' + date1 + ", " + item["timenew"] + '" data-placement="right"><div class="caret"></div><p>' + item["msg"] + "</p></div></div></li>"
                        }
                        $("#showchat" + chroom).append(data1);
                        jQuery("[data-toggle='tooltip']").tooltip({
                            container: "body",
                            trigger: "hover"
                        });
                        jQuery("#showchat" + chroom).scrollTop(jQuery("#showchat" + chroom).prop("scrollHeight"))
                    }
                }
                $("#showchat" + chroom).find(".typing-show").remove()
            } else {
                changechat(m["channel"])
            }
        }
    },
    presence: function(presenceEvent) {
        if (presenceEvent["action"] == "state-change") {
            if (presenceEvent["uuid"] != MainUUID) {
                if (presenceEvent["state"]["typing"] == "true") {
                    pic = $("#imguser-" + presenceEvent["channel"]).attr("src");
                    data = '<li class="typing-show"><div class="chat-message received posrel typing"> <img src="' + pic + '" class="userwaim1"><div class="displbloverfhid"><div class="caret"></div><div class="typing-status"></div></div></div></li>';
                    $("#showchat" + presenceEvent["channel"]).append(data)
                } else {
                    $("#showchat" + presenceEvent["channel"]).find(".typing-show").remove()
                }
            } else {}
        } else {
            if (presenceEvent["action"] == "join") {
                if (presenceEvent["uuid"] != MainUUID) {
                    oochan = [];
                    oochan.push(presenceEvent["channel"]);
                    getOnline(oochan)
                } else {}
            }
        }
    }
});

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 65536).toString(16).substring(1)
    }
    return s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4()
}

function getOnline(channels) {
    pubnub.hereNow({
        channels: channels,
        includeUUIDs: true
    }, function(status, response) {
        var d = response.channels;
        channels.forEach(function(da) {
            if (response.channels[da].occupancy >= 2) {
                $("#online-" + da).addClass("user-online-blip");
                $("#uonline" + da).show();
                $("#uoffline" + da).hide();
                $("#chstatus" + da).removeClass("user-offline");
                $("#chstatus" + da).addClass("user-online");
                $("#hidehhstattus" + da).addClass("user-online-indicator");
                $("#hidehhstattus" + da).removeClass("user-offline")
            } else {
                $("#online-" + da).removeClass("user-online-blip");
                $("#uonline" + da).hide();
                $("#uoffline" + da).show();
                $("#chstatus" + da).addClass("user-offline");
                $("#chstatus" + da).removeClass("user-online");
                $("#hidehhstattus" + da).addClass("user-offline");
                $("#hidehhstattus" + da).removeClass("user-online-indicator")
            }
        })
    })
}

function submitfunction(c) {
    if (conv2) {
        channel = c.getAttribute("mydata");
        var from = ChatUserName;
        var fromimg = ChatUserImg;
        var fromtt = ChatTT;
        if ($("#m" + channel).val() != "" && $("#m" + channel).val() != "\n") {
            var len = $("#m" + channel).val().length;
            var tempids = guid();
            var mmm = $("#m" + channel).val();
            var time = new Date().getTime();
            var message = {
                "UUID": $("#usrr" + channel).val(),
                "time": time,
                "usr": $("#usr" + channel).val(),
                "name": from,
                "tt": fromtt,
                "msg": $("#m" + channel).val(),
                "img": fromimg,
                "type": 1
            };
            var chroom = $("#chroom" + channel).val();
            publishMsgToServer(chroom, message);
            var dsk = $("#showchat" + chroom).find("li:last-child").attr("data-name");
            if (dsk == from) {
                var sendthat = '<li class="clubbed" data-name="' + from + '"><div class="chat-message sent posrel"><div class="displbloverfhid" data-toggle="tooltip" title="' + getrelative_date(time) + ", " + relative_time(time) + '"data-placement="right"><p>' + mmm + "</p></div></li>"
            } else {
                var sendthat = '<li  data-name="' + from + '"><div class="chat-message sent posrel"><div class="displbloverfhid" data-toggle="tooltip" title="' + getrelative_date(time) + ", " + relative_time(time) + '" data-placement="right"><div class="caret"></div><p>' + mmm + "</p></div></div></li>"
            }
            var senddata = from + " sent you a message - " + mmm;
            var newdata = {
                "type": 1,
                "data": senddata,
                "time": new Date().getTime(),
                "data1": channel,
                "data2": ""
            };
            publishNotiToServer($("#jname1" + channel).val(), newdata, $("#reciver" + channel).val(), from, $("#rcomp" + channel).val(), $("#chroom" + channel).val(), fromtt);
            $("#m" + channel).val("");
            usertypingstop(channel);
            textAreaAdjust(document.getElementById("m" + channel));
            jQuery(document.getElementById("ch" + channel)).find(".floating_metainfo").removeClass("expanded");
            jQuery("#showchat" + channel).scrollTop(jQuery("#showchat" + channel).prop("scrollHeight"));
            if (ChatTT == "1") {
                var ga_action = "rtSendMessage";
                var ga_pagename = location.pathname.substring(1);
                var ga_label = "Origin--" + ga_pagename + "_UserId--" + ppcd + "_channel--" + channel
            } else {
                var ga_action = "jsSendMessage";
                var ga_pagename = location.pathname.substring(1);
                var ga_label = "Origin--" + ga_pagename + "_UserId--" + ppcd + "_channel--" + channel
            }
            _gaq.push(["_trackEvent", "site_chat", ga_action, ga_label])
        } else {
            $("#m" + channel).val("");
            usertypingstop(channel);
            textAreaAdjust(document.getElementById("m" + channel));
            jQuery(document.getElementById("ch" + channel)).find(".floating_metainfo").removeClass("expanded");
            jQuery("#showchat" + channel).scrollTop(jQuery("#showchat" + channel).prop("scrollHeight"))
        }
        jQuery("#showchat" + channel).scrollTop(jQuery("#showchat" + channel).prop("scrollHeight"))
    }
}

function publishMsgToServer(chroom, msg) {
    pubnub.publish({
        message: msg,
        channel: chroom,
        sendByPost: true,
        storeInHistory: true
    }, function(status, response) {
        if (status.error) {} else {}
    })
}

function publishNotiToServer(chroom, message, reciver, from, org, subchroom, sendby) {
    pubnub.publish({
        message: message,
        channel: chroom,
        sendByPost: true,
        storeInHistory: true
    }, function(status, response) {
        if (status.error) {} else {}
    });
    $.ajax({
        type: "POST",
        url: ajaxlink,
        crossDomain: true,
        data: {
            "flow": 61,
            "channel": chroom,
            "sendby": sendby,
            "from": from,
            "org": org,
            "subchroom": subchroom,
            "msg": message
        },
        error: function(data) {},
        success: function(msg) {}
    })
}

function startchatwindow(recid, jecid, jobid) {
    if (chatenable) {
        $.ajax({
            type: "POST",
            url: ajaxlink,
            data: {
                flow: 71,
                recid: recid,
                jecid: jecid,
                jobid: jobid,
                uuid: MainUUID,
                tt: ChatTT
            },
            error: function(msg) {},
            success: function(msg) {
                var datachat = JSON.parse(msg);
                if ($.inArray(datachat.channel, channelarray) != -1) {
                    changechat(datachat.channel);
                    reposition_chat_windows()
                } else {
                    updateinbox();
                    changechat(datachat.channel);
                    reposition_chat_windows()
                }
            }
        });
        if (ChatTT == "1") {
            var ga_action = "rtStartChat";
            var ga_pagename = location.pathname.substring(1);
            var ga_label = "Origin--" + ga_pagename + "_UserId--" + ppcd
        } else {
            var ga_action = "jsStartChat";
            var ga_pagename = location.pathname.substring(1);
            var ga_label = "Origin--" + ga_pagename + "_UserId--" + ppcd
        }
        _gaq.push(["_trackEvent", "site_chat", ga_action, ga_label])
    }
}

function playsound() {
    $("#chatAudio")[0].play()
}

function spawnNotification(theBody, theIcon, theTitle, url) {
    var options = {
        body: theBody,
        icon: theIcon
    };
    var n = new Notification(theTitle, options);
    if (url) {
        n.onclick = function() {
            window.open(url, "_blank")
        }
    }
};