import { format } from 'date-fns'
import { database } from './database.js'
import { createTodo } from './todo.js'
import { createProject } from './project.js'
import PlusSign from './images/plus-sign.png'
import CloseSign from './images/close.png'
import TrashSign from './images/trash.png'
import SaveSign from './images/save.png'

const projectTodos = document.querySelector('#project-todos')
const projectList = document.querySelector('#project-list')
const projectTitle = document.querySelector('#project-title')

const projectsDOM = (() => {

    function selectProject(li) {
        const lis = Array.from(document.querySelectorAll('#project-list li'))
        const delProjectBtn = document.querySelector('#del-project')
        delProjectBtn.src = TrashSign

        lis.forEach(item => {
            item.dataset.selected = 'false'
        })

        delProjectBtn.addEventListener('click', () => {
            database.deleteProject(getSelectedProject())
            updateProjectList()
            lis[0].click() // display the default project after delete 
        })

        
        li.dataset.selected = 'true'
        projectTitle.textContent = `${li.textContent}'s To-Do list`
        if (getSelectedProject().title === 'Default Project'){
            delProjectBtn.classList.add('hide')
        } else {
            delProjectBtn.classList.remove('hide')
        }
    }

    function getSelectedProject() {

        const lis = Array.from(document.querySelectorAll('#project-list li'))
        let selectedProject = lis.filter(item => item.dataset.selected === 'true')
        let title
        if (selectedProject.length > 0) {
            title = selectedProject[0].textContent
        }
        let index = database.getProjects().map(project => project.title).indexOf(title)

        // Sets the default project if none is selected
        if (index === -1)
            index = 0

        return database.getProjects()[index]
    }

    function updateProjectList() {
        projectList.replaceChildren()

        const addProject = document.createElement('li')
        const icon = new Image()
        icon.src = PlusSign
        icon.alt = 'Add Project button'
        addProject.appendChild(icon)

        addProject.addEventListener('click', () => {
            const newProject = createProject(prompt(`New Project's Title: `))
            newProject.id = database.getProjects().length
            database.saveProject(newProject)
            projectsDOM.updateProjectList()
        })

        database.getProjects().forEach(project => {
            const li = document.createElement('li')
            li.textContent = project.title
            li.addEventListener('click', () => {
                selectProject(li)

                todosDOM.updateTodoList()

            })

            projectList.appendChild(li)
        })
        projectList.appendChild(addProject)
    }

    return {
        selectProject,
        updateProjectList,
        getSelectedProject
    }

})();

const todosDOM = (() => {

    function updateTodoList() {
        projectTodos.replaceChildren()
        generateTodoCards(projectsDOM.getSelectedProject())

    }

    return {
        updateTodoList
    }

})();

function generateTodoCards(project) {

    const addTodo = document.createElement('div')
    const icon = new Image()
    icon.src = PlusSign
    icon.alt = 'Add todo button'
    addTodo.appendChild(icon)
    addTodo.classList.add('todo-card')
    addTodo.setAttribute('id', 'create-todo')

    addTodo.addEventListener('click', () => {
        const newTodo = createTodo(prompt('New todo: '))
        const selectedProject = projectsDOM.getSelectedProject()

        selectedProject.add(newTodo)
        database.saveProject(selectedProject)
        todosDOM.updateTodoList()
    })

    project.todos.forEach((todo, index) => {
        const card = document.createElement('div')
        const title = document.createElement('h3')
        const dueDate = document.createElement('p')
        const priority = document.createElement('div')
        const done = document.createElement('div')
        const div1 = document.createElement('div')

        title.textContent = todo.title
        dueDate.textContent = format(todo.dueDate, 'MMM do yyyy')

        priority.classList.add('card-circle')
        switch (todo.priority) {
            case 'low':
                priority.classList.add('low-priority')
                break;
            case 'medium':
                priority.classList.add('medium-priority')
                break;
            case 'high':
                priority.classList.add('high-priority')
                break;
        }

        done.classList.add('card-circle')
        if (todo.done === 'true') {
            done.classList.add('done')
        } else {
            done.classList.add('notDone')
        }

        card.addEventListener('click', () => {
            document.body.appendChild(generateTodoModal(todo, index))
            document.querySelector('dialog').showModal()
        })

        card.classList.add('todo-card')

        div1.appendChild(dueDate)
        div1.appendChild(priority)
        div1.appendChild(done)

        card.appendChild(title)
        card.appendChild(div1)

        projectTodos.appendChild(card)
    })

    projectTodos.appendChild(addTodo)

}

