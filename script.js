let scene, camera, renderer, controls, object;
let video, videoStream;

// --- カメラ映像の初期化 ---
function initVideo() {
  video = document.getElementById("camera");
  navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false })
    .then(stream => {
      video.srcObject = stream;
      videoStream = stream;
      video.play();
    })
    .catch(e => { alert("カメラ使用拒否"); console.log(e); });
}

// --- Three.js 初期化 ---
function initThree() {
  const w = window.innerWidth;
  const h = window.innerHeight;

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(45, w/h, 0.1, 50);
  camera.position.set(0, 0, 0);

  renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true, canvas: document.getElementById("canvas") });
  renderer.setSize(w, h);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(0x000000,0);

  // --- DeviceOrientationControls でカメラ回転 ---
  controls = new THREE.DeviceOrientationControls(camera, true);

  // --- 真ん中にオブジェクトを生成 ---
  const geometry = new THREE.BoxGeometry(1,1,1);
  const material = new THREE.MeshNormalMaterial();
  object = new THREE.Mesh(geometry, material);
  object.position.set(0,0,-5); // カメラ前方5m
  scene.add(object);

  animate();
}

// --- アニメーションループ ---
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

// --- ページロード時 ---
window.onload = () => {
  initVideo();
  initThree();
};
