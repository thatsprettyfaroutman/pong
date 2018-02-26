import React from 'react'
import Entity from './Entity'
import Vector from '../../../utils/Vector'

class Ball extends Entity {
  radius = 30
  reachRadius = this.radius * 3
  playerNumber = 0
  bot = false
  ball = null
  paddle = null

  constructor(options) {
    super()
    this.set(options)
    if (!this.ball) throw new Error('Player needs ball')
    if (!this.paddle) throw new Error('Player needs paddle')
  }

  update = timeComp => {
    this.keepInBounds()
    if (this.bot) {
      this.position.y += 5 * timeComp
      if ( this.position.y > this.bounds.max.y - this.radius )
        this.position.y = this.bounds.min.y + this.radius
    }

    this.lookAt(this.ball.position)

    this.paddle.set({
      position: {
        x: this.position.x,
        y: this.position.y,
      }
    })
  }

  lookAt = position => {
    const v = new Vector(this.position.x, this.position.y)
    const ballV = new Vector(position.x, position.y)
    this.angle = ballV.angleTo(v)
  }

  hitsBall = () => {
    const v = new Vector(this.position.x, this.position.y)
    const ballV = new Vector(this.ball.position.x, this.ball.position.y)
    if (v.distance(ballV) > this.ball.radius + this.reachRadius) return false
    return this.paddle.hits(this.ball)
  }

  draw = props => {
    const {
      position,
      radius,
      angle,
      reachRadius,
    } = this

    const {
      playerNumber,
    } = props

    return (
      <g
        className={`Game__player Game__player--${playerNumber}`}
        style={{
          transform: `
            translate3d(${position.x}px, ${position.y}px, 0)
            rotate3d(0, 0, 1, ${angle}rad)
          `
        }}
        x={radius / -2}
        y={radius / -2}
      >
        <circle r={radius} />
        <circle r={radius * 0.1} cx={radius} cy={radius * -0.3} />
        <circle r={radius * 0.1} cx={radius} cy={radius * 0.3} />
        <circle r={reachRadius} />
      </g>
    )
  }

}

export default Ball
