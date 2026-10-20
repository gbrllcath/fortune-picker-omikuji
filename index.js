import { fortuneData } from './data.js'

const categoryRadios = document.getElementById('category-radios')
const luckyDraw = document.getElementById('lucky-draw')
const luckyDrawOption = document.getElementById('lucky-draw-option')
const getFortuneBtn = document.getElementById('get-fortune-btn')
const modal = document.getElementById('fortuneslip-modal')
const modalInner = document.getElementById('fortuneslip-modal-inner')
const modalCloseBtn = document.getElementById('fortuneslip-modal-close-btn')
const backdrop = document.getElementById('backdrop')

categoryRadios.addEventListener('change', highlightCheckedOption)
luckyDrawOption.addEventListener('change', handleLuckyDraw)
modalCloseBtn.addEventListener('click', closeModal)
getFortuneBtn.addEventListener('click', renderFortune)

function clearRadioHighlights(){
    const radios = document.getElementsByClassName('radio')
    for (let radio of radios){
        radio.classList.remove('highlight')
    }
}

function highlightCheckedOption(e){
    clearRadioHighlights()
    e.target.parentElement.classList.add('highlight')

    luckyDrawOption.checked = false
    luckyDraw.classList.remove('highlight')
}

function handleLuckyDraw(){
    clearRadioHighlights()

    if(luckyDrawOption.checked){
        const checkedRadio = document.querySelector('input[type="radio"]:checked')
        if(checkedRadio){
            checkedRadio.checked = false
        }
    }

    luckyDraw.classList.toggle('highlight', luckyDrawOption.checked)
}

function clearSelection(){
    const checkedRadio = document.querySelector('input[type="radio"]:checked')
    if(checkedRadio){
        checkedRadio.checked = false
    }
    clearRadioHighlights()

    luckyDrawOption.checked = false
    luckyDraw.classList.remove('highlight')
}

function closeModal(){
    modal.classList.add('closing')

    setTimeout(function(){
        modal.style.display = 'none'
        modal.classList.remove('closing')
        getFortuneBtn.disabled = false
        backdrop.classList.remove('show')
        clearSelection()
    }, 250)
}

function renderFortune(){
    const fortune = getSingleFortuneObject()
    if(!fortune){
        return
    }

    modalInner.innerHTML = `
        <p class="slip-category">${fortune.categoryTags[0]}</p>
        <img class="slip-img" src="./images/${fortune.rankImage}" alt="${fortune.alt}">
        <h2 class="slip-rank">${fortune.rank}</h2>
        <div class="slip-divider"></div>
        <p class="slip-message">${fortune.message}</p>
    `
    modal.style.display = 'flex'
    getFortuneBtn.disabled = true

    backdrop.classList.add('show')
}

function getSingleFortuneObject(){
    const fortunesArray = getMatchingFortunesArray()
    if(!fortunesArray){
        return
    }
    const randomNumber = Math.floor(Math.random() * fortunesArray.length)
    return fortunesArray[randomNumber]
}

function getMatchingFortunesArray(){
    if(luckyDrawOption.checked){
        return fortuneData
    }
    else if(document.querySelector('input[type="radio"]:checked')){
        const selectedCategory = document.querySelector('input[type="radio"]:checked').value
        return fortuneData.filter(function(fortune){
            return fortune.categoryTags.includes(selectedCategory)
        })
    }
}

function getCategoriesArray(fortunes){
    const categoriesArray = []
    for (let fortune of fortunes){
        for (let category of fortune.categoryTags){
            if (!categoriesArray.includes(category)){
                categoriesArray.push(category)
            }
        }
    }
    return categoriesArray
}

function renderCategoryRadios(fortunes){
    let radioItems = ``
    const categories = getCategoriesArray(fortunes)
    for (let category of categories){
        radioItems += `
        <div class="radio">
            <label for="${category}">${category}</label>
            <input
            type="radio"
            id="${category}"
            value="${category}"
            name="categories"
            >
        </div>`
    }
    categoryRadios.innerHTML = radioItems
}

renderCategoryRadios(fortuneData)