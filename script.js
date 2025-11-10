// === カメラ映像を取得 ===
const video = document.getElementById('camera');
navigator.mediaDevices.getUserMedia({ video: true, audio: false })
  .then(stream => {
    video.srcObject = stream;
  })
  .catch(err => {
    alert('カメラを使用できません: ' + err);
  });

// === Three.js 初期化 ===
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('webgl'), alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();

// 背景にカメラ映像を貼る
const videoTexture = new THREE.VideoTexture(video);
const bgGeometry = new THREE.PlaneGeometry(2, 2);
const bgMaterial = new THREE.MeshBasicMaterial({ map: videoTexture });
const bgMesh = new THREE.Mesh(bgGeometry, bgMaterial);
bgMesh.material.depthTest = false;
bgMesh.material.depthWrite = false;

const bgScene = new THREE.Scene();
const bgCamera = new THREE.Camera();
bgScene.add(bgMesh);
bgScene.add(bgCamera);

// 3Dオブジェクト表示用カメラ
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 3;

// === オブジェクトを追加 ===
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshNormalMaterial();
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// === OrbitControls（マウスやスマホの動き） ===
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enableZoom = false;

// === ループ処理 ===
function animate() {
  requestAnimationFrame(animate);
  controls.update();

  // 背景描画
  renderer.autoClear = false;
  renderer.clear();
  renderer.render(bgScene, bgCamera);

  // 3Dオブジェクト描画
  renderer.render(scene, camera);
}
animate();

// === リサイズ対応 ===
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
