import { buildConditions, buildTitle,buildTodayDate, buildGif, buildIcon, buildSunRiseSet, buildTemp, buildTempMinMax, buildWalkSentence, buildWeekDate } from "./renderWeatherElement.js"

function makeIcon(iconName) {
    const icon = document.createElement('span')
    icon.textContent = iconName
    icon.classList.add('material-symbols-outlined')
    return icon
}

export function setupUI({ onSearch, onUnitChange , onGeoLocate}) {
    const body = document.querySelector('body')
/// Header(title)
    const header = document.createElement('header')

    const title = document.createElement('h1')
    title.textContent = 'Should I go for a coffee walk?'

    const coffeeIcon = document.createElement('span')
    coffeeIcon.textContent = 'coffee'
    coffeeIcon.classList.add('material-symbols-outlined')
    header.append(coffeeIcon, title )
// Search Box
    //input
    const searchDiv = document.createElement('div')
    searchDiv.classList.add('search-box')

    const inputElement = document.createElement('input')
    inputElement.setAttribute('placeholder','Enter a city')
    inputElement.setAttribute('name', 'input-search')
    inputElement.setAttribute('id', 'input-search')
    inputElement.setAttribute('type', 'text')
    inputElement.classList.add('input-search')

    const btnSearch = document.createElement('button')
    btnSearch.classList.add('btn-search')
    btnSearch.textContent = 'SEARCH'
    // action search
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
    
    //action unit
    unitSelector.addEventListener('change', (e)=> {
        let newUnit = e.target.value
        onUnitChange(newUnit)
    } )

    //geolocate
    const btnGeoLocate = document.createElement('button')
    btnGeoLocate.classList.add('btn-geoloc')

    //action geolocate
    const spanIconGeoloc = document.createElement('span')
    spanIconGeoloc.classList.add('material-symbols-outlined')
    spanIconGeoloc.textContent = 'my_location'
    btnGeoLocate.append(spanIconGeoloc)
    btnGeoLocate.addEventListener('click', ()=> {
        onGeoLocate()
    })

    searchDiv.append(inputElement, btnSearch, btnGeoLocate , unitDiv)
//
    const cardContainer = document.createElement('div')
    cardContainer.classList.add('container')

    const iconQuestion = document.createElement('div')
    iconQuestion.classList.add('icon-question')
    const coffeeIcon2 = makeIcon('coffee')
    const walkIcon = makeIcon('directions_walk')
    const addIcon = makeIcon('add_2')
    const question_mark = makeIcon('question_mark')
    const parenthesesL = document.createElement('p')
    parenthesesL.textContent = ('(')
    const parenthesesR = document.createElement('p')
    parenthesesR.textContent = (')')

    iconQuestion.append(parenthesesL,coffeeIcon2,addIcon, walkIcon, parenthesesR, question_mark)   
    
    cardContainer.append(iconQuestion)
    

    const loadingOverlay = document.createElement('div')
    loadingOverlay.classList.add('loading-overlay','hidden')
    loadingOverlay.setAttribute('id', 'loading-overlay')
    const loadingIcon = makeIcon('cycle')
    loadingIcon.classList.add('loading-icon')
    loadingOverlay.append(loadingIcon)

    const wrapper  = document.createElement('div')
    wrapper.classList.add('wrapper')
    wrapper.append(cardContainer, loadingOverlay)
    
    body.append(header, searchDiv,wrapper)
}

export async function createTodayCard(day, unit, gifUrl, category, address) {
    const card = document.createElement('div')
    card.classList.add('card', 'today')

    const iconUrl = (await import(`./icons/monochrome/${day.icon}.svg`)).default

    if (address) card.append(buildTitle(address))

    card.append(
        buildTodayDate(day),
        buildIcon(iconUrl, day.icon),
        buildTemp(day, unit),
        buildConditions(day),
        buildWalkSentence(category),
        buildGif(gifUrl),
        buildSunRiseSet(day),
        buildTempMinMax(day, unit)
    )

    return card
}

export async function createDayCard(day, unit) {
    const card = document.createElement('div')
    card.classList.add('card', 'week-day')

    const iconUrl = (await import(`./icons/monochrome/${day.icon}.svg`)).default

    card.append(
        buildWeekDate(day),
        buildIcon(iconUrl, day.icon),
        buildConditions(day),
        buildTemp(day, unit),
    )

    return card
}



export async function renderToday(day, gifUrl, unit, category, address) {    
    const container = document.querySelector('.container')
    container.replaceChildren()
    const card = await createTodayCard(day, unit, gifUrl, category, address)
    container.append(card)
}


export async function renderWeek(days, unit) {
    const container = document.querySelector('.container')
    const nextWeek = days.slice(1)
    const promiseCards = nextWeek.map(day => createDayCard(day, unit))
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
    } else if (err.message.includes('Geolocation')) {
        message = 'Location access denied — enable it or type a city'
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


export function toggleLoading(isLoading) {
    const loadingElement = document.querySelector('#loading-overlay')
    if (!loadingElement) {
        console.warn('loading-overlay not found in DOM')
        return
    }
    loadingElement.classList.toggle('hidden', !isLoading)
}