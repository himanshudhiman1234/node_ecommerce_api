const { verifyToken, verifyTokenAuthorization, verifyTokenAndAdmin } = require("./verifyToken");
const CryptoJS = require("crypto-js");
const User = require("../models/User"); // Ensure the correct path to the User model
const router = require("express").Router();

router.put("/:id", verifyTokenAuthorization, async (req, res) => {
    console.log("hello")
    // Check if password needs to be updated and encrypt it
    if (req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(
            req.body.password,
            process.env.PASS_SEC
        ).toString();
    }

    try {
        // Find the user by ID and update
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body
            },
            { new: true }
        );

        // Send the updated user data as response
        res.status(200).json(updatedUser);
    } catch (err) {
        // Handle any errors
        res.status(500).json(err);
    }
});

router.delete("/:id",verifyTokenAuthorization,async(req,res)=>{
    try{
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User has been deleted")
    }catch(err){
        res.status(500).json(err)
    }
})



router.get("/find/:id",verifyTokenAndAdmin,async(req,res)=>{
    try{
        await User.findById(req.params.id);
        const {password,...others} = user._doc;
        res.status(200).json(others)
    }catch(err){
        res.status(500).json(err)
    }
})

router.get("/",verifyTokenAndAdmin,async(req,res)=>{

        const query = req.query.new;
        try{
            const AllUser = query ? await User.find().sort({_id:-1}).limit(5): await User.find();
            res.status(200).json(AllUser)

        }
      
    catch(err){
        res.status(500).json(err)
    }
})


router.get("/stats", async (req, res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

    try {
        const data = await User.aggregate([
            { $match: { createdAt: { $gte: lastYear } } },
            {
                $project: {
                    month: { $month: "$createdAt" }
                }
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: 1 }
                }
            }
        ]);
        res.status(200).json(data); // Respond with the aggregated data
    } catch (err) {
        res.status(500).json(err); // Respond with error on failure
    }
});

module.exports = router;
