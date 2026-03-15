import type { RequestHandler } from 'express';
import type { ZodObject } from 'zod/v4';
import { z } from 'zod/v4';

type RequestSegment = 'body' | 'params' | 'query';

const createValidator =
    (segment: RequestSegment, zodSchema: ZodObject): RequestHandler =>
        (req, res, next) => {
            const value = req[segment];

            if (segment === 'body' && value == null) {
                return next(new Error('Request body is missing.', { cause: { status: 400 } }));
            }

            const { data, error, success } = zodSchema.safeParse(value);
            if (!success) {
                return next(
                    new Error(z.prettifyError(error), {
                        cause: {
                            status: 400
                        }
                    })
                );
            }

            if (segment === 'query') {
                // Express exposes req.query via a getter, so mutate it in place.
                const query = req.query as Record<string, unknown>;
                for (const key of Object.keys(query)) {
                    delete query[key];
                }
                Object.assign(query, data as Record<string, unknown>);
                return next();
            }

            req[segment] = data;
            return next();
        };

export default createValidator;