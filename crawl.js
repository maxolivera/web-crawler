import { JSDOM } from "jsdom";

function normalizeURL(fullURL) {
	let url = null
	if (fullURL instanceof URL) {
		url = fullURL
	} else {
		url = URL(fullURL);
	}
	const hostName = url.hostname;
	let path = url.pathname;

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
				const currentURL = URL(href, baseURL);
				URLs.push(currentURL)
			} catch (err) {
				console.log(err.message)
			}
		}
	}

	return URLs;
}

async function crawlPage(baseURL, currentURL = baseURL, pages = {}) {
	if (baseURL.hostname !== currentURL.hostname) {
		return pages;
	}

	const normalizedUrl = normalizeURL(currentURL)

	if (normalizedUrl in pages){
		pages[normalizedUrl]++;
		return pages;
	} else {
		pages[normalizedUrl] = 1
	}

	const html = await getHtml(currentURL);
	const urls = getURLFromHTML(html, baseURL);

	for (const url of urls){
		pages = await crawlPage(baseURL, url, pages)
	}

	return pages
}

async function getHtml(url) {
	const response = await fetch(url, {
		method: 'GET',
		mode: 'cors'
	})

	const status = response.status;
	const contentType = response.headers
		.get("Content-Type")
		.split(";")
		.map((v) => v.trimStart());
	if (status >= 400) {
		console.log(`Connection failed. Status code: ${status}. Full response ${response}`);
		return
	}
	if (!contentType.includes("text/html")) {
		console.log(`Invalid content type. Contet type: '${contentType}'. Full response:`);
		console.log(response)
		return
	}
	return response.text()
}

export { normalizeURL, getURLFromHTML, crawlPage };
