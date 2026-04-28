

export function setupUI(onSearch) {
    const body = document.querySelector('body')
///
    const header = document.createElement('header')

    const title = document.createElement('h1')
    title.textContent = 'Should I go for a coffee walk?'
    header.append(title)
//
    const searchDiv = document.createElement('div')
    searchDiv.classList.add('search-box')

    const labelSearch = document.createElement('label')
    labelSearch.setAttribute('for', 'input-search')
    labelSearch.textContent = 'Enter a city'
    const inputElement = document.createElement('input')
    inputElement.setAttribute('name', 'input-search')
    inputElement.setAttribute('id', 'input-search')
    inputElement.setAttribute('type', 'text')
    inputElement.classList.add('input-search')

    const btnSearch = document.createElement('button')
    btnSearch.classList.add('btn-search')
    btnSearch.textContent = 'SEARCH'
    btnSearch.addEventListener('click', ()=> {
        onSearch(inputElement.value)
    })

    searchDiv.append(labelSearch, inputElement, btnSearch)
//
    const cardContainer = document.createElement('div')
    cardContainer.classList.add('container')

    body.append(header, searchDiv, cardContainer)
}

export function createCard(day, isToday , gifUrl = null) {

    const card = document.createElement('div');
    card.classList.add("card")
    card.classList.add(isToday ? 'today' : 'week-day')
    
    const datetime = document.createElement('p')
    let date = new Date (day.datetime)
    date = dateFns.format(date, isToday? 'EEEE dd MMMM yyyy' : 'EEE dd MMM')

    datetime.textContent = date
    datetime.classList.add('date')

    
    const srcIconBase = 'icons/monochrome/'
    const iconElement =document.createElement('img')
    iconElement.classList.add('icon')
    iconElement.src = `${srcIconBase}${day.icon}.svg`
    const imgAlt = day.icon.replace("-", " ")
    iconElement.alt = `${imgAlt} icon`
    
    const conditions = document.createElement('p')
    conditions.textContent = day.conditions
    conditions.classList.add('conditions')
    
    const temp = document.createElement('p')
    temp.textContent = `${day.temp}°C`
    temp.classList.add('temp')
    
    card.append(datetime,iconElement,conditions, temp)
    
    if (isToday) {
        const gifElement = document.createElement('img')
        gifElement.classList.add('gif')
        gifElement.src = gifUrl

        const tempMinMax = document.createElement('div')
        tempMinMax.classList.add('temp-min-max')
    
        const tempmax = document.createElement('p')
        tempmax.textContent = `${day.tempmax}°C max`
        tempmax.classList.add('tempmax')
        tempMinMax.append(tempmax)
    
        const tempmin = document.createElement('p')
        tempmin.textContent = `${day.tempmin}°C min`
        tempmin.classList.add('tempmin')
        tempMinMax.append(tempmin)
        
        const sunRiseSet = document.createElement('div')
        sunRiseSet.classList.add('sunrise-sunset')
    
        const sunrise = document.createElement('p')
        sunrise.textContent = `Sunrise - ${day.sunrise.slice(0,5)}`
        sunrise.classList.add('sunrise')
        sunRiseSet.append(sunrise)
    
        const sunset = document.createElement('p')
        sunset.textContent = `Sunset - ${day.sunset.slice(0,5)}`
        sunset.classList.add('sunset')
        sunRiseSet.append(sunset) 
        
        card.append(sunRiseSet, tempMinMax, gifElement)
    }

    
    return card

}

export function renderToday(day, gifUrl) {
    const container = document.querySelector('.container')
    container.replaceChildren()
    const card = createCard(day, true, gifUrl)
    container.append(card)
}


export function renderWeek(days) {
    const container = document.querySelector('.container')
    const nextWeek = days.slice(1)
    const nextWeekElement =[]
    nextWeek.forEach(day => {
        const card = createCard(day, false)
        nextWeekElement.push(card)
    });
    container.append(...nextWeekElement)
}