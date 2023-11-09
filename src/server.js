/* eslint-disable no-console */

import express from 'express'
import cors from 'cors'
import exitHook from 'async-exit-hook'
import {connectDB , GET_DB, CLOSE_DB} from '~/config/mongodb'
import {env} from '~/config/environment'
import {APIs_V1} from '~/routes/v1/index'
import {errorHandlingMiddleware} from '~/middlewares/errorHandlingMiddleware'


const START_SEVER = () => {
  const app = express()

  //Enable req.body json data
  app.use(express.json())

  app.use(cors())

  //Use API V1
  app.use('/', APIs_V1)

  //Middleware xu ly loi tap trung
  app.use(errorHandlingMiddleware)

  app.listen(env.APP_PORT, env.APP_HOST, () => {
    // eslint-disable-next-line no-console
    console.log(`Hello Minh, I am running at ${ env.APP_HOST }:${ env.APP_PORT }/`)
  })
  exitHook(() => {
    console.log('Disconnecting')
    CLOSE_DB()
    console.log('Disconnected')
  })
}

connectDB()
  .then(() => console.log('Connect to database'))
  .then(() => START_SEVER())
  .catch(error => {
    console.error(error)
    process.exit()
  })
