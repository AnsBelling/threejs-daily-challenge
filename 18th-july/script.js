var camera, scene, renderer;

function init() {
  //resize window event listerner
  window.addEventListener("resize", onResize, false);

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    75, //Field of View - the extent of the scene that is seen on the display at any given moments - in degrees
    window.innerWidth / window.innerHeight, // aspect ratio
    0.1, // near clipping plane
    100 //far clipping plane
    //objects further away from the camera than the value of far or closer than near won't be rendered
  );
  camera.position.z = 5;

  renderer = new THREE.WebGLRenderer({ antialias: true });

  renderer.setClearColor({ alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  var fogDensity = 0.1;

  scene.fog = new THREE.FogExp2(0xff0000, fogDensity);

  var torusGeometry = new THREE.TorusGeometry();
  var torusMaterial = new THREE.MeshLambertMaterial({ color: 0x03dac6 });
  var torus = new THREE.Mesh(torusGeometry, torusMaterial);
  scene.add(torus);

  torus.position.set(-2, 0, 0);

  var light = new THREE.AmbientwLight(0xffffff, 0.5);
  light.position.set(10, 0, 15);

  scene.add(light);
  var light = new THREE.PointLight(0xffffff, 1, 500);
  light.position.set(10, 1, 0);

  scene.add(light);
  camera.lookAt(scene.position);

  function render() {
    // render using requestAnimationFrame

    requestAnimationFrame(render);
    torus.rotation.x += 0.01;
    torus.rotation.z += 0.01;
    torus.rotation.y -= 0.01;
    renderer.render(scene, camera);
  }

  document.getElementById("webgl-output").appendChild(renderer.domElement);
  render();
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
