import path from 'path';
import express from 'express';
import cors from 'cors';
import env from './config/env.js';
import routes from './routes/index.js';
import { notFound, errorHandler } from './middlewares/error.middleware.js';

const app = express();

app.use(
  cors({
    origin: env.clientUrl.split(',').map((url) => url.trim()),
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.resolve('uploads')));
app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

export default app;
