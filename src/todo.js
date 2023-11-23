
function* generateId() {
    let id = 0

    while (true){
        yield id
        id++
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