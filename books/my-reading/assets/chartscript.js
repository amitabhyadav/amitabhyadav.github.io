// Sample reading data
const readingData = [
    { date: "2024-06-26", minutes: 20, pages: 14, book: "Build: An Unorthodox Guide to Making Things Worth Making", author: "Tony Fadell", genre: "Enterpreneurship" },
    { date: "2024-06-25", minutes: 35, pages: 25, book: "Build: An Unorthodox Guide to Making Things Worth Making", author: "Tony Fadell", genre: "Enterpreneurship" },
    //{ date: "2023-11-01", minutes: 20, pages: 8, book: "Book 3", author: "Author 1", genre: "Biography" },
    //{ date: "2023-10-02", minutes: 45, pages: 20, book: "Book 2", author: "Author 2", genre: "Fiction" },
    //{ date: "2023-09-02", minutes: 8, pages: 4, book: "Book 2", author: "Author 2", genre: "Non-Fiction" },
    //{ date: "2023-08-02", minutes: 60, pages: 32, book: "Book 2", author: "Author 2", genre: "Fiction" },
    //{ date: "2023-07-02", minutes: 50, pages: 24, book: "Book 2", author: "Author 2", genre: "Non-Fiction" },
    //{ date: "2023-06-01", minutes: 20, pages: 8, book: "Book 1", author: "Author 1", genre: "Fiction" },
    //{ date: "2023-05-02", minutes: 45, pages: 20, book: "Book 2", author: "Author 2", genre: "Fiction" },
    //{ date: "2023-04-02", minutes: 10, pages: 4, book: "Book 2", author: "Author 2", genre: "Non-Fiction" },
    //{ date: "2023-02-02", minutes: 60, pages: 32, book: "Book 2", author: "Author 2", genre: "Fiction" },
    //{ date: "2023-01-02", minutes: 50, pages: 24, book: "Book 2", author: "Author 2", genre: "Non-Fiction" },
    //{ date: "2022-06-01", minutes: 20, pages: 8, book: "Book 1", author: "Author 1", genre: "Fiction" },
    //{ date: "2022-05-02", minutes: 45, pages: 20, book: "Book 2", author: "Author 2", genre: "Fiction" },
    //{ date: "2022-04-02", minutes: 10, pages: 4, book: "Book 2", author: "Author 2", genre: "Non-Fiction" },
    //{ date: "2022-02-02", minutes: 60, pages: 32, book: "Book 2", author: "Author 2", genre: "Fiction" },
    //{ date: "2022-01-02", minutes: 50, pages: 24, book: "Book 2", author: "Author 2", genre: "Non-Fiction" },
    // ... more data ...
];

// Function to process data for the pie chart
function processPieChartData(data) {
    let genres = {};
    data.forEach(session => {
        genres[session.genre] = (genres[session.genre] || 0) + 1;
    });
    return {
        labels: Object.keys(genres),
        datasets: [{
            data: Object.values(genres),
            backgroundColor: ['red', 'blue', 'green', 'yellow', 'purple', 'orange'] // Colors for each genre
        }]
    };
}

// Initialize charts
let lineChart, pieChart;
document.addEventListener('DOMContentLoaded', function() {
    const reversedData = [...readingData].reverse();

    const ctxLine = document.getElementById('lineChart').getContext('2d');
    lineChart = new Chart(ctxLine, {
        type: 'line',
        data: {
            labels: reversedData.map(session => session.date),
            datasets: [
                {
                    label: 'Minutes Read',
                    data: reversedData.map(session => session.minutes),
                    borderColor: 'blue',
                    fill: false
                },
                {
                    label: 'Pages Read',
                    data: reversedData.map(session => session.pages),
                    borderColor: 'green',
                    fill: false
                }
            ]
        },
    });

    const pieChartData = processPieChartData(readingData);
    const ctxPie = document.getElementById('pieChart').getContext('2d');
    pieChart = new Chart(ctxPie, {
        type: 'pie',
        data: pieChartData,
        options: {
                maintainAspectRatio: true,
                aspectRatio: 1,
            }
    });
});

// Initialize empty charts
/* let lineChart, pieChart;
document.addEventListener('DOMContentLoaded', function() {
    lineChart = initLineChart([]);
    pieChart = initPieChart([]);
}); */

// Functions to initialize charts
function initLineChart(data) {
    const reversedData = [...readingData].reverse();
    const ctxLine = document.getElementById('lineChart').getContext('2d');
    return new Chart(ctxLine, {
        type: 'line',
        data: {
            labels: data.map(session => session.date),
            datasets: [
            {
                label: 'Minutes Read',
                data: reversedData.map(session => session.minutes),
                borderColor: 'blue',
                fill: false
            },
            {
                label: 'Pages Read',
                data: reversedData.map(session => session.pages),
                borderColor: 'green',
                fill: false
            }
        ]
        },
        options: {
            responsive: true,
            plugins: {
                tooltip: {
                    callbacks: {
                        afterLabel: function(context) {
                            let session = reversedData[context.dataIndex];
                            return `${session.book} by ${session.author} - ${session.genre}`;
                        }
                    }
                }
            }
        }
    });
}

