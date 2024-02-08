const express = require('express')
const Data=require('./models/User.js')
const jsonwebtoken=require('jsonwebtoken')
var passwordValidator = require('password-validator');
require('./dbconnect')
const PORT=9000
const app=express()
app.use(express.json())
const JSONSALTKEY="mynameisshariquezafariamasoftwaredeveloper"
// Create a schema
var schema = new passwordValidator();

// Add properties to it
schema
.is().min(8)                                    // Minimum length 8
.is().max(100)                                  // Maximum length 100
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits(2)                                // Must have at least 2 digits
.has().not().spaces()                           // Should not have spaces
.is().not().oneOf(['Passw0rd', 'Password123','12345678']);



//Middleware



async function updpass(req,res,next){
    try{
       var data=await Data.findOne({email:req.body.email})
       if(data){
          if(data.password===req.params.curpas){
            if(data.password===req.body.password){
               res.send({result:"Fail",message:"New Password Cannot Be Same As Curent Password"})
            }
            else{
                next()
            }
          }
          else{
            res.send({result:"Fail",message:"Current Password Is Incorrect"})
          }
       }
       else{
        res.send({result:"Fail",message:"Email ID Does Not Exist In Our DataBase"})
       }
    }
    catch(e){
        res.send({result:"Fail",message:"Internal Server Error"})
    }
}





async function del(req,res,next){
    try{
       var data=await Data.findOne({_id:req.params._id})
       if(data){
        if(data.password===req.params.value)
        next()
        else
        res.send({result:"Fail",message:"You've Entered The Wrong Password"})
       }
       else{
        res.send({result:"Fail",message:"Invalid ID"})
       }
    }
    catch(e){
        res.send({result:"Fail",message:"Internal Server Error"})
    }
}



async function upd(req,res,next){
    try{
       var data=await Data.findOne({_id:req.params._id})
       if(data){
        if(data.password===req.params.value)
        next()
        else
        res.send({result:"Fail",message:"You've Entered The Wrong Password"})
       }
       else{
        res.send({result:"Fail",message:"Invalid ID"})
       }
    }
    catch(e){
        res.send({result:"Fail",message:"Internal Server Error"})
    }
}



async function verifytoken(req,res,next){
    try{
    const token=req.headers['authorization']
    const isVerified=jsonwebtoken.verify(token,JSONSALTKEY)
    if(!isVerified) throw new Error('Access Denied')
    else next()
    }
    catch(e){
        res.send({result:"Fail",message:"Internal Server Error"+e.message})
    }
}

//Api

app.post('/user',async(req,res)=>{
    try{
       if(schema.validate(req.body.password)){
       const data=new Data(req.body)
       await data.save()
       res.send({result:"Done",message:"Details Is Saved To DataBase"})
       }
       else{
         res.send({result:"Fail",message:"Password length must be 8 and has one uppercase one lowercase and should not contain any spaces"})  
       }
    }
    catch(e){
       if(e.keyValue){
           res.send({result:"Fail",message:"Email Is Already Taken, Please Choose Another Email ID"}) 
       }
       else if(e.errors.username){
           res.send({result:"Fail",message:e.errors.username.message}) 
       }
       else if(e.errors.name){
           res.send({result:"Fail",message:e.errors.name.message}) 
       }
       else if(e.errors.email){
           res.send({result:"Fail",message:e.errors.email.message}) 
       }
       else if(e.errors.password){
           res.send({result:"Fail",message:e.errors.password.message}) 
       }
       else if(e.errors.phone){
           res.send({result:"Fail",message:e.errors.phone.message}) 
       }
       else{
           res.send({result:"Fail",message:"Internal Server Error"})
       }
    }
})



app.get("/user",verifytoken,async(req,res)=>{
    try{
       const data=await Data.find()
       res.send({result:"Done",data:data,message:req.query.name+" "+req.query.lname})
    }
    catch(e){
        res.send({result:"Fail",message:"Internal Server Error"})
    }
})


app.get("/user/:_id",async(req,res)=>{
    try{
       const data=await Data.findOne({_id:req.params._id})
       if(data){
       res.send({result:"Done",data:data})
       }
       else{
        res.send({result:"Fail",message:"Invalid ID"})
       }
    }
    catch(e){
        res.send({result:"Fail",message:"Internal Server Error"})
    }
})



app.put("/user/:_id/:value",upd,async(req,res)=>{
    try{
       const data=await Data.findOne({_id:req.params._id})
       if(data){
        data.name=req.body.name
        data.username=req.body.username
        data.email=req.body.email
        data.phone=req.body.phone
        data.city=req.body.city
        data.state=req.body.state
        data.date=new Date()
        await data.save()
       res.send({result:"Done",data:data,message:"Updated Successfully"})
       }
       else{
        res.send({result:"Fail",message:"Invalid ID"})
       }
    }
    catch(e){
        res.send({result:"Fail",message:"Internal Server Error"})
    }
})



app.delete('/user/:_id/:value',del,async(req,res)=>{
    try{
      var data=await Data.findOne({_id:req.params._id})
      if(data){
        await data.deleteOne()
        res.send({result:"Done",message:"Details Is Deleted Successfully"})
      }
      else
      res.send({result:"Fail",message:"Invalid ID"})
    }
    catch(e){
        res.send({result:"Fail",message:"Internal Server Error"})
    }
})




