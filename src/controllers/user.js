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
