const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
        validate(value){
            if(validator.isEmpty(value)){
                throw new Error('Name cannot be empty')
            }
        }
    },
    email:{
        type:String,
        required: true,
        unique:true,
        lowercase: true,
        validate( value ) {
            if( !validator.isEmail( value )) {
                 throw new Error( 'Email is invalid' )
                  }
        }
    },
    password:{
        type: String,
        required: true,
        minLength: 7,
        trim: true,
        validate(value) {
        if( value.toLowerCase().includes('password')) {
            throw new Error("password cannot contain password")
        }
    }
    },
    tokens: [{
        token: {
        type: String,
        required: true
          }
        }]
    },
      {timestamps: true}
)


userSchema.methods.generateAuthToken = async function(){
    const user = this
    const token = jwt.sign({_id: user._id.toString()}, process.env.TOKEN_SECRET, {
        expiresIn: '1d'
    })
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

userSchema.pre('save', async function(next) {
    const user = this
       if (user.isModified('password')) {
       user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

userSchema.statics.findByCredentials = async function(email,password){
    const user = await User.findOne({ email })
    if(!user){
        throw new Error('Unable to log in')
    }
    const isMatch = bcrypt.compare(password, user.password)
    if(!isMatch){
        throw new Error('Password or username is incorrect')
    }
    return user
}


const User = mongoose.model('User', userSchema)
module.exports = User