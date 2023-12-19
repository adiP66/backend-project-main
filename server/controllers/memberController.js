const Customer = require('../../src/models/Customer');
const Register = require('../../src/models/registers');
const bcrypt = require('bcrypt');

exports.homepage = async(req,res) => {
   email = res.locals.email;
   console.log(email)

   try {
      const customer =  await Register.findOne({ email });
    
      res.render('memberindex', {layout: 'member', customer, darkMode: req.session.darkMode});   
    
   } catch (error) {
      console.log(error)
   }
   
}

exports.profile = async(req,res) =>{
   try {
      const customer = await Register.findOne({ _id: req.params.id })
      res.render('profile', {layout: 'member', customer, darkMode: req.session.darkMode})
  } catch (error) {
      console.log(error);
  }
}

exports.Membership = async(req,res) => {
    email = res.locals.email
    const customer =  await Register.findOne({ email });

    res.render('membership', {layout: 'member', customer,   darkMode: req.session.darkMode})
}




exports.view = async(req,res) => {
   try {
      const customer = await Register.findOne({ _id: req.params.id })
      res.render('memberview', {layout: 'member', customer, darkMode: req.session.darkMode})
  } catch (error) {
      console.log(error);
  }
}


exports.edit  = async(req,res) => {
   try {
      const customer = await Register.findOne({ _id: req.params.id })
      res.render('memberedit', {layout: 'member', customer, darkMode: req.session.darkMode})
  } catch (error) {
      console.log(error);
  }
}


exports.editPost = async(req,res) => {

   try {
       await Register.findByIdAndUpdate(req.params.id, {
           firstname: req.body.firstname,
           lastname: req.body.lastname,
            password: await bcrypt.hash(req.body.password,10),
           updatedAt: Date.now()
       })
      //  pwd = await bcrypt.hash(password, 10);
      //  await checkuser.updateOne({ $set: { password: pwd } });
       res.redirect(`/member`)
       console.log('redirected');

   } catch (error) {
       console.log(error);
   }
}


// Delete CUSTOMER
exports.deleteCustomer = async(req,res) => {
 try {
   await Register.deleteOne({ _id: req.params.id })
   res.redirect('/home'); 
 } catch (error) {
   console.log(error);
 }
}

exports.CancelPlan = async(req,res) => {
    email = res.locals.email
    
    const customer =  await Register.findOne({ email }); 

    if(customer.templates < 2){
        customer.plan = null;
        await customer.save();
        res.send('Plan cancelled successfully and you will be refunded shortly')
        if(customer.basic){
            await Register.updateOne({ email }, { $unset: { basic: "" } });
        }
        else{
            await Register.updateOne({ email }, { $unset: { premium: "" } });
        }

    }
    else{
        res.send("You have already downloaded more than 2 templates, cannot cancel plan now!")
    }

}