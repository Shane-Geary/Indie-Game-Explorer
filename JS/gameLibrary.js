import { activeNavLink } from '../JS/utils.js'

activeNavLink('Library')

let gamesData

// Fetch locally stored featured game data, filter, and concat featured-games.json with indie-games.json
async function fetchGames() {
	try {
		const [featuredGames, indieGames] = await Promise.all([
			fetch('../Data/featured-games.json')
			.then(response => {
				if (!response.ok) {
					throw new Error(`Response status: ${response.status}`)
				}
				return response.json()
			}),
			fetch('../Data/indie-games.json')
			.then(response => {
				if (!response.ok) {
					throw new Error(`Response status: ${response.status}`)
				}
				return response.json()
			})
		])
		// Filter out innappropriate games, and games with more than 5000 'added' value attributes 
		const filteredGames = indieGames.results.filter(game => 
			(!game.esrb_rating || game.esrb_rating.slug !== "adults-only") && (game.added < 5000) && !game.tags.some(tag => tag.name === "Nudity")
		)
		let gameResults = featuredGames.results.concat(filteredGames)
		gamesData = gameResults
		console.log(gamesData)
		renderGameCard()
	} catch (error) {
		console.error(error.message)
	}
}
// onLoad of document, invoke fetch function
window.addEventListener('DOMContentLoaded', () => {
	fetchGames()
})
// Populate gamelibrary grid section with concatenated games data
function renderGameCard() {
	const cardGridContainer = document.getElementById('cardGridContainerTag')
	// Create elements for each card aspect
	for (let i = 0; i < gamesData.length; i++) {
		const gameCard = document.createElement('div')
		const gameCardTitle = document.createElement('h3')
		const gameCardImage = document.createElement('img')

		// Differentiate between featured games and others by adding dataset attribute of gameID to element
		if (i <= 5) {
			gameCard.dataset.gameID = `featured-${i}`
		} else {
			gameCard.dataset.gameID = gamesData[i].id
		}
		// Populate elements with data, add event listeners
		gameCardTitle.innerHTML = gamesData[i].name
		gameCardImage.src = gamesData[i].background_image
		gameCard.addEventListener('click', (event) => onGameCardClick(event), {passive: true})

		// Append elements to parent containers
		cardGridContainer.appendChild(gameCard)
		gameCard.appendChild(gameCardTitle)
		gameCard.appendChild(gameCardImage)
	}
}
// Navigate to gamedetails page, storing gameID in URL params
function onGameCardClick(event) {
	window.location.href = `gameDetails.html?id=${event.currentTarget.dataset.gameID}`
}