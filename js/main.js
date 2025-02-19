class Character {
    constructor() {
        this.name = ''
        this.class = [] // length=X -- array of arrays, each one separate [class,level]
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
        this.items = [] // each item is an array [amount, name/description]
        this.trackers = [[],[]] // each [] is ['name',#-current,#-max]
        this.features = [[]] // each feature is array [title, source, description]
        this.spellcasting = [] // class, ability, save DC, attack bonus
        this.spellslots = {Level_1:[],Level_2:[],Level_3:[],Level_4:[],Level_5:[],Level_6:[],Level_7:[],Level_8:[],Level_9:[]} // [spell slots available, spell slots max]
        this.spells = {Cantrips:[],Level_1:[],Level_2:[],Level_3:[],Level_4:[],Level_5:[],Level_6:[],Level_7:[],Level_8:[],Level_9:[]} // each spell is [prepared-check, name, description]
        this.backstory = ''
        this.notes = []
    }
}

let myChar = localStorage.getItem('character')
    ? JSON.parse(localStorage.getItem('character'))
    : new Character()
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

const charSpellcasting = document.querySelector('#spellMeta')
const charSpell0 = document.querySelector('#cantrips')
const charSpell1 = document.querySelector('#firstLvl')
const charSpell2 = document.querySelector('#secondLvl')
const charSpell3 = document.querySelector('#thirdLvl')
const charSpell4 = document.querySelector('#fourthLvl')
const charSpell5 = document.querySelector('#fifthLvl')
const charSpell6 = document.querySelector('#sixthLvl')
const charSpell7 = document.querySelector('#seventhLvl')
const charSpell8 = document.querySelector('#eighthLvl')
const charSpell9 = document.querySelector('#ninthLvl')

const charBackstory = document.querySelector('#backstory')

const charNotes = document.querySelector('#campaignNotes')

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

