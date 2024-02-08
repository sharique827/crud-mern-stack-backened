const mongoose=require('mongoose')
// mongoose.connect(`mongodb://localhost:27017/Netflix`)
mongoose.connect(`mongodb+srv://shariquezafar111:sharique111zafar@cluster0.bvuysvh.mongodb.net/crudMern`)
.then(()=>{
    console.log('DataBase Is Connected To Server')
})
.catch(()=>{
    console.log('Something Went Wrong While Connecting')
})