
import './style.css'
import { createTodo } from "./todo.js"
import { createProject } from './project.js'
import { projectsDOM, todosDOM } from './DOM.js'
import { database } from './database.js'

const addProjectBtn = document.querySelector('#create-project')
const addTodoBtn = document.querySelector('#create-todo')

addProjectBtn.addEventListener('click', () => {
    const newProject = createProject(prompt('Project title: '))
    newProject.id = database.getProjects().length
    database.saveProject(newProject)
    projectsDOM.updateProjectList()
})

addTodoBtn.addEventListener('click', () => {
    const newTodo = createTodo(prompt('new todo: '))
    const selectedProject = projectsDOM.getSelectedProject()
    
    selectedProject.add(newTodo)
    database.saveProject(selectedProject)
    todosDOM.updateTodoList()
})

projectsDOM.updateProjectList()

window.onload = document.querySelector('#project-list li:first-child').click()