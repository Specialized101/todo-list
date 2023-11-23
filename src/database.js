import { createProject } from "./project.js";
import { parseISO } from 'date-fns'

const database = (() => {

    function getProjects() {
        if (localStorage.getItem('myProjects') !== null) {
            const storedProjects = JSON.parse(localStorage.getItem('myProjects'))
            const myProjects = storedProjects.map(project => {
                const prj = createProject(project.title)
                prj.id = project.id
                prj.todos = project.todos.map(todo => ({
                    ...todo,
                    dueDate: parseISO(todo.dueDate)
                }))
                return prj
            })
            return myProjects
        }
        else {
            const myProjects = []
            const defaultPrj = createProject('Default Project')
            defaultPrj.id = 0
            myProjects.push(defaultPrj)
            return myProjects
        }
    }

    function saveProject(project) {
        const myProjects = getProjects()
        const projectIndex = myProjects.findIndex(prj => prj.id === project.id)

        if (projectIndex !== -1){
            myProjects[projectIndex] = project
        } else {
            myProjects.push(project)
        }
        localStorage.setItem('myProjects', JSON.stringify(myProjects))
    }

    return {
        getProjects,
        saveProject,
    }

})();


export {
    database
}