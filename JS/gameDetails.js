const params = new URLSearchParams(window.location.search)
const gameID = params.get('id')
let gameData

const RAWG_API_KEY = '9c59c01718d04f95acbd8ce9e7bb5781'

async function fetchGame() {
	console.log(gameID)
	if (gameID) {
		try {
			let response
			let result
			const storageKey = `game_${gameID}`
			const cachedGame = localStorage.getItem(storageKey)
			// Locally stored featured games
			if (gameID.includes('featured')) {
				response = await fetch('../Data/featured-games.json')
				result = await response.json()
				console.log(result.results[5])
				gameData = result.results[gameID.at(-1)]
				console.log('Featured Game: ' + gameData)
			} else if (cachedGame) { // If game is not already in local storage, Dynamic fetch to RAWG API
				gameData = JSON.parse(cachedGame)
				console.log('Local storage fetch: ' + JSON.stringify(gameData))
			} else {
				response = await fetch(`https://api.rawg.io/api/games/${gameID}?key=${RAWG_API_KEY}`)
				result = await response.json()
				gameData = result
				// Store fetched RAWG data in local storage
				console.log('Stored in localStorage: ' + JSON.stringify(gameData))
				localStorage.setItem(storageKey, JSON.stringify(gameData))
				if (!response.ok) {
					throw new Error(`Response status: ${response.status}`)
				}
			}
			// Final step, invoke function that will use the game details data, now stored in gameData
			renderGameDetails()
			renderChart()
		} catch (error) {
			console.error(error.message)
		}
	}
}
function renderGameDetails() {
	const gameTitleTag = document.getElementById('gameTitleTag')
	const coverArtImgTag = document.getElementById('coverArtImgTag')
	const gameDescTag = document.getElementById('gameDescTag')
	const releaseDateHeaderTag = document.getElementById('releaseDateHeaderTag')
	const releaseDateDataTag = document.getElementById('releaseDateDataTag')
	const gameGenresTag = document.getElementById('gameGenresTag')
	const gameTags = document.getElementById('gameTags')
	const developerTag = document.getElementById('developerTag')

	const gameReleaseDate = gameData.released || gameData.updated
	const date = new Date(gameReleaseDate)
	const formattedDate = date.toLocaleString('en-us', {
		year: "numeric",
		month: "long",
		day: "numeric"
	})

	for (i = 0; i < gameData.genres.length; i++) {
		const genreElement = document.createElement('dd')
		genreElement.innerHTML = gameData.genres[i].name
		gameGenresTag.appendChild(genreElement)
	}
	for (i = 0; i < gameData.tags.length; i++) {
		const tagsElement = document.createElement('dd')
		tagsElement.innerHTML = '#' + gameData.tags[i].name
		gameTags.appendChild(tagsElement)
	}

	gameTitleTag.innerHTML = gameData.name
	coverArtImgTag.src = gameData.background_image
	gameDescTag.innerHTML = gameData.description
	releaseDateHeaderTag.innerHTML = gameData.released ? 'Release Date' : 'Last Updated at'
	releaseDateDataTag.innerHTML = formattedDate
	developerTag.innerHTML = gameData.developers.at(-1).name
}
function renderChart() {
	console.log(typeof gameData.rating)
	
	const options = {
		  chart: {
			type: 'bar',
			height: '100%',
			foreColor: 'whitesmoke',
			background: 'transparent',
			toolbar: {
				show: false
			}
		},
		series: [{
			name: 'Rating',
			data: [gameData.rating]
		}],
		xaxis: {
			categories: ['Rating'],
		},
		yaxis: { min: 0, max: 5 },
		colors: ['darkcyan']
	}
	new ApexCharts(document.getElementById("bar-graph"), options).render()
}