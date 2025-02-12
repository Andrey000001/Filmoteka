
import refs from '../utils/refs'

refs.backdrop.addEventListener('click',onModalClick)

function onModalClick(e) {
    if(e.target.classList === e.currentTarget.classList){ 
        refs.backdrop.classList.remove('is-open')
    }
}
