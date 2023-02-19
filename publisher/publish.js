/* eslint-disable */
const version = require("../package.json").version;
const AdmZip = require("adm-zip");
const fs = require("fs")

/**
 * Creates a zip archive of the dist folder and the changelog file
 * @param {string} changelog 
 */
async function createZipArchive(changelog) {
    // Create a zip archive of the dist folder
    const zip = new AdmZip();

    // Add the dist folder and the changelog file to the zip archive
    const outputFile = `Fruity Dance Sprite Sheet Generator v${version}.zip`;

    // Add the dist folder and the changelog file to the zip archive
    zip.addLocalFolder("../dist");

    // Add the changelog file to the zip archive
    zip.addFile("CHANGELOG.md", Buffer.from(changelog, "utf8"));

    // Write the zip archive to disk
    zip.writeZip(outputFile);

    // Log a success message
    console.log(`Created ${outputFile} successfully`);
}

/**
 * Reads the changelog template and replaces the {version} and {highlights} placeholders
 */
fs.readFile("./CHANGELOG_TEMPLATE.md", "utf8", (err, data) => {
    // Check for errors
    if (err) {
        console.error(err);
        return;
    }

    // Read the changelog template
    var changelog = data;

    // Replace {version} with the current version
    changelog = changelog.replace(/{version}/g, version);

    // Replace {highlights} with highlights from highlights varaible
    const highlights = [
        "Added a new feature",
        "Fixed a bug",
        "Improved performance"
    ];
    const highlightsString = highlights.map((highlight) => `- ${highlight}`).join("\r");
    changelog = changelog.replace(/{highlights}/g, highlightsString);

    // Run the createZipArchive function with the new changelog
    createZipArchive(changelog);
});
