"use strict";
let btnClick = document.querySelector('.btn-primary');
let allCoins = document.querySelector('.all-coins');
let wrapperElement = document.querySelector('.wrapper');
let COINS_FETCH_TIME = 'coinsFetchTime';
let about = document.querySelector('.about');
let home = document.querySelector('.home');
let liveReports = document.querySelector('.live-reports');
let toggledCards = [];
let ElementAbout = loadingAbout();
let logoPlease = document.createElement('img');
logoPlease.src = '../pics/please.png';
let chartDisplay = document.querySelector('#chartContainer');
let searchInput = document.querySelector('.form-control');
let searchBtn = document.querySelector('.btn-outline-success');
let switchedCoin;
let page = 1;
let skip = 0;
let paginationContainer = document.querySelector('.pagination');
let currentPage;
function uploadCoins() {
    skip = 25 * (page - 1);
    if (localStorage[COINS_FETCH_TIME]) {
        let coinsfetchedtime = new Date(localStorage[COINS_FETCH_TIME]);
        let currentTime = new Date();
        let timeForFetch = new Date(currentTime.getTime());
        let coinsRefreshTimeLimit = 120000;
        let timeDiff = timeForFetch.getTime() - coinsfetchedtime.getTime();
        if (timeDiff > coinsRefreshTimeLimit) {
            (async () => {
                let coins = await getAllCoins();
                clearAllCoins();
                createCoins(coins, skip);
                renderPagination(coins);
            })();
        }
        else {
            let coins = JSON.parse(localStorage['allCoins']);
            clearAllCoins();
            createCoins(coins, skip);
            renderPagination(coins);
        }
    }
    else {
        (async () => {
            let coins = await getAllCoins();
            clearAllCoins();
            createCoins(coins, skip);
            renderPagination(coins);
        })();
    }
}
function clearAllCoins() {
    allCoins.innerHTML = '';
}
function renderPagination(coins) {
    const totalPages = Math.ceil(coins.length / 25);
    if (paginationContainer) {
        paginationContainer.innerHTML = '';
        const paginationList = document.createElement('ul');
        paginationList.classList.add('pagination');
        for (let i = 1; i <= totalPages; i++) {
            const pageItem = document.createElement('li');
            pageItem.classList.add('page-item');
            const pageLink = document.createElement('a');
            pageLink.classList.add('page-link');
            pageLink.href = '#';
            pageLink.textContent = i.toString();
            pageLink.addEventListener('click', () => {
                page = i;
                uploadCoins();
            });
            pageItem.appendChild(pageLink);
            paginationList.appendChild(pageItem);
        }
        paginationContainer.appendChild(paginationList);
    }
    else {
        console.error('Pagination container not found.');
    }
}
uploadCoins();
class OneCoin {
    id;
    symbol;
    name;
    market_data;
    image;
    constructor(id, symbol, name, marketData, image) {
        this.id = id;
        this.symbol = symbol;
        this.name = name;
        this.market_data = marketData;
        this.image = image;
    }
}
class MarketData {
    current_price;
    constructor(current_price) {
        this.current_price = current_price;
    }
}
class Coins {
    id;
    symbol;
    name;
    constructor(id, symbole, name) {
        this.id = id;
        this.symbol = symbole;
        this.name = name;
    }
}
async function getAllCoins() {
    let loading = loadingSvg(350, 350);
    allCoins.appendChild(loading);
    let response = await fetch('https://api.coingecko.com/api/v3/coins/list');
    let data = await response.json();
    allCoins.removeChild(loading);
    localStorage['allCoins'] = JSON.stringify(data);
    const fetchTime = new Date();
    localStorage[COINS_FETCH_TIME] = fetchTime;
    return data;
}
async function getOneCoin(id) {
    let response = await fetch(`https://api.coingecko.com/api/v3/coins/${id}`);
    let data = await response.json();
    localStorage[id] = JSON.stringify(data);
    const fetchTime = new Date();
    localStorage[`${id}Time`] = JSON.stringify(fetchTime);
    return data;
}
function createCard(coin) {
    let divContainerCard = document.createElement('div');
    let divBodyCard = document.createElement('div');
    let h5CardTitle = document.createElement('h5');
    let divFormCheck = document.createElement('div');
    let inputFormCheck = document.createElement('input');
    let labelFormCheck = document.createElement('label');
    let pCardElement = document.createElement('p');
    let divContainerInfoCard = document.createElement('div');
    let infoCardElement = document.createElement('div');
    let imgInfoCardElement = document.createElement('img');
    let btnCard = document.createElement('button');
    let isLoading = false;
    addClassCard({
        divContainerCard,
        divBodyCard,
        h5CardTitle,
        divFormCheck,
        inputFormCheck,
        pCardElement,
        btnCard,
        infoCardElement,
        imgInfoCardElement,
        divContainerInfoCard,
        isLoading,
    }, coin);
    return {
        divContainerCard,
        divBodyCard,
        h5CardTitle,
        divFormCheck,
        inputFormCheck,
        labelFormCheck,
        pCardElement,
        btnCard,
        infoCardElement,
        imgInfoCardElement,
        divContainerInfoCard,
        isLoading,
    };
}
function addClassCard(elements, coin) {
    elements.divContainerCard.classList.add('card');
    elements.divBodyCard.classList.add('card-body');
    elements.divFormCheck.classList.add('form-check');
    elements.divFormCheck.classList.add('form-switch');
    elements.h5CardTitle.classList.add('card-title');
    elements.inputFormCheck.classList.add('form-check-input');
    elements.inputFormCheck.classList.add('me-md-2');
    elements.inputFormCheck.setAttribute('role', 'switch');
    elements.inputFormCheck.setAttribute('type', 'checkbox');
    elements.pCardElement.classList.add('card-text');
    elements.btnCard.classList.add('btn-primary');
    elements.btnCard.classList.add('btn');
    elements.btnCard.setAttribute('data-bs-toggle', 'collapse');
    elements.btnCard.textContent = 'More info';
    elements.divContainerInfoCard.classList.add('collapse');
    elements.divContainerInfoCard.id = `collapse_${coin.id}`;
    elements.divContainerInfoCard;
    return elements;
}
function appendCard(elements) {
    elements.divFormCheck.appendChild(elements.inputFormCheck);
    elements.divBodyCard.appendChild(elements.h5CardTitle);
    elements.divBodyCard.appendChild(elements.divFormCheck);
    elements.divBodyCard.appendChild(elements.pCardElement);
    elements.divBodyCard.appendChild(elements.btnCard);
    elements.divContainerInfoCard.appendChild(elements.imgInfoCardElement);
    elements.divContainerInfoCard.appendChild(elements.infoCardElement);
    elements.divBodyCard.appendChild(elements.divContainerInfoCard);
    elements.divContainerCard.appendChild(elements.divBodyCard);
    allCoins.appendChild(elements.divContainerCard);
}
function renderCard(coin) {
    let card = createCard(coin);
    appendCard(card);
    return card;
}
function editCardText(elements, coin) {
    elements.h5CardTitle.textContent = coin.symbol;
    elements.pCardElement.textContent = coin.name;
    elements.btnCard.setAttribute('data-bs-target', `#collapse_${coin.id}`);
}
function toggleCard(card) {
    console.log('toggleCard', card.h5CardTitle.innerText);
    if (toggledCards.includes(card.h5CardTitle.innerText)) {
        card.h5CardTitle.style.backgroundColor = 'white';
        toggledCards.pop();
    }
    else {
        card.h5CardTitle.style.backgroundColor = 'yellow';
        if (toggledCards.length <= 5) {
            let cardName = card.h5CardTitle.innerText;
            if (!toggledCards.includes(cardName)) {
                toggledCards.push(cardName);
            }
        }
        if (toggledCards.length >= 6) {
            toggledCards.pop();
            changeCoin(toggledCards, card);
            switchedCoin = card.h5CardTitle.innerText;
        }
    }
}
async function createCoins(coins, skip) {
    let hunderdCoins = coins.slice(skip, skip + 25);
    hunderdCoins.forEach((coin) => {
        let card = renderCard(coin);
        editCardText(card, coin);
        addClassCard(card, coin);
        let toggleCards = () => toggleCard(card);
        checkCard(coin.symbol, card);
        card.btnCard.addEventListener('click', async () => moreInfo(coin, card));
        card.inputFormCheck.addEventListener('click', toggleCards);
    });
}
async function moreInfo(coin, card) {
    let id = coin.id;
    let loading = card.divContainerInfoCard.querySelector('.loading');
    if (!loading) {
        loading = loadingSvg(50, 50);
        loading.classList.add('loading');
        card.divContainerInfoCard.appendChild(loading);
    }
    card.isLoading = true;
    try {
        const oneCoin = await getOneCoin(id);
        let img = new Image();
        img.classList.add('coin-img');
        img.src = oneCoin.image.small;
        img.onload = () => {
            let prevImg = card.divContainerInfoCard.querySelector('.coin-img');
            if (prevImg) {
                card.divContainerInfoCard.removeChild(prevImg);
            }
            card.divContainerInfoCard.appendChild(img);
        };
        if (oneCoin.market_data.current_price.usd) {
            card.infoCardElement.textContent = ` $${oneCoin.market_data.current_price.usd} ₪${oneCoin.market_data.current_price.ils} €${oneCoin.market_data.current_price.eur} `;
        }
        else {
            card.infoCardElement.textContent = `there is no Current Price `;
        }
        card.divContainerInfoCard.removeChild(loading);
        card.isLoading = false;
    }
    catch (error) {
        console.error('Error fetching data:', error);
        card.infoCardElement.textContent = `${error}`;
        card.divContainerInfoCard.removeChild(loading);
        card.isLoading = false;
    }
}
about?.addEventListener('click', function () {
    allCoins.innerHTML = '';
    allCoins.appendChild(ElementAbout);
    paginationContainer.style.display = 'none';
    responseDiv.style.display = 'none';
});
home?.addEventListener('click', function () {
    allCoins.innerHTML = '';
    paginationContainer.style.display = 'flex';
    chartDisplay.style.display = 'none';
    responseDiv.style.display = 'none';
    uploadCoins();
});
liveReports?.addEventListener('click', function () {
    responseDiv.innerHTML = '';
    paginationContainer.style.display = 'none';
    chartDisplay.style.display = 'block';
    allCoins.innerHTML = '';
    if (toggledCards.length === 0) {
        chartDisplay.style.display = 'none';
        let divImageLogo = document.createElement('div');
        let textLogoPlease = document.createElement('h2');
        divImageLogo.classList.add('div-logo-please');
        textLogoPlease.innerText = 'please mark at least one coin';
        divImageLogo.appendChild(textLogoPlease);
        divImageLogo.appendChild(logoPlease);
        allCoins.appendChild(divImageLogo);
    }
    else {
        renderChart(toggledCards);
        responseDiv.innerHTML = '';
    }
});
function changeCoin(toggledCards, card) {
    console.log('changeCoin', card);
    let specificCard = card;
    let overlay = document.createElement('div');
    let ContainerChangeElement = document.createElement('div');
    let headerChangeElement = document.createElement('h1');
    ContainerChangeElement.classList.add('container-change-element');
    headerChangeElement.classList.add('header-change-element');
    headerChangeElement.innerText = 'Change coin';
    overlay.appendChild(ContainerChangeElement);
    wrapperElement.appendChild(overlay);
    ContainerChangeElement.appendChild(headerChangeElement);
    toggledCards.forEach((card) => {
        overlay.classList.add('overlay');
        let cardContainer = document.createElement('div');
        cardContainer.classList.add('card-container-change-element');
        cardContainer.classList.add('card');
        let cardName = document.createElement('h3');
        cardName.classList.add('card-header-change-element');
        let cardBtn = document.createElement('button');
        cardBtn.textContent = 'Remove';
        cardBtn.className = 'btn btn-danger';
        cardName.textContent = `${card} `;
        cardContainer.appendChild(cardName);
        cardContainer.appendChild(cardBtn);
        ContainerChangeElement.appendChild(cardContainer);
        ContainerChangeElement.addEventListener('click', (event) => event.stopPropagation());
        cardBtn.addEventListener('click', function () {
            changeInputCheckbox(cardName, specificCard, overlay);
        });
    });
    overlay.addEventListener('click', (event) => {
        if (event.target !== ContainerChangeElement) {
            let allCardsPrinted = allCoins.querySelectorAll('.card-body');
            let allCardsNames = allCoins.querySelectorAll('.card-title');
            let cardNameOfAll = [];
            for (let i = 0; i < allCardsPrinted.length; i++) { }
            allCardsNames.forEach((card) => {
                cardNameOfAll.push(card.innerHTML);
            });
            indexOfCard = cardNameOfAll.indexOf(switchedCoin);
            allCardsPrinted.forEach((cardBody, index) => {
                let inputCheckbox = cardBody.querySelector('input[type="checkbox"]');
                let cardTitle = cardBody.querySelector('h5');
                if (index === indexOfCard)
                    if (inputCheckbox && cardTitle) {
                        inputCheckbox.checked = false;
                        cardTitle.style.backgroundColor = 'white';
                    }
            });
            wrapperElement.removeChild(overlay);
        }
    });
}
searchBtn.addEventListener('click', function () {
    findCoin();
});
function findCoin() {
    allCoins.innerHTML = '';
    let storedCoins = JSON.parse(localStorage.getItem('allCoins') || '[]');
    let filteredCoins = storedCoins.filter((coin) => coin.symbol.includes(searchInput.value));
    filteredCoins.forEach((coin) => {
        let newCard = renderCard(coin);
        editCardText(newCard, coin);
        addClassCard(newCard, coin);
        let toggleCards = () => toggleCard(newCard);
        newCard.btnCard.addEventListener('click', async () => moreInfo(coin, newCard));
        newCard.inputFormCheck.addEventListener('click', toggleCards);
        for (let i = 0; i < toggledCards.length; i++) {
            console.log(coin.symbol);
            console.log(toggledCards[i]);
            if (coin.symbol === toggledCards[i]) {
                console.log(1);
                newCard.inputFormCheck.checked = true;
                newCard.h5CardTitle.style.backgroundColor = 'yellow';
            }
        }
    });
}
function checkCard(cardName, card) {
    let cardNameCheck = cardName;
    if (toggledCards.includes(cardNameCheck)) {
        card.inputFormCheck.checked = true;
        card.h5CardTitle.style.backgroundColor = 'yellow';
    }
}
let indexOfCard = 0;
function changeInputCheckbox(cardName, card, moduleContainer) {
    console.log('changeInputCheckbox', cardName);
    let allCardsPrinted = allCoins.querySelectorAll('.card-body');
    let allCardsNames = allCoins.querySelectorAll('.card-title');
    let cardNameOfAll = [];
    console.log(cardName.innerText);
    if (toggledCards.includes(cardName.innerText)) {
        toggledCards.splice(toggledCards.indexOf(cardName.innerText), 1, switchedCoin);
        console.log({ toggledCards });
    }
    for (let i = 0; i < allCardsPrinted.length; i++) { }
    allCardsNames.forEach((card) => {
        cardNameOfAll.push(card.innerHTML);
    });
    indexOfCard = cardNameOfAll.indexOf(cardName.innerText);
    allCardsPrinted.forEach((cardBody, index) => {
        let inputCheckbox = cardBody.querySelector('input[type="checkbox"]');
        let cardTitle = cardBody.querySelector('h5');
        if (index === indexOfCard)
            if (inputCheckbox && cardTitle) {
                inputCheckbox.checked = false;
                cardTitle.style.backgroundColor = 'white';
            }
    });
    indexOfCard = 0;
    switchedCoin = '';
    wrapperElement.removeChild(moduleContainer);
}
