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
      name: 'coverGradient',
      title: 'Cover Gradient',
      type: 'object',
      fields: [
        { name: 'from', type: 'string', title: 'From' },
        { name: 'to', type: 'string', title: 'To' },
      ],
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
      name: 'priceUsd',
      title: 'Price (USD)',
      type: 'number',
    }),
    defineField({
      name: 'fuelType',
      title: 'Fuel Type',
      type: 'string',
      options: {
        list: ['BEV', 'PHEV', 'Hybrid', 'Gasoline', 'Diesel'],
      },
    }),
    defineField({
      name: 'bodyStyle',
      title: 'Body Style',
      type: 'string',
    }),
    defineField({
      name: 'segments',
      title: 'Segments',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: ["Sedans", "SUVs", "Trucks", "Sports Cars", "EVs", "Hybrids", "Luxury", "Budget Picks"],
      },
    }),
    defineField({
      name: 'specs',
      title: 'Specs',
      type: 'object',
      fields: [
        { name: 'powerHp', type: 'number', title: 'Power (HP)' },
        { name: 'torqueNm', type: 'number', title: 'Torque (Nm)' },
        { name: 'acceleration060', type: 'number', title: '0-100 km/h or 0-60 mph (s)' },
        { name: 'topSpeedKmh', type: 'number', title: 'Top Speed (km/h)' },
        { name: 'weightKg', type: 'number', title: 'Weight (kg)' },
        { name: 'lengthMm', type: 'number', title: 'Length (mm)' },
        { name: 'widthMm', type: 'number', title: 'Width (mm)' },
        { name: 'heightMm', type: 'number', title: 'Height (mm)' },
        { name: 'wheelbaseMm', type: 'number', title: 'Wheelbase (mm)' },
        { name: 'cargoLiters', type: 'number', title: 'Cargo Volume (Liters)' },
        { name: 'seatingCapacity', type: 'number', title: 'Seating Capacity' },
        { name: 'drivetrain', type: 'string', title: 'Drivetrain', options: { list: ['FWD', 'RWD', 'AWD'] } },
      ]
    }),
    defineField({
      name: 'evSpecs',
      title: 'EV Specs',
      type: 'object',
      fields: [
        { name: 'batteryKwh', type: 'number', title: 'Battery Capacity (kWh)' },
        { name: 'rangeKm', type: 'number', title: 'Range (km)' },
        { name: 'rangeMiles', type: 'number', title: 'Range (miles)' },
        { name: 'chargingSpeedKw', type: 'number', title: 'Charging Speed (kW)' },
        { name: 'chargingTime1080', type: 'string', title: 'Charging Time 10-80%' },
        { name: 'efficiency', type: 'string', title: 'Efficiency' },
      ]
    }),
    defineField({
      name: 'highlights',
      title: 'Highlights',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'prosAndCons',
      title: 'Pros and Cons',
      type: 'object',
      fields: [
        { name: 'pros', title: 'Pros', type: 'array', of: [{ type: 'string' }] },
        { name: 'cons', title: 'Cons', type: 'array', of: [{ type: 'string' }] },
      ],
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
    }),
    defineField({
      name: 'new2025',
      title: 'New in 2025',
      type: 'boolean',
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
