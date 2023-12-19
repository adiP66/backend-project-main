
require('dotenv').config()
const express = require("express");
const path = require("path");
const app = express();
const hbs = require("hbs")
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
require("./db/conn");
const Register = require("./models/registers");
const Template = require("./models/templates")
const auth = require('./middleware/auth');
const { flash } = require('express-flash-message');
const session = require('express-session');
const methodOverride = require('method-override');
const nodemailer = require('nodemailer');
const Razorpay= require('razorpay');

// const adminRouter =  require('../server/routes/customer')

// app.use(auth, (req, res, next) => {
//     res.locals.isAuthenticated = !!req.user;
//     next();
//   });

const port = process.env.PORT || 3000;

const static_path = path.join(__dirname, "../public")
const template_path = path.join(__dirname, "../templates/views")
const partials_path = path.join(__dirname, "../templates/partials")

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended:false}));
app.use(express.static(static_path))

app.use(methodOverride('_method'));

app.use(session({
    secret: process.env.SECRET_KEY,
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7  //1 week bro
    }
})
);


let transporter = nodemailer.createTransport({
    service: 'gmail', // your email service
    auth: {
      user: 'adityaparkhe442@gmail.com', // your email
      pass: '   ' // your email password
    }
  });

app.use(flash({ sessionKeyName: 'express-flash-message' }))

// app.use(function(req, res, next){
//     // if there's a flash message in the session request, make it available in the response, then delete it
//     res.locals.sessionFlash = req.session.sessionFlash;
//     delete req.session.sessionFlash;
//     next();
// });

var razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_ID_KEY,
    key_secret: process.env.RAZORPAY_SECRET_KEY

});




app.set("view engine", "hbs");
app.set("views", template_path)
hbs.registerPartials(partials_path);

hbs.registerHelper('lastupdatedat', function(customer){
    return new Date(customer.updatedAt).toLocaleString(undefined, {timeZone: 'Asia/Kolkata'});
});

hbs.registerHelper('createdat', function(customer){
    return new Date(customer.createdAt).toLocaleString(undefined, {timeZone: 'Asia/Kolkata'});
});

hbs.registerHelper('freeornot', function(price){
    if(price == 0){
        return 'Free download'
    }
    else{
        return `Rs ${price}/-`
    }
});

hbs.registerHelper('basicorpremium', function(customer){

    console.log(customer.basic)
    if(customer.basic){
        return 'Basic plan';
    }
    else if(customer.premium){
        return 'Premium plan'
    }
    else{
        return 'No plan (Basic/Premium)';
    }
    
})



hbs.registerHelper('downloadtempname', function(customer){
    let sentence = customer.name;
    if (sentence.includes('PPT')) {
        return sentence;
    } else {
        let firstWord = sentence.trim().split(" ")[0];
        return firstWord;
    }
});

hbs.registerHelper('pptphotoonot', function(customer){
    let sentence = customer.name;
    if (sentence.includes('PPT')) {
        return `../PPTtemplatephotos/${sentence}.jpg`
    }
    else{
        let firstWord = sentence.trim().split(" ")[0];
        
        return `../templatephotos/${firstWord}.webp`
    }
})

hbs.registerHelper('returndownloadlink', function(customer){
    let sentence = customer.name;
    if (sentence.includes('PPT')) {
        return `../PPTtemplatephotos/${sentence}`
    }
    else{
        return `download-file/{{downloadtempname this}}`
    }

})

hbs.registerHelper('pptdemoonot', function(customer){
    let sentence = customer.name
    if (sentence.includes('PPT')) {
        return `pptlivedemo/${sentence}`
    }
    else{
        let firstWord = sentence.trim().split(" ")[0];
        return `livedemo/${firstWord}`
    }
})



  


// admin routes
app.use('/admin', auth, require('../server/routes/customer'))


// template tab routes
app.use('/templates', auth, require('../server/routes/templates'))


// member routes
app.use('/member', auth, require('../server/routes/members'))

app.get("/", auth, (req, res) => {
    res.render("home", { darkMode: req.session.darkMode });
    console.log(req.session.darkMode);
}); 

app.get('/aboutus', auth, (req, res)=> {
    res.render("aboutus", { darkMode: req.session.darkMode });
})



app.get('/signup',auth, (req, res)=> {
    res.render("signup" , { darkMode: req.session.darkMode });
})

app.get('/signin',auth, (req, res)=> {  

    res.render("signin" , { darkMode: req.session.darkMode });
})

