import { activeNavLink } from '../JS/utils.js'

activeNavLink('Library')

let gamesData

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
window.addEventListener('DOMContentLoaded', () => {
	fetchGames()
})
function renderGameCard() {
	const cardGridContainer = document.getElementById('cardGridContainerTag')	
	for (let i = 0; i < gamesData.length; i++) {
		const gameCard = document.createElement('div')
		const gameCardTitle = document.createElement('h3')
		const gameCardImage = document.createElement('img')

		if (i <= 5) {
			gameCard.dataset.gameID = `featured-${i}`
		} else {
			gameCard.dataset.gameID = gamesData[i].id
		}
		gameCardTitle.innerHTML = gamesData[i].name
		gameCardImage.src = gamesData[i].background_image
		gameCard.addEventListener('click', (event) => onGameCardClick(event), {passive: true})

		cardGridContainer.appendChild(gameCard)
		gameCard.appendChild(gameCardTitle)
		gameCard.appendChild(gameCardImage)
	}
}
function onGameCardClick(event) {
	console.log(event)
	
	window.location.href = `gameDetails.html?id=${event.currentTarget.dataset.gameID}`
}