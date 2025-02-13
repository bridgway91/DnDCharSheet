class Character {
    constructor() {
        this.name = ''
        this.class = [[]] // length=X -- array of arrays, each one separate [class,level]
        this.characteristics = [] // length=9 : race, background, alignment, age, height, weight, eyes, skin, hair
        this.stats = [] // length=6 : str, dex, con, int, wis, cha
        this.inspiration = false
        this.proficiency = 2
        this.saves = [] // length=6 -- [[boolean if prof, # bonus],...]
        this.skills = [] // array of skills, NOT BOOLEAN, instead 0/1/2 for * prof bonus (to account for expertise) -- [[0/1/2, # bonus],...]
        this.weapons = '' // strings of weapon names, tho mainly simple / martial
        this.armor = ''
        this.tools = ''
        this.languages = ''
        this.armorClass = 10
        this.initiative = 0
        this.speed = 30
        this.healthMax = 10
        this.healthCurrent = 10
        this.healthTemp = 0
        this.hitDie = [[1,'1d10']] // [# dice, die size], double array to account for if have multiple hit die sizes
        this.deathSaves = [[0,0,0],[0,0,0]]
        this.attacks = [['Unarmed Strike',2,'1d4+2 B']] // name,bonus,dmg
        this.money = [0,0,0,0,0] // platinum, gold, etherium, silver, copper
        this.items = [[]] // each item is an array [amount, name/description]
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
const charClasses = document.querySelector('#classes')
const charRace = document.querySelector('#race')
const charBackground = document.querySelector('#background')
const charAlignment = document.querySelector('#alignment')
const charAge = document.querySelector('#age')
const charHeight = document.querySelector('#height')
const charWeight = document.querySelector('#weight')
const charEyes = document.querySelector('#eyes')
const charSkin = document.querySelector('#skin')
const charHair = document.querySelector('#hair')

const charStats = document.querySelector('#stats')

const charInspiration = document.querySelector('#inspiration')
const charProficiency = document.querySelector('#proficiencyBonus')
const charSaves = document.querySelector('#saves')
const charSkills = document.querySelector('#skills')
const charOther = document.querySelector('#other')

const charArmorClass = document.querySelector('#armorClass')
const charInitiative = document.querySelector('#initiative')
const charSpeed = document.querySelector('#speed')
const charHealth = document.querySelector('#health')
const charHitDice = document.querySelector('#hitDiceWrapper')
const charDeathSaves = document.querySelector('#deathSaves')
const charAttacks = document.querySelector('#attacks')
const charMoney = document.querySelector('#money')
const charItems = document.querySelector('#itemsWrapper')

const charTrackers = document.querySelector('#trackers')
const charFeatures = document.querySelector('#features')

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
    const allInput = document.querySelectorAll('input')
    const allButton = document.querySelectorAll('button')
    for (let i of allInput) {
        if(!i.classList.contains('changing')) {i.disabled = true}
    }
    for (let i of allButton) {
        if(!i.classList.contains('changing')) {i.disabled = true}
    }

    updateCharacter()
    updateDerivedValues()
}

function grabLocal() { // if a character exists in localstorage, grabs it and assigns all relevant values to sheet

}

function updateDerivedValues() { // default just the general stat modifiers (str, con, etc) to avoid interfering with temp / specific bonuses to saves or skills or w/e else

}

function updateCharacter() { // updates myChar with entered info
    // name
    myChar.name = charName.value
    // classes
    let classDivsArray = [...charClasses.querySelectorAll('div')]
    myChar.class = classDivsArray.map(e=>[...e.querySelectorAll('input')].map(f=>f.value))
    // characteristics
    myChar.characteristics = [charRace.value, charBackground.value,charAlignment.value,charAge.value,charHeight.value,charWeight.value,charEyes.value,charSkin.value,charHair.value]
    // stats
    let statInputArray = [...charStats.querySelectorAll('input')]
    myChar.stats = statInputArray.map(e=>e.value)
    // inspiration
    myChar.inspiration = charInspiration.checked
    // proficiency
    myChar.proficiency = charProficiency.value
    // saves
    let savesCheckboxArray = [...charSaves.querySelectorAll('input[type=checkbox]')]
    let savesNumberArray = [...charSaves.querySelectorAll('input[type=number]')]
    myChar.saves = savesCheckboxArray.map((e,i)=>[e.checked,savesNumberArray[i].value])
    // skills
    let skillsDivArray = [...charSkills.querySelectorAll('div')]
    let skillsNumberArray = [...charSkills.querySelectorAll('input[type=number')]
    skillsDivArray = skillsDivArray.map(e=>[...e.querySelectorAll('input')].map(f=>f.checked).indexOf(true))
    myChar.skills = skillsDivArray.map((e,i)=>[e,skillsNumberArray[i].value])
    // weapons
    myChar.weapons = charOther.querySelector('#weaponProf').value
    // armor
    myChar.armor = charOther.querySelector('#armorProf').value
    // tools
    myChar.tools = charOther.querySelector('#toolProf').value
    // languages
    myChar.languages = charOther.querySelector('#languageProf').value
    // armor class
    myChar.armorClass = charArmorClass.value
    // initiative
    myChar.initiative = charInitiative.value
    // speed
    myChar.speed = charSpeed.value
    // health
    myChar.healthMax = charHealth.querySelector('#hpMax').value
    myChar.healthCurrent = charHealth.querySelector('#hpCurrent').value
    myChar.healthTemp = charHealth.querySelector('#hpTemp').value
    // hit dice
    let hitDiceDivArray = [...charHitDice.querySelectorAll('div')]
    myChar.hitDie = hitDiceDivArray.map(e=>[...e.querySelectorAll('input')].map(f=>f.value))
    // death saves
    myChar.deathSaves[0] = [...charDeathSaves.querySelector('#dsPass').querySelectorAll('input')].map(e=>e.checked)
    myChar.deathSaves[1] = [...charDeathSaves.querySelector('#dsFail').querySelectorAll('input')].map(e=>e.checked)
    // attacks
    let attacksArray = [...charAttacks.querySelector('tbody').querySelectorAll('tr')]
    myChar.attacks = attacksArray.map(e=>[...e.querySelectorAll('input')].map(f=>f.value))
    // money
    myChar.money = [...charMoney.querySelector('tbody').querySelectorAll('input')].map(e=>e.value)
    // items
    let itemsArray = [...charItems.querySelectorAll('div')]
    myChar.items = itemsArray.map(e=>[...e.querySelectorAll('input')].map(f=>f.value))
    // trackers
    let trackerArray = [...charTrackers.querySelectorAll('div')]
    myChar.trackers = trackerArray.map(e=>[...e.querySelectorAll('input')].map(f=>f.value))
    // features
    let featureArray = [...charFeatures.querySelectorAll('div')]
    myChar.features = featureArray.map(e=>[...e.querySelectorAll('*')].map(f=>f.value))

    console.log(myChar)
    localStorage.setItem('character',JSON.stringify(myChar))
}