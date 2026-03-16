// The Inbox Data Structure used to store the messages
const INBOX = [
  { 
    user:'user_1',
    public_key: '',
    messages: [
      { time:'time_0', text:'Hello', type:'out' },
      { time:'time_1', text:'Hey Hello! How have you been?', type:'in' },
      { time:'time_2', text:'I am good!', type:'out' },
      { time:'time_3', text:'Long time ... how is life?', type:'out' },
      { time:'time_4', text:'Its going ... lol', type:'in' },
      { time:'time_5', text:'hbu?', type:'in' },
      { time:'time_6', text:'Same here ... haha ha ... its going too :)', type:'out' },
    ]  
  },
  { 
    user:'user_2',
    public_key: '',
    messages: [
      { time:'time_0', text:'Hello ... ...', type:'out' },
      { time:'time_1', text:'Hey Hello! How have you been? ... ...', type:'in' },
      { time:'time_2', text:'I am good! ... ...', type:'out' },
      { time:'time_3', text:'Long time ... how is life? ... ...', type:'out' },
      { time:'time_4', text:'Its going ... lol ... ...', type:'in' },
      { time:'time_5', text:'hbu? ... ...', type:'in' },
      { time:'time_6', text:'Same here ... haha ha ... its going too :) ... ...', type:'out' },
    ]  
  }
];

function FX_display_contact_message(evt)
{
  let html_el = evt.srcElement;
  let inbox_idx = html_el.getAttribute('inbox_idx');
  FX_load_inbox_message(inbox_idx);
}

function FX_load_inbox( data )
{
  // Get the INBOX div
  let DIV_inbox = document.getElementById('contact_list');
  // Clear the current INBOX HTML DIVs
  DIV_inbox.innerHTML = '';
  // Iterate over all users and add their name and ID to the INBOX
  for( let ii=0; ii < data.length; ii++)
  {
    // get the data element
    let data_el = data[ii];
    // create a new HTML element per data element
    let DIV_ii = document.createElement('button');
    // add user label
    DIV_ii.textContent = data_el.user;
    // attach action FX
    DIV_ii.addEventListener('click',FX_display_contact_message);
    // set it s class
    DIV_ii.classList.add('contact_list_el');
    // set its message_idx attribute
    DIV_ii.setAttribute('inbox_idx',ii);
    // add it to the INBOX
    DIV_inbox.appendChild( DIV_ii );
    // insert the data element to the inbox
  }
}


FX_load_inbox(INBOX);


function FX_load_inbox_message( message_idx )
{
  // Clear the current message texts
  // Check if message_idx is valid
  if( message_idx < 0 || message_idx > INBOX.length - 1 ) throw new Error('-E- FX_load_inbox_message invalid message_idx', message_idx);
  // Get the MESSAGE_ELEMENT
  let messages = INBOX[ message_idx ].messages;
  // get the CONTACT_MESSAGE DIV
  let DIV_contact_message = document.getElementById('contact_message_div_text');
  // clear the current messages
  DIV_contact_message.innerHTML = '';
  // iterate over message text and add them to the Message BOX
  for(let ii=0; ii < messages.length; ii++)
  {
    // get the message
    let msg = messages[ii];
    // initialize the data holders
    let div_msg_el;
    // add it to the message read box
    // decrypt the text on the fly ...
    switch(msg.type)
    {
      case 'in':
        div_msg_el = document.createElement('div');
        div_msg_el.classList.add('contact_message_text_in');
        div_msg_el.innerText = msg.text;
        DIV_contact_message.appendChild(div_msg_el.cloneNode(true));
        break
      case 'out':
        div_msg_el = document.createElement('div');
        div_msg_el.classList.add('contact_message_text_out');
        div_msg_el.innerText = msg.text;
        DIV_contact_message.appendChild(div_msg_el.cloneNode(true));
        break;
      default: throw new Error('-E- invalid message text type',msg.type,ii,INBOX[message_idx].user);
    }
  }
}

// attach the compose new message button to its handler
const button_compose_new_message = document.getElementById('menu_button_compose');
button_compose_new_message.addEventListener( 'click', async function (evt) {
  evt.preventDefault();
  await FX_compose_new_message();
} );

async function FX_compose_new_message( )
{
  console.log('compose new message');
  // create compose new message div
  let DIV_compose_new_message = document.createElement('div');
  DIV_compose_new_message.classList.add('compose_new_message');
  // create the compose new message div form
  let DIV_compose_new_message_form = document.createElement('form');
  DIV_compose_new_message_form.setAttribute('id','compose_new_message_form');
  DIV_compose_new_message_form.action = '/js/main';
  // create compose new message form input div
  let DIV_compose_new_message_form_input = document.createElement('input');
  DIV_compose_new_message_form_input.setAttribute('type','text');
  DIV_compose_new_message_form_input.setAttribute('id','compose_new_message_form_input_text');
  DIV_compose_new_message_form_input.setAttribute('name','compose_new_message_form_input_text');
  DIV_compose_new_message_form_input.setAttribute('placeholder','enter username ...');
  // create the compose new message form input submit button
  let DIV_compose_new_message_form_input_button = document.createElement('button');
  DIV_compose_new_message_form_input_button.setAttribute('id','compose_new_mesage_form_input_button');
  DIV_compose_new_message_form_input_button.setAttribute('type','submit');
  DIV_compose_new_message_form_input_button.innerText = 'compose';
  // create the cancel new messsage button
  let DIV_cancel_new_message_form_input_button = document.createElement('button');
  DIV_cancel_new_message_form_input_button.setAttribute('id','cancel_new_mesage_form_input_button');
  DIV_cancel_new_message_form_input_button.setAttribute('type','submit');
  DIV_cancel_new_message_form_input_button.innerText = 'cancel';
  DIV_cancel_new_message_form_input_button.addEventListener('click', function(evt) {
    // delete the divs
    DIV_compose_new_message_form.remove();
  });
  // Append the DIVs
  DIV_compose_new_message.appendChild( DIV_compose_new_message_form );
  DIV_compose_new_message_form.appendChild(DIV_compose_new_message_form_input);
  DIV_compose_new_message_form.appendChild(DIV_compose_new_message_form_input_button);
  DIV_compose_new_message_form.appendChild(DIV_cancel_new_message_form_input_button);
  // Add the DIV to the document
  document.body.appendChild(DIV_compose_new_message);

  DIV_compose_new_message_form.addEventListener('submit', async function(evt) {
    evt.preventDefault();
    // remove the cancel button
    DIV_cancel_new_message_form_input_button.remove();
    // get the entered username
    let compose_username = DIV_compose_new_message_form.querySelector("#compose_new_message_form_input_text").value;
    //  send request to server to check if user exists
    let result = await fetch(`/main/api?q=compose&username=${compose_username}`);
    if(result.ok == true) {
      // get the JSON response
      let result_json = await result.json();
      console.log("User Data", result_json);
    } else {
      DIV_compose_new_message_form.querySelector("#compose_new_message_form_input_text").value = 'User not found!';
      DIV_compose_new_message_form_input_button.innerText = 'return';
    }
  });


  // wait for submit button to finish its job
  // check if the user is valid from the server
  // if yes, then add the new user message to INBOX along with their public key
  // else show error 
  // remove the compose message DIV on exit
}

