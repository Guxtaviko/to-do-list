import './style.css'

const container = document.querySelector('.todos') as HTMLElement
const form = document.querySelector('.todo__form') as HTMLFormElement
const remaining = document.querySelector('.info__left') as HTMLElement
const clear = document.querySelector('.clear') as HTMLButtonElement

let todos: Element[] = [] 
let storedTodos: string[] = JSON.parse(localStorage.getItem("storedTodos")!) || []
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
    if(!storedTodos.includes(text)) storedTodos.unshift(text)

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
            todo.classList.add('done') 
            renderTodos(activeFilter)
        } else if (todo.classList.contains('done')) {
            todo.classList.remove('done')
            renderTodos(activeFilter)
        }
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
        storedTodos.splice(
            storedTodos.indexOf(todo.querySelector('.todo__item')!.innerHTML), 1
        )
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

    filtered.forEach(todo => {
        container.appendChild(todo)
    })

    if(left > 1) remaining.innerHTML = `${left} items left`
    else remaining.innerHTML = `${left} item left`

    localStorage.setItem('storedTodos', JSON.stringify(storedTodos))
}

storedTodos.forEach(todo => {
    createTodo(todo)
})