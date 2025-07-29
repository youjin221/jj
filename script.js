const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// 캔버스 사이즈
canvas.width = 400;
canvas.height = 600;

// 플레이어 바
let catcher = {
  x: canvas.width / 2 - 30,
  y: canvas.height - 40,
  width: 60,
  height: 15,
  speed: 5
};

// 하트 배열
let hearts = [];
let score = 0;

// 키 입력 처리
let keys = {
  left: false,
  right: false
};

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") keys.left = true;
  if (e.key === "ArrowRight") keys.right = true;
});
document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowLeft") keys.left = false;
  if (e.key === "ArrowRight") keys.right = false;
});

// ✅ 터치 또는 마우스 이동으로 바 위치 조절
canvas.addEventListener("touchmove", (e) => {
  const touchX = e.touches[0].clientX - canvas.getBoundingClientRect().left;
  catcher.x = touchX - catcher.width / 2;
});

canvas.addEventListener("mousemove", (e) => {
  const mouseX = e.clientX - canvas.getBoundingClientRect().left;
  catcher.x = mouseX - catcher.width / 2;
});

// 하트 생성
function spawnHeart() {
  hearts.push({
    x: Math.random() * (canvas.width - 30),
    y: -30,
    size: 30,
    // ✅ 점수가 높아질수록 하트 속도 증가
    speed: 2 + Math.random() * 2 + score * 0.05
  });
}
setInterval(spawnHeart, 1000);

// 업데이트
function update() {
  // 키보드 바 움직임
  if (keys.left) catcher.x -= catcher.speed;
  if (keys.right) catcher.x += catcher.speed;

  // 벽 제한
  if (catcher.x < 0) catcher.x = 0;
  if (catcher.x + catcher.width > canvas.width) catcher.x = canvas.width - catcher.width;

  // 하트 이동 및 충돌 검사
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

  // 바 (플레이어)
  ctx.fillStyle = "red";
  ctx.fillRect(catcher.x, catcher.y, catcher.width, catcher.height);

  // 점수
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 30);
}

// 게임 루프
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();
