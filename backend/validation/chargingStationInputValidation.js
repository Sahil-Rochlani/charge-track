const { z } = require('zod')

// Coordinate range constants
const LATITUDE_MIN = -90
const LATITUDE_MAX = 90
const LONGITUDE_MIN = -180
const LONGITUDE_MAX = 180

const stationNameValidation = z.string({
  required_error: 'Name is required.'
})
  .trim()
  .min(2, 'Name must contain at least 2 characters.')
  .max(100, 'Name cannot exceed 100 characters.')
  .regex(/^[A-Za-z0-9\s\-_,.()]+$/, { message: 'Name can only contain letters, numbers, spaces, and basic punctuation.' })

const latitudeValidation = z.coerce.number({
  required_error: 'Latitude is required.',
  invalid_type_error: 'Latitude must be a number.'
})
  .min(LATITUDE_MIN, `Latitude must be >= ${LATITUDE_MIN}.`)
  .max(LATITUDE_MAX, `Latitude must be <= ${LATITUDE_MAX}.`)

const longitudeValidation = z.coerce.number({
  required_error: 'Longitude is required.',
  invalid_type_error: 'Longitude must be a number.'
})
  .min(LONGITUDE_MIN, `Longitude must be >= ${LONGITUDE_MIN}.`)
  .max(LONGITUDE_MAX, `Longitude must be <= ${LONGITUDE_MAX}.`)

const statusValidation = z.enum(['Active', 'Inactive'], {
  required_error: 'Status is required.',
  invalid_type_error: "Status must be either 'Active' or 'Inactive'."
})

const powerOutputValidation = z.coerce.number({
  required_error: 'Power output is required.',
  invalid_type_error: 'Power output must be a number.'
})
  .positive('Power output must be a positive number.')
  .max(1000, 'Power output must not exceed 1000 kW.')

  const connectorTypesValidation = z.preprocess((val) => {
    if (typeof val === 'string') return [val]         // single string -> wrap in array
    if (Array.isArray(val)) return val               // array stays as-is
    return val                                       // fallback (will be rejected by z.array anyway)
  },
  z.array(
    z.enum([
      'Type 1 (SAE J1772)',
      'Type 2 (Mennekes)',
      'CCS Combo 1',
      'CCS Combo 2',
      'CHAdeMO',
      'Tesla Supercharger',
      'GB/T (AC)',
      'GB/T (DC)'
    ], {
      required_error: 'Connector type is required.',
      invalid_type_error: 'Connector type must be one of the allowed values.'
    })
  ).nonempty('At least one connector type is required.', {
    required_error: 'Connector types array is required.',
    invalid_type_error: 'Connector types must be an array.'
  }))

const chargingStationInputValidation = z.object({
  name: stationNameValidation,
  latitude: latitudeValidation,
  longitude: longitudeValidation,
  status: statusValidation,
  powerOutput: powerOutputValidation,
  connectorTypes: connectorTypesValidation
})

module.exports = chargingStationInputValidation
