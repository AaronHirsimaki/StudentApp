import fs from "fs";
import fetch from "node-fetch";

const barsPath = "./src/data/bars.json";
const barsData = JSON.parse(fs.readFileSync(barsPath, "utf-8"));

// 🧠 Asetetaan aikakatkaisu jumien varalta
function fetchWithTimeout(url, ms = 5000) {
  return Promise.race([
    fetch(url),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`Timeout after ${ms}ms`)), ms)
    ),
  ]);
}

// --- 1. Hakee logon Wikidatasta ---
async function fetchWikidataImage(wikidataId) {
  const url = `https://www.wikidata.org/wiki/Special:EntityData/${wikidataId}.json`;
  try {
    const res = await fetchWithTimeout(url);
    const data = await res.json();
    const entity = data.entities[wikidataId];

    // P154 = logo
    if (entity.claims.P154) {
      const fileName = entity.claims.P154[0].mainsnak.datavalue.value;
      return `https://commons.wikimedia.org/wiki/Special:FilePath/${fileName}`;
    }

    // P18 = kuva
    if (entity.claims.P18) {
      const fileName = entity.claims.P18[0].mainsnak.datavalue.value;
      return `https://commons.wikimedia.org/wiki/Special:FilePath/${fileName}`;
    }
  } catch (err) {
    console.error(`⚠️ Wikidata error for ${wikidataId}:`, err.message);
  }
  return null;
}

// --- 2. Hakee faviconin tai og:image:n nettisivulta ---
async function fetchWebsiteLogo(websiteUrl) {
  try {
    const res = await fetchWithTimeout(websiteUrl);
    if (!res.ok) return null;
    const html = await res.text();

    // Open Graph -kuva
    const ogMatch = html.match(/<meta property="og:image" content="(.*?)"/i);
    if (ogMatch) return ogMatch[1];

    // Favicon
    const favMatch = html.match(/<link rel="(?:shortcut icon|icon)" href="(.*?)"/i);
    if (favMatch) {
      const href = favMatch[1];
      return href.startsWith("http") ? href : new URL(href, websiteUrl).href;
    }
  } catch (err) {
    console.error(`⚠️ Website fetch error for ${websiteUrl}:`, err.message);
  }
  return null;
}

// --- 3. Logo enrichment ---
async function enrichBarsWithLogos() {
  for (const feature of barsData.features) {
    const props = feature.properties;

    // Jos logo on jo olemassa → skip (tämä mahdollistaa jatkamisen kesken)
    if (props.logo !== undefined) {
      console.log(`⏭️ ${props.name}: Already processed`);
      continue;
    }

    let foundLogo = null;

    // 1. Wikidata
    if (props.wikidata) {
      foundLogo = await fetchWikidataImage(props.wikidata);
      if (foundLogo) {
        console.log(`✅ ${props.name}: Wikidata logo found`);
      }
    }

    // 2. Website
    if (!foundLogo && props.website) {
      foundLogo = await fetchWebsiteLogo(props.website);
      if (foundLogo) {
        console.log(`🌐 ${props.name}: Website logo found`);
      }
    }

    // 3. Ei löytynyt
    if (!foundLogo) {
      console.log(`❌ ${props.name}: No logo found`);
    }

    // 📝 Tallenna logo (tai null) heti, ei vasta lopussa
    props.logo = foundLogo || null;

    // 💾 Kirjoita tiedosto joka kierroksen jälkeen → mahdollistaa jatkamisen
    fs.writeFileSync(barsPath, JSON.stringify(barsData, null, 2));
  }

  console.log("✨ Logo enrichment done!");
}

enrichBarsWithLogos();
