import type { ZodObject } from 'zod/v4';
import createValidator from './createValidator.ts';

const validateQuery =
    (zodSchema: ZodObject) => createValidator('query', zodSchema);

export default validateQuery;
