import type { HttpContext } from '@adonisjs/core/http'
// import User from '#models/user'
import Tweet from '#models/tweet'
import {createAddTweetValidator } from '#validators/add_tweet'
export default class TweetsController {

  async addTweet({ request, auth, response }: HttpContext) {
    const data = await request.validateUsing(createAddTweetValidator)
    const userId = auth.user?.id
    // Créer un nouvau Tweet
      await Tweet.create({
      user_id: userId,
      text: data.text,
      tweet_image: data.text_image,
      likes : 0,
      retweets : 0,
      shares : 0,
    })

    return response.json({ success: true, message: 'Crée avec succès' })

  }
}
