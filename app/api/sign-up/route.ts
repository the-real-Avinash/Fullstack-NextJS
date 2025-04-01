import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";


export async function POST(request: Request) {
    await dbConnect();

    try{
        const { username, email, password } = await request.json();

        const existingUserVerifiedByUsername = await UserModel.findOne({ username, isVerified: true });

        if(existingUserVerifiedByUsername){
            return Response.json({
                success: false,
                message: "Username already exists",
            }, {status: 409,})

        }

        const existingUserByEmail = await UserModel.findOne({ email, isVerified: true }); 
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        if(existingUserByEmail){
            if(existingUserByEmail.isVerified){
                return Response.json({
                    success: false,
                    message: "Email already exists",
                }, {status: 409,})
            }else{
                const hashedPassword = await bcrypt.hash(password,10)
                const expiryDate = new Date()
                expiryDate.setHours(expiryDate.getHours()+1)

                existingUserByEmail.password = hashedPassword
                existingUserByEmail.verifyCode = verifyCode
                existingUserByEmail.verifyCodeExpiry = expiryDate
                await existingUserByEmail.save()
            }
        }else{
            const hashedPassword = await bcrypt.hash(password,10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours()+1)

           const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessages: true,
                messages: [],
            })
            await newUser.save()

        }
        const emailResponse = await sendVerificationEmail(email, username, verifyCode);
        if(emailResponse.success){
            return new Response(JSON.stringify({
                success: true,
                message: "User registered successfully. Verification email sent.",
            }), {
                status: 201,
                headers: {
                    "Content-Type": "application/json",
                },
            });
        }else{  
            return new Response(JSON.stringify({
                success: false,
                message: "User registered but failed to send verification email.",
            }), {
                status: 500,
                headers: {
                    "Content-Type": "application/json",
                },
            });
        }



        

        

      
        
        
    }catch(error){
        console.error("Error in sign up:", error);
        return new Response(JSON.stringify({
            success: false,
            message: "Error registering User",
        }), {
            status: 500,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }

}