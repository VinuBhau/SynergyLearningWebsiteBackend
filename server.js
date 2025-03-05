
const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth.routes.js");
const connectToMongoDB = require("./db/connectToMongoDB");
const cors = require('cors');
const User = require("./models/user.models.js")
const Payment = require('./models/payment.models.js');
const Notes = require('./models/notes.models.js')

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

app.get("/api/Notes/GetAllModules", async (req, res) => {

    try {
        var result = await Notes.find({}); // ✅ Use `await` to get actual data
        console.log("✅ Notes fetched:", result);
        
        res.status(200).json(result); // ✅ Send JSON response properly
    } catch (error) {
        console.error("❌ Error fetching Notes:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});




app.listen(PORT, () => {
	connectToMongoDB();
	console.log(`Server Running on port ${PORT}`);
});