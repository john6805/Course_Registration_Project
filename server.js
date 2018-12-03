//built in node modules
var fs = require('fs');
var path = require('path');
var http = require('http');
var url = require('url');

//downloaded node_modules
var mime = require('mime-types');

var port = 8012;
var public_dir = path.join(__dirname, 'client/html');
//var public_dir = path.join(__dirname, 'public');

var server = http.createServer((request, response) => {
    var request_url = url.parse(request.url);
    var filename = request_url.pathname.substring(1);
    if(filename === "")
    {
        filename = "index.html";
    }

    console.log(filename);
    if(request.method === 'GET')
    { 
        fs.readFile(path.join(public_dir, filename), (error, data) => {
            if(error)
            {
                response.writeHead(404, {'Content-Type': 'text/plain'});
                response.write("404 Not Found");
            }
            else {
                var mime_type = mime.lookup(filename) || 'text/plain';
                response.writeHead(200, {'Content-Type': mime_type});
                response.write(data);
            }
            response.end();
        })

        // response.writeHead(200, {'Content-Type': 'text/plain'});
        // response.write('Hello World!');
        // response.write()
        // response.end();
    }
    else if(request.method === 'POST')
    {
        if(filename === 'upload')
        {
            var body = '';
            request.on('data', (chunk) => {
                body += chunk.toString();
            })
            
            request.on('end', () => {
                console.log("Upload " + body);
                response.writeHead(200, {'Content-Type': 'text/plain'});
                response.write("GO LAUNCH");
                response.end();
            })
                
        }
    }
    else
    {
        response.writeHead(500, {'Content-Type': 'text/plain'});
        response.write('Error!!!');
        response.end();
    }
    
});

console.log("Now listening on port" + port);
server.listen(port, '0.0.0.0');