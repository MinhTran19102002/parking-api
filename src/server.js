/* eslint-disable no-console */

import express from 'express';
import cors from 'cors';
import exitHook from 'async-exit-hook';
import { connectDB, GET_DB, CLOSE_DB } from '~/config/mongodb';
import { env } from '~/config/environment';
import { APIs_V1 } from '~/routes/v1/index';
import { errorHandlingMiddleware } from '~/middlewares/errorHandlingMiddleware';
import { createServer } from 'http';
import { Server } from 'socket.io';

// const io = new Server(3000, {
//   cors: {
//     origin: ['http://localhost:3001'],
//   },
// });
// io.on('connection', (socket) => {
//   console.log('A user connected');
// });

const app = express();
//
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:5173'],
  },
});

io.on('connection', (socket) => {
  console.log('connect !');
});

httpServer.listen(3000);

const START_SEVER = () => {
  app.use(express.json());

  app.use(cors());

  //Use API V1
  app.use('/', APIs_V1);

  //Middleware xu ly loi tap trung
  app.use(errorHandlingMiddleware);

  app.listen(env.APP_PORT, env.APP_HOST, () => {
    // eslint-disable-next-line no-console
    console.log(`Hello Minh, I am running at ${env.APP_HOST}:${env.APP_PORT}/`);
  });
  exitHook(() => {
    console.log('Disconnecting');
    CLOSE_DB();
    console.log('Disconnected');
  });
};

connectDB()
  .then(() => console.log('Connect to database'))
  .then(() => START_SEVER())
  .catch((error) => {
    console.error(error);
    process.exit();
  });

export const server = {
  io,
};
