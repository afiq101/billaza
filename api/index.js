const express = require("express");
const router = express.Router();

const media = require("./media");
const bills = require("./bill");
const pay = require("./pay");

router.use('/media', media);
router.use('/pay', pay);
router.use('/bills', bills);

module.exports = router;
