import './index.css'

import React, { Component } from 'react'

const GAME_WIDTH = 1280
const GAME_HEIGHT = 720
const BALL_R = 10
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

  ball = {
    x: GAME_WIDTH / 2,
    y: GAME_HEIGHT / 2,
    vx: 20,
    vy: Math.random() * 10 - 5,
  }

  physicsInterval = null

  componentWillMount() {
    this.physicsInterval = setInterval(this.physicsLoop, 1000 / 30)
    this.renderLoop()
  }

  componentWillUnmount() {
    clearInterval(this.physicsInterval)
  }

  renderLoop = () => {
    requestAnimationFrame(this.renderLoop)
    this.setState({ frame: this.state.frame + 1 })
  }

  physicsLoop = () => {
    const t = Date.now()
    this.ball = this.getNextBallState(this.ball)
  }

  getNextBallState(ball) {
    let { x, y, vx, vy } = ball
    if (x > BALL_BOUNDS.right || x < BALL_BOUNDS.left) vx *= -1.005
    if (y > BALL_BOUNDS.bottom || y < BALL_BOUNDS.top) vy *= -1.005

    x += vx
    y += vy

    return { x, y, vx, vy }
  }

  render () {
    const { ball } = this

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
          cx={BALL_R / -2}
          cy={BALL_R / -2}
          style={{
            transform: `translate3d(${ball.x}px, ${ball.y}px, 0)`
          }}
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
