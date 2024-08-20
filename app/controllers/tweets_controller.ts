import type { HttpContext } from '@adonisjs/core/http'
// import User from '#models/user'
import Tweet from '#models/tweet'
import { createAddTweetValidator } from '#validators/add_tweet'
export default class TweetsController {

  async addTweet({ request, auth, response }: HttpContext) {

    
    const data = await request.validateUsing(createAddTweetValidator)
    const userId = auth.user?.id
    // Créer un nouvau Tweet

    try {
      // Créer un tweet

      const tweet = await Tweet.create({
      user_id: userId,
      text: data.text,
      tweet_image: data.text_image,
      likes : 0,
      retweets : 0,
      shares : 0,
    })


    return response.status(201).json({
      message: 'Tweet créé avec succès',
      tweet
    })
  } catch (error) {
    console.error('Erreur lors de la création du tweet', error)
    return response.status(500).json({
      message: 'Erreur serveur, veuillez réessayer plus tard',
      error: error.message
      })
    }
  }
}
