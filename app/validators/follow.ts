import vine from '@vinejs/vine'

export const createFollowValidator = vine.compile(
  vine.object({
  follower_id: vine.number(),
  following_id: vine.number(),
  })
)
