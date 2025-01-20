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
        this.weapons = [] // array of strings of weapon names, tho mainly simple / martial
        this.armor = []
        this.tools = []
        this.languages = []
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
