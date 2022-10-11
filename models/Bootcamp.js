const mongoose = require('mongoose');
const {Schema} = mongoose;

const BootcampSchema = Schema({
    name:{
        type:String,
        required:[true,'please add a name'],
        unique:true,
        trim:true,
        maxlength: [50,'Name cannot be more than 50 characters'],
    },
    slug:String,
    description:{
        type:String,
        required:[true,'please add a description'],
        maxlength:[500, 'Description cannot be more than 500 characters'],
    },
    website: {
        type: String,
        match: [
          /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
          'Please use a valid URL with HTTP or HTTPS'
        ]
      },
    phone:{
        type:String,
        maxlength:[20,'Phone number cannot be more than 20 characters']
    },
    email: {
        type: String,
        match: [
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
          'Please add a valid email'
        ]
      },
    adress: {
        type:String,
        require:[true,'Please add an adrees'],
    },
    location:{
        // GeoJSON point
        type:{
            type:String,
            enum:['Point'],
        },
        coordinates:{
            type:[Number],
            index: '2dsphere'
        },
    },
    formattedAdress:String,
    streed:String,
    city:String,
    state:String,
    zipcode:String,
    country:String,
    careers:{
        type:[String],
        required:true,
        enum:[
            'Web Development',
            'Mobile Development',
            'UI/UX',
            'Data Science',
            'Business',
            'Other',
        ]
    },
    averageRating:{
        type:Number,
        min:[1,'Rating cannot be less than 1'],
        max:[10,'Rating cannot be more than 10'],
    },
    averageCost:Number,
    photo:{
        type:String,
        default:'no-photo.jpg',
    },
    housing:{
        type:Boolean,
        default:false
    },
    jobAssistance:{
        type:Boolean,
        default:false
    },
    jobGuarantee:{
        type:String,
        default:false
    },
    acceptGi:{
        type:String,
        default:false
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
});


const Bootcamp = mongoose.model('Bootcamp', BootcampSchema);

module.exports = Bootcamp;