/**
 * 灯光基类
 */
export default class Light {

  constructor(scene) {
    this.scene = scene
    this.light = {}
  }

  /**
   * 设置灯光位置
   * @param x
   * @param y
   * @param z
   */
  setPosition([x, y, z]) {
    if (this.light) this.light.position.set(x, y, z)
  }

  /**
   * 移除灯光
   */
  remove() {
    if (this.light) this.scene.remove(this.light)
  }
}
