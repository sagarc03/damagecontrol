import { assert, describe, it } from 'vitest'

describe('Square root', () => {
  it('test', () => {
    assert.equal(Math.sqrt(4), 2)
  })
})

describe('suite', () => {
  it('skipped test', () => {
    // Test skipped, no error
    assert.equal(Math.sqrt(4), 3)
  })
  it('square root', () => {
    assert.notEqual(Math.sqrt(4), 5)
  })
})
