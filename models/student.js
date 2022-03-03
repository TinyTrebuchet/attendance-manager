const mongoose = require('mongoose')

const studentSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
        lowercase: true,
    },

    password: {
        type: String,
        required: true,
    },

    branch: {
        type: String,
        default: "4th Sem CS",
    },

    current: [{
        courseId: String,
        daysAttended: Number,
        timeSlot: [{
            dayNumber: Number,
            startTime: String,
            endTime: String,
        }],
    }],
})

module.exports = mongoose.model("Student", studentSchema)