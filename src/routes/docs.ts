import { Router } from 'express';
import swaggerJSDoc, { type Options } from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import packageJson from '../../package.json' with { type: 'json' };

const docsRoutes = Router();

const options: Options = {
    definition: {
        openapi: '3.1.0',
        info: {
            title: 'Ecommerce API',
            version: packageJson.version
        }
    },
    apis: ['./src/controllers/*.ts', './src/schemas/*.ts']
};
const swaggerSpec = swaggerJSDoc(options);

docsRoutes.get('/openapi.json', (req, res) => {
    res.json(swaggerSpec);
});
docsRoutes.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default docsRoutes;