// ASG portfolio
// eteem src db
// Arjun Singh Gill

// NodeJS modules
const { Client } = require('pg');
const path    = require('path');

// connect to the PG client
const PG = {
  client      : new Client({ database:'eteem_db' }),
  connected   : false,
  initialized : false,
};



// TBD
// - escape characters for SQL .. already doing parameterized queries so just do a double check
// - need to avoid XSS attacks, so every user input needs to be sanitized ... including the ones in UI ... MDN has built in stuff for that so use it maybe ....
// - the main app page will have all the informatoin, messages and their individual data has to be lazy loaded ... 
// - in the wide screen mode the all the messages window is shown on the left ... in the non-wide screen it is a separate menu but make that a state ... so there have to be two UI's boiled into one ... 





// function to connect to the database
async function PG_connect()
{
  try {
    // connect the PG client
    await PG.client.connect();
    // update the status
    PG.connected = true;
//    let result = await PG.client.query( `SELECT * FROM app_user WHERE email = 'tmp_fail@email.com';` );
//    console.log('::: RESULT ::: ',result);
//    let result = await PG.client.query( `INSERT INTO app_user ( uuid, first_name, middle_name, last_name, date_of_birth, email, username ) VALUES ( 'UUIDDSFSDF', 'first', 'middle', 'last', '2022-12-12', 'dfsdfd@gma.com', 'testsername' );` );
//    console.log('::: RESULT ::: ',result);
  } catch(err) {
    console.error('APP_db PG_connect error:',err);
    PG.connected = false;
  }
}

PG_connect();


async function FX_db_create_app_user( IN_cfg )
{
  // check if the database connection is valid
  if( !PG.connected ) return { OK:false, msg:'Could not connect to DB!' };

  // check if email is already present in user table
  let result = await PG.client.query( `SELECT * FROM app_user WHERE email = $1;`, [IN_cfg.email] );
  // check if result rowcount is 0 otherwise email already exists
  if( result.rowCount !== 0 ) return { OK:false, msg:'Email address already taken!' };
  
  // check if username is already present in user table
  result = await PG.client.query( `SELECT * FROM app_user WHERE username = $1;`,[IN_cfg.username] );
  // check if result rowcount is 0 otherwise username already exists
  if( result.rowCount !== 0 ) return { OK:false, msg:'Username is already taken!' };

  // check if uuid is already present in user table
  result = await PG.client.query( `SELECT * FROM app_user WHERE uuid = $1;`,[IN_cfg.uuid] );
  // check if result rowcount is 0 otherwise uuid already exists
  if( result.rowCount !== 0 ) return { OK:false, msg:'Something went wrong! Please try again!' };

  // All checks passed, insert the row in app_user
  result = await PG.client.query( 
    `INSERT INTO app_user ( uuid, first_name, middle_name, last_name, date_of_birth, email, username ) VALUES ( $1, $2, $3, $4, $5, $6, $7  );`, 
    [ IN_cfg.uuid, IN_cfg.first_name, IN_cfg.middle_name, IN_cfg.last_name, IN_cfg.dob, IN_cfg.email, IN_cfg.username] 
  );
  // verify row count and serve true else return false
  if(result.rowCount == 1) {
    return { OK:true, data:result };
  } else {
    return { OK:false, msg:'Could not insert row into table.' }
  }
}

async function FX_db_create_user_pwd( IN_cfg )
{
  // check if the database connection is valid
  if( !PG.connected ) return { OK:false, msg:'Could not connect to DB!' };

// extra step //  // check if uuid is already present in user table
// extra step //  let result = await PG.client.query( `SELECT * FROM app_user_pwd WHERE uuid = $1;`, [IN_cfg.uuid] );
// extra step //  // check if result rowcount is 0 otherwise uuid already exists
// extra step //  if( result.rowCount !== 0 ) return { OK:false, msg:'Something went wrong! Please try again!' };

  // insert the row in user_password
  result = await PG.client.query(
    `INSERT INTO app_user_pwd ( uuid,bcrypt_hash,salt ) VALUES ($1, $2, $3)`,
    [IN_cfg.uuid, IN_cfg.bcrypt_hash, IN_cfg.salt ]
  );
  // confirm that the entry went through
  if( result.rowCount == 1 ) { 
    return { OK:true, data:result };
  } else { 
    return { OK:false, msg:'Something went wrong! Please try again!' };
  }
}

async function FX_db_create_user_public_key( IN_cfg )
{
  // check if the database connection is valid
  if( !PG.connected ) return { OK:false, msg:'Could not connect to DB!' };

  // insert the row in user_password
  result = await PG.client.query(
    `INSERT INTO app_user_public_key ( uuid,public_key ) VALUES ($1, $2)`,
    [IN_cfg.uuid, IN_cfg.public_key ]
  );
  // confirm that the entry went through
  if( result.rowCount == 1 ) { 
    return { OK:true, data:result };
  } else { 
    return { OK:false, msg:'Something went wrong! Please try again!' };
  }
}

// function to retrieve app_user by username
async function FX_read_app_user( IN_cfg )
{
  // check if the database connection is valid
  if( !PG.connected ) return { OK:false, msg:'Could not connect to DB!' };

  // fetch the user
  let result = await PG.client.query(`SELECT * FROM app_user WHERE username=$1`,[IN_cfg.username]);
  if( result.rowCount == 1 ) { 
    return { OK:true, data:result };
  } else { 
    return { OK:false, msg:'Something went wrong! Please try again!' };
  }
}

// function to retrieve the user's uuid's password password
async function FX_read_user_pwd( IN_cfg )
{
  // check if the database connection is valid
  if( !PG.connected ) return { OK:false, msg:'Could not connect to DB!' };

  // fetch the user
  let result = await PG.client.query(`SELECT * FROM app_user_pwd WHERE uuid=$1`,[IN_cfg.uuid]);
  if( result.rowCount == 1 ) { 
    return { OK:true, data:result };
  } else { 
    return { OK:false, msg:'Something went wrong! Please try again!' };
  }
}

module.exports = {
  create_app_user : FX_db_create_app_user,
  create_user_pwd : FX_db_create_user_pwd,
  read_app_user : FX_read_app_user,
  read_app_pwd : FX_read_user_pwd,
  create_user_public_key: FX_db_create_user_public_key,
//  insert_user_pgp_keys : FX_db_insert_user_pgp_keys,
};

