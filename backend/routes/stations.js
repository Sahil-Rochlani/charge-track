const { Router } = require('express')
const stationRouter = Router()
const chargingStationInputValidation = require('../validation/chargingStationInputValidation')
const formatZodError = require('../utils/formatZodError')
stationRouter.get('/', (req, res) => {

})

stationRouter.post('/', (req, res) => {
    const stationDetailValidation = chargingStationInputValidation.safeParse(req.body)
    res.json({error:formatZodError(stationDetailValidation.error)})
})

stationRouter.put('/:id', (req, res) => {

})

stationRouter.delete('/:id', (req, res) => {

})


module.exports = stationRouter