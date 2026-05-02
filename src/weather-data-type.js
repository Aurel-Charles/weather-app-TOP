export const coffeeConditions = [
    'clear-day',
    'clear-night',
    'partly-cloudy-day',
    'partly-cloudy-night',
    'cloudy',
]

export const rainConditions = [
    'rain',
    'showers-day',
    'showers-night',
    'rain-snow',
    'rain-snow-showers-day',
    'rain-snow-showers-night',
    'thunder',
    'thunder-rain',
    'thunder-showers-day',
    'thunder-showers-night',
    'snow',
    'snow-showers-day',
    'snow-showers-night',
    'sleet',
    'hail',
    'fog',
    'wind',
]


const terms = {
    coffee: ['coffee', 'cozy', 'cafe'],
    rain:   ['rain', 'storm', 'umbrella'],
  }


export function pickSearchTerm(condition) {
    const category = coffeeConditions.includes(condition) ? 'coffee' : 'rain'
    const pickedTermsCategory = terms[category]
    let randomPosition = Math.floor(Math.random() * pickedTermsCategory.length)
    const keyword = pickedTermsCategory[randomPosition]

    
    return {keyword , category}
}