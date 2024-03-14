const bcrypt = require('bcryptjs');
const User = require('../models/user');

async function registerUser(req, res) {
    const { username, password, role } = req.body;
    console.log(req.body)
   
        const hashedPassword = await bcrypt.hash(password, 12);
        await User.create({ username: username, password: hashedPassword, role: role}).then(()=>{
            res.status(201).json({ message: 'User registered successfully' });
        }).catch((error)=> {
            console.log(error)
        res.status(500).json({ message: error });
    })
}

module.exports = {
    registerUser
};