app.post("/user/search",async(req,res)=>{
    try{
       var data=await Data.find({$or:[
        {username:{$regex:`.*${req.body.search}.*`,$options:"i"}},
        {name:{$regex:`.*${req.body.search}.*`,$options:"i"}},
        {email:{$regex:`.*${req.body.search}.*`,$options:"i"}},
        {phone:{$regex:`.*${req.body.search}.*`,$options:"i"}},
        {city:{$regex:`.*${req.body.search}.*`,$options:"i"}},
        {state:{$regex:`.*${req.body.search}.*`,$options:"i"}},
       ]})
       res.send({result:"Done",data:data})
    }
    catch(e){
        res.send({result:"Fail",message:"Internal Server Error"})
    }
})



app.post("/user/login",async(req,res)=>{
       try{
         var data=await Data.findOne({email:req.body.email})
         if(data){
            if(data.password===req.body.password){
              jsonwebtoken.sign({data},JSONSALTKEY,{expiresIn:"1d"},async(e,tokens)=>{
                  if(e){
                    res.send({result:"Fail",message:"Internal Server Error"})
                  }
                  else{
                    if(data.token.length<3){
                        data.token.push(tokens)
                        await data.save()
                        res.send({result:"Done",data:data,token:tokens})
                    }
                    else{
                        res.send({result:"Fail",message:"You're Already Logged In With 3 Devices, Logout From Any One To Login Here."})
                    }
                  }
              })
            }
            else{
                res.send({result:"Fail",message:"Password Is Incorrect"})   
            }
         }
         else{
            res.send({result:"Fail",message:"Email ID Does Not Exist In Our DataBase"})
         }
       }
       catch(e){
        res.send({result:"Fail",message:"Internal Server Error"})
    }
})



app.post("/user/logout",async(req,res)=>{
    try{
      var data=await Data.findOne({email:req.body.email})
      if(data){
        var index=data.token.findIndex((item)=>item===req.body.token)
        if(index!==-1){
            data.token.splice(index,1)
            await data.save()
            res.send({result:"Done",message:"Logged Out."})
        }
        else{
            res.send({result:"Fail",message:"Internal Server Error"})
        }
      }
      else{
        res.send({result:"Fail",message:"Internal Server Errror"})
      }
    }
    catch(e){
        res.send({result:"Fail",message:"Internal Server Error"})
    }
})



app.post("/user/logoutall",async(req,res)=>{
    try{
      var data=await Data.findOne({email:req.body.email})
      if(data){
        var index=data.token.findIndex((item)=>item===req.body.token)
        if(index!==-1){
            data.token=[]
            await data.save()
            res.send({result:"Done",message:"Logged Out From Everywhere."})
        }
        else{
            res.send({result:"Fail",message:"Internal Server Error"})
        }
      }
      else{
        res.send({result:"Fail",message:"Internal Server Errror"})
      }
    }
    catch(e){
        res.send({result:"Fail",message:"Internal Server Error"})
    }
})



app.post("/user/forgetemail",async(req,res)=>{
      try{
        var data=await Data.findOne({email:req.body.email})
        if(data){
           var otp=parseInt(Math.random()*1000000)
           otp=otp.toString()
           if(otp.length<6){
             var extra=parseInt(Math.random()*10)
             otp=otp+extra
             data.otp=Number(otp)
             await data.save()
             res.send({result:"Done",data:data,message:'Otp Sent To Your Email Id'})
           }
           else{
            data.otp=Number(otp)
            await data.save()
            res.send({result:"Done",data:data,message:'Otp Sent To Your Email Id'})
           }
        }
        else{
            res.send({result:"Fail",message:"Email Id Does Not Exist In Our DataBase"})
        }
      }
      catch(e){
        res.send({result:"Fail",message:"Internal Server Error"})
    }
})



app.post("/user/forgetotp",async(req,res)=>{
   try{
    var data=await Data.findOne({email:req.body.email})
    if(data){
        if(data.otp===req.body.otp){
           res.send({result:"Done"})
        }
        else{
            res.send({result:"Fail",message:"Incorrect Otp"})
        }
    }
    else{
        res.send({result:"Fail",message:"Internal Server Error"})
    }
   }
    catch(e){
        res.send({result:"Fail",message:"Internal Server Error"})
    }
})



app.post("/user/forgetpassword",async(req,res)=>{
    try{
        var data=await Data.findOne({email:req.body.email})
        if(data){
            if(schema.validate(req.body.password)){
                data.password=req.body.password
                await data.save()
                res.send({result:"Done",message:"Password Changed"})
            }
            else{
                res.send({result:"Fail",message:"Password length must be 8 and has one uppercase one lowercase and should not contain any spaces"}) 
            }
         }
         else{
             res.send({result:"Fail",message:"Email Id Does Not Exist In Our DataBase"})
         }
    }
    catch(e){
        res.send({result:"Fail",message:"Internal Server Error"})
    }
})



//update password
app.post("/user/updatepassword/:curpas",updpass,async(req,res)=>{
    try{
        var data=await Data.findOne({email:req.body.email})
        if(data){
            if(schema.validate(req.body.password)){
                data.password=req.body.password
                await data.save()
                res.send({result:"Done",message:"Password Updated Successfully"})
            }
            else{
                res.send({result:"Fail",message:"Password length must be 8 and has one uppercase one lowercase and should not contain any spaces"}) 
            }
         }
         else{
             res.send({result:"Fail",message:"Email Id Does Not Exist In Our DataBase"})
         }
    }
    catch(e){
        res.send({result:"Fail",message:"Internal Server Error"})
    }
})



app.listen(PORT,()=>console.log(`Server Is Listening At ${PORT}`))