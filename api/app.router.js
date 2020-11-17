const router = require("express").Router();
const { transactions, getTransactionList, getUsersList } = require("../model/app");
const { checkToken } = require("../auth/token_validation");

router.post("/depositOrWithDraw", checkToken, transactions);
router.get("/getTransactionList/:id", checkToken, getTransactionList);
router.get("/getUsersList", checkToken, getUsersList);

module.exports = router;
