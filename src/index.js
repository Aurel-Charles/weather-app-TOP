import { fetchAddressFromCoords, fetchGif, fetchWeather } from "./fetch.js";
import { renderError, renderToday, renderWeek, setupUI, toggleLoading } from "./renderWeather.js";
import "./style.css"
import { coffeeConditions } from "./weather-data-type.js";




console.log("Hello Odin!");
///////////-------------------------------------------------
let currentCity = null
let currentUnit = 'metric'

async function search(city) {
    try {
      toggleLoading(true)


      const data =  await fetchWeather(city, `unitGroup=${currentUnit}`)
      currentCity = city
      const today = data.days[0]

      const keyword = coffeeConditions.includes(today.icon) ? 'coffee' : 'rain'
      
      const gifPromise = fetchGif(keyword)
      console.log(data)
      const gifUrl = await gifPromise
      console.log(gifUrl)
      await renderToday(today, gifUrl, currentUnit, keyword, data.address)
      await renderWeek(data.days, currentUnit)

      const wait = ms => new Promise(resolve => setTimeout(resolve, ms))
      await wait(1000)

    } catch (err) {
      renderError(err)
    } finally{
        toggleLoading(false)
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
            const address = await fetchAddressFromCoords(latitude, longitude)
            search(address)

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