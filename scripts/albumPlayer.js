var albumPlayer = new Vue({
    el: "#albumPlayer",
    data: {
        artist: "[Undefined]",
        album: "[Undefined]",
        albumArt: "https://placehold.it/500x500",
        tracks: ["There's No Secrets This Year",
            "The Royal We",
            "Growing Old Is Getting Old",
            "It's Nice to Know You Work Alone",
            "Panic Switch",
            "Draining",
            "Sort Of",
            "Substitution",
            "Catch & Release",
            "Surrounded"]
    },
    methods: {
        getTrackTimeString : function(duration) {
             if (duration != null) {
                var minutes = Math.floor(duration / 60);
                var seconds = duration - minutes * 60;
                var finalTime = str_pad_left(minutes,'0',2)+':'+str_pad_left(seconds,'0',2);
                return finalTime;
             }
        },
        setActiveTrack: function(trackNumber) {
            console.log("Setting active track to " + trackNumber);
            var targetTrack = $("[data-track=\"" + trackNumber + "\"]");
            console.log(targetTrack);
            targetTrack.css("background-color", "lightBlue");
        }
    }
});

/* Tracks should really be it's own Vue! with it's own styling logic... */


