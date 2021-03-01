const fs = require('fs');

const client = fs.readFileSync(`${__dirname}/../client/what-if-client.html`);
const errorPage = fs.readFileSync(`${__dirname}/../client/error.html`);
const home = fs.readFileSync(`${__dirname}/../client/home.html`);
const admin = fs.readFileSync(`${__dirname}/../client/admin.html`);
const suggest = fs.readFileSync(`${__dirname}/../client/suggest.html`);
const css = fs.readFileSync(`${__dirname}/../client/default-styles.css`);
const triple = fs.readFileSync(`${__dirname}/../client/what-ifs.png`);

const get404Response = (request, response) => {
  response.writeHead(404, { 'Content-Type': 'text/html' });
  response.write(errorPage);
  response.end();
};

const getClient = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(client);
  response.end();
};

const getHome = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(home);
  response.end();
};

const getAdmin = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(admin);
  response.end();
};

const getSuggest = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(suggest);
  response.end();
};

const getCSS = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(css);
  response.end();
};
const getTriple = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'image/png' });
  response.write(triple);
  response.end();
};

module.exports = {
  get404Response,
  getClient,
  getHome,
  getAdmin,
  getSuggest,
  getCSS,
  getTriple,
};
