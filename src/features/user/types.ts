export type UserData = {
  avatar: null | string
  created: string
  email: string
  id: string
  isEmailVerified: boolean
  name: string
  updated: string
}

// export type LoginData = {
//   email: string
//   password: string
//   rememberMe?: boolean
// }

export type LoginResponse = {
  accessToken: string
}

export type SignUpResponse = {
  avatar: string
  created: string
  email: string
  id: string
  isEmailVerified: boolean
  name: string
  updated: string
}

export type UpdatePasswordData = {
  password: string
  token: string
}
