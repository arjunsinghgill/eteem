// ASG portfolio 
// eteem src https routes auth login
// Arjun Singh Gill

const form = document.getElementById("login_form");

form.addEventListener( "submit", async function (evt) {
  evt.preventDefault();
  await submit_login(evt.target);
} );

let RegExp_login = {
  username    : new RegExp('^[A-Za-z0-9_]{1,40}$'),
};


async function submit_login( form_element )
{
  // get the form data
  let form_data = {
    username    : form_element.querySelector("#username").value,
    password    : form_element.querySelector("#password").value,
  };
  // validate the form data
  if( !RegExp_login.username.test( form_data.username ) ) throw new Error(`-E- Invalid username!`);

  // if here, make the login API call
  let res = await fetch( `/auth/api?q=login&username=${form_data.username}&password=${form_data.password}`  );
  if( res.ok == true ) {
    let res_json = await res.json();
    // Store the sessionID in sessionStorage
    if('session_id' in res_json.data) {
      sessionStorage.setItem('session_id',res_json.data.session_id);
      if('salt' in res_json.data)
      {
        sessionStorage.setItem('salt',res_json.data.salt);
        console.log('login successful!');
        window.location.replace("/auth/login_passphrase");
        return;
      }
    }
    throw new Error(`login unsuccessful ... (type A)`);
  }else { 
    throw new Error(`login unsuccessful ... (type B)`);
  }
}


// 

