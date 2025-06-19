import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import router from './app/routes';
import notFound from './app/middlewares/notFound';
import config from './config';



const app: Application = express();

// app.use(cors({
//   origin: [
//     'http://localhost:3000',
//     'https://task-pilot-client-eight.vercel.app'
//   ],
//   credentials: true
// }));



app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
       'https://task-pilot-client-eight.vercel.app',
      'https://taskclient-nine.vercel.app',
    ], 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }),
);


app.use(cookieParser());

// parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple health check route
app.get('/', (req: Request, res: Response) => {
    res.send({
        Message: "taskPilot-server server is running .."
    });
});

// API routes
app.use('/api/v1', router);

// global error handling
app.use(globalErrorHandler);

// Not Found
app.use(notFound);

export default app;
