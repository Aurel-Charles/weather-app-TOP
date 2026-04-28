

export function setupUI({ onSearch, onUnitChange }) {
    const body = document.querySelector('body')
/// Header
    const header = document.createElement('header')

    const title = document.createElement('h1')
    title.textContent = 'Should I go for a coffee walk?'
    header.append(title)
// Cta and input
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
    // action
    btnSearch.addEventListener('click', ()=> {
        onSearch(inputElement.value)
    })
    // unit selector
    const unitDiv = document.createElement('div')
    unitDiv.classList.add('unit')

    const unitSelector = document.createElement('select')
    unitSelector.setAttribute('name', 'unit')
    unitSelector.setAttribute('id', 'unit')

    const optionCelcius = document.createElement('option')
    optionCelcius.value = 'metric'
    optionCelcius.textContent = '°C'
    const optionFarenheit = document.createElement('option')
    optionFarenheit.value = 'us'
    optionFarenheit.textContent = '°F'

    unitSelector.append(optionCelcius, optionFarenheit)
    unitDiv.append(unitSelector)
    
    unitSelector.addEventListener('change', (e)=> {
        let newUnit = e.target.value
        onUnitChange(newUnit)
    } )


    searchDiv.append(labelSearch, inputElement, btnSearch , unitDiv)
//
    const cardContainer = document.createElement('div')
    cardContainer.classList.add('container')

    body.append(header, searchDiv, cardContainer)
}

export async function createCard(day, isToday, unit, gifUrl = null) {
    const degreeValue = unit === 'metric' ? '°C' : '°F'

    const card = document.createElement('div');
    card.classList.add("card")
    card.classList.add(isToday ? 'today' : 'week-day')
    
    const datetime = document.createElement('p')
    let date = new Date (day.datetime)
    date = dateFns.format(date, isToday? 'EEEE dd MMMM yyyy' : 'EEE dd MMM')

    datetime.textContent = date
    datetime.classList.add('date')

    
    const srcIconBase = './icons/monochrome/'
    const iconElement =document.createElement('img')
    iconElement.classList.add('icon')
    iconElement.src = ( await import(`${srcIconBase}${day.icon}.svg`)).default
    
    const imgAlt = day.icon.replace("-", " ")
    iconElement.alt = `${imgAlt} icon`
    
    const conditions = document.createElement('p')
    conditions.textContent = day.conditions
    conditions.classList.add('conditions')
    
    const temp = document.createElement('p')
    temp.textContent = `${day.temp}${degreeValue}`
    temp.classList.add('temp')
    
    card.append(datetime,iconElement,conditions, temp)
    
    if (isToday) {
        const gifElement = document.createElement('img')
        gifElement.classList.add('gif')
        gifElement.src = gifUrl

        const tempMinMax = document.createElement('div')
        tempMinMax.classList.add('temp-min-max')
    
        const tempmax = document.createElement('p')
        tempmax.textContent = `${day.tempmax}${degreeValue} max`
        tempmax.classList.add('tempmax')
        tempMinMax.append(tempmax)
    
        const tempmin = document.createElement('p')
        tempmin.textContent = `${day.tempmin}${degreeValue} min`
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

export async function renderToday(day, gifUrl, unit) {    
    const container = document.querySelector('.container')
    container.replaceChildren()
    const card = await createCard(day, true,unit, gifUrl)
    container.append(card)
}


export async function renderWeek(days, unit) {
    const container = document.querySelector('.container')
    const nextWeek = days.slice(1)
    const promiseCards =  nextWeek.map(day => (createCard(day, false,unit)))
    const cards = await Promise.all(promiseCards)
    container.append(...cards)
}


export function renderError(err) {
    console.error(err)
    let message
    if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        message = 'Network error — check your connection'
    } else if (err.message.includes('Weather') && err.message.includes('400')) {
        message = 'City not found — check spelling'
    } else {
        message = 'Something went wrong'
    }
  
    const container = document.querySelector('.container')
    container.replaceChildren()

    const errorElement = document.createElement('div')
    errorElement.classList.add('error-message')
    errorElement.textContent = message
    container.append(errorElement)
}