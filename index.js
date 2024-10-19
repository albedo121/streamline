//IMPORT ALL RELEVANT PACKAGES-------------------------------------------
import express from "express"
import cors from "cors"
import multer from "multer"
import {v4 as uuidv4} from "uuid"
import path from  "path"
import fs from "fs"
import {exec} from "child_process"
import { stderr, stdout } from "process"

//DEFINE REQUIRED VARIABLES AND MIDDLEWARES------------------------------
const port = 3000
const app = express()

//Configure CORS to allow requests from mentioned urls and enable credentials
app.use(cors({
    origin: ["http://localhost:3000", ,"http://localhost:5173"],   //Add live url in this array before pushing to prod
    credentials: true
}))

//Manage CORS Headers
app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin","*")  // Allow req from any origin. Dont use '*' in production.
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept") //Specifies which headers can be included in requests to the server
    next()
})

app.use(express.json())//For handling JSON payloads in POST/PUT requests.
app.use(express.urlencoded({extended: true})) //To parse incoming requests from url encoded payload
app.use("/uploads", express.static("uploads")) //serve static files from the "uploads" directory
app.use("/output",express.static("output")) //To access the processed files

//WRITE ALL MIDDLEWARES AND CONFIGURATIONS BELOW--------------------------
//Multer Middleware-
const storage = multer.diskStorage({
    destination: function(req,file,cb){     //Mention that upload videos will be present in uploads folder
        cb(null,"./uploads")
    },
    filename: function(req,file,cb){       //Uses the file's field name, appends a UUID and add the original file extension.
        cb(null,file.fieldname + "-" + uuidv4() + path.extname(file.originalname))
    }
})

//Multer Configuration-
const upload = multer({storage: storage})


//DEFINE ROUTES------------------------------
//Home route
app.get('/', (req,res)=>{
    res.json({
        message: "Welcome to Streamline"
    })
})

//Upload Route
app.post('/upload', upload.single('file'), (req,res)=>{

    const trailerId = uuidv4() //Assign a id to trailer video
    const videoPath = req.file.path //Get file path from req body
    const outputPath = `./output/trailers/${trailerId}` //Set the output path
    const hlsPath = `${outputPath}/index.m3u8` //set the hls path for m3u8 file. This file consists the index of each segment.
    console.log('PROCESSING VIDEO FILE. PLEASE WAIT, THIS PROCESS WILL TAKE A WHILE...')
    // console.log('HLS Path: ', hlsPath)  //Use for debugging

    //Create directory
    if(!fs.existsSync(outputPath)){
        fs.mkdirSync(outputPath, {recursive: true})
    }

    //Craft the ffmpeg command
    const ffmpegCommand = `ffmpeg -i ${videoPath} -codec:v libx264 -codec:a aac -hls_time 10 -hls_playlist_type vod -hls_segment_filename "${outputPath}/segment%03d.ts" -start_number 0 ${hlsPath}`

    //Run the ffmpeg command from child process.
    //Please note that in pro grade this 'exec' command is executed in another system as execution takes time.
    //But since this is just a PoC application we are running the 'exec' command on same system.
    exec(ffmpegCommand, (error, stdout, stderr) => {
        if(error){
            console.log('Exec error: ',error)
        }
        // console.log('stdout: ', stdout)   //Use for debugging
        // console.log('stderr: ', stderr)   //Use for debugging

        const videoUrl = `http://localhost:3000/output/trailers/${trailerId}/index.m3u8` //craft the video url

        //Return response
        res.status(200).json({
            message: 'Video converted to HLS format.',
            videoUrl: videoUrl,
            trailerId: trailerId
        })

        console.log('PROCESSING COMPLETED. PLEASE CHECK JSON RESPONSE.')

    })

})


//SERVER START--------------------------------
app.listen(port, console.log(`SERVER STARTED AT PORT ${port} ...`))
