console.log('First web service starting up ...');

const http = require('http');
const url = require('url');
const query = require('querystring');
const htmlHandler = require('./htmlResponse.js');
const jsonHandler = require('./responses.js');

// 1 - pull in the HTTP server module

// 2 - pull in URL and query modules (for URL parsing)

// 3 - locally this will be 3000, on Heroku it will be assigned
const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
  '/': htmlHandler.getHome,
  '/home': htmlHandler.getHome,
  '/what-if': jsonHandler.getWhatIfResponse,
  '/what-if-list': jsonHandler.getManyWhatIfsResponse,
  '/add-what-if': jsonHandler.addWhatIf,
  '/delete-what-if': jsonHandler.deleteWhatIf,
  '/add-answer': jsonHandler.addAnswer,
  '/app': htmlHandler.getClient,
  '/admin': htmlHandler.getAdmin,
  '/suggest': htmlHandler.getSuggest,
  '/triple': htmlHandler.getTriple,
  '/default-styles.css': htmlHandler.getCSS,
  notFound: htmlHandler.get404Response,
};

const handlePost = (request, response, parsedUrl) => {
  const body = [];
  if (parsedUrl.pathname === '/add-what-if') {
    // https://nodejs.org/api/http.html
    request.on('error', (err) => {
      console.dir(err);
      response.statusCode = 400;
      response.end();
    });

    request.on('data', (chunk) => {
      body.push(chunk);
    });

    request.on('end', () => {
      const bodyString = Buffer.concat(body).toString();
      const bodyParams = query.parse(bodyString);
      jsonHandler.addWhatIf(request, response, bodyParams);
    });
  } else if (parsedUrl.pathname === '/add-answer') {
    const params = query.parse(parsedUrl.query);

    request.on('error', (err) => {
      console.dir(err);
      response.statusCode = 400;
      response.end();
    });

    request.on('data', (chunk) => {
      body.push(chunk);
    });

    request.on('end', () => {
      const bodyString = Buffer.concat(body).toString();
      const bodyParams = query.parse(bodyString);
      jsonHandler.addAnswer(request, response, bodyParams, params);
    });
  }
};

// test commit comment
// 7 - this is the function that will be called every time a client request comes in
// this time we will look at the `pathname`, and send back the appropriate page
// note that in this course we'll be using arrow functions 100% of the time in our server-side code
const onRequest = (request, response) => {
  // console.log(request.headers);
  const parsedUrl = url.parse(request.url);
  const { pathname } = parsedUrl;

  if (request.method === 'POST') {
    // handle POST
    handlePost(request, response, parsedUrl);
    return; // bail out of function
  }

  let acceptedTypes = request.headers.accept && request.headers.accept.split(',');
  acceptedTypes = acceptedTypes || [];

  const httpMethod = request.method;
  // console.log(httpMethod);

  // console.log("parsedUrl=", parsedUrl);
  // console.log("pathname=", pathname);

  const params = query.parse(parsedUrl.query);
  // console.log(params.limit);

  if (urlStruct[pathname]) {
    urlStruct[pathname](request, response, params, acceptedTypes, httpMethod);
  } else {
    urlStruct.notFound(request, response);
  }
};

// 8 - create the server, hook up the request handling function, and start listening on `port`
http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
