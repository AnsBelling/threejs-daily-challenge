var camera, scene, renderer;
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2(),
  INTERSECTED;

function init() {
  //resize window event listerner
  window.addEventListener("resize", onResize, false);
  window.addEventListener("mousemove", onMouseMove, false);

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

  torus.castShadow = true;

  torus.position = new THREE.Vector3(3, 20, 3);
  scene.add(torus);

  var aLight = new THREE.AmbientLight(0xffffff, 0.5);
  aLight.position.set(10, 0, 15);

  scene.add(aLight);
  var light = new THREE.DirectionalLight(0xffffff, 2, 50);
  light.target = torus;

  scene.add(light);
  camera.lookAt(scene.position);
  var step = 0;
  function render() {
    // render using requestAnimationFrame

    step += 0.08;
    torus.position.x = 0.5 * Math.cos(step);
    torus.position.y = 0.5 * Math.abs(Math.sin(step));

    torus.rotation.x += 0.01;
    torus.rotation.y += 0.01;
    torus.rotation.z += 0.01;

    // update the picking ray with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);
    // calculate objects intersecting the picking ray
    var intersects = raycaster.intersectObjects(scene.children);

    if (intersects.length > 0) {
      if (INTERSECTED != intersects[0].object) {
        if (INTERSECTED)
          INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);

        INTERSECTED = intersects[0].object;
        INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
        INTERSECTED.material.emissive.setHex(0xff0000);
      }
    } else {
      if (INTERSECTED)
        INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);

      INTERSECTED = null;
    }

    requestAnimationFrame(render);
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

function onMouseMove(event) {
  // calculate mouse position in normalized device coordinates
  // (-1 to +1) for both components

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}
