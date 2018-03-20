const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const readFileSync = require('fs').readFileSync
const path = require('path')
const Schema = mongoose.Schema;


var config = {
    vaccineFile: readFileSync(__dirname + '/allVaccines.json').toString(),
    databaseURL: process.env.DATABASEURL || 'mongodb://localhost/eteeka',
    port: process.env.PORT || 3000
}

var app = express()
app.use(cors())
app.use(express.static('dashboard'))

// models

const VaccineSchema = new Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    scheduledAt: { type: Date, required: true },
    givenAt: { type: Date, required: false, default: null },
    givenBy: { type: String, required: false, default: null }
})

const ChildSchema = new Schema({
    parentBhamashahId: {
        type: String,
        required: true,
        trim: true
    },
    fullName: { type: String, required: true, trim: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, required: true, enum: ['male', 'female'] },
    vaccines: [VaccineSchema]
})

const Child = mongoose.model('child', ChildSchema)


function getDefaultVaccinesList() {
    // https://assets.babycenter.com/ims/pdf/in/vaccinations-IN-rev415.pdf
    let vaccines = JSON.parse(config.vaccineFile)
    let returnValue = []
    for (let each of vaccines) {
        let d = new Date()
        let scheduledAt = d.setDate(d.getDate() + 4 * each.schedule)
        scheduledAt = d.toJSON()
        returnValue.push({
            name: each.name,
            description: each.description,
            scheduledAt: scheduledAt,
            givenAt: null,
            givenBy: null
        })
    }
    return returnValue
}

function fixNameFormat(fullName) {
    return fullName.toLowerCase()
                   .split(' ')
                   .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                   .map(word => word.trim())
                   .join(' ')
}


app.get('/dashboard', (req, res) => {
    let completePath = __dirname + '/../dashboard/index.html'
    res.sendFile(path.resolve(completePath))
})


// health
app.get('/health', (req, res) => {
    res.json({
        message: 'I am up and running!'
    })
})


// hospital
app.get('/registerChild', (req, res) => {
    let missingParams = [req.query.parentBhamashahId, req.query.fullName, req.query.dateOfBirth].filter(
                            each => each === undefined
                        )
    console.log(req.query, missingParams)
    if (missingParams.length > 0) {
        res.json({
            message: 'Missing fields in request'
        })

        return
    }

    let child = new Child({
        parentBhamashahId: req.query.parentBhamashahId,
        fullName: fixNameFormat(req.query.fullName),
        dateOfBirth: new Date(req.query.dateOfBirth),
        vaccines: getDefaultVaccinesList()
    })
    child.save().then((child) => {
        res.json(child)
    }).catch((err) => {
        res.json({
            message: 'registerChild: Some error occured while mongo query'
        })
        console.log('error while registering child in mongo', err)
    })
})


// family
app.get('/listChildren', (req, res) => {
    let parentBhamashahId = req.query.parentBhamashahId
    if (parentBhamashahId === undefined) {
        res.json({
            message: 'Missing parentBhamashahId in request'
        })
        return
    }

    Child.find(
        { parentBhamashahId: parentBhamashahId },
        { vaccines: false })
    .then((child) => {
        res.json(child)
    })
    .catch((err) => {
        res.json({
            message: 'Some error occured'
        })
    })
})


app.get('/getChildInfo', (req, res) => {
    let childId = req.query.childId
    if (childId === undefined) {
        res.json({
            message: 'Missing childId in request'
        })
        return
    }

    Child.findOne({
        _id: mongoose.Types.ObjectId(childId.trim())
    })
    .then((child) => child.toJSON())
    // take care of toJSON()
    .then((child) => {
        let completed = []
        let due = []
        let future = []
        let thisMonth = (new Date()).getMonth()
        for (let each of child.vaccines) {
            if (each.givenAt == null) {
                if (each.scheduledAt.getMonth() == thisMonth) {
                    due.push(each)
                } else {
                    future.push(each)
                }
            } else {
                completed.push(each)
            }
        }
        child.vaccines = undefined
        child['status'] = {
            completed: completed,
            due: due,
            future: future
        }
        res.json(child)
    })
    .catch((err) => {
        res.json({
            message: 'Some error occured'
        })
    })
})

app.get('/markVaccine', (req, res) => {
    let vaccineId = req.query.vaccineId
    let givenBy = req.query.givenBy
    if (vaccineId === undefined || givenBy === undefined) {
        res.json({
            message: 'Missing vaccineId/givenBy in request'
        })
        return
    }

    Child.updateOne(
        { "vaccines._id": mongoose.Types.ObjectId(vaccineId) },
        { 
            $set: {
                "vaccines.$.givenAt": (new Date()),
                "vaccines.$.givenBy": givenBy
            } 
        }
    )
    .then((child) => {
        res.json(child)
    })
    .catch((err) => {
        res.json({
            message: 'Some error occured'
        })
    })
})

app.get('/unmarkVaccine', (req, res) => {
    let vaccineId = req.query.vaccineId
    let givenBy = req.query.givenBy
    if (vaccineId === undefined || givenBy === undefined) {
        res.json({
            message: 'Missing vaccineId/givenBy in request'
        })
        return
    }

    Child.updateOne(
        { "vaccines._id": mongoose.Types.ObjectId(vaccineId) },
        { 
            $set: {
                "vaccines.$.givenAt": null,
                "vaccines.$.givenBy": null
            } 
        }
    )
    .then((result) => {
        if (result.ok) {
            res.json(child)
        } else {
            res.json({message: 'Some error occured'})
        }
    })
    .catch((err) => {
        res.json({
            message: 'Some error occured'
        })
    })
})

// run the app

console.log('current config', config.databaseURL, config.port)
mongoose.connect(config.databaseURL)
app.listen(config.port)

// console.log(getDefaultVaccinesList())