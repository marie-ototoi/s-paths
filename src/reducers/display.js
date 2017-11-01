const selection = (state, action) => {
  switch (action.type) {
    case 'ADD_SELECTION':
      return {
        element: action.element,
        query: action.query
      }
    case 'REMOVE_SELECTION':
      if (state.element !== action.element) {
        return state
      }
    default:
      return state
  }
}

const selections = (state = [], action) => {
  switch (action.type) {
    case 'ADD_SELECTION':
      return [
        ...state,
        selection(undefined, action)
      ]
    case 'REMOVE_SELECTION':
      return state.map(t =>
        selection(t, action)
      )
    default:
      return state
  }
}


export default display
