const mongoose=require('mongoose')
const Schema=new mongoose.Schema({
    username:{
        type:String,
        required:[true,'UserName Is Required Field']
    },
    name:{
        type:String,
        required:[true,'Name Is Required Field']
    },
    email:{
        type:String,
        required:[true,'email Is Required Field'],
        unique:true
    },
    password:{
        type:String,
        required:[true,'Password Is Required Field']
    },
    phone:{
        type:String,
        required:[true,'Phone Number Is Required Field']
    },
    city:{
        type:String,
        default:"Ranchi"
    },
    state:{
        type:String,
        default:"Jharkhand"
    },
    otp:{
        type:Number
    },
    token:[],
    date:{
        type:String,
        default:""
    }
})
const Data=mongoose.model('Data',Schema)
module.exports=Data;