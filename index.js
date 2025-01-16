const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");

main().then(() => {
    console.log("Connected to DB");
}).catch((err) => {
    console.log(err);
});



const initDB = async () => {
    try {
        await Listing.deleteMany({});
        if (Array.isArray(initdata.data)) {
            initdata.data = initdata.data.map((obj) => ({
                ...obj,
                owner: '67738e60e28660f46ef81372',
                geometry: {
                    type: obj.geometry?.type || 'Point', // Default to 'Point' if missing
                    coordinates: obj.geometry?.coordinates || [0, 0], // Default coordinates
                },
            }));
            await Listing.insertMany(initdata.data);
            console.log("Data was initialized");
        } else {
            throw new Error("Invalid data format: initdata.data must be an array.");
        }
    } catch (error) {
        console.error("Error in initDB:", error);
    }
};

initDB();
