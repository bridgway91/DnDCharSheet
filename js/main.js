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
        this.trackers = [] // each [] is ['name',#-current,#-max]
        this.features = [] // each feature is array [title, source, description]
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
// console.log(myChar)

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
imChar.addEventListener('change',importData)
exChar.addEventListener('click',exportData)

document.querySelector('#addClass').addEventListener('click',addOption)
document.querySelector('#addHitDie').addEventListener('click',addOption)
document.querySelector('#addAttack').addEventListener('click',addOption)
document.querySelector('#addItem').addEventListener('click',addOption)
document.querySelector('#addTracker').addEventListener('click',addOption)
document.querySelector('#addFeature').addEventListener('click',addOption)
document.querySelector('#addNote').addEventListener('click',addOption)
document.querySelector('#addCantrip').addEventListener('click',addOption)

let levelledSpells = [...document.querySelectorAll('button')].filter(e=>e.classList.contains('addSpell'))
levelledSpells.forEach(e=>e.addEventListener('click',addSpell))

let changingInput = [...document.querySelectorAll('input')].filter(e=>e.classList.contains('changing'))
changingInput.forEach(e=>e.addEventListener('change',autoUpdate))

/////////////////////////////////////////////////

function editOrSave() { // if wanting to edit, run editCharInfo(), or if saving, run saveCharInfo()
    if(editInfo.innerHTML == 'SAVE') {
        saveCharInfo()
        editInfo.innerHTML = 'EDIT'
    } else {
        editCharInfo()
        editInfo.innerHTML = 'SAVE'
    }
    // console.log(myChar)
}

function editCharInfo() { // enables editing all inputs
    const allInput = document.querySelectorAll('input')
    const allButton = document.querySelectorAll('button')
    const allTextarea = document.querySelectorAll('textarea')
    for (let i of allInput) {i.disabled = false}
    for (let i of allButton) {i.disabled = false}
    for (let i of allTextarea) {i.disabled = false}
}

function saveCharInfo() { // 2 parts : closes off all info that doesn't change often from being edited, and saves all input info to myChar object (+ sets to localStorage)
    updateCharacter()
    updateDerivedValues()
    
    const allInput = document.querySelectorAll('input')
    const allButton = document.querySelectorAll('button')
    const allTextarea = document.querySelectorAll('textarea')
    for (let i of allInput) {if(!i.classList.contains('changing')) {i.disabled = true}}
    for (let i of allButton) {if(!i.classList.contains('changing')) {i.disabled = true}}
    for (let i of allTextarea) {if(!i.classList.contains('changing')) {i.disabled = true}}
}

