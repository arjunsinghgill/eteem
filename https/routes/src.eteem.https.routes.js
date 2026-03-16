// ASG portfolio
// eteem src https routes
// March 10, 2026
// Arjun Singh Gill

const MOD_fs    = require('fs');
const MOD_fsp   = require('fs/promises');
const MOD_path  = require('path');


// Font Routes
const FILES_fonts = {
  big_shoulders_regular: MOD_fs.readFileSync( MOD_path.resolve( __dirname, '../fonts/big_shoulders_regular.ttf') ),
  montserrat_alternates_regular: MOD_fs.readFileSync( MOD_path.resolve( __dirname, '../fonts/montserrat_alternates_regular.ttf') ),
  train_one_regular: MOD_fs.readFileSync( MOD_path.resolve( __dirname, '../fonts/train_one_regular.ttf') ),
};

const FILES_lib = {
  dom_purify: MOD_fs.readFileSync( MOD_path.resolve( __dirname, '../lib/DOMPurify.min.js') ),
  asymmetric_crypto: MOD_fs.readFileSync( MOD_path.resolve( __dirname, '../lib/asymmetric_crypto.js') ),
};

// home : html,js,css
const FILES_route_home = {
  html : MOD_fs.readFileSync( MOD_path.resolve( __dirname, './home/src.eteem.https.routes.home.html'), 'utf8' ),
  js   : MOD_fs.readFileSync( MOD_path.resolve( __dirname, './home/src.eteem.https.routes.home.js'), 'utf8' ),
  css  : MOD_fs.readFileSync( MOD_path.resolve( __dirname, './home/src.eteem.https.routes.home.css'), 'utf8' ),
};

// auth : html,js:login, html,js:signup, css
const FILES_route_auth = {
  html_login : MOD_fs.readFileSync( MOD_path.resolve( __dirname, './auth/login/src.eteem.https.routes.auth.login.html'), 'utf8' ),
  js_login   : MOD_fs.readFileSync( MOD_path.resolve( __dirname, './auth/login/src.eteem.https.routes.auth.login.js'), 'utf8' ),
  css_login  : MOD_fs.readFileSync( MOD_path.resolve( __dirname, './auth/login/src.eteem.https.routes.auth.login.css'), 'utf8' ),
  html_signup : MOD_fs.readFileSync( MOD_path.resolve( __dirname, './auth/signup/src.eteem.https.routes.auth.signup.html'), 'utf8' ),
  js_signup   : MOD_fs.readFileSync( MOD_path.resolve( __dirname, './auth/signup/src.eteem.https.routes.auth.signup.js'), 'utf8' ),
  css_signup  : MOD_fs.readFileSync( MOD_path.resolve( __dirname, './auth/signup/src.eteem.https.routes.auth.signup.css'), 'utf8' ),
  html_login_passphrase : MOD_fs.readFileSync( MOD_path.resolve( __dirname, './auth/login_passphrase/src.eteem.https.routes.auth.login_passphrase.html'), 'utf8' ),
  js_login_passphrase   : MOD_fs.readFileSync( MOD_path.resolve( __dirname, './auth/login_passphrase/src.eteem.https.routes.auth.login_passphrase.js'), 'utf8' ),
  css_login_passphrase  : MOD_fs.readFileSync( MOD_path.resolve( __dirname, './auth/login_passphrase/src.eteem.https.routes.auth.login_passphrase.css'), 'utf8' ),
  api : require( MOD_path.resolve( __dirname, './auth/src.eteem.https.routes.auth.API.js' ) )
};

// main :: SPA 
const FILES_route_main = {
  html : MOD_fs.readFileSync( MOD_path.resolve( __dirname, './main/src.eteem.https.routes.main.html'), 'utf8' ),
  js_main   : MOD_fs.readFileSync( MOD_path.resolve( __dirname, './main/src.eteem.https.routes.main.js'), 'utf8' ),
  js_add_user : MOD_fs.readFileSync( MOD_path.resolve( __dirname, './main/src.eteem.https.routes.main.add_user.js'), 'utf8' ),
  css  : MOD_fs.readFileSync( MOD_path.resolve( __dirname, './main/src.eteem.https.routes.main.css'), 'utf8' ),
  api : require( MOD_path.resolve( __dirname, './main/src.eteem.https.routes.main.API.js' ) )
};
FILES_route_main.js = FILES_route_main.js_add_user + FILES_route_main.js_main;


