import { fetchGif, fetchWeather } from "./fetch.js";
import { renderToday, renderWeek, setupUI } from "./renderWeather.js";
import "./style.css"
import { coffeeConditions } from "./weather-data-type.js";




console.log("Hello Odin!");
///////////-------------------------------------------------

async function search(city) {
    try {
      const data = await fetchWeather(city)
      const today = data.days[0]

      const keyword = coffeeConditions.includes(today.icon) ? 'coffee' : 'cats'
      
      const gifPromise = fetchGif(keyword)
      console.log(data)
      const gifUrl = await gifPromise
      console.log(gifUrl)

      renderToday(today, gifUrl)
      renderWeek(data.days)
    } catch (err) {
      console.error(err)
    }
  }


//   await search('amiens')

setupUI(search)
