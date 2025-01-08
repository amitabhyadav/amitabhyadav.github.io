// My reading data file
// Rules: Add new entry to top, increment dates in order per new line i.e. not jumbled, first status of book must be 'started' when adding a new book to reading logs, last one must be 'completed' when the book finishes, and all middle ones must be 'reading'. you can add a new book in between with the started/reading/completed tags - this will show an overlap in the plot, which is fine if you are doing simultaneously reading two books. It is not recommended to mark a book as completed unless finished or you abandoned it for good.
const readingData = [
    // ... add new data here ...
    //{ date: "2025-01-03", minutes: 175, pages: 60, venue: "Home", location: "Geneva, Switzerland", book: "The Education of an Idealist", author: "Samantha Power", booktype: "Paperback", genre: "Memoir", status: "completed", 'url-book': 'https://www.goodreads.com/book/show/42872088-the-education-of-an-idealist', 'url-author': 'https://www.goodreads.com/author/show/13271.Samantha_Power', totalpages: 558 },
    //{ date: "2025-01-08", minutes: 20, pages: 7, venue: "Office", location: "Geneva, Switzerland", book: "The Brothers Karamazov", author: "Fyodor Dostoevsky", booktype: "Audiobook", genre: "Fiction", status: "started", 'url-book': 'https://www.goodreads.com/book/show/4934.The_Brothers_Karamazov', 'url-author': 'https://www.goodreads.com/author/show/3137322.Fyodor_Dostoevsky', totalpages: 796 },    // 1 min = 0.3138 pages (total time: 42h16m)
    { date: "2025-01-08", minutes: 43, pages: 20, venue: "Home", location: "Geneva, Switzerland", book: "The Education of an Idealist", author: "Samantha Power", booktype: "Paperback", genre: "Memoir", status: "reading", 'url-book': 'https://www.goodreads.com/book/show/42872088-the-education-of-an-idealist', 'url-author': 'https://www.goodreads.com/author/show/13271.Samantha_Power', totalpages: 558 },    
    { date: "2025-01-07", minutes: 40, pages: 18, venue: "Home", location: "Geneva, Switzerland", book: "The Education of an Idealist", author: "Samantha Power", booktype: "Paperback", genre: "Memoir", status: "reading", 'url-book': 'https://www.goodreads.com/book/show/42872088-the-education-of-an-idealist', 'url-author': 'https://www.goodreads.com/author/show/13271.Samantha_Power', totalpages: 558 },    
    { date: "2025-01-06", minutes: 28, pages: 13, venue: "Office", location: "Geneva, Switzerland", book: "The Education of an Idealist", author: "Samantha Power", booktype: "Paperback", genre: "Memoir", status: "reading", 'url-book': 'https://www.goodreads.com/book/show/42872088-the-education-of-an-idealist', 'url-author': 'https://www.goodreads.com/author/show/13271.Samantha_Power', totalpages: 558 },    
    { date: "2025-01-05", minutes: 30, pages: 13, venue: "Home", location: "Geneva, Switzerland", book: "The Education of an Idealist", author: "Samantha Power", booktype: "Paperback", genre: "Memoir", status: "reading", 'url-book': 'https://www.goodreads.com/book/show/42872088-the-education-of-an-idealist', 'url-author': 'https://www.goodreads.com/author/show/13271.Samantha_Power', totalpages: 558 },    
    { date: "2025-01-04", minutes: 67, pages: 26, venue: "Home", location: "Geneva, Switzerland", book: "The Education of an Idealist", author: "Samantha Power", booktype: "Paperback", genre: "Memoir", status: "reading", 'url-book': 'https://www.goodreads.com/book/show/42872088-the-education-of-an-idealist', 'url-author': 'https://www.goodreads.com/author/show/13271.Samantha_Power', totalpages: 558 },        
    { date: "2025-01-03", minutes: 75, pages: 34, venue: "Train", location: "Geneva, Switzerland", book: "The Education of an Idealist", author: "Samantha Power", booktype: "Paperback", genre: "Memoir", status: "reading", 'url-book': 'https://www.goodreads.com/book/show/42872088-the-education-of-an-idealist', 'url-author': 'https://www.goodreads.com/author/show/13271.Samantha_Power', totalpages: 558 },
    { date: "2025-01-02", minutes: 26, pages: 11, venue: "Home", location: "Geneva, Switzerland", book: "The Education of an Idealist", author: "Samantha Power", booktype: "Paperback", genre: "Memoir", status: "reading", 'url-book': 'https://www.goodreads.com/book/show/42872088-the-education-of-an-idealist', 'url-author': 'https://www.goodreads.com/author/show/13271.Samantha_Power', totalpages: 558 },
    { date: "2025-01-01", minutes: 109, pages: 51, venue: "Flight", location: "Athens, Greece", book: "The Education of an Idealist", author: "Samantha Power", booktype: "Paperback", genre: "Memoir", status: "started", 'url-book': 'https://www.goodreads.com/book/show/42872088-the-education-of-an-idealist', 'url-author': 'https://www.goodreads.com/author/show/13271.Samantha_Power', totalpages: 558 },
];


