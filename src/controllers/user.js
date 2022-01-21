const {pool} = require('../util/database');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

exports.userLogin = (req, res, next) => {
    const revisit = req.body.revisit;
    let data = {'name': "", 'pwd': "", 'status': true, 'message': 'Login Successfully', 'product_msg': 'none', 'cart': {}};
    if (revisit ===  false) {
        const name = req.body.uname.toLowerCase();
        const pwd = req.body.pwd;
        console.log("???????");
        data['name'] = name;
        data['pwd'] = pwd;
    }


    const sql = 'SELECT * FROM ecom_products.useraccount WHERE name = $1';
    const sql2 = 'SELECT * FROM ecom_products.useraccount WHERE session_id = $1';

    const getOrderId = ` SELECT id FROM
                            ecom_products.userorder
                            WHERE userid = $1
                            AND checkout = false
    `
    const getCartData = ` SELECT * FROM
                            ecom_products.rpurchase INNER JOIN ecom_products.products ON id = productsid
                            AND orderId = $1
    `

    pool.connect()
    .then((client) => {

        function findCartItemProcess() {
            client.query(getOrderId, [data.id])
            .then((result) => {
                console.log(result.rows[0]);
                if (result.rows[0] === undefined) {
                    // no orders
                    data['product_msg'] = 'No Orders';
                    console.log("No orders");
                    res.setHeader('Content-Type', 'application/json');
                    res.json(data);
                    throw({'message': 'No orders'});
                } else {
                    // have existing order
                    console.log("Existing Order available");
                    data['orderId'] = result.rows[0].id;
                    return client.query(getCartData, [data.orderId])
                }
            })
            .then((productResult) => {
                console.log(productResult.rows);
                if (productResult.rows.length === 0) {
                    // no products in cart
                    console.log("No products in cart");
                    data['product_msg'] = 'No Products in cart';
                    res.setHeader('Content-Type', 'application/json');
                    res.json(data);
                } else {
                    // have products in cart
                    console.log("Have products in cart");
                    data['product_msg'] = 'Products in cart';
                    data['cart'] = productResult.rows;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(data);
                }
            })
            .catch(err => {
                console.error(err);
            })
            .finally(() => {
                client.release();
                console.log("FindCartItemProcess ended");
            })
        }

        function noRevisitRoute() {
            client.query(sql, [data.name])
            .then(results => {
                console.log(results.rows[0]);

                if (results.rows[0] === undefined) {
                    data['status'] = false;
                    data['message'] = 'Username does not exist';
                    console.log("User does not exist");

                    console.log("Backend login data: " + data);
                    client.release();
                    res.setHeader('Content-Type', 'application/json');
                    res.json(data);

                } else {
                    // compare pwd
                    bcrypt.compare(data.pwd, results.rows[0].pwd)
                    .then((cmpResult) => {
                        console.log(cmpResult);
                        if (cmpResult) {
                            console.log("Login successfully");
                            data['id'] = results.rows[0].id;

                            res.cookie('meta_id', results.rows[0].session_id);

                            // load cart data if any
                            console.log("Get order ID query");
                            findCartItemProcess();
                            // return client.query(getOrderId, [data.id])

                        } else {
                            data['status'] = false;
                            data['message'] = 'Incorrect password';
                            console.log("Incorrect password");
                            client.release();
                            // console.log("Backend login data: " + data);
                            res.setHeader('Content-Type', 'application/json');
                            res.json(data);
                        }
                    })
                    .catch(err => {console.log(err);});
                }
            })
            .catch(e => console.log("Error in query: \n" + e))
            .finally(() => {

                console.log("GetUserPwd Query successfully ended");
            })
        }

        function yesRevisitRoute() {

            const session_id = req.body.session_id;
            console.log("Session id: " + session_id);
            client.query(sql2, [session_id])
            .then(results => {
                console.log(results.rows[0]);
                data['id'] = results.rows[0].id;
                data['name'] = results.rows[0].name;
                data['pwd'] = results.rows[0].pwd;
                findCartItemProcess();
                // return client.query(getOrderId, [results.rows[0].id])
            })
            .catch(err => {console.log(err);});
        }

        function runLoginProcess() {
            if (revisit === false) {
                noRevisitRoute();
            } else {
                yesRevisitRoute();
            }
        }
        runLoginProcess();
    })
    .catch(e => console.log("Error in connection: \n" + e))

}

exports.userSignup = (req, res, next) => {
    const name = req.body.uname.toLowerCase();
    const pwd = req.body.pwd;
    const data = {'name': name, 'pwd': pwd, 'status': true, 'message': 'Signup Successfully'};

    // encrypt pwd with bcrypt
    const saltRounds = 10;
    bcrypt.hash(pwd, saltRounds)
    .then((hashed) => {
        // insert to database

        const checkValidUserName = `SELECT COUNT(name) FROM ecom_products.useraccount WHERE name = $1`;
        const addUser = `INSERT INTO ecom_products.useraccount (name, pwd, session_id) VALUES ($1, $2, $3)`;
        // pool connect
        pool.connect()
        // console.log(hashed);
        .then((client) => {
            function addUserToDB(query2) {
                // checkUsername
                const session_id = crypto.randomBytes(16).toString('base64');
                console.log("Session id: " + session_id);

                client.query(query2, [name, hashed, session_id])
                .then(results => {
                    console.log(results.rows[0]); // insert successfully or not
                    console.log("Backend signup data: " + data);
                    res.setHeader('Content-Type', 'application/json');
                    res.json(data);

                })
                .catch(e => console.log("Error in query: \n" + e))
                .finally(() => {
                    client.release();
                    console.log("Add User to DB successfully ended");
                });
            }

            function checkUserName(query1) {
                client.query(query1, [name])
                .then(results => {
                    console.log(results); // whether username exists
                    if (results.rows[0].count === '0') {
                        addUserToDB(addUser);

                    } else {
                        data['status'] = false;
                        data['message'] = 'Username already exists';
                        console.log("Username already exists");

                        console.log("Backend signup data: " + data);
                        res.setHeader('Content-Type', 'application/json');
                        res.json(data);
                    }
                })
                .catch(e => {
                    client.release();
                    console.log("Error in query: \n" + e)
                })
                .finally(() => {
                    // client.release();
                    console.log("CheckUserName Query successfully ended");
                });
            }
            checkUserName(checkValidUserName);
        })
        .catch(e => console.log("Error in connection: \n" + e))

    })
    .catch(err => {
        console.error(err);
    })

}
