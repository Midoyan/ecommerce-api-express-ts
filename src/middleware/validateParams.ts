import type { ZodObject } from 'zod/v4';
import createValidator from './createValidator.ts';

const validateParams =
    (zodSchema: ZodObject) => createValidator('params', zodSchema);

export default validateParams;
