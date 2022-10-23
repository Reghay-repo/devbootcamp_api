const mongoose = require('mongoose');
const { Schema } = mongoose;




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

// create user model
const User = mongoose.model(
    'User',
    userSchema
);

// export user model

module.exports = User;