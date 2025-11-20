let gamesData

async function fetchGames() {
	try {
		const response = await fetch('../Data/indie-games.json')
		if (!response.ok) {
			throw new Error(`Response status: ${response.status}`)
		}
		const result = await response.json()
		const gameResults = result.results
		// Filter to exclude innappropriate games
		const filteredGames = gameResults.filter(game => 
			(!game.esrb_rating || game.esrb_rating.slug !== "adults-only") && (game.added < 5000) && !game.tags.some(tag => tag.name === "Nudity")
		)
		gamesData = filteredGames
		console.log(gamesData)
		renderGameCard()
	} catch (error) {
		console.error(error.message)
	}
}

function renderGameCard() {
	const cardGridContainer = document.getElementById('cardGridContainerTag')	
	for (i = 0; i < gamesData.length; i++) {
		const gameCard = document.createElement('div')
		const gameCardTitle = document.createElement('h3')
		const gameCardImage = document.createElement('img')

		gameCard.dataset.gameID = gamesData[i].id
		gameCardTitle.innerHTML = gamesData[i].name
		gameCardImage.src = gamesData[i].background_image
		gameCard.addEventListener('click', (event) => onGameCardClick(event))

		cardGridContainer.appendChild(gameCard)
		gameCard.appendChild(gameCardTitle)
		gameCard.appendChild(gameCardImage)
	}
}
async function onGameCardClick(event) {
	console.log(event.currentTarget.dataset.gameID)
	window.location.href = `gameDetails.html?id=${event.currentTarget.dataset.gameID}`
}