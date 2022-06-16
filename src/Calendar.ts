import {
  getNumberOfDaysInAMonth,
  getDate,
  fillZero,
  formatDate,
} from './helper'

import { days, title } from './dom'
import { STATUS, MODE, DateItem, Task } from './type'

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

  haveTask(date?: string): boolean {
    return this.getTasks(date).length > 0
  }

  haveEmergency(date?: string): boolean {
    return (
      this.getTasks(date).filter(
        ({ status }: { status: STATUS }) => status === STATUS.EMERGENCY
      ).length > 0
    )
  }
}

class Calendar {
  constructor(
    public tasks: Tasks,
    public year: number = new Date().getFullYear(),
    public month: number = new Date().getMonth(),
    public activeDate: string = new Date().toISOString(),
    public mode: MODE = MODE.MONTH
  ) {}

  get firstDayInCurrentMonth() {
    return new Date(this.year, this.month, 1).getDay()
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

  #buildRemainingDates(): DateItem[] {
    const currentDates = [
      ...this.#buildPrevDates(),
      ...this.#buildCurrentDates(),
    ]

    const nextMonth = this.month + 1

    const remainingNumber = currentDates.length % 7
    const remainingDates = remainingNumber === 0 ? 0 : 7 - remainingNumber

    let dates: DateItem[] = []

    for (let i = 0; i < remainingDates; i++) {
      const date = new Date(this.year, nextMonth, i + 1).toISOString()

      dates = [...dates, { date }]
    }

    return dates
  }

  #buildDateCells(): void {
    days.innerHTML = ''

    let dates = [
      ...this.#buildPrevDates(),
      ...this.#buildCurrentDates(),
      ...this.#buildRemainingDates(),
    ]

    dates.forEach((dateItem) => {
      const dateCell = document.createElement('time')

      const { date } = dateItem

      dateCell.className = 'cell date-cell'
      dateCell.innerText = date ? getDate(date) : ''
      dateCell.dataset.date = date

      if (new Date(date).getMonth() !== this.month) {
        dateCell.classList.add('prev-month')
      }

      if (this.tasks.haveTask(date)) {
        dateCell.classList.add('have-task')

        const tag = document.createElement('div')

        tag.classList.add('tag')
        tag.classList.add(
          this.tasks.haveEmergency(date) ? 'emergency' : 'normal'
        )

        dateCell.appendChild(tag)
      }

      days.appendChild(dateCell)
    })
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

const calendar = new Calendar(
  new Tasks([
    {
      date: '2022-06-12',
      todo: ['Have Meeting', 'Develop a project'],
      status: STATUS.NORMAL,
    },
    {
      date: '2022-06-13',
      todo: ['Write Document', 'Finish the project'],
      status: STATUS.EMERGENCY,
    },
    {
      date: '2022-06-25',
      todo: ['learn TypeScript'],
      status: STATUS.NORMAL,
    },
    {
      date: '2022-07-07',
      todo: ['learn Vue3'],
      status: STATUS.NORMAL,
    },
  ])
)

export { calendar }
