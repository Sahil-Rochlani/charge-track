const { z } = require('zod')

const nameValidation = z.string({required_error: 'Name is required.'})
                            .trim()
                            .min(2, 'Name must contain at least 2 characters.')
                            .max(50, 'Name cannot exceed 50 characters.')
                            .regex(/^[A-Za-z\s]+$/, {message: 'Name can only contain letters and spaces.'})

const emailValidation = z.string({required_error: 'Email is required.'})
                                .trim()
                                .min(1, 'Email cannot be blank.')
                                .email('Please enter a valid email address.')
                                .max(320, 'Email is too long.')

const passwordValidation = z.string()
                            .trim()
                            .min(8, 'Password must be at least 8 characters.')
                            .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letters.'} )
                            .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letters.'} )
                            .regex(/[0-9]/, { message: 'Password must contain at least one number.'} )
                            .regex(/[!@#$%^&*(),.?":{}|<>]/, { message: 'Password must contain at least one special character (!, @, #, $, %, ^, &, *, (, ), ., ?, ", :, {, }, |, <, >).' })

const signupPasswordValidation = z.string({required_error: 'Password is required.'})
                                  .trim()
                                  .min(1, 'Password cannot be empty.')
                                  .superRefine((value, ctx) => {
                                    const password_validation = passwordValidation.safeParse(value)
                                    if(!passwordValidation.success){
                                        ctx.addIssue({
                                            code: 'custom',
                                            message:'Password does not meet the required criteria.'
                                        })
                                    }
                                  })

const signinPasswordValidation = z.string({required_error:'Password is required.'})
                                    .trim()
                                    .min(1, 'Password cannot be empty')                                  

const signUpInputValidation = z.object({
    name: nameValidation,
    email: emailValidation,
    password: signupPasswordValidation
})

const signInInputValidation = z.object({
    email:emailValidation,
    password:signinPasswordValidation
})

module.exports = {
    signUpInputValidation,
    signInInputValidation
}

