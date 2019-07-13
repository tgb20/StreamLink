const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const bcrypt = require('bcrypt')
var cron = require('node-cron');
let Link = require('./Link')


let links = []

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

io.on('connection', (socket) => {
    console.log('a user connected')

    socket.on('disconnect', () => {
        console.log('user disconnected')
    })

    socket.on('createlink', (data) => {
        let jsonParse = JSON.parse(data)
        let device_id = jsonParse.device_id
        let link_password = jsonParse.link_password
        let link_description = jsonParse.link_description

        let hashed_password = bcrypt.hashSync(link_password, 10)

        var deviceRegistered = false
        var registeredLink

        links.forEach((item, index, array) => {
            if(item.owner_id == device_id){
                deviceRegistered = true
                registeredLink = item
                return
            }
        })


        if(deviceRegistered){
            socket.emit('linkcreated', JSON.stringify({device_id: registeredLink.owner_id, link_code: registeredLink.link_code, link_description: registeredLink.link_description}))
            socket.join(registeredLink.link_code)
        }else{
            let link = new Link(device_id, hashed_password, link_description)
            link.generateLinkCode()
            links.push(link)

            socket.emit('linkcreated', JSON.stringify({device_id: link.owner_id, link_code: link.link_code, link_description: link.link_description}))
            socket.join(link.link_code)
        }
        console.log("Link Created")
    })

    socket.on('joinlink', (data) => {
        let jsonParse = JSON.parse(data)
        let device_id = jsonParse.device_id
        let link_code = jsonParse.link_code
        let link_password = jsonParse.link_password


        let hashed_password = bcrypt.hashSync(link_password, 10)

        var foundLink = null

        links.forEach( (item, index, array) => {
            if(item.link_code == link_code){
                foundLink = item
            }
        })

        if(foundLink == null){
            // Fail
            socket.emit('linkjoined', JSON.stringify({device_id: device_id, link_code: link_code, success: false}))
            console.log("No Link Found!")
        }else if(hashed_password == foundLink.link_password){
            // Fail
            socket.emit('linkjoined', JSON.stringify({device_id: device_id, link_code: link_code, success: false}))
            console.log("Invalid Passowrd!")
        }else{
            // Success
            socket.emit('linkjoined', JSON.stringify({device_id: device_id, link_code: link_code, success: true, link_description: foundLink.link_description}))
            socket.join(foundLink.link_code)
        }
        console.log("Link Joined")
    })

    socket.on('message', (data) => {
        let jsonParse = JSON.parse(data)

        let link_code = jsonParse.link_code

        links.forEach( (item, index, array) => {
            if(item.link_code == link_code){
                item.updateLastMessage()
            }
        })

        io.to(link_code).emit('newmessage', data)
    })

})


cron.schedule('* * */23 * * *', () => {

    console.log('Wiping old links');

    var deadLinks = 0

    var currentTime = new Date().getTime()

    links.forEach( (item, index, array) => {
        
        if(currentTime - item.last_message > 86400000){
            links.splice(index, 1)
            deadLinks += 1
        }
    })

    console.log("Deleted " + deadLinks.toString() + " links")

});


http.listen(3000, () => {
    console.log('listening on *:3000')
})