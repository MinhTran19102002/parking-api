import  express  from 'express'

const app = express()

const hostname = 'localhost'
const port = '3000'

app.listen(port, ()=>{
    console.log('hello')
    console.log('Listen port ${port}');
})