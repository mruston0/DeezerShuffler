// client-side js
// run by the browser each time your view template is loaded

let albumManager = new AlbumManager();
let currentPage = 0;
let isLoggedInProbably = false;

$(function() {
  console.log('Initializing...');
  
    DZ.init({
		    appId  : '191962',
		    channelUrl : 'https://certain-sphere.gomix.me/',
		    player: {
    			container: 'player',
    			width : 500,
    			height : 500,
    			format : 'classic',
    			playlist : true//,
		    }
	    });
	    
	   PromiseIsAlreadyLoggedIn().then(function(result) {
	      console.log("Checking if you are already logged in = " + result);
	      if (result === true);
	        isLoggedInProbably = true;
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
        if (albumManager.totalAbums() == 0) {
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
    document.getElementById("albumArt").src = randomAlbum.cover_big;
    DZ.player.playAlbum(randomAlbum.id);
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