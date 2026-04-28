import { fetchGif, fetchWeather } from "./fetch.js";
import { renderError, renderToday, renderWeek, setupUI } from "./renderWeather.js";
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

setupUI({
    onSearch: search,           // clé "onSearch", valeur = fonction search
    onUnitChange: unitChange    // clé "onUnitChange", valeur = fonction unitchange
})