// Wishlist data
const wishlistData = [
    { book: "Guns, Germs and Steel: A Short History of Everybody for the Last 13,000 Years", author: "Jared Diamond", booktype: "Paperback", genre: "History", 'url-book': 'https://www.goodreads.com/book/show/430146.Guns_Germs_and_Steel', 'url-author': 'https://www.goodreads.com/author/show/256.Jared_Diamond'},
    { book: "The Art of Statistics", author: "David Spiegelhalter", booktype: "Paperback", genre: "Non-Fiction", 'url-book': 'https://www.goodreads.com/book/show/39813845-the-art-of-statistics', 'url-author': 'https://www.goodreads.com/author/show/1126543.David_Spiegelhalter'},
    { book: "A Curious History of Sex", author: "Kate Lister", booktype: "Paperback", genre: "Non-Fiction", 'url-book': 'https://www.goodreads.com/book/show/50773748-a-curious-history-of-sex', 'url-author': 'https://www.goodreads.com/author/show/20022921.Kate_Lister'},
    { book: "Human Acts", author: "Han Kang", booktype: "Paperback", genre: "Fiction", 'url-book': 'https://www.goodreads.com/book/show/30091914-human-acts', 'url-author': 'https://www.goodreads.com/author/show/4119155.Han_Kang'},
    { book: "The Vegetarian", author: "Han Kang", booktype: "Paperback", genre: "Fiction", 'url-book': 'https://www.goodreads.com/book/show/25489025-the-vegetarian', 'url-author': 'https://www.goodreads.com/author/show/4119155.Han_Kang'},
    { book: "Dune (#1)", author: "Frank Herbert", booktype: "Paperback", genre: "Sci-Fi", 'url-book': 'https://www.goodreads.com/book/show/25772375-dune', 'url-author': 'https://www.goodreads.com/author/show/58.Frank_Herbert'},
    { book: "Dune: Messiah (#2)", author: "Frank Herbert", booktype: "Paperback", genre: "Sci-Fi", 'url-book': 'https://www.goodreads.com/book/show/34326633-dune-messiah', 'url-author': 'https://www.goodreads.com/author/show/58.Frank_Herbert'},
    { book: "Children of Dune (#3)", author: "Frank Herbert", booktype: "Paperback", genre: "Sci-Fi", 'url-book': 'https://www.goodreads.com/book/show/11323606-children-of-dune', 'url-author': 'https://www.goodreads.com/author/show/58.Frank_Herbert'},
    { book: "God Emperor of Dune (#4)", author: "Frank Herbert", booktype: "Paperback", genre: "Sci-Fi", 'url-book': 'https://www.goodreads.com/book/show/44439415-god-emperor-of-dune', 'url-author': 'https://www.goodreads.com/author/show/58.Frank_Herbert'},
    { book: "Heretics of Dune (#5)", author: "Frank Herbert", booktype: "Paperback", genre: "Sci-Fi", 'url-book': 'https://www.goodreads.com/book/show/44492287-heretics-of-dune', 'url-author': 'https://www.goodreads.com/author/show/58.Frank_Herbert'},
    { book: "Chapterhouse: Dune (#6)", author: "Frank Herbert", booktype: "Paperback", genre: "Sci-Fi", 'url-book': 'https://www.goodreads.com/book/show/44439416-chapterhouse', 'url-author': 'https://www.goodreads.com/author/show/58.Frank_Herbert'},
    { book: "Steve Jobs", author: "Walter Issacson", booktype: "Paperback", genre: "Biography", 'url-book': 'https://www.goodreads.com/book/show/18051086-steve-jobs', 'url-author': 'https://www.goodreads.com/author/show/7111.Walter_Isaacson'},
    { book: "Growth: From Microorganisms to Megacities", author: "Vaclav Smil", booktype: "Paperback", genre: "Non-Fiction", 'url-book': 'https://www.goodreads.com/book/show/44512537-growth', 'url-author': 'https://www.goodreads.com/author/show/5003.Vaclav_Smil'},
    // ... more data ...
];
