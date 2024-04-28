"use strict";
let dataCoinsArr = [];
let responseDiv = document.querySelector('.response-coin');
function createCoinData(coinData) {
    let dataPoints = [];
    if (coinData[0]) {
        const coinPrices = coinData[1];
        const yValue = coinPrices.USD;
        dataPoints.push({
            x: new Date(),
            y: yValue,
        });
    }
    return {
        type: 'line',
        showInLegend: true,
        name: coinData[0],
        markerType: 'square',
        color: '#' + (((1 << 24) * Math.random()) | 0).toString(16).padStart(6, '0'),
        xValueFormatString: ' HH MM ss',
        yValueFormatString: '#,##0K',
        dataPoints,
    };
}
async function renderChart(toggledCards) {
    try {
        const selectedCoins = toggledCards.join(',');
        const coinData = await getCoinData(selectedCoins);
        checkIfcoinExist(toggledCards);
        const options = {
            toolTip: {
                contentFormatter: function (e) {
                    let content = '';
                    for (let i = 0; i < e.entries.length; i++) {
                        const dataPoint = e.entries[i].dataPoint;
                        console.log(dataPoint);
                        content += `Time ${dataPoint.x}</strong><br/>`;
                        content += `Price (USD): ${dataPoint.y}<br/><br/>`;
                    }
                    return content;
                },
            },
            animationEnabled: true,
            theme: 'light2',
            title: {
                text: 'Coin Prices',
            },
            axisX: {
                title: 'Coins',
                interval: 1,
            },
            axisY: {
                title: 'Price (USD)',
            },
            data: [...Object.entries(coinData).map(createCoinData)],
        };
        const chart = new CanvasJS.Chart('chartContainer', options);
        chart.render();
        setInterval(async () => {
            const updatedCoinData = await getCoinData(selectedCoins);
            const updatedData = Object.entries(updatedCoinData).map(createCoinData);
            updatedData.forEach((data, index) => {
                chart.options.data[index].dataPoints.push(...data.dataPoints);
            });
            {
                chart.render();
            }
        }, 2000);
    }
    catch (error) {
        console.error('Error rendering chart:', error);
    }
}
async function getCoinData(coins) {
    const response = await fetch(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${coins}&tsyms=USD,EUR,ILS`);
    const data = await response.json();
    const extractedData = [];
    Object.entries(data).forEach((coinEntry) => extractedData.push({ coinName: coinEntry[0], date: new Date(), values: coinEntry[1] }));
    return data;
}
async function checkIfcoinExist(toggledCards) {
    for (let i = 0; i < toggledCards.length; i++) {
        const response = await fetch(`https://min-api.cryptocompare.com/data/price?fsym=${toggledCards[i]}&tsyms=USD,ILS,EUR`);
        const responseJson = await response.json();
        console.log(responseJson);
        if (responseJson.Response === 'Error') {
            let responseContent = document.createElement('div');
            responseContent.classList.add('response-container');
            responseContent.innerText = `${toggledCards[i]} doesnt have live currency `;
            responseDiv.appendChild(responseContent);
        }
    }
}