function grabLocal() { // grabs character from localStorage and assigns all relevant values to sheet
    if (!localStorage.getItem('character')) return
    // name
    charName.value = myChar.name
    // classes
    if(myChar.class.length) {
        charClasses.innerHTML = ''
        for(let c of myChar.class) {
            charClasses.innerHTML += `
            		<div>
						<label>Class</label>
						<input type="text" placeholder="Warrior" value="${c[0]}"/>
						<label>Level</label>
						<input type="number" placeholder="1" value="${c[1]}"/>
					</div>`
        }
    }
    // characteristics
    charRace.value = myChar.characteristics[0]
    charBackground.value = myChar.characteristics[1]
    charAlignment.value = myChar.characteristics[2]
    charAge.value = myChar.characteristics[3]
    charHeight.value = myChar.characteristics[4]
    charWeight.value = myChar.characteristics[5]
    charEyes.value = myChar.characteristics[6]
    charSkin.value = myChar.characteristics[7]
    charHair.value = myChar.characteristics[8]
    // stats
    if(myChar.stats.length == 6) {
        document.querySelector('#strength').value = myChar.stats[0]
        document.querySelector('#dexterity').value = myChar.stats[1]
        document.querySelector('#constitution').value = myChar.stats[2]
        document.querySelector('#intelligence').value = myChar.stats[3]
        document.querySelector('#wisdom').value = myChar.stats[4]
        document.querySelector('#charisma').value = myChar.stats[5]
    }
    // inspiration
    charInspiration.checked = myChar.inspiration
    // proficiency
    charProficiency.value = myChar.proficiency
    // saves
    let savesCheckboxArray = [...charSaves.querySelectorAll('input[type=checkbox]')]
    savesCheckboxArray.forEach((e,i)=>e.checked = myChar.saves[i][0])
    let savesNumberArray = [...charSaves.querySelectorAll('input[type=number]')]
    savesNumberArray.forEach((e,i)=>e.value = myChar.saves[i][1])
    // skills
    let skillsNorArray = [...charSkills.querySelectorAll('input[value=normal]')]
    skillsNorArray.forEach((e,i)=>{if(myChar.skills[i][0]==0){e.checked = true}})
    let skillsProArray = [...charSkills.querySelectorAll('input[value=proficient]')]
    skillsProArray.forEach((e,i)=>{if(myChar.skills[i][0]==1){e.checked = true}})
    let skillsExpArray = [...charSkills.querySelectorAll('input[value=expertise]')]
    skillsExpArray.forEach((e,i)=>{if(myChar.skills[i][0]==2){e.checked = true}})
    let skillsNumberArray = [...charSkills.querySelectorAll('input[type=number]')]
    skillsNumberArray.forEach((e,i)=>{e.value = myChar.skills[i][1]})
    // weapons
    charOther.querySelector('#weaponProf').value = myChar.weapons
    // armor
    charOther.querySelector('#armorProf').value = myChar.armor
    // tools
    charOther.querySelector('#toolProf').value = myChar.tools
    // languages
    charOther.querySelector('#languageProf').value = myChar.languages
    // armor class
    charArmorClass.value = myChar.armorClass
    // initiative
    charInitiative.value = myChar.initiative
    // speed
    charSpeed.value = myChar.speed
    // health
    charHealth.querySelector('#hpMax').value = myChar.healthMax
    charHealth.querySelector('#hpCurrent').value = myChar.healthCurrent
    charHealth.querySelector('#hpTemp').value = myChar.healthTemp
    // hit dice
    if(myChar.hitDie.length > 0) {
        charHitDice.innerHTML = ''
        myChar.hitDie.forEach(e=>{
            charHitDice.innerHTML += `
                <div>
					<input class="changing" type="number" placeholder="1" value="${e[0]}"/>
					<input type="text" placeholder="1d10" value="${e[1]}"/>
				</div>`
        })
    }
    // death saves
    let pSaves = [...charDeathSaves.querySelector('#dsPass').querySelectorAll('input')]
    pSaves.forEach((e,i)=>{if(myChar.deathSaves[0][i]){e.checked=true}else{e.checked=false}})
    let fSaves = [...charDeathSaves.querySelector('#dsFail').querySelectorAll('input')]
    fSaves.forEach((e,i)=>{if(myChar.deathSaves[1][i]){e.checked=true}else{e.checked=false}})
    // attacks
    let atksBody = charAttacks.querySelector('tbody')
    if(myChar.attacks.length > 0) {
        atksBody.innerHTML = ''
        myChar.attacks.forEach(e=>{
            atksBody.innerHTML += `
                <tr>
				    <td><input type="text" placeholder="Unarmed Strike" value="${e[0]}"/></td>
					<td><input type="number" placeholder="2" value="${e[1]}"/></td>
					<td><input type="text" placeholder="1d4+2 B" value="${e[2]}"/></td>
				</tr>`
        })
    }
    // money
    let moneyTable = [...charMoney.querySelector('tbody').querySelectorAll('input')]
    moneyTable.forEach((e,i)=>e.value = myChar.money[i])
    // items
    if(myChar.items.length > 0) {
        charItems.innerHTML = ''
        myChar.items.forEach(e=>{
            charItems.innerHTML += `
                <div>
					<input type="number" placeholder="1" value="${e[0]}"/>
					<input type="text" placeholder="Backpack" value="${e[1]}"/>
				</div>`
        })
    }
    

    /////////////////////////////////////////////////
    
    // // trackers
    // let trackerArray = [...charTrackers.querySelectorAll('div')]
    // myChar.trackers = trackerArray.map(e=>[...e.querySelectorAll('input')].map(f=>f.value))
    // // features
    // let featureArray = [...charFeatures.querySelectorAll('div')]
    // myChar.features = featureArray.map(e=>[...e.querySelectorAll('*')].map(f=>f.value))
    // // spellcasting
    // myChar.spellcasting = [
    //     charSpellcasting.querySelector('#spellClass').value,
    //     charSpellcasting.querySelector('#spellAbility').value,
    //     charSpellcasting.querySelector('#spellSaveDC').value,
    //     charSpellcasting.querySelector('#spellAtkBonus').value]
    // // spells-0
    // let cantripsArray = [...charSpell0.querySelectorAll('div')]
    // myChar.spells['Cantrips'] = cantripsArray.map(e=>[e.querySelector('input').value,e.querySelector('textarea').value])
    // // spells-1
    // let spell1Slots = [...charSpell1.previousElementSibling.querySelectorAll('input')]
    // let spell1Array = [...charSpell1.querySelectorAll('div')]
    // myChar.spellslots['Level_1'] = spell1Slots.map(e=>e.value)
    // myChar.spells['Level_1'] = spell1Array.map(e=>[e.querySelector('input[type=checkbox]').checked,e.querySelector('input[type=text]').value,e.querySelector('textarea').value])
    // // spells-2
    // let spell2Slots = [...charSpell2.previousElementSibling.querySelectorAll('input')]
    // let spell2Array = [...charSpell2.querySelectorAll('div')]
    // myChar.spellslots['Level_2'] = spell2Slots.map(e=>e.value)
    // myChar.spells['Level_2'] = spell2Array.map(e=>[e.querySelector('input[type=checkbox]').checked,e.querySelector('input[type=text]').value,e.querySelector('textarea').value])
    // // spells-3
    // let spell3Slots = [...charSpell3.previousElementSibling.querySelectorAll('input')]
    // let spell3Array = [...charSpell3.querySelectorAll('div')]
    // myChar.spellslots['Level_3'] = spell3Slots.map(e=>e.value)
    // myChar.spells['Level_3'] = spell3Array.map(e=>[e.querySelector('input[type=checkbox]').checked,e.querySelector('input[type=text]').value,e.querySelector('textarea').value])
    // // spells-4
    // let spell4Slots = [...charSpell4.previousElementSibling.querySelectorAll('input')]
    // let spell4Array = [...charSpell4.querySelectorAll('div')]
    // myChar.spellslots['Level_4'] = spell4Slots.map(e=>e.value)
    // myChar.spells['Level_4'] = spell4Array.map(e=>[e.querySelector('input[type=checkbox]').checked,e.querySelector('input[type=text]').value,e.querySelector('textarea').value])
    // // spells-5
    // let spell5Slots = [...charSpell5.previousElementSibling.querySelectorAll('input')]
    // let spell5Array = [...charSpell5.querySelectorAll('div')]
    // myChar.spellslots['Level_5'] = spell5Slots.map(e=>e.value)
    // myChar.spells['Level_5'] = spell5Array.map(e=>[e.querySelector('input[type=checkbox]').checked,e.querySelector('input[type=text]').value,e.querySelector('textarea').value])
    // // spells-6
    // let spell6Slots = [...charSpell6.previousElementSibling.querySelectorAll('input')]
    // let spell6Array = [...charSpell6.querySelectorAll('div')]
    // myChar.spellslots['Level_6'] = spell6Slots.map(e=>e.value)
    // myChar.spells['Level_6'] = spell6Array.map(e=>[e.querySelector('input[type=checkbox]').checked,e.querySelector('input[type=text]').value,e.querySelector('textarea').value])
    // // spells-7
    // let spell7Slots = [...charSpell7.previousElementSibling.querySelectorAll('input')]
    // let spell7Array = [...charSpell7.querySelectorAll('div')]
    // myChar.spellslots['Level_7'] = spell7Slots.map(e=>e.value)
    // myChar.spells['Level_7'] = spell7Array.map(e=>[e.querySelector('input[type=checkbox]').checked,e.querySelector('input[type=text]').value,e.querySelector('textarea').value])
    // // spells-8
    // let spell8Slots = [...charSpell8.previousElementSibling.querySelectorAll('input')]
    // let spell8Array = [...charSpell8.querySelectorAll('div')]
    // myChar.spellslots['Level_8'] = spell8Slots.map(e=>e.value)
    // myChar.spells['Level_8'] = spell8Array.map(e=>[e.querySelector('input[type=checkbox]').checked,e.querySelector('input[type=text]').value,e.querySelector('textarea').value])
    // // spells-9
    // let spell9Slots = [...charSpell9.previousElementSibling.querySelectorAll('input')]
    // let spell9Array = [...charSpell9.querySelectorAll('div')]
    // myChar.spellslots['Level_9'] = spell9Slots.map(e=>e.value)
    // myChar.spells['Level_9'] = spell9Array.map(e=>[e.querySelector('input[type=checkbox]').checked,e.querySelector('input[type=text]').value,e.querySelector('textarea').value])
    // // backstory
    // myChar.backstory = charBackstory.querySelector('textarea').value
    // // campaign notes
    // let notesArray = [...charNotes.querySelectorAll('textarea')]
    // myChar.notes = notesArray.map(e=>e.value)

    // console.log(myChar)
    // localStorage.setItem('character',JSON.stringify(myChar))
}

