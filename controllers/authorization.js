const jwt = require('jsonwebtoken');
require('dotenv').config();


module.exports.generateToken = async (user) => {
    const payload = {
        id: user.id,
        email: user.email
    }
    const token = jwt.sign(payload, process.env.JWT_SECRETE_KEY, { expiresIn: '24h' });
    return token;
}

module.exports.getVerifyToken = async (req, res, next) => {
    console.log(req.query.token);
    const token = req.query.token;
    if (!token)
        return res.status(401).send(html);

    jwt.verify(token, process.env.JWT_SECRETE_KEY, (err, decoded) => {
        if (err)
            return res.status(401).send(html);

        req.decoded = decoded;
        next();

    });
}

module.exports.postVerifyToken = async (req, res, next) => {
    const token = req.body.token;
    delete req.body.token;
    if (!token)
        return res.status(401).send(html);

    jwt.verify(token, process.env.JWT_SECRETE_KEY, (err, decoded) => {
        if (err)
            return res.status(401).send(html);

        req.body.UserId = decoded.id;
        next();

    });
}

const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>E-tracker</title>
    <link rel="icon" href="/images/favicon.png">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/1.6.7/axios.min.js"
        integrity="sha512-NQfB/bDaB8kaSXF8E77JjhHG5PM6XVRxvHzkZiwl3ddWCEPBa23T76MuWSwAJdMGJnmQqM0VeY9kFszsrBEFrQ=="
        crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <link rel="stylesheet" href="css/bootstrap.min.css">
    <link rel="stylesheet" href="css/style.css">
</head>
<body class="any-form">
<nav class="navbar navbar-expand-lg bg-dark border-bottom border-body shadow" data-bs-theme="dark">
<div class="container">
    <a class="navbar-brand" id="getHome" href="/home"><span>E</span><span>T</span></a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown"
        aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNavDropdown">
        <ul class="navbar-nav">
            <li class="nav-item">
                <a class="nav-link" href="/expense" id="getExpense">Expense</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" id="getIncome" href="/income" id="getIncome">Income</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="/login" id="username" id="getUser">login</a>
            </li>
        </ul>
    </div>
</div>
</nav>

      <main class="container-fluid d-flex flex-column align-items-center border border-1 py-2">
      <div class="container text-center fw-bold alert alert-danger" role="alert">
        Access Prevented, Please Login
    </div>
    <a href='login' class='btn btn-primary'>Login</a>
      </main>
      <script src="js/bootstrap.bundle.min.js" defer></script>
      <script src="scripts/script.js" defer></script>
</body>
</html>`


