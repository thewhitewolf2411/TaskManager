import { createSelector } from "@reduxjs/toolkit"

const selectUserState = (state: any) => state.user

const getUserId = createSelector(selectUserState, (user) => ({
  userId: user?.id,
}))

const selectUserFullName = createSelector(selectUserState, (user) => {
  const { firstName, lastName } = user

  return `${firstName} ${lastName}`
})

export { selectUserState, getUserId, selectUserFullName }
