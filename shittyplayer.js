/**
 *
 *
 * @licstart  The following is the entire license notice for the 
 *  JavaScript code in this page.
 *
 * Copyright (C) 2014 havocx42
 *
 *
 * The JavaScript code in this page is free software: you can
 * redistribute it and/or modify it under the terms of the GNU
 * General Public License (GNU GPL) as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option)
 * any later version.  The code is distributed WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.
 *
 * As additional permission under GNU GPL version 3 section 7, you
 * may distribute non-source (e.g., minimized or compacted) forms of
 * that code without the copy of the GNU GPL normally required by
 * section 4, provided you include this license notice and a URL
 * through which recipients can access the Corresponding Source.
 *
 * @licend  The above is the entire license notice
 * for the JavaScript code in this page.
 *
 */
if (!String.prototype.contains) {
    String.prototype.contains = function(s, i) {
        return this.indexOf(s, i) != -1;
    }
}

var num_players = 1;
var query = window.location.search.substring(1);
var vars = query.split("&");
if (query) {
    for (i in vars) {
        var pair = vars[i].split("=");
        createPlayerA(pair[0], pair[1]);
    }
}

$(".all-players").sortable({
    revert: true,
    scroll: false,
    placeholder: "sortable-placeholder",
    cursor: "move",

    start: function (e, ui) {
        ui.helper.addClass("exclude-me");
        $(".all-players .playerMargin:not(.exclude-me)")
            .css("visibility", "hidden");
        ui.helper.data("clone").hide();
        $(".cloned-slides .playerMargin").css("visibility", "visible");
        $(".cloned-slides .playerMargin").css("width", "500px");
        $(".cloned-slides .playerMargin").css("height", "290px");
    },

    stop: function (e, ui) {
        $(".all-players .playerMargin.exclude-me").each(function () {
            var item = $(this);
            var clone = item.data("clone");
            var position = item.position();

            clone.css("left", position.left);
            clone.css("top", position.top);
            clone.show();

            item.removeClass("exclude-me");
        });

        $(".all-players .playerMargin").each(function () {
            var item = $(this);
            var clone = item.data("clone");

            clone.attr("data-pos", item.index());
        });

        $(".all-players .playerMargin").css("visibility", "visible");
        $(".cloned-slides .playerMargin").css("visibility", "hidden");
    },

    change: function (e, ui) {
        $(".all-players .playerMargin:not(.exclude-me)").each(function () {
            var item = $(this);
            var clone = item.data("clone");
            clone.stop(true, false);
            var position = item.position();
            clone.animate({
                left: position.left,
                top: position.top
            }, 200);
        });
    }
});

function fullscreen() {
    if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) {
            document.documentElement.msRequestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }
}

function viewAllStreams() {
    $.ajax({
        type: "GET",
        url: "streams.txt",
        cache: false,
        success: function (data) {
            var vals = data.split(":");
            var params = "";
            for (var i = 0; i < vals.length - 1; i++) {
                if (i > 0) {
                    params = params + "&"
                }
                params = params + vals[i] + "=" + vals[i]

            }
            var baseUrl = window.location.origin + window.location.pathname;
            var newUrl = baseUrl + "?" + params;
            window.location = newUrl;
        }
    });
}

function createCopies() {
    $("#cloned-slides").empty();
    $(".playerMargin").each(function (data) {
        var item = $(this);
        var item_clone = item.clone();
        item.data("clone", item_clone);
        var position = item.position();
        item_clone.css({
            position: "absolute",
            left: position.left,
            top: position.top,
            visibility: "hidden"
        }).attr("data-pos", data + 1);
        $("#cloned-slides").append(item_clone)
    })
}

function removePlayer(playerId, name, stream) {
    $("#" + playerId).remove();
    createCopies();
    var newUrl = window.location.href.replace("?" + name + "=" + stream + "&", "?");
    newUrl = newUrl.replace("?" + name + "=" + stream, "");
    newUrl = newUrl.replace("&" + name + "=" + stream, "");
    window.history.replaceState("string", "ShittyPlayer", newUrl)
}

function changeRes(num, xin, yin) {
    x = parseInt(xin);
    y = parseInt(yin);
    $("#box" + num).css("width", x + 20);
    $("#player" + num).css("width", x);
    $("#box" + num).css("height", y + 20);
    $("#player" + num).css("height", y)
}

function createPlayerA(name, stream) {
    var new_box= document.createElement("div");
    new_box.id = "box" + num_players;
    new_box.className = "playerMargin";
    $("#all-players").append(new_box);
    var close_button = document.createElement("input");
    close_button.id = "closeButton" + num_players;
    close_button.className = "closeButton";
    close_button.setAttribute("player", "box" + num_players);
    close_button.setAttribute("name", name);
    close_button.setAttribute("stream", stream);
    close_button.type = "button";
    close_button.value = "X";
    close_button.setAttribute("onClick", "removePlayer(this.getAttribute('player'),this.getAttribute('name'),this.getAttribute('stream'))");
    $("#box" + num_players).append(close_button);
    var resize_button = document.createElement("input");
    resize_button.id = "resizeButton" + num_players;
    resize_button.className = "resizeButton";
    resize_button.setAttribute("number", num_players);
    resize_button.type = "button";
    resize_button.value = "S";
    resize_button.setAttribute("onClick", "changeRes(this.getAttribute('number'),prompt('width',''),prompt('height',''))");
    $("#box" + num_players).append(resize_button);
    var new_player = document.createElement("div");
    new_player.id = "player" + num_players;
    new_player.className = "player";
    if (stream.contains("Drunk") || stream.contains("drunk")) {
        new_player.setAttribute("nickname", "Langer")
    } else {
        new_player.setAttribute("nickname", name)
    }
    new_player.setAttribute("url", stream);
    $("#box" + num_players).append(new_player);
    num_players += 1;
    flowplayer(new_player.id, "flowplayer-3.2.18.swf", {
        clip: {
            url: stream,
            live: "true",
            provider: "rtmp",
            bufferLength: "0.0",
            autoBuffering: "false"
        },
        plugins: {
            rtmp: {
                url: "flowplayer.rtmp-3.2.13.swf",
                netConnectionUrl: "rtmp://shittybox.crabdance.com/live"
            }
        }
    });
    createCopies()
}

function createPlayer() {
    var name = prompt("Please enter the stream nickname", "");
    var stream = prompt("Please enter the streamkey", "");
    if (window.location.href.contains(name + "=" + stream)) {
        return
    }
    var sep = window.location.href.contains("?") ? "&" : "?";
    var newUrl = window.location + sep + name + "=" + stream;
    window.history.replaceState("string", "ShittyPlayer", newUrl);
    createPlayerA(name, stream)
}