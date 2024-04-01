const express = require("express");
const app = express();
app.use(express.json());

app.use(express.static('public'));

const cors = require('cors')
app.use(cors({origin:"http://localhost:5173",credentials:true}));
app.use(express.urlencoded({ extended: true }));

const bodyParser = require("body-parser");
app.use(bodyParser.json());

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const userRoutes = require ("./routes/userRoutes");
app.use(userRoutes);

const postRoutes = require ("./routes/postRoutes");
app.use(postRoutes);

const categoryRoutes = require ("./routes/categoryRoutes");
app.use(categoryRoutes);

const bookmarkRoutes = require ("./routes/bookmarkRoutes");
app.use(bookmarkRoutes);

app.listen(3000, () => {
  console.log("Server Running...");
});
