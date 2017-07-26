
var client = stream.connect('t4dqhkkgv4gh', null, '26942');
// For the feed group 'user' and user id 'eric' get the feed
// The access token at the end is only needed for client side integrations


var userFeed = client.feed('user', creator.publicName , 'ecOXiJT_5WGCZoYjOhZ3un8ZwNQ');
// Add the activity to the feed



function uploadActivity (){
  userFeed.addActivity({
  actor: creator.publicName, 
  tweet: readyData.name, 
  verb: 'post', 
  object: 1
});   
}

function listenActivity(){
      userFeed.addActivity({
  actor: 'eric', 
  tweet: 'Hello world', 
  verb: 'listen', 
  object: 1
}); 
    
}


