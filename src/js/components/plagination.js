class Plagination{
    constructor(containerId,totalPages = 9) {
    this.container = document.getElementById(containerId)
        this.currentPage = 1;
        this.totalPages = totalPages;
    }
    renderBtns() {
       this.container.innerHTML = '';

       for(let i = 1 ;i <= this.totalPages; i++) {
        const pageButton = document.createElement('button')
        pageButton.textContent = i
        pageButton.classList.add('page-button')
        
        if(this.currentPage === i) {
            pageButton.classList.add('is-active-btn')
        }
        pageButton.addEventListener('click',() => {
            console.log(i);
            this.currentPage = i
            console.log(this.currentPage);
            const activeBtn = this.container.querySelector('.is-active-btn')
            if(activeBtn) {
                activeBtn.classList.remove('is-active-btn')
            }
            pageButton.classList.add('is-active-btn')

        })
        
        this.container.appendChild(pageButton)
    }
       
    }

}

const pagination = new Plagination('plagination-container')
pagination.renderBtns()