const backendUrl = 'https://eteeka.herokuapp.com'

async function listChildren(parentBhamashahId) {
    try {
        let response = await fetch(`${backendUrl}/listChildren?parentBhamashahId=${parentBhamashahId}`)
        let responseJson = await response.json()
        return responseJson
    } catch (e) {
        console.error('listChildren > some error occured')
        console.error(e)
    }
}

function getVaccinationInfo(childId) {
    try {
        let response = await fetch(`${backendUrl}/getChildInfo?childId=${childId}`)
        let responseJson = await response.json()
    } catch (e) {
        console.error('getVaccinationInfo > some error occured')
        console.error(e)
    }
}