// const {getDB} = require('../util/database');
// const {client} = require('../util/database');
const {pool} = require('../util/database');

exports.checkout = (req, res, next) => {
    
    console.log("Checkout backend");
    console.log(req.query);
    console.log(req.params);

    const findUser = 'SELECT id FROM ecom_products.useraccount WHERE session_id = $1';
    const searchOrder = 'SELECT id FROM ecom_products.userorder WHERE userId = $1 AND checkout = false';
    let data = {'status': 0, 'message': 'No message'};
    res.setHeader('Content-Type', 'application/json');

    pool.connect()
    .then((client) => {
        client.query(findUser, [req.params.id])
        .then((result) => {
            if (result.rows[0] === undefined) {
                // no such id;
                console.log("Session Id not found");
                data.message = "Session Id not found";
                data.status = 1;
                client.release();
                res.json(data);
                
            } else {
                client.query(searchOrder, [result.rows[0].id])
                .then((result) => {
                    if (result.rows[0] === undefined) {
                        console.log("No valid order found");
                        data.message = "No valid order found";
                        client.release();
                        data.status = 2;
                        res.json(data);
                    } else {
                        const updateOrder = 'UPDATE ecom_products.userorder SET checkout = true WHERE id = $1';
                        client.query(updateOrder, [result.rows[0].id])
                        .then((result) => {
                            console.log("Order status updated to checkout: true");
                            data.message = "Checkout backend successful";
                            client.release();

                            res.json(data);
                        })
                        .catch((err) => {console.log(err)})
                    }
                })
                .catch((err) => {console.log(err)})
            }
        })
        .catch((err) => {console.log(err)})
    })
    .catch((err) => {console.log(err)})
};

exports.addToCart = (req, res, next) => {
    console.log("Add to cart backend");
    console.log(req.query);
    console.log(req.params);
    // res.header('Content-Type', 'application/json');
    // res.json({'status': '200'});
    let data = {};
    let returnData = {'status': true, 'message': 'No message', 'new_order': false, 'item_exist': false};
    data.productId = req.params.id;

    const findUser = 'SELECT id FROM ecom_products.useraccount WHERE session_id = $1';
    const searchOrder = 'SELECT id FROM ecom_products.userorder WHERE userId = $1 AND checkout = false';
    const orderCreate = 'INSERT INTO ecom_products.userorder (userId, checkout) VALUES ($1, false) RETURNING id';
    const purchaseItemExists = 'SELECT 1 FROM ecom_products.rpurchase WHERE orderId = $1 AND productsId = $2'; // update item 
    const updatePurchaseItem = 'UPDATE ecom_products.rpurchase SET pquantity = pquantity + 1 WHERE orderId = $1 AND productsId = $2'; // update item
    const addPurchaseItem = 'INSERT INTO ecom_products.rpurchase (orderId, productsId, pquantity) VALUES ($1, $2, $3)'; // add item
    pool.connect()
    .then((client) => {
        
        function updatePurchase() {
            client.query(updatePurchaseItem, [data.orderId, data.productId])
            .then(results => {
                console.log("Update purchase item quantity");
                console.log(results.rows[0]);
                returnData.message = "Update purchase item quantity successfully";

                client.release();

                res.setHeader('Content-Type', 'application/json');
                res.json(returnData);
            })
            .catch(e => console.log("Error in query: \n" + e))
        }

        function addToPurchase() {
            client.query(addPurchaseItem, [data.orderId, data.productId, 1])
            .then(results => {
                console.log(results.rows[0]);
                console.log("Add to rpurchase");
                returnData.message = "Add purchase item successfully";

                client.release();

                res.setHeader('Content-Type', 'application/json');
                res.json(returnData);
            })
            .catch(e => console.log("Error in query: \n" + e))
        }

        function checkItemExists() {
            return client.query(purchaseItemExists, [data.orderId, data.productId])
            .then(results => {
                if (results.rows[0] === undefined) {
                    addToPurchase();
                } else {
                    data.item_exist = true;
                    updatePurchase();
                }
            })
            .catch(e => console.log("Error in query: \n" + e))
        }

        function createOrder() {
            client.query(orderCreate, [data.userId])
            .then(results => {
                data.orderId = results.rows[0].id;
                console.log("Order created: " + data.orderId);
                addToPurchase();
            })
            .catch(e => console.log("Error in query: \n" + e))

        }

        function getOrder() {
            client.query(searchOrder, [data.userId])
            .then(results => {
                if (results.rows[0] === undefined) {
                    console.log("No existing order found");
                    returnData.new_order = true;
                    createOrder();

                } else {
                    data.orderId = results.rows[0].id;
                    console.log("Order found: " + data.orderId);
                    returnData.new_order = false;
                    checkItemExists();
                }
            })
            .catch(e => console.log("Error in query: \n" + e))
        }

        function getUser() {
            client.query(findUser, [req.query.meta_id])
            .then(results => {
                if (results.rows[0] === undefined) {
                    // logout
                    console.log('Cannot find user');
                    returnData.status = false;
                    returnData.message = 'Cannot find User';
                    client.release();

                    res.setHeader('Content-Type', 'application/json');
                    res.json(returnData);
                } else {
                    data.userId = results.rows[0].id;
                    getOrder();
                }
            })
            .catch(e => console.log("Error in query: \n" + e))
 
        }

        getUser();
    })
    .catch(e => console.log("Error in connection: \n" + e));

}


