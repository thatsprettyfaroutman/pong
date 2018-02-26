import './index.css'
import React, { Component } from 'react'
import Vector from '../../utils/Vector'

import Ball from './assets/Ball'
import Player from './assets/Player'
import Trajectory from './assets/Trajectory'
import Paddle from './assets/Paddle'




const GAME_WIDTH = 1280
const GAME_HEIGHT = 720

class Game extends Component {
  state = {
    frame: 0,
  }
  lastUpdate = Date.now()
  gameInterval = null


  // Game assets
  ball = new Ball({
    position: {
      x: GAME_WIDTH / 2,
      y: GAME_HEIGHT / 2,
    },
    angle: Math.random() + 3,
  })
  paddles = [
    new Paddle({
      offset: { x: -120, y: 0}
    }),
    new Paddle({
      offset: { x: 120, y: 0}
    }),
  ]
  players = [
    new Player({
      position: {
        x: 100,
        y: GAME_HEIGHT / 2,
      },
      paddle: this.paddles[0],
      ball: this.ball,
    }),
    new Player({
      bot: true,
      position: {
        x: GAME_WIDTH - 100,
        y: GAME_HEIGHT / 2,
      },
      paddle: this.paddles[1],
      ball: this.ball,
    })
  ]
  trajectory = new Trajectory({
    ball: this.ball,
  })


  componentWillMount() {
    this.lastUpdate = Date.now()
    this.gameInterval = setInterval(this.gameLoop, 1000 / 60)
    this.renderLoop()
  }

  componentWillUnmount() {
    clearInterval(this.gameInterval)
    this.gameInterval = null
  }

  renderLoop = () => {
    if (!this.gameInterval) return
    requestAnimationFrame(this.renderLoop)
    this.setState({ frame: this.state.frame + 1 })
  }

  gameLoop = () => {
    const now = Date.now()
    const timeComp = (now - this.lastUpdate) / 30
    this.lastUpdate = now

    this.ball.update(timeComp)
    this.players.forEach(x => x.update(timeComp))
    this.trajectory.update(timeComp)
    this.paddles.forEach(x => x.update(timeComp))

    this.players.forEach(player => {
      if (player.hitsBall()) this.handleBallHit(player)
    })

  }

  handleBallHit(player) {
    const { ball, paddle } = player
    const ballV = new Vector(ball.position.x, ball.position.y)
    const paddleV = new Vector(paddle.position.x, paddle.position.y)

    // Correct ball position
    const paddleAngleToBall = ballV.angleTo(paddleV)
    const combinedRadius = paddle.radius + ball.radius
    ball.position.x =
      paddle.position.x + combinedRadius * Math.cos(paddleAngleToBall)
    ball.position.y =
      paddle.position.y + combinedRadius * Math.sin(paddleAngleToBall)

    const delta = ballV.clone().subtract(paddleV)
    const d = delta.length()
    const mtd = delta.clone().multiply(((ball.radius + paddle.radius) - d) / d)

    const im1 = 1 / 1 // ball
    const im2 = 1 / 0xfffffff // paddle

    const v = new Vector(this.ball.velocity.x, this.ball.velocity.y)//.negative()
    const vn = v.clone().dot(mtd.normalize())

    if (vn > 0) return

    const i = (-(1 + 0.85) * vn) / (im1 + im2)
    const impulse = mtd.clone().multiply(i)

    const velocity =
      new Vector(this.ball.velocity.x, this.ball.velocity.y)
      .add(impulse.clone().multiply(im1))

    this.ball.velocity.x = velocity.x * 1.1
    this.ball.velocity.y = velocity.y * 1.1
  }

  getDegrees(radians) {
    return radians * 180 / Math.PI
  }


  render () {
    const {
      ball,
      players,
      trajectory,
      paddles,
    } = this

    // console.log(ball)

    return (
      <svg
        className="Game"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        width={GAME_WIDTH}
        height={GAME_HEIGHT}
        viewBox={`0 0 ${GAME_WIDTH} ${GAME_HEIGHT}`}
        version="1.1"
      >

        <ball.draw />
        <trajectory.draw />

        { players.map((player, i) => (
          <player.draw
            key={i}
            playerNumber={i}
          />
        ))}

        { paddles.map((paddle, i) => (
          <paddle.draw
            key={i}
            paddleNumber={i}
          />
        ))}

      </svg>
    )
  }
}

export default Game
