const path = require("path");
const {
    addBooksHandler,
    getAllBooksHandler,
    getBookByIdHandler,
}  = require("./handler.js");
const { request } = require("http");


const routes = [
    {
        method: 'POST',
        path: '/books',
        handler : addBooksHandler,
    },
    {
        method: 'GET',
        path: '/books',
        handler: getAllBooksHandler,
    },
    {
        method: 'GET',
        path: '/books/{id}',
        handler: getBookByIdHandler,
    },
];

module.exports = routes;