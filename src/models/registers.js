const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")

const employeeSchema = new mongoose.Schema({
    firstname : {
        type: String,
        required: false
    },


    lastname : {
        type: String,
        required: false
    },

    email : {
        type: String,
        required: true 
    },
    password : {
        type: String,
        required: true
    },
         
    admin : {
        type: Boolean
    },

    tokens:[{
        token:{
            type: String,
            required: true
        }
    }],

    createdAt : {
        type: Date, 
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    },


    templatesDownloaded: {
        type: Number
    },
    
    basic:{
        type: Date
    },

    premium: {
        type: Date
    },

    templates: {
        type: Number,
        default: 0
    },

    feedback : {
        type: String
    },


    
    customercontactus: [{
        contactus: {
            name: {
                type: String
            },
            phone: {
                type: String
            },
            message: {
                type: String
            }
        }
    }]


})

// generating token
employeeSchema.methods.generateAuthToken = async function(){
    try {
        const token = jwt.sign({_id:this._id.toString()}, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token:token})
        await this.save();
        return token;
    } catch (error) {
        res.send(error)
        console.log(error)
    }
}


// converting password to hash
employeeSchema.pre("save", async function(next) {
    

    if(this.isModified("password")){
        
        this.password = await bcrypt.hash(this.password, 10);
        
    }

    next();

}) 



// collection

const Register = new mongoose.model("Register", employeeSchema);

module.exports = Register;
