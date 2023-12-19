const express = require("express");
const router = express.Router();
const templateController = require("../controllers/templateController");
const auth = require("../../src/middleware/auth");

router.get("/", auth, templateController.homepage);

router.get("/templatebusiness", auth, templateController.businesspage);

router.get("/templatecasual", auth, templateController.casualpage);

router.get("/templatepersonal", auth, templateController.personalpage);

router.get("/templatecorporate", auth, templateController.corporatepage);

router.get("/templateeducational", auth, templateController.educationalpage);

router.get("/templateexclusives", auth, templateController.exclusivepage);

router.get(
  "/download-file/:templateName",
  auth,
  templateController.downloadFile
);

router.get("/pptTemplates", auth, templateController.pptTemplates);

router.post("/order", auth, templateController.ordertemplates);

router.get(
  "/PPTdownload-file/:templateName",
  auth,
  templateController.pptdownloadFile
);

router.get("/livedemo/:demotempname", auth, templateController.livedemo);

router.get(
  "/check-temporder-status/:templateName",
  auth,
  templateController.tempOrder
);

router.get("/pptlivedemo/:demotempname", auth, templateController.pptlivedemo);

router.post("/search", templateController.searchFile);

module.exports = router;
