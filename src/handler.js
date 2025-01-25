const { nanoid } = require('nanoid');
const books = require('./books');

const addBooksHandler = (request, h) => {
    const {
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
    } = request.payload;
    console.log(request.payload);
  
    const id = nanoid(16);
    const finished = readPage === pageCount;
    const insertAt = new Date().toISOString();
    const updatedAt = insertAt;

    // Periksa apakah nama buku ada atau tidak
    if (!name) {
      const response = h.response({
        status: "fail",
        message: "Gagal menambahkan buku. Mohon isi nama buku",
      });
      response.code(400);
      return response;
    }
  
  
    // Periksa apakah readPage lebih besar dari pageCount
    if (readPage > pageCount) {
      const response = h.response({
        status: "fail",
        message: "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
      });
      response.code(400);
      return response;
    }
  
    
    const newBook = {
    id,
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      insertAt,
      updatedAt,
    };
  
    books.push(newBook);
  
  
    const isSuccess = books.filter((book) => book.id === id).length > 0;
  
    if (isSuccess) {
      const response = h.response({
        status: "success",
        message: "Buku berhasil ditambahkan",
        data: {
          bookId: id,
        },
      });
      response.code(201);
      return response;
    }
  
    // Tambahkan kasus jika buku tidak berhasil ditambahkan (fallback)
    const response = h.response({
      status: "fail",
      message: "Buku gagal ditambahkan",
    });
    response.code(500);
    return response;
  };
//  pembuatan API untuk menyimpan buku dengan ID unik dan beberapa properti

const getAllBooksHandler = (request, h) => {
    const { reading, finished } = request.query;

    let filterBooks = books;
    if (reading !== undefined) {
      const isReading = reading === 'true';
      filterBooks = filterBooks.filter((book) => book.reading === isReading);
    }
    if (finished !== undefined) {
      const isFinished = finished === 'true';
      filterBooks = filterBooks.filter((book) => book.finished === isFinished);
    }
    console.log('Filtered Books:', filterBooks);
  
  
    const response = h.response({
      status: "success",
      data: {
        books: filterBooks.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
        })),
      },
    });
    response.code(200);
    return response;

};
const getBookByIdHandler = (request, h) => {
    const { id } = request.params;
    let book = books.find((book) => book.id === id)[0];
    if (book) {
        const response = h.response({
            status: 'success',
            data:{
                book,
            }
        });
        response.code(200);
        return response;
    } else {
        const response = h.response ({
            status: 'fail',
            message: 'Buku tidak ditemukan',
        });
        response.code(404);
        return response;
    }
//membuat kondisi jika variable book sudah memiliki nilai maka berhasil, dan jika variable book kosong akan bernilai gagal/fail
};
//membuat API untuk mendapatkan book sesuai dengan ID yang telah diterima book

module.exports = { addBooksHandler, getAllBooksHandler, getBookByIdHandler, };