function updateDerivedValues() { // default just the general stat modifiers (str, con, etc) to avoid interfering with temp / specific bonuses to saves or skills or w/e else, separate fn b/c might expand later

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
    let skillsNumberArray = [...charSkills.querySelectorAll('input[type=number]')]
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
    // spellcasting
    myChar.spellcasting = [
        charSpellcasting.querySelector('#spellClass').value,
        charSpellcasting.querySelector('#spellAbility').value,
        charSpellcasting.querySelector('#spellSaveDC').value,
        charSpellcasting.querySelector('#spellAtkBonus').value]
    // spells-0
    let cantripsArray = [...charSpell0.querySelectorAll('div')]
    myChar.spells['Cantrips'] = cantripsArray.map(e=>[e.querySelector('input').value,e.querySelector('textarea').value])
    // spells-1
    let spell1Slots = [...charSpell1.previousElementSibling.querySelectorAll('input')]
    let spell1Array = [...charSpell1.querySelectorAll('div')]
    myChar.spellslots['Level_1'] = spell1Slots.map(e=>e.value)
    myChar.spells['Level_1'] = spell1Array.map(e=>[e.querySelector('input[type=checkbox]').checked,e.querySelector('input[type=text]').value,e.querySelector('textarea').value])
    // spells-2
    let spell2Slots = [...charSpell2.previousElementSibling.querySelectorAll('input')]
    let spell2Array = [...charSpell2.querySelectorAll('div')]
    myChar.spellslots['Level_2'] = spell2Slots.map(e=>e.value)
    myChar.spells['Level_2'] = spell2Array.map(e=>[e.querySelector('input[type=checkbox]').checked,e.querySelector('input[type=text]').value,e.querySelector('textarea').value])
    // spells-3
    let spell3Slots = [...charSpell3.previousElementSibling.querySelectorAll('input')]
    let spell3Array = [...charSpell3.querySelectorAll('div')]
    myChar.spellslots['Level_3'] = spell3Slots.map(e=>e.value)
    myChar.spells['Level_3'] = spell3Array.map(e=>[e.querySelector('input[type=checkbox]').checked,e.querySelector('input[type=text]').value,e.querySelector('textarea').value])
    // spells-4
    let spell4Slots = [...charSpell4.previousElementSibling.querySelectorAll('input')]
    let spell4Array = [...charSpell4.querySelectorAll('div')]
    myChar.spellslots['Level_4'] = spell4Slots.map(e=>e.value)
    myChar.spells['Level_4'] = spell4Array.map(e=>[e.querySelector('input[type=checkbox]').checked,e.querySelector('input[type=text]').value,e.querySelector('textarea').value])
    // spells-5
    let spell5Slots = [...charSpell5.previousElementSibling.querySelectorAll('input')]
    let spell5Array = [...charSpell5.querySelectorAll('div')]
    myChar.spellslots['Level_5'] = spell5Slots.map(e=>e.value)
    myChar.spells['Level_5'] = spell5Array.map(e=>[e.querySelector('input[type=checkbox]').checked,e.querySelector('input[type=text]').value,e.querySelector('textarea').value])
    // spells-6
    let spell6Slots = [...charSpell6.previousElementSibling.querySelectorAll('input')]
    let spell6Array = [...charSpell6.querySelectorAll('div')]
    myChar.spellslots['Level_6'] = spell6Slots.map(e=>e.value)
    myChar.spells['Level_6'] = spell6Array.map(e=>[e.querySelector('input[type=checkbox]').checked,e.querySelector('input[type=text]').value,e.querySelector('textarea').value])
    // spells-7
    let spell7Slots = [...charSpell7.previousElementSibling.querySelectorAll('input')]
    let spell7Array = [...charSpell7.querySelectorAll('div')]
    myChar.spellslots['Level_7'] = spell7Slots.map(e=>e.value)
    myChar.spells['Level_7'] = spell7Array.map(e=>[e.querySelector('input[type=checkbox]').checked,e.querySelector('input[type=text]').value,e.querySelector('textarea').value])
    // spells-8
    let spell8Slots = [...charSpell8.previousElementSibling.querySelectorAll('input')]
    let spell8Array = [...charSpell8.querySelectorAll('div')]
    myChar.spellslots['Level_8'] = spell8Slots.map(e=>e.value)
    myChar.spells['Level_8'] = spell8Array.map(e=>[e.querySelector('input[type=checkbox]').checked,e.querySelector('input[type=text]').value,e.querySelector('textarea').value])
    // spells-9
    let spell9Slots = [...charSpell9.previousElementSibling.querySelectorAll('input')]
    let spell9Array = [...charSpell9.querySelectorAll('div')]
    myChar.spellslots['Level_9'] = spell9Slots.map(e=>e.value)
    myChar.spells['Level_9'] = spell9Array.map(e=>[e.querySelector('input[type=checkbox]').checked,e.querySelector('input[type=text]').value,e.querySelector('textarea').value])
    // backstory
    myChar.backstory = charBackstory.querySelector('textarea').value
    // campaign notes
    let notesArray = [...charNotes.querySelectorAll('textarea')]
    myChar.notes = notesArray.map(e=>e.value)

    console.log(myChar)
    localStorage.setItem('character',JSON.stringify(myChar))
}



grabLocal()