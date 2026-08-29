require("dotenv").config();
const mongoose = require("mongoose");

const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = process.env.ATLASDB_URL;

async function main() {
    await mongoose.connect(MONGO_URL);
    console.log("connected to Atlas DB");
}

const initDB = async () => {
    await Listing.deleteMany({});

    initData.data = initData.data.map((obj) => ({
        ...obj,
        owner: "6a4581d7e114d8182294e9b9"
    }));

    await Listing.insertMany(initData.data);

    console.log("data was initialized");
};

async function start() {
    try {
        await main();
        await initDB();
        await mongoose.connection.close();
        console.log("Database connection closed");
    } catch (err) {
        console.log(err);
    }
}

start();

// const mongoose = require("mongoose");
// const initData = require("./data.js");
// const Listing = require("../models/listing.js");

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// main()
//   .then(() => {
//     console.log("connected to DB");
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// async function main() {
//   await mongoose.connect(MONGO_URL);
// }

// const initDB = async () => {
//   await Listing.deleteMany({});
//     initData.data=initData.data.map((obj)=>({
//     ...obj,owner:"6a4581d7e114d8182294e9b9"
//   }));
//   await Listing.insertMany(initData.data);
//   console.log("data was initialized");
// };

// initDB();
