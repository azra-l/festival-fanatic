module.exports = (req, res, next) => {

    if (req.session && req.session.user) {
        console.log("session is successfully being used")
        next()
    } else {
        console.log("session FAILED, please login")
        res.status(401).json({ message: "You are unauthorized, please login" })
    }
}