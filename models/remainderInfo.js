const mongoose = require('mongoose')
const { Schema } = mongoose;
const remainderInfoSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref :'user'
      },
     
    reminderMsg:{
        type : String,
        required :true
    },
    remindAt:{
        type : String,
        require : true
    },
    isReminded:{
        type:Boolean
    },

    // date: {
    //     type: Date,
    //     default: Date.now,
    //   },
   
});
module.exports = mongoose.model("remainderInfo", remainderInfoSchema);
// module.exports = eventList