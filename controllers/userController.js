const path = require('path');
const User = require('../models/user');
const bcrypt = require('bcrypt');

module.exports.register = (req, res) => {
    res.sendFile(path.join(__dirname, "../views", "register.html"));
}

module.exports.login = (req, res) => {
    res.sendFile(path.join(__dirname, "../views", "login.html"));
}


module.exports.postAddUser = async (req, res) => {
    try {
        let { name, email, password } = req.body;
        password = await bcrypt.hash(password, 10);

        const createdUser = await User.create({ name, email, password });
        if (createdUser)
            res.status(200).send(createdUser);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

// User login API completed

module.exports.postGetUser = async (req, res) => {
    try {
        const user = await User.findOne({
            where: {
                email: req.body.email
            }
        });
        if (!user)
            res.status(404).send('User not found');
        else {
            const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
            if (isPasswordValid)
                res.status(200).send(user);
            else
                res.status(401).send('Invalid password');
        }
    } catch (error) {
        res.status(500).send(error.errors[0].message);
    }
}

module.exports.updateUser = async (req, res) => {
    try {
        const id = req.body.id;
        delete req.body.id;

        const result = await User.update(req.body, {
            where: {
                id: id
            },
            returning: true
        });


        if (result[1] === 0)
            res.status(404).send('User not found');
        else
            res.status(200).send(await User.findOne({ where: { id: id } }));
    } catch (error) {
        res.status(500).send(error.message);
    }
};


module.exports.deleteUser = async (req, res) => {
    try {
        const id = req.query.id;

        const user = await User.findOne({ where: { id } });
        if (!user) {
            return res.status(404).send('User not found');
        }

        await User.destroy({ where: { id } });

        res.status(200).send("User Deleted");

    } catch (error) {
        const user = await User.findOne({ where: { id } });
        if (!user) {
            return res.status(404).send('User Deleted');
        }
        else
            res.status(500).send('Internal Server Error');
    }
};
