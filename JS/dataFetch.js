let rimworldData

async function fetchGame() {
	try {
		const response = await fetch('../Data/rimworld.json')
		if (!response.ok) {
			throw new Error(`Response status: ${response.status}`)
		}
		const result = await response.json()
		console.log(result.results[0]);
		rimworldData = result.results[0]
		renderHeroImage()
	} catch (error) {
		console.error(error.message);
	}
}

function renderHeroImage() {
	const heroImage = document.getElementById('rimworldCoverArtImg')
	heroImage.src = rimworldData.background_image
	// heroImage.src = rimworldData.short_screenshots[3].image
	console.log(heroImage);
	
}