/* eslint-disable no-console */

import express from 'express'
import exitHook from 'async-exit-hook'
import {connectDB , GET_DB, CLOSE_DB} from '~/config/mongodb'
import {env} from '~/config/environment'
import {APIs_V1} from '~/routes/v1/index'


const START_SEVER = () => {
  const app = express()

  //Enable req.body json data
  app.use(express.json())

  //Use API V1
  app.get('/', async (req, res) => {
    console.log(await GET_DB().listCollections().toArray())
    res.end('<h1>Hello World!</h1><hr>')
  })

  app.use('/v1', APIs_V1)

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
