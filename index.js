const express = require('express');
const cors = require('cors');
const { addonBuilder } = require('stremio-addon-sdk');
const manifest = require('./manifest.json');

const builder = new addonBuilder(manifest);

const streams = [
  { id: "MBC1", name: "MBC 1", url: "https://hls.mbconline.xyz/live/MBC1/index.m3u8" },
  { id: "MBC2", name: "MBC 2", url: "https://hls.mbconline.xyz/live/MBC2/index.m3u8" },
  { id: "MBC3", name: "MBC 3", url: "https://hls.mbconline.xyz/live/MBC3/index.m3u8" },
  { id: "BTV", name: "MBC 4 / BTV", url: "https://hls.mbconline.xyz/live/BTV/index.m3u8" },
  { id: "YSTV", name: "MBC 11 / YSTV", url: "https://hls.mbconline.xyz/live/YSTV/index.m3u8" },
  { id: "MBC12", name: "MBC 12 (Ciné)", url: "https://hls.mbconline.xyz/live/MBC12/index.m3u8" },
  { id: "Education", name: "LearningChannel.mu", url: "https://hls.mbconline.xyz/live/education/index.m3u8" },
  { id: "Events", name: "Events.mu", url: "https://hlsonline.in/hls/lps123.m3u8" }
];

builder.defineCatalogHandler(() => {
  return Promise.resolve({
    metas: streams.map(s => ({
      id: s.id,
      type: "tv",
      name: s.name,
      poster: `https://via.placeholder.com/256x144.png?text=${encodeURIComponent(s.name)}`
    }))
  });
});

builder.defineStreamHandler(args => {
  const ch = streams.find(s => s.id === args.id);
  return ch ? Promise.resolve({ streams: [{ url: ch.url }] }) : { streams: [] };
});

const app = express();
app.use(cors());

app.get('/manifest.json', (req, res) => res.json(manifest));
app.get('/catalog/tv/mbc.json', (req, res) => builder.catalog({ type: 'tv', id: 'mbc' }).then(result => res.json(result)));
app.get('/stream/tv/:id.json', (req, res) => builder.stream({ type: 'tv', id: req.params.id }).then(result => res.json(result)));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ MBC add-on running on port ${PORT}`));
