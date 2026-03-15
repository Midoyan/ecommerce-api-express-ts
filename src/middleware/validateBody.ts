import type { ZodObject } from 'zod/v4';
import createValidator from './createValidator.ts';

const validateBody =
    (zodSchema: ZodObject) => createValidator('body', zodSchema);

export default validateBody;