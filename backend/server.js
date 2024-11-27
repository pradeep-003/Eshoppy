const app = require("./app");
const connectDatabase = require("./db/Database");
const cloudinary = require("cloudinary");
const path = require("path");



// Handling uncaught Exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`shutting down the server for handling uncaught exception`);
});

// config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: "config/.env",
  });
}

// connect db
connectDatabase();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})


const __dirname1 = path.resolve();
if(process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname1, "/frontend/build")));
  app.get('*', (req, res)=> {
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"));
  });
}else {
  app.get("/", (req, res) => {
    res.send("API running successfully");
  });
}


// create server
const server = app.listen(process.env.PORT, () => {
  console.log(
    `Server is running on http://localhost:${process.env.PORT}`
  );
});

// unhandled promise rejection
process.on("unhandledRejection", (err) => {
  console.log(`Shutting down the server for ${err.message}`);
  console.log(`shutting down the server for unhandle promise rejection`);

  server.close(() => {
    process.exit(1);
  });
});
