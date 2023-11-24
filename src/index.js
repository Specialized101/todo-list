
import './style.css'
import { projectsDOM } from './DOM.js'

projectsDOM.updateProjectList()

window.onload = document.querySelector('#project-list li:first-child').click()