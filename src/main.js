const SEPARATOR = '--------'
const INFLUENCES = ['crusader', 'hunter', 'redeemer', 'warlord', 'shaper', 'elder']

function capitalize (string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

document.addEventListener('keypress', e => {
  if (e.code === 'KeyC') {
    const item_popups = document.getElementsByClassName('itemPopupContainer')
    const item_popup = Array.from(item_popups).find(popup => popup.style.display === 'block')
    if (item_popup) {
      let text = ''
      let fractured = false

      // Rarity
      if (item_popup.classList.contains('normalPopup')) text += 'Rarity: Normal\n'
      else if (item_popup.classList.contains('magicPopup')) text += 'Rarity: Magic\n'
      else if (item_popup.classList.contains('rarePopup')) text += 'Rarity: Rare\n'
      else if (item_popup.classList.contains('uniquePopup')) text += 'Rarity: Unique\n'
      
      // Name
      text += item_popup.getElementsByClassName('itemHeader')[0].innerText

      // Content
      const content = item_popup.getElementsByClassName('content')[0]

      // Properties
      const properties = content.getElementsByClassName('property')
      if (properties.length > 0) {
        text += `\n${SEPARATOR}`
        for (const property of properties) {
          text += `\n${property.innerText}`
          if (property.getElementsByClassName('colourAugmented').length > 0) text += ' (augmented)'
        }
      }

      // Requirements
      const requirements = content.getElementsByClassName('requirements')[0]
      if (requirements) {
        text += `\n${SEPARATOR}\nRequirements:`
        for (const requirement of requirements.firstElementChild.children) {
          const children_text = Array.from(requirement.children).map(child => child.innerText.trim())
          const label = children_text.find(text => text.match(/[a-z]+/i))
          const value = children_text.find(text => text.match(/^\d+$/))
          text += `\n${label}: ${value}`
        }
      }

      // Sockets
      const sockets = Array.from(document.getElementsByClassName('sockets')).find(sockets => sockets.style.display === 'block')
      if (sockets?.childElementCount > 0) {
        text += `\n${SEPARATOR}\nSockets: `
        const colours = Array.from(sockets.getElementsByClassName('socket')).map(socket => {
          if (socket.classList.contains('socketStr')) return 'R'
          if (socket.classList.contains('socketDex')) return 'G'
          if (socket.classList.contains('socketInt')) return 'B'
          if (socket.classList.contains('socketGen')) return 'W'
          if (socket.classList.contains('socketAbyss')) return 'A'
        })
        for (let i = 0; i < colours.length; i++) {
          const colour = colours[i]
          const link = sockets.getElementsByClassName(`socketLink${i}`).length > 0
            ? '-'
            : ''
          text += colour + link
        }
      }

      // Enchants
      const enchants = content.getElementsByClassName('enchantMod')
      if (enchants.length > 0) {
        text += `\n${SEPARATOR}`
        for (const enchant of enchants) text += `\n${enchant.innerText} (enchant)`
      }

      // Implicits
      const implicits = content.getElementsByClassName('implicitMod')
      if (implicits.length > 0) {
        text += `\n${SEPARATOR}`
        for (const implicit of implicits) {
          text += `\n${implicit.innerText} (implicit)`
        }
      }

      // Explicits
      const explicits = Array.from(content.getElementsByClassName('explicitMod'))
        .concat(Array.from(content.getElementsByClassName('craftedMod')))
        .concat(Array.from(content.getElementsByClassName('fracturedMod')))
      if (explicits.length > 0) {
        text += `\n${SEPARATOR}`
        for (const explicit of explicits) {
          text += `\n${explicit.innerText}`
          if (explicit.classList.contains('craftedMod')) text += ' (crafted)'
          else if (explicit.classList.contains('fracturedMod')) {
            text += ' (fractured)'
            fractured = true
          }
        }
      }
      
      // Description
      const description = content.getElementsByClassName('descrText')[0]?.innerText
      if (description) text += `\n${SEPARATOR}\n${description}`

      // Flavour text
      const flavour_text = content.getElementsByClassName('flavourText')[0]?.innerText
      if (flavour_text) text += `\n${SEPARATOR}\n${flavour_text}`

      // Fractured
      if (fractured) text += `\n${SEPARATOR}\nFractured Item`

      // Corrupted
      const corrupted = content.getElementsByClassName('unmet')[0]?.innerText === 'Corrupted'
      if (corrupted) text += `\n${SEPARATOR}\nCorrupted`

      // Influence
      const influences = new Set()
      INFLUENCES.forEach(influence => {
        if (item_popup.querySelectorAll(`.symbol.${influence}`).length > 0) influences.add(influence)
      })
      if (influences.size > 0) {
        text += `\n${SEPARATOR}`
        influences.forEach(influence => text += `\n${capitalize(influence)} Item`)
      }

      // Note
      const note = content.getElementsByClassName('itemNote')?.[0]
      if (note) text += `\n${SEPARATOR}\nNote: ${note.innerText}`

      // Copy to clipboard
      console.log(text)
      navigator.clipboard.writeText(text)

      // Show snackbar
      new Snackbar({
        text: 'Item copied to clipboard',
        close_icon: true,
        timeout: 2000
      })
    } else {
      console.log('item not found')
    }
  }
})

console.log('The extension "PoE Website Item Copy" is active. Press C on an item in your stash to copy it.')
