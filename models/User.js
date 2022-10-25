// statics are called on the model and methods are called on the instance itself
const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcryptjs = require('bcryptjs');
const jwt       = require('jsonwebtoken');




const userSchema = Schema({
    name: {
        type:String,
        required:[true,'Please add a name']
    },
    email:{
        type:String,
        required:[true, 'Please add an email'],
        unique:true,
        match:[
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
          ]
    },
    role:{
        type:String,
        enum:[
            'user',
            'publisher'
        ],
        default:'user'
    },
    password:{
        type:String,
        require:[true,'Please add a password'],
        minlength:8,
        select:false
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date,

},
{timestamps:true}

); 



// encrypt password using bcrypt
userSchema.pre('save', async function(next) {
    // create the salt
    const salt  = await bcryptjs.genSalt(10);
    // hash the password
    this.password = await bcryptjs.hash(this.password, salt);
});


// sign JWT and return  
userSchema.methods.getSignedJwtToken = function() {
    return jwt.sign({ id: this._id, }, process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE
    });
}


// check is entered password matches hashed password in database
userSchema.methods.matchPassword = async  function(enteredpassword) {
    return await bcryptjs.compare(enteredpassword, this.password);
}

// create user model
const User = mongoose.model(
    'User',
    userSchema
);

// export user model

module.exports = User;