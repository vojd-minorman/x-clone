import auth from '@adonisjs/auth/services/main'
import vine from '@vinejs/vine'

export const createAddTweetValidator = vine.compile(
  vine.object({
    text: vine.string().trim().minLength(3),
    text_image: vine.string().trim(),
  })
)
