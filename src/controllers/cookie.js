const {pool} = require('../util/database');

exports.removeCookie = (req, res, next) => {

    res.clearCookie('meta_id');
    res.header('Content-Type', 'application/json');
    res.json({'status': 'ok'})
};

exports.getCookie = (req, res, next) => {
    // console.log("get cookie");
    console.log(req.valid);
    if (req.valid) {
        console.log("Cookie valid: " + req.cookies.meta_id);
        res.setHeader('Content-Type', 'application/json');
        res.json({'meta_id': req.cookies.meta_id});
    } else { 
        console.log("Cookie not valid or not found ");
        res.setHeader('Content-Type', 'application/json');
        res.json({'meta_id': null});
    }
}

exports.validateCookies = (req, res, next) => {
    // console.log(1);
    const { cookies } = req;
    console.log(cookies);
    if ('meta_id' in cookies) {
        console.log("Cookies exists");
        // check if meta_id exists in DB
        const sql = 'SELECT 1 FROM ecom_products.useraccount WHERE session_id = $1';
        pool.connect()
        .then((client) => {
            client.query(sql, [cookies.meta_id])
            .then(results => {
                if (results.rows[0] === undefined) {
                    console.log("Cookies not valid");
                    res.clearCookie('meta_id');
                    // res.redirect('/login');
                    next();
                } else {
                    console.log("Cookies valid");
                    req.valid = true;
                    next();

                }
            })
            .catch(e => console.log("Error in query: \n" + e))
            .finally(() => {
                client.release();
                console.log("ValidateCookies Query successfully ended");
            })
        })
        .catch(e => console.log("Error in connection: \n" + e))

    } else {
        console.log('no cookies found');
        req.valid = false;
        next();
    }
}
