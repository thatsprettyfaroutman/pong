import './index.css'
import React, { Component } from 'react'
// import Vector from 'point-geometry'
import Vector from '../../utils/Vector'

//
// const v1 = new Vector(0, 0)
// console.log(v1)
// v1.add(new Vector(10, 10))
// console.log(v1)
// v1.add(new Vector(10, 100))
// console.log(v1, v1.angleDeg())



// TODO: CONVERT EVERYTHING TO VECTORS



const GAME_WIDTH = 1280
const GAME_HEIGHT = 720
const BALL_R = 10
const PLAYER_R = 30
const PLAYER_REACH_R = PLAYER_R * 3
const PADDLE_R = PLAYER_R * 6
const FIELD_BOUNDS = {
  top: 0,
  right: GAME_WIDTH,
  bottom: GAME_HEIGHT,
  left: 0,
}
const BALL_BOUNDS = {
  top: BALL_R,
  right: GAME_WIDTH - BALL_R,
  bottom: GAME_HEIGHT - BALL_R,
  left: BALL_R,
}

class Game extends Component {
  state = {
    frame: 0,
  }
  lastPhysicsTime = Date.now()

  ballAngle = Math.random() + 3
  ball = {
    x: GAME_WIDTH / 2,
    y: GAME_HEIGHT / 2,
    vx: 20 * Math.cos(this.ballAngle),
    vy: 20 * Math.sin(this.ballAngle),
    // x: GAME_WIDTH * 0.4,
    // y: GAME_HEIGHT * 0,
    // vx: -10,
    // vy: 10,
  }

  ballTrajectory = {
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
  }

  playerA = {
    x: 100,
    y: GAME_HEIGHT / 2,
    angle: 0,
  }

  playerB = {
    x: GAME_WIDTH - 100,
    y: GAME_HEIGHT / 2,
    angle: 0,
  }

  paddleA = {
    vx: 0,
    vy: 0,
    xo: PADDLE_R * -0.75,
    x: this.playerA.x,
    y: this.playerA.y,
  }

  paddleB = {
    vx: 0,
    vy: 0,
    xo: PADDLE_R * 0.75,
    x: this.playerB.x + PADDLE_R * 0.8,
    y: this.playerB.y,
  }

  physicsInterval = null

  componentWillMount() {
    this.lastPhysicsTime = Date.now()
    this.physicsInterval = setInterval(this.physicsLoop, 1000 / 60)
    this.renderLoop()
  }

  componentWillUnmount() {
    clearInterval(this.physicsInterval)
    this.physicsInterval = null
  }

  renderLoop = () => {
    if (!this.physicsInterval) return
    requestAnimationFrame(this.renderLoop)
    this.setState({ frame: this.state.frame + 1 })
  }

  physicsLoop = () => {
    const now = Date.now()
    const timeComp = (now - this.lastPhysicsTime) / 30
    this.lastPhysicsTime = now
    this.ball = this.getNextBall(this.ball, timeComp)
    this.ballTrajectory = this.getNextBallTrajectory(this.ball, timeComp)
    this.playerA = this.getNextPlayer(this.playerA, this.ball, timeComp)
    this.playerB = this.getNextPlayer(this.playerB, this.ball, timeComp, true)
    this.paddleA = this.getNextPaddle(this.paddleA, this.playerA)
    this.paddleB = this.getNextPaddle(this.paddleB, this.playerB)


    // Collisions

    const ballV = new Vector(this.ball.x, this.ball.y)
    const playerAV = new Vector(this.playerA.x, this.playerA.y)
    const playerBV = new Vector(this.playerB.x, this.playerB.y)
    const paddleAV = new Vector(this.paddleA.x, this.paddleA.y)
    const paddleBV = new Vector(this.paddleB.x, this.paddleB.y)

    // console.log(playerAV.distance(ballV))

    const playerAcanReach = (
      playerAV.distance(ballV) < BALL_R + PLAYER_REACH_R
      && ballV.x > playerAV.x
    )
    const playerBcanReach = (
      playerBV.distance(ballV) < BALL_R + PLAYER_REACH_R
      && ballV.x < playerBV.x
    )

    const ballHitsPaddleA = paddleAV.distance(ballV) < BALL_R + PADDLE_R
    const ballHitsPaddleB = paddleBV.distance(ballV) < BALL_R + PADDLE_R

    if (ballHitsPaddleA && playerAcanReach) {
      this.handlePaddleHit(this.paddleA, this.ball)
    }

    if (ballHitsPaddleB && playerBcanReach) {
      this.handlePaddleHit(this.paddleB, this.ball)
    }

  }

