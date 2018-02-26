import React from 'react'
import Entity from './Entity'

class Trajectory extends Entity {
  endPosition = this.position
  startPosition = this.position
  ball = null

  constructor(options) {
    super()
    this.set(options)
  }

  update = () => {
    const { ball } = this
    if (!ball) return

    const startPosition = {
      x: 0,
      y: 0,
    }

    startPosition.x = 0
    if (ball.velocity.x < 0) startPosition.x = ball.bounds.min.x
    else startPosition.x = ball.bounds.max.x

    let distanceEdge = 0
    if (ball.velocity.x < 0) distanceEdge = ball.position.x
    else distanceEdge = ball.bounds.max.x - ball.position.x

    startPosition.y = ball.position.y
    if (ball.velocity.x && ball.velocity.y)
      startPosition.y += distanceEdge / Math.abs(ball.velocity.x) * ball.velocity.y

    this.endPosition = ball.position
    this.startPosition = startPosition
  }

  draw = () => (
    <line
      className="Game__trajectory"
      x1={this.startPosition.x}
      y1={this.startPosition.y}
      x2={this.endPosition.x}
      y2={this.endPosition.y}
    />
  )

}

export default Trajectory
