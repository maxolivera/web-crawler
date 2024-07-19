import { expect, test, describe } from "bun:test";
import { normalizeURL, getURLFromHTML } from "../crawl.js";

describe("Normalize URL", () => {
	test("Base URL", () => {
		const testURL = "https://blog.boot.dev/path";
		const result = normalizeURL(testURL);
		const expected = "blog.boot.dev/path";

		expect(result).toEqual(expected);
	});
	test("Similar URL", () => {
		const firstURL = "https://blog.boot.dev/path";
		const secondURL = "http://blog.boot.dev/path/";

		expect(normalizeURL(firstURL)).toEqual(normalizeURL(secondURL))
	});
	test("They're all the same", () => {
		const set = new Set()
		const firstURL = normalizeURL("https://blog.boot.dev/path/")
		const secondURL = normalizeURL("https://blog.boot.dev/path")
		const thirdURL = normalizeURL("http://blog.boot.dev/path/")
		const fourthURL = normalizeURL("http://blog.boot.dev/path")

		set.add(firstURL)
		set.add(secondURL)
		set.add(thirdURL)
		set.add(fourthURL)

		expect(set.size).toEqual(1)
	});
});

describe("URLs from HTML", () => {
	test("Base case", () => {
		const html = `<a href="https://boot.dev">Learn Backend Development</a><a href="/path">Learn Backend Development</a>`
		const baseURL = "https://boot.dev";
		const URLs = getURLFromHTML(html, baseURL)

		expect(URLs[0].pathname).toBe("/")
		expect(URLs[1].pathname).toBe("/path")
	});
	test("Different hostname", () => {
		const html = `<a href="https://wikipedia.org">Go to wikipedia!</a><a href="/tracks/backend">Learn Backend Development</a>`
		const baseURL = "https://boot.dev";
		const URLs = getURLFromHTML(html, baseURL)

		expect(URLs[0].hostname).toBe("wikipedia.org")
		expect(URLs[0].pathname).toBe("/")
		expect(URLs[1].hostname).toBe("boot.dev")
		expect(URLs[1].pathname).toBe("/tracks/backend")
	});

});
