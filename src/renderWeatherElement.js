

export function buildConditions(day) {
    const conditions = document.createElement('p')
    conditions.textContent = day.conditions
    conditions.classList.add('conditions')
    return conditions
}

export function buildTemp(day, unit) {
    const temp = document.createElement('p')
    const degreeValue = unit === 'metric' ? '°C' : '°F'
    temp.textContent = `${day.temp}${degreeValue}`
    temp.classList.add('temp')
    return temp
}


export function buildWalkSentence(category){
    const walkSentence = document.createElement('p')
    walkSentence.textContent = (category === 'coffee')? 'Yes - go for a walk' : 'No - stay at home(but drink coffee!)'
    walkSentence.classList.add('walk')
    return walkSentence
}

export function buildTitle(address){
    const title = document.createElement('h1')
    title.textContent = address
    title.classList.add('weather-address')
    return title
}

export function buildGif(gifUrl) {
    const gifElement = document.createElement('img')
    gifElement.classList.add('gif')
    gifElement.src = gifUrl
    return gifElement
}

export function buildTempMinMax(day, unit){
    const degreeValue = unit === 'metric' ? '°C' : '°F'
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
    return tempMinMax
}

export function buildSunRiseSet(day){
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
    return sunRiseSet
}

export function buildTodayDate(day){
    const datetime = document.createElement('div')
    datetime.classList.add('date')
    const dateObj = new Date(day.datetime)
    const dayEl = document.createElement('p')
    dayEl.textContent = dateFns.format(dateObj, 'EEEE dd MMMM yyyy')
    datetime.append(dayEl)
    return datetime
}

export function buildWeekDate(day) {
    const datetime = document.createElement('div')
    datetime.classList.add('date')
    const dateObj = new Date(day.datetime)
    const dayEl = document.createElement('p')
    dayEl.textContent = dateFns.format(dateObj, 'eee')
    dayEl.classList.add('day')
    const numAndMonth = document.createElement('p')
    numAndMonth.textContent = dateFns.format(dateObj, 'dd MMM')
    numAndMonth.classList.add('num-and-month')
    datetime.append(dayEl, numAndMonth)
    return datetime
}

export function buildIcon(iconUrl, altText) {
    const iconElement =document.createElement('img')
    iconElement.classList.add('icon')
    iconElement.src = iconUrl
    
    const imgAlt = altText.replace("-", " ")
    iconElement.alt = `${imgAlt} icon`
    return iconElement
}