  getNextBall(ball, timeComp) {
    let { x, y, vx, vy } = ball
    if (x >= BALL_BOUNDS.right || x <= BALL_BOUNDS.left) vx *= -1
    if (y >= BALL_BOUNDS.bottom || y <= BALL_BOUNDS.top) vy *= -1

    x += vx * timeComp
    y += vy * timeComp

    if (x > BALL_BOUNDS.right) x = BALL_BOUNDS.right
    else if (x < BALL_BOUNDS.left) x = BALL_BOUNDS.left

    if (y > BALL_BOUNDS.bottom) y = BALL_BOUNDS.bottom
    else if (y < BALL_BOUNDS.top) y = BALL_BOUNDS.top

    return { x, y, vx, vy }
  }

  getNextBallTrajectory(ball, timeComp) {
    let x2 = 0
    if (ball.vx < 0) x2 = BALL_BOUNDS.left
    else x2 = BALL_BOUNDS.right

    let distanceEdge = 0
    if (ball.vx < 0) distanceEdge = ball.x
    else distanceEdge = BALL_BOUNDS.right - ball.x

    let y2 = ball.y
    if (ball.vx && ball.vy) y2 += distanceEdge / Math.abs(ball.vx) * ball.vy

    return {
      x1: ball.x,
      y1: ball.y,
      x2: x2,
      y2: y2,
    }
  }

  getNextPlayer(player, ball, timeComp, bot=false) {
    const playerV = new Vector(player.x, player.y)
    const ballV = new Vector(ball.x, ball.y)

    let y = player.y
    if (bot) y += 5 * timeComp
    if ( y > GAME_HEIGHT ) y = 0

    const angle = ballV.angleTo(playerV)

    return {
      ...player,
      angle,
      y,
    }
  }

  getNextPaddle(paddle, player, timeComp) {
    return {
      ...paddle,
      x: player.x + paddle.xo,
      y: player.y,
    }
  }

  handlePaddleHit(paddle, ball) {
    const ballV = new Vector(ball.x, ball.y)
    const paddleV = new Vector(paddle.x, paddle.y)

    // Correct ball position
    const paddleAngleToBall = ballV.angleTo(paddleV)
    ball.x = paddle.x + (PADDLE_R + BALL_R) * Math.cos(paddleAngleToBall)
    ball.y = paddle.y + (BALL_R + PADDLE_R) * Math.sin(paddleAngleToBall)

    const delta = ballV.clone().subtract(paddleV)
    const d = delta.length()
    const mtd = delta.clone().multiply(((BALL_R + PADDLE_R) - d) / d)

    const im1 = 1 / 1 // ball
    const im2 = 1 / 0xfffffff // paddle

    const v = new Vector(this.ball.vx, this.ball.vy)//.negative()
    const vn = v.clone().dot(mtd.normalize())

    if (vn > 0) return

    const i = (-(1 + 0.85) * vn) / (im1 + im2)
    const impulse = mtd.clone().multiply(i)

    const velocity =
      new Vector(this.ball.vx, this.ball.vy)
      .add(impulse.clone().multiply(im1))

    this.ball.vx = velocity.x * 1.1
    this.ball.vy = velocity.y * 1.1
  }

