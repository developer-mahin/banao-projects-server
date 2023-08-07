const express = require("express")
const router = express.Router()
const profileController = require("../controllers/profile-controller")
const { verifyJsonWebToken } = require("../middlewares/verifyJsonWebToken")


router.get("/userprofile", verifyJsonWebToken, profileController.getUserProfile)
router.patch("/edit-contact/:id", verifyJsonWebToken, profileController.editContact)
router.patch("/edit-info/:id", verifyJsonWebToken, profileController.editInfo)
router.patch("/change-profile-pic/:id", verifyJsonWebToken, profileController.updateProfilePic)
router.patch("/change-cover-pic/:id", verifyJsonWebToken, profileController.updateCoverPhoto)





module.exports = router