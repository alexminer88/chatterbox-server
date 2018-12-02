

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.


// var data = {results: []};
var objectIdCounter = 1;
var messages = [];

var requestHandler = function(request, response) {  
  
  var defaultCorsHeaders = {
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'access-control-allow-headers': 'content-type, accept',
    'access-control-max-age': 10 // Seconds.
  };

  console.log('Serving request type ' + request.method + ' for url ' + request.url);
  var statusCode = 200;

  var headers = defaultCorsHeaders;
  headers['Content-Type'] = 'application/json';

  response.writeHead(statusCode, headers);
  
  var url = request.url;
  
  if (url === '/classes/messages') {

    if (request.method === 'GET') {
 
      statusCode = 200;
      response.writeHead(statusCode, headers);
      response.end(JSON.stringify({results: messages}));
      
      // statusCode = 200;
      // response.writeHead(statusCode, headers);
      // response.end(JSON.stringify(data)); 
    }

    if (request.method === 'POST') {

      var data = '';
      request.on('data', function(chunk) {
        data += chunk;
      });
      request.on('end', function() {         
        JSON.parse(data).objectId = ++objectIdCounter;
        messages.push(JSON.parse(data));    
        statusCode = 201;
        response.writeHead(statusCode, headers);
        response.end(JSON.stringify({objectId: JSON.parse(data).objectId}));
      });

      // statusCode = 201;
      // response.writeHead(statusCode, headers);
      // request.on('data', (chunk)=> {
      //   // var parsedData = JSON.parse(chunk);
      //   // parsedData.createdAt = new Date();
      //   // data.results.push(parsedData);   
      //   data.results.push(chunk);   
      // }).on('end', () => {
      //   // response.end(JSON.stringify(data));
      //   data.results = Buffer.concat(data.results).toString();  
      //   console.log('post results', data.results);
      //   response.end();
      // });
    }

    if (request.method === 'OPTIONS') {
      // console.log('request OPTIONS: ', headers);
      response.writeHead(200, headers);
      response.end(JSON.stringify(null)); 
    }

  } else {
    statusCode = 404;
    response.writeHead(statusCode, headers);
    response.end('404');
  }

};

module.exports.requestHandler = requestHandler;
