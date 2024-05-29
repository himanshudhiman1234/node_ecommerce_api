const router = require("express").Router();
const User = require("../models/User")
const CryptoJs = require("crypto-js")
const jwt = require("jsonwebtoken")


router.post("/register", async (req,res)=>{
    try{
    const user = new User({
        username :  req.body.username,
        email: req.body.email,
        password:CryptoJs.AES.encrypt(req.body.password,process.env.PASS_SEC).toString(),

    })

    const savedUser = await user.save();
    res.status(201).json(savedUser)

}catch(err){
    res.status(500).json({ error: err.message })
}   

})


router.post("/login", async (req, res) => {
    try {
        // Find user by username
        const user = await User.findOne({ username: req.body.username });

        if (!user) {
            return res.status(401).json("Wrong credentials");
        }

        // Decrypt the stored hashed password
        const hashedPassword = CryptoJs.AES.decrypt(user.password, process.env.PASS_SEC);
        const decryptedPassword = hashedPassword.toString(CryptoJs.enc.Utf8);

        // Check if the provided password matches
        if (decryptedPassword !== req.body.password) {
            return res.status(401).json("Wrong credentials");
        }

        // Create JWT token
        const accessToken = jwt.sign(
            {
                id: user._id,
                isAdmin: user.isAdmin
            },
            process.env.JWT_SEC,
            { expiresIn: "3d" }
        );

        // Extract user data excluding the password
        const { password, ...others } = user._doc;

        // Successful login
        res.status(200).json({ ...others, accessToken });
    } catch (err) {
        res.status(500).json(err);
    }
});


module.exports = router;    