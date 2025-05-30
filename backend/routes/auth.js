const { Router } = require('express')
const authRouter = Router()
require('dotenv').config()
const { signUpInputValidation, signInInputValidation } = require('../validation/authInputValidation')
const UserModel = require('../schema/userSchema')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET
const formatZodError = require('../utils/formatZodError')

authRouter.post('/signup', async (req, res) => {
    try{
        const signupValidation = signUpInputValidation.safeParse(req.body)
        if(!signupValidation.success){
            res.status(400).json({error: formatZodError(signupValidation.error)})
            return
        }
        const name = req.body.name.trim()
        const email = req.body.email.trim().toLowerCase()
        const password = req.body.password

        const existingUser = await UserModel.findOne({email})

        if(existingUser){
            res.status(400).json({error:{
                email:'The user with the given email address already exists. Please use different email address or sign in.'
            }})
            return
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await UserModel.create({
            name: name, 
            email: email,
            password:hashedPassword
        })

        const token = jwt.sign({id: user._id, name: user.name, email: user.email}, JWT_SECRET,{ expiresIn: '7d' })

        res.cookie('token', token, {httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000})

        res.json({name})
    }
    catch(err){
        console.log(err)
    }
})

authRouter.post('/signin', async (req, res) => {
    try{
        const signin_validation = signInInputValidation.safeParse(req.body)
        if(!signin_validation.success){
            res.status(400).json({error: formatZodError(signin_validation.error)})
            return
        }
        const email = req.body.email.trim().toLowerCase()
        const password = req.body.password
        const existingUser = await UserModel.findOne({email})
        if(!existingUser){
            res.status(400).json({error:{
                email: 'The user with the given email address does not exist. Please use a different email address or sign up'
            }})
            return
        }
        const isCorrectPassword = await bcrypt.compare(password, existingUser.password)
        if(!isCorrectPassword){
            res.status(400).json({error: {
                password: 'The entered password is incorrect.'
            }})
            return
        }

        const token = jwt.sign({_id:existingUser._id, name: existingUser.name, email: existingUser.email}, JWT_SECRET, { expiresIn: '7d' })

        res.cookie('token', token, {httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000})

        res.json({name: existingUser.name})
    }
    catch(err){
        console.log(err)
    }
})

authRouter.post('/logout', (req, res) => {
    res.clearCookie('token', {httpOnly: true})
    res.json({success: 'Logged out successfully'})
})


module.exports = authRouter