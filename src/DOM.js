import { format } from 'date-fns'
import { database } from './database.js'

const projectTodos = document.querySelector('#project-todos')
const projectList = document.querySelector('#project-list')
const projectTitle = document.querySelector('#project-title')

const projectsDOM = (() => {

    function selectProject(li) {
        const lis = Array.from(document.querySelectorAll('#project-list li'))

        lis.forEach(item => {
            item.dataset.selected = 'false'
        })

        li.dataset.selected = 'true'
        projectTitle.textContent = li.textContent
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

        // console.log(database.getProjects()[index])
        return database.getProjects()[index]
    }

    function updateProjectList() {
        projectList.replaceChildren()
        database.getProjects().forEach(project => {
            const li = document.createElement('li')
            li.textContent = project.title
            li.addEventListener('click', () => {
                selectProject(li)
                console.log(getSelectedProject())

                todosDOM.updateTodoList()

            })

            projectList.appendChild(li)
        })
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

    project.todos.forEach((todo, index) => {
        const card = document.createElement('div')
        const cardTitle = document.createElement('p')
        const priority = document.createElement('div')
        const done = document.createElement('div')

        cardTitle.textContent = `${todo.title} - ${format(todo.dueDate, 'yyyy-MM-dd')}`

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
        if (todo.done === 'true'){
            done.classList.add('done')
        } else {
            done.classList.add('notDone')
        }

        card.addEventListener('click', () => {
            document.body.appendChild(generateTodoModal(todo, index))
            document.querySelector('dialog').showModal()
        })

        card.classList.add('todo-card')

        card.appendChild(cardTitle)
        card.appendChild(priority)
        card.appendChild(done)

        projectTodos.appendChild(card)
    })

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
    const saveBtn = document.createElement('button')
    const delBtn = document.createElement('button')
    const closeBtn = document.createElement('button')

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

    saveBtn.textContent = 'save'
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

    delBtn.textContent = 'delete'
    delBtn.addEventListener('click', () => {
        const prj = projectsDOM.getSelectedProject()
        prj.remove(index)
        database.saveProject(prj)
        todosDOM.updateTodoList()

        document.querySelector('dialog').close()
        document.querySelector('dialog').remove()
    })

    closeBtn.textContent = 'close'
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


    form.appendChild(closeBtn)
    form.appendChild(fieldset)
    form.appendChild(saveBtn)
    form.appendChild(delBtn)

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