const express = require("express");

const {
    explainCode,
    debugCode
} = require("../controllers/codeController");


const router = express.Router();


// ==========================================
// EXPLAIN CODE
// ==========================================

router.post(
    "/explain",
    explainCode
);


// ==========================================
// DEBUG CODE
// ==========================================

router.post(
    "/debug",
    debugCode
);


module.exports = router;