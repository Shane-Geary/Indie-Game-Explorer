const params = new URLSearchParams(window.location.search)
const gameID = params.get('id')
let gameData

const RAWG_API_KEY = '9c59c01718d04f95acbd8ce9e7bb5781'

async function fetchGame() {
	console.log(gameID)
	
	if (gameID) {
		try {
			// const response = await fetch(`https://api.rawg.io/api/games/${gameID}?key=${RAWG_API_KEY}`)
			let response
			let result
			let storageKey
			// Locally stored featured games
			if (gameID.includes('featured')) {
				response = await fetch('../Data/featured-games.json')
				result = await response.json()
				gameData = result.results[gameID.at(-1)]
			} else { // Dynamic fetch to RAWG API
				storageKey = `game_${gameID}`
				const cachedGame = localStorage.getItem(storageKey)
				if (cachedGame) {
					console.log('Local storage fetch: ' + storageKey)
					gameData = JSON.parse(cachedGame)
					return
				}
				// response = await fetch(`https://api.rawg.io/api/games/${gameID}?key=${RAWG_API_KEY}`)
				result = await response.json()
				gameData = result
			}
			if (!response.ok) {
				throw new Error(`Response status: ${response.status}`)
			}
			console.log('Stored in localStorage: ' + gameData)
			localStorage.setItem(storageKey, JSON.stringify(gameData))
			renderGameDetails()
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
		tagsElement.innerHTML = gameData.tags[i].name
		gameTags.appendChild(tagsElement)
	}

	gameTitleTag.innerHTML = gameData.name
	coverArtImgTag.src = gameData.background_image
	gameDescTag.innerHTML = gameData.description
	releaseDateHeaderTag.innerHTML = gameData.released ? 'Release Date' : 'Last Updated at'
	releaseDateDataTag.innerHTML = formattedDate	
}