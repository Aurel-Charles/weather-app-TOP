const urlBaseWeather = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/'
const keyWeather = process.env.OPENWEATHER_API_KEY

const urlBaseGif = 'https://api.giphy.com/v1/gifs/search?'
const keyGif = process.env.GIFY_API_KEY

const urlBaseGeoReverse = "https://nominatim.openstreetmap.org/reverse?"

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
    const fullUrlGif = `${urlBaseGif}api_key=${keyGif}&q=${encodeURIComponent(search)}&limit=25`
    const response = await fetch(fullUrlGif)
    if (!response.ok) {
        throw new Error(`GIPHY HTTP error! status: ${response.status}`)
    }
    const dataGif = await response.json()
    if (dataGif.data.length === 0 ) {
        throw new Error(`No GIF found for "${search}"`)
    }
    const randomGif = dataGif.data[Math.floor(Math.random() * dataGif.data.length)]
    
    const gifUrl = randomGif.images.original.url
    return gifUrl
}


export async function fetchAddressFromCoords(lat, lon) {
    const response = await fetch(`${urlBaseGeoReverse}lat=${lat}&lon=${lon}&format=json`)
    if (!response.ok) {
        throw new Error(`Nominatim HTTP error! status: ${response.status}`)
    }
    const addressData = await response.json()

    const addressFromCoord = `${addressData.address.city || addressData.address.town || addressData.address.village}, ${addressData.address.state}, ${addressData.address.country}`

    
    return addressFromCoord
    }