exports.loadClothings = (req, res, next) => {
    // req.header('Content-Type')  // "application/json"
    // req.header('user-agent')    // "Mozilla/5.0 (Macintosh Intel Mac OS X 10_8_5) AppleWebKi..."
    // req.header('Authorization')
    res.setHeader('Content-Type', 'application/json');
    // console.log("Request: " + req.header('user-agent'));
    const data = req.body;
    const amount = data.amount;
    const id = data.id;
    console.log("Amount: " + amount);
    console.log("Id: " + id);

    // console.log("Request value: " + req.body.id);
    console.log("Request param: " + req.params.category);
    // get request if any
    // return res.json({'message': 'cannot'});

    pool.connect()
    .then((client) => {
        // return {'message': 'canget'}
        function getAllProducts(query) {
            // return ({'message': 'canget'})
            // return client.query(query)
            return client.query(query, [id, amount])
            .then(results => {
                // client.release();
                let result = results.rows;
                // console.log(result);
                return result;
            })
            .then(result => {
                res.setHeader('Content-Type', 'application/json');
                res.json(result);
            })
            .catch(e => console.log("Error in query: \n" + e))
            .finally(() => {
                client.release();
                console.log("Connection ended");
            });
        }

        function getCategoryProducts(query) {
            // return ({'message': 'canget'})
            // return client.query(query)
            return client.query(query, [req.params.category, id, amount])
            .then(results => {
                // client.release();
                let result = results.rows;
                // console.log(result);
                return result;
            })
            .then(result => {
                res.setHeader('Content-Type', 'application/json');
                res.json(result);
            })
            .catch(e => console.log("Error in query: \n" + e))
            .finally(() => {
                client.release();
                console.log("Connection ended");
            });
        }
        let query = `SELECT * FROM ecom_products.products
                        WHERE category = $1
                        AND id >= $2
                        ORDER BY id ASC
                        LIMIT $3`
        if (req.params.category === 'all') {
            query = `SELECT * FROM ecom_products.products
                        WHERE id >= $1
                        ORDER BY id ASC
                        LIMIT $2`
            getAllProducts(query);
        } else {
            getCategoryProducts(query);
        }
        return;
    })
    .catch(e => console.log("Error in connection: \n" + e)); 
    // res.render(req.params.page);
    // res.json(result);

}
