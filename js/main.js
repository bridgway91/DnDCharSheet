class Character {
    constructor() {
        this.name = ''
        this.characteristics = [] // age, height, weight, eyes, skin, hair
        this.class = [] // ex: [[Monk,6],[Ranger,3],[Rogue,3]]
        this.background = ''
        this.race = ''
        this.alignment = ''
        this.stats = [] // ex: [10,10,10...] order = str,dex,con,int,wis,cha
        this.proficiency = 2
        this.saves = [] // line up boolean w/ stats, 0 for not prof, 1 for prof
        this.skills = [] // array of skills, NOT BOOLEAN, instead 0/1/2 for * prof bonus (to account for expertise)
        this.weapons = '' // strings of weapon names, tho mainly simple / martial
        this.armor = ''
        this.tools = ''
        this.languages = ''
        this.armor = 10
        this.initiative = 0
        this.speed = 30
        this.health = 10
        this.temp_health = 0
        this.hit_die = [[1,10]] // [# dice, die size], double array to account for if have multiple hit die sizes
        this.death_saves = [0,0]
        this.attacks = [['Unarmed',2,'1d4 bludgeoning']] // name,bonus,dmg
        this.equipment = [] // each item is an array [amount, name/description]
        this.money = [0,0,0,0,0] // copper, silver, etherium, gold, platinum
        this.features = [] // each feature is array [title, description]
        this.backstory = ''
        this.notes = []
        this.spellcasting = [] // ability, save DC, attack bonus
        this.spells = [] // each spell is [name, description]
    }
}

let myChar = new Character()

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

function editOrSave() {
    // if wanting to edit, run editCharInfo(), or if saving, run saveCharInfo()
    editInfo.innerHTML = editInfo.innerHTML == 'SAVE' ? 'EDIT' : 'SAVE'
    console.log(myChar)
    myChar.name = charName.value
    //myChar.class...
    myChar.characteristics = [charAge.value,charHeight.value,charWeight.value,charEyes.value,charSkin.value,charHair.value]
    myChar.race = charRace.value
    myChar.background = charBackground.value
    myChar.alignment = charAlignment.value
    console.log(myChar)
    const allInput = document.querySelectorAll('input')
    // console.log(allInput)
    localStorage.setItem('character',JSON.stringify(myChar))
    for (let i of allInput) {
        i.disabled = true
    }
}