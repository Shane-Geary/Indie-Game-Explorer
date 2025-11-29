// Reusable helper function for active nav link color
export function activeNavLink(activeLink) {
	console.log(activeLink)
	
	const navbarLinks = document.getElementById('navbarTag').children
	for (let i = 0; i < navbarLinks.length; i++) {
		if (navbarLinks[i].innerText === activeLink) {
			navbarLinks[i].style.color = 'rgba(0, 235, 255, 0.9)'	
		} else {
			navbarLinks[i].style.color = 'greenyellow'
		}
	}
}