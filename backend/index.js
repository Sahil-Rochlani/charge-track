const express = require('express')
const app = express()
const authRouter = require('./routes/auth')
const stationRouter = require('./routes/stations')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const connectDB = require('./database/connection')
const PORT = process.env.PORT || 5000;


app.use(cookieParser())
app.use(cors({
    origin: true,  // allow all origins dynamically
    credentials: true
  }));
app.use(express.urlencoded({extended:true}))
app.use(express.json()) 

app.use('/api/auth', authRouter)
app.use('/api/stations', stationRouter)


const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  }


startServer()