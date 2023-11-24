
import './style.css'
import { createTodo } from "./todo.js"
import { createProject } from './project.js'
import { projectsDOM, todosDOM } from './DOM.js'
import { database } from './database.js'

projectsDOM.updateProjectList()

window.onload = document.querySelector('#project-list li:first-child').click()