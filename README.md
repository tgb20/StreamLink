# Link

Documentation for the serverside implementation of Link, a MIT AppInventor Extension designed to allow for video and data transfer between devices across networks.


## Quick Info
- All devices recieve all messages
- Data is currently *NOT* encrypted
- Passwords are currently in *plaintext*
- Communication between devices and server is handled by [socket.io](https://socket.io/)

## Links

Links are stored in volatile memory of the server and only contain the UUID of the device that created it, its code, and its password.
```
var Link = function(uuid, password, code) {
	this.uuid = uuid
	this.password = password
	this.linkcode = generateLinkCode(code)
}
```

Link codes are 4 alphanumeric characters unique *only* within a server and are filtered to not contain any inappropriate terms.

Future supports for reserving links is planned, as of now links are active for 24 hours after thier last message or until the owner requests a new code.

## Emissions
*Link version of a HTTP Request*

### Make a new Link
To make a link you must send a request. Only one link can be active per device, so if a device sends a request for a new link while an old one is still active, the old link will be deleted.

Emit `createlink`

`device_uuid` is the uuid of the device requesting to make a link

`link_password` is the password that should be applied to this link

`code_pref` is the preferred link code you would like to use
```
{
	“device_uuid”: “”,
	“link_password”: “”,
	“code_pref”: “”
}
```

### Send a message
To send a message to a link you must send a request containing all information needed by the recieving clients to know if the message pertains to them.

Emit `sendmessage`

`device_uuid` is the uuid of the device sending the message

`link_code` is the link code for the link to send the message to

`link_password` is the password that the link uses

`type` is the type of message being sent (currently only string)

`message` is the object being sent

```
{
	“device_uuid”: “”,
	“link_code”: “”,
	“link_password”: “”,
	“type”: “”,
	“message”: object
}
```

## Events
*Link version of a HTTP return, but all devices subscribe to all events*

### When a link is created
When a link is created this event is emitted from the server. It can be ignored by any device, but the one that requested it.

On `linkcreated`

`device_uuid` is the uuid of the device that requested to make this link

`link_code` is the link code for this link, or NaN if it failed
```
{
	“device_uuid”: “”,	
	“link_code”: “”
}
```

### When a message is recieved
When a message is sent to the server this event is emitted. Devices should ignore the message if it is not directed to them. In the future will be encrypted so the link password is required to read them.

On `newmessage`

`link_code` is the link code for the link in which this message belongs to

`device_uuid` is the uuid of the device that send the message

`type` is type of data the message is (currently only string)

`message` is the content of the message
```
{
	”link_code”: “”,
	“device_uuid”: “”,
	“type“: “”	
	“message”: object
}
```

