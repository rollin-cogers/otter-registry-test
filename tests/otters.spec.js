//@ts-check
//@ts-ignore
const axios = require('axios').create({
    baseURL: process.env.BASEURL,
    headers: {'Content-Type': 'application/vnd.api+json'}
})

describe('Test Otters Endpoint: ', () => {
    //running list of otters to delete at the end of the test
    let ottersToDelete = []
    test('Should be able GET otters', async () => {
        const res = await axios.get("otters")
        expect(res.status).toBe(200)
        expect(res.data.data).toBeDefined()
        expect(Object.keys(res.data.data[0])).toEqual(["id", "type", "attributes", "relationships", "links"])
    })
    test('Otters should have correct schema', async () => {
        const res = await axios.get("otters")
        for(const otter of res.data.data) {
            expect(Object.keys(otter)).toEqual(["id", "type", "attributes", "relationships", "links"])
            expect(otter.type).toEqual("otters")
            expect(Object.keys(otter.attributes)).toEqual(["name", "age"])
            expect(Object.keys(otter.relationships)).toEqual(["habitat"])
            expect(Object.keys(otter.links)).toEqual(["self"])
            expect(otter.links.self).toEqual(`${process.env.BASEURL}otters/${otter.id}`)
        }

    })
    test('Otter names should match the correct pattern', async () => {
        const res = await axios.get("otters")
        for(const otter of res.data.data) {
            expect(otter.attributes.name).toMatch(/^[\w'-]{2,32}(( [\w'-]{1,32})? [\w'-]{2,32})?$/)
            expect(otter.attributes.name.length).toBeGreaterThan(0)
            expect(otter.attributes.name.length).toBeLessThan(99)
        }
    })
    test('Otter ages should match the correct pattern', async () => {
        const res = await axios.get("otters")
        for(const otter of res.data.data) {
            expect(typeof otter.attributes.age).toBe("number")
            expect(otter.attributes.age).toBeGreaterThan(0)
            expect(otter.attributes.age).toBeLessThan(99)
        }
    })
    xtest('Paging should be working', async () => {
        expect(true).toBe(true)
        //TODO: Write test
    })
    test('Should be able to POST Otters with valid body', async () => {
        const res = await axios.post(`otters?token=${process.env.TOKEN}`, {
            "data": {
                "type": "otters",
                "attributes": {
                    "name": "Testing"
                }
            }
        })
        expect(res.status).toBe(201)
        ottersToDelete.push(res.data.data.id)
        expect(Object.keys(res.data.data)).toEqual(["id", "type", "attributes", "relationships"])
    })
    test('Should NOT be able to POST Otters without required paramaeters', async () => {
        try {
            const res = await axios.post("otters", {})
            throw Error('Request passed with ' + res.status)
        }
        catch(err) {
            expect(err.response.status).toBe(400)
            expect(err.response.data.errors[0].detail).toBe("Missing required parameter 'data'.")
        }
    })
    test('Should NOT be able to POST Otters without required authentication', async () => {
        try {
            const res = await axios.post("otters", {
                "data": {
                    "type": "otters",
                    "attributes": {
                        "name": "Testing"
                    }
                }
            })
            throw Error('Request passed with ' + res.status)
        }
        catch(err) {
            expect(err.response.status).toBe(401)
        }
    })
    test('Should be able to PATCH Otters', async () => {
        const res = await axios.post(`otters?token=${process.env.TOKEN}`, {
            "data": {
                "type": "otters",
                "attributes": {
                    "name": "Testing Patches Otter"
                }
            }
        })
        expect(res.status).toBe(201)
        const otterToUpdate = res.data.data.id
        ottersToDelete.push(otterToUpdate)

        const update = await axios.patch(`otters/${otterToUpdate}?token=${process.env.TOKEN}`, {
            "data": {
                "id": otterToUpdate,
                "type": "otters",
                "attributes": {
                    "name": "New Name"
                }
            }
        })
        expect(update.status).toBe(200)
        const lastPage = (await axios.get('otters')).data.links.last
        const otters = await axios.get(lastPage)
        const updatedOtter = otters.data.data.find(otter => otter.id = otterToUpdate)
        expect(updatedOtter.attributes.name).toEqual("New Name")
    })
    test('Should be able DELETE Otters', async () => {
        const res = await axios.post(`otters?token=${process.env.TOKEN}`, {
            "data": {
                "type": "otters",
                "attributes": {
                    "name": "Testing Patches Otter"
                }
            }
        })
        expect(res.status).toBe(201)
        const otterToDelete = res.data.data.id
        const dlt = await axios.delete(`otters/${otterToDelete}?token=${process.env.TOKEN}`)
        expect(dlt.status).toBe(204)

    })
    test('GET request should respond within 200ms', async () => {
        const res = await axios.get("otters", {timeout: 200})
    })
    afterAll(async () => {
        for (const otter of ottersToDelete) {
            const res = await axios.delete(`otters/${otter}?token=${process.env.TOKEN}`)
        }
    })
})