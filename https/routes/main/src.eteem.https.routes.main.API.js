// ASG portfolio
// eteem src https main
// Arjun Singh Gill

// NodeJS modules
const path    = require('path');
const { URL } = require('url');
const bcrypt  = require('bcrypt');
const crypto  = require('crypto');
const openpgp = require('openpgp');

const APP_db = require( path.resolve(__dirname, '../../../db/src.eteem.db.js') );

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


async function API_main( IN_req, IN_res, IN_url_parsed )
{
  // get the URL search params which contain query data
  let TMP_url_search_params = new URLSearchParams( IN_url_parsed.searchParams );
  // get the query
  let query = TMP_url_search_params.get('q');
  // initialize the inst_req object
  let inst_req = {};
  // initialize the PGP keys variables
  let pgp_keys, result;
  // serve the query
  switch(query)
  {
    case 'compose':
      inst_req.username = TMP_url_search_params.get('username');
      console.log(inst_req);
      // fetch the username from DB
      result = await APP_db.read_app_user(inst_req);
      // if exists, serve user
      if(result.OK == true) {
        let res_row = result.data.rows[0];
        FX_serve_200( 
          IN_res, 
          {
            username: res_row.username,
            first_name : res_row.first_name,
            middle_name : res_row.middle_name,
            last_name : res_row.last_name,
          }
        );
      } else {
        FX_serve_400( IN_res, 'User not found!' );
      }
      break;
    default: throw new Error(`-E- Invalid q!`);
  }
}

module.exports = API_main;
