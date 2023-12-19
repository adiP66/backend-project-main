
const Register = require('../../src/models/registers');
const Template = require('../../src/models/templates');
const Templatebusiness = require('../../src/models/templatestyles/templatebusiness');
const Templatecasual = require('../../src/models/templatestyles/templatecasual');
const Templatepersonal= require('../../src/models/templatestyles/templatepersonal');
const Templateexclusives= require('../../src/models/templatestyles/templateexclusives');
const pptTemplates = require('../../src/models/pptTemps');
const pptTemplatecorporate = require('../../src/models/ppttemplatestyles/ppttemplatecorporate');
const pptTemplateeducational = require('../../src/models/ppttemplatestyles/ppttemplateeducational');

const mongoose = require('mongoose');


// GET THE ADMIN PAGE
exports.homepage = async(req,res) => {

    messages = await req.consumeFlash('info');
    alreadymessages = await req.consumeFlash('already');
    console.log(`This is the cookie ${req.cookies.jwt}`);
    if(req.user.admin){
        try {
            const customers =  await Register.find({});
            res.render("index", { layout: 'admin', messages, alreadymessages, customers, darkMode: req.session.darkMode });
        } 
        catch (error) {
            console.log(error);
        }
        console.log(req.user.admin)
        }
    else{
        res.status(400).send("you're not an admin")
        }
        console.log('123'); 
}

// GET New CUSTOMER form




exports.addCustomer = async(req,res) => {
    console.log(123)

    // console.log(`This is the cookie ${req.cookies.jwt}`);
    res.render('add', {layout: 'admin', darkMode: req.session.darkMode});
   
 
}

exports.CustDemands = async(req,res) => {
        const customers =  await Register.find({});
        const customerContactUsData = customers.map(customer => customer.customercontactus);

        res.render('customerdemands', {layout: 'admin', customerContactUsData});
}






// POST NEW CUSTOMER 
exports.postCustomer = async(req,res) => {
    // console.log(req.body);
    
   
    // console.log(`This is the cookie ${req.cookies.jwt}`);
    try {
        const { firstname, lastname, email, password, admin } = req.body;
        const existingUser = await Register.findOne({ email });

        if (existingUser) {
            await req.flash('already', 'User already exists.')
            res.redirect('/admin');
        } 
        else {
            const newCustomer = new Register({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                password: req.body.password,
                admin: !!req.body.admin,
                email: req.body.email
            })

            await Register.create(newCustomer);
            await req.flash('info', 'New Customer has been added.')
            res.redirect('/admin')
        }

    } catch (error) {
        console.log(error);
    }


}



// GET CUSTOMER DATA
exports.view = async(req,res) => {
    try {
        const customer = await Register.findOne({ _id: req.params.id })
        res.render('view', {layout: 'admin', customer, darkMode: req.session.darkMode})
    } catch (error) {
        console.log(error);
    }
}


// EDIT CUSTOMER DATA
exports.edit = async(req,res) => {
    try {
        const customer = await Register.findOne({ _id: req.params.id })
        res.render('edit', {layout: 'admin', customer, darkMode: req.session.darkMode})
    } catch (error) {
        console.log(error);
    }
}


// UPDATE CUSTOMER DATA
exports.editPost = async(req,res) => {
    try {
        await Register.findByIdAndUpdate(req.params.id, {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            admin: Boolean(req.body.admin),
            email: req.body.email,
            updatedAt: Date.now()
        })

        res.redirect(`/admin`)
        console.log('redirected');

    } catch (error) {
        console.log(error);
    }
}

// Upload TEMPLATES
exports.uptemplates = async(req,res) => {
    try {
        // const customer = await Register.findOne({ _id: req.params.id })
        res.render('uploadtemplates', {layout: 'admin', darkMode: req.session.darkMode})
    } catch (error) {
        console.log(error);
    }
}

exports.upPPTtemplates = async(req,res) => {
    try {
        // const customer = await Register.findOne({ _id: req.params.id })
        res.render('uploadppttemplates', {layout: 'admin', darkMode: req.session.darkMode})
    } catch (error) {
        console.log(error);
    }
}


