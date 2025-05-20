const http = require("http")
const express =  require('express')
const routing = require('./routing/routes');
const cors = require('cors')

const app = express()
const server = http.createServer(app)
const port = 3002

// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({extended: true}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())
// app.use(cors({
//         origin: '*',
//         methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
//         allowedHeaders: ['Content-Type', 'Authorization']
//     })
// )
app.use(routing)


server.listen(port,()=>{
    console.log('application started at port 3002 🎉');
})