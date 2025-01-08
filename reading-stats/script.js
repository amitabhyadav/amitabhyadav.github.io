document.addEventListener('DOMContentLoaded', () => {
    const currentDate = new Date();

    /* --------------------------------------------------
       1) Group reading data by date (daily aggregator).
          This is crucial for correct daily plotting.
       -------------------------------------------------- */
    function groupReadingDataByDay(data) {
      const dailyMap = new Map();
      data.forEach(entry => {
        const date = entry.date;
        if (!dailyMap.has(date)) {
          dailyMap.set(date, {
            date,
            totalMinutes: 0,
            totalPages: 0,
            entries: []  // keep track of sub-entries for that day
          });
        }
        const dayObj = dailyMap.get(date);
        dayObj.totalMinutes += entry.minutes;
        dayObj.totalPages   += entry.pages;
        dayObj.entries.push(entry);
      });
      // Convert map values into an array and sort by date ascending
      return Array.from(dailyMap.values()).sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    /* --------------------------------------------------
       2) Duration calculation (start to end).
       -------------------------------------------------- */
    function calculateDuration(startDate, endDate) {
        const years = endDate.getFullYear() - startDate.getFullYear();
        const months = endDate.getMonth() - startDate.getMonth() + (12 * years);
        const days = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));
        const totalYears = Math.floor(months / 12);
        const totalMonths = months % 12;
        const totalDays = (days % 365 % 30) + 1;
        return { totalYears, totalMonths, totalDays, months, days };
    }

    /* --------------------------------------------------
       3) Filter reading data by time period (buttons).
       -------------------------------------------------- */
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
                case '2027':
                    return entryDate.getFullYear() === 2027;
                case '2026':
                    return entryDate.getFullYear() === 2026;
                case '2025':
                    return entryDate.getFullYear() === 2025;
                default:
                    return true;
            }
        });
        return filteredData;
    }

    /* --------------------------------------------------
       4) Format date as "DD.MM.YYYY"
       -------------------------------------------------- */
    function formatDate(dateStr, fallback = 'In Progress') {
      if (!dateStr) return fallback;
      const parts = dateStr.split('-'); // expecting "YYYY-MM-DD"
      if (parts.length !== 3) return dateStr;
      const [year, month, day] = parts;
      return `${day}.${month}.${year}`;
    }

    /* --------------------------------------------------
       5) Compute rating at daily level
       -------------------------------------------------- */
    function computeRatings(data) {
        // 1) group all raw entries by day
        const dailyData = groupReadingDataByDay(data);

        let currentRating = 50; // start rating
        const A = 0.4;  // reward factor
        const B = 2;    // skip penalty
        const M = 20;   // baseline minutes
        const ratings = [];

        for (let i = 0; i < dailyData.length; i++) {
            const { date, totalMinutes } = dailyData[i];
            // If we skip or read 0
            let n_d = (totalMinutes === 0) ? 1 : 0;
            let delta = A * (totalMinutes - M) - B * n_d;

            currentRating = currentRating + delta;
            ratings.push({
                date,
                rating: currentRating
            });
        }

        return ratings;
    }

    /* --------------------------------------------------
       6) Plot rating over time
       -------------------------------------------------- */
    function plotRatingOverTime(ratings) {
        const dates = ratings.map(r => r.date);
        const ratingVals = ratings.map(r => r.rating);

        const trace = {
            x: dates,
            y: ratingVals,
            mode: 'lines+markers',
            name: 'Reading Rating',
            line: { color: 'red' },
            hoverinfo: 'y'
        };

        const layout = {
          title: { text: 'Reading Activity' },
          xaxis: {
            title: 'Time',
            ticks: 'outside',
            showticklabels: false,
          },
          yaxis: {
            title: 'Rating'
          }
        };

        Plotly.newPlot('rating-chart', [trace], layout, { displayModeBar: false });
    }

    /* --------------------------------------------------
       7) The main update function
       -------------------------------------------------- */
    function updateVisualizations(filter) {
        const filteredData = filterReadingData(filter);
        if (filteredData.length === 0) {
            document.getElementById('summary').innerHTML = `<h2>Overview</h2><p>No data available for the selected period.</p>`;
            Plotly.newPlot('line-chart', [], {});
            Plotly.newPlot('reading-per-month', [], {});
            Plotly.newPlot('reading-per-weekday', [], {});
            Plotly.newPlot('pie-chart', [], {});
            document.getElementById('left-table').innerHTML = '<h3>Reading Journal</h3><table><tr><th>Book Name</th><th>Author</th><th>Start Date</th><th>End Date</th><th>Total Days</th><th>Pages</th><th>Hours</th></tr></table>';
            document.getElementById('right-table').innerHTML = '<h3>Reading Wishlist</h3><table><tr><th>Book Name</th><th>Author</th><th>Genre</th></tr></table>';
            return;
        }

        // 7a) Summary: from oldest to newest
        // Note: endDate is earliest date in the sorted array, startDate is the last date
        const sortedFiltered = filteredData.slice().sort((a,b)=>new Date(a.date) - new Date(b.date));
        const startDate = new Date(sortedFiltered[0].date);
        const endDate   = new Date(sortedFiltered[sortedFiltered.length - 1].date);
        const duration  = calculateDuration(startDate, endDate);

        let totalMinutes = 0;
        let totalPages   = 0;
        let totalBooks   = 0;
        let lessThanTenMinutes = 0;
        let bookMap      = new Map();
        let genreCountMap= new Map();
        let uniqueBooks  = new Set();
        let allDates     = new Set();

        filteredData.forEach(entry => {
            totalMinutes += entry.minutes;
            totalPages   += entry.pages;
            if (entry.status === "completed") {
                totalBooks++;
            }
            if (entry.minutes < 10) {
                lessThanTenMinutes++;
            }
            allDates.add(entry.date);

            // For the reading journal
            const bookKey = `${entry.book}-${entry.author}`;
            if (!bookMap.has(bookKey)) {
                bookMap.set(bookKey, { 
                    minutes: 0, 
                    pages: 0, 
                    startDate: null, 
                    endDate: null, 
                    totalDays: 0,
                    urlBook: entry['url-book'],
                    urlAuthor: entry['url-author'],
                    totalPages: entry.totalpages || 0
                });
            }

            const bookData = bookMap.get(bookKey);
            bookData.minutes += entry.minutes;
            bookData.pages   += entry.pages;
            bookData.totalDays++;
            
            if (entry.status === 'started' && !bookData.startDate) {
                bookData.startDate = entry.date;
            }
            if (entry.status === 'completed') {
                bookData.endDate = entry.date;
            }

            // Genre distribution
            if (!genreCountMap.has(entry.genre)) {
                genreCountMap.set(entry.genre, new Set());
            }
            genreCountMap.get(entry.genre).add(bookKey);
            uniqueBooks.add(bookKey);
        });

        // Count missed days
        const missedDaysSet = new Set();
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            const dateStr = d.toISOString().split('T')[0];
            if (!allDates.has(dateStr)) {
                missedDaysSet.add(dateStr);
            }
        }
        const missedDays = missedDaysSet.size;

        // 7b) Summaries
        const summaryText = `
            <h2 style="text-align: center;">Overview</h2>
            <p style="text-align: center;">
            From <span style="color: #159BD6;">${startDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            to <span style="color: #159BD6;">${endDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            (${duration.totalYears} years ${duration.totalMonths} months and ${duration.totalDays} days),
            I finished <span style="color: red;">${totalBooks}</span> books.<br>
            I read about <span style="color: red;">${totalPages}</span> pages in <span style="color: red;">${totalMinutes}</span> minutes,
            which is equivalent to <span style="color: red;">${Math.floor(totalMinutes / 60)}</span> hours and <span style="color: red;">${totalMinutes % 60}</span> minutes of non-stop reading. <br>
            I missed <span style="color: red;">${missedDays}</span> days (no reading at all), and read less than ten minutes <span style="color: red;">${lessThanTenMinutes}</span> times.<br>...
            </p>
        `;
        document.getElementById('summary').innerHTML = summaryText;

        // 7c) Prepare daily data for the main time-series plots
        const dailyData = groupReadingDataByDay(filteredData);  // aggregator

        // For the line chart
        const xDates   = dailyData.map(d => d.date);
        const yMinutes = dailyData.map(d => d.totalMinutes);
        const yPages   = dailyData.map(d => d.totalPages);

        // We'll store the aggregated daily entries in a map for the click event
        const dailyEntriesMap = new Map();
        dailyData.forEach(day => {
          dailyEntriesMap.set(day.date, day.entries); // array of sub-entries
        });

        const lineTraceMinutes = {
            x: xDates,
            y: yMinutes,
            mode: 'lines+markers',
            name: 'Minutes',
            hoverinfo: 'yMinutes',
            line: { color: 'red' },
            marker: { size: 6, color: 'red' }
        };

        const lineTracePages = {
            x: xDates,
            y: yPages,
            mode: 'lines+markers',
            name: 'Pages',
            hoverinfo: 'yPages',
            line: { color: 'blue' },
            marker: { size: 6, color: 'blue' }
        };

        // 7d) Highlight reading intervals for each book
        //  - We'll still look at the raw bookMap for start/end
        const shapes = [];
        const colors = [
          'rgba(128, 0, 128, 0.5)', 'rgba(0, 128, 128, 0.5)',
          'rgba(128, 128, 0, 0.5)', 'rgba(128, 0, 0, 0.5)',
          'rgba(0, 0, 128, 0.5)'
        ];
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
                    line: { width: 0 },
                    text: bookText
                });
                colorIndex++;
            }
        });

        const layout = {
            title: 'Reading Progress (per Day)',
            hovermode: 'closest',
            xaxis: {
                title: 'Time',
                showspikes: true,
                spikemode: 'across',
                spikesnap: 'data',
                spikedash: 'dot',
                spikethickness: 1,
                spikecolor: '#999'
            },
            yaxis: {
                title: 'Minutes/Pages',
                showticklabels: true,
                tickformat: ',d',
                showspikes: true,
                spikemode: 'across',
                spikesnap: 'data',
                spikedash: 'dot',
                spikethickness: 1,
                spikecolor: '#999'
            },
            showlegend: true,
            shapes: shapes,
            // create an annotation for each shape (optional)
            annotations: shapes.map(shape => ({
                x: shape.x0,
                y: 0.5,
                xref: 'x',
                yref: 'paper',
                text: shape.text,
                showarrow: false,
                textangle: -90,
                font: { size: 12, color: 'black' },
                align: 'left',
                valign: 'middle',
                xanchor: 'left'
            }))
        };

        const config = { displayModeBar: false };
        const combinedData = [lineTraceMinutes, lineTracePages];

        // Clear & then plot
        Plotly.newPlot('line-chart', [], layout, config).then(() => {
            Plotly.addTraces('line-chart', combinedData);
        });

        // 7e) Pie chart for genre distribution
        const genres = Array.from(genreCountMap.keys());
        const genreCounts = genres.map(genre => genreCountMap.get(genre).size);
        Plotly.react('pie-chart', [{
            values: genreCounts,
            labels: genres,
            type: 'pie',
            textinfo: 'label+percent',
            showlegend: false
        }], { title: 'Genre Distribution' }, config);

        // 7f) Additional Pie Charts: Venue, Location, Booktype
        const venueCounts = {};
        const locationCounts = {};
        const booktypeCounts = {};

        filteredData.forEach(entry => {
            const venue = entry.venue || 'Unknown';
            const location = entry.location || 'Unknown';
            if (!venueCounts[venue]) venueCounts[venue] = 0;
            if (!locationCounts[location]) locationCounts[location] = 0;
            venueCounts[venue]++;
            locationCounts[location]++;

            // If status == "started" we increment booktype? Or all entries?
            // Adjust logic as you like
            if (entry.status === "started") {
                const booktype = entry.booktype || 'Unknown';
                if (!booktypeCounts[booktype]) booktypeCounts[booktype] = 0;
                booktypeCounts[booktype]++;
            }
        });

        // Pie #1: Venue
        Plotly.react('pie-venue', [{
            values: Object.values(venueCounts),
            labels: Object.keys(venueCounts),
            type: 'pie',
            hoverinfo: 'label+percent',
            textinfo: 'label',
            showlegend: false
        }], { title: 'Venue Distribution' }, { displayModeBar: false });

        // Pie #2: Book Type
        Plotly.react('pie-booktype', [{
            values: Object.values(booktypeCounts),
            labels: Object.keys(booktypeCounts),
            type: 'pie',
            hoverinfo: 'label+percent',
            textinfo: 'label+value',
            showlegend: false
        }], { title: 'Book Type Distribution' }, { displayModeBar: false });

        // Pie #3: Location
        Plotly.react('pie-location', [{
            values: Object.values(locationCounts),
            labels: Object.keys(locationCounts),
            type: 'pie',
            hoverinfo: 'label+percent',
            textinfo: 'label',
            showlegend: false
        }], { title: 'Location Distribution' }, { displayModeBar: false });

        /* --------------------------------------------------
           7g) LEFT TABLE: Reading Journal
         -------------------------------------------------- */
        let leftTableHtml = '<h3>Reading Journal</h3><table><tr><th>Book Name</th><th>Author</th><th>Started</th><th>Ended</th><th>Days</th><th>Pages</th><th>Hours</th><th>Progress</th></tr>';
        bookMap.forEach((bookData, bookKey) => {
            const [book, author] = bookKey.split('-');
            const endDate   = bookData.endDate ? bookData.endDate : 'Currently Reading';
            const startedDate = formatDate(bookData.startDate, 'N/A'); 
            const endedDate   = formatDate(bookData.endDate, 'Currently Reading');
            // Compute progress (0-100%)
            const progressPercent = (bookData.totalPages > 0)
                ? Math.round((bookData.pages / bookData.totalPages) * 100)
                : 0;

            leftTableHtml += `
              <tr>
                <td><a href="${bookData.urlBook}" target="_blank">${book}</a></td>
                <td><a href="${bookData.urlAuthor}" target="_blank">${author}</a></td>
                <td>${startedDate}</td>
                <td>${endedDate}</td>
                <td>${bookData.totalDays}</td>
                <td>${bookData.pages}</td>
                <td>${Math.floor(bookData.minutes / 60)}h${bookData.minutes % 60}m</td>
                <td>
                  <div style="width: 100px; background-color: #f0f0f0; border: 1px solid #ccc;">
                    <div style="height: 10px; width: ${progressPercent}%; background-color: #00e118;"></div>
                  </div>
                  <span style="font-size: 0.8em; margin-left: 5px;">${progressPercent}%</span>
                </td>
              </tr>
            `;
        });
        leftTableHtml += '</table>';
        document.getElementById('left-table').innerHTML = leftTableHtml;

        /* --------------------------------------------------
           7h) RIGHT TABLE: Reading Wishlist
         -------------------------------------------------- */
        let rightTableHtml = '<h3>Reading Wishlist</h3><table><tr><th>Book Name</th><th>Author</th><th>Genre</th></tr>';
        wishlistData.forEach(entry => {
            rightTableHtml += `
              <tr>
                <td><a href="${entry['url-book']}" target="_blank">${entry.book}</a></td>
                <td><a href="${entry['url-author']}" target="_blank">${entry.author}</a></td>
                <td>${entry.genre}</td>
              </tr>
            `;
        });
        rightTableHtml += '</table>';
        document.getElementById('right-table').innerHTML = rightTableHtml;


        /* --------------------------------------------------
           7i) Reading per Month (using daily-aggregated data)
         -------------------------------------------------- */
        const monthMinutes = {};
        dailyData.forEach(d => {
            const date = new Date(d.date);
            const monthKey = date.getFullYear() + '-' + (date.getMonth() + 1);
            if (!monthMinutes[monthKey]) {
                monthMinutes[monthKey] = [];
            }
            monthMinutes[monthKey].push(d.totalMinutes);
        });

        const months      = Object.keys(monthMinutes).sort();
        const monthSums   = months.map(m => monthMinutes[m].reduce((a,b)=>a+b,0));
        const monthMeans  = months.map(m => {
            const sum = monthMinutes[m].reduce((a,b)=>a+b,0);
            return sum / monthMinutes[m].length;
        });
        const monthMedians= months.map(m => {
            const sorted = monthMinutes[m].slice().sort((a,b)=>a-b);
            const mid = Math.floor(sorted.length/2);
            return (sorted.length % 2===0) ? (sorted[mid-1]+sorted[mid])/2 : sorted[mid];
        });
        const monthMins = months.map(m => Math.min(...monthMinutes[m]));
        const monthMaxs = months.map(m => Math.max(...monthMinutes[m]));

        // Format x-axis label
        const formattedMonths = months.map(m => {
            const [yyyy, mm] = m.split('-');
            const d = new Date(parseInt(yyyy), parseInt(mm)-1, 1);
            return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        });

        const monthTrace = {
            x: formattedMonths,
            y: monthSums,
            type: 'bar',
            text: monthMeans.map(mean => `μ = ${mean.toFixed(2)}`),
            textposition: 'auto',
            textangle: -90,
            hoverinfo: 'text',
            hovertext: months.map((m,i)=> {
                return `
                  Sum: ${monthSums[i]}<br>
                  Mean: ${monthMeans[i].toFixed(2)}<br>
                  Median: ${monthMedians[i]}<br>
                  Min: ${monthMins[i]}<br>
                  Max: ${monthMaxs[i]}
                `;
            })
        };

        Plotly.react('reading-per-month', [monthTrace], {
            title: 'Reading Per Month',
            xaxis: { title: 'Month' },
            yaxis: { title: 'Minutes' }
        }, config);

        /* --------------------------------------------------
           7j) Reading per Weekday (using daily-aggregated data)
         -------------------------------------------------- */
        const weekdays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
        const weekdayMinutes = {};
        dailyData.forEach(d => {
            const date = new Date(d.date);
            const w = weekdays[date.getDay()];
            if (!weekdayMinutes[w]) {
                weekdayMinutes[w] = [];
            }
            weekdayMinutes[w].push(d.totalMinutes);
        });

        const weekdaySums = weekdays.map(w => {
            return weekdayMinutes[w] ? weekdayMinutes[w].reduce((a,b)=>a+b,0) : 0;
        });
        const weekdayMeans = weekdays.map(w => {
            if (!weekdayMinutes[w]) return 0;
            const arr = weekdayMinutes[w];
            return arr.reduce((a,b)=>a+b,0)/arr.length;
        });
        const weekdayMedians = weekdays.map(w => {
            if (!weekdayMinutes[w]) return 0;
            const sorted = weekdayMinutes[w].slice().sort((a,b)=>a-b);
            const mid = Math.floor(sorted.length/2);
            return (sorted.length%2===0) ? (sorted[mid-1]+sorted[mid])/2 : sorted[mid];
        });
        const weekdayMins = weekdays.map(w => {
            return weekdayMinutes[w] ? Math.min(...weekdayMinutes[w]) : 0;
        });
        const weekdayMaxs = weekdays.map(w => {
            return weekdayMinutes[w] ? Math.max(...weekdayMinutes[w]) : 0;
        });

        const weekdayTrace = {
            x: weekdays,
            y: weekdaySums,
            type: 'bar',
            text: weekdayMeans.map(m => `μ = ${m.toFixed(2)}`),
            textangle: -90,
            textposition: 'auto',
            hoverinfo: 'text',
            hovertext: weekdays.map((w,i) => `
              Sum: ${weekdaySums[i]}<br>
              Mean: ${weekdayMeans[i].toFixed(2)}<br>
              Median: ${weekdayMedians[i]}<br>
              Min: ${weekdayMins[i]}<br>
              Max: ${weekdayMaxs[i]}
            `)
        };

        Plotly.react('reading-per-weekday', [weekdayTrace], {
            title: 'Reading Per Weekday',
            xaxis: { title: 'Weekday' },
            yaxis: { title: 'Minutes' }
        }, config);

        /* --------------------------------------------------
           7k) On Click: Show all sub-entries for that day
         -------------------------------------------------- */
        document.getElementById('line-chart').on('plotly_click', function(data) {
            const point = data.points[0];
            const dateClicked = point.x;  // e.g. "2025-01-03"
            // Get all entries read that day
            const subEntries = dailyEntriesMap.get(dateClicked);
            if (subEntries && subEntries.length > 0) {
                const niceDate = new Date(dateClicked).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                });
                const weekday = new Date(dateClicked).toLocaleDateString('en-US',{weekday:'long'});

                // Build bullet points for each reading
                const bulletPoints = subEntries.map(e => {
                    let minutesStr = '';
                    if (e.minutes > 60) {
                        const hours = Math.floor(e.minutes / 60);
                        const mins  = e.minutes % 60;
                        minutesStr = `${hours}h ${mins}m`;
                    } else {
                        minutesStr = `${e.minutes} minutes`;
                    }
                    return ` <span style="color: red;">${minutesStr}</span> from <a href="${e['url-book']}" style="color: softmagenta;">${e.book}</a> by <a href="${e['url-author']}" style="color: softmagenta;">${e.author}</a>`;
                }).join(',');

                const displayText = `
                  On <strong>${niceDate}</strong> (${weekday}), I read${bulletPoints}
                `;
                
                const displayElement = document.getElementById('click-text');
                if (displayElement) {
                    displayElement.innerHTML = displayText;
                }
            }
        });
    }

    /* --------------------------------------------------
       8) Expose filterData() in the window for button use
       -------------------------------------------------- */
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
    };

    // Initial load
    const ratings = computeRatings(readingData);
    plotRatingOverTime(ratings);

    document.querySelector('button[onclick="filterData(\'all\')"]').classList.add('selected');
    updateVisualizations('all');
});