let ROUTES_https = {
  // Home
  '/': async function( IN_req, IN_res, IN_url_parsed) {
    IN_res.setHeader('Content-Type','text/html');
    IN_res.writeHead(200);
    IN_res.end( FILES_route_home.html );
  },
  '/js/home': async function( IN_req, IN_res, IN_url_parsed) {
    IN_res.setHeader('Content-Type','text/javascript');
    IN_res.writeHead(200);
    IN_res.end( FILES_route_home.js );
  },
  '/css/home': async function( IN_req, IN_res, IN_url_parsed) {
    IN_res.setHeader('Content-Type','text/css');
    IN_res.writeHead(200);
    IN_res.end( FILES_route_home.css );
  },
  // Auth 
  // - api
  '/auth/api' : async function( IN_req, IN_res, IN_url_parsed )
  {
    await FILES_route_auth.api( IN_req, IN_res, IN_url_parsed );
  },
  // - login
  '/auth/login': async function( IN_req, IN_res, IN_url_parsed) {
    IN_res.setHeader('Content-Type','text/html');
    IN_res.writeHead(200);
    IN_res.end( FILES_route_auth.html_login );
  },
  '/js/auth/login': async function( IN_req, IN_res, IN_url_parsed) {
    IN_res.setHeader('Content-Type','text/javascript');
    IN_res.writeHead(200);
    IN_res.end( FILES_route_auth.js_login );
  },
  '/css/auth/login': async function( IN_req, IN_res, IN_url_parsed) {
    IN_res.setHeader('Content-Type','text/css');
    IN_res.writeHead(200);
    IN_res.end( FILES_route_auth.css_login );
  },
  // Auth signup
  '/auth/signup': async function( IN_req, IN_res, IN_url_parsed) {
    IN_res.setHeader('Content-Type','text/html');
    IN_res.writeHead(200);
    IN_res.end( FILES_route_auth.html_signup );
  },
  '/js/auth/signup': async function( IN_req, IN_res, IN_url_parsed) {
    IN_res.setHeader('Content-Type','text/javascript');
    IN_res.writeHead(200);
    IN_res.end( FILES_route_auth.js_signup );
  },
  '/css/auth/signup': async function( IN_req, IN_res, IN_url_parsed) {
    IN_res.setHeader('Content-Type','text/css');
    IN_res.writeHead(200);
    IN_res.end( FILES_route_auth.css_signup );
  },
  // - login_passphrase
  '/auth/login_passphrase': async function( IN_req, IN_res, IN_url_parsed) {
    IN_res.setHeader('Content-Type','text/html');
    IN_res.writeHead(200);
    IN_res.end( FILES_route_auth.html_login_passphrase );
  },
  '/js/auth/login_passphrase': async function( IN_req, IN_res, IN_url_parsed) {
    IN_res.setHeader('Content-Type','text/javascript');
    IN_res.writeHead(200);
    IN_res.end( FILES_route_auth.js_login_passphrase );
  },
  '/css/auth/login_passphrase': async function( IN_req, IN_res, IN_url_parsed) {
    IN_res.setHeader('Content-Type','text/css');
    IN_res.writeHead(200);
    IN_res.end( FILES_route_auth.css_login_passphrase );
  },
  // main : SPA
  '/main': async function( IN_req, IN_res, IN_url_parsed) {
    IN_res.setHeader('Content-Type','text/html');
    IN_res.writeHead(200);
    IN_res.end( FILES_route_main.html );
  },
  '/js/main': async function( IN_req, IN_res, IN_url_parsed) {
    IN_res.setHeader('Content-Type','text/javascript');
    IN_res.writeHead(200);
    IN_res.end( FILES_route_main.js );
  },
  '/css/main': async function( IN_req, IN_res, IN_url_parsed) {
    IN_res.setHeader('Content-Type','text/css');
    IN_res.writeHead(200);
    IN_res.end( FILES_route_main.css );
  },
  '/main/api':async function( IN_req, IN_res, IN_url_parsed )
  {
    await FILES_route_main.api( IN_req, IN_res, IN_url_parsed );
  },

  // Fonts
  '/fonts/big_shoulders_regular': async function( IN_req, IN_res, IN_url_parsed )
  {
    IN_res.setHeader('Content-Type','font/ttf');
    IN_res.writeHead(200);
    IN_res.end( FILES_fonts.big_shoulders_regular );
  },
  '/fonts/montserrat_alternates_regular': async function( IN_req, IN_res, IN_url_parsed )
  {
    IN_res.setHeader('Content-Type','font/ttf');
    IN_res.writeHead(200);
    IN_res.end( FILES_fonts.montserrat_alternates_regular );
  },
  '/fonts/train_one_regular': async function( IN_req, IN_res, IN_url_parsed )
  {
    IN_res.setHeader('Content-Type','font/ttf');
    IN_res.writeHead(200);
    IN_res.end( FILES_fonts.train_one_regular );
  },
  // Lib
  '/js/lib/DOMPurify': async function( IN_req, IN_res, IN_url_parsed) {
    IN_res.setHeader('Content-Type','text/javascript');
    IN_res.writeHead(200);
    IN_res.end( FILES_lib.dom_purify );
  },
};

module.exports = ROUTES_https;
