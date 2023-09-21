const User = require('../models/User')

const register = async(req,res) => {
    const user = new User(req.body)
    try{
        await user.save()
        const token = await user.generateAuthToken()
        console.log(token)
        res.status(201).send({user, token})
    }catch(err){
        res.status(400).send(err)
    }
}


const login = async(req,res) =>{
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    }catch(err){
        res.status(400).send(err + '')
    }
}

const logout = async(req,res) => {
    try {
        req.user.tokens =  req.user.tokens.filter((token) => {
          return token.token !== req.token
        })
        await req.user.save()
        res.send('success')
    } catch (error) {
        res.status(500).send(error)
    }
}


const logOutAll = async(req,res) => {
    try{
        req.user.tokens = []
        await req.user.save()
        res.send('Successful')
    }catch(err){
        res.status(500).send(err)
    }
}

module.exports = {register, login, logout, logOutAll}