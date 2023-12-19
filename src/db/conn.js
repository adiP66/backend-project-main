const mongoose = require("mongoose");

mongoose.connect("mongodb://0.0.0.0:27017/marketingRegistration",{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    
}).then(() => {
    console.log(`Connection successfull`);
}).catch((e) => {
    console.log(e);
}); 


