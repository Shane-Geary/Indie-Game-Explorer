import { activeNavLink } from '../JS/utils.js'

activeNavLink('Game Details')

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
			renderAddedBarGraph()
			renderRatingsCountBarGraph()
			renderPieChart()
		} catch (error) {
			console.error(error.message)
		}
	}
}
window.addEventListener('DOMContentLoaded', () => {
	fetchGame()
})
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

	// for (gameData)
	for (let i = 0; i < gameData.genres.length; i++) {
		const genreElement = document.createElement('dd')
		genreElement.innerHTML = gameData.genres[i].name
		gameGenresTag.appendChild(genreElement)
	}
	for (let i = 0; i < gameData.tags.length; i++) {
		const tagsElement = document.createElement('dd')
		tagsElement.innerHTML = '#' + gameData.tags[i].name
		gameTags.appendChild(tagsElement)
	}

	gameTitleTag.innerHTML = gameData.name
	coverArtImgTag.src = gameData.background_image
	gameDescTag.innerHTML = gameData.description
	releaseDateHeaderTag.innerHTML = gameData.released ? 'RELEASE DATE' : 'LAST UPDATED AT'
	releaseDateDataTag.innerHTML = formattedDate
	developerTag.innerHTML = gameData.developers.at(-1) ? gameData.developers.at(-1).name : 'Community Made Game! (No Devs/Studio)'
}
function renderAddedBarGraph() {	
	const options = {
		  chart: {
			type: 'bar',
			height: '100%',
			foreColor: 'whitesmoke',
			background: 'transparent',
			toolbar: {
				show: false
			},
		},
		series: [{
			name: 'User Popularity (Added)',
			data: [gameData.added]
		}],
		dataLabels: {
			style: {fontSize: '1.75rem'}
		},
		xaxis: {
			categories: ['User Popularity (Added)'],
			labels: {
				style: {fontSize: '1rem', colors: ['greenyellow']}
			}
		},
		yaxis: { min: 0, max: gameData.added > 5000 ? 10000 : gameData.added < 500 ? 500 : gameData.added > 1000 ? 5000 : 1000},
		colors: ['rgba(0, 235, 255, 0.9)']
	}
	new ApexCharts(document.getElementById("added-bar-graph"), options).render()
}
function renderPieChart() {
	const labelsData = gameData.ratings.map(rating => rating.title)
	const seriesData = gameData.ratings.map(rating => rating.percent)
	console.log(typeof seriesData[0])
	
	const options = {
		  chart: {
			type: 'pie',
			height: '100%',
			width: '100%',
			foreColor: 'whitesmoke',
			background: 'transparent',
			toolbar: {
				show: false
			},
		},
		plotOptions: {
			pie: {
				dataLabels: {offset: -10}
			}
		},
		title: {
			text: 'User Ratings',
			align: 'left',
			offsetY: 5,
			style: {color: 'greenyellow'}
		},
		dataLabels: {
			style: {
				fontSize: 'clamp(0.8rem, 1.2vw, 1.2rem)'
			}
		},
		labels: labelsData,
		series: seriesData,
		fill: {
			colors: ['rgba(52, 209, 191, 0.8)', 'rgba(251, 80, 18, 0.8)', 'rgba(52, 84, 209, 0.8)', 'rgba(233, 223, 0, 0.8)']
		},
		stroke: {colors: ['rgba(255, 255, 255, 0.5)']}
	}
	new ApexCharts(document.getElementById("pie-chart"), options).render()
}
function renderRatingsCountBarGraph() {	
	const options = {
		  chart: {
			type: 'bar',
			height: '100%',
			foreColor: 'whitesmoke',
			background: 'transparent',
			toolbar: {
				show: false
			},
		},
		series: [{
			name: 'User Ratings (Count)',
			data: [gameData.ratings_count]
		}],
		dataLabels: {
			style: {fontSize: '1.75rem'}
		},
		xaxis: {
			categories: ['User Ratings (Count)'],
			labels: {
				style: {fontSize: '1rem', colors: ['greenyellow']}
			}
		},
		yaxis: { min: 0, max: gameData.ratings_count > 1000 ? 5000 : gameData.ratings_count < 500 ? 500 : 1000},
		colors: ['rgba(0, 235, 255, 0.9)']
	}
	new ApexCharts(document.getElementById("ratings-bar-graph"), options).render()
}