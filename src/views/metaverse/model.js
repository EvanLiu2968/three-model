import * as THREE from 'three'
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader.js';
import { createControls, createRenderer, createScene, createHelper, Resizer, Loop } from '@/utils/three';


class World {
  constructor(container) {
    this.container = container

    this.scene = createScene();

    this.renderer = createRenderer();
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1;

    this.camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    this.camera.position.set( 7, 4, 1 );

    new Resizer(this.container, this.camera, this.renderer);
    this.container.append(this.renderer.domElement);

    this.loop = new Loop(this.camera, this.scene, this.renderer);

    this.controls = createControls(this.camera, this.renderer.domElement);
    this.controls.minDistance = 2;
    this.controls.maxDistance = 10;
    this.controls.maxPolarAngle = Math.PI / 2;
    this.controls.target.set( 0, 1, 0 );

    this.loop.updatables.push(this.controls);

    // const { ambientLight, mainLight } = createLights();
    // this.scene.add(ambientLight, mainLight);

    if (import.meta.env.MODE === 'development') {
      this.helper = createHelper(this.scene)
    }

    this.loop.updatables.push({
      tick: () => {
        this.composer ? this.composer.render() : this.renderer.render(this.scene, this.camera)
      }
    })
  }

  async init() {
    const { scene } = this
    const ambient = new THREE.HemisphereLight( 0xffffff, 0x8d8d8d, 0.15 );
    scene.add( ambient );

    const loader = new THREE.TextureLoader().setPath( '/textures/' );
    const filenames = [ 'disturb.jpg', 'colors.png', 'uv_grid_opengl.jpg' ];

    const textures = { none: null };

    for ( let i = 0; i < filenames.length; i ++ ) {

      const filename = filenames[ i ];

      const texture = loader.load( filename );
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.colorSpace = THREE.SRGBColorSpace;

      textures[ filename ] = texture;

    }

    const spotLight = new THREE.SpotLight( 0xffffff, 100 );
    this.spotLight = spotLight
    spotLight.position.set( 2.5, 5, 2.5 );
    spotLight.angle = Math.PI / 6;
    spotLight.penumbra = 1;
    spotLight.decay = 2;
    spotLight.distance = 0;
    spotLight.map = textures[ 'disturb.jpg' ];

    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    spotLight.shadow.camera.near = 1;
    spotLight.shadow.camera.far = 10;
    spotLight.shadow.focus = 1;
    scene.add( spotLight );

    const geometry = new THREE.PlaneGeometry( 200, 200 );
    const material = new THREE.MeshLambertMaterial( { color: 0xbcbcbc } );

    const mesh = new THREE.Mesh( geometry, material );
    mesh.position.set( 0, - 1, 0 );
    mesh.rotation.x = - Math.PI / 2;
    mesh.receiveShadow = true;
    scene.add( mesh );

    new PLYLoader().load( '/metaverse/Lucy100k.ply', function ( geometry ) {

      geometry.scale( 0.0024, 0.0024, 0.0024 );
      geometry.computeVertexNormals();

      const material = new THREE.MeshLambertMaterial();

      const mesh = new THREE.Mesh( geometry, material );
      mesh.rotation.y = - Math.PI / 2;
      mesh.position.y = 0.8;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add( mesh );

    });

    this.loop.updatables.push({
      tick: () => {
        const time = performance.now() / 3000;
        spotLight.position.x = Math.cos( time ) * 2.5;
        spotLight.position.z = Math.sin( time ) * 2.5;
      }
    })
    
    if (this.helper && this.helper.stats) {
      this.loop.updatables.push({
        tick: () => {
          this.helper.stats.update()
        }
      })
    }
    const gui = this.helper.gui;

    const params = {
      map: textures[ 'disturb.jpg' ],
      color: spotLight.color.getHex(),
      intensity: spotLight.intensity,
      distance: spotLight.distance,
      angle: spotLight.angle,
      penumbra: spotLight.penumbra,
      decay: spotLight.decay,
      focus: spotLight.shadow.focus,
      shadows: true
    };

    gui.add( params, 'map', textures ).onChange( function ( val ) {

      spotLight.map = val;

    } );

    gui.addColor( params, 'color' ).onChange( function ( val ) {

      spotLight.color.setHex( val );

    } );

    gui.add( params, 'intensity', 0, 500 ).onChange( function ( val ) {

      spotLight.intensity = val;

    } );


    gui.add( params, 'distance', 0, 20 ).onChange( function ( val ) {

      spotLight.distance = val;

    } );

    gui.add( params, 'angle', 0, Math.PI / 3 ).onChange( function ( val ) {

      spotLight.angle = val;

    } );

    gui.add( params, 'penumbra', 0, 1 ).onChange( function ( val ) {

      spotLight.penumbra = val;

    } );

    gui.add( params, 'decay', 1, 2 ).onChange( function ( val ) {

      spotLight.decay = val;

    } );

    gui.add( params, 'focus', 0, 1 ).onChange( function ( val ) {

      spotLight.shadow.focus = val;

    } );


    gui.add( params, 'shadows' ).onChange( function ( val ) {

      renderer.shadowMap.enabled = val;

      scene.traverse( function ( child ) {

        if ( child.material ) {

          child.material.needsUpdate = true;

        }

      } );

    } );

    gui.open();
  }

  toggleAudio(isAudioPlay) {
    if (isAudioPlay) {
      this.audio.play();
      
    } else {
      this.audio.pause();
    }
  }

  toggleRotate() {
    this.isRotatePlay = !this.isRotatePlay;
  }

  start() {
    this.loop.start();
  }

  stop() {
    this.loop.stop();
  }

  destroy() {
    this.helper && this.helper.remove()
    this.stop()
    // this.scene = null
    // this.camera = null
    // this.renderer = null
    // this.controls = null
    // this.loop = null
  }
}

export { World };
