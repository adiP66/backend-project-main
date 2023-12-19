const AdmZip = require("adm-zip");
const Register = require("../../src/models/registers");
const Template = require("../../src/models/templates");
const pptTemps = require("../../src/models/pptTemps");
const pptTemplatecorporate = require("../../src/models/ppttemplatestyles/ppttemplatecorporate");
const pptTemplateeducational = require("../../src/models/ppttemplatestyles/ppttemplateeducational");
const Templatebusiness = require("../../src/models/templatestyles/templatebusiness");
const Templatecasual = require("../../src/models/templatestyles/templatecasual");
const Templatepersonal = require("../../src/models/templatestyles/templatepersonal");
const Templateexclusives = require("../../src/models/templatestyles/templateexclusives");
const axios = require("axios");
const { AbortController } = require("abort-controller");
const path = require("path");
const Razorpay = require("razorpay");

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_ID_KEY,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

exports.ordertemplates = async (req, res) => {
  const options = {
    amount: req.body.templatePrice * 100, // amount in the smallest currency unit
    currency: "INR",
    receipt: "order_rcptid_11",
  };

  const razorpayOrder = await razorpayInstance.orders.create(paymentOptions);

  const orderId = razorpayOrder.id;

  return response.json({
    message: "success",
    order: razorpayOrder,
  });
};

exports.tempOrder = async (req, res) => {
  const templateName = req.params.templateName;

  if (templateName.includes("PPT")) {
    let firstWord = templateName.trim().split(" ")[0];
    res.download(`public/PptTemplates/${templateName}.pptx`);
  } else {
    res.download(`public/templates/${templateName}.zip`);
  }
};

exports.homepage = async (req, res) => {
  const templates = await Template.find({});
  console.log(req.session.darkMode);
  // console.log(templates);
  res.render("templateindex", {
    layout: "templates",
    templates,
    darkMode: req.session.darkMode,
  });
};

exports.pptTemplates = async (req, res) => {
  const ppttemplates = await pptTemps.find({});
  console.log(req.session.darkMode);
  // console.log(templates);
  res.render("pptTemplates", {
    layout: "templates",
    ppttemplates,
    darkMode: req.session.darkMode,
  });
};

exports.businesspage = async (req, res) => {
  const templates = await Templatebusiness.find({});

  res.render("templatebusiness", {
    layout: "templates",
    templates,
    darkMode: req.session.darkMode,
  });
};

exports.casualpage = async (req, res) => {
  const templates = await Templatecasual.find({});
  console.log(templates);
  res.render("templatecasual", {
    layout: "templates",
    templates,
    darkMode: req.session.darkMode,
  });
};

exports.personalpage = async (req, res) => {
  const templates = await Templatepersonal.find({});

  res.render("templatepersonal", {
    layout: "templates",
    templates,
    darkMode: req.session.darkMode,
  });
};

exports.exclusivepage = async (req, res) => {
  const templates = await Templateexclusives.find({});

  res.render("templateexclusives", {
    layout: "templates",
    templates,
    darkMode: req.session.darkMode,
  });
};

exports.corporatepage = async (req, res) => {
  const templates = await pptTemplatecorporate.find({});

  res.render("templatecorporate", {
    layout: "templates",
    templates,
    darkMode: req.session.darkMode,
  });
};

exports.educationalpage = async (req, res) => {
  const templates = await pptTemplateeducational.find({});

  res.render("templateeducational", {
    layout: "templates",
    templates,
    darkMode: req.session.darkMode,
  });
};

