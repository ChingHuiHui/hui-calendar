import './style.scss'

import { getDate } from './helper'
import { panel, panelList, panelClose, days, prev, next } from './dom'
import { calendar } from './Calendar'

days.addEventListener('click', (e) => {
  const target = e.target as HTMLDivElement

  const dates = Array.from(days.children)

  dates.forEach((child) => {
    child.classList.remove('active')
  })

  if (
    !target.classList.contains('date-cell') ||
    !target.classList.contains('have-task')
  ) {
    return
  }

  calendar.activeDate = target.dataset.date || ''
  const date = getDate(calendar.activeDate)

  panel.classList.remove('emergency')
  panel.classList.remove('normal')

  panel.classList.add('active')
  panel.classList.add(
    calendar.tasks.haveEmergency(calendar.activeDate) ? 'emergency' : 'normal'
  )
  panel.dataset.date = date

  target.classList.add('active')

  const todoList = calendar.tasks
    .getTasks(calendar.activeDate)
    .map((task) => task.todo.map((todo) => `<li> ${todo}</li>`).join(''))

  const list = `<ul>${todoList}</ul>`

  panelList.innerHTML = list
})

days.addEventListener('mouseover', (e) => {
  const target = e.target as HTMLDivElement

  if (!target.classList.contains('date-cell')) return

  const { offsetLeft, offsetTop } = target as HTMLDivElement

  panel.style.left = `${offsetLeft}px`
  panel.style.top = `${offsetTop}px`
})

panelClose.addEventListener('click', () => {
  panel.classList.remove('active')
})

prev.addEventListener('click', () => {
  calendar.prev()
})

next.addEventListener('click', () => {
  calendar.next()
})

calendar.render()
