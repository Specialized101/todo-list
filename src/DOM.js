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
        const delBtn = document.createElement('button')

        cardTitle.textContent = `${todo.title} - ${format(todo.dueDate, 'yyyy-MM-dd')}`

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

        delBtn.textContent = 'X'
        delBtn.addEventListener('click', () => {
            project.remove(index)
            database.saveProject(project)
            todosDOM.updateTodoList()
        })

        card.addEventListener('click', () => {
            document.body.appendChild(generateTodoModal(todo))
            document.querySelector('dialog').showModal()
        })

        card.classList.add('todo-card')

        card.appendChild(cardTitle)
        card.appendChild(priority)
        card.appendChild(delBtn)

        projectTodos.appendChild(card)
    })

}

function generateTodoModal(todo) {
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

    saveBtn.addEventListener('click', () => {

        const prj = projectsDOM.getSelectedProject()

        todo.priority = selectPriority.value
        prj.update(todo)
        database.saveProject(prj)

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


    form.appendChild(fieldset)
    form.appendChild(saveBtn)

    dialog.appendChild(form)

    return dialog
}

export {
    projectsDOM,
    todosDOM
}