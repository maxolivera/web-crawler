import { JSDOM } from "jsdom";
export { normalizeURL, getURLFromHTML };

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
			let currentURL = null
			try {
				// if href is a full URL
				currentURL = URL(anchor.href);
			} catch (err) {
				if (err instanceof TypeError) {
					// if href is a relative URL
					currentURL = URL(`${baseURL}${anchor.href}`)
				}
				else {
					throw new Error(err)
				}
			}
			if (currentURL === null) {
				throw new Error("The currentURL is null")
			}
			URLs.push(currentURL)
		}
	}

	return URLs;
}
