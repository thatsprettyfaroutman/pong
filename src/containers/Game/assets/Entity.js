class Entity {
  radius = 10
  angle = 0
  position = { x: 0, y: 0 }
  velocity = { x: 0, y: 0 }
  bounds = {
    min: { x: 0, y: 0 },
    max: { x: 1280, y: 720 },
  }

  set(options) {
    if (typeof options !== 'object')
      throw new Error('options must be object')
    const keys = Object.keys(options)
    keys.forEach(key => this[key] = options[key])
  }

  keepInBounds() {
    if (this.position.x < this.bounds.min.x + this.radius)
      this.position.x = this.bounds.min.x + this.radius
    else if (this.position.x > this.bounds.max.x - this.radius)
      this.position.x = this.bounds.max.x - this.radius
    if (this.position.y < this.bounds.min.y + this.radius)
      this.position.y = this.bounds.min.y + this.radius
    else if (this.position.y > this.bounds.max.y - this.radius)
      this.position.y = this.bounds.max.y - this.radius
  }

  hitsRect(rect) {
    const { position, radius } = this
    return (
      position.x >= rect.position.x - radius
      && position.x <= rect.position.x + rect.width + radius
      && position.y >= rect.position.y - radius
      && position.y <= rect.position.y + rect.height + radius
    )
  }

  update = () => null
  draw = () => null
}

export default Entity
