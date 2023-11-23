

function createProject(title = ''){

    const todos = []
    let id = -1

    function add (todo) {
        this.todos.push(todo)   
    }

    function remove (index) {
        this.todos.splice(index, 1)
    }

    return {
        id,
        todos,
        title,
        add,
        remove
    }
}

export {
    createProject
} 