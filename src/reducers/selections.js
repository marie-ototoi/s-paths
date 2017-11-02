

const selection = (state, action) => {
  switch (action.type) {
    case 'ADD_SELECTION':
      return {
        element: action.element,
        query: action.query
      }
    default:
      return state
  }
}

const selections = (state = [{ query: '?' }], action ) => {
  switch (action.type) {
    case 'ADD_SELECTION':
      return [
        ...state,
        selection(undefined, action)
      ]
    case 'REMOVE_SELECTION':
      return state.filter(sel =>
        sel.element !== action.element
      )
    default:
      return state
  }
}

export default selections
