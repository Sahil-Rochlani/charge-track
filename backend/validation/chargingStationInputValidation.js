const { z } = require('zod')


const stationNameValidation = z.string({required_error: 'Name is required.'})
  .trim()
  .min(2, 'Name must contain at least 2 characters.')
  .max(100, 'Name cannot exceed 100 characters.')
  .regex(/^[A-Za-z0-9\s\-_,.()]+$/, { message: 'Name can only contain letters, numbers, spaces, and basic punctuation.' })

const latitudeValidation = z.string({ required_error: 'Latitude is required.' })
  .nonempty('Latitude is required.')
  .refine((val) => !isNaN(Number(val)), { message: 'Latitude must be a valid number.' })
  .transform((val) => Number(val))
  .refine((val) => val >= -90, { message: 'Latitude must be greater than or equal to -90.' })
  .refine((val) => val <= 90, { message: 'Latitude must be less than or equal to 90.' })

const longitudeValidation = z.string({ required_error: 'Longitude is required.' })
  .nonempty('Longitude is required.')
  .refine((val) => !isNaN(Number(val)), { message: 'Longitude must be a valid number.' })
  .transform((val) => Number(val))
  .refine((val) => val >= -180, { message: 'Longitude must be greater than or equal to -180.' })
  .refine((val) => val <= 180, { message: 'Longitude must be less than or equal to 180.' })

const statusValidation = z.enum(['Active', 'Inactive'], {
  required_error: 'Status is required.',
  invalid_type_error: "Status must be either 'Active' or 'Inactive'."
})

const powerOutputValidation = z.string({ required_error: 'Power output is required.' })
  .nonempty('Power output is required.')
  .refine((val) => !isNaN(Number(val)), { message: 'Power output must be a valid number.' })
  .transform((val) => Number(val))
  .refine((val) => val > 0, { message: 'Power output must be a positive number.' })
  .refine((val) => val <= 1000, { message: 'Power output must not exceed 1000 kW.' })

const connectorTypesValidation = z.array(
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
  })

const chargingStationInputValidation = z.object({
  name: stationNameValidation,
  latitude: latitudeValidation,
  longitude: longitudeValidation,
  status: statusValidation,
  powerOutput: powerOutputValidation,
  connectorTypes: connectorTypesValidation
})

module.exports = chargingStationInputValidation
