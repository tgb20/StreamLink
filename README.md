# Link

Documentation for the serverside implementation of Link, a MIT App Inventor Extension designed to allow for video and data transfer between devices across networks.


## Quick Info
- Data is currently *NOT* encrypted
- Passwords are currently in *plaintext*
- Communication between devices and server is handled by [socket.io](https://socket.io/)

## Links

Links are stored in volatile memory of the server do save any message information.
```
var Link = function(id, password) {
	this.id = id
	this.password = password
	this.lastmessage = new Date().getTime()
	this.linkcode = generateLinkCode()
	this.devices = []
}
```

Link codes are 4 alphanumeric characters unique *only* within a server and are filtered to not contain any inappropriate terms.

Future supports for reserving links is planned, as of now links are active for 24 hours after thier last message.

## Emissions
*Link version of a HTTP Request*

### Make a new Link
To make a link you must send a request. Only one link can be active per device, so if a device sends a request for a new link while an old one is still active, the old link will be used instead of making a new link.

Emit `createlink`

`device_id` is the id of the device requesting to make a link

`link_password` is the password that should be applied to this link
```
{
	“device_uuid”: “”,
	“link_password”: “”
}
```

### Join a link
To send a message to a link you must send a request containing all information needed by the recieving clients to know if the message pertains to them.

Emit `joinlink`

`device_id` is the id of the device requesting to join the link

`link_code` is the uuid of the device requesting to join the link

`link_password` is the password that should be applied to this link
```
{
	“device_id”: “”,
	“link_code“: “”,
	“link_password”: “”
}
```


### Send a message
To send a message to a link you must send a request.

Emit `sendmessage`

`device_id` is the uuid of the device sending the message

`link_code` is the link code for the link to send the message to

`link_password` is the password that the link uses

`type` is the type of message being sent (currently only string)

`message` is the object being sent

```
{
	“device_id”: “”,
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

`device_id` is the uuid of the device that requested to make this link

`link_code` is the link code for this link, or “null” if it failed
```
{
	“device_id”: “”,	
	“link_code”: “”
}
```

### When a message is recieved
When a message is sent to the server this event is emitted to all devices attached ti the link.

On `newmessage`

`device_id` is the id of the device that send the message

`type` is type of data the message is (currently only string)

`message` is the content of the message
```
{
	“device_id”: “”,
	“type“: “”	
	“message”: object
}
```

