// client-side js
// run by the browser each time your view template is loaded

let albumManager = new AlbumManager();
let currentPage = 0;
let isLoggedInProbably = false;
let isPlayerInit = false;

$(function() {

    DZ.init({
		    appId  : '225304',
		    channelUrl : 'http://lvh.me:81',
		    player: {
    			
		    }
	    });

    DZ.Event.subscribe('tracklist_changed', function(args, evt_name) { LoadTrackList();});
	    
	   PromiseIsAlreadyLoggedIn().then(function(result) {
	      console.log("Checking if you are already logged in = " + result);
	      if (result === true);
	        isLoggedInProbably = true;
	   });

     // Callback function is called when the currently playing track has changed
    DZ.Event.subscribe('current_track', function(track, evt_name){
	      //console.log("Currently playing track", track);
        albumPlayer.setActiveTrack(track.index);
    });
});

function PromiseTryLogin() {
  return new Promise(function(resolve, reject) {
	    if (isLoggedInProbably === false) {
        DZ.login(function(response) {
          if (response.authResponse) {
            console.log('Welcome!  Fetching your information.... ');
            DZ.api('/user/me', function(response) {
              isLoggedInProbably = true;
            	resolve(response.name);
            });
          } 
          else {
            reject("FAIL");
          }
        }, {perms: 'basic_access,email'});
	    }
	    resolve("Already logged in...");
  });
}

function PromiseIsAlreadyLoggedIn() {
  return new Promise(function(resolve, reject) {
    DZ.getLoginStatus(function(response) {
    	if (response.authResponse) {
    		resolve(true);
    	} 
    	else {
    		resolve(false);
    	}
    });
  });
}

function RandomAlbum() {
  PromiseTryLogin().then(
      function() {
        console.log("playing random favourite album...");
        if (albumManager.totalAbums() === 0) {
          console.log("Getting your favourtes from deezer api...");
          DZ.api('/user/me/albums', GetFavouriteAlbums);
        }
        else
        {
          PlayRandomAlbum();
        }      
      }
    ).catch(function(err) {alert(err); });
}

function PlayRandomAlbum() {
    
    var randomAlbum = albumManager.getRandomAlbum();
    /* Set our vue object to the album properties */
    albumPlayer.album = randomAlbum.title;
    albumPlayer.artist = randomAlbum.artist.name;
    albumPlayer.albumArt = randomAlbum.cover_big;
    DZ.player.playAlbum(randomAlbum.id);
}

function LoadTrackList() {
    albumPlayer.tracks = DZ.player.getTrackList();
}

function GetFavouriteAlbums(response) { 
  console.log("Inside GetFavouriteAlbums");
  console.log(response);
          
  let items = response.data;
  console.log("You have " + response.total + " favourite albums");
  addToArray(items);
  
  if (response.next != null) {
    currentPage += items.length;
    var url = '/user/me/albums?index=' + currentPage;
    console.log("Request url is " + url);
    DZ.api(url, GetFavouriteAlbums);
  }
  else {
    DZ.player.setVolume(100);
    PlayRandomAlbum();
  }
}

function addToArray(albums) {
    if (albums !== null) {
    for(let i = 0; i < albums.length; i++) {
            albumManager.addAlbum(albums[i]);
          }
    }
}

/*
function PausePlayer() {
  if (!DZ.player.isPlaying) {
    DZ.player.play();
    $("#PlayPauseHoverIcon").removeClass("glyphicon glyphicon-play-circle");
    $("#PlayPauseHoverIcon").addClass("glyphicon glyphicon-pause");
  }
  else {
    DZ.player.pause();
    $("#PlayPauseHoverIcon").removeClass("glyphicon glyphicon-pause");
    $("#PlayPauseHoverIcon").addClass("glyphicon glyphicon-play-circle");
  }
}
*/

// Utility method used in albumPlayer.js vue class.
function str_pad_left(string,pad,length) {
    return (new Array(length+1).join(pad)+string).slice(-length);
}

function rgb(r, g, b){
  return "rgb("+r+","+g+","+b+")";
}
