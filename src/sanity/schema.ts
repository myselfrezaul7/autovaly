import { type SchemaTypeDefinition } from 'sanity'

import { authorType } from './schemas/author'
import { articleType } from './schemas/article'
import { vehicleType } from './schemas/vehicle'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [authorType, articleType, vehicleType],
}