function generateTodoModal(todo, index) {
    const dialog = document.createElement('dialog')
    const form = document.createElement('form')
    const fieldset = document.createElement('fieldset')
    const legend = document.createElement('legend')
    const labelTitle = document.createElement('label')
    const labelDescription = document.createElement('label')
    const labelDueDate = document.createElement('label')
    const labelPriority = document.createElement('label')
    const labelNotes = document.createElement('label')
    const labelDone = document.createElement('label')
    const inputTitle = document.createElement('input')
    const inputDescription = document.createElement('input')
    const inputDueDate = document.createElement('input')
    const selectPriority = document.createElement('select')
    const optionLow = document.createElement('option')
    const optionMedium = document.createElement('option')
    const optionHigh = document.createElement('option')
    const inputNotes = document.createElement('textarea')
    const inputDone = document.createElement('input')
    const saveBtn = document.createElement('div')
    const delBtn = document.createElement('div')
    const closeBtn = document.createElement('div')
    const saveIcon = new Image()
    const delIcon = new Image()
    const closeIcon = new Image()
    const actionBtns = document.createElement('div')

    legend.textContent = `Toto's details`

    labelTitle.textContent = 'Title'
    labelTitle.setAttribute('for', 'todo-title')
    inputTitle.value = todo.title
    inputTitle.setAttribute('type', 'text')
    inputTitle.setAttribute('id', 'todo-title')
    inputTitle.setAttribute('name', 'todo-title')

    labelDescription.textContent = 'Description'
    labelDescription.setAttribute('for', 'todo-description')
    inputDescription.value = todo.description
    inputDescription.setAttribute('type', 'text')
    inputDescription.setAttribute('id', 'todo-description')
    inputDescription.setAttribute('name', 'todo-description')

    labelDueDate.textContent = 'DueDate'
    labelDueDate.setAttribute('for', 'todo-dueDate')
    inputDueDate.setAttribute('type', 'date')
    inputDueDate.setAttribute('id', 'todo-dueDate')
    inputDueDate.setAttribute('name', 'todo-dueDate')
    inputDueDate.value = format(todo.dueDate, 'yyyy-MM-dd')

    labelPriority.textContent = 'Priority'
    labelPriority.setAttribute('for', 'todo-priority')
    optionLow.textContent = 'Low'
    optionLow.setAttribute('value', 'low')
    optionMedium.textContent = 'Medium'
    optionMedium.setAttribute('value', 'medium')
    optionHigh.textContent = 'High'
    optionHigh.setAttribute('value', 'high')
    selectPriority.setAttribute('id', 'todo-priority')
    selectPriority.setAttribute('name', 'todo-priority')
    selectPriority.appendChild(optionLow)
    selectPriority.appendChild(optionMedium)
    selectPriority.appendChild(optionHigh)
    selectPriority.value = todo.priority

    labelNotes.textContent = 'Notes'
    labelNotes.setAttribute('for', 'todo-notes')
    inputNotes.textContent = todo.notes
    inputNotes.setAttribute('id', 'todo-notes')
    inputNotes.setAttribute('name', 'todo-notes')
    inputNotes.setAttribute('cols', '50')
    inputNotes.setAttribute('rows', '4')

    labelDone.textContent = 'Mark as Complete'
    labelDone.setAttribute('for', 'todo-done')
    inputDone.setAttribute('type', 'checkbox')
    inputDone.setAttribute('id', 'todo-done')
    inputDone.setAttribute('name', 'todo-done')
    inputDone.checked = todo.done === 'true' ? true : false

    
    saveIcon.src = SaveSign
    saveIcon.alt = 'Save Todo'
    saveBtn.textContent = 'save'
    saveBtn.appendChild(saveIcon)
    saveBtn.classList.add('dialog-btn')
    
    saveBtn.addEventListener('click', (e) => {
        e.preventDefault()

        const prj = projectsDOM.getSelectedProject()

        todo.title = inputTitle.value
        todo.description = inputDescription.value
        todo.dueDate = new Date(inputDueDate.value)
        todo.priority = selectPriority.value
        todo.notes = inputNotes.value
        todo.done = inputDone.checked === true ? 'true' : 'false'
        prj.update(todo)
        database.saveProject(prj)
        todosDOM.updateTodoList()

        document.querySelector('dialog').close()
        document.querySelector('dialog').remove()
    })

    delIcon.src = TrashSign
    delIcon.alt = 'Delete Todo'
    delBtn.textContent = 'delete'
    delBtn.appendChild(delIcon)
    delBtn.classList.add('dialog-btn')

    delBtn.addEventListener('click', () => {
        const prj = projectsDOM.getSelectedProject()
        prj.remove(index)
        database.saveProject(prj)
        todosDOM.updateTodoList()

        document.querySelector('dialog').close()
        document.querySelector('dialog').remove()
    })

    closeIcon.src = CloseSign
    closeIcon.alt = 'Close Todo'
    closeBtn.appendChild(closeIcon)

    closeBtn.addEventListener('click', () => {

        document.querySelector('dialog').close()
        document.querySelector('dialog').remove()

    })

    fieldset.appendChild(legend)
    fieldset.appendChild(labelTitle)
    fieldset.appendChild(inputTitle)
    fieldset.appendChild(labelDescription)
    fieldset.appendChild(inputDescription)
    fieldset.appendChild(labelDueDate)
    fieldset.appendChild(inputDueDate)
    fieldset.appendChild(labelPriority)
    fieldset.appendChild(selectPriority)
    fieldset.appendChild(labelNotes)
    fieldset.appendChild(inputNotes)
    fieldset.appendChild(labelDone)
    fieldset.appendChild(inputDone)

    actionBtns.classList.add('dialog-action-btns')
    actionBtns.appendChild(saveBtn)
    actionBtns.appendChild(delBtn)

    form.appendChild(closeBtn)
    form.appendChild(fieldset)
    form.appendChild(actionBtns)

    dialog.appendChild(form)

    dialog.addEventListener('keydown', (e) => {
        if (e.key === 'Escape')
            closeBtn.click()
    })

    return dialog
}

export {
    projectsDOM,
    todosDOM
}