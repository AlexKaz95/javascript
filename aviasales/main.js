'use strict'

//константы

const formSearch = document.querySelector('.form-search'),
    inputCitiesFrom = document.querySelector('.input__cities-from'),
    dropdownCitiesFrom = document.querySelector('.dropdown__cities-from'),
    inputCitiesTo = document.querySelector('.input__cities-to'),
    dropdownCitiesTo = document.querySelector('.dropdown__cities-to'),
    inputDateDepart = document.querySelector('.input__date-depart'),
    cheapestTicket = document.getElementById('cheapest-ticket'),
    otherCheapTickets = document.getElementById('other-cheap-tickets');

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
            return lowCaseItem.startsWith(input.value.toLowerCase());
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
    cheapestTicket.insertAdjacentHTML('afterbegin', '<h2>Самый дешевый билет на выбранную дату</h2>');
    cheapTicket.sort((a,b) => a.value - b.value);
    const ticket = createCard (cheapTicket[0]);
    cheapestTicket.append(ticket);
}

function renderCheapTicket (cheapTicket){
    cheapestTicket.insertAdjacentHTML('afterbegin', '<h2>Дешевые билеты на другие даты</h2>');
    for (let i = 0; i < cheapTicket.length && i < 10; i++){
        const ticket = createCard(cheapTicket[i]);
        otherCheapTickets.append(ticket);
    }

}

function getDateDepart (date) {
    return new Date(date).toLocaleString('ru', {year: 'numeric', month: 'long', day: 'numeric'});
}

function getCitiesName (code) {
    return cities.find((item) => item.code === code).name;
}

function getNumberOfChanges(num) {
    if (num) {
        return num === 1 ? 'Одна пересадка' : 'Две пересадки';
    } else {
        return 'Без пересадок';
    }
}

function getLinkAviasales (data) {
    let day = new Date(data.depart_date).getDate();
    let month = new Date(data.depart_date).getMonth()+1;
    if(day < 10) day = '0' + day;
    if(month < 10) month = '0' + month;
   return `https://www.aviasales.ru/search/${data.origin}${day}${month}${data.destination}1`;
}

function createCard (data) {
    const ticket = document.createElement('article');
    ticket.classList.add('ticket');

    let deep = '';
    console.log(data);
    if (data) {
        deep = `
        <h3 class="agent">${data.gate}</h3>
        <div class="ticket__wrapper">
            <div class="left-side">
                <a href="${getLinkAviasales(data)}" target="_blank" class="button button__buy">Купить
                    за ${data.value}₽</a>
            </div>
            <div class="right-side">
                <div class="block-left">
                    <div class="city__from">Вылет из города
                        <span class="city__name">${getCitiesName(data.origin)}</span>
                    </div>
                    <div class="date">${getDateDepart(data.depart_date)}</div>
                </div>
        
                <div class="block-right">
                    <div class="changes">${getNumberOfChanges(data.number_of_changes)}</div>
                    <div class="city__to">Город назначения:
                        <span class="city__name">${getCitiesName(data.destination)}</span>
                    </div>
                </div>
            </div>
        </div>`;
    } else {
        deep = '<h3>Билетов на текущую дату не нашлось...</h3>'
    }

    ticket.insertAdjacentHTML('afterbegin', deep);

    return ticket;
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

    cheapestTicket.textContent = '';

    const formData = {
        from: cities.find(item => inputCitiesFrom.value === item.name),
        to: cities.find(item => inputCitiesTo.value === item.name),
        when: inputDateDepart.value,
    };

    if (formData.from && formData.to) {
        const requestData = `${proxy}${calendar}?depart_date=${formData.when}&origin=${formData.from.code}&destination=${formData.to.code}&one_way=true&`;

        getData (requestData, (response) => {
            renderCheap (response, formData.when);
        });
    } else {
        console.error('Ошибка в названии города');
    }
});

//вызовы функций

getData (proxy + citiesApi, (data) => {
    cities = (JSON.parse(data)).filter((item) => item.name);

    cities.sort((a,b) => {
        if (a.name > b.name) {return 1;}
        if (a.name < b.name) {return -1;}
        return 0;
    });
});


