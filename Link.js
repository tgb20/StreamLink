class Link {
    constructor(device_id, link_password, description) {
        this.owner_id = device_id
        this.link_password = link_password
        this.link_description = description
        this.last_message = new Date().getTime()
        this.link_code = ""
    }

    generateLinkCode(){
        var code = Math.random().toString(36).substr(2, 4).toUpperCase()

        // Filter Code

        this.link_code = code
    }

}


module.exports = Link