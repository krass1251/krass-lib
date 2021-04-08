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

const getProductID = link => {
    const product = state.products.find(product => product.link === link);
    if (product === undefined) {
        createNewProduct();
    }
}

const getInfoFromDB = () => {
    try {
        const infoJSON = fs.readFileSync('./bd.json', 'utf8');
        const info = JSON.parse(infoJSON);
        if(products.length) log.info('Info has been successfully received from DB');
        return info;
    } catch (err) {
        console.error(err)
    }
};

const addNewProduct = (info, callback) => {
    const { userId, link } = info;
    setState({ infoDB: getInfoFromDB() });
    const productID = getProductID(link);
};

// addNewProduct();
module.exports = { addNewProduct };