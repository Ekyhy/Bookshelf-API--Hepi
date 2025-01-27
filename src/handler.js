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
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

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
      insertedAt,
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
    const {bookId} = request.params;
    let book = books.find((book) => book.id === bookId);
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
const editBookByIdHandler =  (request, h) =>{
  const {bookId} = request.params;
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

  const updatedAt = new Date().toISOString();
  if (name === undefined) {
      const response = h.response({
          status: 'fail',
          message: 'Gagal memperbarui buku. Mohon isi nama buku',
      });
      response.code(400);
      return response;
  } else if (readPage > pageCount) {
      const response = h.response({
          status: 'fail',
          message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      });
      response.code(400);
      return response;
  }
  //129-143 pengkondisian jika ID tidak memiliki nama book atau readPage nilainya lebih besar dari pageCount maka dianggap gagal/fail

  const index = books.findIndex((book) => book.id === bookId);
  if (index !== -1) {
      books[index] = {
          ...books[index],
          name,
          year,
          author,
          summary,
          publisher,
          pageCount,
          readPage,
          reading,
          updatedAt,
      };
      const response = h.response({
          status:'success',
          message:'Buku berhasil diperbarui',
      });
      response.code(200);
      return response;
  } else {
      const response = h.response({
          status:'fail',
          message:'Gagal memperbarui buku. Id tidak ditemukan',
      });
      response.code(404);
      return response;
  }
  //147-173 membuat kondisi jika ID ditemukan maka edit berhasil, jika ID tidak berhasil ditemukan maka gagal
};

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
      books.splice(index,1);
      const response = h.response({
          status: 'success',
          message: 'Buku berhasil dihapus'
      });
      response.code(200);
      return response;
  } else {
      const response = h.response({
          status:'fail',
          message:'Buku gagal dihapus. Id tidak ditemukan',
      });
      response.code(404);
      return response;
  }
  //182-197 membuat kondisi statement jika ID ditemukan makan bisa terhapus, dan jika ID tidak ditemukan maka gagal
};

module.exports = { addBooksHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler };
