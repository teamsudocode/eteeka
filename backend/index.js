const express = require('express')
const mongoose = require('mongoose')
const readFileSync = require('fs').readFileSync
const Schema = mongoose.Schema;


var config = {
    vaccineFile: './allVaccines.json'
}

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
    vaccines: [VaccineSchema]
})

const Child = mongoose.model('child', ChildSchema)


function getDefaultVaccinesList() {
    // https://assets.babycenter.com/ims/pdf/in/vaccinations-IN-rev415.pdf
    let vaccines = JSON.parse(readFileSync(config.vaccineFile).toString())
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

var app = express()


// health
app.get('/health', (req, res) => {
    res.json({
        message: 'I am up and running!'
    })
})


// hospital
app.get('/registerChild', (req, res) => {
    let child = new Child({
        parentBhamashahId: 'bhamashah-001',
        fullName: 'Himanshu',
        dateOfBirth: (new Date(Date.now())).toJSON(),
        vaccines: getDefaultVaccinesList()
    })
    // child.save().then(res.json)
    res.json(child)
})


// family
app.get('/listChildren', async (req, res) => {
    try {
        let child = await Child.find()
        res.json(child)
    } catch (e) {
        res.json({
            message: "Some error occured"
        }).statusCode(500)
    }
})


// run the app
mongoose.connect('mongodb://localhost/eteeka')
app.listen(3000)

// console.log(getDefaultVaccinesList())