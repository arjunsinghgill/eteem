#   Arjun Singh Gill
##   ( PORTFOLIO )
##    eteem ( end-to-end encrypted messenger )

This is a privacy centric end to end PGP encrypted messenger. Send textand media messages. We do not store your content on servers, userss control retention and deletion on their end. Every user device gets a separatate inbox.

Fonts ( fonts.google.com ) - 
- title   : train one regular
- menu    : big shoulders regular
- text    : montserrat alternates regular

For now, this is a monolithic app. For future, there is possibility to convert this into micro-services by decoupling the db|disk|https|session|wss instances and using appropriate gRPC wrapper for micro-services

The key derivation salt needs to be stored somewhere, the key derivation passphrase is in user's mind. We generate and store the salt in the server and after logging on, the salt is transferred to the client. This salt is then used by the user to generate the private and public key pair which is used for encryption/decryption. The public key is sent by client to the server which can be used by the server to send to other clients for encryption of their messages to this user.

This way, the server has client's public key, it provides the salt and the private key remains on the client and never leaves the client.

