const results = document.getElementById("results");
const exported_wrapper = document.getElementById("exported-wrapper");
const export_btn = document.getElementById("export-btn");
const output = document.getElementById("output");
const before = document.getElementById("before");
const size_input = document.getElementById("size-input");
const size_label = document.getElementById("size-label");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let image;
let size = 20;

// [Ref] stackoverflow.com/a/22255905/4824627
function readImage() {
  if(!this.files || !this.files[0]) return;
  const reader = new FileReader();
  reader.addEventListener("load", (evt) => {
    image = new Image();
    image.addEventListener("load", draw);
    image.src = evt.target.result;
  });
  reader.readAsDataURL(this.files[0]);
}

function draw() {
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawCheckerboard(canvas.width, canvas.height);
  ctx.drawImage(image, 0, 0);
  while(before.firstChild)
    before.firstChild.remove();
  before.appendChild(image);
  results.className = "done";
}

function drawCheckerboard(w, h) {
  // [Ref] quickprogrammingtips.com/javascript/how-to-draw-a-chessboard-in-html-canvas-using-javascript.html
  for(let i=0; i<(h/size)+size; i++) {
    for(let j=0; j<(w/size)+size; j++) {
      ctx.fillStyle = ((i+j)%2==0) ? "white":"#ccc";
      let xOffset = j*size;
      let yOffset = i*size;
      ctx.fillRect(xOffset, yOffset, size, size);
    }
  }
}

document.getElementById("upload").addEventListener("change", readImage);
function inputUpdated() {
  size = +size_input.value || 20;
  draw();
  size_label.textContent = size;
}
size_input.addEventListener("input", inputUpdated);
size_input.addEventListener("change", inputUpdated);
export_btn.addEventListener("click", function() {
  const fakepng = canvas.toDataURL("image/png");
  output.src = fakepng;
  downloadResult(fakepng);

  exported_wrapper.className = "open";
  setTimeout(() => {
    exported_wrapper.scrollIntoView({ behavior: "smooth" });
  }, 150);
});

function downloadResult(data) {
  const a = document.createElement("a");
  document.body.appendChild(a);
  a.download = "fake.png";
  a.href = data;
  a.click();
  setTimeout(() => { a.remove(); }, 150);
}