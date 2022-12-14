const mongoose = require('mongoose');
const {Schema} = mongoose;
const slugify = require('slugify');
const geoCoder = require('../utils/geocoder');

const BootcampSchema = Schema({
    name:{
        type:String,
        required:[true,'Please add a name'],
        unique:true,
        trim:true,
        maxlength: [50,'Name cannot be more than 50 characters'],
    },
    slug:String,
    description:{
        type:String,
        required:[true,'Please add a description'],
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
    address: {
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
        formattedAddress:String,
        street:String,
        city:String,
        state:String,
        zipcode:String,
        country:String,
    },
    
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
      user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:true
    },
    
    
},{
    timestamps: true,
    toObject: { virtuals:true},
    toJSON: {virtuals : true}
});



// create bootcamp slug from the name 
BootcampSchema.pre('save', function(next) {
    this.slug = slugify(this.name, {
        lower:true
    })
    next();
})

// geocoder and create location 
BootcampSchema.pre('save', async function(next) {
    const loc = await geoCoder.geocode(this.address);
    this.location = {
      type: 'Point',
      coordinates: [loc[0].longitude, loc[0].latitude],
      street: loc[0].streetName,
      city: loc[0].city,
      state: loc[0].stateCode,
      zipcode: loc[0].zipcode,
      formattedAddress: loc[0].formattedAddress,
      country: loc[0].countryCode
    };
  
    // Do not save address in DB
    this.address = undefined;
    next();
  });

 
// cascade delete courses when a bootcmap is deleted
BootcampSchema.pre('remove', async function(next) {
    await this.model('Course').deleteMany({bootcamp: this._id});
    console.log(`deleting bootcamp with id ${this._id} and its courses`);
})

//   reverse populate with virtuals
  BootcampSchema.virtual('courses', {
    ref:'Course',
    localField:'_id',
    foreignField: 'bootcamp',
    justOne: false
  })

const Bootcamp = mongoose.model('Bootcamp', BootcampSchema);

module.exports = Bootcamp;