exports.templatePost = async(req,res) => {
    try {
        const templatestyle = req.body.templateSection;


        if(templatestyle == 'business'){
            const templateBusinessSave = new Templatebusiness({
                name: req.body.tempname,
                description: req.body.templatedetails,
               
                price: req.body.price
            }); 
            const templateSave = new Template({
                name: req.body.tempname,
                description: req.body.templatedetails,
                
                price: req.body.price
            }); 
            await templateSave.save();
            await templateBusinessSave.save();
        }
        else if(templatestyle == 'personal'){
            const templatePersonalSave = new Templatepersonal({
                name: req.body.tempname,
                description: req.body.templatedetails,
                price: req.body.price
            }); 
            const templateSave = new Template({
                name: req.body.tempname,
                description: req.body.templatedetails,
                price: req.body.price
            }); 
            await templateSave.save();
            await templatePersonalSave.save();
        }
        else if(templatestyle == 'casual'){
            const templateCasualSave = new Templatecasual({
                name: req.body.tempname,
                description: req.body.templatedetails,
                price: req.body.price
            }); 
            const templateSave = new Template({
                name: req.body.tempname,
                description: req.body.templatedetails,
                price: req.body.price
            }); 
            await templateSave.save();
            await templateCasualSave.save();
        }
        else if(templatestyle == 'exclusive'){
            const templateExclusivesSave = new Templateexclusives({
                name: req.body.tempname,
                description: req.body.templatedetails,
                price: req.body.price
            }); 
            
            await templateExclusivesSave.save();
        }
        
        

        
        res.send('Template saved');
    
        
        
    } catch (error) {
        console.log(error);
    }
}

exports.PPTtemplatePost = async(req,res) => {
    try {
        const templatestyle = req.body.templateSection;


        if(templatestyle == 'corporate'){
            const templateCorporateSave = new pptTemplatecorporate({
                name: req.body.tempname,
                description: req.body.templatedetails,
               
                price: req.body.price
            }); 
            const templateSave = new pptTemplates({
                name: req.body.tempname,
                description: req.body.templatedetails,
                
                price: req.body.price
            }); 
            await templateSave.save();
            await templateCorporateSave.save();
        }
        else if(templatestyle == 'educational'){
            const templateEducationalSave = new pptTemplateeducational({
                name: req.body.tempname,
                description: req.body.templatedetails,
                price: req.body.price
            }); 
            const templateSave = new pptTemplates({
                name: req.body.tempname,
                description: req.body.templatedetails,
                price: req.body.price
            }); 
            await templateSave.save();
            await templateEducationalSave.save();
        }
        else if(templatestyle == 'exclusive'){
            const templateExclusivesSave = new Templateexclusives({
                name: req.body.tempname,
                description: req.body.templatedetails,
                price: req.body.price
            }); 
            
            await templateExclusivesSave.save();
        }
        
        

        
        res.send('Template saved');
    
        
        
    } catch (error) {
        console.log(error);
    }
}



// Delete CUSTOMER
exports.deleteCustomer = async(req,res) => {
  try {
    await Register.deleteOne({ _id: req.params.id })
    res.redirect('/admin'); 
  } catch (error) {
    console.log(error);
  }
}

// GET, SEARCH CUSTOMER
exports.searchCustomer = async(req,res) => {

    try {
        let searchTerm = req.body.searchTerm;
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");

        const customers = await Register.find({
            $or: [
                { firstname : { $regex: new RegExp(searchNoSpecialChar, "i") }},
                { lastname : { $regex: new RegExp(searchNoSpecialChar, "i") }},
            ]
        })

        res.render('search', {layout: 'admin', customers, darkMode: req.session.darkMode})

    } catch (error) {
        console.log(error);
    }
    

}



exports.users = async(req,res) => {
    
const customersall = await Register.find({});
// console.log(customers)
const customers = customersall.filter(customersall => !customersall.admin);

    try {
        res.render('users', {layout: 'admin', customers, darkMode: req.session.darkMode})
    } catch (error) {
        console.log(error)
    }

}


exports.adminusers = async(req,res) => {
    
    const customersall = await Register.find({});
    // console.log(customers)
    const customers = customersall.filter(customersall => customersall.admin);
    
        try {
            res.render('adminusers', {layout: 'admin', customers, darkMode: req.session.darkMode})
        } catch (error) {
            console.log(error)
        }
    
    }