app.get('/member', auth,(req, res)=> {
    res.render("member" , { darkMode: req.session.darkMode });
})

app.get('/dark-mode', auth, async (req,res) => {
    email = res.locals.email
    req.session.darkMode = !req.session.darkMode;
    res.redirect('back');
})


app.post('/feedback-data', auth, async(req,res) => {
    const { feedback } = req.body
    email = res.locals.email
    console.log(email);
    checkuser = Register.findOne({ email });
    await checkuser.updateOne({ $set: { feedback: feedback } });
    res.send('Your feedback has been submitted');       
})

app.post('/contactus-data', auth, async(req,res) => {
    email = res.locals.email
    checkuser = await Register.findOne({ email });

    const { name, phone, message } = req.body;
    if(!email){
        res.send('Please login first!')
        return;
    }
    const contactusData = { name, phone , message };
    await checkuser.updateOne(
        { $push: { customercontactus: { contactus: contactusData } } }
    );
    res.send('Your message has been submitted!');
    
})



app.get('/logout', auth, async(req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((currElement) => {
            return currElement.token !== req.token;     
        })

        res.clearCookie("jwt");
        console.log("logged out successfully")
        await req.user.save();
        res.redirect('/');
        
        
        
    } catch (error) {
        res.status(500).send(error);
    }
})

app.get("/introone", auth,  (req, res) => {
   
    if(res.locals.isAuthenticated){
        res.render('introone');
    }
    else{
        res.render('404');
    }
}); 

app.get('/forgot-password', (req,res, next) => {
    res.render('forgot-password')
});


app.get('/pricing', auth, (req,res) => {
    let ts = Date.now() 
    let expiremonth = Date.now() + 2629746000    
    
    console.log(expiremonth)
    console.log(expiremonth - ts);
    // console.log(Date.now() - Date.now())

    email = res.locals.email
    console.log(email);
  
    res.render("pricing", { darkMode: req.session.darkMode });
    
})

app.post('/order', auth,  async (request, response) => {

    const amount = request.body.amount;
    request.session.basic = request.body.basic;
    request.session.premium = request.body.premium;
    await request.session.save();
    const email = response.locals.email;
    checkuser = await Register.findOne({ email });  

   
    if(!email){
        response.json({ message: 'Please login first!' });

        return;
    }
    if (!amount) return response.json({ message: 'Please provide amount' })
    if(checkuser.premium) return response.json({ message: 'You already have an existing plan'})
    if(checkuser.basic) return response.json({ message: 'You already have an existing plan'})
    // Create a razorpayInstance
    const razorpayInstance = new Razorpay({ 
        key_id: process.env.RAZORPAY_ID_KEY,
        key_secret: process.env.RAZORPAY_SECRET_KEY
     });

     const paymentOptions = {
        amount: amount * 100,
        currency: 'INR',
        receipt: '#1',
     };

     const razorpayOrder = await razorpayInstance.orders.create(paymentOptions);
     
     const orderId = razorpayOrder.id;

     

     return response.json({ 
        message: 'success', 
        order: razorpayOrder 
    });
    
});


app.get('/check-order-status/:orderId', auth, async (request, response) => {
  const orderId = request.params.orderId;
  email = response.locals.email;
  checkuser = await Register.findOne({ email });
  
  // Create a razorpayInstance
  const razorpayInstance = new Razorpay({ 
    key_id: process.env.RAZORPAY_ID_KEY,
    key_secret: process.env.RAZORPAY_SECRET_KEY
  });
//   console.log(orderId);
  
  
  try {
    // Fetch the order status from Razorpay
    const orderStatus = await razorpayInstance.orders.fetch(orderId);
    console.log(orderStatus);
    if (orderStatus.status == 'paid') {
        if(request.session.premium == 'premiumplan'){
            await checkuser.updateOne({ $set: { premium: Date.now() + 2629746000} });
            return response.json({ message: 'Payment captured' });
        }
        else if(request.session.basic == 'basicplan'){
            await checkuser.updateOne({ $set: { basic: Date.now() + 2629746000} });
            return response.json({ message: 'Payment captured' });
        }
        
        // Payment has been captured.
        // Update your system accordingly.
      
    } else {
      // Payment is not yet captured.
      return response.json({ message: 'Payment not captured' });
    }
  } catch (error) {
    console.error('Error fetching order status:', error);
    return response.status(500).json({ message: 'Error fetching order status' });
  }
});





