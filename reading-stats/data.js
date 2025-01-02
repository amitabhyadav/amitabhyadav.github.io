// Sample reading data
// Rules: Add new entry to top, increment dates in order per new line i.e. not jumbled, first status of book must be 'started' when adding a new book to reading logs, last one must be 'completed' when the book finishes, and all middle ones must be 'reading'. you can add a new book in between with the started/reading/completed tags - this will show an overlap in the plot, which is fine if you are doing simultaneously reading two books. It is not recommended to mark a book as completed unless finished or you abandoned it for good.
const readingData = [
    // ... add new data here ...
    //{ date: "2025-01-03", minutes: 175, pages: 60, book: "The Education of an Idealist", author: "Samantha Power", genre: "Memoir", status: "completed", 'url-book': 'https://www.goodreads.com/book/show/42872088-the-education-of-an-idealist', 'url-author': 'https://www.goodreads.com/author/show/13271.Samantha_Power' },
    { date: "2025-01-03", minutes: 142, pages: 60, book: "The Education of an Idealist", author: "Samantha Power", genre: "Memoir", status: "reading", 'url-book': 'https://www.goodreads.com/book/show/42872088-the-education-of-an-idealist', 'url-author': 'https://www.goodreads.com/author/show/13271.Samantha_Power' },
    { date: "2025-01-02", minutes: 26, pages: 11, book: "The Education of an Idealist", author: "Samantha Power", genre: "Memoir", status: "reading", 'url-book': 'https://www.goodreads.com/book/show/42872088-the-education-of-an-idealist', 'url-author': 'https://www.goodreads.com/author/show/13271.Samantha_Power' },
    { date: "2025-01-01", minutes: 109, pages: 51, book: "The Education of an Idealist", author: "Samantha Power", genre: "Memoir", status: "started", 'url-book': 'https://www.goodreads.com/book/show/42872088-the-education-of-an-idealist', 'url-author': 'https://www.goodreads.com/author/show/13271.Samantha_Power' },
];

// Wishlist data
const wishlistData = [
    { book: "Guns, Germs and Steel: A Short History of Everybody for the Last 13,000 Years", author: "Jared Diamond", genre: "History", 'url-book': 'https://www.goodreads.com/book/show/430146.Guns_Germs_and_Steel', 'url-author': 'https://www.goodreads.com/author/show/256.Jared_Diamond'},
    // ... more data ...
];
