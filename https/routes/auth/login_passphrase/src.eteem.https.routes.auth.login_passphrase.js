// ASG portfolio 
// eteem src https routes auth login
// Arjun Singh Gill

const form = document.getElementById("login_passphrase_form");

form.addEventListener( "submit", async function (evt) {
  evt.preventDefault();
  await submit_login_passphrase(evt.target);
} );

let RegExp_login_passphrase = {
  login_passphrase    : new RegExp('^[A-Za-z0-9_]{1,40}$'),
};

// Index DB constants
const DB_NAME = 'KeyStoreDB';
const STORE_NAME = 'keys';
const DB_VERSION = 1;
const KEY_ID = 'myPrivateKey';

// Function to generate indexedDB Promise
function getDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = function(event) {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        // Create an object store to hold our CryptoKey objects
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = function(event) {
      resolve(event.target.result);
    };

    request.onerror = function(event) {
      reject('Database error: ' + event.target.errorCode);
    };
  });
}

async function submit_login_passphrase( form_element )
{
  // get the form data
  let form_data = {
    login_passphrase    : form_element.querySelector("#login_passphrase").value,
  };
  // validate the form data
  if( !RegExp_login_passphrase.login_passphrase.test( form_data.username ) ) throw new Error(`-E- Invalid login_passphrase!`);

  // Generate the keys here
  // - get the salt from sessionStorage
  let salt = sessionStorage.getItem('salt');
  // - generate the Argon2 keys
  let keyPair = await window.crypto.subtle.generateKey({
    name: "ECDSA",
    namedCurve: "P-256"
  },
    false, // extractable: false means the private key cannot be exported
    ["sign", "verify"]
  );

  // function to delete the salt and passphrase
  function FX_del_salt_passphrase()
  {
    salt = '-------- EMPTY STRING HERE --------';
    form_data.login_passphrase = '--------------------------- EMPTY STRING HERE --------------------------';
  }


  // - save the keys in indexedDB
  const db = await getDB();
  const transaction = db.transaction([STORE_NAME], "readwrite");
  const store = transaction.objectStore(STORE_NAME);
  const request = store.put( keyPair.privateKey, KEY_ID );
  request.onsuccess = function() {
    console.log('keys successfully generated and stored in indexed DB');
    // - delete the salt & passphrase
    FX_del_salt_passphrase();
    // - redirecto to main page
    window.location.replace("/main");
  }
  request.onerror = function(evt) {
    console.error('Error storing keys',evt.target.error);
    FX_del_salt_passphrase();
  }
}
