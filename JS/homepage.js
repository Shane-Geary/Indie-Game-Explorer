const navbarLinks = document.getElementById('navbarTag').children
for (i = 0; i < navbarLinks.length; i++) {
	console.log(navbarLinks[i])
	if (navbarLinks[i].innerText === 'Home') {
		navbarLinks[i].style.color = 'whitesmoke'	
	} else {
		navbarLinks[i].style.color = 'greenyellow'
	}
}

let rimworldData
let madGamesTycoonData

async function fetchJSON(filepath) {
	try {
		const [rimworld, madGamesTycoon] = await Promise.all([
			fetch('../Data/rimworld.json')
			.then(response => {
				if (!response.ok) {
					throw new Error(`Response status: ${response.status}`)
				}
				return response.json()
			}),
			fetch('../Data/madgamestycoon.json')
			.then(response => {
				if (!response.ok) {
					throw new Error(`Response status: ${response.status}`)
				}
				return response.json()
			})
		])
		
		console.log(rimworld, madGamesTycoon);
		rimworldData = rimworld
		madGamesTycoonData = madGamesTycoon
		renderFeaturedData()
	} catch (error) {
		console.error(error.message);
	}
}

function renderFeaturedData() {
	// Hero One
	const rimworldTitle = document.getElementById('rimworldTitleTag')
	const heroOneGenresListTag = document.getElementById('heroOneGenresListTag')
	const heroOnePlatformListTag = document.getElementById('heroOnePlatformListTag')
	const heroOneDevTag = document.getElementById('heroOneDevTag')
	//Hero Two
	const madGamesTitle = document.getElementById('madGamesTitleTag')
	const heroTwoGenresListTag = document.getElementById('heroTwoGenresListTag')
	const heroTwoPlatformListTag = document.getElementById('heroTwoPlatformListTag')
	const heroTwoDevTag = document.getElementById('heroTwoDevTag')

	// Title
	rimworldTitle.innerHTML = rimworldData.name_original
	madGamesTitle.innerHTML = madGamesTycoonData.name_original
	
	// Genres
	for(i = 0; i < rimworldData.genres.length; i++) {
		// Hero One
		const listElement = document.createElement('li')
		listElement.innerHTML = rimworldData.genres[i].name
		heroOneGenresListTag.appendChild(listElement)
	}
	for(i = 0; i < madGamesTycoonData.genres.length; i++) {
		// Hero Two
		const listElement = document.createElement('li')
		listElement.innerHTML = madGamesTycoonData.genres[i].name
		heroTwoGenresListTag.appendChild(listElement)
	}
	// Platforms
	for(i = 0; i < rimworldData.platforms.length; i++) {
		// Hero One
		const listElement = document.createElement('li')
		listElement.innerHTML = rimworldData.platforms[i].platform.name
		heroOnePlatformListTag.appendChild(listElement)
	}
	for(i = 0; i < madGamesTycoonData.platforms.length; i++) {
		// Hero Two
		const listElement = document.createElement('li')
		listElement.innerHTML = madGamesTycoonData.platforms[i].platform.name
		heroTwoPlatformListTag.appendChild(listElement)
	}
	// Developer
	heroOneDevTag.innerHTML = rimworldData.developers[0].name
	heroTwoDevTag.innerHTML = madGamesTycoonData.developers[0].name
}