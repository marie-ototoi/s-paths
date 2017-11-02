import chai, {expect} from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
chai.use(sinonChai)
import undoable from 'redux-undo'
import selections from '../../src/reducers/selections'

const savedState = [{ query: 'bibo:Book' }]
const initialState = [{ query: '?' }]

describe('reducers/selections', () => {
  it('should handle initial state', () => {
    
    expect(selections(undefined, { })).to.deep.equal(initialState)
    expect(selections(savedState, { })).to.deep.equal(savedState)
  })
  it('should handle ADD_SELECTION', () => {
    let addAction =  { 
      type: 'ADD_SELECTION', 
      element: '#topic', 
      query: 'WHERE ?resource dct:subject ?any' 
    }
    expect(selections(undefined, addAction))
      .to.deep.equal([
        { query: '?' },
        {element: '#topic', query: 'WHERE ?resource dct:subject ?any' }
      ])
    expect(selections(savedState, addAction))
      .to.deep.equal([
        { query: 'bibo:Book' },
        { element: '#topic', query: 'WHERE ?resource dct:subject ?any' }
      ])
  })
  it('should handle REMOVE_SELECTION', () => {
    let removeAction =  { 
      type: 'REMOVE_SELECTION',
      element: '#topic'
    }
    let state = [
      { query: 'bibo:Book' },
      { element: '#topic', query: 'WHERE ?resource dct:subject ?any' }
    ]

    expect(selections(undefined, removeAction))
      .to.deep.equal([
        { query: '?' }
      ])

    expect(selections(state, removeAction))
      .to.deep.equal([
        { query: 'bibo:Book' }
      ])
  })

  /*it('should handle ADD_TODO', () => {
    expect(
      todos([], {
        type: types.ADD_TODO,
        text: 'Run the tests'
      })
    ).toEqual([
      {
        text: 'Run the tests',
        completed: false,
        id: 0
      }
    ])

    expect(
      todos([
        {
          text: 'Use Redux',
          completed: false,
          id: 0
        }
      ], {
        type: types.ADD_TODO,
        text: 'Run the tests'
      })
    ).toEqual([
      {
        text: 'Use Redux',
        completed: false,
        id: 0
      },
      {
        text: 'Run the tests',
        completed: false,
        id: 1
      }
    ])

    expect(
      todos([
        {
          text: 'Use Redux',
          completed: false,
          id: 0
        }, {
          text: 'Run the tests',
          completed: false,
          id: 1
        }
      ], {
        type: types.ADD_TODO,
        text: 'Fix the tests'
      })
    ).toEqual([
      {
        text: 'Use Redux',
        completed: false,
        id: 0
      },
      {
        text: 'Run the tests',
        completed: false,
        id: 1
      },
      {
        text: 'Fix the tests',
        completed: false,
        id: 2
      }
    ])
  })

  it('should handle DELETE_TODO', () => {
    expect(
      todos([
        {
          text: 'Use Redux',
          completed: false,
          id: 0
        },
        {
          text: 'Run the tests',
          completed: false,
          id: 1
        }
      ], {
        type: types.DELETE_TODO,
        id: 1
      })
    ).toEqual([
      {
        text: 'Use Redux',
        completed: false,
        id: 0
      }
    ])
  })

  it('should handle EDIT_TODO', () => {
    expect(
      todos([
        {
          text: 'Run the tests',
          completed: false,
          id: 1
        }, {
          text: 'Use Redux',
          completed: false,
          id: 0
        }
      ], {
        type: types.EDIT_TODO,
        text: 'Fix the tests',
        id: 1
      })
    ).toEqual([
      {
        text: 'Fix the tests',
        completed: false,
        id: 1
      }, {
        text: 'Use Redux',
        completed: false,
        id: 0
      }
    ])
  })

  it('should handle COMPLETE_TODO', () => {
    expect(
      todos([
        {
          text: 'Run the tests',
          completed: false,
          id: 1
        }, {
          text: 'Use Redux',
          completed: false,
          id: 0
        }
      ], {
        type: types.COMPLETE_TODO,
        id: 1
      })
    ).toEqual([
      {
        text: 'Run the tests',
        completed: true,
        id: 1
      }, {
        text: 'Use Redux',
        completed: false,
        id: 0
      }
    ])
  })

  it('should handle COMPLETE_ALL', () => {
    expect(
      todos([
        {
          text: 'Run the tests',
          completed: true,
          id: 1
        }, {
          text: 'Use Redux',
          completed: false,
          id: 0
        }
      ], {
        type: types.COMPLETE_ALL
      })
    ).toEqual([
      {
        text: 'Run the tests',
        completed: true,
        id: 1
      }, {
        text: 'Use Redux',
        completed: true,
        id: 0
      }
    ])

    // Unmark if all todos are currently completed
    expect(
      todos([
        {
          text: 'Run the tests',
          completed: true,
          id: 1
        }, {
          text: 'Use Redux',
          completed: true,
          id: 0
        }
      ], {
        type: types.COMPLETE_ALL
      })
    ).toEqual([
      {
        text: 'Run the tests',
        completed: false,
        id: 1
      }, {
        text: 'Use Redux',
        completed: false,
        id: 0
      }
    ])
  })

  it('should handle CLEAR_COMPLETED', () => {
    expect(
      todos([
        {
          text: 'Run the tests',
          completed: true,
          id: 1
        }, {
          text: 'Use Redux',
          completed: false,
          id: 0
        }
      ], {
        type: types.CLEAR_COMPLETED
      })
    ).toEqual([
      {
        text: 'Use Redux',
        completed: false,
        id: 0
      }
    ])
  })

  it('should not generate duplicate ids after CLEAR_COMPLETED', () => {
    expect(
      [
        {
          type: types.COMPLETE_TODO,
          id: 0
        }, {
          type: types.CLEAR_COMPLETED
        }, {
          type: types.ADD_TODO,
          text: 'Write more tests'
        }
      ].reduce(todos, [
        {
          id: 0,
          completed: false,
          text: 'Use Redux'
        }, {
          id: 1,
          completed: false,
          text: 'Write tests'
        }
      ])
    ).toEqual([
      {
        text: 'Write tests',
        completed: false,
        id: 1
      }, {
        text: 'Write more tests',
        completed: false,
        id: 2
      }
    ])
  })*/
})
