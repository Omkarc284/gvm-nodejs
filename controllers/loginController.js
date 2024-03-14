const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();


async function loginUser(req, res) {
    const token = jwt.sign({ userId: req.user.id }, process.env.SECRET, { expiresIn: '1h' });
    res.json({ token });
}

module.exports = {
    loginUser
};