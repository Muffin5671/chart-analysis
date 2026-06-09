let fileInput = document.createElement("input");
fileInput.setAttribute("type", "file");
fileInput.setAttribute("accept", ".fnfc, .zip");

$("#fileSelect")[0].addEventListener("click", () => fileInput.click());

let zip;
let songId;
$("#upload")[0].addEventListener("click", () => {
  if (!(fileInput.files[0].name.endsWith(".fnfc")) || !(fileInput.files[0].name.endsWith(".zip"))) {
    alert("Error: File is not a type of .fnfc or .zip.");
    throw new Error("File is not a type of .fnfc or .zip.");
  }
  zip = new JSZip();
  zip.loadAsync(fileInput.files[0])
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

    if (!($(".diffOption").length == 0)) {
      do {
        $(".diffOption")[0].remove();
      } while (!($(".diffOption").length == 0))
    }

    metadata.playData.difficulties.forEach(diff => {
      let option = document.createElement("option");
      option.setAttribute("class", "diffOption");
      option.innerText = diff;
      $("#diffSelect")[0].add(option);
    })
    $("#diffSelect")[0].removeAttribute("disabled");
  });
});

$("#analyze")[0].addEventListener("click", () => {
  zip.file(`${songId}-chart.json`)
  .async("string")
  .then(content => {
    let diff = $("#diffSelect")[0].value;
    let chart = JSON.parse(content).notes[diff];

    let left = 0;
    let down = 0;
    let up = 0;
    let right = 0;
    let lHold = 0;
    let dHold = 0;
    let uHold = 0;
    let rHold = 0;
    chart.forEach(note => {
      switch (note.d) {
        case 0:
          left++;
          if (note.l > 0) lHold++;
          break;
        case 1:
          down++;
          if (note.l > 0) dHold++;
          break;
        case 2:
          up++;
          if (note.l > 0) uHold++;
          break;
        case 3:
          right++;
          if (note.l > 0) rHold++;
          break;
        case 4:
          left++;
          if (note.l > 0) lHold++;
          break;
        case 5:
          down++;
          if (note.l > 0) dHold++;
          break;
        case 6:
          up++;
          if (note.l > 0) uHold++;
          break;
        case 7:
          right++;
          if (note.l > 0) rHold++;
          break;
      }
    });

    // left
    $("#rAmountLeft")[0].innerText = left;
    $("#sAmountLeft")[0].innerText = lHold;
    $("#tAmountLeft")[0].innerText = left + lHold;

    // down
    $("#rAmountDown")[0].innerText = down;
    $("#sAmountDown")[0].innerText = dHold;
    $("#tAmountDown")[0].innerText = down + dHold;

    // up
    $("#rAmountUp")[0].innerText = up;
    $("#sAmountUp")[0].innerText = uHold;
    $("#tAmountUp")[0].innerText = up + uHold;

    // right
    $("#rAmountRight")[0].innerText = right;
    $("#sAmountRight")[0].innerText = rHold;
    $("#tAmountRight")[0].innerText = right + rHold;
  });
});