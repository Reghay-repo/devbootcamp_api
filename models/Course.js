const mongoose = require('mongoose');
const {Schema} = mongoose;

const courseSchema = Schema({
    title: {
        type:String,
        required:[true,'Please add a course title'],
        trim:true
    },
    description:{
        type:String,
        required:[true,'Please add a course descripiton'],
    },
    weeks:{
        type:String,
        required:[true,'Please add number of weeks'],
    },
    tuition:{
        type:Number,
        required:[true,'Please add tuition cost'],
    },
    minimumSkill:{
        type:String,
        required:[true,'Please add a minimum skill'],
        enum:['beginner', 'intermediate', 'advanced'],
    },
    scholarhipsAvailable:{
        type:Boolean,
        default:false,
    },
    bootcamp:{
        type:mongoose.Schema.ObjectId,
        ref:'Bootcamp'

    },
   

}, {timestamps: true});


const Course = mongoose.model('Course', courseSchema);


module.exports = Course;