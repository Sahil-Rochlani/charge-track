const { Router } = require('express')
const stationRouter = Router()
const chargingStationInputValidation = require('../validation/chargingStationInputValidation')
const formatZodError = require('../utils/formatZodError')
const userMiddleware = require('../middleware/user')
const chargingStationModel = require('../schema/chargerStationSchema')
const mongoose = require('mongoose')

stationRouter.get('/', userMiddleware, async (req, res) => {
    try{
        const {
            status,
            minPower,
            maxPower,
            connectorTypes
          } = req.query
      
          const filters = {}
      
          // Status filter
          if (status) {
            filters.status = status
          }
      
          // Power output filter
          if (minPower || maxPower) {
            filters.powerOutput = {}
            if (minPower) filters.powerOutput.$gte = Number(minPower)
            if (maxPower) filters.powerOutput.$lte = Number(maxPower)
          }
      
          // Connector types filter
          if (connectorTypes) {
            const connectors = connectorTypes.split(',')
            filters.connectorTypes = { $in: connectors }
          }

          const chargingStations = await chargingStationModel.find(filters)

          res.json({chargingStations})
    }
    catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Internal server error' })
    }
})

stationRouter.get('/user', userMiddleware, async (req, res) => {
    try{
        const chargingStations = await chargingStationModel.find({addedBy: req.user._id})
        res.json({chargingStations})
    }
    catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Internal server error' })
    }
})

stationRouter.post('/', userMiddleware, async (req, res) => {
    try{
        const stationDetailValidation = chargingStationInputValidation.safeParse(req.body)
        if(!stationDetailValidation.success){
            res.status(400).json({error:formatZodError(stationDetailValidation.error)})
            return
        }
        const {name, latitude, longitude, status, powerOutput, connectorTypes} = stationDetailValidation.data

        const chargingStation = await chargingStationModel.create({
            name,
            latitude,
            longitude,
            status,
            powerOutput,
            connectorTypes,
            addedBy: new mongoose.Types.ObjectId(req.user._id)
        })
        res.json({chargingStation})
    }
    catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Internal server error' })
    }
})

stationRouter.put('/:id', userMiddleware, async (req, res) => {
    try{
        const id = req.params.id
        const stationDetailValidation = chargingStationInputValidation.safeParse(req.body)
        if(!stationDetailValidation.success){
            res.status(400).json({error:formatZodError(stationDetailValidation.error)})
            return
        }
        const {name, latitude, longitude, status, powerOutput, connectorTypes} = stationDetailValidation.data        

        const updatedChargingStation = await chargingStationModel.findOneAndUpdate({_id:id, addedBy:req.user._id}, {
            name,
            latitude,
            longitude,
            status,
            powerOutput,
            connectorTypes
        }, {new: true})

        if(updatedChargingStation === null){
            res.status(403).json({error: 'You are not authorized to perform this action'})
            return
        }

        res.json({updatedChargingStation})
    }
    catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Internal server error' })
    }
})

stationRouter.delete('/:id', userMiddleware, async (req, res) => {
    try{
        const id = req.params.id
        const deletedStation = await chargingStationModel.findOneAndDelete({_id:id, addedBy:req.user._id})

        if(!deletedStation){
            res.status(404).json({error: 'Station with the given Id not found.'})
            return
        }
        res.json({deletedStation})
    }
    catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Internal server error' })
    }

})


module.exports = stationRouter