const express = require("express")

const router = express.Router()

const jobCollection = require("../controllers/job-controller");
const { verifyJsonWebToken } = require("../middlewares/verifyJsonWebToken");

router
    .route("/add-job")
    .post(verifyJsonWebToken, jobCollection.addJob)

router
    .route("/get-all")
    .get(verifyJsonWebToken, jobCollection.getAll)

router
    .route("/applyJob")
    .post(verifyJsonWebToken, jobCollection.applyJob)

router
    .route("/getASingleJob/:id")
    .get(verifyJsonWebToken, jobCollection.getASingleJob)


module.exports = router;