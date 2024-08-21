import vine from '@vinejs/vine'

export const createAddTweetValidator = vine.compile(
  vine.object({
    text: vine.string().trim().minLength(3),
    tweet_image: vine.string().trim(),
  })
)
