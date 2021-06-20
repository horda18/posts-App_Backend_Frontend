const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const sequelize = require("./app/models/database");
const path = require("path");
const ejs = require("ejs");


const app = express();

var postRoutes = require("./app/controllers/post.controller");
var categoryRoutes = require("./app/controllers/category.model");

var corsOptions = {
    origin: "http://localhost:8081",
};

// Middlewares

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));

/*sequelize.sync({ force: true }).then(() => {
    console.log("Drop and re-sync db.");
});*/

app.set('views', path.join(__dirname, './app/views'));
app.set('view engine', 'ejs');


// Routes
app.use("/api/posts", postRoutes);
app.use("/api/categories", categoryRoutes);

// Static files
app.use(express.static(path.join(__dirname, "./app/public")))

// Test Route
app.get("/", (req, res) => {
    res.render('index');
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);

    // Connect database
    sequelize.authenticate().then(
        function (err) {
            console.log("Connection has been established successfully.");
        },
        function (err) {
            console.log("Unable to connect to the database:", err);
        }
    );
});

module.exports = app;
