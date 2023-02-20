/* eslint-disable */
const version = require("../package.json").version;
const AdmZip = require("adm-zip");
const fs = require("fs");

/**
 * Creates a zip archive of the dist folder and the changelog file
 * @param {string} changelog
 */
async function createZipArchive() {
	// Create a zip archive of the dist folder
	const zip = new AdmZip();

	// Add the dist folder and the changelog file to the zip archive
	const outputFile = `./artifact/Fruity Dance Sprite Sheet Generator v${version}.zip`;

	// Add the dist folder and the changelog file to the zip archive
	try {
		zip.addLocalFolder("./dist");
	} catch (e) {
		console.log(
			"Error adding dist folder to zip archive, try running from the root directory"
		);
	}

	// Write the zip archive to disk
	zip.writeZip(outputFile);

	// Log a success message
	console.log(`Created ${outputFile} successfully`);
}

createZipArchive();
