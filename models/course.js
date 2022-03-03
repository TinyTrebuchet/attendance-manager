const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
    },

    name: {
        type: String,
        required: true,
    },

    instructor: String,

    credit: {
        type: Number,
        required: true,
    },

    offered: [{
        branch: String,
        offerType: String,
    }],
})

module.exports = mongoose.model("Course", courseSchema)