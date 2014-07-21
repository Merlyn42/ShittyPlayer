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
        createPlayerA(pair[0], pair[1])
    }
}

$(".all-players").sortable({
    revert: true,
    scroll: false,
    placeholder: "sortable-placeholder",
    cursor: "move",
    start: function (e, t) {
        t.helper.addClass("exclude-me");
        $(".all-players .playerMargin:not(.exclude-me)").css("visibility", "hidden");
        t.helper.data("clone").hide();
        $(".cloned-slides .playerMargin").css("visibility", "visible");
        $(".cloned-slides .playerMargin").css("width", "500px");
        $(".cloned-slides .playerMargin").css("height", "290px")
    },
    stop: function (e, t) {
        $(".all-players .playerMargin.exclude-me").each(function () {
            var e = $(this);
            var t = e.data("clone");
            var n = e.position();
            t.css("left", n.left);
            t.css("top", n.top);
            t.show();
            e.removeClass("exclude-me")
        });
        $(".all-players .playerMargin").each(function () {
            var e = $(this);
            var t = e.data("clone");
            t.attr("data-pos", e.index())
        });
        $(".all-players .playerMargin").css("visibility", "visible");
        $(".cloned-slides .playerMargin").css("visibility", "hidden")
    },
    change: function (e, t) {
        $(".all-players .playerMargin:not(.exclude-me)").each(function () {
            var e = $(this);
            var t = e.data("clone");
            t.stop(true, false);
            var n = e.position();
            t.animate({
                left: n.left,
                top: n.top
            }, 200)
        })
    }
})

function fullscreen() {
    if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen()
        } else if (document.documentElement.msRequestFullscreen) {
            document.documentElement.msRequestFullscreen()
        } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen()
        } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT)
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen()
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen()
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen()
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen()
        }
    }
}

function viewAllStreams() {
    $.ajax({
        type: "GET",
        url: "streams.txt",
        cache: false,
        success: function (e) {
            var t = e.split(":");
            var n = "";
            for (var r = 0; r < t.length - 1; r++) {
                if (r > 0) {
                    n = n + "&"
                }
                n = n + t[r] + "=" + t[r]
            }
            var i = window.location.origin + window.location.pathname;
            var s = i + "?" + n;
            window.location = s
        }
    })
}

function createCopies() {
    $("#cloned-slides").empty();
    $(".playerMargin").each(function (e) {
        var t = $(this);
        var n = t.clone();
        t.data("clone", n);
        var r = t.position();
        n.css({
            position: "absolute",
            left: r.left,
            top: r.top,
            visibility: "hidden"
        }).attr("data-pos", e + 1);
        $("#cloned-slides").append(n)
    })
}

function removePlayer(e, t, n) {
    $("#" + e).remove();
    createCopies();
    var r = window.location.href.replace("?" + t + "=" + n + "&", "?");
    var r = r.replace("?" + t + "=" + n, "");
    var r = r.replace("&" + t + "=" + n, "");
    window.history.replaceState("string", "ShittyPlayer", r)
}

function changeRes(e, t, n) {
    x = parseInt(t);
    y = parseInt(n);
    $("#box" + e).css("width", x + 20);
    $("#player" + e).css("width", x);
    $("#box" + e).css("height", y + 20);
    $("#player" + e).css("height", y)
}

function createPlayerA(e, t) {
    var n = document.createElement("div");
    n.id = "box" + num_players;
    n.className = "playerMargin";
    $("#all-players").append(n);
    var r = document.createElement("input");
    r.id = "closeButton" + num_players;
    r.className = "closeButton";
    r.setAttribute("player", "box" + num_players);
    r.setAttribute("name", e);
    r.setAttribute("stream", t);
    r.type = "button";
    r.value = "X";
    r.setAttribute("onClick", "removePlayer(this.getAttribute('player'),this.getAttribute('name'),this.getAttribute('stream'))");
    $("#box" + num_players).append(r);
    var i = document.createElement("input");
    i.id = "resizeButton" + num_players;
    i.className = "resizeButton";
    i.setAttribute("number", num_players);
    i.type = "button";
    i.value = "S";
    i.setAttribute("onClick", "changeRes(this.getAttribute('number'),prompt('width',''),prompt('height',''))");
    $("#box" + num_players).append(i);
    var s = document.createElement("div");
    s.id = "player" + num_players;
    s.className = "player";
    if (t.contains("Drunk") || t.contains("drunk")) {
        s.setAttribute("nickname", "Langer")
    } else {
        s.setAttribute("nickname", e)
    }
    s.setAttribute("url", t);
    $("#box" + num_players).append(s);
    num_players += 1;
    flowplayer(s.id, "flowplayer-3.2.18.swf", {
        clip: {
            url: t,
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
    var e = prompt("Please enter the stream nickname", "");
    var t = prompt("Please enter the streamkey", "");
    if (window.location.href.contains(e + "=" + t)) {
        return
    }
    var n = window.location.href.contains("?") ? "&" : "?";
    var r = window.location + n + e + "=" + t;
    window.history.replaceState("string", "ShittyPlayer", r);
    createPlayerA(e, t)
}