//@ts-check
//@ts-ignore
const axios = require('axios').create({
    baseURL: process.env.BASEURL,
    headers: {'Content-Type': 'application/vnd.api+json'}
})

describe('Test Habitats Endpoint: ', () => {
    //running list of habitats to delete at the end of the test
    let habitatsToDelete = []
    test('Should be able GET habitats', async () => {
        const res = await axios.get("habitats")
        expect(res.status).toBe(200)
        expect(res.data.data).toBeDefined()
        expect(Object.keys(res.data.data[0])).toEqual(["id", "type", "attributes", "relationships", "links"])
    })
    test('Habitats should have correct schema', async () => {
        const res = await axios.get("habitats")
        for(const habitat of res.data.data) {
            expect(Object.keys(habitat)).toEqual(["id", "type", "attributes", "relationships", "links"])
            expect(habitat.type).toEqual("habitats")
            expect(Object.keys(habitat.attributes)).toEqual(["name", "address", "city", "state", "zip", "htype"])
            expect(Object.keys(habitat.relationships)).toEqual(["otters"])
            expect(Object.keys(habitat.links)).toEqual(["self"])
            expect(habitat.links.self).toEqual(`${process.env.BASEURL}habitats/${habitat.id}`)
        }

    })
    describe('Habitat attributes should match the correct format', () => {
        test('names should match the correct pattern', async () => {
            const res = await axios.get("habitats")
            for(const habitat of res.data.data) {
                expect(habitat.attributes.name).toMatch(/^[A-Za-z0-9 _.,!&"'/$-]{2,}$/)
            }
        })
        test('addresses should match the correct pattern', async () => {
            const res = await axios.get("habitats")
            for(const habitat of res.data.data) {
                expect(habitat.attributes.address).toMatch(/^[A-Za-z0-9 .#&',$]{2,}$/)
            }
        })
        test('cities should match the correct pattern', async () => {
            const res = await axios.get("habitats")
            for(const habitat of res.data.data) {
                expect(habitat.attributes.city).toMatch(/^[A-Za-z0-9 .,$]{2,}$/)
            }
        })
        test('states should match the correct pattern', async () => {
            const res = await axios.get("habitats")
            for(const habitat of res.data.data) {
                expect(habitat.attributes.state).toMatch(/^[A-Za-z0-9 .$]{2,}$/)
            }
        })
        test('zip should match the correct pattern', async () => {
            const res = await axios.get("habitats")
            for(const habitat of res.data.data) {
                expect(habitat.attributes.zip).toMatch(/^[0-9]{5}(-[0-9]{4})?$/)
            }
        })
        test('htype should match the correct pattern', async () => {
            const res = await axios.get("habitats")
            for(const habitat of res.data.data) {
                expect(habitat.attributes.htype).toMatch(/^zoo|sanctuary|colony$/)
            }
        })
    })
    test('Paging should be working', async () => {
        expect(true).toBe(true)
        let res = await axios.get("habitats?page[size]=3&page[number]=1")
        expect(res.data.data.length).toBe(3)
        expect(res.data.links.self).toEqual(`${process.env.BASEURL}habitats?page%5Bsize%5D=3`)
        expect(res.data.links.next).toEqual(`${process.env.BASEURL}habitats?page%5Bsize%5D=3&page%5Bnumber%5D=2`)
        res = await axios.get("habitats?page[size]=4&page[number]=2")
        expect(res.data.data.length).toBe(4)
        expect(res.data.links.self).toEqual(`${process.env.BASEURL}habitats?page%5Bsize%5D=4&page%5Bnumber%5D=2`)
        expect(res.data.links.next).toEqual(`${process.env.BASEURL}habitats?page%5Bsize%5D=4&page%5Bnumber%5D=3`)

    })
    test('Should be able to POST Habitats with valid body', async () => {
        const res = await axios.post(`habitats?token=${process.env.TOKEN}`, {
            "data": {
                "type": "habitats",
                "attributes": {
                    "name": "Testing"
                }
            }
        })
        expect(res.status).toBe(201)
        habitatsToDelete.push(res.data.data.id)
        expect(Object.keys(res.data.data)).toEqual(["id", "type", "attributes", "relationships"])
    })
    test('Should NOT be able to POST Habitats without required paramaeters', async () => {
        try {
            const res = await axios.post("habitats", {})
            throw Error('Request passed with ' + res.status)
        }
        catch(err) {
            expect(err.response.status).toBe(400)
            expect(err.response.data.errors[0].detail).toBe("Missing required parameter 'data'.")
        }
    })
    test('Should NOT be able to POST Habitats without required authentication', async () => {
        try {
            const res = await axios.post("habitats", {
                "data": {
                    "type": "habitats",
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
    test('Should be able to PATCH Habitats', async () => {
        const res = await axios.post(`habitats?token=${process.env.TOKEN}`, {
            "data": {
                "type": "habitats",
                "attributes": {
                    "name": "Testing Patches Habitat"
                }
            }
        })
        expect(res.status).toBe(201)
        const habitatToUpdate = res.data.data.id
        habitatsToDelete.push(habitatToUpdate)

        const update = await axios.patch(`habitats/${habitatToUpdate}?token=${process.env.TOKEN}`, {
            "data": {
                "id": habitatToUpdate,
                "type": "habitats",
                "attributes": {
                    "name": "New Name"
                }
            }
        })
        expect(update.status).toBe(200)
        expect(update.data.data.attributes.name).toEqual("New Name")
    })
    test('Should be able DELETE Habitats', async () => {
        const res = await axios.post(`habitats?token=${process.env.TOKEN}`, {
            "data": {
                "type": "habitats",
                "attributes": {
                    "name": "Testing Patches Habitat"
                }
            }
        })
        expect(res.status).toBe(201)
        const habitatToDelete = res.data.data.id
        const dlt = await axios.delete(`habitats/${habitatToDelete}?token=${process.env.TOKEN}`)
        expect(dlt.status).toBe(204)

    })
    test('GET request should respond within 200ms', async () => {
        const res = await axios.get("habitats", {timeout: 200})
    })
    afterAll(async () => {
        for (const habitat of habitatsToDelete) {
            const res = await axios.delete(`habitats/${habitat}?token=${process.env.TOKEN}`)
        }
    })
})