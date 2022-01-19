//@ts-check
process.env.BASEURL = 'http://localhost:4000/'
//@ts-ignore
const axios = require('axios').create({
    baseURL: process.env.BASEURL,
    headers: {'Content-Type': 'application/vnd.api+json'}
})

//this setup function is to aquire auth for the whole suite to use.
module.exports = async function () {
    const res = await axios.post('users/login', {
        "data": {
            "type": "users",
            "attributes": {
                "email": "admin@localhost.domain",
                "password": "1234567890"
            }
        }
    })
    process.env.TOKEN = res.data.data.token
}