app.post('/forgot-password', async (req,res, next) => {
    const { email } = req.body;
    

    // Checking if user exists in database
    try {
        const checkuser = await Register.findOne({ email });     
        if(checkuser.email !== email){
            return res.send('User with this email does not exist');
        }
        
        const secret = process.env.SECRET_KEY_FORGETPASS + checkuser.password;
        const payload = {
            email: checkuser.email,
            id: checkuser.id
        }

        const token = jwt.sign(payload, secret, { expiresIn:'1000000' })
        const link = `http://localhost:3000/reset-password/${checkuser.email}/${token}`
        res.send('password reset has been sent to your email');
    
        let mailOptions = {
            from: 'adityaparkhe442@@gmail.com', // sender address
            to: checkuser.email, // list of receivers
            subject: `Reset password link: ${link}`, // Subject line
            text: `Please click on the following link to reset your password: ${link}`, // plain text body
            html: `<p>Please click on the following link to reset your password: <a href="${link}">${link}</a></p>` // html body
          };

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
        
          

    } catch (error) {
        console.log(error);
    }


});

app.get('/reset-password/:email/:token', async (req,res, next) => {
    const { email , token } = req.params
    var ObjectId = require('mongodb').ObjectId;
    const checkuser = await Register.findOne({ email });  
    
    
    // Check if this id exists in db
    if(email !== checkuser.email){
        return res.send('Invalid id...');
    }
    // else
    const secret = process.env.SECRET_KEY_FORGETPASS + checkuser.password
    try {
        const payload = jwt.verify(token, secret);
        res.render('reset-password', {email: checkuser.email})

    } catch (error) {
        console.log(error);
        res.send(error.message);
    }

});

app.post('/reset-password/:email/:token', async (req,res, next) => {
    const { email , token } = req.params;
    const {password, password2} = req.body;
    const checkuser = await Register.findOne({ email });  
    if(email !== checkuser.email){
        return res.send('Invalid id...');
    }

    const secret = process.env.SECRET_KEY_FORGETPASS + checkuser.password
    try {
        const payload = jwt.verify(token, secret);
        // validating password and password2 to match
        if(password == password2){
            pwd = await bcrypt.hash(password, 10);
            await checkuser.updateOne({ $set: { password: pwd } });
        }
        res.send('Your password has been changed');
    } catch (error) {
        console.log(error);
        res.send(error.message);
    }
});




app.post('/signup', async (req, res)=> {
   
    try {
        const { firstname, lastname, email, password } = req.body;
    

        // Check if email is already registered
        const existingUser = await Register.findOne({ email });
        if (existingUser) {
            return res.status(400).send({ errorMessage: "Email already in use" });
        }
        else{
            const registerEmployee = new Register({
                firstname,
                lastname,
                email,
                password
            }); 
            
            
            

            
            const token = await registerEmployee.generateAuthToken();
            console.log("the token part" + token)

            res.cookie("jwt", token, {
                expires: new Date(Date.now() + 6000000000),
                httpOnly: true
            });

            await registerEmployee.save();
            return res.status(201).send({message: "Email created!"})
        }
        // Hash the password
        
    } catch (error) {
        // console.error(error);
        res.status(500).send({ errorMessage: "Email already in use" });

    }
});


app.post("/signin", async(req,res) => {
        try{
            const { email, password } = req.body;
            const existingUser = await Register.findOne({ email });
            const isMatch = await bcrypt.compare(password, existingUser.password)
            

           

            
            

            const admin1 = existingUser.admin;
            console.log(admin1);

            if(existingUser){
                if((isMatch)){
                    const token = await existingUser.generateAuthToken();
                    console.log("the token part" + token)
        
                    res.cookie("jwt", token, {
                        expires: new Date(Date.now() + 6000000000),
                        httpOnly: true
                    });
                    if(admin1){
                         return res.status(200).json({ message: "admin is logging in"})
                    }
                    else{
                        res.status(200).json({ message: "member is logging in"})
                    }
                

                }
                
                
                else{
                    return res.status(400).json({ message: "Password is wrong!"})
                }
            }
            else{
                return res.status(400).json({ message: "User doesn't exist" })
            }
        }
        catch(error){
            console.log(error)
            return res.status(500)
        }


});

// app.get('*', (req,res) => {
//     res.status(404).render('404');
// })



app.listen(port, () => {
    console.log(`Server is running at port no ${port}`);
});