function grabLocal() { // grabs character from localStorage and assigns all relevant values to sheet
    if (!localStorage.getItem('character')) return
    // name
    charName.value = myChar.name
    // classes
    if(myChar.class.length) {
        charClasses.innerHTML = ''
        for(let c of myChar.class) {
            if(c[0].length==0) continue
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
            if(e[0].length!=0) {
            let newHitDie = document.createElement('div')
            newHitDie.innerHTML = `
                <input class="changing" type="number" placeholder="1" value="${e[0]}"/>
                <input type="text" placeholder="1d10" value="${e[1]}"/>`
            newHitDie.querySelector('input[type=number]').addEventListener('change',autoUpdate)
            charHitDice.appendChild(newHitDie)
            }
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
            if(e[0].length!=0) {
            atksBody.innerHTML += `
                <tr>
				    <td><input type="text" placeholder="Unarmed Strike" value="${e[0]}"/></td>
					<td><input type="number" placeholder="2" value="${e[1]}"/></td>
					<td><input type="text" placeholder="1d4+2 B" value="${e[2]}"/></td>
				</tr>`}
        })
    }
    // money
    let moneyTable = [...charMoney.querySelector('tbody').querySelectorAll('input')]
    moneyTable.forEach((e,i)=>e.value = myChar.money[i])
    // items
    if(myChar.items.length > 0) {
        charItems.innerHTML = ''
        myChar.items.forEach(e=>{
            if(e[0].length!=0) {
            charItems.innerHTML += `
                <div>
					<input type="number" placeholder="1" value="${e[0]}"/>
					<input type="text" placeholder="Backpack" value="${e[1]}"/>
				</div>`}
        })
    }
    // trackers
    if(myChar.trackers.length > 0) {
        charTrackers.innerHTML = ''
        myChar.trackers.forEach(e=>{
            if(e[0].length!=0) {
            let newTracker = document.createElement('div')
            newTracker.innerHTML = `
                <input type="text" placeholder="Daily Use" value="${e[0]}"/>
                <input class="changing" type="number" placeholder="1" value="${e[1]}"/>
                <span>/</span>
                <input type="number" placeholder="1" value="${e[2]}"/>`
            newTracker.querySelector('input[type=number]').addEventListener('change',autoUpdate)
            charTrackers.appendChild(newTracker)
            }
        })
    }
    // features
    if(myChar.features.length > 0) {
        charFeatures.innerHTML = ''
        myChar.features.forEach(e=>{
            if(e[0].length!=0) {
            charFeatures.innerHTML += `
                <div>
                    <input type="text" placeholder="Feature" value="${e[0]}">
                    <input type="text" class="featSource" placeholder="Source" value="${e[1]}">
                    <textarea rows="4" placeholder="Description">${e[2]}</textarea>
                </div>`}
        })
    }
    // spellcasting
    charSpellcasting.querySelector('#spellClass').value = myChar.spellcasting[0]
    charSpellcasting.querySelector('#spellAbility').value = myChar.spellcasting[1]
    charSpellcasting.querySelector('#spellSaveDC').value = myChar.spellcasting[2]
    charSpellcasting.querySelector('#spellAtkBonus').value = myChar.spellcasting[3]
    // spells-0
    if(myChar.spells['Cantrips'].length > 0) {
        charSpell0.innerHTML = ''
        myChar.spells['Cantrips'].forEach(e=>{
            if(e[0].length!=0) {
            charSpell0.innerHTML += `
                <div>
                    <input type="text" placeholder="Spell" value="${e[0]}"/>
                    <textarea placeholder="Description">${e[1]}</textarea>
                </div>`}
        })
    }
    // spells-1
    if(myChar.spellslots['Level_1'].length > 0) {
        let spell1Slots = [...charSpell1.previousElementSibling.querySelectorAll('input')]
        spell1Slots.forEach((e,i)=>e.value = myChar.spellslots['Level_1'][i])
    }
    if(myChar.spells['Level_1'].length > 0) {
        charSpell1.innerHTML = ''
        myChar.spells['Level_1'].forEach(e=>{
            if(e[1].length!=0) {
            charSpell1.innerHTML += `
            <div>
                <input class="changing" type="checkbox"`+(e[0]?' checked' : '')+`/>
                <input type="text" placeholder="Spell" value="${e[1]}">
                <textarea placeholder="Description">${e[2]}</textarea>
            </div>`}
        })
    }
    // spells-2
    if(myChar.spellslots['Level_2'].length > 0) {
        let spell2Slots = [...charSpell2.previousElementSibling.querySelectorAll('input')]
        spell2Slots.forEach((e,i)=>e.value = myChar.spellslots['Level_2'][i])
    }
    if(myChar.spells['Level_2'].length > 0) {
        charSpell2.innerHTML = ''
        myChar.spells['Level_2'].forEach(e=>{
            if(e[1].length!=0) {
            charSpell2.innerHTML += `
            <div>
                <input class="changing" type="checkbox"`+(e[0]?' checked' : '')+`/>
                <input type="text" placeholder="Spell" value="${e[1]}">
                <textarea placeholder="Description">${e[2]}</textarea>
            </div>`}
        })
    }
    // spells-3
    if(myChar.spellslots['Level_3'].length > 0) {
        let spell3Slots = [...charSpell3.previousElementSibling.querySelectorAll('input')]
        spell3Slots.forEach((e,i)=>e.value = myChar.spellslots['Level_3'][i])
    }
    if(myChar.spells['Level_3'].length > 0) {
        charSpell3.innerHTML = ''
        myChar.spells['Level_3'].forEach(e=>{
            if(e[1].length!=0) {
            charSpell3.innerHTML += `
            <div>
                <input class="changing" type="checkbox"`+(e[0]?' checked' : '')+`/>
                <input type="text" placeholder="Spell" value="${e[1]}">
                <textarea placeholder="Description">${e[2]}</textarea>
            </div>`}
        })
    }
    // spells-4
    if(myChar.spellslots['Level_4'].length > 0) {
        let spell4Slots = [...charSpell4.previousElementSibling.querySelectorAll('input')]
        spell4Slots.forEach((e,i)=>e.value = myChar.spellslots['Level_4'][i])
    }
    if(myChar.spells['Level_4'].length > 0) {
        charSpell4.innerHTML = ''
        myChar.spells['Level_4'].forEach(e=>{
            if(e[1].length!=0) {
            charSpell4.innerHTML += `
            <div>
                <input class="changing" type="checkbox"`+(e[0]?' checked' : '')+`/>
                <input type="text" placeholder="Spell" value="${e[1]}">
                <textarea placeholder="Description">${e[2]}</textarea>
            </div>`}
        })
    }
    // spells-5
    if(myChar.spellslots['Level_5'].length > 0) {
        let spell5Slots = [...charSpell5.previousElementSibling.querySelectorAll('input')]
        spell5Slots.forEach((e,i)=>e.value = myChar.spellslots['Level_5'][i])
    }
    if(myChar.spells['Level_5'].length > 0) {
        charSpell5.innerHTML = ''
        myChar.spells['Level_5'].forEach(e=>{
            if(e[1].length!=0) {
            charSpell5.innerHTML += `
            <div>
                <input class="changing" type="checkbox"`+(e[0]?' checked' : '')+`/>
                <input type="text" placeholder="Spell" value="${e[1]}">
                <textarea placeholder="Description">${e[2]}</textarea>
            </div>`}
        })
    }
    // spells-6
    if(myChar.spellslots['Level_6'].length > 0) {
        let spell6Slots = [...charSpell6.previousElementSibling.querySelectorAll('input')]
        spell6Slots.forEach((e,i)=>e.value = myChar.spellslots['Level_6'][i])
    }
    if(myChar.spells['Level_6'].length > 0) {
        charSpell6.innerHTML = ''
        myChar.spells['Level_6'].forEach(e=>{
            if(e[1].length!=0) {
            charSpell6.innerHTML += `
            <div>
                <input class="changing" type="checkbox"`+(e[0]?' checked' : '')+`/>
                <input type="text" placeholder="Spell" value="${e[1]}">
                <textarea placeholder="Description">${e[2]}</textarea>
            </div>`}
        })
    }
    // spells-7
    if(myChar.spellslots['Level_7'].length > 0) {
        let spell7Slots = [...charSpell7.previousElementSibling.querySelectorAll('input')]
        spell7Slots.forEach((e,i)=>e.value = myChar.spellslots['Level_7'][i])
    }
    if(myChar.spells['Level_7'].length > 0) {
        charSpell7.innerHTML = ''
        myChar.spells['Level_7'].forEach(e=>{
            if(e[1].length!=0) {
            charSpell7.innerHTML += `
            <div>
                <input class="changing" type="checkbox"`+(e[0]?' checked' : '')+`/>
                <input type="text" placeholder="Spell" value="${e[1]}">
                <textarea placeholder="Description">${e[2]}</textarea>
            </div>`}
        })
    }
    // spells-8
    if(myChar.spellslots['Level_8'].length > 0) {
        let spell8Slots = [...charSpell8.previousElementSibling.querySelectorAll('input')]
        spell8Slots.forEach((e,i)=>e.value = myChar.spellslots['Level_8'][i])
    }
    if(myChar.spells['Level_8'].length > 0) {
        charSpell8.innerHTML = ''
        myChar.spells['Level_8'].forEach(e=>{
            if(e[1].length!=0) {
            charSpell8.innerHTML += `
            <div>
                <input class="changing" type="checkbox"`+(e[0]?' checked' : '')+`/>
                <input type="text" placeholder="Spell" value="${e[1]}">
                <textarea placeholder="Description">${e[2]}</textarea>
            </div>`}
        })
    }
    // spells-9
    if(myChar.spellslots['Level_9'].length > 0) {
        let spell9Slots = [...charSpell9.previousElementSibling.querySelectorAll('input')]
        spell9Slots.forEach((e,i)=>e.value = myChar.spellslots['Level_9'][i])
    }
    if(myChar.spells['Level_9'].length > 0) {
        charSpell9.innerHTML = ''
        myChar.spells['Level_9'].forEach(e=>{
            if(e[1].length!=0) {
            charSpell9.innerHTML += `
            <div>
                <input class="changing" type="checkbox"`+(e[0]?' checked' : '')+`/>
                <input type="text" placeholder="Spell" value="${e[1]}">
                <textarea placeholder="Description">${e[2]}</textarea>
            </div>`}
        })
    }
    // backstory
    charBackstory.querySelector('textarea').value = myChar.backstory
    // campaign notes
    if(myChar.notes.length > 0) {
        charNotes.innerHTML = ''
        myChar.notes.forEach(e=>{
            if(e.length!=0) {
            charNotes.innerHTML += `<textarea rows="4" placeholder="Rocks fell...">${e}</textarea>`}
        })
    }

    updateDerivedValues()
}