function initPieChart(data) {
    let genres = {};
    data.forEach(session => {
        genres[session.genre] = (genres[session.genre] || 0) + 1;
    });

    const ctxPie = document.getElementById('pieChart').getContext('2d');
    return new Chart(ctxPie, {
        type: 'pie',
        data: {
            labels: Object.keys(genres),
            datasets: [{
                data: Object.values(genres),
                backgroundColor: ['red', 'blue', 'green', 'yellow', 'purple', 'orange'] // Colors for each genre
            }]
        }
    });
}

// Function to update charts based on date range
function updateCharts(startDate, endDate) {
    const reversedData = [...readingData].reverse();
    const filteredData = reversedData.filter(session => {
        const sessionDate = new Date(session.date);
        return sessionDate >= startDate && sessionDate <= endDate;
    });

    lineChart.destroy();
    pieChart.destroy();
    lineChart = initLineChart(filteredData);
    pieChart = initPieChart(filteredData);
}

// Event listeners for date range update
document.getElementById('startDate').addEventListener('change', () => {
    const startDate = new Date(document.getElementById('startDate').value);
    const endDate = new Date(document.getElementById('endDate').value);
    updateCharts(startDate, endDate);
});

document.getElementById('endDate').addEventListener('change', () => {
    const startDate = new Date(document.getElementById('startDate').value);
    const endDate = new Date(document.getElementById('endDate').value);
    updateCharts(startDate, endDate);
});

// Predefined range setters
function setLastMonth() {
    const endDate = new Date();
    const startDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
    updateCharts(startDate, endDate);
}

function setLast6Months() {
    const endDate = new Date();
    const startDate = new Date(endDate.getFullYear(), endDate.getMonth() - 6, endDate.getDate());
    updateCharts(startDate, endDate);
}

function setYear(year) {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);
    updateCharts(startDate, endDate);
}

/** Overview Calculation **/
function summarizeReadingData(readingData) {
    // Helper function to convert minutes to months, days, hours, and minutes
    function convertMinutes(mins) {
        const minutesInHour = 60;
        const hoursInDay = 24;
        const daysInMonth = 30;

        const minutes = mins % minutesInHour;
        const totalHours = Math.floor(mins / minutesInHour);
        const hours = totalHours % hoursInDay;
        const totalDays = Math.floor(totalHours / hoursInDay);
        const days = totalDays % daysInMonth;
        const months = Math.floor(totalDays / daysInMonth);

        return `${months} months ${days} days ${hours} hours and ${minutes} minutes`;
    }

    // Calculating the time span from January 1st, 2022
    const startDate = new Date("2024-06-25");
    const endDate = new Date();
    const timeDiff = endDate - startDate;
    const daysDiff = timeDiff / (1000 * 60 * 60 * 24);
    const years = Math.floor(daysDiff / 365);
    const months = Math.floor((daysDiff % 365) / 30);
    const days = Math.floor((daysDiff % 365) % 30);

    // Counting unique books
    const uniqueBooks = new Set(readingData.map(session => session.book)).size;

    // Summing total pages and minutes
    const totalPages = readingData.reduce((sum, session) => sum + session.pages, 0);
    const totalMinutes = readingData.reduce((sum, session) => sum + session.minutes, 0);

    // Converting total minutes to months, days, hours, and minutes
    const readingDuration = convertMinutes(totalMinutes);

    // Counting missed days and short reading sessions
    let missedDays = 0;
    let shortSessions = 0;
    let previousDate = startDate;
    readingData.forEach(session => {
        const currentDate = new Date(session.date);
        if ((currentDate - previousDate) > (1000 * 60 * 60 * 24)) {
            missedDays += Math.floor((currentDate - previousDate) / (1000 * 60 * 60 * 24)) - 1;
        }
        if (session.minutes < 10) {
            shortSessions++;
        }
        previousDate = currentDate;
    });

    const summaryElement = document.getElementById('readingSummary');
    summaryElement.textContent = `From June 25st, 2024 to ${endDate.toISOString().split('T')[0]} (${years} years ${months} months ${days} days), I finished ${uniqueBooks} books.

I read about ${totalPages} pages in ${totalMinutes} minutes, which is equivalent to ${readingDuration} of non-stop reading.

I missed ${missedDays} days (no reading at all), and read less than ten minutes ${shortSessions} times.`;
}

// Call the function with your data
summarizeReadingData(readingData);
