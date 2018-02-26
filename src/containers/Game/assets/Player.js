import React from 'react'
import Entity from './Entity'
import Vector from '../../../utils/Vector'

class Player extends Entity {
  static SIDE_LEFT = Symbol('SIDE_LEFT')
  static SIDE_RIGHT = Symbol('SIDE_RIGHT')

  side = Player.SIDE_LEFT
  radius = 30
  playerNumber = 0
  bot = false
  botLevel = 1
  ball = null
  paddle = null

  constructor(options) {
    super()
    this.set(options)

    if (!this.ball)
      throw new Error('Player needs ball')

    if (!this.paddle)
      throw new Error('Player needs paddle')

    if (typeof this.playerNumber !== 'number')
      throw new Error('Player needs playerNumber')
  }

  update = timeComp => {
    const { position, ball, paddle, velocity, bot, botLevel } = this

    if (bot) {
      const v = new Vector(position.x, position.y)
      const ballV = new Vector(ball.position.x, ball.position.y)
      velocity.y =
        (ball.position.y - position.y) / (v.distance(ballV) / botLevel)
      position.y += velocity.y * timeComp
    }

    this.keepInBounds()

    this.lookAt(ball.position)

    paddle.set({
      position: {
        x: position.x,
        y: position.y,
      }
    })

  }

  lookAt = position => {
    const v = new Vector(this.position.x, this.position.y)
    const ballV = new Vector(position.x, position.y)
    this.angle = ballV.angleTo(v)
  }

  hitsBall = () => {
    return this.paddle.hits(this.ball)
  }

  draw = props => {
    const {
      position,
      radius,
      angle,
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
      >
        <circle r={radius} />
        <circle r={radius * 0.1} cx={radius} cy={radius * -0.3} />
        <circle r={radius * 0.1} cx={radius} cy={radius * 0.3} />
      </g>
    )
  }
}

export default Player