function updateDerivedValues() { // default just the general stat modifiers (str, con, etc) to avoid interfering with temp / specific bonuses to saves or skills or w/e else, separate fn b/c might expand later
    let stats = myChar.stats
    stats = stats.map(e=>Math.floor((+e - 10)/2))
    let statSpanArray = [...charStats.querySelectorAll('span')]
    statSpanArray.forEach((e,i)=>e.innerHTML = stats[i] >= 0 ? '+'+stats[i] : stats[i])
}

function updateCharacter() { // updates myChar with entered info
    // name
    myChar.name = charName.value
    // classes
    let classDivsArray = [...charClasses.querySelectorAll('div')]
    myChar.class = classDivsArray
                        .map(e=>[...e.querySelectorAll('input')].map(f=>f.value))
                        .filter(e=>e.every(f=>f.length > 0))
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
    myChar.hitDie = hitDiceDivArray
                        .map(e=>[...e.querySelectorAll('input')].map(f=>f.value))
                        .filter(e=>e.every(f=>f.length > 0))
    // death saves
    myChar.deathSaves[0] = [...charDeathSaves.querySelector('#dsPass').querySelectorAll('input')].map(e=>e.checked)
    myChar.deathSaves[1] = [...charDeathSaves.querySelector('#dsFail').querySelectorAll('input')].map(e=>e.checked)
    // attacks
    let attacksArray = [...charAttacks.querySelector('tbody').querySelectorAll('tr')]
    myChar.attacks = attacksArray
                        .map(e=>[...e.querySelectorAll('input')].map(f=>f.value))
                        .filter(e=>e.every(f=>f.length > 0))
    // money
    myChar.money = [...charMoney.querySelector('tbody').querySelectorAll('input')].map(e=>e.value)
    // items
    let itemsArray = [...charItems.querySelectorAll('div')]
    myChar.items = itemsArray
                    .map(e=>[...e.querySelectorAll('input')].map(f=>f.value))
                    .filter(e=>e.every(f=>f.length > 0))
    // trackers
    let trackerArray = [...charTrackers.querySelectorAll('div')]
    myChar.trackers = trackerArray
                        .map(e=>[...e.querySelectorAll('input')].map(f=>f.value))
                        .filter(e=>e.every(f=>f.length > 0))
    // features
    let featureArray = [...charFeatures.querySelectorAll('div')]
    myChar.features = featureArray
                        .map(e=>[...e.querySelectorAll('*')].map(f=>f.value))
                        .filter(e=>e.every(f=>f.length > 0))
    // spellcasting
    myChar.spellcasting = [
        charSpellcasting.querySelector('#spellClass').value,
        charSpellcasting.querySelector('#spellAbility').value,
        charSpellcasting.querySelector('#spellSaveDC').value,
        charSpellcasting.querySelector('#spellAtkBonus').value]
    // spells-0
    let cantripsArray = [...charSpell0.querySelectorAll('div')]
    myChar.spells['Cantrips'] = cantripsArray
            .map(e=>[e.querySelector('input').value,e.querySelector('textarea').value])
            .filter(e=>e.every(f=>f.length > 0))
    // spells-1
    let spell1Slots = [...charSpell1.previousElementSibling.querySelectorAll('input')]
    let spell1Array = [...charSpell1.querySelectorAll('div')]
    myChar.spellslots['Level_1'] = spell1Slots.map(e=>e.value)
    myChar.spells['Level_1'] = spell1Array
            .map(e=>[e.querySelector('input[type=checkbox]').checked,e.querySelector('input[type=text]').value,e.querySelector('textarea').value])
            .filter(e=>e[1].length>0)
    // spells-2
    let spell2Slots = [...charSpell2.previousElementSibling.querySelectorAll('input')]
    let spell2Array = [...charSpell2.querySelectorAll('div')]
    myChar.spellslots['Level_2'] = spell2Slots.map(e=>e.value)
    myChar.spells['Level_2'] = spell2Array
            .map(e=>[e.querySelector('input[type=checkbox]').checked,e.querySelector('input[type=text]').value,e.querySelector('textarea').value])
            .filter(e=>e[1].length>0)
    // spells-3
    let spell3Slots = [...charSpell3.previousElementSibling.querySelectorAll('input')]
    let spell3Array = [...charSpell3.querySelectorAll('div')]
    myChar.spellslots['Level_3'] = spell3Slots.map(e=>e.value)
    myChar.spells['Level_3'] = spell3Array
            .map(e=>[e.querySelector('input[type=checkbox]').checked,e.querySelector('input[type=text]').value,e.querySelector('textarea').value])
            .filter(e=>e[1].length>0)
    // spells-4
    let spell4Slots = [...charSpell4.previousElementSibling.querySelectorAll('input')]
    let spell4Array = [...charSpell4.querySelectorAll('div')]
    myChar.spellslots['Level_4'] = spell4Slots.map(e=>e.value)
    myChar.spells['Level_4'] = spell4Array
            .map(e=>[e.querySelector('input[type=checkbox]').checked,e.querySelector('input[type=text]').value,e.querySelector('textarea').value])
            .filter(e=>e[1].length>0)
    // spells-5
    let spell5Slots = [...charSpell5.previousElementSibling.querySelectorAll('input')]
    let spell5Array = [...charSpell5.querySelectorAll('div')]
    myChar.spellslots['Level_5'] = spell5Slots.map(e=>e.value)
    myChar.spells['Level_5'] = spell5Array
            .map(e=>[e.querySelector('input[type=checkbox]').checked,e.querySelector('input[type=text]').value,e.querySelector('textarea').value])
            .filter(e=>e[1].length>0)
    // spells-6
    let spell6Slots = [...charSpell6.previousElementSibling.querySelectorAll('input')]
    let spell6Array = [...charSpell6.querySelectorAll('div')]
    myChar.spellslots['Level_6'] = spell6Slots.map(e=>e.value)
    myChar.spells['Level_6'] = spell6Array
            .map(e=>[e.querySelector('input[type=checkbox]').checked,e.querySelector('input[type=text]').value,e.querySelector('textarea').value])
            .filter(e=>e[1].length>0)
    // spells-7
    let spell7Slots = [...charSpell7.previousElementSibling.querySelectorAll('input')]
    let spell7Array = [...charSpell7.querySelectorAll('div')]
    myChar.spellslots['Level_7'] = spell7Slots.map(e=>e.value)
    myChar.spells['Level_7'] = spell7Array
            .map(e=>[e.querySelector('input[type=checkbox]').checked,e.querySelector('input[type=text]').value,e.querySelector('textarea').value])
            .filter(e=>e[1].length>0)
    // spells-8
    let spell8Slots = [...charSpell8.previousElementSibling.querySelectorAll('input')]
    let spell8Array = [...charSpell8.querySelectorAll('div')]
    myChar.spellslots['Level_8'] = spell8Slots.map(e=>e.value)
    myChar.spells['Level_8'] = spell8Array
            .map(e=>[e.querySelector('input[type=checkbox]').checked,e.querySelector('input[type=text]').value,e.querySelector('textarea').value])
            .filter(e=>e[1].length>0)
    // spells-9
    let spell9Slots = [...charSpell9.previousElementSibling.querySelectorAll('input')]
    let spell9Array = [...charSpell9.querySelectorAll('div')]
    myChar.spellslots['Level_9'] = spell9Slots.map(e=>e.value)
    myChar.spells['Level_9'] = spell9Array
            .map(e=>[e.querySelector('input[type=checkbox]').checked,e.querySelector('input[type=text]').value,e.querySelector('textarea').value])
            .filter(e=>e[1].length>0)
    // backstory
    myChar.backstory = charBackstory.querySelector('textarea').value
    // campaign notes
    let notesArray = [...charNotes.querySelectorAll('textarea')]
    myChar.notes = notesArray.map(e=>e.value)

    localStorage.setItem('character',JSON.stringify(myChar))
    // console.log(myChar)
    grabLocal()
}

