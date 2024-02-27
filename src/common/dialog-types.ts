export const decksDialogList = {
  createDeck: 'create-deck',
  deleteDeck: 'delete-deck',
  learn: 'learn',
  updateDeck: 'update-deck',
} as const

export type DecksDialogTypes = (typeof decksDialogList)[keyof typeof decksDialogList]

export function isDecksDialogType(value: any): value is DecksDialogTypes {
  return Object.values(decksDialogList).includes(value)
}

export const cardsDialogsList = {
  createCard: 'create-card',
  deleteCard: 'delete-card',
  updateCard: 'update-card',
} as const

export type CardsDialogsTypes = (typeof cardsDialogsList)[keyof typeof cardsDialogsList]

export type CardsPageDialogsTypes = CardsDialogsTypes | DecksDialogTypes
