
function* generateId() {
    let id = parseInt(localStorage.getItem('todoLastId')) + 1 || 0

    while (true){
        yield id
        id++
        localStorage.setItem('todoLastId', id)
    }
}

const getId = generateId()

function createTodo(title = 'Default title',
                     description = 'Default Description',
                     dueDate = new Date(),
                     priority = 'low',
                     notes = 'Default notes...',
                     done = 'false'){
                        
    let id = getId.next().value
    return {
        id,
        title,
        description,
        dueDate,
        priority,
        notes,
        done
    }
}

export{
    createTodo
}