function addOption() {
    let str = event.target.id
    // console.log(str)
    let newElement
    switch (str) {
        case 'addClass':
            myChar.class.push(['',''])
            newElement = document.createElement('div')
            newElement.innerHTML = `
                <label>Class</label>
                <input type="text" placeholder="Warrior"/>
                <label>Level</label>
                <input type="number" placeholder="1"/>`
            charClasses.appendChild(newElement)
            break;
        case 'addHitDie':
            myChar.hitDie.push(['',''])
            newElement = document.createElement('div')
            newElement.innerHTML = `
                <input class="changing" type="number" placeholder="1"/>
                <input type="text" placeholder="1d10"/>`
            newElement.querySelector('input[type=number]').addEventListener('change',autoUpdate)
            charHitDice.appendChild(newElement)
            break;
        case 'addAttack':
            myChar.attacks.push(['','',''])
            newElement = document.createElement('tr')
            newElement.innerHTML = `
                <td><input type="text" placeholder="Unarmed Strike"/></td>
                <td><input type="number" placeholder="2"/></td>
                <td><input type="text" placeholder="1d4+2 B"/></td>`
            charAttacks.querySelector('tbody').appendChild(newElement)
            break;
        case 'addItem':
            myChar.items.push(['',''])
            newElement = document.createElement('div')
            newElement.innerHTML = `
                <input type="number" placeholder="1"/>
                <input type="text" placeholder="Backpack"/>`
            charItems.appendChild(newElement)
            break;
        case 'addTracker':
            myChar.trackers.push(['','',''])
            newElement = document.createElement('div')
            newElement.innerHTML = `
                <input type="text" placeholder="Daily Use"/>
                <input class="changing" type="number" placeholder="1"/>
                <span>/</span>
                <input type="number" placeholder="1"/>`
            newElement.querySelector('input[type=number]').addEventListener('change',autoUpdate)
            charTrackers.appendChild(newElement)
            break;
        case 'addFeature':
            myChar.features.push(['','',''])
            newElement = document.createElement('div')
            newElement.innerHTML = `
                <input type="text" placeholder="Feature">
                <input type="text" class="featSource" placeholder="Source">
                <textarea rows="4" placeholder="Description"></textarea>`
            charFeatures.appendChild(newElement)
            break;
        case 'addNote':
            myChar.notes.push([''])
            newElement = document.createElement('textarea')
            newElement.rows = 4
            newElement.placeholder = "Rocks fell..."
            charNotes.appendChild(newElement)
            break;
        case 'addCantrip':
            myChar.spells['Cantrips'].push(['',''])
            newElement = document.createElement('div')
            newElement.innerHTML = `
                <input type="text" placeholder="Spell"/>
                <textarea placeholder="Description"></textarea>`
            charSpell0.appendChild(newElement)
            break;
        default:
            console.log('How the fuck?')
    }
    // console.log(myChar)
}

