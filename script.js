// ===== 世界遺産データ =====
const data = [
  { name: "富士山", country: "日本", lat: 35.3606, lng: 138.7274, desc: "2013年に登録された日本を象徴する成層火山。" },
  { name: "姫路城", country: "日本", lat: 34.8394, lng: 134.6939, desc: "白鷺城の名で知られる日本最古級の城郭。" },
  { name: "モン・サン・ミシェル", country: "フランス", lat: 48.6361, lng: -1.5111, desc: "潮の干満に囲まれた修道院。" },
  { name: "タージ・マハル", country: "インド", lat: 27.1751, lng: 78.0421, desc: "白大理石で造られた霊廟建築。" }
　{ name: "原爆ドーム", country: "日本", lat: 34.3955, lng: 132.4536, desc: "世界平和と核兵器の廃絶の大切さを恒久に訴えている。" },
  { name: "サンクト・ペテルブルグ", country: "ロシア", lat: 59.9398, lng: 30.3146, desc: "ロマノフ朝の都サンクト・ペテルブルグ。その名前はいくつもの意味を掛け合わせて作られたもの。ここはまさにピョートル大帝の野望を実現した街。" },
  { name: "厳島神社", country: "日本", lat: 34.2959, lng: 132.3199, desc: "厳島神社は瀬戸内海の島を背後にして、その入江の海のなかに木造建物が建ち並ぶ日本でも珍しい神社です。" }
];

let selected = null;

// ===== 地球儀生成 =====
const globe = Globe()(document.getElementById("globe"))
  .globeImageUrl("https://unpkg.com/three-globe/example/img/earth-dark.jpg")
  .backgroundImageUrl("https://unpkg.com/three-globe/example/img/night-sky.png")
  .pointsData(data)
  .pointLat("lat")
  .pointLng("lng")
  .pointRadius(d => d === selected ? 0.35 : 0.18)
  .pointColor(d => d.user ? "cyan" : "orange")
  .pointsMerge(false)
  .onPointClick(showInfo);

// ===== 情報表示 =====
function showInfo(d) {
  selected = d;
  globe.pointsData(data);
  globe.pointOfView({ lat: d.lat, lng: d.lng, altitude: 1.3 }, 800);

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
search.addEventListener("input", e => {
  const key = e.target.value.trim();
  if (!key) return;
  const hit = data.find(d => d.name.includes(key));
  if (hit) showInfo(hit);
});

// ===== ピン追加（外部API使用） =====
addBtn.addEventListener("click", async () => {
  const heritageName = heritageInput.value.trim();
  const countryName = countryInput.value.trim();
  const desc = descInput.value.trim();
  if (!heritageName || !countryName) return;

  try {
    const query = `${heritageName} ${countryName}`;
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${query}`
    );
    const json = await res.json();

    if (!json[0]) {
      alert("世界遺産名が見つかりません");
      return;
    }

    const newPoint = {
      name: heritageName,
      country: countryName,
      lat: parseFloat(json[0].lat),
      lng: parseFloat(json[0].lon),
      desc: desc || "ユーザーが追加したピン",
      user: true
    };

    data.push(newPoint);
    globe.pointsData(data);
    showInfo(newPoint);

    heritageInput.value = "";
    countryInput.value = "";
    descInput.value = "";
  } catch {
    alert("通信エラーが発生しました");
  }
});

