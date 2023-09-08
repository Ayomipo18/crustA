import express, { Application } from 'express';
import cors from 'cors';
import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import sequelize from './config/db'
import route from './routes/index';
import ErrorHandler from './middlewares/error.middleware'
import logger from './logger';
import { config } from './config/config';

const app: Application = express();

const PORT = process.env.PORT

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "A simple authentication system",
      version: "1.0.0",
    },
    license: {
      name: "ISC",
    },
    contact: {
      name: "Ayomipo Solaja",
      email: "ayomiposolaja@email.com",
    },
    schemes: ["http", "https"],
    servers: [
      { 
        url: `${config.apiUrl}/{version}`,
        variables: {
          version: {
            default: config.apiVersion
          }
        }
      }
    ],
  },
  apis: ['swagger.yaml'],
};

const swaggerSpecs = swaggerJsDoc(options);

app.use(cors())

app.use(express.json());

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs, { explorer: true }));

app.use(`/${config.apiVersion}`, route)

app.use(ErrorHandler)

app.get('/', (req, res) => {
  return res.json('Welcome to CrustA API');
})

app.listen(PORT, async(): Promise<void> => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    logger.info('Database connected successfully.');
    logger.info(`Connected successfully on port ${config.port}`);
  } catch(error: any) {
    logger.error(`Error occurred: ${error}`);
  }
});

