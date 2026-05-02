import { fetchAddressFromCoords, fetchGif, fetchWeather } from "./fetch.js";
import { renderError, renderToday, renderWeek, setupUI, toggleLoading } from "./renderWeather.js";
import "./style.css"
import { pickSearchTerm } from "./weather-data-type.js";
import fallbackGif from './assets/no_gif.gif'


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

      const {keyword, category} = pickSearchTerm(today.icon)
      
      let gifUrl = fallbackGif  
      try { // doesnt block the rest
          gifUrl = await fetchGif(keyword)
      } catch (err) {
          console.warn(err) 
      }

        const preloadedImg = new Image()
        preloadedImg.src = gifUrl
        try {
            await preloadedImg.decode()
        } catch {
            'if no preload ... keep going'
        }
      await renderToday(today, gifUrl, currentUnit, category, data.address)
      await renderWeek(data.days, currentUnit)

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