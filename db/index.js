let data;
exports.connect = () => {
    data = require('./data.json');
}
 
exports.getCollectionByIndex = (index) => {
    return data[index] || null;
};
