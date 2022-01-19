
const {pool} = require('../util/database');
const {getProduct} = require('./preview');

exports.loadIndex = (req, res, next) => {
    // console.log(__dirname);
    const data = {};
    // get 4 highest quantity from products
    const bestSellers = 'SELECT * FROM ecom_products.products ORDER BY quantity DESC LIMIT 4';
    const topRated = 'SELECT * FROM ecom_products.products ORDER BY rating DESC LIMIT 4';
    const newProducts = 'SELECT * FROM ecom_products.products ORDER BY inserteddate DESC LIMIT 20';
    const topDeals = 'SELECT * FROM ecom_products.products ORDER BY price LIMIT 6';

    pool.connect()
    .then((client) => {
        function getBestSellers() {
            client.query(bestSellers)
            .then((result) => {
                // console.log(result.rows);
                data['bestSellers'] = result.rows
                // client.release();
                getTopRated();
            })
            .catch((err) => {
                console.log(err);
                client.release();
            });
        }

        function getTopRated() {
            client.query(topRated)
            .then((result) => {
                // console.log(result.rows);
                data['topRated'] = result.rows;
                getNewProducts();
            })
            .catch((err) => {
                console.log(err);
                client.release();
            });
        }

        function getNewProducts() {
            client.query(newProducts)
            .then((result) => {
                // console.log(result.rows);
                data['newProducts'] = result.rows
                getTopDeals();
            })
            .catch((err) => {
                console.log(err);
                client.release();
            });
        }

        function getTopDeals() {
            client.query(topDeals)
            .then((result) => {
                // console.log(result.rows);
                data['topDeals'] = result.rows
                client.release();
                // console.log(data);
                res.render('index', {'data': data});
            })
            .catch((err) => {
                console.log(err);
                client.release();
            });
        }
        getBestSellers();

    })
    .catch((err) => {
        console.log(err);
    });
}

exports.loadPage = (req, res, next) => {
    let page = req.params.page;
    let count;

    let data;
    // console.log(page);
    if (page !== "favicon.ico"){
        // connect db
        // res.render(req.params.page);
        if (page === 'preview') {
            let product = getProduct();
            console.log(product);
            res.render(page, {'product': product[0]});   // preview page
        }
        else {

            pool.connect()
            .then((client) => {
                function getCategoryProducts(query1, query2) {
                    // console.log(page);
                    return client.query(query1, [page])
                    .then(results => {
                        // client.release();
                        console.log("Num of result: " + results.rows[0].count);
                        count = parseInt(results.rows[0].count);
                        data = {'count': 7, 'results': count, 'page_name': page};
                        return client.query(query2, [page])
                    })
                    .then(results => {
                        data['rows'] = results.rows;
                        // console.log(data);
                        console.log("Length is : " + data['rows'].length);
                        res.render('category', {data: data});
                        return;
                    })
                    .catch(e => console.log("Error in query: \n" + e))
                    .finally(() => {
                        client.release();
                        console.log("Connection ended");
                    });
                }
                function getAllProducts(query1, query2) {
                    // console.log(page);
                    return client.query(query1)
                    .then(results => {
                        // client.release();
                        console.log("Num of result: " + results.rows[0].count);
                        count = parseInt(results.rows[0].count);
                        data = {'count': 7, 'results': count, 'page_name': page};
                        return client.query(query2)
                    })
                    .then(results => {
                        data['rows'] = results.rows;
                        // console.log(data);
                        console.log("Length is : " + data['rows'].length);
                        res.render('category', {data: data});
                        return;
                    })
                    .catch(e => console.log("Error in query: \n" + e))
                    .finally(() => {
                        client.release();
                        console.log("Connection ended");
                    });
                }
                let query1 = `SELECT COUNT(*) FROM ecom_products.products
                                 WHERE category = $1`;
                let query2 = `SELECT * FROM ecom_products.products
                                    WHERE category = $1`;
                if (page === 'all') {
                    console.log("here");
                    query1 = `SELECT COUNT(*) FROM ecom_products.products`;
                    query2 = `SELECT * FROM ecom_products.products`;
                    getAllProducts(query1, query2);
                } else {
                    getCategoryProducts(query1, query2);
                }
                return;
            })
            .catch(e => console.log("Error in connection: \n" + e));
        }

    }
}
