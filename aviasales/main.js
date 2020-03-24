'use strict'

//константы

const formSearch = document.querySelector('.form-search'),
    inputCitiesFrom = document.querySelector('.input__cities-from'),
    dropdownCitiesFrom = document.querySelector('.dropdown__cities-from'),
    inputCitiesTo = document.querySelector('.input__cities-to'),
    dropdownCitiesTo = document.querySelector('.dropdown__cities-to'),
    inputDateDepart = document.querySelector('.input__date-depart');

const citiesApi = 'http://api.travelpayouts.com/data/ru/cities.json',
    proxy = 'https://cors-anywhere.herokuapp.com/',
    API_KEY = 'f099818ff8115473231af46a9299a50f',
    calendar = 'http://min-prices.aviasales.ru/calendar_preload';

let cities = [];

//функции

function getData (url, callback) {
    const request = new XMLHttpRequest();

    request.open('GET', url);

    request.addEventListener('readystatechange', () => {
        if (request.readyState !== 4) return;

        if (request.status === 200) {
            callback(request.response);
        } else {
            console.error(request.status);
        }
    });

    request.send();
}

function showCities (input, list) {
    list.textContent = '';
    
    if (input.value === '') return;

    const filterCities = cities.filter((item) => {
            const lowCaseItem = item.name.toLowerCase(); 
            return lowCaseItem.includes(input.value.toLowerCase());
    });
    
    filterCities.forEach((item) => {
        const li = document.createElement('li');
        li.classList.add('dropdown__city');
        li.textContent = item.name;
        list.append(li);
    });
}

function selectCity (event, list, input) {
    if (event.target.tagName.toLowerCase() === 'li') {
        input.value = event.target.textContent;
        list.textContent = '';
    }
}

function renderCheap (data, date) {
    const cheapTicket = JSON.parse(data).best_prices;

    const cheapTicketDay = cheapTicket.filter((item) => {
        return item.depart_date === date;
    });

    renderCheapDay(cheapTicketDay);
    renderCheapTicket(cheapTicket);
}

function renderCheapDay (cheapTicket){

}

function renderCheapTicket (cheapTicket){

}

//обработчики событий

inputCitiesFrom.addEventListener('input', () => {
    showCities(inputCitiesFrom, dropdownCitiesFrom)
});

inputCitiesTo.addEventListener('input', () => {
    showCities(inputCitiesTo, dropdownCitiesTo)
});

dropdownCitiesFrom.addEventListener('click', (event) => {
    selectCity(event, dropdownCitiesFrom, inputCitiesFrom);
});

dropdownCitiesTo.addEventListener('click', (event) => {
    selectCity(event, dropdownCitiesTo, inputCitiesTo);
});

formSearch.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = {
        from: cities.find(item => inputCitiesFrom.value === item.name).code,
        to: cities.find(item => inputCitiesTo.value === item.name).code,
        when: inputDateDepart.value,
    };
    
    const requestData = `${proxy}${calendar}?depart_date=${formData.when}&origin=${formData.from}&destination=${formData.to}&one_way=true&`;

    getData (requestData, (response) => {
        renderCheap (response, formData.when);
    });
});

//вызовы функций

getData (proxy + citiesApi, (data) => {
    cities = (JSON.parse(data)).filter((item) => item.name);
});


