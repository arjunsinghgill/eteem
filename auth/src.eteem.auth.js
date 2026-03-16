// ASG portfolio
// eteem src auth
// Arjun Singh Gill

// NodeJS modules
const path    = require('path');
const { URL } = require('url');
const bcrypt  = require('bcrypt');
const crypto  = require('crypto');

// stores the session with a session ID
const GLOBAL_session = {};

// App modules
const APP_db = require( path.resolve(__dirname, '../db/src.eteem.db.js') );

const REGEXP_auth = {
  first_name  : new RegExp('^[A-Za-z]{1,20}$'),
  middle_name : new RegExp('^[A-Za-z]{1,20}$'),
  last_name   : new RegExp('^[A-Za-z]{1,20}$'),
  username    : new RegExp('^[A-Za-z0-9_]{1,40}$'),
  passphrase  : new RegExp('^[A-Za-z0-9_ ]{10,40}$'),
  email       : new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'),
  dob         : new RegExp('^[0-9]{4}-[0-9]{2}-[0-9]{2}$'),
  password_A  : new RegExp('^[A-Za-z0-9_&^]{8,40}$'), // password length
  password_B  : new RegExp('[A-Z]{1}'), // Upper Case Letter
  password_C  : new RegExp('[a-z]{1}'), // Lower Case Letter
  password_D  : new RegExp('[0-9]{1}'), // Numeric Character
  password_E  : new RegExp('[_&^]'),  // Special Character
  uuid        : new RegExp( '[.]{36}' ),
  password_hash : new RegExp('^[.]{60}$'), // password length
};


async function FX_auth_signup( IN_cfg )
{
  // validate the IN_cfg options
  // - first_name
  if( !REGEXP_auth.first_name.test( IN_cfg.first_name ) ) return { OK:false, msg:'Invalid first_name.' };
  // - middle_name
  if( !REGEXP_auth.middle_name.test( IN_cfg.middle_name ) ) return { OK:false, msg:'Invalid middle_name.' };
  // - last_name
  if( !REGEXP_auth.last_name.test( IN_cfg.last_name ) ) return { OK:false, msg:'Invalid last_name.' };
  // - email
  if( !REGEXP_auth.email.test( IN_cfg.email ) ) return { OK:false, msg:'Invalid email.' };
  // - username
  if( !REGEXP_auth.username.test( IN_cfg.username ) ) return { OK:false, msg:'Invalid username.' };
  // - dob
  if( !REGEXP_auth.dob.test( IN_cfg.dob ) ) return { OK:false, msg:'Invalid dob.' };
  // - password_A
  if( !REGEXP_auth.password_A.test( IN_cfg.password ) ) return { OK:false, msg:'Invalid password.' };
  // - password_B
  if( !REGEXP_auth.password_B.test( IN_cfg.password ) ) return { OK:false, msg:'Invalid password.' };
  // - password_C
  if( !REGEXP_auth.password_C.test( IN_cfg.password ) ) return { OK:false, msg:'Invalid password.' };
  // - password_D
  if( !REGEXP_auth.password_D.test( IN_cfg.password ) ) return { OK:false, msg:'Invalid password.' };
  // - password_E
  if( !REGEXP_auth.password_E.test( IN_cfg.password ) ) return { OK:false, msg:'Invalid password.' };

  // Insert app_user in DB
  let result  = await APP_db.create_app_user( IN_cfg );
  if(result.OK !== true) return { OK:false, msg:`Could not create_app_user : ${result.msg}` };
  // Generate the bcrypt hash
  IN_cfg.bcrypt_hash = await bcrypt.hash( IN_cfg.password, 10 );
  // Generate the salt
  IN_cfg.salt = crypto.randomBytes(16).toString('hex');
  // Insert app_user_pwd in DB
  result = await APP_db.create_user_pwd( IN_cfg );
  // check if insertion went through, else return error
  if( result.OK == true ) {
    return { OK:true, data:'{ log: Signup successful!}' }
  } else {
    return { OK:false, msg:'Signup Unsuccessful' };
  }
}

async function FX_auth_signup_public_key( IN_cfg )
{
  // check if UUID exists in app_user db
  let result = await APP_db.read_app_user(IN_cfg);
  // if yes, insert public key into the third table 
  if( result.OK == true ) {
    IN_cfg.uuid = result.data.rows[0].uuid;
    result = await APP_db.create_user_public_key( IN_cfg );
    return { OK:true, data:'{ log: Save public key successful!}' }
  } else {
    return { OK:false, msg:'Save public key Unsuccessful' };
  }
}

async function FX_get_salt( IN_cfg )
{
  let result = await APP_db.read_app_user(IN_cfg);
  if( result.OK == true ) {
    let result_read_pwd = await APP_db.read_app_pwd( { uuid:result.data.rows[0].uuid } );
    return { OK:true, data:result_read_pwd.data }
  } else {
    return { OK:false, msg:'Save public key Unsuccessful' };
  }
}

async function FX_auth_login( IN_cfg )
{
  // validate IN_cfg options
  if( !REGEXP_auth.username.test( IN_cfg.username ) ) return { OK:false, msg:'Invalid username.' };
  // - password_A
  if( !REGEXP_auth.password_A.test( IN_cfg.password ) ) return { OK:false, msg:'Invalid password.' };
  // - password_B
  if( !REGEXP_auth.password_B.test( IN_cfg.password ) ) return { OK:false, msg:'Invalid password.' };
  // - password_C
  if( !REGEXP_auth.password_C.test( IN_cfg.password ) ) return { OK:false, msg:'Invalid password.' };
  // - password_D
  if( !REGEXP_auth.password_D.test( IN_cfg.password ) ) return { OK:false, msg:'Invalid password.' };
  // - password_E
  if( !REGEXP_auth.password_E.test( IN_cfg.password ) ) return { OK:false, msg:'Invalid password.' };

  // fetch the username from app user
  let result = await APP_db.read_app_user(IN_cfg);
  // if result not true, return error
  if( result.OK !== true ) return { OK:false, msg:'Invalid user name!' };
  // get the row data object
  let result_obj = result.data.rows[0];
  // add UUID to IN_cfg
  IN_cfg.uuid = result_obj.uuid;
  // fetch the app_user_pwd
  result = await APP_db.read_app_pwd(IN_cfg);
  // if result not true, return error
  if( result.OK !== true ) return { OK:false, msg:'Invalid user name!' };
  // fetch the user password object
  let result_obj_pwd = result.data.rows[0];
  // compare the password hash
  let password_comparison_result = await bcrypt.compare( IN_cfg.password, result_obj_pwd.bcrypt_hash );
  // if comparison result is true, generate session ID from session and complete login
  if( password_comparison_result == true )
  {
    // generate session login
    let TMP_session_id = crypto.randomBytes(16).toString('hex');
    // check if session ID is already present
    if( TMP_session_id in GLOBAL_session ) { 
      return { OK:false, msg:'Something went wrong. Please try to login again.' }; 
    };
    // store the session info
    GLOBAL_session[ TMP_session_id ] = {
      uuid : IN_cfg.uuid,
      role : 'app_user'
    };
    return { OK:true, data:{ log :'Login successful!', session_id:TMP_session_id, salt:result_obj_pwd.salt } };

  } else {
    return { OK:false, msg:'Could not login. Invalid password!' }
  }
}

module.exports = {
  signup : FX_auth_signup,
  login  : FX_auth_login,
  signup_public_key : FX_auth_signup_public_key,
  get_salt : FX_get_salt,
};
