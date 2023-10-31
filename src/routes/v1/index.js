import express from 'express'
import {authRoute} from '~/routes/v1/authRoute'
import {userRoute} from '~/routes/v1/personRoute'
import {parkingRoute} from '~/routes/v1/parkingRoute'

const Router = express.Router()

// API user
Router.use('/user', userRoute)

// API auth
Router.use('/auth', authRoute)

// API parking
Router.use('/parking', parkingRoute)

export const APIs_V1 = Router