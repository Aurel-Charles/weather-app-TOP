import "./style.css"
import { coffeeConditions } from "./weather-data-type.js";

console.log("Hello Odin!");
///////////-------------------------------------------------

const urlBase = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/'
const urlBaseGif = 'https://api.giphy.com/v1/gifs/translate?'
const urlBaseGeoReverse = "https://nominatim.openstreetmap.org/reverse?"
const keyGif = process.env.GIFY_API_KEY
const key = process.env.OPENWEATHER_API_KEY
let apiData = null
let unitGroup = 'unitGroup=metric'
let degree = '°C'

let city
const dayConditions = new Set

///////////------------ html element-------------------------------------
const searchInput = document.querySelector('.input-search')
const btnSearch = document.querySelector('.btn-search')
const cardContainer = document.querySelector('.container')
const errorElement = document.querySelector('.fetch-error')
const optionsElement = document.querySelector('#option')
const selectConditions = document.querySelector('#conditions')
const selectUnit =document.querySelector('#degree')
const loadingElement  = document.querySelector('.loading')
const btnGeoloc = document.querySelector('.btn-geoloc')

function displayCard(data, unit, filteredDays = null) {
    errorElement.textContent = ""
    optionsElement.classList.remove('hidden')
    let isFirst = true
    let count = 0
    selectConditions.replaceChildren()

    const daysToDisplay = filteredDays || data.days;
    
    const cityElement = document.createElement('h2')
    cityElement.setAttribute('id', "city")
    cityElement.textContent = `Weather broadcast in: ${data.resolvedAddress}`
    cardContainer.append(cityElement)
    
    for (const day of daysToDisplay) {
        if (count === 8) {
            return
        }
        dayConditions.add(day.conditions)

        const card = document.createElement('div');
        card.classList.add("card")
        if (isFirst) {
            card.classList.add('today')
        }

        if (isFirst) {
            const loadingGifElement = document.createElement('span')
            loadingGifElement.classList.add('material-symbols-outlined', 'loading', 'loading-gif', 'hidden')
            loadingGifElement.textContent = 'sync'

            const gifElement = document.createElement('img')
            gifElement.classList.add('gif', 'hidden')

            card.append(gifElement, loadingGifElement)

            const search = coffeeConditions.includes(day.icon) ? 'coffee' : 'rain'
            fetchGif(gifElement, search, loadingGifElement)
        }
        
        const datetime = document.createElement('p')
        let date = new Date (day.datetime)
        if (isFirst) {
            date = dateFns.format(date, 'EEEE dd MMMM yyyy')
        }
        else{
            date = dateFns.format(date, 'EEEE dd MMM')
        }
        datetime.textContent = date 
        card.append(datetime)

        const icon = document.createElement('div')
        makeIcon(day.icon, card)


        const conditions = document.createElement('p')
        conditions.textContent = day.conditions
        card.append(conditions)

        const temp = document.createElement('p')
        temp.textContent = `${day.temp}${unit}`
        card.append(temp)


        const tempMinMax = document.createElement('div')
        tempMinMax.classList.add('temp-min-max')
        card.append(tempMinMax)

        const tempmax = document.createElement('p')
        tempmax.textContent = `${day.tempmax}${unit} max`
        tempMinMax.append(tempmax)

        const tempmin = document.createElement('p')
        tempmin.textContent = `${day.tempmin}${unit} min`
        tempMinMax.append(tempmin)

        if (isFirst) {
            const sunRiseSet = document.createElement('div')
            sunRiseSet.classList.add('sunrise-sunset')
            card.append(sunRiseSet)

            const sunrise = document.createElement('p')
            sunrise.textContent = `Sunrise - ${day.sunrise.slice(0,5)}`
            sunRiseSet.append(sunrise)
    
            const sunset = document.createElement('p')
            sunset.textContent = `Sunset - ${day.sunset.slice(0,5)}`
            sunRiseSet.append(sunset)  
        }

        cardContainer.append(card);
        isFirst = false
        count ++ 
        console.log(count);
        
    }

    
    const emptyCondition = document.createElement('option')
    emptyCondition.textContent = '---'
    selectConditions.append(emptyCondition)
    for (let condition of dayConditions) {
        const newCondition = document.createElement('option')
        newCondition.textContent = condition
        newCondition.setAttribute('value', condition)
        selectConditions.append(newCondition)
    };


}

function makeIcon(iconCondition, div) {
    const srcBase = 'icons/monochrome/'
    const iconElement =document.createElement('img')
    iconElement.classList.add('icon')
    iconElement.src = `${srcBase}${iconCondition}.svg`
    let imgAlt = iconCondition.replace("-", " ")
    iconElement.alt = `${imgAlt} icon`

    div.append(iconElement)
}


async function fetchGif(imgElement, search = null, loadingGifElement) {
    try {
        loadingGifElement.classList.toggle('hidden')
        const fullUrlGif = `${urlBaseGif}api_key=${keyGif}&s=${search}`
        const response = await fetch(fullUrlGif)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const src = await response.json()
        imgElement.src = src.data.images.original.url
        imgElement.classList.toggle('hidden')
    } catch (error) {
        console.error("Error fetching the GIF:", error)
    } finally {
        loadingGifElement.classList.toggle('hidden')
    }
}


async function fetchWeatherData() {
    if (!city) return

    cardContainer.replaceChildren()
    loadingElement.classList.toggle('hidden')
    try {
        dayConditions.clear()
        const fullUrl = `${urlBase}${city}?key=${key}&${unitGroup}`

        const response = await fetch(fullUrl)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        apiData = await response.json()
        displayCard(apiData, degree)
    } catch (error) {
        if (error.message.includes('400')) {
            errorElement.textContent = "City not found, check the spelling"
        } else {
            errorElement.textContent = "Error on loading, try again"
        }
    } finally {
        loadingElement.classList.toggle('hidden')
    }
}

function search() {
    degree = '°C'
    unitGroup = 'unitGroup=metric'
    fetchWeatherData()
}

searchInput.addEventListener('input', (e)=> {
    city = e.target.value
})

btnSearch.addEventListener('click', () => {
    search()
})
searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        search()
    }
})

btnGeoloc.addEventListener('click', () => {
    async function success(position) {
        try {
            const latitude = position.coords.latitude
            const longitude = position.coords.longitude
            const response = await fetch(`${urlBaseGeoReverse}lat=${latitude}&lon=${longitude}&format=json`)
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            const geolocation = await response.json()
            city = `${geolocation.address.city || geolocation.address.town || geolocation.address.village}, ${geolocation.address.state}, ${geolocation.address.country}`
            console.log(city)
            fetchWeatherData()
        } catch (err) {
            console.error(err)
        }
    }
    navigator.geolocation.getCurrentPosition(success)
})

selectConditions.addEventListener('change', (e)=> {
    let targetCondition = e.target.value
    selectConditions.replaceChildren()
    
    let filteredDays = apiData.days.filter((day => day.conditions === targetCondition))
    cardContainer.replaceChildren()
    if (targetCondition === '---') {
        displayCard(apiData, degree)
    }
    else {
        displayCard(apiData, degree, filteredDays)
    }
    selectConditions.value = targetCondition
})

selectUnit.addEventListener('change', (e) =>{
    degree = e.target.value
    if (degree === "°C") {
        unitGroup = 'unitGroup=metric'
    }
    else{
        unitGroup = 'unitGroup=us'
    }
    cardContainer.replaceChildren()
    fetchWeatherData()
})