  getDegrees(radians) {
    return radians * 180 / Math.PI
  }


  render () {
    const {
      ball,
      ballTrajectory,
      playerA,
      playerB,
      paddleA,
      paddleB,
    } = this

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

        <rect
          className="Game__field"
          x={FIELD_BOUNDS.left}
          y={FIELD_BOUNDS.top}
          width={FIELD_BOUNDS.right}
          height={FIELD_BOUNDS.bottom}
        />

        <circle
          className="Game__ball"
          r={BALL_R}
          cx="0"
          cy="0"
          style={{
            transform: `translate3d(${ball.x}px, ${ball.y}px, 0)`
          }}
        />

        <line
          className="Game__ballTrajectory"
          x1={ballTrajectory.x2}
          y1={ballTrajectory.y2}
          x2={ballTrajectory.x1}
          y2={ballTrajectory.y1}
        />

        <g
          className="Game__player Game__player--a"
          style={{
            transform: `translate3d(${playerA.x}px, ${playerA.y}px, 0) rotate3d(0, 0, 1, ${playerA.angle}rad)`
          }}
          x={PLAYER_R / -2}
          y={PLAYER_R / -2}
        >
          <circle r={PLAYER_R} />
          <circle r={PLAYER_R * 0.1} cx={PLAYER_R} cy={PLAYER_R * -0.3} />
          <circle r={PLAYER_R * 0.1} cx={PLAYER_R} cy={PLAYER_R * 0.3} />
          <circle r={PLAYER_REACH_R} />
        </g>

        <circle
          className="Game__paddle Game__paddle--a"
          style={{
            transform: `translate3d(${paddleA.x}px, ${paddleA.y}px, 0)`
          }}
          r={PADDLE_R}
        />

        <g
          className="Game__player Game__player--b"
          style={{
            transform: `translate3d(${playerB.x}px, ${playerB.y}px, 0) rotate3d(0, 0, 1, ${playerB.angle}rad)`
          }}
          x={PLAYER_R / -2}
          y={PLAYER_R / -2}
        >
          <circle r={PLAYER_R} />
          <circle r={PLAYER_R * 0.1} cx={PLAYER_R} cy={PLAYER_R * -0.3} />
          <circle r={PLAYER_R * 0.1} cx={PLAYER_R} cy={PLAYER_R * 0.3} />
          <circle r={PLAYER_REACH_R} />
        </g>

        <circle
          className="Game__paddle Game__paddle--b"
          style={{
            transform: `translate3d(${paddleB.x}px, ${paddleB.y}px, 0)`
          }}
          r={PADDLE_R}
        />



      </svg>
    )
  }
}


export default Game


// TODO: Render tick loop with requestAnimationFrame
// TODO: Physics calculation tick loop with constant 30 or 60 fps


/*

<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="426px" height="59px" viewBox="0 0 426 59" version="1.1">
    <defs/>
    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="Desktop-HD-Copy-16" transform="translate(-507.000000, -442.000000)">
            <g id="Group-6" transform="translate(507.000000, 442.000000)">
                <g id="Group-4" fill="#1DB4DB">
                    <polygon id="Page-1" points="328 -0.0002 328 58.8438 425.296 58.8438 405.295 29.4218 425.296 -0.0002"/>
                    <polygon id="Page-1-Copy" transform="translate(48.648100, 29.421900) rotate(-180.000000) translate(-48.648100, -29.421900) " points="0 -0.0002 0 58.8438 97.296 58.8438 77.295 29.4218 97.296 -0.0002"/>
                </g>
                <polygon id="Path-16" fill="#1998B9" points="381.140716 9.83876977 351 40.8191686 351 0"/>
                <polygon id="Path-16-Copy" fill="#1998B9" transform="translate(60.358955, 20.409584) scale(-1, 1) translate(-60.358955, -20.409584) " points="75.7179106 9.86533601 45 40.8191686 45 0"/>
            </g>
        </g>
    </g>
</svg>

*/
