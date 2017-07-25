// Initialize the client with your api key, no secret and your app id
var client = stream.connect('t4dqhkkgv4gh', null, '26942');
// For the feed group 'user' and user id 'eric' get the feed
// The access token at the end is only needed for client side integrations


var userFeed = client.feed('user', userPublicName, 'ecOXiJT_5WGCZoYjOhZ3un8ZwNQ');
// Add the activity to the feed

function uploadSong (){
  userFeed.addActivity({
  actor: 'eric', 
  tweet: 'Hello world', 
  verb: 'postSong', 
  object: 1
});   
}

function listenSong(){
      userFeed.addActivity({
  actor: 'eric', 
  tweet: 'Hello world', 
  verb: 'listenSong', 
  object: 1
}); 
    
}


