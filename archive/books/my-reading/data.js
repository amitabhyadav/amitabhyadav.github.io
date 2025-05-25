// Sample reading data
const readingData = [
    { date: "2024-06-02", minutes: 45, pages: 20, book: "Book8", author: "Author 2", genre: "Fiction", status: "completed" },
    { date: "2024-05-20", minutes: 10, pages: 4, book: "Book8", author: "Author 2", genre: "Fiction", status: "reading" },
    { date: "2024-05-02", minutes: 50, pages: 28, book: "Book8", author: "Author 2", genre: "Fiction", status: "reading" },
    { date: "2024-04-10", minutes: 60, pages: 32, book: "Book8", author: "Author 2", genre: "Fiction", status: "started"},
    { date: "2024-03-30", minutes: 20, pages: 8, book: "Book 5", author: "Author 5", genre: "Fiction", status: "completed" },
    { date: "2024-03-04", minutes: 80, pages: 50, book: "Book 6", author: "Author 6", genre: "History", status: "completed" },
    { date: "2024-02-04", minutes: 45, pages: 20, book: "Book 6", author: "Author 6", genre: "History", status: "reading" },
    { date: "2024-01-10", minutes: 8, pages: 4, book: "Book 6", author: "Author 6", genre: "History", status: "started" },
    { date: "2023-12-12", minutes: 20, pages: 8, book: "Book 5", author: "Author 5", genre: "Fiction", status: "reading" },
    { date: "2023-12-01", minutes: 20, pages: 8, book: "Book 5", author: "Author 5", genre: "Fiction", status: "started" },
    { date: "2023-11-01", minutes: 20, pages: 8, book: "Book 4", author: "Author 4", genre: "History", status: "completed" },
    { date: "2023-10-02", minutes: 45, pages: 20, book: "Book 4", author: "Author 4", genre: "History", status: "reading" },
    { date: "2023-09-02", minutes: 8, pages: 4, book: "Book 4", author: "Author 4", genre: "History", status: "started" },
    { date: "2023-08-20", minutes: 60, pages: 32, book: "Book 1", author: "Author 1", genre: "Biography", status: "completed" },
    { date: "2023-08-02", minutes: 20, pages: 6, book: "Book 1", author: "Author 1", genre: "Biography", status: "reading" },
    { date: "2023-07-02", minutes: 50, pages: 24, book: "Book 1", author: "Author 1", genre: "Biography", status: "started" },
    { date: "2023-06-01", minutes: 20, pages: 8, book: "Book 3", author: "Author 3", genre: "Non-Fiction", status: "completed" },
    { date: "2023-05-02", minutes: 45, pages: 20, book: "Book 3", author: "Author 3", genre: "Non-Fiction", status: "reading" },
    { date: "2023-04-02", minutes: 10, pages: 4, book: "Book 3", author: "Author 3", genre: "Non-Fiction", status: "reading" },
    { date: "2023-02-02", minutes: 60, pages: 32, book: "Book 3", author: "Author 3", genre: "Non-Fiction", status: "reading" },
    { date: "2023-01-01", minutes: 50, pages: 24, book: "Book 3", author: "Author 3", genre: "Non-Fiction", status: "started"},
    { date: "2022-05-02", minutes: 45, pages: 20, book: "Book 2", author: "Author 2", genre: "Fiction", status: "completed" },
    { date: "2022-04-02", minutes: 10, pages: 4, book: "Book 2", author: "Author 2", genre: "Fiction", status: "reading" },
    { date: "2022-03-20", minutes: 50, pages: 28, book: "Book 2", author: "Author 2", genre: "Fiction", status: "reading" },
    { date: "2022-02-02", minutes: 60, pages: 32, book: "Book 2", author: "Author 2", genre: "Fiction", status: "started"},
    { date: "2022-01-02", minutes: 45, pages: 20, book: "Book 9", author: "Author 7", genre: "Fiction", status: "completed" },
    { date: "2021-12-02", minutes: 10, pages: 4, book: "Book 9", author: "Author 7", genre: "Fiction", status: "reading" },
    { date: "2021-11-20", minutes: 50, pages: 28, book: "Book 9", author: "Author 7", genre: "Fiction", status: "reading" },
    { date: "2021-10-02", minutes: 60, pages: 32, book: "Book 9", author: "Author 7", genre: "Fiction", status: "started"},
    { date: "2021-09-02", minutes: 45, pages: 20, book: "Book 7", author: "Author 7", genre: "Fiction", status: "completed" },
    { date: "2021-08-02", minutes: 10, pages: 4, book: "Book 7", author: "Author 7", genre: "Fiction", status: "reading" },
    { date: "2021-07-20", minutes: 50, pages: 28, book: "Book 7", author: "Author 7", genre: "Fiction", status: "reading" },
    { date: "2021-06-02", minutes: 60, pages: 32, book: "Book 7", author: "Author 7", genre: "Fiction", status: "started"},
    { date: "2021-05-02", minutes: 45, pages: 20, book: "The Emperor of all Maladies: A biography of Cancer", author: "Siddhartha Mukherjee", genre: "Fiction", status: "completed" },
    { date: "2021-04-02", minutes: 10, pages: 4, book: "The Emperor of all Maladies: A biography of Cancer", author: "Siddhartha Mukherjee", genre: "Fiction", status: "reading" },
    { date: "2021-03-20", minutes: 50, pages: 28, book: "The Emperor of all Maladies: A biography of Cancer", author: "Siddhartha Mukherjee", genre: "Fiction", status: "reading" },
    { date: "2021-02-02", minutes: 60, pages: 32, book: "The Emperor of all Maladies: A biography of Cancer", author: "Siddhartha Mukherjee", genre: "Fiction", status: "started"},
    // ... more data ...
];

// Wishlist data
const wishlistData = [
    { book: "Book 2", author: "Author 2", genre: "Fiction" },
    // ... more data ...
];