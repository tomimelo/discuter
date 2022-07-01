import { body } from 'express-validator'
import { MadRoute, MadRouteMethod, MadRouter } from 'mad-server'
import { ExampleFactory } from '../../example/example-factory'
import exampleController from '../controllers/example.controller'
import validateRequest from '../middlewares/validateRequest'

// Normal functional controller
const getExample: MadRoute = {
  path: '/',
  method: MadRouteMethod.GET,
  handler: exampleController.example
}

// Class based controllers
const exampleClassController = new ExampleFactory().getController()

const getClassExample: MadRoute = {
  path: '/class',
  method: MadRouteMethod.GET,
  handler: exampleClassController.getExamples
}

const postClassExample: MadRoute = {
  path: '/class',
  method: MadRouteMethod.POST,
  middlewares: [body('field1').exists(), body('field2').isString(), validateRequest],
  handler: exampleClassController.createExample
}

const router = new MadRouter({
  basePath: '/example',
  name: 'Example',
  handlers: [
    getExample,
    getClassExample,
    postClassExample
  ]
})

export default router
