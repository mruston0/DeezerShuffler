class AlbumManager {
  
  constructor() {
    this.albums = [];
    this.currentIndex = 0;
  }
  
  shuffleFisherYates(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }
  
  setAlbums(albums) {
    if (albums !== null) {  
      this.albums = shuffleFisherYates(albums);
    }
  }
  
  addAlbum(album) {
    if (album !== null) {
      this.albums.push(album);
      this.albums = this.shuffleFisherYates(this.albums);
    }
  }
  
  getRandomAlbum() {
    return this.albums[this.currentIndex++];
  }
  
  totalAbums() {
    return this.albums.length;
  }
    
  toString() {
    return "I am the AlbumManager";
  }
}