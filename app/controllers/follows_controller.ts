import type { HttpContext } from '@adonisjs/core/http'
// import User from '#models/user'
import Follow from '#models/follow'

export default class FollowsController {

  async follow({ params, auth, response }: HttpContext) {
    const userId = auth.user?.id
    const followingId = params.id

    if (!userId) {
      return response.unauthorized('You need to be logged in to follow someone.')
    }

    const existingSubscription = await Follow.query()
        .where('follower_id', userId)
        .where('following_id', followingId)
        .first()

      if (existingSubscription) {
        return response.json({ message: 'Vous suivez déjà cet utilisateur' })
      }
    await Follow.create({
      follower_id: userId,
      following_id: followingId,
    })

    return response.json({ message: 'Créé avec succes' })
  }

  async unfollow({ params, auth, response }: HttpContext) {
    const userId = auth.user?.id
    const followingId = params.id

    if (!userId) {
      return response.unauthorized('You need to be logged in to unfollow someone.')
    }

    await Follow.query()
      .where('follower_id', userId)
      .where('following_id', followingId)
      .delete()

      return response.json({ success: true })
  }
}


