// ===== データ =====
const data = [
  { name: "富士山", country: "日本", lat: 35.3606, lng: 138.7274, desc: "2013年に登録された日本を象徴する成層火山。" },
  { name: "姫路城", country: "日本", lat: 34.8394, lng: 134.6939, desc: "白鷺城の名で知られる日本最古級の城郭。" },
  { name: "モン・サン・ミシェル", country: "フランス", lat: 48.6361, lng: -1.5111, desc: "潮の干満に囲まれた修道院。" },
  { name: "原爆ドーム", country: "日本", lat: 34.3955, lng: 132.4536, desc: "世界平和と核兵器の廃絶の大切さを恒久に訴えている。" },
  { name: "厳島神社", country: "日本", lat: 34.2959, lng: 132.3199, desc: "海の中に建つ日本でも珍しい神社建築。" }
];

let selected = null;

// ===== 地球儀生成 =====
const globe = Globe()(document.getElementById("globe"))
  .globeImageUrl("https://unpkg.com/three-globe/example/img/earth-dark.jpg")
  .backgroundImageUrl("https://unpkg.com/three-globe/example/img/night-sky.png")
  .pointsData(data)
  .pointLat("lat")
  .pointLng("lng")
  .pointAltitude(0.02)   // ← これが無いと見えない
  .pointRadius(d => d === selected ? 0.35 : 0.18)
  .pointColor(d => d.user ? "cyan" : "orange")
  .pointsMerge(false)
  .onPointClick(showInfo);

// ===== 情報表示 =====
function showInfo(d) {
  selected = d;
  globe.pointsData(data);
  globe.pointOfView({ lat: d.lat, lng: d.lng, altitude: 1.3 }, 800);

  const modal = document.getElementById("modal");
  const modalContent = document.getElementById("modalContent");

  modalContent.innerHTML = `
    <h2>${d.name}</h2>
    <strong>${d.country}</strong><br><br>
    ${d.desc}
    <div id="close">閉じる</div>
  `;

  modal.style.display = "flex";
  document.getElementById("close").onclick = () => {
    modal.style.display = "none";
    selected = null;
    globe.pointsData(data);
  };
}

// ===== 検索 =====
document.getElementById("search").addEventListener("input", e => {
  const key = e.target.value.trim();
  if (!key) return;
  const hit = data.find(d => d.name.includes(key));
  if (hit) showInfo(hit);
});

// ===== ピン追加（外部API） =====
document.getElementById("addBtn").addEventListener("click", async () => {
  const heritageInput = document.getElementById("heritageInput");
  const countryInput = document.getElementById("countryInput");
  const descInput = document.getElementById("descInput");

  const heritage = heritageInput.value.trim();
  const country = countryInput.value.trim();
  const desc = descInput.value.trim();

  if (!heritage || !country) {
    alert("世界遺産名と国名を入力してください");
    return;
  }

  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(heritage + " " + country)}`
  );
  const json = await res.json();
  if (!json[0]) {
    alert("場所が見つかりませんでした");
    return;
  }

  const newPoint = {
    name: heritage,
    country,
    lat: Number(json[0].lat),
    lng: Number(json[0].lon),
    desc: desc || "ユーザーが追加したピン",
    user: true
  };

  data.push(newPoint);
  globe.pointsData(data);
  showInfo(newPoint);

  heritageInput.value = "";
  countryInput.value = "";
  descInput.value = "";
});
