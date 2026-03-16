// ASG portfolio
// eteem src https routes
// Arjun Singh Gill

// NodeJS modules
const path    = require('path');
const { URL } = require('url');
const bcrypt  = require('bcrypt');
const crypto  = require('crypto');
const openpgp = require('openpgp');

const bcrypt_salt_rounds = 10;

// App Modules
const APP_db = require( path.resolve( __dirname, '../../../db/src.eteem.db.js') );
const APP_auth = require( path.resolve( __dirname, '../../../auth/src.eteem.auth.js') );

async function FX_serve_200( IN_res, data )
{
  let data_txt = JSON.stringify(data);
  IN_res.setHeader('Content-Type','text/json');
  IN_res.writeHead(200);
  IN_res.end( data_txt );
}

async function FX_serve_404( IN_res, msg )
{
  IN_res.setHeader('Content-Type','text/json');
  IN_res.writeHead(404);
  IN_res.end( msg );
}

async function API_auth( IN_req, IN_res, IN_url_parsed )
{
  // get the URL search params which contain query data
  let TMP_url_search_params = new URLSearchParams( IN_url_parsed.searchParams );
  // get the query
  let query = TMP_url_search_params.get('q');
  // initialize the inst_req object
  let inst_req = {};
  // initialize the PGP keys variables
  let pgp_keys;
  // serve the query
  switch(query)
  {
    case 'signup': 
      // get the signup app_user query parameters
      inst_req.uuid        = crypto.randomUUID();
      inst_req.first_name  = TMP_url_search_params.get('first_name');
      inst_req.middle_name = TMP_url_search_params.get('middle_name');
      inst_req.last_name   = TMP_url_search_params.get('last_name');
      inst_req.email       = TMP_url_search_params.get('email');
      inst_req.dob         = TMP_url_search_params.get('dob');
      inst_req.username    = TMP_url_search_params.get('username');
      inst_req.password    = TMP_url_search_params.get('password');
      result = await APP_auth.signup( inst_req );
      // return result
      if(result.OK == true) {
        FX_serve_200( IN_res, 'Signup successful!' );
      } else {
        FX_serve_404( IN_res, 'Signup failed!' );
      }
      break;
    case 'signup_public_key':
      inst_req.username    = TMP_url_search_params.get('username');
      inst_req.public_key = TMP_url_search_params.get('public_key');
      result = await APP_auth.signup_public_key( inst_req );
      if(result.OK == true) {
        FX_serve_200( IN_res, 'Signup successful!' );
      } else {
        FX_serve_404( IN_res, 'Signup failed!' );
      }
      break;
    case 'get_salt':
      inst_req.username = TMP_url_search_params.get('username');
      result = await APP_auth.get_salt(inst_req);
      if(result.OK == true) {
        FX_serve_200( IN_res, result.data.rows[0].salt );
      } else {
        FX_serve_404(  IN_res, 'Login failed!' );
      }
      break;
    case 'login': 
      // get the login query parameters
      inst_req.username    = TMP_url_search_params.get('username');
      inst_req.password    = TMP_url_search_params.get('password');
      // check with session if the login went through
      result = await APP_auth.login( inst_req );
      // return result
      if(result.OK == true) {
        FX_serve_200( IN_res, result );
      } else {
        FX_serve_404(  IN_res, 'Login failed!' );
      }
      break;
    default: throw new Error(`-E- Invalid q!`);
  }
}

module.exports = API_auth;
