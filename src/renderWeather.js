

export function setupUI({ onSearch, onUnitChange , onGeoLocate}) {
    const body = document.querySelector('body')
/// Header
    const header = document.createElement('header')

    const title = document.createElement('h1')
    title.textContent = 'Should I go for a coffee walk?'

    const coffeeIcon = document.createElement('span')
    coffeeIcon.textContent = 'coffee'
    coffeeIcon.classList.add('material-symbols-outlined')
    header.append(coffeeIcon, title )
// Cta and input
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

    const btnGeoLocate = document.createElement('button')
    btnGeoLocate.classList.add('btn-geoloc')

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

    body.append(header, searchDiv, cardContainer)
}

export async function createCard(day, isToday, unit,walk, gifUrl = null, address = null) {
    const degreeValue = unit === 'metric' ? '°C' : '°F'

    const card = document.createElement('div');
    card.classList.add("card")
    card.classList.add(isToday ? 'today' : 'week-day')
    
    const datetime = document.createElement('div')
    datetime.classList.add('date')

    const dateObj = new Date(day.datetime)
    if (isToday) {
        const dayEl = document.createElement('p')
        dayEl.textContent = dateFns.format(dateObj, 'EEEE dd MMMM yyyy')
        datetime.append(dayEl)
    } else {
        const dayEl = document.createElement('p')
        dayEl.textContent = dateFns.format(dateObj, 'eee')
        dayEl.classList.add('day')
        const numAndMonth = document.createElement('p')
        numAndMonth.textContent = dateFns.format(dateObj, 'dd MMM')
        numAndMonth.classList.add('num-and-month')
        datetime.append(dayEl, numAndMonth)
    }

    
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

    if (address) {
        card.prepend(address)
    }
    if (isToday) {
        card.append(datetime,iconElement, temp, conditions)
    }else{
        card.append(datetime,iconElement, conditions, temp)
    }
    
    if (isToday) {
        const gifElement = document.createElement('img')
        gifElement.classList.add('gif')
        gifElement.src = gifUrl

        const walkSentence = document.createElement('p')
        walkSentence.textContent = (walk === 'coffee')? 'Yes - go for a walk' : 'No - stay at home(but drink coffee!)'
        walkSentence.classList.add('walk')

        const tempMinMax = document.createElement('div')
        tempMinMax.classList.add('temp-min-max')
    
        const tempmax = document.createElement('p')
        tempmax.textContent = 'High'
        tempmax.classList.add('tempmax')
        const tempmaxValue = document.createElement('p')
        tempmaxValue.textContent = `${day.tempmax}${degreeValue}`
        tempmaxValue.classList.add('tempmax-value')

        const tempmin = document.createElement('p')
        tempmin.textContent = 'Low'
        tempmin.classList.add('tempmin')
        const tempminValue = document.createElement('p')
        tempminValue.textContent = `${day.tempmin}${degreeValue}`
        tempminValue.classList.add('tempmin-value')

        tempMinMax.append(tempmax, tempmaxValue,tempmin, tempminValue)
        

        const sunRiseSet = document.createElement('div')
        sunRiseSet.classList.add('sunrise-sunset')
    
        const sunrise = document.createElement('p')
        sunrise.textContent = 'Sunrise'
        sunrise.classList.add('sunrise')
        const sunriseValue = document.createElement('p')
        sunriseValue.textContent = `${day.sunrise.slice(0,5)}`
        sunriseValue.classList.add('sunrise-value')
    
        const sunset = document.createElement('p')
        sunset.textContent = 'Sunset'
        sunset.classList.add('sunset')
        const sunsetValue = document.createElement('p')
        sunsetValue.textContent = `${day.sunset.slice(0,5)}`
        sunsetValue.classList.add('sunset-value')

        sunRiseSet.append(sunrise, sunriseValue, sunset, sunsetValue) 
        
        card.append(walkSentence,gifElement, sunRiseSet, tempMinMax)
    }

    
    return card

}

export function createAddressTitle(address) {
    const title = document.createElement('h1')
    title.textContent = address
    title.classList.add('weather-address')
    return title
}

export async function renderToday(day, gifUrl, unit, walk, address) {    
    const addressElement =  createAddressTitle(address)
    const container = document.querySelector('.container')
    container.replaceChildren()
    const card = await createCard(day, true,unit, walk, gifUrl, addressElement)
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