exports.searchFile = async (req, res) => {
  try {
    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");

    let templates = [];

    // If the search term matches a category, search in the corresponding collection
    if (searchNoSpecialChar.toLowerCase() === "business") {
      templates = await Templatebusiness.find();
    } else if (searchNoSpecialChar.toLowerCase() === "casual") {
      templates = await Templatecasual.find();
    } else if (searchNoSpecialChar.toLowerCase() === "personal") {
      templates = await Templatepersonal.find();
    } else if (searchNoSpecialChar.toLowerCase() === "exclusive") {
      templates = await Templateexclusives.find();
    } else if (searchNoSpecialChar.toLowerCase() === "corporate") {
      templates = await pptTemplatecorporate.find();
    } else if (searchNoSpecialChar.toLowerCase() === "ppt") {
      templates = await pptTemps.find({
        name: { $regex: new RegExp(searchNoSpecialChar, "i") },
      });
    } else if (searchNoSpecialChar.toLowerCase() === "educational") {
      templates = await pptTemplateeducational.find();
    } else {
      // If the search term doesn't match a category, search by name in both the templates and pptTemps collections
      const [templatesFromTemplates, templatesFromPptTemps] = await Promise.all(
        [
          Template.find({
            name: { $regex: new RegExp("^" + searchNoSpecialChar, "i") },
          }),
          pptTemps.find({
            name: { $regex: new RegExp("^" + searchNoSpecialChar, "i") },
          }),
        ]
      );

      // Combine the results from both collections
      templates = [...templatesFromTemplates, ...templatesFromPptTemps];
    }

    res.render("templatesearch", {
      layout: "templates",
      templates,
      darkMode: req.session.darkMode,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.downloadFile = async (req, res) => {
  const templateName = req.params.templateName; // Changed from collectionName to templateName
  const email = res.locals.email;
  checkuser = await Register.findOne({ email });
  console.log(checkuser.templates);

  if (!email) {
    res.send("Please login first!");
    return;
  }
  if (checkuser.basic) {
    let Expiry = Date.now() - checkuser.basic;
    if (Expiry == 0 || Expiry > 0) {
      console.log(Expiry);
      res.send("Your plan has expired!");
      return;
    }
    if (checkuser.templates < 10) {
      checkuser.templates += 1;
      await checkuser.save();
      res.download(`public/templates/${templateName}.zip`);
    } else {
      res.send("Your number of downloads have run out!");
    }
  } else if (checkuser.premium) {
    let Expiry = Date.now() - checkuser.premium;
    if (Expiry == 0 || Expiry > 0) {
      console.log(Expiry);
      res.send("Your plan has expired!");
      return;
    }
    if (checkuser.templates < 20) {
      checkuser.templates += 1;
      await checkuser.save();
      res.download(`public/templates/${templateName}.zip`);
    } else {
      res.send("Your number of downloads have run out!");
    }
  } else if (checkuser.templates < 5) {
    checkuser.templates += 1;
    await checkuser.save();
    res.download(`public/templates/${templateName}.zip`);
  } else {
    res.send("Your number of downloads have run out!");
  }
};

exports.pptdownloadFile = async (req, res) => {
  const templateName = req.params.templateName; // Changed from collectionName to templateName
  const email = res.locals.email;
  checkuser = await Register.findOne({ email });

  if (!email) {
    res.send("Please login first!");
    return;
  }
  if (checkuser.basic) {
    let Expiry = Date.now() - checkuser.basic;
    if (Expiry == 0 || Expiry > 0) {
      console.log(Expiry);
      res.send("Your plan has expired!");
      return;
    }
  } else if (checkuser.premium) {
    let Expiry = Date.now() - checkuser.premium;
    if (Expiry == 0 || Expiry > 0) {
      console.log(Expiry);
      res.send("Your plan has expired!");
      return;
    }
  }

  checkuser.templates += 1;
  await checkuser.save();
  res.download(`public/PptTemplates/${templateName}.pptx`);
};

exports.livedemo = async (req, res) => {
  const templateName = req.params.demotempname;
  console.log(templateName);
  res.sendFile(
    path.join(
      __dirname,
      "..",
      "..",
      "public",
      "templates",
      templateName,
      "index.html"
    )
  );
};

exports.pptlivedemo = async (req, res) => {
  const templateName = req.params.demotempname;
  let firstWord = templateName.trim().split(" ")[0];

  res.sendFile(
    path.join(
      __dirname,
      "..",
      "..",
      "public",
      "PptTemplates",
      `${firstWord}.html`
    )
  );
};
