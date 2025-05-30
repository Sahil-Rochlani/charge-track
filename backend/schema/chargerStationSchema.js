const mongoose = require('mongoose')

const Schema = mongoose.Schema

const chargingStationSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    }
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active',
    required: true
  },
  powerOutput: {
    type: Number, // in kilowatts
    required: true
  },
  connectorTypes: {
    type: [String],
    enum: [
      'Type 1 (SAE J1772)',
      'Type 2 (Mennekes)',
      'CCS Combo 1',
      'CCS Combo 2',
      'CHAdeMO',
      'Tesla Supercharger',
      'GB/T (AC)',
      'GB/T (DC)'
    ],
    required: true
  }
}, {
  timestamps: true
});

const chargingStationModel = mongoose.model('ChargingStation', chargingStationSchema)

module.exports = chargingStationModel
