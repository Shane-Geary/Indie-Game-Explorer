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
	const heroOneDesc = document.getElementById('heroOneDescTag')

	console.log(rimworldData.description);
	
	heroOneDesc.innerHTML = rimworldData.description
}