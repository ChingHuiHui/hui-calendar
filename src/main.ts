import './style.scss'

enum MODE {
  MONTH,
  DAY,
}

type DateItem = {
  date: string
}

const panel = document.querySelector('.panel') as HTMLDivElement
const panelList = document.querySelector('.panel-list') as HTMLUListElement
const panelClose = document.querySelector('#panel-close') as HTMLButtonElement
const days = document.querySelector('.days') as HTMLDivElement
const title = document.querySelector('.title') as HTMLDivElement

const prev = document.querySelector('#prev') as HTMLButtonElement
const next = document.querySelector('#next') as HTMLButtonElement

function getNumberOfDaysInAMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

function getDate(date: string): string {
  return new Date(date).getDate().toString()
}

function fillZero(item: string | number): string {
  if (typeof item === 'number') {
    item = `${item}`
  }

  return item.padStart(2, '0')
}

function formatDate(dateStr: string): string {
  const dateObj = new Date(dateStr)

  const year = dateObj.getFullYear()
  const month = fillZero(dateObj.getMonth() + 1)
  const date = fillZero(dateObj.getDate())

  return `${year}-${month}-${date}`
}

type Task = {
  date: string
  todo: string[]
  status: string
}

class Tasks {
  constructor(public items: Task[]) {}

  getTasks(date?: string): Task[] {
    if (!date) {
      return []
    }

    return this.items.filter(
      ({ date: taskDate }) => taskDate === formatDate(date)
    )
  }

  haveTask(date?: string) {
    return this.getTasks(date).length > 0
  }
}

class Calendar {
  constructor(
    public year: number = new Date().getFullYear(),
    public month: number = new Date().getMonth(),
    public activeDate: string = new Date().toISOString(),
    public mode: MODE = MODE.MONTH
  ) {}

  get firstDayInCurrentMonth() {
    return new Date(this.year, this.month, 1).getDay()
  }

  set active(date: string) {
    this.activeDate = date
  }

  #buildPrevDates(): DateItem[] {
    const dayOfFirstDate = this.firstDayInCurrentMonth

    const prevMonth = this.month - 1
    const prevMonthDays = getNumberOfDaysInAMonth(this.year, prevMonth)

    let dates: DateItem[] = []

    for (let i = dayOfFirstDate; i > 0; i--) {
      const date = new Date(
        this.year,
        prevMonth,
        prevMonthDays - i
      ).toISOString()

      dates = [...dates, { date }]
    }

    return dates
  }

  #buildCurrentDates(): DateItem[] {
    let dates: DateItem[] = []

    const currentMonthDays = getNumberOfDaysInAMonth(this.year, this.month)

    for (let i = 0; i < currentMonthDays; i++) {
      const date = new Date(this.year, this.month, i + 1).toISOString()

      dates = [...dates, { date }]
    }

    return dates
  }

  #buildDateCells(): void {
    days.innerHTML = ''
    ;[...this.#buildPrevDates(), ...this.#buildCurrentDates()].forEach(
      (dateItem) => {
        const dateCell = document.createElement('time')

        const { date } = dateItem

        dateCell.className = 'cell date-cell'
        dateCell.innerText = getDate(date)
        dateCell.dataset.date = date

        if (new Date(date).getMonth() !== this.month) {
          dateCell.classList.add('prev-month')
        }

        if (tasks.haveTask(date)) {
          const inner = document.createElement('div')
          inner.classList.add('inner')

          dateCell.appendChild(inner)
        }

        days.appendChild(dateCell)
      }
    )
  }

  #renderHero(): void {
    const displayedMonth = fillZero(this.month + 1)

    title.innerText = `${this.year}.${displayedMonth}`
  }

  prev(): void {
    let prevMonth = this.month - 1

    if (prevMonth < 0) {
      this.year--
      prevMonth = 11
    }

    this.month = prevMonth
    this.render()
  }

  next(): void {
    let nextMonth = this.month + 1

    if (nextMonth > 11) {
      this.year++
      nextMonth = 0
    }

    this.month = nextMonth

    this.render()
  }

  render() {
    this.#renderHero()
    this.#buildDateCells()
  }
}

days.addEventListener('click', (e) => {
  const target = e.target as HTMLDivElement

  const dates = Array.from(days.children)

  dates.forEach((child) => {
    child.classList.remove('active')
  })

  if (
    !target.classList.contains('date-cell') ||
    !tasks.haveTask(target.dataset.date)
  ) {
    return
  }

  calendar.active = target.dataset.date || ''

  panel.classList.add('active')
  target.classList.add('active')

  const todoList = tasks
    .getTasks(calendar.activeDate)
    .map((task) => task.todo.map((todo) => `<li> ${todo}</li>`).join(''))

  const list = `<ul>${todoList}</ul>`

  panelList.innerHTML = list
})

days.addEventListener('mouseover', (e) => {
  const target = e.target as HTMLDivElement

  if (!target.classList.contains('date-cell')) return

  if (tasks.haveTask(target.dataset.date)) {
    target.classList.add('hover:border-blue-400', 'cursor-pointer')
  }

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

window.addEventListener('resize', () => {
  calendar.render()
})

const tasks = new Tasks([
  {
    date: '2022-06-12',
    todo: ['Have Meeting', 'develop a project'],
    status: 'warning',
  },
])

const calendar = new Calendar()

calendar.render()
