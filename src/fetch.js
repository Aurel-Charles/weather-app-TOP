const urlBaseWeather = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/'
const keyWeather = process.env.OPENWEATHER_API_KEY

const urlBaseGif = 'https://api.giphy.com/v1/gifs/translate?'
const keyGif = process.env.GIFY_API_KEY

export async function fetchWeather(address, metric) {
    const fullUrl  = `${urlBaseWeather}${address}?key=${keyWeather}&${metric}`
    const response = await fetch(fullUrl)
    if (!response.ok) {
        throw new Error(`Weather HTTP error! status: ${response.status}`)
    }
    let dataWeather = await response.json()
    let dataApp = {
        address: dataWeather.resolvedAddress,
        days: dataWeather.days.slice(0,8).map((day)=> {
                return {
                    datetime: day.datetime,
                    conditions: day.conditions,
                    temp: day.temp,
                    tempmin: day.tempmin,
                    tempmax: day.tempmax,
                    sunrise: day.sunrise,
                    sunset: day.sunset,
                    icon: day.icon,
                }
            })
    }
    return dataApp
}

export async function fetchGif(search) {
    const fullUrlGif = `${urlBaseGif}api_key=${keyGif}&s=${search}`
    const response = await fetch(fullUrlGif)
    if (!response.ok) {
        throw new Error(`GIPHY HTTP error! status: ${response.status}`)
    }
    const dataGif = await response.json()
    const gifUrl = dataGif.data.images.original.url
    return gifUrl
}