import "./style.css"
import { coffeeConditions, rainConditions } from "./weather-data-type.js";

console.log("Hello Odin!");


console.log("hello Odin");
///////////-------------------------------------------------

const urlBase = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/'
const urlBaseGif = 'https://api.giphy.com/v1/gifs/translate?'
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
// const cityElement = document.querySelector('#city')
const cardContainer = document.querySelector('.container')
const errorElement = document.querySelector('.fetch-error')
const optionsElement = document.querySelector('#option')
const selectConditions = document.querySelector('#conditions')
const selectUnit =document.querySelector('#degree')


function displayCard(data, unit, filteredDays = null) {
    errorElement.textContent = ""
    optionsElement.classList.remove('hidden')
    let isFirst = true
    selectConditions.replaceChildren()

    const daysToDisplay = filteredDays || data.days;
    console.log(daysToDisplay);
    
    const cityElement = document.createElement('h2')
    cityElement.setAttribute('id', "city")
    cityElement.textContent = `Weather broadcast in: ${data.resolvedAddress}`
    cardContainer.append(cityElement)
    
    daysToDisplay.forEach((day) => {
        
        dayConditions.add(day.conditions)
        
        const card = document.createElement('div');
        card.classList.add("card")
        if (isFirst) {
            card.classList.add('today')
        }
    
        if (isFirst) {
            const gifElement = document.createElement('img')
            gifElement.classList.add('gif')
            if (coffeeConditions.includes(day.icon)) {
                fetchGif(gifElement, 'coffee')
            }
            else {fetchGif(gifElement, 'rain')}
            card.append(gifElement)
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

        cardContainer.append(card);
        isFirst = false
    })

    
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

function fetchGif(imgElement, search = null) {
    let fullUrlGif = `${urlBaseGif}api_key=${keyGif}&s=${search}`
    fetch(fullUrlGif)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
            return response.json()
        })
        .then(response => {
            imgElement.src = response.data.images.original.url
            return imgElement
        })
        .catch((error) => {
            console.error("Error fetching the GIF:", error);
        })
    }



function fetchWeatherData() {
    if (!city) {
        return
    }
    console.log("Fetching meteo for: " + city);
    dayConditions.clear()
    const fullUrl = `${urlBase}${city}?key=${key}&${unitGroup}`
    console.log(fullUrl);
    
    fetch(fullUrl)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
            return response.json()
        })
        .then((response) => {
            apiData = response
            displayCard(apiData, degree)
        })
        .catch((error) => {
            console.error("Error fetching the image:", error);
            errorElement.textContent = "Error on loading"
        })
}

searchInput.addEventListener('input', (e)=> {
    city = e.target.value
})

btnSearch.addEventListener('click', (e) => {
    cardContainer.replaceChildren()
    degree = '°C'
    unitGroup = 'unitGroup=metric'
    fetchWeatherData()
})

selectConditions.addEventListener('change', (e)=> {
    console.log(e.target.value);
    let targetCondition = e.target.value
    selectConditions.replaceChildren()
    
    console.log(apiData);
    
    let filteredDays = apiData.days.filter((day => day.conditions === targetCondition))
    console.log(filteredDays);
    cardContainer.replaceChildren()
    displayCard(apiData, degree, filteredDays)
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
