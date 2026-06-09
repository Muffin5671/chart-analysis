$("#upload")[0].addEventListener("click", () => {
  let zip = new JSZip();
  let songId;
  zip.loadAsync($("#fnfc")[0].files[0])
  .then(async zip => {
    songId = await zip.file("manifest.json")
    .async("string")
    .then(content => {
      let manifest = JSON.parse(content);
      return manifest.songId;
    });

    let metadata = await zip.file(`${songId}-metadata.json`)
    .async("string")
    .then(content => {
      return JSON.parse(content);
    });
    metadata.playData.difficulties.forEach(diff => {
      let option = document.createElement("option");
      option.innerText = diff;
      $("#diffSelect")[0].add(option);
    })
    $("#diffSelect")[0].removeAttribute("disabled");
  });
});

$("#analyze")[0].addEventListener("click", () => {
  zip.files[`${songId}-chart.json`]
  .async("string")
  .then(content => {
    let diff = $("#diffSelect")[0].value;
    let chart = JSON.parse(content).notes[diff];
    console.log(chart);
  })
})