import React from 'react'
import Entity from './Entity'

class Ball extends Entity {
  radius = 10

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
    if (
      this.position.x - this.radius < this.bounds.min.x
      || this.position.x + this.radius > this.bounds.max.x
    )
      this.velocity.x *= -1

    if (
      this.position.y - this.radius < this.bounds.min.y
      || this.position.y + this.radius > this.bounds.max.y
    )
      this.velocity.y *= -1
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
