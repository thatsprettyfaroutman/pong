import React, { Fragment } from 'react'
import Entity from './Entity'
import Vector from '../../../utils/Vector'




class Paddle extends Entity {
  offset = { x: 120, y: 0 }
  radius = 30 * 6
  hitArea = {
    position: { x: 0, y: 0 },
    offset: { x: -90, y: -80 },
    width: 60,
    height: 160,
  }
  mirrored = 1

  constructor(options) {
    super()
    this.set(options)
  }

  set(options) {
    if (typeof options !== 'object') return

    const keys = Object.keys(options)
    keys.forEach(key => {
      this[key] = options[key]
      if (key === 'position') {

        // Check if x offset should be mirroreded
        let mirrored = 1
        if (this.position.x < this.bounds.max.x / 2) mirrored = -1
        this.mirrored = mirrored

        this.position.x += this.offset.x * mirrored
        this.position.y += this.offset.y

        if (mirrored === -1) {
          this.hitArea.position.x =
            this.position.x - this.hitArea.offset.x + this.hitArea.width
        } else {
          this.hitArea.position.x =
            this.position.x + this.hitArea.offset.x - this.offset.x
        }
        this.hitArea.position.y =
          this.position.y + this.hitArea.offset.y - this.offset.y
      }
    })
  }

  hits = entity => {
    if (!entity.hitsRect(this.hitArea)) return false
    const v = new Vector(this.position.x, this.position.y)
    const entityV = new Vector(entity.position.x, entity.position.y)
    return v.distance(entityV) < entity.radius + this.radius
  }

  draw = ({ paddleNumber }) => {
    const {
      position,
      radius,
      hitArea,
    } = this

    return (
      <g
        clipPath={`url(#paddleMask--${paddleNumber})`}
        className={`Game__paddle Game__paddle--${paddleNumber}`}
        style={{
          transform: `
            translate3d(${position.x}px, ${position.y}px, 0)
          `
        }}
      >
        <circle
          r={radius}
        />
      </g>

    )
  }

  drawToDefs = ({ paddleNumber }) => {
    const {
      hitArea,
    } = this

    return (
      <clipPath id={`paddleMask--${paddleNumber}`}>
        <rect
          className="Game__paddleHitArea"
          width={hitArea.width}
          height={hitArea.height}
          x={this.mirrored === -1 ? (
            hitArea.width - hitArea.offset.x
          ) : (
            hitArea.offset.x - hitArea.width * 2
          )}
          y={hitArea.offset.y}
        />
      </clipPath>
    )
  }

  /*
  style={{
    transform: `
      translate3d(${hitArea.position.x}px, ${hitArea.position.y}px, 0)
    `
  }}
  */

}

export default Paddle
