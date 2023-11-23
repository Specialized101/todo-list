

function createProject(title = '') {

    const todos = []
    let id

    function add(todo) {
        this.todos.push(todo)
    }

    function remove(index) {
        this.todos.splice(index, 1)
    }

    function update(todo) {
        const index = this.todos.findIndex((t) => t.id === todo.id)
        console.log(index)
        if (index !== -1) {
            this.todos = [
                ...this.todos.slice(0, index),
                todo,
                ...this.todos.slice(index + 1)
            ];
        }
    }

    return {
        id,
        todos,
        title,
        add,
        remove,
        update
    }
}

export {
    createProject
} 