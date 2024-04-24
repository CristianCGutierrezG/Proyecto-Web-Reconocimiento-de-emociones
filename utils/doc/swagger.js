import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";
import path from 'path';
import { config } from "../../config/config.js";


/**
 * Realiza la conexion y puesta en marcha de la UI de Swagger
 * para la documentacion de los diferente endpoints
 */

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: 'Emociones API', 
            version: '1.0.0'
        },
        security: [
            {
                bearerAuth: []
            }
        ]
    },
    apis: [ path.resolve('routes', '*.router.js')],
    securityDefinitions: {
        bearerAuth: {
            type: 'apiKey',
            name: 'Authorization',
            in: 'header'
        }
    }
};

const swaggerSpec = swaggerJSDoc(options);

const swaggerDocs = (app, port) => {
    app.use("/api/v1/docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));
    app.get("/api/v1/docs.json", (req, res) =>{
        res.setHeader("Content-Type", "application/json");
        res.send(swaggerSpec);
    });

    console.log(
        `Version 1 de la documentacion esta abilitada en http://localhost:${config.port}/api/v1/docs`
    );
};


export {swaggerDocs}