import type { HttpContext } from '@adonisjs/core/http'

export default class RegistersController {

  async registerForm({ view }: HttpContext) {
    return view.render('pages/register')
  }

  async register({ request, response, session }: HttpContext) {
    // Définir le schéma de validation
    

    // Rediriger l'utilisateur après l'enregistrement
    session.flash('notification', 'Registration successful! You can now log in.')
    return response.redirect().toRoute('login')
}