function addSpell() {
    let wrapper = event.target.previousElementSibling
    let newElement = document.createElement('div')
    newElement.innerHTML = `
        <input class="changing" type="checkbox"/>
        <input type="text" placeholder="Spell">
        <textarea placeholder="Description"></textarea>`
    wrapper.appendChild(newElement)
}

function autoUpdate() {
    let t = event.target.id || ''
    // inspiration .. inp check
    if(event.target.id=='inspiration') {myChar.inspiration = event.target.checked}
    // hp current .. inp num
    if(event.target.id=='hpCurrent') {myChar.healthCurrent = event.target.value}
    // hp temp .. inp num
    if(event.target.id=='hpTemp') {myChar.healthTemp = event.target.value}
    // hit dice current (will need to add EL's in grabLocal) .. inp num
    if(event.target.parentElement.parentElement.id == 'hitDiceWrapper') {
        let thisHitDie = event.target.parentElement
        let thisIndex = [...thisHitDie.parentElement.querySelectorAll('div')].indexOf(thisHitDie)
        myChar.hitDie[thisIndex][0] = event.target.value
    }
    // all death saves .. inp check
    if(t[0]=='p') {myChar.deathSaves[0][+t[1]] = event.target.checked}
    else if(t[0]=='f') {myChar.deathSaves[1][+t[1]] = event.target.checked}
    // money .. inp num
    if(t=='PP') {myChar.money[0] = event.target.value}
    else if(t=='GP') {myChar.money[1] = event.target.value}
    else if(t=='EP') {myChar.money[2] = event.target.value}
    else if(t=='SP') {myChar.money[3] = event.target.value}
    else if(t=='CP') {myChar.money[4] = event.target.value}
    // trackers current-uses (will need to add EL's in grabLocal) .. inp num
    if(event.target.parentElement.parentElement.id == 'trackers') {
        let thisTracker = event.target.parentElement
        let thisIndex = [...thisTracker.parentElement.querySelectorAll('div')].indexOf(thisTracker)
        myChar.trackers[thisIndex][1] = event.target.value
    }
    // spell slots current .. inp num
    if(t.slice(0,2)=='ss') {
        switch (t.slice(-1)) {
            case '1':
                myChar.spellslots['Level_1'][0] = event.target.value
                break;
            case '2':
                myChar.spellslots['Level_2'][0] = event.target.value
                break;
            case '3':
                myChar.spellslots['Level_3'][0] = event.target.value
                break;
            case '4':
                myChar.spellslots['Level_4'][0] = event.target.value
                break;
            case '5':
                myChar.spellslots['Level_5'][0] = event.target.value
                break;
            case '6':
                myChar.spellslots['Level_6'][0] = event.target.value
                break;
            case '7':
                myChar.spellslots['Level_7'][0] = event.target.value
                break;
            case '8':
                myChar.spellslots['Level_8'][0] = event.target.value
                break;
            case '9':
                myChar.spellslots['Level_9'][0] = event.target.value
                break;
            default:
                console.log('HOW?!')
        }
    }
}

function importData() {
    // console.log('importing')
    let importedData = {}
    const file = event.target.files[0]
    if (file && file.type==='application/json') {
        const reader = new FileReader()
        reader.onload = function(e) {
            try {
                importedData = JSON.parse(e.target.result)
                // console.log('Data loaded: ', importedData)
                myChar = importedData
                localStorage.setItem('character',JSON.stringify(myChar))
                grabLocal()
            } catch {
                alert('There was an error parsing the file as JSON!')
            }
        }
        reader.readAsText(file)
    } else {
        alert('Please upload a valid JSON file.')
    }
}

function exportData() {
    // console.log('exporting')
    const myCharExport = JSON.stringify(myChar, null, 1)
    const blob = new Blob([myCharExport], { type: 'application/json' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${myChar.name || 'unknown_char'}.json`
    link.click()
}

/////////////////////////////////////////////////

grabLocal()