# StreamLink

Documentation for the serverside implementation of StreamLink, a MIT App Inventor Extension designed to allow for video and data transfer between devices across networks.


## Quick Info
- SSL is *not* currently enabled
- Passwords are hashed server side
- Communication between devices and server is handled by [socket.io](https://socket.io/)
- DeviceIDs are currently set client side and are not enforced. This will be changed in the future.

## Links

Links are stored in volatile memory of the server do save any message information.
```
class Link {
    constructor(device_id, link_password) {
        this.owner_id = device_id
        this.link_password = link_password
        this.last_message = new Date().getTime()
        this.link_code = ""
    }

    generateLinkCode(){
        var code = Math.random().toString(36).substr(2, 4).toUpperCase()

        // Filter Code

        this.link_code = code
    }

}
```

Link codes are 4 alphanumeric characters unique *only* within a server and are filtered to not contain any inappropriate terms.

Future supports for reserving links is planned, as of now links are randomly assigned to devices. It is also planned for non reserved links to expire after 24 hours.

## Emits
A client communicates to the server using 3 emits

### createlink
Creates a new link, or if a link already exists for a device idea return that.

Returns `linkcreated`

### joinlink
Joins a link if the password and link code match an existing link.

Returns `linkjoined`

### message
Sends a message to a link.

Returns `newmessage`