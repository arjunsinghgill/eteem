// ASG portfolio 
// eteem src https routes auth signup
// Arjun Singh Gill

const form = document.getElementById("submit_form");

form.addEventListener( "submit", async function (evt) {
  evt.preventDefault();
  await submit_signup(evt.target);
} );

let RegExp_signup = {
  first_name  : new RegExp('^[A-Za-z]{1,20}$'),
  middle_name : new RegExp('^[A-Za-z]{1,20}$'),
  last_name   : new RegExp('^[A-Za-z]{1,20}$'),
  username    : new RegExp('^[A-Za-z0-9_]{1,40}$'),
  passphrase  : new RegExp('^[A-Za-z0-9_ ]{10,80}$'),
  email       : new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'),
  dob         : new RegExp('^[0-9]{4}-[0-9]{2}-[0-9]{2}$'),
};

async function submit_signup( form_element )
{
  // get the form data
  let form_data = {
    first_name  : form_element.querySelector("#first_name").value,
    middle_name : form_element.querySelector("#middle_name").value,
    last_name   : form_element.querySelector("#last_name").value,
    username    : form_element.querySelector("#username").value,
    email       : form_element.querySelector("#email").value,
    dob         : form_element.querySelector("#dob").value,
    password    : form_element.querySelector("#password").value,
    re_password : form_element.querySelector("#re_password").value,
    passphrase    : form_element.querySelector("#passphrase").value,
  };
  // validate the form data
  if( !RegExp_signup.first_name.test( form_data.first_name ) ) throw new Error(`-E- Invalid first name!`);
  if( !RegExp_signup.middle_name.test( form_data.middle_name ) ) throw new Error(`-E- Invalid middle name!`);
  if( !RegExp_signup.last_name.test( form_data.last_name ) ) throw new Error(`-E- Invalid last name!`);
  if( !RegExp_signup.username.test( form_data.username ) ) throw new Error(`-E- Invalid username!`);
  if( !RegExp_signup.passphrase.test( form_data.passphrase ) ) throw new Error(`-E- Invalid passphrase!`);
  if( !RegExp_signup.email.test( form_data.email ) ) throw new Error(`-E- Invalid email!`);
  if( !RegExp_signup.dob.test( form_data.dob ) ) throw new Error(`-E- Invalid dob!`);
  if( form_data.password !== form_data.re_password ) throw new Error(`-E- passwords don't match!`);

  // if here, make the signup API call
  let res = await fetch( `/auth/api?q=signup&first_name=${form_data.first_name}&middle_name=${form_data.middle_name}&last_name=${form_data.last_name}&username=${form_data.username}&email=${form_data.email}&dob=${form_data.dob}&password=${form_data.password}`  );
  if(res.ok == true) {
    // get the salt from server
    let result_salt = await fetch(`/auth/api?q=get_salt&username=${form_data.username}`);
    // Generate the keys
    let key_pair = generateAsymmetricKeys(form_data.passphrase, result_salt);
    // 
    // public key api call
    res = await fetch( `/auth/api?q=signup_public_key&username=${form_data.username}&public_key=${key_pair.publicKey}`  );
    if(res.ok == true) {
      window.location.assign('/');
    } else {
      window.location.assign('/signup-error');
    }
  } else {
    window.location.assign('/signup-error');
  }
}


// 
