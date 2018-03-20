async function listChildren(parentBhamashahId) {
    try {
        let response = await fetch(`/listChildren?parentBhamashahId=${parentBhamashahId}`)
        let responseJson = await response.json()
        return responseJson
    } catch (e) {
        console.error('listChildren > some error occured')
        console.error(e)
    }
}

async function getChildInfo(childId) {
    try {
        let response = await fetch(`/getChildInfo?childId=${childId}`)
        let responseJson = await response.json()
        return responseJson
    } catch (e) {
        console.error('getChildInfo > some error occured')
        console.error(e)
    }
}

async function markVaccination(vaccineId, givenBy) {
    try {
        let response = await fetch(`/markVaccine?vaccineId=${vaccineId}&givenBy=${givenBy}`)
        let responseJson = await response.json()
        return responseJson
    } catch (e) {
        console.error('markVaccination > some error occured')
        console.error(e)
    }
}

async function unmarkVaccination(vaccineId, givenBy) {
    try {
        let response = await fetch(`/unmarkVaccine?vaccineId=${vaccineId}&givenBy=${givenBy}`)
        let responseJson = await response.json()
        return responseJson
    } catch (e) {
        console.error('unmarkVaccination > some error occured')
        console.error(e)
    }
}