var albumPlayer = new Vue({
    el: "#albumPlayer",
    data: {
        artist: "Click to play a random favourite album from your Deezer library",
        album: "",
        albumArt: "",
        tracks: [],
        isPlaying: false
    },
     computed: {
         isPlayingClass: function() {
            if (this.isPlaying) {
                return 'glyphicon glyphicon-pause';
            }
            else {
                return 'glyphicon glyphicon-play-circle'
            }
         },
         title : function () {
             let value = "";
             if (this.artist != null && this.artist.length > 0)
                    value += this.artist;
             if (this.album != null && this.album.length > 0) {
                 if (value.length > 0)
                    value += " - ";
                value += this.album
             }
            return value;
         }
     },
    methods: {
        getActiveTrack: function() {
            for(track of this.tracks) {
                if (track.isActive)
                    return track;
            }
            return null;
        },
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
            for(track of this.tracks) {
                if (track.index == trackNumber)
                    track.isActive = true;
                 else
                    track.isActive = false;   
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

