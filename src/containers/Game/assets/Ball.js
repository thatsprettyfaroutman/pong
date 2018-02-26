import React from 'react'
import Entity from './Entity'

class Ball extends Entity {
  radius = 10
  minVelocityX = 10

  constructor(options) {
    super()
    this.set(options)
    this.velocity = {
      x: 20 * Math.cos(this.angle),
      y: 20 * Math.sin(this.angle),
    }
  }

  update = timeComp => {
    this.position.x += this.velocity.x * timeComp
    this.position.y += this.velocity.y * timeComp
    this.updateVelocities()
    this.keepInBounds()
  }

  updateVelocities = () => {
    const { position, radius, bounds, velocity, minVelocityX } = this
    if (
      position.x - radius < bounds.min.x
      || position.x + radius > bounds.max.x
    )
      velocity.x *= -1

    const negative = this.velocity.x < 0 ? -1 : 1
    if (Math.abs(velocity.x) < minVelocityX) {
      velocity.x = minVelocityX * negative
    }

    if (
      position.y - radius < bounds.min.y
      || position.y + radius > bounds.max.y
    )
      velocity.y *= -1
  }

  draw = () => (
    <circle
      className="Game__ball"
      r={this.radius}
      cx="0"
      cy="0"
      style={{
        transform: `translate3d(${this.position.x}px, ${this.position.y}px, 0)`
      }}
    />
  )

}

export default Ball
