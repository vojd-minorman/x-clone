import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import Tweet from '#models/tweet'
import Follow from '#models/follow'
import { formatDistanceToNow } from 'date-fns'
import {fr} from 'date-fns/locale/fr'
// import { request } from 'http'
// import User from '#models/user'

export default class FetchTweetsMiddleware {

  private perPage = 10

  /**
   * Displays home page for posts
   * This is our initial list of 10 posts
   * @param param0
   * @returns
   */

  async handle({view, auth}:HttpContext, next: NextFn) {

    const user = await auth.use('web').authenticate()
    try {

    const tweets = await Tweet.query()
    .orderBy('created_at', 'desc')
    .preload('users')
    .paginate(1, this.perPage)

  // Récupère les IDs des utilisateurs suivis par l'utilisateur actuel
    const followingIdsResult = await Follow.query().where('follower_id', user.id).select('following_id')

    const followingIds = followingIdsResult.map((follow) => follow.following_id)

  // Récupère les tweets des utilisateurs suivis
    const followingTweets = await Tweet.query()
    .whereIn('user_id', followingIds)
    .orderBy('created_at', 'desc')
    .preload('users')
    .paginate(1, this.perPage)


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


      view.share({
        enrichedTweets,
        enrichedFollowingTweets,
      })

  // view.share({enrichedTweets})
      // await next()
    const output = await next()
    return output
      }
     catch (error) {
      console.error('Error fetching tweets:', error)
      // await next()
      const output = await next()
      return output
    }
  }
}
