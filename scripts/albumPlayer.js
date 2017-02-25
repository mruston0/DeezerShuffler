var albumPlayer = new Vue({
    el: "#albumPlayer",
    data: {
        artist: "",
        album: "",
        albumArt: "",
        tracks: [],
        isPlaying: false
    },
     computed: {
         classObject: function() {
            if (this.isPlaying) {
                //console.log('~~~~~~~~ ~~~~~~~~~~~~~ setting pause icon');
                return 'glyphicon glyphicon-pause';
            }
            else {
                //console.log('~~~~~~~~ ~~~~~~~~~~~~~ setting play icon');
                return 'glyphicon glyphicon-play-circle'
            }
         }
     },
    methods: {
        togglePlay: function() {
            if (DZ.player.isPlaying()) {
                this.isPlaying = false;
                DZ.player.pause();
            }
            else {
                this.isPlaying = true;
                DZ.player.play();
            }
        },
        getTrackTimeString : function(duration) {
             if (duration != null) {
                var minutes = Math.floor(duration / 60);
                var seconds = duration - minutes * 60;
                var finalTime = str_pad_left(minutes,'0',2)+':'+str_pad_left(seconds,'0',2);
                return finalTime;
             }
        },
        setActiveTrack: function(trackNumber) {
            //console.log("Setting active track to " + trackNumber);
            /* Could be better, but this works for now */
            for (let trackRow of $("[data-track]"))
            {
                if (trackRow.dataset.track == trackNumber)
                    trackRow.className = "trackListingSelected";
                else
                    trackRow.className = "";
            }
        },
         trackClicked: function(event) {
             var requestedTrack = event.currentTarget.dataset.track;
             var currentTrack = DZ.player.getCurrentIndex();
             var hops = requestedTrack - currentTrack;
             //console.log(hops + " to get to track");
             if (hops > 0)
             {
                 for(var i = 0; i < hops; i++)
                    DZ.player.next();
             }
             else
             {
                for(var i = 0; i < (hops * -1); i++)
                    DZ.player.prev();
             }
             this.isPlaying = true;
         }
    }
});

