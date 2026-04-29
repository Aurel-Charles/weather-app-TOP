import { fetchGif, fetchWeather } from "./fetch.js";
import { renderError, renderTitleWeather, renderToday, renderWeek, setupUI } from "./renderWeather.js";
import "./style.css"
import { coffeeConditions } from "./weather-data-type.js";




console.log("Hello Odin!");
///////////-------------------------------------------------
let currentCity = null
let currentUnit = 'metric'

async function search(city) {
    try {
      const data = await fetchWeather(city, `unitGroup=${currentUnit}`)
      currentCity = city
      const today = data.days[0]

      const keyword = coffeeConditions.includes(today.icon) ? 'coffee' : 'rain'
      
      const gifPromise = fetchGif(keyword)
      console.log(data)
      const gifUrl = await gifPromise
      console.log(gifUrl)

      await renderTitleWeather(data.address)
      await renderToday(today, gifUrl, currentUnit)
      await renderWeek(data.days, currentUnit)
    } catch (err) {
      renderError(err)
    }
  }

function unitChange(unit) {
    currentUnit = unit
    if (currentCity) {
        search(currentCity)
    }
}

function geoLocate() {
    async function success(position) {
        try {
            const latitude = position.coords.latitude
            const longitude = position.coords.longitude
            const urlBaseGeoReverse = "https://nominatim.openstreetmap.org/reverse?"
            const response = await fetch(`${urlBaseGeoReverse}lat=${latitude}&lon=${longitude}&format=json`)
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            const addressData = await response.json()

            const addressFromCoord = `${addressData.address.city || addressData.address.town || addressData.address.village}, ${addressData.address.state}, ${addressData.address.country}`
            search(addressFromCoord)

        } catch (err) {
            renderError(err)
        }
    }
    navigator.geolocation.getCurrentPosition(success, (error) => renderError(error))
}

setupUI({
    onSearch: search,         
    onUnitChange: unitChange,  
    onGeoLocate: geoLocate 
})