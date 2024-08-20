import vine from '@vinejs/vine'
// import User from '#models/user'

export const createRegisterValidator = vine.compile(
  vine.object({
    fullName: vine.string().trim().minLength(3),
    email: vine.string().unique(async (db, value) => {
      const user = await db
        .from('users')
        .where('email', value) 
        .first()
      return !user
    }),
    password: vine.string().trim(),
    date_of_birth: vine.date(),
  })
)
