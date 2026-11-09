// Fixed lists shared by frontend and backend. Change them here only.

export const CUISINES = [
    'American', 'Burgers', 'Mediterranean', 'Middle Eastern', 'Mexican', 'Italian',
    'Pizza', 'Chinese', 'Thai', 'Indian', 'Japanese', 'Cafe',
  ]
  
  export const DIETARY = ['Halal', 'Vegetarian', 'Vegan']
  
  export const MAX_CUISINES = 3
  export const BUDGET = { min: 5, max: 40, step: 5, default: 20 }
  export const MAX_DISTANCE_MILES = 2
  export const MAX_GROUP_SIZE = 8
  
  // Starting points with stored coordinates (approximate; verify on Google Maps).
  export const START_LOCATIONS = [
    { id: 'taylor', label: '900 W Taylor St', lat: 41.8696, lng: -87.6475 },
    { id: 'sce', label: 'UIC Student Center East', lat: 41.8719, lng: -87.6477 },
    { id: 'scw', label: 'UIC Student Center West', lat: 41.8743, lng: -87.6741 },
    { id: 'daley', label: 'Richard J. Daley Library', lat: 41.8718, lng: -87.65 },
  ]
  
  // Every tab shows the screen that matches the group's status.
  export const STATUS = { LOBBY: 'lobby', BROWSING: 'browsing', VOTING: 'voting', CONFIRMED: 'confirmed' }