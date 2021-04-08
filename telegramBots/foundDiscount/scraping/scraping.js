const fs = require('fs')
const { getNewPrice } = require('./getNewPrice');
const log = require('cllc')();


let state = {
    products: [],
    currentDate: new Date(),
};

/**
 * Set new state
 * @param {object} newState
 */
const setState = newState => {
    state = { ...state, ...newState };
};

const getProducts = () => {
    try {
        const productsJSON = fs.readFileSync('./bd.json', 'utf8');
        const products = JSON.parse(productsJSON).products;
        if(products.length) log.info('Products has been successfully received from DB');
        return products;
    } catch (err) {
        console.error(err)
    }
};

const getUsers = () => {
    try {
        const usersJSON = fs.readFileSync('./bd.json', 'utf8');
        const users = JSON.parse(usersJSON).users;
        if(users.length) log.info('Users has been successfully received DB');
        return users;
    } catch (err) {
        console.error(err)
    }
};

const updateAllPrice = (callback) => {
    const products = state.products.slice();
    log.start('Successfully received %s pages');
    products.forEach(product => {
        getNewPrice(product.link, function (newPrice) {
            log.step();
            const lastPrice = product.prices.slice(-1)[0].price;
            if (newPrice !== lastPrice) {
                log.info(`For product ${product.id} new price has been found = ${newPrice}`);
                log.info(`Old price = ${lastPrice}`);
                product.prices.push({
                    date: state.currentDate,
                    price: newPrice,
                });
                setState({ products });
                sendProductNotify(product, callback);
                updateBD();
            }
        });
    });
};

const sendProductNotify = (product, callback) => {
    const usersWithProduct = state.users.filter( user => user.productsId.includes(product.id));
    const productName = `Product: ${product.name}`;
    const oldPrice = `Old price: ${product.prices.slice(-2, -1)[0].price}`;
    const newPrice = `New price: ${product.prices.slice(-1)[0].price}`;
    const link = `Link: ${product.link}`;

    const message = `${productName}\n${oldPrice}\n${newPrice}\n${link}`;
    log(usersWithProduct)

    usersWithProduct.forEach(user => {
        callback(user.chatId, message)
    });
};



const updateBD = () => {
    const newBdDate = JSON.stringify({
        users: state.users,
        products: state.products,
    });

    fs.writeFile('./bd.json', newBdDate, function (err) {
        if (err) return console.log(err);
        log.info('bd.json was updated with new data');
    });
};

const runScraping = (callback) => {
    setState({
        products: getProducts(),
        users: getUsers(),
    });
    updateAllPrice(callback);
};

// runScraping();
// console.log(state);
module.exports = { runScraping };
