class Snackbar extends window.HTMLElement {
  constructor ({
    text,
    close_icon = false,
    timeout = 5000
  }) {
    super()

    this.text_div = document.createElement('span')
    this.text_div.className = 'text'
    this.text_div.innerText = text
    this.appendChild(this.text_div)

    if (close_icon) {
      this.close_icon = document.createElement('span')
      this.close_icon.className = 'material-symbols-rounded'
      this.close_icon.innerText = 'close'
      this.close_icon.addEventListener('click', () => this.close())
      this.appendChild(this.close_icon)
      this.style.paddingRight = '12px'
    }

    document.body.appendChild(this)

    this.close_timeout = setTimeout(() => {
      this.close()
    }, timeout)
  }

  close () {
    clearTimeout(this.close_timeout)
    this.classList.add('closing')
    setTimeout(() => {
      this.parentElement.removeChild(this)
      this.classList.remove('closing')
    }, 200)
  }
}

window.customElements.define('material-snackbar', Snackbar)
