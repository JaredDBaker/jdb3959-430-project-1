const under = require('underscore');

// ALWAYS GIVE CREDIT - in your code comments and documentation
// Source: https://stackoverflow.com/questions/2219526/how-many-bytes-in-a-javascript-string/29955838
// Refactored to an arrow function by ACJ
const getBinarySize = (string) => Buffer.byteLength(string, 'utf8');

// What if array, many what if questions taken from Randall Munroe's What if Book
// authors are those referenced in the book
const whatIfs = [
  { q: 'What if humans grew twice as fast, but had half the lifespan?', author: 'Jared Baker', a: ['People would value there time more on earth and live more in the moment due to not haveing as long to make an impact.', 'We cannot know as history would have changed too much.'] },
  { q: 'What if the earth and all terrestial objects suddenly stopped spinning, but the atmospere retained its velocity?', author: 'Andrew Brown', a: [] },
  { q: 'What if you tried to hit a baseball pitched at 90 percent the speed of light?', author: 'Ellen McManis', a: [] },
  { q: 'What if you traveled back in time at the center of Times Square, New York, 1000 years? 10,000 years? 100,000 years? 1,000,000 years or 1,000,000 years in the future?', author: 'Mark Dettling', a: [] },
  { q: 'What if everyone actually had only one soul mate, a random person somewhere in the world?', author: 'Benjamin Staffin', a: [] },
  { q: 'What if evey person on Earth aimed a laser pointer at the Moon at the same time, would it change color?', author: 'Peter Lipowicz', a: [] },
  { q: 'What if you made a periodic table out of cube-shaped bricks, where each brick was made of the corresponding element?', author: 'Andy Connolly', a: [] },
  { q: 'What if everyone on Earth stood as close to each other as they could and jumped, everyone landing on the ground at the same instant?', author: 'Thomas Bennett (and many others)', a: [] },
];
// { q: 'What if', author: '', a: [] },

// 6 - this will return a random number no bigger than `max`, as a string
// we will also doing our query parameter validation here
const getWhatIfJSON = (xml) => {
  const number = Math.floor(Math.random() * whatIfs.length);
  if (xml) {
    const responseXML = `
    <whatIf>
      <q>${whatIfs[number].q}</q>
      <author>${whatIfs[number].author}</author>
      <a>${whatIfs[number].a}</a>
    </whatIf>
  `;
    return responseXML;
  }
  return JSON.stringify(whatIfs[number]);
};

const getManyWhatIfsJSON = (limit = 1, xml) => {
  let max = Number(limit);
  max = Math.floor(max);
  max = !limit ? 1 : max;
  max = limit < 1 ? 1 : max;
  let temp = under.shuffle(whatIfs);
  const shuffled = [];
  let i = 0;
  while (i < max) {
    shuffled.push(temp[i % temp.length]);
    i += 1;
    if (i % temp.length === 0) { temp = under.shuffle(whatIfs); }
  }
  if (xml) {
    let responseXML = '<jokes>';
    let j = 0;
    while (j < shuffled.length) {
      responseXML = `${responseXML} <joke>`;
      responseXML = `${responseXML} <q>${shuffled[j].q}</q>`;
      responseXML = `${responseXML} <a>${shuffled[j].a}</a>`;
      responseXML = `${responseXML} </joke>`;
      j += 1;
    }
    responseXML = `${responseXML} </jokes>`;
    return responseXML;
  }
  return JSON.stringify(shuffled);
};

const getWhatIfResponse = (request, response, params, acceptedTypes, httpMethod) => {
  if (httpMethod === 'HEAD') {
    if (acceptedTypes.includes('text/xml')) {
      response.writeHead(200, { 'Content-Type': 'text/xml', 'Content-Length': getBinarySize(getWhatIfJSON(true)) });
    } else {
      response.writeHead(200, { 'Content-Type': 'application/json', 'Content-Length': getBinarySize(getWhatIfJSON(false)) });
    }
    response.end();
    return;
  }

  if (acceptedTypes.includes('text/xml')) {
    response.writeHead(200, { 'Content-Type': 'text/xml' });
    response.write(getWhatIfJSON(true));
  } else {
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.write(getWhatIfJSON(false));
  }

  response.end();
};

const getManyWhatIfsResponse = (request, response, params, acceptedTypes, httpMethod) => {
  if (httpMethod === 'HEAD') {
    if (acceptedTypes.includes('text/xml')) {
      response.writeHead(200, {
        'Content-Type': 'text/xml',
        'Content-Length': getBinarySize(getManyWhatIfsJSON(params.limit, true)),
      });
    } else {
      response.writeHead(200, {
        'Content-Type': 'application/json',
        'Content-Length': getBinarySize(getManyWhatIfsJSON(params.limit, false)),
      });
    }
    response.end();
    return;
  }

  if (acceptedTypes.includes('text/xml')) {
    response.writeHead(200, { 'Content-Type': 'text/xml' });
    response.write(getManyWhatIfsJSON(params.limit, true));
  } else {
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.write(getManyWhatIfsJSON(params.limit, false));
  }

  response.end();
};

const sendJSONResponse = (request, response, responseCode, object) => {
  response.writeHead(responseCode, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(object));
  response.end();
};

// "Meta" refers to *meta data*, in this case the HTTP headers
// const sendJSONResponseMeta = (request, response, responseCode) => {
//   response.writeHead(responseCode, { 'Content-Type': 'application/json' });
//   response.end();
// };

const addWhatIf = (request, response, body) => {
  console.log(body);
  // here we are assuming an error, pessimistic aren't we?
  let responseCode = 400; // 400=bad request
  const responseJSON = {
    id: 'missingParams',
    message: 'question and author are both required',
  };

  // missing name or age?
  if (!body.question || !body.author) {
    return sendJSONResponse(request, response, responseCode, responseJSON);
  }

  // we DID get a name and age
  // if (whatIfs[body.question]) { // if the user exists
  //   responseCode = 204;
  //   whatIfs[body.name].a = body.age; // update
  //   return sendJSONResponseMeta(request, response, responseCode);
  // }

  // if the user does not exist
  whatIfs.push({ q: body.question, author: body.author, a: [] }); // make a new user
  // initialize values

  responseCode = 201; // send "created" status code
  responseJSON.id = whatIfs[whatIfs.length - 1].q;
  responseJSON.message = 'Created Successfully';
  return sendJSONResponse(request, response, responseCode, responseJSON);
};

module.exports = {
  getWhatIfResponse,
  getManyWhatIfsResponse,
  addWhatIf,
};
