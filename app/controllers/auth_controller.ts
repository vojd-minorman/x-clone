import User from '#models/user'
import { HttpContext } from '@adonisjs/core/http'

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

  async showhome({ auth, view }: HttpContext) {
    const user = auth.user!

    // if (!user) {
    //   return view.render('pages/login')
    // }

    // const metrics = await user.getAllMetrics()

    return view.render('pages/home', {
      user,
    })
  }

  async logout({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    return response.redirect().toRoute('login')

}
}
