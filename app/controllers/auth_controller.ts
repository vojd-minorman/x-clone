import User from '#models/user'
import { HttpContext } from '@adonisjs/core/http'
import Tweet from '#models/tweet'
import Follow from '#models/follow'
import { formatDistanceToNow } from 'date-fns'
import {fr} from 'date-fns/locale/fr'

export default class AuthController {

  async loginForm({ view }: HttpContext) {
    return view.render('pages/login')
  }

  async login({ request, auth, response }: HttpContext) {

    const { email, password } = request.only(['email', 'password'])

    const user = await User.verifyCredentials(email, password)

    await auth.use('web').login(user)

    response.redirect('/')
  }

  private perPage = 10

  /**
   * Displays home page for posts
   * This is our initial list of 10 posts
   * @param param0
   * @returns
   */

  async showhome({ auth, view }: HttpContext) {
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


      // view.share({
      //   enrichedTweets,
      //   enrichedFollowingTweets,
      // })

    return view.render('pages/home', {
      user, enrichedTweets,
      enrichedFollowingTweets,
    })
  }
  catch (error) {
    console.error('Error fetching tweets:', error)
  }
  }

  async logout({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    return response.redirect().toRoute('login')

}
}
