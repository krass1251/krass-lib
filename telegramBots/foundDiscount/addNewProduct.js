const { getNewPrice } = require('./scraping/getNewPrice');
const fs = require('fs');
const log = require('cllc')();

let state = {
    infoDB: {},
};

/**
 * Set new state
 * @param {object} newState
 */
const setState = newState => {
    state = { ...state, ...newState };
};

const updateBD = () => {
    const newBdDate = JSON.stringify(state.infoDB);

    fs.writeFile('./bd.json', newBdDate, function (err) {
        if (err) return console.log(err);
        log.info('bd.json was updated with new data');
    });
};

const createNewProduct = (link, callback) => {
    getNewPrice(link, price => {
        state.infoDB.products.push({
            id: state.infoDB.products.length,
            name: `product ${state.infoDB.products.length}`,
            link: link,
            prices: [
                {
                    date: new Date(),
                    price: price
                }
            ]
        });
        updateBD();
        console.log(state.userId);
        callback(state.userId, `current price: ${price}`)
    });
}

const getProductID = (link, callback) => {
    let product = state.infoDB.products.find(product => product.link === link);
    if (product === undefined) {
        product = createNewProduct(link, callback);
    } else {
        console.log(state.userId);
        callback(state.userId, `current price: ${product.prices.slice(-1)[0].price}`)
    }
}

const getInfoFromDB = () => {
    try {
        const infoJSON = fs.readFileSync('./bd.json', 'utf8');
        const info = JSON.parse(infoJSON);
        if(info.length) log.info('Info has been successfully received from DB');
        return info;
    } catch (err) {
        console.error(err)
    }
};

const addNewProduct = (info, callback) => {
    const { userId, link } = info;
    console.log(userId);
    setState({
        infoDB: getInfoFromDB(),
        userId,
    });
    const productID = getProductID(link, callback);
};

// addNewProduct();
module.exports = { addNewProduct };