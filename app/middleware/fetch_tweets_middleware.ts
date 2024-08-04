import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import Tweet from '#models/tweet'
import Follow from '#models/follow'
// import User from '#models/user'

export default class FetchTweetsMiddleware {
  async handle({view, auth}:HttpContext, next: NextFn) {

    const user = await auth.use('web').authenticate()
    try {
// Récupère les tweets avec les informations utilisateur associées
const tweets = await Tweet.query().preload('users')

  // Récupère les IDs des utilisateurs suivis par l'utilisateur actuel
  const followingIdsResult = await Follow.query().where('follower_id', user.id).select('following_id')
  const followingIds = followingIdsResult.map((follow) => follow.following_id)

  // Récupère les tweets des utilisateurs suivis
  const followingTweets = await Tweet.query().whereIn('user_id', followingIds).preload('users')


// Enrichir les tweets avec le nom complet de l'utilisateur
const enrichedTweets = tweets.map(tweet => {
  return {
    ...tweet.toJSON(),
    userFullName: tweet.users?.fullName || 'Unknown User',
  }
})
    // Enrichir les tweets avec le nom complet de l'utilisateur
    const enrichedFollowingTweets = followingTweets.map(tweet => {
        return {
          ...tweet.toJSON(),
          userFullName: tweet.users?.fullName || 'Unknown User',
        }
      })


      view.share({
        enrichedTweets,
        enrichedFollowingTweets,
      })
  // console.log(enrichedTweets);

  // view.share({enrichedTweets})

  const output = await next()
  return output

    } catch (error) {
      console.error('Error fetching tweets:', error)

      const output = await next()
      return output
    }
  }
}
