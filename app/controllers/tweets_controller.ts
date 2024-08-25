import type { HttpContext } from '@adonisjs/core/http'
import Tweet from '#models/tweet'
import { createAddTweetValidator } from '#validators/add_tweet'
import Follow from '#models/follow'
import { formatDistanceToNow } from 'date-fns'
import {fr} from 'date-fns/locale/fr'

export default class TweetsController {

  public async addTweet({ request, auth, response }: HttpContext) {


    const data = await request.validateUsing(createAddTweetValidator)
    const userId = auth.user?.id
    // Créer un nouvau Tweet
    if (!userId) {
      return response.unauthorized('Pas connecté')
    }
    try {
      // Créer un tweet

      const tweet = await Tweet.create({
      user_id: userId,
      text: data.text,
      tweet_image: data.tweet_image,
      likes : 0,
      retweets : 0,
      shares : 0,
    })


    return response.json({ success: true, tweet })

  } catch (error) {
    console.error('Erreur lors de la création du tweet', error)
    return response.status(500).json({
      message: 'Erreur serveur, veuillez réessayer plus tard',
      error: error.message
      })
    }
  }

  private perPage = 10

  /**
   * Renders and returns html and page info for a specific page worth of posts
   * This is what we use to incrementally continue our initial list
   * @param param0
   * @returns
   */

  public async showHome ({ view, auth }: HttpContext) {

    const user = await auth.use('web').authenticate()
      // Récupère les IDs des utilisateurs suivis par l'utilisateur actuel
      const followingIdsResult = await Follow.query().where('follower_id', user.id).select('following_id')

      const followingIds = followingIdsResult.map((follow) => follow.following_id)

    const page = await Tweet.query()
    .orderBy('created_at', 'desc')
    .preload('users')
    .paginate(1, this.perPage)

    const enrichedTweets = page.map(tweet => {
      //Formatage de la Date avec date-fns
      const formattedDate = formatDistanceToNow(tweet.createdAt.toJSDate(), { addSuffix: true, locale: fr })
      return {
        ...tweet.toJSON(),
        userFullName: tweet.users?.fullName || 'Unknown User',
        user_id: tweet.users?.id || 'Null',
        createdAt: formattedDate,
      }
    })

      // Récupère les tweets des utilisateurs suivis
      const followingTweets = await Tweet.query()
      .whereIn('user_id', followingIds)
      .orderBy('created_at', 'desc')
      .preload('users')
      .paginate(1, this.perPage)

      const enrichedFollowingTweets = followingTweets.map(tweet => {
        //Formatage de la Date avec date-fns
        const formattedDate = formatDistanceToNow(tweet.createdAt.toJSDate(), { addSuffix: true, locale: fr })
          return {
            ...tweet.toJSON(),
            userFullName: tweet.users?.fullName || 'Unknown User',
            user_id: tweet.users?.id || 'Null',
            createdAt: formattedDate,
          }
        })


    return view.render('pages/index', { enrichedTweets, page, followingTweets, enrichedFollowingTweets})
  }

    /**
   * Renders and returns html and page info for a specific page worth of posts
   * This is what we use to incrementally continue our initial list
   * @param param0
   * @returns
   */

  public async paginate({ response, params, view, auth }: HttpContext) {

    const user = await auth.use('web').authenticate()
    try {

    const tweets = await Tweet.query()
    .orderBy('created_at', 'desc')
    .preload('users')
    .paginate(params.page, this.perPage)

      console.log(params.page)
  // Récupère les IDs des utilisateurs suivis par l'utilisateur actuel
    const followingIdsResult = await Follow.query().where('follower_id', user.id).select('following_id')

    const followingIds = followingIdsResult.map((follow) => follow.following_id)

  // Récupère les tweets des utilisateurs suivis
    const followingTweets = await Tweet.query()
    .whereIn('user_id', followingIds)
    .orderBy('created_at', 'desc')
    .preload('users')
    .paginate(params.page, this.perPage)

// Enrichir les tweets avec le nom complet de l'utilisateur
  const enrichedTweets = tweets.map(tweet => {
  //Formatage de la Date avec date-fns
  const formattedDate = formatDistanceToNow(tweet.createdAt.toJSDate(), { addSuffix: true, locale: fr })
  return {
    ...tweet.toJSON(),
    userFullName: tweet.users?.fullName || 'Unknown User',
    user_id: tweet.users?.id || 'Null',
    createdAt: formattedDate,
  }
})
    // Enrichir les tweets avec le nom complet de l'utilisateur
    const enrichedFollowingTweets = followingTweets.map(tweet => {
      //Formatage de la Date avec date-fns
    const formattedDate = formatDistanceToNow(tweet.createdAt.toJSDate(), { addSuffix: true, locale: fr })
      return {
          ...tweet.toJSON(),
          userFullName: tweet.users?.fullName || 'Unknown User',
          user_id: tweet.users?.id || 'Null',
          createdAt: formattedDate,
        }
      })

  const html_1 = await view.render('components/post_list', { posts : enrichedTweets })
  const html_2 = await view.render('components/post_follow_list', { posts : enrichedTweets })
      // console.log(html)
  return response.json({ html_1, html_2, enrichedTweets, enrichedFollowingTweets })
    }

    catch (error) {
      console.error('Error fetching tweets:', error)
      // await next()

    }
  }

}
