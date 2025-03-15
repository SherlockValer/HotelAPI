// Import connectDB
const {connectDB} = require('./db/db.connect')
connectDB()

// Import model
const Hotel = require('./models/hotel.models')

// Import express js
const express = require('express')
const app = express()
app.use(express.json())

// Import cors
const cors = require('cors')
const corsOptions = {
    origin: "*",
    credentials: true,
    optionSuccesStatus: 200,
}

app.use(cors(corsOptions))


//* (1) API to create a new hotel
async function createNewHotel(newHotel) {
    try {
        const hotel = new Hotel(newHotel)
        const saveHotel = await hotel.save()
        return saveHotel
    } catch (error) {
        console.log(error)
    }
}

app.post("/hotels", async(req, res) => {
    try {
        const savedHotel = await createNewHotel(req.body)
        res.status(201).json({message: "Hotel added successfully", hotel: savedHotel})
    } catch (error) {
        res.status(500).json({error: "Failed to add data"})
    }
})

//* (1) API to read all hotels
async function readAllHotels() {
    try {
        const hotels = await Hotel.find()
        return hotels
    } catch (error) {
        console.log(error)
    }
}

app.get("/hotels", async(req, res) => {
    try {
        const hotels = await readAllHotels()
        if(hotels.length !=0) {
            res.json(hotels)
        } else {
            res.status(404).json({error: "Hotels not found."})
        }
    } catch (error) {
        res.status(500).json({error: "Failed to fetch data"})
    }
})

//* (2) API to read a hotel by name
async function readHotelByName(hotelName) {
    try {
        const hotel = await Hotel.findOne({name: hotelName})
        return hotel
    } catch (error) {
        console.log(error)
    }
}

app.get("/hotels/:hotelName", async (req, res) => {
    try {
        const hotel = await readHotelByName(req.params.hotelName)
        if(hotel) {
            res.json(hotel)
        } else {
            res.status(404).json({error: "Hotel not found."})
        }
    } catch(error) {
        res.status(500).json({error: "Failed to fetch data"})
    }
})

//* (3) API to read a hotel by phone number
async function readHotelByPhoneNumber(hotelPhoneNumber) {
    try {
        const hotel = await Hotel.findOne({phoneNumber: hotelPhoneNumber})
        return hotel
    } catch (error) {
        console.log(error)
    }
}

app.get("/hotels/directory/:phoneNumber", async(req, res) => {
    try {
        const hotel = await readHotelByPhoneNumber(req.params.phoneNumber)
        if(hotel) {
            res.json(hotel)
        } else{
            res.status(404).json({error: "Hotel not found."})
        }
    } catch(error) {
        res.status(500).json({error: "Failed to fetch data"})
    }
})

//* (4) API to read hotels by rating
async function readAllHotelsByRating(hotelRating) {
    try {
        const hotels = await Hotel.find({rating: hotelRating})
        return hotels
    } catch (error) {
        console.log(error)
    }
}

app.get("/hotels/rating/:hotelRating", async(req, res) => {
    try {
        const hotels = await readAllHotelsByRating(req.params.hotelRating)
        if(hotels.length !=0) {
            res.json(hotels)
        } else {
            res.status(404).json({error: "Hotels not found."})
        }
    } catch (error) {
        res.status(500).json({error: "Failed to fetch data."})
    }
})

//* (5) API to read hotels by category
async function readHotelsByCategory(hotelCategory) {
    try {
        const hotels = await Hotel.find({category: hotelCategory})
        return hotels
    } catch(error) {
        console.log(error)
    }
}

app.get("/hotels/category/:hotelCategory", async(req, res) => {
    try {
        const hotels = await readHotelsByCategory(req.params.hotelCategory)
        if(hotels.length != 0) {
            res.json(hotels)
        } else {
            res.status(404).json({error: "Hotels not found."})
        }
    } catch (error) {
        res.status(500).json({error: "Failed to fetch data."})
    }
})

//* (1) API to delete hotel from database by id
async function deleteHotelById(hotelId) {
    try {
        const deleteHotel = await Hotel.findByIdAndDelete(hotelId)
        return deleteHotel
    } catch (error) {
        console.log(error)
    }
}

app.delete("/hotels/:hotelId", async(req, res) => {
    try {
        const deleted = await deleteHotelById(req.params.hotelId)
        res.status(200).json({message: "Hotel deleted successfully", hotel: deleted})
    } catch (error) {
        res.status(500).json({error: "Failed to delete hotels"})
    }
})


//* (1) API to update a hotel
async function updateHotelDetails(hotelId, dataToUpdate) {
    try {
        const updateHotel = await Hotel.findByIdAndUpdate(hotelId, dataToUpdate, {new: true})
        return updateHotel
    } catch(error) {
        console.log(error)
    }
}

app.post("/hotels/:hotelId", async(req, res) => {
    try {
        const updated = await updateHotelDetails(req.params.hotelId, req.body)
        if(updated) {
            res.status(200).json({message: "Hotel data updated successfully", updated: updated})
        } else {
            res.status(404).json({error: "Hotel not found."})
        }
    } catch (error) {
        res.status(500).json({error: "Failed to update hotel"})
    }
})


// Start the server
const PORT = 3000
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})