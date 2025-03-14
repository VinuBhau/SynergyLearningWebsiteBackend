
const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth.routes.js");
const connectToMongoDB = require("./db/connectToMongoDB");
const cors = require('cors');
const User = require("./models/user.models.js")
const Payment = require('./models/payment.models.js');
const Notes = require('./models/notes.models.js')
const Video = require('./models/Videos.models.js')

dotenv.config();

const app = express();

app.use(cors({
	origin: 'http://localhost:5173', // Allow requests from this frontend
	methods: 'GET,POST,PUT,DELETE',
	allowedHeaders: 'Content-Type,Authorization',
	credentials:true
  }));



// PORT should be assigned after calling dotenv.config() because we need to access the env variables. Didn't realize while recording the video. Sorry for the confusion.
const PORT = process.env.PORT || 5000;

app.use(express.json()); // to parse the incoming requests with JSON payloads (from req.body)
app.use(cookieParser());

app.use("/api/auth", authRoutes);

app.get("/api/getToken", async (req, res) => {
    try {
        const token = req.cookies.jwt;
        console.log("Token:", token);
        if (!token) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        res.status(200).json({token:token });
    } catch (error) {
        console.error("Error fetching token:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

app.post("/api/notes/getSelectedModules", async (req, res) => {
    try {
        const SubjectNumber = (req.body.SubjectNumber)
        const Sem = (req.body.Sem)

        
        if (!SubjectNumber || !Sem) {
            return res.status(400).json({ error: "SubjectNumber and Sem are required" });
        }

        console.log(`Fetching notes for SubjectNumber: ${typeof(SubjectNumber)}, Sem: ${typeof(Sem)}`);

        const result = await Notes.findOne({SubjectNumber:SubjectNumber,Sem:Sem });

        console.log(result)

        if (!result || result.length === 0) {
            return res.status(404).json({ message: "No notes found" });
        }

        console.log(" Notes fetched:", result);
        res.status(200).json(result);
    } catch (error) {
        console.error(" Error fetching Notes:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


app.get("/api/sessions", async (req, res) => {
    try {
        const videos = await Video.find({})

        if (videos.length === 0) {
            return res.status(404).json({ message: "No videos found" });
        }

        res.status(200).json(videos);
        console.log(`Fetched ${videos.length} videos`);

    } catch (error) {
        console.error("Error fetching sessions:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});




app.listen(PORT, () => {
	connectToMongoDB();
	console.log(`Server Running on port ${PORT}`);
});