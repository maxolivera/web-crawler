import { JSDOM } from "jsdom";

function normalizeURL(fullURL) {
	const newURL = URL(fullURL);
	const hostName = newURL.hostname;
	let path = newURL.pathname;

	if (path[path.length - 1] == "/") {
		path = path.slice(0, -1)
	}

	return `${hostName}${path}`;
}

function getURLFromHTML(htmlBody, baseURL) {
	if (htmlBody == false || baseURL == false) {
		throw new Error("Some parameter is falsy")
	}
	const dom = new JSDOM(htmlBody);
	const anchors = dom.window.document.querySelectorAll("a");
	const URLs = [];

	for (const anchor of anchors) {
		if (anchor.hasAttribute("href")) {
			const href = anchor.getAttribute("href");
			try {
				// if href is a full URL
				const currentURL = URL(href, baseURL);
				URLs.push(currentURL)
			} catch (err) {
				console.log(`${err.message}: ${currentURL}`)
			}
		}
	}

	return URLs;
}

export { normalizeURL, getURLFromHTML };
