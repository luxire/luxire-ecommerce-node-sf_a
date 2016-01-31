/*Redis Config*/
var redis =  require('redis');
client = redis.createClient();

client.on('connect', function(){
  console.log('Connected to redis...');
})
