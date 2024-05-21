const path = require('path');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const authController = require('../controllers/authController');
const ForgotPasswordRequests = require('../models/forgot_password_requests');
const Sib = require('sib-api-v3-sdk');

module.exports.register = (req, res) => {
    res.sendFile(path.join(__dirname, "../views", "register.html"));
}

module.exports.getLogin = (req, res) => {
    res.sendFile(path.join(__dirname, "../views", "login.html"));
}


// module.exports.postAddUser = async (req, res) => {
//     try {
//         let { name, email, password } = req.body;
//         password = await bcrypt.hash(password, 10);

//         const createdUser = await User.create({ name, email, password });

//         const token = await authController.generateToken({ id: createdUser.id, email: createdUser.email });

//         let tokens = [];
//         if (createdUser.tokens && createdUser.tokens.length > 0) {
//             tokens = JSON.parse(createdUser.tokens);
//         }
//         tokens.push(token);
//         createdUser.tokens = JSON.stringify(tokens);

//         await createdUser.save();

//         res.status(201).send({ name: name, token: token });
//     } catch (error) {
//         console.log(error);
//         res.status(500).send(error.message);
//     }
// };

module.exports.postRegisterUser = async (req, res) => {
    try {
        let { name, email, password } = req.body;
        password = await bcrypt.hash(password, 10);
        const result = await User.create({ name, email, password });
        if (result) {
            const token = await authController.generateToken({ id: result._id, email: result.email });
            result.tokens.push(token);
            await result.save();
            res.status(201).json({ name: result.name, token : token });
        }
        else {  
            res.status(500).json({message : "Something went wrong"});
        }
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
}


// User login API completed

module.exports.postLogin = async (req, res) => {
    try {
        const user = await User.findOne({email : req.body.email});
        if (!user) {
            res.status(404).send('User not found');
            return;
        }

        const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordValid) {
            res.status(401).send('Invalid email or password');
            return;
        }

        const token = await authController.generateToken({ id: user._id, email: user.email });
        user.tokens.push(token);
        await user.save();

        res.status(200).send({ name: user.name, token: token });
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
};



module.exports.getForgotPassword = (req, res) => {
    res.sendFile(path.join(__dirname, "../views", "forgotPassword.html"));
}

module.exports.getResetPassword = async (req, res) => {
    try {
        const id = req.params.id;
        const fpr = await ForgotPasswordRequests.findOne({_id : id});

        if (fpr && fpr.isActive) {
            res.sendFile(path.join(__dirname, "../views", "resetPassword.html"));
        }
        else {
            res.send(`<h3 style="color:red">This link is expired</h3>`)
        }

    } catch (error) {
        console.log(error);
        res.status(500).send("Failed to generate link");
    }
}

module.exports.postForgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({email : req.body.email});
        if (!user) {
            res.status(404).send('User not found');
            return;
        }

        const { email } = req.body;
        const client = Sib.ApiClient.instance;

        const apiKey = client.authentications['api-key'];
        apiKey.apiKey = process.env.API_KEY;

        const transEmailApi = new Sib.TransactionalEmailsApi();

        // Generate a unique password reset token
        const fp = await ForgotPasswordRequests.create({ userId: user._id });

        const sender = { email: 'etracker@support.com' };
        const receivers = [{ email }];

        await transEmailApi.sendTransacEmail({
            sender,
            to: receivers,
            subject: 'Forgot Password',
            htmlContent: `Click <a href='http://localhost:3000/password/reset-password/${fp._id}'>here</a> to reset your password.`
        });

        res.status(200).send({ message: 'Email sent successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: 'Failed to send email' });
    }
};

module.exports.postResetPassword = async (req, res) => {
    try {
        let { id, password } = req.body;
        password = await bcrypt.hash(password, 10);

        const fpr = await ForgotPasswordRequests.findById(id);
        const user = await User.findById(fpr.userId);

        user.password = password;
        fpr.isActive = false;

        await user.save();
        await fpr.save();

        res.status(200).send("Password Updated, Please wait redirecting to Login Page");
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
}

module.exports.getBalanceSheet = async (req, res) => {
    try {
        const user = await User.findById(req.body.userId).select('totalIncome totalExpense');

        let balanceSheet = {
            totalIncome: user.totalIncome,
            totalExpense: user.totalExpense,
            balance: user.totalIncome - user.totalExpense,
        }

        res.status(200).send(balanceSheet);

    } catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
}


