import type { HttpContext } from '@adonisjs/core/http'
// import { shieldApiClient } from '@adonisjs/shield/plugins/api_client'
import User from '#models/user'
import Follow from '#models/follow'


export default class ShowProfilsController {

  async show({ auth, params, view }: HttpContext) {
    const user = await User.find(params.user_id)

    const currentUser = auth.user

    if (!user) {
      return view.render('errors.not-found')
    }
    if (!currentUser) {
      return view.render('errors.not-found')
    }

    const isFollowing = await Follow.query()
      .where('follower_id', currentUser.id)
      .andWhere('following_id', user.id)
      .first()

//  console.log('Affichage Utilisateur des Tweets : ', isFollowing);
    const userData = user.$attributes
    // console.log('Affichage Utilisateur des Tweets : ', userData);
    return view.render('pages/profils', { userData, isFollowing: !!isFollowing })


  }

  async myprofil({ auth, view }: HttpContext) {
    const user = auth.user!
    return view.render('pages/profil', { user })
  }


}
