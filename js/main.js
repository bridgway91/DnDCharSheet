class Character {
    constructor() {
        this.name = ''
        this.characteristics = [] // length=9 : race, background, alignment, age, height, weight, eyes, skin, hair
        this.class = [[]] // length=X -- array of arrays, each one separate [class,level]
        this.stats = [] // length=6 : str, dex, con, int, wis, cha
        this.inspiration = false
        this.proficiency = 2
        this.saves = [] // length=6 -- just booleans of if prof or not
        this.skills = [] // array of skills, NOT BOOLEAN, instead 0/1/2 for * prof bonus (to account for expertise)
        this.weapons = '' // strings of weapon names, tho mainly simple / martial
        this.armor = ''
        this.tools = ''
        this.languages = ''
        this.armor = 10
        this.initiative = 0
        this.speed = 30
        this.maxHealth = 10
        this.currentHealth = 10
        this.tempHealth = 0
        this.hit_die = [[1,'1d10']] // [# dice, die size], double array to account for if have multiple hit die sizes
        this.death_saves = [[0,0,0],[0,0,0]]
        this.attacks = [['Unarmed Strike',2,'1d4+2 B']] // name,bonus,dmg
        this.money = [0,0,0,0,0] // platinum, gold, etherium, silver, copper
        this.equipment = [[]] // each item is an array [amount, name/description]
        this.trackers = [[],[]] // each [] is ['name',#-current,#-max]
        this.features = [[]] // each feature is array [title, source, description]
        this.spellcasting = [] // class, ability, save DC, attack bonus
        this.spells = {Cantrips:[],Level_1:[],Level_2:[],Level_3:[],Level_4:[],Level_5:[],Level_6:[],Level_7:[],Level_8:[],Level_9:[]} // each spell is [name, description]
        this.backstory = ''
        this.notes = []
    }
}

let myChar = new Character()
console.log(myChar)

/////////////////////////////////////////////////

const editInfo = document.querySelector('#edit')
const imChar = document.querySelector('#importChar')
const exChar = document.querySelector('#exportChar')

const charName = document.querySelector('#characterName')
const charClasses = document.querySelector('#characterClasses')
const charRace = document.querySelector('#race')
const charBackground = document.querySelector('#background')
const charAlignment = document.querySelector('#alignment')
const charAge = document.querySelector('#age')
const charHeight = document.querySelector('#height')
const charWeight = document.querySelector('#weight')
const charEyes = document.querySelector('#eyes')
const charSkin = document.querySelector('#skin')
const charHair = document.querySelector('#hair')

/////////////////////////////////////////////////

editInfo.addEventListener('click',editOrSave)

/////////////////////////////////////////////////

function editOrSave() { // if wanting to edit, run editCharInfo(), or if saving, run saveCharInfo()
    if(editInfo.innerHTML == 'SAVE') {
        saveCharInfo()
        editInfo.innerHTML = 'EDIT'
    } else {
        editCharInfo()
        editInfo.innerHTML = 'SAVE'
    }
    console.log(myChar)
}

function editCharInfo() { // enables editing all inputs
    const allInput = document.querySelectorAll('input')
    const allButton = document.querySelectorAll('button')
    for (let i of allInput) {
        i.disabled = false
    }
    for (let i of allButton) {
        i.disabled = false
    }
}

function saveCharInfo() { // 2 parts : closes off all info that doesn't change often from being edited, and saves all input info to myChar object (+ sets to localStorage)
    // myChar.name = charName.value
    // //myChar.class...
    // myChar.characteristics = [charAge.value,charHeight.value,charWeight.value,charEyes.value,charSkin.value,charHair.value]
    // myChar.race = charRace.value
    // myChar.background = charBackground.value
    // myChar.alignment = charAlignment.value
    // console.log(myChar)
    // localStorage.setItem('character',JSON.stringify(myChar))
    const allInput = document.querySelectorAll('input')
    const allButton = document.querySelectorAll('button')
    for (let i of allInput) {
        if(!i.classList.contains('changing')) {i.disabled = true}
    }
    for (let i of allButton) {
        if(!i.classList.contains('changing')) {i.disabled = true}
    }
}

function stopEdit() {

}

function grabLocal() { // if a character exists in localstorage, grabs it and assigns all relevant values to sheet

}

function updateDerivedValues() { // default just the general stat modifiers (str, con, etc) to avoid interfering with temp / specific bonuses to saves or skills or w/e else

}