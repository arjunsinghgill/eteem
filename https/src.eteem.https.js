// ASG portfolio 
// eteem src https
// Arjun Singh Gill

const fs    = require('fs');
const path  = require('path');
const { URL } = require('url');
const https = require('https');

const HTTPS_TLS_CERTS = {
  key   : fs.readFileSync( path.resolve( __dirname, './certs/src.https.certs.tls.key' ) ),
  cert  : fs.readFileSync( path.resolve( __dirname, './certs/src.https.certs.tls.cert' ) ),
};
const HTTPS_ROUTES = require( path.resolve( __dirname, './routes/src.eteem.https.routes.js' ) );

const HTTPS_TLS_SERVER = https.createServer( HTTPS_TLS_CERTS, async (req,res) => {
  // Wrap the route handler call in a try-catch block
  try {
    // parse the url
    let TMP_url_parsed = new URL( req.url, "https://localhost:8081/" );
    // store the pathname
    let TMP_pathname = TMP_url_parsed.pathname;
    // trim the last slash in url pathname
    if( TMP_pathname[ TMP_pathname.length - 1 ] == '/' )
    {
      // remove the last forward slash
      TMP_pathname = TMP_pathname.slice(0,-1);
      // if pathname is empty, then serve the home route
      if( TMP_pathname == '' ) TMP_pathname = '/';
    }
    // if pathname in routes, serve it
    if( TMP_pathname in HTTPS_ROUTES ) {
      // serve the route
      await HTTPS_ROUTES[ TMP_pathname ]( req, res, TMP_url_parsed );
    } else {
      res.setHeader('Content-Type','text/html');
      res.writeHead(404);
      res.end('{ msg: Sorry, URL not found. }');
    }
  } catch(err) {
    res.setHeader('Content-Type','text/html');
    res.writeHead(404);
    res.end(`{ msg: Sorry, could not complete the request. }`);
  }

} ).listen(8081);

console.log('HTTPS server running at port : 8081');

