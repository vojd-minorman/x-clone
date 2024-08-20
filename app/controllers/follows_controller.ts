import type { HttpContext } from '@adonisjs/core/http'
// import User from '#models/user'
import Follow from '#models/follow'
import { createFollowValidator } from '#validators/follow'

export default class FollowsController {

  async followOrUnfollow({ request, auth, response }: HttpContext) {
    const data = await request.validateUsing(createFollowValidator)
    const action = request.input('action')
    const userId = auth.user?.id

    if (!userId) {
      return response.unauthorized('You need to be logged in to perform this action.')
    }

    if (action === 'follow') {
      const existingFollow = await Follow.query()
        .where('follower_id', userId)
        .where('following_id', data.following_id)
        .first()

      if (existingFollow) {
        return response.json({ success: false, message: 'Vous suivez déjà cet utilisateur' })
      }

      await Follow.create({
        follower_id: userId,
        following_id: data.following_id,
      })

      return response.json({ success: true, message: 'Suivi avec succès' })
    } else if (action === 'unfollow') {
      await Follow.query()
        .where('follower_id', userId)
        .where('following_id', data.following_id)
        .delete()

      return response.json({ success: true, message: 'Désabonné avec succès' })
    } else {
      return response.badRequest('Action invalide')
    }
  }
}
