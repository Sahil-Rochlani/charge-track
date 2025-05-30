const express = require('express')
const app = express()
const authRouter = require('./routes/auth')
const stationRouter = require('./routes/stations')
const cors = require('cors')
const cookieParser = require('cookie-parser')

app.use(cookieParser())
app.use(cors({
    origin: true,  // allow all origins dynamically
    credentials: true
  }));
app.use(express.urlencoded({extended:true}))
app.use(express.json()) 

app.use('/api/auth', authRouter)
app.use('/api/stations', stationRouter)

app.listen(3000)