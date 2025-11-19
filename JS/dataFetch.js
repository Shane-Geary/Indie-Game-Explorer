let rimworldData

async function fetchGame() {
	try {
		const response = await fetch('../Data/rimworld.json')
		if (!response.ok) {
			throw new Error(`Response status: ${response.status}`)
		}
		const result = await response.json()
		console.log(result);
		rimworldData = result
		renderHeroImage()
		renderFeaturedData()
	} catch (error) {
		console.error(error.message);
	}
}

function renderHeroImage() {
	const heroImage = document.getElementById('rimworldCoverArtImg')
	heroImage.src = rimworldData.background_image
	console.log(heroImage);
}

function renderFeaturedData() {
	const rimworldTitle = document.getElementById('rimworldTitleTag')
	// const heroOneDescWrapper = document.getElementById('heroOneDescWrapper')
	const heroOneGenresListTag = document.getElementById('heroOneGenresListTag')
	const heroOnePlatformListTag = document.getElementById('heroOnePlatformListTag')
	const heroOneDevTag = document.getElementById('heroOneDevTag')

	// Title
	rimworldTitle.innerHTML = rimworldData.name_original
	// heroOneDescWrapper.style.backgroundColor = `#${rimworldData.dominant_color}`
	// heroOneDesc.innerHTML = rimworldData.description
	
	// Genres
	for(i = 0; i < rimworldData.genres.length; i++) {
		const listElement = document.createElement('li')
		listElement.innerHTML = rimworldData.genres[i].name
		heroOneGenresListTag.appendChild(listElement)
	}
	// Platforms
	for(i = 0; i < rimworldData.platforms.length; i++) {
		const listElement = document.createElement('li')
		listElement.innerHTML = rimworldData.platforms[i].platform.name
		heroOnePlatformListTag.appendChild(listElement)
	}
	// Developer
	heroOneDevTag.innerHTML = rimworldData.developers[0].name
}