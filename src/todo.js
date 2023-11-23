

function createTodo(title = 'Default title',
                     description = 'Default Description',
                     dueDate = new Date(),
                     priority = 'low',
                     notes = 'Default notes...',
                     done = 'true'){
    return {
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