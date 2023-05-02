const mongoose = require('mongoose')
const mongooseUrl = 'mongodb://localhost:27017/eventRemainder?directConnection=true'
const connectToMongo=()=>{
    mongoose.connect(mongooseUrl, {
        useNewUrlParser: true, 
        useUnifiedTopology: true
    }, () => console.log("DB connected"))
}
module.exports = connectToMongo
