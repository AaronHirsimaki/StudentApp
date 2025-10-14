import fs from "fs";

const barsPath = "./src/data/bars.json";
const outputPath = "./src/data/missing-logos.json";

const barsData = JSON.parse(fs.readFileSync(barsPath, "utf-8"));

const missing = barsData.features
  .filter((f) => !f.properties.logo)
  .map((f) => ({
    id: f.properties["@id"],
    name: f.properties.name || "Unnamed bar",
    website: f.properties.website || null,
    street: f.properties["addr:street"] || null,
    housenumber: f.properties["addr:housenumber"] || null,
  }));

fs.writeFileSync(outputPath, JSON.stringify(missing, null, 2));
console.log(`✨ ${missing.length} baareilta puuttuu logo — tiedot tallennettu: ${outputPath}`);
