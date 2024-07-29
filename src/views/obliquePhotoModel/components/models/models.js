
import { ObjMtlLoader } from './ObjMtlLoader.js'

import { setupModel } from './setupModel.js';

async function loadModels() {
  const loader = new ObjMtlLoader();

  const [part1Data, part2Data, part3Data, part4Data] = await Promise.all([
    new ObjMtlLoader().loadAsync('/obliquePhotoModel/Tile_+000_+000/Tile_+000_+000.mtl'),
    new ObjMtlLoader().loadAsync('/obliquePhotoModel/Tile_+000_+001/Tile_+000_+001.mtl'),
    new ObjMtlLoader().loadAsync('/obliquePhotoModel/Tile_+001_+000/Tile_+001_+000.mtl'),
    new ObjMtlLoader().loadAsync('/obliquePhotoModel/Tile_+001_+001/Tile_+001_+001.mtl'),
  ]);
  const part1 = setupModel(part1Data);
  part1.name = 'part1'

  const part2 = setupModel(part2Data);
  part2.name = 'part2'

  const part3 = setupModel(part3Data);
  part3.name = 'part3'

  const part4 = setupModel(part4Data);
  part4.name = 'part4'

  return {
    part1,
    part2,
    part3,
    part4,
  };
}

export { loadModels };
