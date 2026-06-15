import { defineField, defineType } from 'sanity'

export const vehicleType = defineType({
  name: 'vehicle',
  title: 'Vehicle',
  type: 'document',
  fields: [
    defineField({
      name: 'make',
      title: 'Make',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'model',
      title: 'Model',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'number',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: (doc: any) => `${doc.make}-${doc.model}-${doc.year}`, maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'trim',
      title: 'Trim',
      type: 'string',
    }),
    defineField({
      name: 'priceEur',
      title: 'Price (EUR)',
      type: 'number',
    }),
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: ['EV', 'PHEV', 'Hybrid', 'ICE'],
      },
    }),
    defineField({
      name: 'segment',
      title: 'Segment',
      type: 'string',
      options: {
        list: ['Sedan', 'SUV', 'Crossover', 'Sports', 'Hatchback', 'Truck', 'Wagon'],
      },
    }),
    defineField({
      name: 'specs',
      title: 'Specs',
      type: 'object',
      fields: [
        { name: 'powerHp', type: 'number', title: 'Power (HP)' },
        { name: 'torqueNm', type: 'number', title: 'Torque (Nm)' },
        { name: 'zeroToHundred', type: 'number', title: '0-100 km/h (s)' },
        { name: 'topSpeedKmh', type: 'number', title: 'Top Speed (km/h)' },
        { name: 'drivetrain', type: 'string', title: 'Drivetrain' },
        { name: 'weightKg', type: 'number', title: 'Weight (kg)' },
      ]
    }),
    defineField({
      name: 'evSpecs',
      title: 'EV Specs',
      type: 'object',
      fields: [
        { name: 'batteryCapacityKwh', type: 'number', title: 'Battery Capacity (kWh)' },
        { name: 'rangeKm', type: 'number', title: 'Range (km)' },
        { name: 'chargingSpeedKw', type: 'number', title: 'Charging Speed (kW)' },
        { name: 'architectureV', type: 'number', title: 'Architecture (V)' },
      ]
    }),
    defineField({
      name: 'rating',
      title: 'Rating (out of 10)',
      type: 'number',
    }),
    defineField({
      name: 'review',
      title: 'Review Summary',
      type: 'text',
    }),
  ],
})
