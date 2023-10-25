import express from 'express'
import {authRoute} from '~/routes/v1/authRoute'
import {userRoute} from '~/routes/v1/userRoute'

const Router = express.Router()

// API user
Router.use('/user', userRoute)

// API auth
Router.use('/login', authRoute)

export const APIs_V1 = Router