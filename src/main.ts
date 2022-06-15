import './style.scss'

enum MODE {
  MONTH,
  DAY,
}

type DateItem = {
  date: string
}

const days = document.querySelector('.days') as HTMLDivElement
const title = document.querySelector('.title') as HTMLDivElement

const prev = document.querySelector('#prev') as HTMLButtonElement
const next = document.querySelector('#next') as HTMLButtonElement

function getNumberOfDaysInAMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getDate(date: string) {
  return new Date(date).getDate().toString()
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

  #buildDateCells() {
    days.innerHTML = ''
    ;[...this.#buildPrevDates(), ...this.#buildCurrentDates()].forEach(
      (dateItem) => {
        const dateCell = document.createElement('time')
        dateCell.className = 'cell date-cell'
        dateCell.innerText = getDate(dateItem.date)
        dateCell.dataset.date = dateItem.date

        if (new Date(dateItem.date).getMonth() !== this.month) {
          dateCell.classList.add('prev-month')
        }

        days.appendChild(dateCell)

        const { offsetLeft, offsetTop } =
          days.children[days.children.length - 1]

        const inner = document.createElement('div')
        inner.classList.add('inner')
        inner.style.left = `${offsetLeft}px`
        inner.style.top = `${offsetTop}px`

        dateCell.appendChild(inner)
      }
    )
  }

  #renderHero() {
    const displayedMonth = `${this.month + 1}`.padStart(2, '0')

    title.innerText = `${this.year}.${displayedMonth}`
  }

  prev() {
    let prevMonth = this.month - 1

    if (prevMonth < 0) {
      this.year--
      prevMonth = 11
    }

    this.month = prevMonth
    this.render()
  }

  next() {
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

const calendar = new Calendar()

calendar.render()

prev.addEventListener('click', () => {
  calendar.prev()
})

next.addEventListener('click', () => {
  calendar.next()
})

days.addEventListener('click', (e) => {
  const target = e.target as HTMLDivElement

  const dates = Array.from(days.children)

  dates.forEach((child) => {
    child.classList.remove('active')
  })

  if (!target.classList.contains('date-cell')) return

  target.classList.add('active')
  target.children[0].classList.add('active')

  calendar.active = target.dataset.date || ''
})

window.addEventListener('resize', () => {
  calendar.render()
})
