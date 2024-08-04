import type { HttpContext } from '@adonisjs/core/http'

import User from '#models/user'
import {createRegisterValidator} from '#validators/register'
// import db from '@adonisjs/lucid/services/db'



export default class RegistersController {

  async registerForm({ view }: HttpContext) {
    return view.render('pages/register')
  }

  async register({ request, response }: HttpContext) {
    // Valider les données du formulaire

    const data = await request.validateUsing(createRegisterValidator)
    // Créer un nouvel utilisateur
      await User.create({
      fullName: data.fullName,
      email: data.email,
      password: data.password,
      date_of_birth: data.date_of_birth,
    })

    // Rediriger l'utilisateur après l'enregistrement
    return response.redirect().toRoute('login')
}
}
