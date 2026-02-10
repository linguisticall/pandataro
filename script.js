const globe = Globe()(document.getElementById("globe"))
  .globeImageUrl("https://unpkg.com/three-globe/example/img/earth-night.jpg")
  .backgroundColor("black")
  .pointOfView({ lat: 20, lng: 0, altitude: 2.2 });

let sites = [
  {
    name: "タージ・マハル",
    country: "インド",
    desc: "ムガル帝国の霊廟建築",
    lat: 27.175,
    lng: 78.042
  },
  {
    name: "万里の長城",
    country: "中国",
    desc: "世界最長の城壁",
    lat: 40.431,
    lng: 116.570
  }
];

function updatePins() {
  globe
    .pointsData(sites)
    .pointLat(d => d.lat)
    .pointLng(d => d.lng)
    .pointColor(() => "orange")
    .pointRadius(0.4)
    .pointAltitude(0.02)
    .onPointClick(d => {
      alert(`${d.name}\n${d.country}\n\n${d.desc}`);
      globe.pointOfView(
        { lat: d.lat, lng: d.lng, altitude: 1.6 },
        1000
      );
    });
}

updatePins();

// ピン追加
document.getElementById("add").onclick = async () => {
  const name = document.getElementById("name").value;
  const country = document.getElementById("country").value;
  const desc = document.getElementById("desc").value;
  if (!name || !country) return;

  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(country)}`
  );
  const data = await res.json();
  if (!data[0]) return;

  sites.push({
    name,
    country,
    desc,
    lat: Number(data[0].lat),
    lng: Number(data[0].lon)
  });

  updatePins();
};

// 検索
document.getElementById("search").addEventListener("input", e => {
  const word = e.target.value;
  const site = sites.find(s => s.name.includes(word));
  if (!site) return;

  globe.pointOfView(
    { lat: site.lat, lng: site.lng, altitude: 1.6 },
    1000
  );
});

