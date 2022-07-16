module.exports = (req, res, next) => {

    if (req.session && req.session.user) {
        console.log("session is successfully being used")
        next()
    } else {
        console.log("session FAILED, please login")
        // res.redirect("http://localhost:3000/");
        // next()
        res.status(401).json({ message: "You are unauthorized, please login" })
    }
}