document.addEventListener('DOMContentLoaded', () => {
    const currentDate = new Date();

    function calculateDuration(startDate, endDate) {
        const years = endDate.getFullYear() - startDate.getFullYear();
        const months = endDate.getMonth() - startDate.getMonth() + (12 * years);
        const days = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));
        const totalYears = Math.floor(months / 12);
        const totalMonths = months % 12;
        const totalDays = days % 365 % 30;
        return { totalYears, totalMonths, totalDays, months, days };
    }

    function filterReadingData(filter) {
        const filteredData = readingData.filter(entry => {
            const entryDate = new Date(entry.date);
            switch (filter) {
                case 'all':
                    return true;
                case 'last6months':
                    const sixMonthsAgo = new Date(currentDate);
                    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
                    return entryDate >= sixMonthsAgo;
                case 'thisYear':
                    return entryDate.getFullYear() === currentDate.getFullYear();
                case '2024':
                    return entryDate.getFullYear() === 2024;
                case '2023':
                    return entryDate.getFullYear() === 2023;
                case '2022':
                    return entryDate.getFullYear() === 2022;
                default:
                    return true;
            }
        });
        return filteredData;
    }

    function updateVisualizations(filter) {
        const filteredData = filterReadingData(filter);
        if (filteredData.length === 0) {
            document.getElementById('summary').innerHTML = `<h2 style="text-align: center;">Overview</h2><p style="text-align: center;">No data available for the selected period.</p>`;
            Plotly.newPlot('line-chart', [], {});
            Plotly.newPlot('reading-per-month', [], {});
            Plotly.newPlot('reading-per-weekday', [], {});
            Plotly.newPlot('pie-chart', [], {});
            document.getElementById('left-table').innerHTML = '<h3>Reading Journal</h3><table><tr><th>Book Name</th><th>Author</th><th>Start Date</th><th>End Date</th><th>Total Days</th><th>Pages</th><th>Hours</th></tr></table>';
            document.getElementById('right-table').innerHTML = '<h3>Reading Wishlist</h3><table><tr><th>Book Name</th><th>Author</th><th>Genre</th></tr></table>';
            return;
        }

        const endDate = new Date(filteredData[0].date);
        const startDate = new Date(filteredData[filteredData.length - 1].date);
        const duration = calculateDuration(startDate, endDate);

        let totalMinutes = 0;
        let totalPages = 0;
        let totalBooks = 0;
        let lessThanTenMinutes = 0;
        let bookMap = new Map();
        let genreCountMap = new Map();
        let uniqueBooks = new Set();
        let allDates = new Set();

        filteredData.forEach(entry => {
            totalMinutes += entry.minutes;
            totalPages += entry.pages;

            if (entry.status === "completed") {
                totalBooks++;
            }
            if (entry.minutes < 10) {
                lessThanTenMinutes++;
            }

            const date = new Date(entry.date);
            allDates.add(entry.date);

            const bookKey = `${entry.book}-${entry.author}`;

            if (!bookMap.has(bookKey)) {
                bookMap.set(bookKey, { 
                    minutes: 0, 
                    pages: 0, 
                    startDate: null, 
                    endDate: null, 
                    totalDays: 0,
                    urlBook: entry['url-book'],
                    urlAuthor: entry['url-author']
                });
            }

            const bookData = bookMap.get(bookKey);
            bookData.minutes += entry.minutes;
            bookData.pages += entry.pages;
            bookData.totalDays++;
            
            if (entry.status === 'started') {
                bookData.startDate = entry.date;
            }
            
            if (entry.status === 'completed') {
                bookData.endDate = entry.date;
            }

            if (!genreCountMap.has(entry.genre)) {
                genreCountMap.set(entry.genre, new Set());
            }
            genreCountMap.get(entry.genre).add(bookKey);

            uniqueBooks.add(bookKey);
        });

        const missedDaysSet = new Set();
        for (let d = new Date(startDate); d < endDate; d.setDate(d.getDate() + 1)) {
            const dateStr = d.toISOString().split('T')[0];
            if (!allDates.has(dateStr)) {
                missedDaysSet.add(dateStr);
            }
        }
        const missedDays = missedDaysSet.size;

        const summaryText = `
            <h2 style="text-align: center;">Overview</h2>
            <p style="text-align: center;">
            From ${startDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} to ${endDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} (${duration.totalYears} years ${duration.totalMonths} months and ${duration.totalDays} days),
            I finished <span style="color: softmagenta;">${totalBooks}</span> books. <br>
            I read about <span style="color: softmagenta;">${totalPages}</span> pages in <span style="color: softmagenta;">${totalMinutes}</span> minutes,
            which is equivalent to <span style="color: softmagenta;">${Math.floor(totalMinutes / 60)}</span> hours and <span style="color: softmagenta;">${totalMinutes % 60}</span> minutes of non-stop reading. <br>
            I missed <span style="color: softmagenta;">${missedDays}</span> days (no reading at all), and read less than ten minutes <span style="color: softmagenta;">${lessThanTenMinutes}</span> times.<br>...
            </p>
        `;

        document.getElementById('summary').innerHTML = summaryText;

        const dates = [];
        const minutes = [];
        const pages = [];
        const hoverText = [];
        const entriesMap = new Map();

        filteredData.forEach(entry => {
            dates.push(entry.date);
            minutes.push(entry.minutes);
            pages.push(entry.pages);
            const text = `${entry.minutes} minutes, ${entry.pages} pages read from\n${entry.book} by ${entry.author}`;
            hoverText.push(text);
            entriesMap.set(entry.date, { minutes: entry.minutes, book: entry.book, author: entry.author, urlBook: entry['url-book'], urlAuthor: entry['url-author'] });
        });

        const lineTraceMinutes = {
            x: dates,
            y: minutes,
            mode: 'lines+markers',
            name: 'Minutes',
            text: hoverText,
            hoverinfo: 'text',
            hovertemplate: '%{text}<extra></extra>'
        };

        const lineTracePages = {
            x: dates,
            y: pages,
            text: hoverText,
            mode: 'lines+markers',
            name: 'Pages',
            hoverinfo: 'text',
            hovertemplate: '%{text}<extra></extra>'
            //hoverinfo: 'skip' // Turn off hover for pages
        };

        const shapes = [];
        const colors = ['rgba(128, 0, 128, 0.5)', 'rgba(0, 128, 128, 0.5)', 'rgba(128, 128, 0, 0.5)', 'rgba(128, 0, 0, 0.5)', 'rgba(0, 0, 128, 0.5)'];
        let colorIndex = 0;

        bookMap.forEach((bookData, bookKey) => {
            const [book, author] = bookKey.split('-');
            if (bookData.startDate && bookData.endDate) {
                let bookText = book;
                if (bookText.length > 40) {
                    bookText = bookText.substring(0, 40) + '...';
                }
                shapes.push({
                    type: 'rect',
                    xref: 'x',
                    yref: 'paper',
                    x0: bookData.startDate,
                    y0: 0,
                    x1: bookData.endDate,
                    y1: 1,
                    fillcolor: colors[colorIndex % colors.length],
                    opacity: 0.45,
                    line: {
                        width: 0
                    },
                    text: bookText,
                    hoverinfo: 'text',
                    hovertemplate: `${bookText}<extra></extra>`
                });
                colorIndex++;
            }
        });

        const layout = {
            title: 'Reading Progress (per Day)',
            xaxis: {
                title: 'Time'
            },
            yaxis: {
                title: 'Minutes/Pages',
                showticklabels: true,
                tickformat: ',d'
            },
            showlegend: true,
            shapes: shapes,
            annotations: shapes.map(shape => ({
                x: shape.x0,
                y: 0.5,
                xref: 'x',
                yref: 'paper',
                text: shape.text,
                showarrow: false,
                textangle: -90,
                font: {
                    size: 10,
                    color: 'white'
                },
                align: 'left',
                valign: 'middle',
                xanchor: 'left'
            })),
            hovermode: 'closest'
        };

        const config = { displayModeBar: false };

        const combinedData = [lineTraceMinutes, lineTracePages];

        Plotly.newPlot('line-chart', [], layout, config).then(() => {
            Plotly.addTraces('line-chart', combinedData);
        });

        const pieChart = document.getElementById('pie-chart');
        const genres = Array.from(genreCountMap.keys());
        const genreCounts = genres.map(genre => genreCountMap.get(genre).size);

        Plotly.react(pieChart, [{
            values: genreCounts,
            labels: genres,
            type: 'pie'
        }], {
            title: 'Genre Distribution'
        }, config);

        let leftTableHtml = '<h3>Reading Journal</h3><table><tr><th>Book Name</th><th>Author</th><th>Started</th><th>Ended</th><th>Days</th><th>Pages</th><th>Hours</th></tr>';
        bookMap.forEach((bookData, bookKey) => {
            const [book, author] = bookKey.split('-');
            leftTableHtml += `<tr><td><a href="${bookData.urlBook}" target="_blank">${book}</a></td><td><a href="${bookData.urlAuthor}" target="_blank">${author}</a></td><td>${bookData.startDate}</td><td>${bookData.endDate}</td><td>${bookData.totalDays}</td><td>${bookData.pages}</td><td>${Math.floor(bookData.minutes / 60)}h:${bookData.minutes % 60}m</td></tr>`;
        });
        leftTableHtml += '</table>';
        document.getElementById('left-table').innerHTML = leftTableHtml;

        let rightTableHtml = '<h3>Reading Wishlist</h3><table><tr><th>Book Name</th><th>Author</th><th>Genre</th></tr>';
        wishlistData.forEach(entry => {
            rightTableHtml += `<tr><td><a href="${entry['url-book']}" target="_blank">${entry.book}</a></td><td><a href="${entry['url-author']}" target="_blank">${entry.author}</a></td><td>${entry.genre}</td></tr>`;
        });
        rightTableHtml += '</table>';
        document.getElementById('right-table').innerHTML = rightTableHtml;

        // Reading per Month
        const monthMinutes = {};
        filteredData.forEach(entry => {
            const date = new Date(entry.date);
            const month = date.getFullYear() + '-' + (date.getMonth() + 1);
            if (!monthMinutes[month]) {
                monthMinutes[month] = [];
            }
            monthMinutes[month].push(entry.minutes);
        });

        const months = Object.keys(monthMinutes);
        const monthSums = months.map(month => monthMinutes[month].reduce((a, b) => a + b, 0));
        const monthMeans = months.map(month => {
            const sum = monthMinutes[month].reduce((a, b) => a + b, 0);
            return sum / monthMinutes[month].length;
        });
        const monthMedians = months.map(month => {
            const sorted = monthMinutes[month].slice().sort((a, b) => a - b);
            const middle = Math.floor(sorted.length / 2);
            return sorted.length % 2 === 0 ? (sorted[middle - 1] + sorted[middle]) / 2 : sorted[middle];
        });
        const monthMins = months.map(month => Math.min(...monthMinutes[month]));
        const monthMaxs = months.map(month => Math.max(...monthMinutes[month]));

        const monthTrace = {
            x: months,
            y: monthSums,
            type: 'bar',
            text: monthMeans.map(mean => `μ = ${mean.toFixed(2)}`),
            textposition: 'auto',
            textangle: -90,
            hoverinfo: 'text',
            hovertext: months.map((month, i) => `Sum: ${monthSums[i]}<br>Mean: ${monthMeans[i].toFixed(2)}<br>Median: ${monthMedians[i]}<br>Min: ${monthMins[i]}<br>Max: ${monthMaxs[i]}`),
        };

        Plotly.react('reading-per-month', [monthTrace], {
            title: 'Reading Per Month',
            xaxis: {
                title: 'Month'
            },
            yaxis: {
                title: 'Minutes'
            }
        }, config);

        // Reading per Weekday
        const weekdayMinutes = {};
        const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        filteredData.forEach(entry => {
            const date = new Date(entry.date);
            const weekday = weekdays[date.getDay()];
            if (!weekdayMinutes[weekday]) {
                weekdayMinutes[weekday] = [];
            }
            weekdayMinutes[weekday].push(entry.minutes);
        });

        const weekdaySums = weekdays.map(weekday => weekdayMinutes[weekday] ? weekdayMinutes[weekday].reduce((a, b) => a + b, 0) : 0);
        const weekdayMeans = weekdays.map(weekday => {
            if (!weekdayMinutes[weekday]) return 0;
            const sum = weekdayMinutes[weekday].reduce((a, b) => a + b, 0);
            return sum / weekdayMinutes[weekday].length;
        });
        const weekdayMedians = weekdays.map(weekday => {
            if (!weekdayMinutes[weekday]) return 0;
            const sorted = weekdayMinutes[weekday].slice().sort((a, b) => a - b);
            const middle = Math.floor(sorted.length / 2);
            return sorted.length % 2 === 0 ? (sorted[middle - 1] + sorted[middle]) / 2 : sorted[middle];
        });
        const weekdayMins = weekdays.map(weekday => weekdayMinutes[weekday] ? Math.min(...weekdayMinutes[weekday]) : 0);
        const weekdayMaxs = weekdays.map(weekday => weekdayMinutes[weekday] ? Math.max(...weekdayMinutes[weekday]) : 0);

        const weekdayTrace = {
            x: weekdays,
            y: weekdaySums,
            type: 'bar',
            text: weekdayMeans.map(mean => `μ = ${mean.toFixed(2)}`),
            textangle: -90,
            textposition: 'auto',
            hoverinfo: 'text',
            hovertext: weekdays.map((weekday, i) => `Sum: ${weekdaySums[i]}<br>Mean: ${weekdayMeans[i].toFixed(2)}<br>Median: ${weekdayMedians[i]}<br>Min: ${weekdayMins[i]}<br>Max: ${weekdayMaxs[i]}`)
        };

        Plotly.react('reading-per-weekday', [weekdayTrace], {
            title: 'Reading Per Weekday',
            xaxis: {
                title: 'Weekday'
            },
            yaxis: {
                title: 'Minutes'
            }
        }, config);

        document.getElementById('line-chart').on('plotly_click', function(data) {
            const point = data.points[0];
            const date = point.x;
            const entry = entriesMap.get(date);
            if (entry) {
                const formattedDate = new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric'});
                let timeText = '';
                if (entry.minutes > 60) {
                    const hours = Math.floor(entry.minutes / 60);
                    const minutes = entry.minutes % 60;
                    timeText = `<span style="color: softmagenta;">${hours} ${hours > 1 ? 'hours' : 'hour'} ${minutes} minutes</span>`;
                } else {
                    timeText = `<span style="color: softmagenta;">${entry.minutes} minutes</span>`;
                }
                const displayText = `On ${formattedDate} (${new Date(date).toLocaleDateString('en-US', { weekday: 'long' })}), I read ${timeText} of <a href="${entry.urlBook}" style="color: softmagenta;">${entry.book}</a> by <a href="${entry.urlAuthor}" style="color: softmagenta;">${entry.author}</a>.`;
                const displayElement = document.getElementById('click-text');
                if (!displayElement) {
                    const newDisplayElement = document.createElement('div');
                    newDisplayElement.id = 'click-text';
                    newDisplayElement.innerHTML = displayText;
                    newDisplayElement.style.textAlign = 'center';
                    newDisplayElement.style.marginBottom = '10px';
                    document.getElementById('line-chart').parentNode.insertBefore(newDisplayElement, document.getElementById('line-chart'));
                } else {
                    displayElement.innerHTML = displayText;
                }
            }
        });
    }

    window.filterData = function(filter) {
        // Update button styles
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.getAttribute('onclick').includes(filter)) {
                button.classList.add('selected');
            } else {
                button.classList.remove('selected');
            }
        });

        updateVisualizations(filter);
    }

    // Initial load
    document.querySelector('button[onclick="filterData(\'all\')"]').classList.add('selected');
    updateVisualizations('all');
});
