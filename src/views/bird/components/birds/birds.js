
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

import { setupModel } from './setupModel.js';

async function loadBirds() {
  const loader = new GLTFLoader();

  const [parrotData, flamingoData, storkData] = await Promise.all([
    loader.loadAsync('/assets/models/Parrot.glb'),
    loader.loadAsync('/assets/models/Flamingo.glb'),
    loader.loadAsync('/assets/models/Stork.glb'),
  ]);

  const parrot = setupModel(parrotData);
  parrot.name = 'parrot'
  parrot.position.set(4, 0, 0);

  const flamingo = setupModel(flamingoData);
  flamingo.name = 'flamingo'
  flamingo.position.set(7.5, 0, -10);

  const stork = setupModel(storkData);
  stork.name = 'stork'
  stork.position.set(0, -2.5, -10);

  return {
    parrot,
    flamingo,
    stork,
  };
}

export { loadBirds };
