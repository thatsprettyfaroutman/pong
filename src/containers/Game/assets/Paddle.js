import React from 'react'
import Entity from './Entity'
import Vector from '../../../utils/Vector'

class Paddle extends Entity {
  offset = { x: 0, y: 0 }
  radius = 30 * 6
  player = null
  ball = null

  constructor(options) {
    super()
    this.set(options)
  }

  hits = entity => {
    const v = new Vector(this.position.x, this.position.y)
    const entityV = new Vector(entity.position.x, entity.position.y)
    return v.distance(entityV) < entity.radius + this.radius
  }

  set(options) {
    if (typeof options !== 'object')
      throw new Error('options must be object')
    const keys = Object.keys(options)
    keys.forEach(key => {
      this[key] = options[key]
      if (key === 'position') {
        this.position.x += this.offset.x
        this.position.y += this.offset.y
      }
    })
  }

  draw = props => {
    const {
      position,
      radius
    } = this

    const {
      paddleNumber,
    } = props

    return (
      <circle
        className={`Game__paddle Game__paddle--${paddleNumber}`}
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0)`
        }}
        r={radius}
      />
    )
  }

}

export default Paddle
