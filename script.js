const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// 바 정보
let catcher = {
  x: canvas.width / 2 - 30,
  y: canvas.height - 40,
  width: 60,
  height: 15
};

let hearts = [];
let score = 0;

// 터치 또는 마우스로 바 움직이기
function moveCatcher(x) {
  const canvasLeft = canvas.getBoundingClientRect().left;
  catcher.x = x - canvasLeft - catcher.width / 2;

  // 화면 밖으로 못 나가게
  if (catcher.x < 0) catcher.x = 0;
  if (catcher.x + catcher.width > canvas.width) {
    catcher.x = canvas.width - catcher.width;
  }
}

// 터치 & 마우스 이벤트
canvas.addEventListener("touchmove", (e) => {
  moveCatcher(e.touches[0].clientX);
});
canvas.addEventListener("mousemove", (e) => {
  moveCatcher(e.clientX);
});

// 하트 생성
function spawnHeart() {
  hearts.push({
    x: Math.random() * (canvas.width - 30),
    y: -30,
    size: 30,
    speed: 4
  });
}
setInterval(spawnHeart, 1000);

// 업데이트
function update() {
  hearts = hearts.filter(h => {
    h.y += h.speed;

    const caught =
      h.y + h.size >= catcher.y &&
      h.x + h.size >= catcher.x &&
      h.x <= catcher.x + catcher.width;

    if (caught) score++;
    return h.y < canvas.height && !caught;
  });
}

// 그리기
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 하트
  ctx.fillStyle = "hotpink";
  hearts.forEach(h => {
    ctx.beginPath();
    ctx.arc(h.x + h.size / 2, h.y + h.size / 2, h.size / 2, 0, Math.PI * 2);
    ctx.fill();
  });

  // 바
  ctx.fillStyle = "red";
  ctx.fillRect(catcher.x, catcher.y, catcher.width, catcher.height);

  // 점수
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 30);
}

// 루프
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}
gameLoop();
