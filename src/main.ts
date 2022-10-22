import './style.css'

const container = document.querySelector('.todos') as HTMLElement
const form = document.querySelector('.todo__form') as HTMLFormElement
const remaining = document.querySelector('.info__left') as HTMLElement
const clear = document.querySelector('.clear') as HTMLButtonElement

let todos: Element[] = [] 
let activeFilter = 'all'

const filters = document.querySelectorAll('.info__filter') 
filters.forEach(filter => {
    filter.addEventListener('click', () => {
        filters.forEach(filter => {if(filter.hasAttribute('disabled')) filter.removeAttribute('disabled')})
        filter.setAttribute('disabled', '')
        const string = filter.innerHTML.toLowerCase()
        activeFilter = string
        renderTodos(string)
    })
})

clear.addEventListener('click', () => {
    todos = todos.filter(todo => !todo.classList.contains('done'))
    renderTodos(activeFilter)
})

form.addEventListener('submit', e => {
    e.preventDefault()
    const data = new FormData(form)
    const text = data.get('new')!
    if(text == '') return window.alert('Todo cannot be empty')
    createTodo(text.toString())
    form.reset()
})

const createTodo = (text: string) => {
    const todo = document.createElement('div')
    todo.classList.add('todo')

    const item = document.createElement('div')
    item.classList.add('todo__item')
    item.innerHTML = text

    createStatus(todo)
    todo.appendChild(item)
    createDelete(todo)

    todos.unshift(todo)

    filters.forEach(filter => {if(filter.hasAttribute('disabled')) filter.removeAttribute('disabled')})
    document.querySelector('.info__filter')?.setAttribute('disabled', '')
    activeFilter = 'all'
    renderTodos(activeFilter)
}

const createStatus = (todo: Element) => {
    const status = document.createElement('label')
    status.classList.add('todo__status')

    const checkbox = document.createElement('input')
        checkbox.type = 'checkbox'
        checkbox.name = 'status'

    const checkmark = document.createElement('span')
    checkmark.classList.add('checkmark')
    checkmark.addEventListener('click', () => {
        if (!checkbox.checked) {
            // Reorder todo
            todos.splice(todos.indexOf(todo), 1)
            todos.push(todo)

            todo.classList.add('done') 
        } else if (todo.classList.contains('done')) {
            // Reorder todo
            todos.splice(todos.indexOf(todo), 1)
            todos.unshift(todo)

            todo.classList.remove('done')
        }
        renderTodos(activeFilter)
    })

    status.appendChild(checkbox)
    status.appendChild(checkmark)

    todo.appendChild(status)
}

const createDelete = (todo: Element) => {
    const deleteBtn = document.createElement('div')
    deleteBtn.classList.add('todo__delete')
    deleteBtn.innerHTML = '<i class="uil uil-trash"></i>'

    deleteBtn.addEventListener('click', () => {
        todos.splice(todos.indexOf(todo), 1)
        renderTodos(activeFilter)
    })

    todo.appendChild(deleteBtn)
}

const renderTodos = (filter: string) => {
    container.innerHTML = ''
    const left = todos.filter(todo => !todo.classList.contains('done')).length

    let filtered: Element[]

    switch (filter) {
        case 'complete':
            filtered = todos.filter(todo => todo.classList.contains('done'))
            break;
        case 'active':
            filtered = todos.filter(todo => !todo.classList.contains('done'))
            break;
        default:
            filtered = todos
            break;
    }

    createOrdering(filtered)

    filtered.forEach(todo => {
        container.appendChild(todo)
    })

    if(left > 1) remaining.innerHTML = `${left} items left`
    else remaining.innerHTML = `${left} item left`
}

const createOrdering = (todos: Element[]) => {
    todos.forEach(todo => {
        // Remove existing order
        if (todo.querySelector('.todo__order')) todo.removeChild(todo.querySelector('.todo__order')!)

        const buttons = document.createElement('div')
        buttons.classList.add('todo__order')

        const position = todos.indexOf(todo)
        // Not first element
        if(position != 0) {
            let sameType = true
            if(todo.classList.contains('done') && !todos[position-1].classList.contains('done')) sameType = false
            if(!todo.classList.contains('done') && todos[position-1].classList.contains('done')) sameType = false

            if (sameType) {
                const up = document.createElement('i')
                up.classList.add('uil', 'uil-angle-up')

                up.addEventListener('click', () => {
                    todos.splice(position, 1)
                    todos.splice(position-1, 0, todo)
                    renderTodos(activeFilter)
                })

                buttons.appendChild(up)
            }
        }

        // Not last element
        if(position != todos.length - 1) {
            let sameType = true
            if(todo.classList.contains('done') && !todos[position+1].classList.contains('done')) sameType = false
            if(!todo.classList.contains('done') && todos[position+1].classList.contains('done')) sameType = false

            if (sameType) {            
                const down = document.createElement('i')
                down.classList.add('uil', 'uil-angle-down')

                down.addEventListener('click', () => {
                    todos.splice(position, 1)
                    todos.splice(position+1, 0, todo)
                    renderTodos(activeFilter)
                })

                buttons.appendChild(down)
            }
        }

        todo.insertBefore(buttons, todo.children[todo.children.length-1])
    })
}