export function documents(state = [], action) {
    switch (action.type) {
      case 'documents.medic':
        return { 
            medic: action.params.medic
        };
      default:
        return state
    }
  }
  