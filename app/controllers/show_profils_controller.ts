import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
// import Tweet from '#models/tweet'


export default class ShowProfilsController {

  async show({ params, view }: HttpContext) {
    const user = await User.find(params.user_id)

    if (!user) {
      return view.render('errors.not-found')
    }

    const userData = user.$attributes
    console.log('Affichage Utilisateur des Tweets : ', userData);
    return view.render('pages/profils', { userData })


  }

  async myprofil({ auth, view }: HttpContext) {
    const user = auth.user!
    return view.render('pages/profil', { user })
  }


}
