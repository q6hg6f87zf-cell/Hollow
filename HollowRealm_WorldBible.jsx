import {useState} from ‘react’;

const NAMES = [“Bubbles”,“Wiggles”,“Dottie”,“Fern”,“Pippa”,“Coco”,“Boo”,“Thistle”,“Mochi”,“Remy”,“Pebble”,“Snoot”,“Clover”,“Noodle”,“Zazu”,“Binky”,“Tangle”,“Marshy”,“Grim”,“Wick”,“Wren”,“Fizz”,“Dusk”,“Vex”,“Rue”,“Hollow”,“Sable”,“Thorn”,“Cinder”,“Ash”];
const ORIGINS = [“The Dark Enchanted Forest”,“The Crumbling Kingdom”,“The Underground Caverns”,“The Hollow’s Edge”,“The Sunken Library”];
const CLASSES = [“Warrior”,“Wizard”,“Rogue”,“Healer”,“Merchant”,“Bard”];
const CLASS_HP = {Warrior:12,Wizard:7,Rogue:8,Healer:9,Merchant:8,Bard:8};
const CLASS_ICON = {Warrior:“⚔️”,Wizard:“🔮”,Rogue:“🗡️”,Healer:“💚”,Merchant:“💰”,Bard:“🎵”};

const TRAIT_TIERS = [
{range:[1,4],  level:“⚠ Weakened”,   color:”#f44336”},
{range:[5,9],  level:“✓ Standard”,   color:”#81c784”},
{range:[10,14],level:“★ Strong”,     color:”#64b5f6”},
{range:[15,19],level:“✦ Exceptional”,color:”#ffb300”},
{range:[20,20],level:“⚡ LEGENDARY”, color:”#ce93d8”},
];

const REP = {
Warrior:[
{r:[1,1],  title:“The Broken Shield”,     passive:”-1 first combat roll/session. Allies gain +1 DEF nearby.”},
{r:[2,2],  title:“The Deserter”,          passive:“Cannot call authority backup. Rogue contacts available.”},
{r:[3,3],  title:“The Cursed Blade”,      passive:“First weapon roll/arc disadvantage. Crits deal +2.”},
{r:[4,4],  title:“The Unfinished War”,    passive:”+1 intimidation. -1 social rolls outside combat.”},
{r:[5,7],  title:“The Steadfast”,         passive:“Allies nearby cannot be cursed without rolling first.”},
{r:[8,9],  title:“The Iron Wall”,         passive:”+1 DEF rolls when protecting another player.”},
{r:[10,11],title:“The Oathkeeper”,        passive:“Declare an oath once/session. If fulfilled, +2 to next 3 rolls.”},
{r:[12,13],title:“The Last Line”,         passive:”+2 combat rolls at 3 HP or below.”},
{r:[14,14],title:“The Hollow’s Bulwark”,  passive:“Immune to first curse each arc.”},
{r:[15,16],title:“The Undying”,           passive:“If dying, roll d20. 10+ = survive at 1 HP (once/arc).”},
{r:[17,18],title:“The Warlord of Ash”,    passive:“Can command allies. 15+ action roll lands as bonus.”},
{r:[19,19],title:“The Unkillable”,        passive:”+1 all combat. Hostiles must roll to approach.”},
{r:[20,20],title:“THE HOLLOW’S CHAMPION”, passive:“Once/arc, call on The Hollow to re-roll any result.”},
],
Wizard:[
{r:[1,1],  title:“The Silenced”,          passive:“First spell/session: d6, on 1 the effect reverses.”},
{r:[2,2],  title:“The Forbidden Scholar”, passive:”+2 INT, -1 WIS. Access to forbidden rolls.”},
{r:[3,3],  title:“The Unstable”,          passive:“On fumble, spell affects an additional random target.”},
{r:[4,4],  title:“The Once-Great”,        passive:”-1 spell rolls but +2 in their research era.”},
{r:[5,7],  title:“The Theorist”,          passive:”+1 puzzle-solving and knowledge rolls.”},
{r:[8,9],  title:“The Practical Caster”,  passive:“Cast minor spells without full action once/session.”},
{r:[10,11],title:“The Arcanist”,          passive:”+1 all INT. Arcane locks respond to them.”},
{r:[12,13],title:“The Seeker”,            passive:“Once/session, ask DM one yes/no about current arc.”},
{r:[14,14],title:“The Hollow’s Eye”,      passive:”+2 detecting illusions, hidden passages, deception.”},
{r:[15,16],title:“The Void Speaker”,      passive:“Once/arc, attempt communication with non-speaking entity.”},
{r:[17,18],title:“The Architect of Ruin”, passive:”+2 area-effect and destructive spell rolls.”},
{r:[19,19],title:“The Worldbreaker”,      passive:”+2 all spells. Average-INT enemies flee on fumble.”},
{r:[20,20],title:“THE HOLLOW’S ORACLE”,   passive:“Once/arc, DM must give one piece of true hidden lore.”},
],
Rogue:[
{r:[1,1],  title:“The Marked”,              passive:“Once/session an NPC may attempt to claim bounty.”},
{r:[2,2],  title:“The Burned Informant”,    passive:”-1 trust rolls. +1 solo infiltration.”},
{r:[3,3],  title:“The Phantom Thief”,       passive:“Cannot trade stolen items openly.”},
{r:[4,4],  title:“The Failed Contract”,     passive:”-1 guild rolls. +1 off-the-books.”},
{r:[5,7],  title:“The Reliable Shadow”,     passive:”+1 stealth and infiltration.”},
{r:[8,9],  title:“The Cutpurse”,            passive:”+1 pickpocket and sleight of hand.”},
{r:[10,11],title:“The Hollow Fox”,          passive:”+2 stealth in natural and dark environments.”},
{r:[12,13],title:“The Ghost Contract”,      passive:“Once/session, complete minor objective off-screen.”},
{r:[14,14],title:“The Hollow’s Whisper”,    passive:“Immune to environmental detection in Hollow locations.”},
{r:[15,16],title:“The Unseen Blade”,        passive:”+2 sneak attack. Critical hits on 19-20.”},
{r:[17,18],title:“The Collector of Secrets”,passive:“Once/arc, reveal a secret about a named NPC.”},
{r:[19,19],title:“The Sovereign of Shadows”,passive:”+2 covert rolls. One favour from underground/arc.”},
{r:[20,20],title:“THE HOLLOW’S PHANTOM”,    passive:“Once/arc, any action they take is undetectable.”},
],
Healer:[
{r:[1,1],  title:“The One Who Couldn’t”,    passive:”-1 first heal/session. Success despite this = +2 next.”},
{r:[2,2],  title:“The Cursed Hands”,        passive:“On fumble healing, target briefly cursed instead.”},
{r:[3,3],  title:“The Heretic Mender”,      passive:”+1 non-standard injuries. -1 in holy locations.”},
{r:[4,4],  title:“The Plague Memory”,       passive:”+2 disease knowledge. Some NPCs won’t be touched.”},
{r:[5,7],  title:“The Mender”,              passive:”+1 all healing rolls.”},
{r:[8,9],  title:“The Field Surgeon”,       passive:“Can stabilise downed characters without full action.”},
{r:[10,11],title:“The Hollow’s Grace”,      passive:”+2 healing in Hollow locations.”},
{r:[12,13],title:“The Keeper of the Fallen”,passive:“Once/arc, prevent death on successful WIS roll 15+.”},
{r:[14,14],title:“The Truthseer”,           passive:”+2 detecting NPC deception or hidden agendas.”},
{r:[15,16],title:“The Miracle Worker”,      passive:“Once/session, re-roll a failed healing roll free.”},
{r:[17,18],title:“The Soul Weaver”,         passive:”+2 WIS. Can attempt to lift curses without Major gift.”},
{r:[19,19],title:“The Hollow’s Mercy”,      passive:“Immune to attacks while actively healing.”},
{r:[20,20],title:“THE HOLLOW’S SAINT”,      passive:“Once/arc, revive deceased player with WIS roll (no coins).”},
],
Merchant:[
{r:[1,1],  title:“The Debtor”,              passive:“Once/arc a creditor NPC appears. Roll CHA.”},
{r:[2,2],  title:“The Counterfeiter”,       passive:”+1 black market. -1 legitimate trading.”},
{r:[3,3],  title:“The Failed Caravan”,      passive:”-1 organised trade. +1 operating solo.”},
{r:[4,4],  title:“The Swindled”,            passive:”+1 negotiation from disadvantage.”},
{r:[5,7],  title:“The Reliable Trader”,     passive:”+1 trade and negotiation.”},
{r:[8,9],  title:“The Appraiser”,           passive:“Identify any item’s base value without a roll.”},
{r:[10,11],title:“The Hollow Broker”,       passive:“Once/session, locate specific rare item via contacts.”},
{r:[12,13],title:“The Networker”,           passive:“Once/arc, introduce a neutral NPC in any location.”},
{r:[14,14],title:“The Price of Everything”, passive:”+2 info-gathering. Knowledge available — for a price.”},
{r:[15,16],title:“The Hollow’s Broker”,     passive:“Once/arc, initiate trade between two hostile factions.”},
{r:[17,18],title:“The Monopolist”,          passive:“Controls one named resource in current arc.”},
{r:[19,19],title:“The Unseen Hand”,         passive:”+2 CHA and LCK. One major faction owes a favour.”},
{r:[20,20],title:“THE HOLLOW’S EXCHANGE”,   passive:“Once/arc, set the price of any transaction in the story.”},
],
Bard:[
{r:[1,1],  title:“The Silenced Song”,       passive:“Cannot perform in official locations without Major roll.”},
{r:[2,2],  title:“The Liar’s Ballad”,       passive:”-1 honesty persuasion. +2 misdirection.”},
{r:[3,3],  title:“The Heartbreaker”,        passive:“High CHA rolls have 1-in-6 chance of unintended side effect.”},
{r:[4,4],  title:“The Forgotten Prodigy”,   passive:”-1 large crowds. +2 performing to one person.”},
{r:[5,7],  title:“The Travelling Voice”,    passive:”+1 all CHA rolls.”},
{r:[8,9],  title:“The Court Favourite”,     passive:”+1 persuasion in formal settings.”},
{r:[10,11],title:“The Hollow’s Voice”,      passive:”+2 performance in Hollow. Dark entities calmed.”},
{r:[12,13],title:“The Chronicler”,          passive:“Once/arc, recall precise detail from any past session.”},
{r:[14,14],title:“The Mood of the Room”,    passive:”+2 NPC mood assessment and manipulation.”},
{r:[15,16],title:“The Legend Maker”,        passive:“Once/arc, give another player a reputation boost.”},
{r:[17,18],title:“The Hollow’s Witness”,    passive:”+2 WIS and CHA. Access restricted lore once/arc.”},
{r:[19,19],title:“The Architect of Stories”,passive:”+2 CHA. A story they tell becomes permanent world lore.”},
{r:[20,20],title:“THE HOLLOW’S MEMORY”,     passive:“Once/arc, rewrite one consequence of any roll as narrated.”},
],
};

const WEAPONS = {
Warrior:[
{r:[1,4],  rarity:“Battered”,  name:“Cracked Garrison Sword”,     special:“None.”},
{r:[5,9],  rarity:“Standard”,  name:“Garrison Longsword”,          special:“None.”},
{r:[10,14],rarity:“Fine”,      name:“Tempered Hollow Steel Blade”, special:”+1 combat in underground or dark locations.”},
{r:[15,19],rarity:“Rare”,      name:“The Shieldbreaker”,           special:“Ignores 1 point of enemy DEF on a successful hit.”},
{r:[20,20],rarity:“LEGENDARY”, name:”[Named with player]”,         special:“One unique property. Permanent. Never duplicated.”},
],
Wizard:[
{r:[1,4],  rarity:“Battered”,  name:“Cracked Focus Crystal”,       special:“None.”},
{r:[5,9],  rarity:“Standard”,  name:“Scholar’s Focus Rod”,          special:“None.”},
{r:[10,14],rarity:“Fine”,      name:“Hollow-Tuned Grimoire”,        special:”+1 spell rolls underground or near The Edge.”},
{r:[15,19],rarity:“Rare”,      name:“The Resonance Staff”,          special:”+1 offensive spells. Dark entities treat as higher threat.”},
{r:[20,20],rarity:“LEGENDARY”, name:”[Named with player]”,          special:“One unique arcane property. Permanent. Never duplicated.”},
],
Rogue:[
{r:[1,4],  rarity:“Battered”,  name:“Worn Shortsword”,             special:“None.”},
{r:[5,9],  rarity:“Standard”,  name:“Balanced Daggers (pair)”,      special:“None.”},
{r:[10,14],rarity:“Fine”,      name:“Hollow-Edged Stiletto”,        special:”+1 attack rolls from stealth.”},
{r:[15,19],rarity:“Rare”,      name:“The Silencer”,                 special:“Actions with this weapon cannot be heard by NPCs.”},
{r:[20,20],rarity:“LEGENDARY”, name:”[Named with player]”,          special:“One unique covert property. Permanent. Never duplicated.”},
],
Healer:[
{r:[1,4],  rarity:“Battered”,  name:“Worn Herb Satchel”,           special:“None.”},
{r:[5,9],  rarity:“Standard”,  name:“Mender’s Kit & Staff”,         special:“None.”},
{r:[10,14],rarity:“Fine”,      name:“Hollow Root Salves”,           special:”+1 healing on Hollow-curse related injuries.”},
{r:[15,19],rarity:“Rare”,      name:“The Binding Lantern”,          special:“Reveals NPC hidden status effects once per session.”},
{r:[20,20],rarity:“LEGENDARY”, name:”[Named with player]”,          special:“One unique restorative property. Permanent. Never duplicated.”},
],
Merchant:[
{r:[1,4],  rarity:“Battered”,  name:“Rusty Counting Scales”,       special:“None.”},
{r:[5,9],  rarity:“Standard”,  name:“Merchant’s Pack & Ledger”,     special:“None.”},
{r:[10,14],rarity:“Fine”,      name:“Hollow Market Satchel”,        special:“Items inside unidentifiable without owner’s consent.”},
{r:[15,19],rarity:“Rare”,      name:“The Gilded Tongue”,            special:“Once/arc, guarantee safe passage or neutralise one hostile NPC.”},
{r:[20,20],rarity:“LEGENDARY”, name:”[Named with player]”,          special:“One unique economic property. Permanent. Never duplicated.”},
],
Bard:[
{r:[1,4],  rarity:“Battered”,  name:“Cracked Lute”,                special:“None.”},
{r:[5,9],  rarity:“Standard”,  name:“Travelling Instrument”,        special:“None.”},
{r:[10,14],rarity:“Fine”,      name:“Hollow-Carved Instrument”,     special:”+1 performance in Hollow. Heard by things that shouldn’t hear.”},
{r:[15,19],rarity:“Rare”,      name:“The Resonance Chord”,          special:“Once/session, NPC mood change auto-succeeds.”},
{r:[20,20],rarity:“LEGENDARY”, name:”[Named with player]”,          special:“One unique performance property. Permanent. Never duplicated.”},
],
};

function getRep(cls,roll){return REP[cls]?.find(r=>roll>=r.r[0]&&roll<=r.r[1]);}
function d20(){return Math.floor(Math.random()*20)+1;}
const RARITY_COLOR={Battered:”#888”,Standard:”#bbb”,Fine:”#81c784”,Rare:”#64b5f6”,LEGENDARY:”#ce93d8”};

const CHARACTER_LORE = {
Warrior:{
icon:“⚔️”, title:“Warrior / Knight”, hp:12,
tagline:“The last thing standing between the Hollow and everyone else.”,
color:”#ef5350”, glowColor:“rgba(239,83,80,0.15)”,
origin:`Warriors don't choose the sword — the sword finds them in their worst moment. Most came from somewhere else: a collapsed garrison, a war that ended without them, a vow made over someone else's grave. They arrived in the Hollow already scarred, already tested.\n\nThe Hollow respects violence that has a purpose. Warriors who carry guilt often find the Realm gives them exactly the opponent they need to face it.`,
strengths:[“Highest HP in the Realm — built to absorb punishment”,“Shield Block Gift Power — intercept damage meant for any ally”,“Critical hits deal bonus damage”,”+2 combat rolls when nearly dead (3 HP or below)”,“Strong intimidation — enemies sometimes hesitate”],
weaknesses:[“Lowest social grace — NPCs outside combat are wary”,“Carries the weight of past failures”,“Cannot easily disappear — too visible, too present”,“Dependent on allies to unlock defensive passives”],
abilities:[
{name:“Shield Block”,type:“Gift Power (5,000 coins)”,desc:“Intercept any damage roll targeting a named ally. The hit lands on the Warrior instead. Once/session.”},
{name:“Oathbound”,type:“Passive (title-dependent)”,desc:“Declare an oath at session start. If fulfilled before session ends, +2 to next 3 rolls.”},
{name:“Iron Stance”,type:“Passive”,desc:”+2 combat rolls when HP is at 3 or below. The closer to death, the more dangerous.”},
{name:“Bulwark Aura”,type:“Passive”,desc:“Allies near the Warrior cannot be cursed without first rolling to resist.”},
{name:“Survive the Fall”,type:“Title ability (The Undying)”,desc:“When a killing blow would land, roll d20. On 10+, survive at 1 HP. Once/arc.”},
],
allies:[{name:“Healers”,rel:“Natural bond — the Warrior takes the hit, the Healer undoes it.”},{name:“Bards”,rel:“The Bard turns the Warrior’s suffering into legend.”},{name:“Merchants”,rel:“Mercenary arrangements. Clean. Mutual.”}],
enemies:[{name:“Rogues”,rel:“Warriors can’t catch what they can’t see. Old rivalry.”},{name:“Unstable Wizards”,rel:“Collateral damage follows them. Warriors resent being in the blast radius.”},{name:“The Hollow’s Darkness”,rel:“The Hollow tests Warriors specifically.”}],
lore:`In the Crumbling Kingdom's records, Warriors appear in every account of catastrophe — always at the point where things stopped getting worse. Not always the victors. Often just the ones still standing.\n\nThree confirmed cases of Warriors returning from death have been documented. The Hollow has not explained why.`,
famousFor:[“Being the last one still standing”,“Absorbing consequences meant for others”,“Making the Hollow flinch”],
},
Wizard:{
icon:“🔮”, title:“Wizard / Spellcaster”, hp:7,
tagline:“The Hollow answers questions nobody else was brave enough to ask.”,
color:”#7c4dff”, glowColor:“rgba(124,77,255,0.15)”,
origin:`Magic in the Hollow Realm is not a skill — it's a conversation. Wizards are the ones having it. Some were trained in places that no longer exist. Some found their power in accidents that scarred them. Some asked something of a forbidden text and it answered back.\n\nThe Hollow recognises them. There's a quality to the air around a Wizard who has spent real time here — like the darkness is paying attention.`,
strengths:[“Highest INT — knowledge rolls, puzzle solving, arcane detection”,“Arcane Surge doubles the effect of their next roll”,“Area spells hit multiple targets”,“Can communicate with entities others cannot perceive”,“Access to forbidden knowledge through specific titles”],
weaknesses:[“Lowest HP — one bad fight ends them”,“Unstable casters risk reversing their own effects on fumbles”,“Forbidden knowledge comes with NPC distrust”,“Their power makes them targets”],
abilities:[
{name:“Arcane Surge”,type:“Gift Power (5,000 coins)”,desc:“Double the mechanical effect of the Wizard’s next dice roll. Once/session.”},
{name:“The Hollow’s Eye”,type:“Title ability”,desc:”+2 to detecting illusions, hidden passages, and NPC deception.”},
{name:“Void Speaking”,type:“Title ability (Void Speaker)”,desc:“Attempt communication with a non-speaking entity. Once/arc.”},
{name:“Forbidden Pull”,type:“Passive (Forbidden Scholar)”,desc:”+2 INT, -1 WIS permanently. Access to rolls others cannot attempt.”},
{name:“True Lore”,type:“Title ability (The Oracle)”,desc:“Once/arc, the DM must reveal one piece of genuine hidden world lore.”},
],
allies:[{name:“Rogues”,rel:“Share an interest in things not meant to be found.”},{name:“Bards”,rel:“The Chronicler and the Wizard often share notes.”},{name:“Healers”,rel:“Complementary. The Wizard diagnoses the impossible — the Healer fixes it.”}],
enemies:[{name:“Warriors (wary)”,rel:“Warriors don’t trust power they can’t parry.”},{name:“Merchants (rival)”,rel:“Both trade in rare things. They compete.”},{name:“Institutions”,rel:“Orders, academies, holy sites — all have something the Wizard studied without permission.”}],
lore:`The Sunken Library is believed to have been a Wizard's construction. Nobody has confirmed this because the Wizards who know won't say.\n\nWizards with the Oracle title have each described the same vision independently: a chamber at the centre of the Hollow with no doors, a single light source, and something that has been waiting.`,
famousFor:[“Knowing things they shouldn’t”,“Surviving on intelligence alone”,“Making the impossible technically explainable”],
},
Rogue:{
icon:“🗡️”, title:“Rogue / Trickster”, hp:8,
tagline:“If you saw them coming, they wanted you to.”,
color:”#26c6da”, glowColor:“rgba(38,198,218,0.15)”,
origin:`Rogues exist in the space between things — between factions, between identities, between what happened and what anyone can prove. They arrived in the Hollow via routes that don't appear on any map, for reasons they rarely share in full.\n\nThe Hollow suits them. The darkness is navigable if you know how to move through it quietly.`,
strengths:[“Highest speed — fastest movement and initiative”,“Shadow Step Gift Power — avoid one consequence entirely”,“Critical hits on 19–20 with the right title”,“Immune to environmental detection in Hollow locations”,“Can complete minor objectives off-screen”],
weaknesses:[“Trust is their most fragile resource — broken once, rarely rebuilt”,“Guild standing degrades with certain rolls”,“Operates better alone”,“Stolen items create lasting problems”],
abilities:[
{name:“Shadow Step”,type:“Gift Power (5,000 coins)”,desc:“Avoid one consequence completely. No dice. No resistance. Once/session.”},
{name:“Hollow Immunity”,type:“Passive (title-dependent)”,desc:“Environmental detection rolls against this character automatically fail in Hollow locations.”},
{name:“Ghost Work”,type:“Title ability (Ghost Contract)”,desc:“Once/session, declare a minor objective completed off-screen. No roll. No witnesses.”},
{name:“Critical Edge”,type:“Title ability (Unseen Blade)”,desc:“Critical hits on rolls of 19 or 20. Sneak attack bonus +2.”},
{name:“Underground Network”,type:“Title ability (Sovereign)”,desc:“Once/arc, call in a favour from the criminal underground.”},
],
allies:[{name:“Wizards”,rel:“Both find things not meant to be found. They respect each other’s methods.”},{name:“Merchants”,rel:“The black market runs on both of them.”},{name:“Bards”,rel:“The Bard covers for them. The Rogue gets the Bard out of trouble later.”}],
enemies:[{name:“Warriors”,rel:“Warriors want accountability. Rogues find that inconvenient.”},{name:“Healers (Truthseer)”,rel:“A Healer who detects deception is professionally threatening.”},{name:“Former employers”,rel:“Every burned contract is a permanent enemy.”}],
lore:`The Underground Caverns were mapped by a Rogue whose name doesn't appear in any official record. The map exists. The cartographer took payment in something other than coin.\n\nRogues with the Phantom title have never been confirmed dead. Three have been declared dead by factions with strong motivation to believe it. All three continued operating afterward.`,
famousFor:[“Being somewhere they shouldn’t be”,“Solving problems no one admits need solving”,“Knowing when to disappear”],
},
Healer:{
icon:“💚”, title:“Healer / Support”, hp:9,
tagline:“They’ve seen the worst the Hollow can do. They came back anyway.”,
color:”#66bb6a”, glowColor:“rgba(102,187,106,0.15)”,
origin:`Healers carry something others don't: the memory of every person they couldn't save alongside everyone they could. The Hollow has a tendency to test this. It sends them the impossible case — the person who should be dead, the wound that doesn't respond, the curse the textbooks say is permanent.\n\nSome Healers came here following something. A patient who wandered in. An illness that shouldn't exist.`,
strengths:[“Only class that can prevent death mid-session without a gift”,“Miracle Touch Gift Power revives downed players to 1 HP”,“Can stabilise characters without a full action roll”,“Truthseer title: +2 detecting NPC deception”,“Soul Weaver title: attempt curse removal without Major gift”],
weaknesses:[“Not a combat class — caught alone, they’re vulnerable”,“Certain titles carry curses that transfer through their hands”,“Some communities will never fully trust a complicated past”,“The Hollow tests them hardest”],
abilities:[
{name:“Miracle Touch”,type:“Gift Power (5,000 coins)”,desc:“Restore any downed character to 1 HP. No roll required. Once/session.”},
{name:“Field Stabilise”,type:“Passive (Field Surgeon)”,desc:“Stabilise a dying character without a full action roll.”},
{name:“Truthsight”,type:“Passive (Truthseer title)”,desc:”+2 to detect NPC deception and hidden agendas.”},
{name:“Death Prevention”,type:“Title ability (Keeper of the Fallen)”,desc:“Once/arc, prevent a character death with WIS roll 15+. No coins.”},
{name:“Soul Weave”,type:“Title ability (Soul Weaver)”,desc:“Attempt to lift a curse without requiring a Major gift. Still requires a roll.”},
],
allies:[{name:“Warriors”,rel:“The Warrior gets hit so the Healer can fix it. It’s a system.”},{name:“Bards”,rel:“Shared emotional intelligence. They read the room together.”},{name:“Everyone”,rel:“There is no faction in the Hollow that doesn’t want a Healer alive.”}],
enemies:[{name:“The Hollow itself”,rel:“It sends them impossible cases specifically.”},{name:“Death-aligned entities”,rel:“Some things don’t like being undone.”},{name:“The Cursed Hands complication”,rel:“Complicates every clinical relationship.”}],
lore:`Every documented resurrection in the Hollow Realm involved a Healer being present, even in cases where the Healer claims they did nothing.\n\nThe Hollow's Saint title has existed once in recorded history. The circumstances are sealed in the Sunken Library under a section that opens only for the Healer who earned it.`,
famousFor:[“Showing up when everyone else has given up”,“Making the Hollow’s worst moments survivable”,“Being the reason characters come back”],
},
Merchant:{
icon:“💰”, title:“Merchant / Crafter”, hp:8,
tagline:“Everything has a price. They’re the one who set it.”,
color:”#ffd54f”, glowColor:“rgba(255,213,79,0.15)”,
origin:`Merchants arrived in the Hollow Realm because opportunity did. The Realm is full of things people desperately need — information, rare components, safe passage, items from places that no longer exist. Someone has to move those things.\n\nThe most successful Merchants understood early that currency here isn't always coin. Information, favours, access, silence — these trade at higher values than gold in most locations.`,
strengths:[“Highest combined CHA + LCK”,“Black Market Gift Power enables mid-session item acquisition”,“Can identify any item’s value instantly”,“Controls named resources within the arc”,“Can introduce neutral NPC contacts anywhere”],
weaknesses:[“Not a combat class — power is social and economic”,“Debt and creditor complications follow certain titles”,“Powerful factions treat them as a resource to control”,“Their value makes them targets”],
abilities:[
{name:“Black Market”,type:“Gift Power (5,000 coins)”,desc:“Acquire a specific special item mid-session. Once/session.”},
{name:“Instant Appraisal”,type:“Passive (Appraiser)”,desc:“Identify exact base value of any item without a roll.”},
{name:“Contact Network”,type:“Title ability (Networker)”,desc:“Once/arc, introduce a neutral NPC contact in any location.”},
{name:“Resource Control”,type:“Title ability (Monopolist)”,desc:“Control one named resource within the current arc.”},
{name:“Impossible Deal”,type:“Title ability (Hollow’s Broker)”,desc:“Once/arc, initiate trade between two parties who would not normally agree.”},
],
allies:[{name:“Rogues”,rel:“The black market runs on both of them.”},{name:“Bards”,rel:“Information economy. The Bard hears things. The Merchant monetises them.”},{name:“Anyone with a need”,rel:“The Merchant’s ally list is as long as their outstanding invoices.”}],
enemies:[{name:“Wizards”,rel:“Both deal in rare things. They compete for the same clientele.”},{name:“Creditor NPCs”,rel:“Certain titles create recurring antagonists.”},{name:“Factions played both sides for”,rel:“Eventually the ledger comes due.”}],
lore:`The most expensive transaction ever recorded in the Hollow Realm was facilitated by a Merchant. What was traded is not documented. Both parties declared themselves satisfied.\n\nMerchants with the Unseen Hand title have been credited — and blamed — for no fewer than six major faction shifts in the Hollow's recent history.`,
famousFor:[“Having what you need exactly when you need it”,“Knowing the price of things that shouldn’t be for sale”,“Being everyone’s second call and nobody’s enemy”],
},
Bard:{
icon:“🎵”, title:“Bard / Performer”, hp:8,
tagline:“The Hollow Realm exists in stories because of them.”,
color:”#ff7043”, glowColor:“rgba(255,112,67,0.15)”,
origin:`Bards came to the Hollow Realm to document it. Or to escape something. Or because a performance went wrong and this was the only direction left to run. The reasons are always interesting — which is fitting, because the Bard is the one who will eventually turn everyone else's reason for being here into something worth telling.\n\nThe Hollow behaves differently when it knows it's being watched. And Bards are always watching.`,
strengths:[“Highest CHA — social, manipulation, persuasion rolls”,“Encore Gift Power re-rolls any failed roll for anyone”,“Dark entities calmed by Bard performance in Hollow locations”,“Once/arc can permanently add to world lore”,“Can recall precise details from any past session”],
weaknesses:[“Performance in official locations blocked for certain titles”,“High CHA rolls occasionally have unintended NPC side effects”,“Documentation creates accountability”,“Truth-seekers distrust fabricating Bards”],
abilities:[
{name:“Encore”,type:“Gift Power (5,000 coins)”,desc:“Re-roll any failed dice roll for any player. Once/session.”},
{name:“Hollow Calming”,type:“Passive”,desc:“Dark entities respond differently to Bard performances. Aggression lowers.”},
{name:“Perfect Recall”,type:“Title ability (Chronicler)”,desc:“Once/arc, recall a precise accurate detail from any previous session.”},
{name:“Mood Reading”,type:“Passive (Mood of the Room)”,desc:”+2 to NPC mood assessment and social manipulation.”},
{name:“Permanent Legend”,type:“Title ability (Architect of Stories)”,desc:“Once/arc, a story told becomes permanent world lore.”},
],
allies:[{name:“Everyone — eventually”,rel:“Bards make everyone look better in the retelling.”},{name:“Rogues”,rel:“The Bard provides cover. The Rogue handles work nobody wants credited.”},{name:“Healers”,rel:“Shared emotional range. They understand each other’s relationship with loss.”}],
enemies:[{name:“Truth-seekers”,rel:“A Bard with fabrication history and a Healer who detects lies are incompatible.”},{name:“Noble establishments”,rel:“Banned performers carry that ban everywhere.”},{name:“Anyone they’ve made famous”,rel:“Some legends would rather not be.”}],
lore:`The Hollow Realm's Memory title has been held once. That Bard's work is why any coherent historical record of the early Hollow exists.\n\nBards with the Hollow's Voice title report their music sounds different to them inside the Realm. When asked what it sounds like, they say: like something answering.`,
famousFor:[“Turning other people’s worst moments into their best stories”,“Being in the room when everything changed”,“Making the Hollow feel like it has a history worth having”],
},
};

// ═══════════════════════════════════════════════════
// WEAPON BIBLE
// ═══════════════════════════════════════════════════

const WEAPON_BIBLE_RARITY = {
Battered: {color:”#888”,  bg:“rgba(40,40,40,0.8)”,  label:“Battered”,  tier:1},
Standard: {color:”#bbb”,  bg:“rgba(50,50,60,0.8)”,  label:“Standard”,  tier:2},
Fine:     {color:”#66bb6a”,bg:“rgba(10,40,15,0.8)”, label:“Fine”,      tier:3},
Rare:     {color:”#4fc3f7”,bg:“rgba(5,30,50,0.8)”,  label:“Rare”,      tier:4},
Legendary:{color:”#ffd54f”,bg:“rgba(40,30,5,0.8)”,  label:“Legendary”, tier:5},
Mythic:   {color:”#ce93d8”,bg:“rgba(30,5,50,0.8)”,  label:“Mythic”,    tier:6},
};

const WEAPON_BIBLE = {
Warrior:[
{rarity:“Battered”, name:“Cracked Garrison Sword”,type:“Longsword”,origin:“Crumbling Kingdom — decommissioned military issue”,history:“Mass-produced for the Kingdom’s standing army. The cracks are a record — every fracture marks a blow that should have broken it and didn’t. Soldiers who carry cracked blades don’t replace them. They name them.”,mechanics:“No bonus.”,special:“None.”,lore:“The garrison forges were destroyed in the same collapse that created the first wave of refugees into the Hollow.”},
{rarity:“Standard”, name:“Garrison Longsword”,type:“Longsword”,origin:“Crumbling Kingdom — active military issue”,history:“Standard issue for Kingdom officers. Properly tempered, properly balanced. Designed to last a career. An intact example in good condition means someone cared enough to maintain it.”,mechanics:“No bonus. Reliable and consistent.”,special:“None.”,lore:“An intact Garrison Longsword is a minor status symbol among Kingdom remnants.”},
{rarity:“Fine”, name:“Tempered Hollow Steel Blade”,type:“Longsword”,origin:“Underground Caverns — forged from Hollow ore”,history:“The ore appears in seams that weren’t there on previous expeditions. The Cavern smiths who work it don’t talk about what the ore feels like to handle. The finished blade has a quality fighters describe as present. Like it’s paying attention.”,mechanics:”+1 combat rolls in underground or dark locations.”,special:“Can strike incorporeal entities that standard steel passes through.”,lore:“The Cavern smiths accept specific payment for Hollow Steel. Not coin.”},
{rarity:“Rare”, name:“The Shieldbreaker”,type:“Longsword — modified”,origin:“Unknown — recovered from a battlefield that predates current records”,history:“Nobody knows who made this. The style matches no identified school of smithing. It was recovered from a battlefield that shouldn’t exist, with equipment from multiple eras. The blade itself gave three different dates depending on the method used.”,mechanics:“Ignores 1 point of enemy DEF on every successful hit.”,special:“Against shield-bearing opponents, always treated as attacking from an unexpected angle.”,lore:“Three separate Warriors have claimed The Shieldbreaker in documented history. All three met unusual ends. The blade was found again each time.”},
{rarity:“Legendary”, name:”[Named collaboratively with player]”,type:“Varies”,origin:“Determined with player”,history:“Every Legendary Warrior weapon has a history that belongs entirely to its carrier. What is consistent: they have been used to do something that changed the Hollow. Not promised to. Actually used.”,mechanics:“One unique property, permanent, determined with DM. Never duplicated.”,special:“Known by name throughout the Hollow Realm.”,lore:“The Hollow keeps its own record of Legendary weapons.”},
{rarity:“Mythic”, name:“The Hollow’s Edge”,type:“Beyond classification”,origin:“The Hollow itself — not forged, not found. Arrived.”,history:“Warriors who carry it describe the acquisition differently — some say it was simply there one morning. Some say they reached for something else and found this instead. When a Warrior carries it, threats reassess. Something in the weapon communicates that this particular fight is not worth having.”,mechanics:“Strikes against Hollow entities deal double effect. Cannot be disarmed, destroyed, or lost by any mechanic.”,special:“Once/arc: declare a strike as Final. The target may choose to negotiate instead.”,lore:“Only one Warrior has ever carried The Hollow’s Edge in recorded history. The records are incomplete in ways that seem intentional.”},
],
Wizard:[
{rarity:“Battered”, name:“Cracked Focus Crystal”,type:“Arcane focus”,origin:“Unknown — pre-Hollow, personal item”,history:“A cracked focus doesn’t make it non-functional. It makes the channelling unpredictable in small ways that experienced casters learn to compensate for — and eventually use.”,mechanics:“No bonus. On a fumble, crack occasionally amplifies the backfire.”,special:“None.”,lore:“Crystal growers say a cracked focus remembers the moment it broke.”},
{rarity:“Standard”, name:“Scholar’s Focus Rod”,type:“Arcane focus — rod”,origin:“Sunken Library affiliated production”,history:“The Library maintains a workshop producing these for researchers and practitioners. Not remarkable. Precisely what they need to be: reliable, standardised, easily replaced. The specification hasn’t changed in generations.”,mechanics:“No bonus. Consistent across all spell types.”,special:“Recognised by Library NPCs as indicating academic standing.”,lore:“The Library replaces these for affiliated Wizards at cost.”},
{rarity:“Fine”, name:“Hollow-Tuned Grimoire”,type:“Arcane focus — tome”,origin:“Sunken Library — Hollow-resonant materials”,history:“Made from materials that spent time in the Hollow before processing — paper from trees at the Edge, binding from something that lived in the Caverns. The result is more receptive to Hollow-specific magic. The grimoire also tends to open to relevant pages on its own.”,mechanics:”+1 to spell rolls in Underground Caverns or near The Hollow’s Edge.”,special:“Occasionally provides marginal annotations in handwriting that isn’t the owner’s. The annotations are accurate.”,lore:“The Sunken Library tracks these carefully. They want them returned. They are rarely returned.”},
{rarity:“Rare”, name:“The Resonance Staff”,type:“Arcane focus — staff”,origin:“Pre-Hollow — origin institution destroyed”,history:“The institution that produced it no longer exists. It was commissioned for a specific purpose by a practitioner whose name has been redacted from surviving documents. The staff amplifies offensive spellwork. Dark entities respond to it as a threat even when it isn’t being used.”,mechanics:”+1 to all offensive spells.”,special:“Spells cast through the staff have extended range.”,lore:“The redacted name has been partially reconstructed by three researchers. All three stopped the research after a certain point.”},
{rarity:“Legendary”, name:”[Named collaboratively with player]”,type:“Varies”,origin:“Determined with player”,history:“Legendary Wizard focuses have been used to do something that changed the understanding of magic in the Hollow. Not theoretical. Actual application with actual consequences still being felt.”,mechanics:“One unique arcane property, permanent. Never duplicated.”,special:“Known to the Hollow’s magical entities. Some revere them. Some want them.”,lore:“The Sunken Library maintains a classified record of Legendary arcane objects.”},
{rarity:“Mythic”, name:“The Void Codex”,type:“Tome beyond classification”,origin:“The space between the Hollow and whatever is beyond it”,history:“The Void Codex was not written. Reading it feels like receiving information already in the mind — the Codex simply organises it. Its pages contain spells with no names in any catalogued system. Its index lists spells that do not appear in the book itself, as if reserved for a later edition not yet written.”,mechanics:“All spell rolls at +2. Once/arc: cast a spell from the Codex with no precedent. DM determines effect. It will work. Cost negotiated with the Hollow.”,special:“Cannot be read by anyone other than its current carrier. Others see blank pages.”,lore:“The Sunken Library has requested the Void Codex’s return seventeen times. It has never been returned.”},
],
Rogue:[
{rarity:“Battered”, name:“Worn Shortsword”,type:“Shortsword”,origin:“Unknown — carried in, not acquired here”,history:“Every Rogue who enters the Hollow with one brought it from somewhere else. The wear is personal. This weapon has a history with its owner before the Hollow was ever part of the picture. Familiar weapons don’t surprise you at the wrong moment.”,mechanics:“No bonus.”,special:“None.”,lore:“Rogues who replace their worn shortsword describe a brief adjustment period. The new weapon doesn’t know them yet.”},
{rarity:“Standard”, name:“Balanced Daggers (pair)”,type:“Daggers — paired set”,origin:“Professional equipment — purpose-built”,history:“Owning a matched pair indicates either purchase from a specific supplier or commission for their hands. Investment. Intention. Muscle memory built with one transfers perfectly to the other.”,mechanics:“No bonus. Paired configuration allows one dagger defensive while the other attacks.”,special:“Negates standard penalty for fighting defensively.”,lore:“Balanced dagger sets are a marker in certain professional communities.”},
{rarity:“Fine”, name:“Hollow-Edged Stiletto”,type:“Stiletto — precision blade”,origin:“Underground Caverns — Hollow ore inlay”,history:“Designed for precision work in confined spaces, finding gaps in armour a broader blade couldn’t reach. The Hollow ore inlaid along the cutting edge makes it marginally more effective from concealment. The smiths who produce these don’t advertise. Their clients find them.”,mechanics:”+1 to attack rolls made from stealth or concealment.”,special:“Treats heavily armoured targets as one tier lower for penetration.”,lore:“The Hollow ore responds to intent. Several users report the blade feeling different depending on what they were planning.”},
{rarity:“Rare”, name:“The Silencer”,type:“Blade — classification deliberately vague”,origin:“Unknown — no documented provenance”,history:“There is no documentation because every person who might have provided it decided they hadn’t seen anything. Whatever action is taken with The Silencer, no sound is produced that wasn’t intended. The footstep, the draw, the strike, the contact — silence.”,mechanics:“Any action taken cannot be heard by NPCs not directly targeted.”,special:“Witnesses must roll to accurately describe what they saw. Standard witnesses fail automatically.”,lore:“The Silencer has appeared in criminal records across three documented eras.”},
{rarity:“Legendary”, name:”[Named collaboratively with player]”,type:“Varies”,origin:“Determined with player”,history:“Every Legendary Rogue weapon has done something once that the Hollow registered. Not as an event. As a fact. These weapons don’t just carry history. They carry proof.”,mechanics:“One unique covert property, permanent. Never duplicated.”,special:“Known in professional underground communities by name.”,lore:“The Hollow’s criminal networks keep their own record. More accurate than any official archive.”},
{rarity:“Mythic”, name:“The Last Word”,type:“Beyond classification”,origin:“The space where a contract ends”,history:“The Last Word is not a weapon anyone chooses. It chooses its carrier based on criteria never successfully identified. The previous carrier is always — without exception — no longer alive when the transfer occurs. What it does is simple: it ends things. Not dramatically. With the kind of quiet finality that makes witnesses unsure anything happened at all.”,mechanics:“Once/arc: an action simply succeeds. No roll. No resistance. No witnesses. It happened.”,special:“Cannot be detected by magical or mundane inspection while on the carrier’s person.”,lore:“The Last Word has no origin record because it erases them. This is a theory. The most coherent one available.”},
],
Healer:[
{rarity:“Battered”, name:“Worn Herb Satchel”,type:“Medical kit — field”,origin:“Personal — carried in from previous practice”,history:“A worn herb satchel tells the story of wherever the Healer came from. The stains indicate what’s been stored there and for how long. The repairs indicate what situations it’s been through. This satchel has been used. That’s the point.”,mechanics:“No bonus. Allows standard healing without rolling for material availability.”,special:“None.”,lore:“Experienced Healers can read a herb satchel the way a captain reads weather.”},
{rarity:“Standard”, name:“Mender’s Kit & Staff”,type:“Medical kit with integrated staff focus”,origin:“Healing Order — standard practitioner issue”,history:“The Orders developed the combined kit-and-staff after research concluded practitioners needed a focus for channelled healing as much as physical supplies. Standard issue means consistent quality — not exceptional, but not failing at a critical moment.”,mechanics:“No bonus. Channelled healing adds warmth patients describe as comforting.”,special:“Recognised by Healing Order NPCs as current certification.”,lore:“The Orders track their kits. Most don’t come back.”},
{rarity:“Fine”, name:“Hollow Root Salves”,type:“Medicinal compounds — Hollow-sourced”,origin:“Underground Caverns — transition zone roots”,history:“The plants that grow between the Caverns and the deeper Hollow have adapted to conditions that shouldn’t support growth. Their root chemistry is different. Standard injuries respond like standard salves. Hollow-curse injuries respond as if the salve understands what caused the problem.”,mechanics:”+1 to healing rolls on Hollow-curse or Hollow entity injuries.”,special:“Can identify Hollow-origin injuries on contact — the salve reacts differently.”,lore:“The botanists who collect Hollow Root work in pairs. The rule is not optional.”},
{rarity:“Rare”, name:“The Binding Lantern”,type:“Diagnostic instrument — arcane”,origin:“Sunken Library — medical research division”,history:“Developed to solve a specific problem: Healers couldn’t treat what they couldn’t see. Standard examination reveals standard conditions. The Hollow produces conditions that are not standard. The Lantern reveals what is hidden — the faint outline of a curse, the shimmer of an enchantment.”,mechanics:“Once/session: reveal all hidden status effects, curses, enchantments on one target. No roll.”,special:“The Lantern’s light affects Hollow entities differently — they cannot hide their nature from it.”,lore:“The medical research division that developed it was dissolved after their third research loss.”},
{rarity:“Legendary”, name:”[Named collaboratively with player]”,type:“Varies”,origin:“Determined with player”,history:“Legendary Healer equipment has done something once that the Healing Orders have no category for — a treatment that worked when no treatment should have worked.”,mechanics:“One unique restorative property, permanent. Never duplicated.”,special:“Known to the Hollow’s spiritual entities. Some seek it out.”,lore:“The Healing Orders maintain a private record. They do not share it freely.”},
{rarity:“Mythic”, name:“The First Remedy”,type:“Beyond classification — predates records”,origin:“Unknown — predates all documentation”,history:“The First Remedy predates the Hollow Realm’s current form. It predates the Healing Orders. What is known is what it does: it heals. Not in the way that salves heal. In the way that things heal when given exactly what they need, applied by someone who understands completely what is wrong. It has no mechanism. No side effects. It simply produces the outcome of correct treatment.”,mechanics:“Once/arc: a healing action simply works at maximum effect. No roll. No material requirement. No limitation on what can be healed.”,special:“In its presence, the Hollow’s hostile environmental effects on injured characters are suppressed.”,lore:“The Healing Orders believe The First Remedy is a myth. Three of their own practitioners have carried it.”},
],
Merchant:[
{rarity:“Battered”, name:“Rusty Counting Scales”,type:“Trade instrument — portable balance”,origin:“Personal — carried in”,history:“Scales that have rusted and been cleaned and rusted again have been used in real conditions. Rust and recovery is the biography of a working instrument. These are slow — the arms take longer to settle — but experienced users account for it automatically.”,mechanics:“No bonus.”,special:“None.”,lore:“Merchants who’ve used the same scales for years calibrate them to their own habits.”},
{rarity:“Standard”, name:“Merchant’s Pack & Ledger”,type:“Trade kit — complete”,origin:“Guild issue — standard configuration”,history:“The Guild has standardised its practitioner kit through generations of refinement. The ledger is the core piece — simultaneously a business record, contact list, debt tracker, and history of every transaction that mattered. Merchants who lose their ledger describe the experience in terms usually reserved for physical injury.”,mechanics:“No bonus. Guild-standard provides access to Guild services and standing.”,special:“Recognised by Merchant Guild NPCs as current certification.”,lore:“Guild ledgers are supposed to be surrendered on retirement or expulsion. Most aren’t.”},
{rarity:“Fine”, name:“Hollow Market Satchel”,type:“Carrying case — Hollow-treated”,origin:“Underground Caverns — mineral compound treated”,history:“Developed by traders who needed to move sensitive goods without them being identified. The mineral compound treatment creates a property experienced inspectors find unsettling: the satchel feels empty on examination regardless of contents. This is not invisibility. It is a failure of identification.”,mechanics:“Items carried inside cannot be identified or catalogued by inspection — magical or mundane.”,special:“Customs NPCs and search procedures fail to identify specific contents.”,lore:“The traders who developed this treatment did not share the process freely.”},
{rarity:“Rare”, name:“The Gilded Tongue”,type:“Arcane instrument — negotiation focus”,origin:“Unknown — pre-Hollow commission”,history:“Commissioned by a Merchant whose identity was anonymised at significant expense. Notes specify an instrument for ‘facilitation of conversations that have reached an impasse.’ What it does to an impasse is not magic in the traditional sense — it is the application of exactly the right words at exactly the right moment.”,mechanics:“Once/arc: guarantee safe passage or neutralise one hostile NPC.”,special:“In any negotiation where present, NPC parties cannot walk away without resolution.”,lore:“The Guild considers The Gilded Tongue a Category One instrument — meaning its current holder is tracked.”},
{rarity:“Legendary”, name:”[Named collaboratively with player]”,type:“Varies”,origin:“Determined with player”,history:“Legendary Merchant equipment facilitated a transaction the Hollow itself had a stake in — a deal that changed who controlled something the Hollow considered significant.”,mechanics:“One unique economic property, permanent. Never duplicated.”,special:“Known to Guild leadership and competing power structures.”,lore:“The Guild maintains a Legendary Equipment Registry. Several non-Guild parties maintain their own.”},
{rarity:“Mythic”, name:“The Open Account”,type:“Ledger beyond classification”,origin:“The economy of the Hollow itself”,history:“Not a ledger that records transactions — a ledger that creates them. When the Merchant writes in it, the entry becomes real. The Hollow treats the entries as binding in the same way it treats sworn oaths and formal curses. Previous carriers describe the experience as feeling watched — aware that something is noting every entry and holding counterparties accountable.”,mechanics:“Once/arc: write a transaction. It is real. The Hollow enforces it. No signature required. No agreement needed.”,special:“Debts recorded cannot be avoided by death, disappearance, or denial. The Hollow collects.”,lore:“The Open Account has one rule its carriers discover independently: you cannot write yourself an advantage without an equivalent cost elsewhere.”},
],
Bard:[
{rarity:“Battered”, name:“Cracked Lute”,type:“Instrument — lute”,origin:“Personal — carried in from previous life”,history:“A cracked lute that still plays is a statement about priorities. The crack changes the sound — not badly, differently. Experienced listeners identify a cracked-body lute by a specific warmth in the mid-range tones. Some audiences prefer it. They describe it as honest.”,mechanics:“No bonus.”,special:“The distinctive tone is recognisable to experienced musicians.”,lore:“Musicians who’ve played the same cracked instrument for years develop an intimacy with its specific properties.”},
{rarity:“Standard”, name:“Travelling Instrument”,type:“Instrument — configuration varies”,origin:“Professional purchase — road-worthy”,history:“Built for the reality of performance on the road — not concert hall conditions, but inns, outdoor stages, fire circles, and festival grounds. A Bard who chose a Travelling Instrument has made a practical decision: they expect to go places and play in conditions they can’t control.”,mechanics:“No bonus. Performs reliably under adverse conditions without degradation.”,special:“Recognised by travelling communities as professional equipment.”,lore:“Road instrument makers have a guild-adjacent network. They track notable instruments through community reports.”},
{rarity:“Fine”, name:“Hollow-Carved Instrument”,type:“Instrument — Hollow-adjacent materials”,origin:“Hollow’s Edge — transition zone carving”,history:“The trees at the Hollow’s Edge grow in the transition between the Realm and whatever the Hollow actually is. Hollow-Carved Instruments sound different in Hollow locations — present in a way that normal instruments aren’t. Musicians describe the experience as the space responding to the music.”,mechanics:”+1 to all performance rolls in Hollow locations. Heard by entities that don’t normally perceive sound.”,special:“Hollow entities that would normally ignore a Bard pay attention when this instrument is played.”,lore:“The carvers work alone. Don’t take apprentices. When one stops, another appears.”},
{rarity:“Rare”, name:“The Resonance Chord”,type:“Instrument — unknown configuration”,origin:“Unknown — no documented construction”,history:“Its earliest appearance in the historical record is already as a notable instrument — already in use, already known. What it does is change the emotional state of a target with precision. Not ‘make them feel better’ but ‘make them feel exactly what they need to feel to make the decision the Bard requires.’”,mechanics:“Once/session: an NPC mood change auto-succeeds. No roll. No resistance.”,special:“Emotional changes produced are permanent in the sense that the NPC genuinely experienced them.”,lore:“The Resonance Chord appears in records from three distinct eras. Whether the same instrument or a category: unresolved.”},
{rarity:“Legendary”, name:”[Named collaboratively with player]”,type:“Varies”,origin:“Determined with player”,history:“Legendary Bard instruments have performed something once that the Hollow recorded as part of its own internal story. The performance changed something. The instrument was the vehicle. They are inseparable now.”,mechanics:“One unique performance property, permanent. Never duplicated.”,special:“Known across the Hollow Realm by name and sound.”,lore:“The Hollow’s Witness accounts reference Legendary instruments by the specific quality of their sound.”},
{rarity:“Mythic”, name:“The First Song”,type:“Instrument and composition — inseparable”,origin:“The moment before the Hollow became what it is”,history:“The First Song is not entirely an instrument and not entirely a piece of music. It predates the Hollow Realm’s current form. When played, whatever was present stopped and listened. Bards who carry it don’t always play it deliberately. Sometimes it plays. They describe the experience afterward as having said something true that they didn’t know they knew.”,mechanics:“Once/arc: a performance changes something in the world permanently. Not in the story — in the world. The Hollow acknowledges it. DM determines scope. Bard determines intent.”,special:“Hollow entities do not move, speak, or act while The First Song is being played. They listen.”,lore:“The Hollow’s Memory title and The First Song have never been held by the same Bard simultaneously.”},
],
};

// ═══════════════════════════════════════════════════
// NPC & VILLAIN DATA
// ═══════════════════════════════════════════════════

const NPC_FACTIONS = [“The Crumbling Kingdom”,“The Dark Enchanted Forest”,“The Underground Caverns”,“The Hollow’s Edge”,“The Sunken Library”,“Criminal Underground”,“Merchant Guild”,“Healing Order”,“Military Remnant”,“Unknown / No Faction”];
const NPC_DISPOSITIONS = {
allied:  {label:“Allied”,   color:”#66bb6a”,bg:“rgba(30,60,20,0.8)”,  icon:“💚”},
friendly:{label:“Friendly”, color:”#4fc3f7”,bg:“rgba(10,40,60,0.8)”,  icon:“🤝”},
neutral: {label:“Neutral”,  color:”#bbb”,   bg:“rgba(30,28,50,0.8)”,  icon:“⚖️”},
wary:    {label:“Wary”,     color:”#ffd54f”,bg:“rgba(50,40,5,0.8)”,   icon:“👁”},
hostile: {label:“Hostile”,  color:”#ef5350”,bg:“rgba(60,10,10,0.8)”,  icon:“⚔️”},
unknown: {label:“Unknown”,  color:”#9c27b0”,bg:“rgba(30,10,50,0.8)”,  icon:“❓”},
};
const NPC_STATUSES = {
active: {label:“Active”,  color:”#66bb6a”},
missing:{label:“Missing”, color:”#ffd54f”},
dead:   {label:“Dead”,    color:”#555”},
hidden: {label:“Hidden”,  color:”#9c27b0”},
};
const VILLAIN_STATUSES = {
active:   {label:“Active”,    color:”#ef5350”,bg:“rgba(60,10,10,0.8)”},
wounded:  {label:“Wounded”,   color:”#ffd54f”,bg:“rgba(50,40,5,0.8)”},
retreated:{label:“Retreated”, color:”#ff9800”,bg:“rgba(50,30,5,0.8)”},
defeated: {label:“Defeated”,  color:”#555”,   bg:“rgba(20,20,20,0.8)”},
unknown:  {label:“Unknown”,   color:”#9c27b0”,bg:“rgba(30,10,50,0.8)”},
};
const VILLAIN_PHASE_COLORS = [”#ef5350”,”#ff9800”,”#9c27b0”,”#4fc3f7”];

// ═══════════════════════════════════════════════════
// RULES
// ═══════════════════════════════════════════════════

const VILLAIN_STATUSES={
active:   {label:“Active”,    color:”#ef5350”,bg:“rgba(60,10,10,0.8)”},
wounded:  {label:“Wounded”,   color:”#ffd54f”,bg:“rgba(50,40,5,0.8)”},
retreated:{label:“Retreated”, color:”#ff9800”,bg:“rgba(50,30,5,0.8)”},
defeated: {label:“Defeated”,  color:”#555”,   bg:“rgba(20,20,20,0.8)”},
unknown:  {label:“Unknown”,   color:”#9c27b0”,bg:“rgba(30,10,50,0.8)”},
};
const VILLAIN_PHASE_COLORS=[”#ef5350”,”#ff9800”,”#9c27b0”,”#4fc3f7”];

const RULES_SECTIONS = [
{id:“overview”,label:“🌑 Overview”,icon:“🌑”,content:`The Hollow Realm is a live TikTok RPG where your gifts drive the story. Characters are created off-stream, debuted on live, and carry every consequence forward — permanently.\n\nTwo layers exist: the bobblehead world (cute surface), and The Hollow Realm (the adventure inside the board game). Think Toy Story meets Jumanji meets D&D.\n\nNothing resets. Everything matters.`},
{id:“sessions”,label:“📡 Sessions”,icon:“📡”,content:`Every live follows 5 steps:\n\n1. OPEN THE WORLD — Recap, board positions, current stakes\n2. PLAYERS TAKE ACTIONS — Send gifts to declare what your character does\n3. THE DICE DECIDES — DM rolls d20 on your behalf, live\n4. WORLD EVENTS — Coins and donations trigger events affecting everyone\n5. CLOSE THE SESSION — Everything recorded. Nothing resets.`},
{id:“dice”,label:“🎲 Dice System”,icon:“🎲”,content:`All actions resolve with a d20 roll:\n\n💀 1 = FUMBLE — Catastrophic backfire\n✗ 2–4 = FAIL — Action fails entirely\n⚠ 5–9 = WEAK HIT — Partial success, something goes wrong\n✓ 10–14 = SUCCESS — Clean success\n★ 15–19 = STRONG HIT — Success with bonus effect\n⚡ 20 = CRITICAL — Legendary moment. Announced live.`},
{id:“creation”,label:“🪆 Creation”,icon:“🪆”,content:`Pay entry fee → Confirm in Discord → Seven d20 rolls → Debuted at next live.\n\nROLL 1 — Reputation Title\nROLL 2 — Trait Effectiveness\nROLL 3 — Starting Weapon\nROLL 4 — Signature Skill\nROLL 5 — Shadow Trait\nROLL 6 — Enchantment\nROLL 7 — Destiny Thread\n\nRe-rolls: 500 coins (1st, final) / 1,500 coins (2nd, absolute final). Happen live. Chat watches.`},
{id:“classes”,label:“⚔️ Classes”,icon:“⚔️”,content:`⚔️ WARRIOR — 12 HP — Gift Power: Shield Block\n🔮 WIZARD — 7 HP — Gift Power: Arcane Surge\n🗡️ ROGUE — 8 HP — Gift Power: Shadow Step\n💚 HEALER — 9 HP — Gift Power: Miracle Touch\n💰 MERCHANT — 8 HP — Gift Power: Black Market\n🎵 BARD — 8 HP — Gift Power: Encore\n\nGift Powers reset each session. Activated by 5,000 coin Power Gift.`},
{id:“gifts”,label:“💰 Gifts”,icon:“💰”,content:`🌑 Entry — 1,000 coins / ~$7 to you\n⚔️ Minor Roll — 100 / ~$0.70\n⚔️⚔️ Moderate — 500 / ~$3.50\n⚔️⚔️⚔️ Major — 5,000 / ~$35\n⚡ Epic Lion — 29,999 / ~$210\n🎬 Episode — 5,000+ / ~$35\n👑 Origin Story — 10,000 / ~$70\n🌟 Gift a Legend — 20,000 / ~$140\n⚗ Resurrection — 6,000 / ~$42\n🛡 Protection — 1,000/session / ~$7\n🎲 Re-Roll 1st — 500 / ~$3.50\n🎲 Re-Roll 2nd — 1,500 / ~$10.50\n\nPayPal accepted at 80% of coin value.`},
{id:“death”,label:“💀 Death”,icon:“💀”,content:`At 0 HP: DOWNED — not immediately dead. A Healer can revive before session ends.\n\nNo revival = Death. Dead character's legacy stays in lore permanently. Their name retires.\n\n⚗ RESURRECTION — 6,000 coins. Full stats restored.\n💀 NEW CHARACTER — 1,000 coins. Fresh start.\n\nConsequences short of death:\n⚗ CURSED / 🎯 WANTED / 🚫 EXILED / ⛓ SERVANT / 💸 DEBT / 👻 HAUNTED`},
{id:“protection”,label:“🛡 Protection”,icon:“🛡”,content:`Covers: Death + Box Battle targeting only.\n\nDoes NOT cover: Curses, world events, NPC changes, story consequences.\n\nCost: 1,000 coins per session missed. Balance tracked in Discord Insurance Board.\n\nLore: Character moves with a "ward" — darker forces cannot fully claim them.`},
{id:“battle”,label:“⚔️ Box Battle”,icon:“⚔️”,content:`Chat votes to trigger (500 coins minimum). Both players enter TikTok boxes. Communities throw coins for 3 minutes. Highest total wins.\n\nCONSEQUENCE LADDER:\n⚠ MINOR (under 5,000) — Lose title OR stat debuff\n⚔️ MODERATE (5k–9,999) — Cursed 2 sessions OR item stolen\n💀 MAJOR (10k–19,999) — Exile from region OR servant\n☠ SEVERE (20k–44,999) — Killed OR curse+exile+theft\n👁 OP CONTROL (45k+) — Winner narrates anything`},
{id:“alliances”,label:“🤝 Alliances”,icon:“🤝”,content:`Any 2+ players can declare alliance (public, recorded).\n\nFormal break: 500 coins Declaration gift.\nBetrayal without declaration: Free — permanent story consequences.\n\nBetrayal without declaration makes the best Kling episodes.`},
];
const FAQ = [
{q:“Can I play if I missed the start?”,a:“Yes. New characters join at any time via entry gift (1,000 coins or PayPal).”},
{q:“What happens if I miss a live?”,a:“Your character exists. Protection Mode covers death and Box Battle targeting. World events and story consequences can still reach you.”},
{q:“Can I choose my class and name?”,a:“Yes to class. Names come from the official list — they retire on death.”},
{q:“What if I roll badly on creation?”,a:“Low rolls tell interesting stories. A Battered weapon and Weakened trait is a compelling origin, not a broken character.”},
{q:“Can my character die permanently?”,a:“Yes. Resurrect (6,000 coins) or start a New Character (1,000 coins). Dead characters become permanent world lore.”},
{q:“What does Protection NOT cover?”,a:“Curses, world events, NPC decisions, consequences from your own actions.”},
{q:“Can I trade items?”,a:“Yes — Item Trade requires 1,000 coins AND both players must agree.”},
{q:“Is there a pay-to-win problem?”,a:“Coins give you more actions, not guaranteed wins. Every action still resolves on a d20. Big spending creates bigger stakes, not guaranteed outcomes.”},
{q:“What is a Box Battle?”,a:“A TikTok box battle. Communities throw coins for 3 minutes. Winner selects a consequence from the Consequence Ladder.”},
{q:“Can a villain target my character?”,a:“Yes. NPCs and villains have memory and make choices between sessions. Protection Mode covers player targeting, not the story itself.”},
];

// ═══════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════

const VILLAIN_LORE_DATA = [
// ─────────────────────────────────────────────────
{
id: “gravenor”,
name: “Gravenor”,
title: “The Hollow’s Hound — Alpha of the Ashen Pack”,
type: “Werewolf — Arc Boss”,
arc: “Arc I — The Ashen Hunt”,
location: “Dark Enchanted Forest / Crumbling Kingdom outskirts”,
status: “Active”,
threat: “Extreme”,
color: “#9c27b0”,
glowColor: “rgba(156,39,176,0.2)”,
image: “🐺”,
tagline: “He was a man once. The Hollow made him something more useful.”,
appearance: `Eight feet of muscle, scar tissue, and grey-black fur that shifts colour in moonlight. His eyes are amber — too intelligent for an animal, too feral for a man. Three of his claws are longer than the others on his right hand. Nobody has successfully asked why.

He walks upright until he doesn’t want to anymore. In full hunt mode, he drops to four legs and covers ground at a speed that doesn’t match his size. The Hollow has given him something extra. Whatever it is, it shows in how he moves — like he knows where you’re going before you do.`, lore: `Gravenor was a Warrior. The records from before his transformation are incomplete — the Crumbling Kingdom archived its heroes badly and its tragedies not at all. What survives: he was stationed at the Forest’s edge, part of a unit tasked with containing whatever was coming out of the dark.

The unit didn’t come back. Gravenor did.

He wasn’t feral immediately. There are accounts from the early period — a figure seen at the tree line, watching villages without approaching. A garrison that found their gate intact one morning after something had been circling it all night. A survivor who said something spoke to them in the dark, warned them away from a particular path, and was gone before they could see it clearly.

Whatever the Hollow did to him, it kept something. That something makes him more dangerous than a simple beast. He plans. He remembers. He holds grudges across sessions with the precision of someone who has kept score for a long time.

The Ashen Pack follows him — wolves touched by the same Hollow influence, not transformed fully but changed enough. They don’t obey him. They agree with him. That distinction matters when you’re trying to split the group.`, motivation: `Gravenor is not trying to destroy the players. He is trying to reclaim something — what exactly shifts by arc, but the core is consistent: he believes the Hollow took something from him and he intends to have it back. The players are obstacles, witnesses, or occasionally tools depending on what they’ve done and who they’ve aligned with.

He is not without honour. He will not attack someone who is downed unless they wronged him directly. He has left warnings. He has, on two documented occasions, healed an injured character who was not his target. The Hollow made him a monster. It didn’t make him cruel.`,
strengths: [
“Regenerates 2 HP per round while in Forest or low-light environments”,
“Cannot be flanked — senses positions of all characters within 40 feet”,
“Pack Coordination — Ashen wolves gain +1 attack when Gravenor is above half HP”,
“Hollow-Hardened — standard weapons deal -1 damage. Hollow-touched weapons deal full”,
“Tracking — if he has scented a character once, he can find them anywhere in the Forest”,
“Intimidation Aura — characters at 3 HP or below must roll WIS 12+ to act aggressively”,
],
weaknesses: [
“Silver — silver weapons bypass Hollow-Hardened and deal +2 damage”,
“Fire — cannot regenerate during rounds where fire damage was received”,
“Bard performance in Hollow locations — the Hollow’s connection makes him briefly hesitate”,
“His honour — cannot pursue a character who formally surrenders in Pack tradition (kneel, arms wide)”,
“The thing he lost — if it is present or mentioned specifically, he loses one action to re-orient”,
“Daylight on open ground — -1 to all rolls, regeneration halved”,
],
phases: [
{
phase: 1,
name: “The Watcher”,
hp: “Full — 80 HP”,
desc: “Gravenor observes. Doesn’t engage directly. Directs pack. Tests player responses. Will speak if approached respectfully.”,
behavior: “Circles. Herds. Creates pressure without striking. Players who act with honour may trigger a dialogue event.”,
color: “#4fc3f7”,
},
{
phase: 2,
name: “The Hunter”,
hp: “Below 60 HP”,
desc: “Engages directly. Targets the player who has done the most damage to his pack. Precise, tactical strikes.”,
behavior: “Picks a primary target and focuses them. Other pack members create interference. Will retreat wounded characters from the fight — he doesn’t kill until Phase 3.”,
color: “#ff9800”,
},
{
phase: 3,
name: “The Feral”,
hp: “Below 30 HP”,
desc: “The man recedes. The Hollow takes over. Reckless, devastating, and no longer strategic.”,
behavior: “Attacks nearest character regardless of tactical value. Pack members scatter — no longer coordinated. Maximum damage output. Hollow regeneration doubles.”,
color: “#ef5350”,
},
{
phase: 4,
name: “The Reckoning”,
hp: “At 0 HP — but not dead”,
desc: “Gravenor does not die easily. At 0 HP he collapses — and the man surfaces. One round of lucidity. He speaks. What he says is arc-relevant.”,
behavior: “Players can choose to finish him, let him go, or attempt something else. All three options have permanent consequences. The Hollow is watching this moment specifically.”,
color: “#ce93d8”,
},
],
abilities: [
{
name: “Pack Call”,
type: “Active — once per session”,
desc: “Summons 1d4 Ashen wolves to his position. Wolves arrive next round. Each wolf has 8 HP and +2 attack.”,
},
{
name: “Hollow Howl”,
type: “Active — once per encounter”,
desc: “All characters must roll WIS 13+ or lose their next action to pure dread. On a fumble, they flee one full round.”,
},
{
name: “The Scent”,
type: “Passive”,
desc: “Gravenor knows the HP, active status effects, and general emotional state of every character he has encountered. He uses this information tactically.”,
},
{
name: “Rend”,
type: “Attack”,
desc: “On a successful strike of 15+, target gains the BLEEDING consequence — -1 HP per round until treated by a Healer.”,
},
{
name: “Shadow Pounce”,
type: “Active — Phase 2+”,
desc: “From concealment, Gravenor can initiate combat with a pounce that deals double first-strike damage. No warning roll to detect it.”,
},
{
name: “The Hollow’s Gift”,
type: “Passive — Phase 3 only”,
desc: “The Hollow pushes through him. All damage dealt by Gravenor in Phase 3 ignores 2 points of DEF and cannot be reduced below 2.”,
},
],
lootDrops: [
{ item: “Ashen Fang (weapon enchantment material)”, chance: “65%”, note: “Counts as silver for purposes of other werewolf encounters. Rare enchantment component.” },
{ item: “Pack Sigil (faction key item)”, chance: “80%”, note: “Opens certain Ashen Pack territories and caches. Some NPCs will react to it.” },
{ item: “Hollow-Touched Pelt (armour material)”, chance: “45%”, note: “Can be crafted into Shadow Wrap or used as Hollow ore substitute.” },
{ item: “Gravenor’s Memory (arc item)”, chance: “100% — Phase 4 only”, note: “A fragment of what he lost. Arc-critical. Changes the story going forward.” },
{ item: “Silver Cache (hidden near his den)”, chance: “30%”, note: “Irony the Hollow apparently enjoys.” },
{ item: “Ashen Pack loyalty (consequence)”, chance: “Phase 4 — player choice”, note: “If spared with honour, pack wolves become neutral to that player for remainder of arc.” },
],
dmNotes: “Gravenor is the arc’s moral test, not just its combat encounter. The players who try to kill him immediately and the players who try to talk to him will both have valid paths — but the outcomes are permanently different. He rewards honour. He punishes cruelty. He notices everything.”,
},

// ─────────────────────────────────────────────────
{
id: “valdris”,
name: “Valdris the Unmourned”,
title: “Last Chancellor of the Crumbling Kingdom”,
type: “Undead Political Villain — Arc Boss”,
arc: “Arc II — The Kingdom’s Debt”,
location: “Crumbling Kingdom throne room / underground vaults”,
status: “Active”,
threat: “High”,
color: “#ef5350”,
glowColor: “rgba(239,83,80,0.15)”,
image: “👑”,
tagline: “The Kingdom fell. He didn’t have the decency to go with it.”,
appearance: `Valdris looks like what he was — a chancellor, a political animal, a man who spent forty years in rooms where appearance was currency. The suit is still pressed. The rings are still on the fingers. The eyes are still calculating.

Everything else is wrong. His skin has the grey-yellow quality of old candle wax. He moves without sound. His shadow doesn’t always match his position. When he speaks, the temperature drops — not dramatically, not like a horror story, just enough that you notice and wish you hadn’t.

He was the last person out of the Kingdom before it fell. He made sure of it by ensuring everyone else went first.`, lore: `Valdris didn’t cause the Kingdom’s collapse. He facilitated it. There’s a distinction he would insist on, and he would be technically correct, and the distinction would be meaningless.

He spent his chancellorship building leverage. Favours owed, secrets held, alliances that looked like loyalty and functioned like ownership. When the collapse came — and he had known it was coming for three years — he had prepared an exit for himself that required sacrificing every connection he’d spent a career building.

He made the trades. They worked. The Kingdom fell. He walked out.

What he didn’t account for was the Hollow. The Hollow has opinions about certain kinds of debts. Valdris arrived at the Hollow’s Edge planning to establish himself in whatever came next. Instead, he found he couldn’t leave. The Hollow had noted the accounting.

He has been in the throne room ever since — not imprisoned, not restrained, but unable to pass through the Kingdom’s ruins without returning. The Hollow keeps him here because the debts he created are still active. He cannot leave until they’re settled. His interpretation of “settled” is not the Hollow’s.`, motivation: `Valdris wants out. He wants the Hollow’s accounting cleared, which means either legitimately settling the debts (which would require sacrificing things he values more than freedom) or finding someone else to transfer them to.

He is actively recruiting. He presents himself as an ally, a guide, a source of Kingdom intelligence. Everything he says is technically true. The framing is consistently in his interest. He is extraordinarily good at this — forty years of practice.

He will betray anyone. He has done it before. He will do it without visible guilt because he has genuinely convinced himself that his survival matters more than other people’s stories. The Hollow disagrees. This disagreement is the arc.`,
strengths: [
“Political Intelligence — knows the history, weaknesses, and leverage points of every Kingdom faction”,
“The Hollow’s Grudge — immune to all damage while inside the throne room. The Hollow keeps him here intact”,
“Debt Transfer — can apply a Debt consequence to any character who accepts a deal with him”,
“Undying — cannot be permanently killed until his debts are settled. Defeated characters respawn him next session”,
“The Long Memory — remembers every action taken by every character, uses this in future negotiations”,
“Plausible Deniability — NPCs require CHA roll 15+ to believe accusations against him without evidence”,
],
weaknesses: [
“Outside the Kingdom ruins, his powers are significantly reduced — -2 all rolls”,
“His debts — specific items, returned to specific people, weaken him permanently”,
“Direct honesty — he cannot lie outright, only mislead. Characters with Truthseer or similar detect this”,
“The Hollow’s accounting — certain Hollow locations make him visibly uncomfortable and reduce his DEF”,
“He needs the players — without someone to transfer debt to, he cannot leave. This makes him tractable”,
“His suits — they are actual armour. Destroying one is a genuine injury to his dignity and his DEF”,
],
phases: [
{
phase: 1,
name: “The Chancellor”,
hp: “Full — 60 HP”,
desc: “Diplomatic. Charming. Genuinely helpful — selectively. Building trust to spend later.”,
behavior: “Offers information, assistance, access. Every offer has a cost he doesn’t mention upfront. Monitors what the players value.”,
color: “#4fc3f7”,
},
{
phase: 2,
name: “The Negotiator”,
hp: “Below 45 HP”,
desc: “The charm remains but the desperation shows. Offers become better and the costs become worse.”,
behavior: “Starts making deals he can’t honour. Attempts to set players against each other. Uses what he’s learned about their motivations.”,
color: “#ff9800”,
},
{
phase: 3,
name: “The Unmourned”,
hp: “Below 20 HP”,
desc: “Drops the political façade. What’s underneath is the man who watched a Kingdom die and felt primarily relieved.”,
behavior: “Direct. Vicious. Uses every piece of leverage he has simultaneously. The Hollow actively interferes with him at this point — small things going wrong.”,
color: “#ef5350”,
},
],
abilities: [
{
name: “The Offer”,
type: “Social — once per session”,
desc: “Presents a deal. If accepted, player gains an immediate benefit and Valdris gains a Debt token on them. Three Debt tokens and the Hollow treats them as owing Valdris — consequences follow.”,
},
{
name: “Kingdom Archive”,
type: “Passive”,
desc: “Knows the location of all Kingdom-era caches, vaults, and secrets. Will trade this information. The information is always accurate. The context is never complete.”,
},
{
name: “Political Leverage”,
type: “Active”,
desc: “Once per arc, reveal something true and damaging about any player character. The revelation is arc-relevant and cannot be refuted.”,
},
{
name: “Undying Patience”,
type: “Passive”,
desc: “If defeated, returns next session at half HP. Cannot be permanently removed until specific arc conditions are met.”,
},
{
name: “The Debt Collector”,
type: “Phase 2+”,
desc: “Call in any outstanding Debt tokens simultaneously. All affected players must deal with the consequences in the same session.”,
},
],
lootDrops: [
{ item: “Kingdom Vault Key (arc item)”, chance: “75%”, note: “Opens the Kingdom’s remaining treasury and archive. High value, multiple uses.” },
{ item: “Debt Ledger (faction item)”, chance: “60%”, note: “Contains records of every debt he created. Can be used to leverage Kingdom-era NPCs.” },
{ item: “Chancellor’s Ring (enchantment item)”, chance: “40%”, note: “Applies Political Leverage ability to the wearer once per arc. It knows things.” },
{ item: “Settled Accounts (arc resolution)”, chance: “100% — arc condition”, note: “When his debts are legitimately cleared, he dissolves. This is the actual win condition.” },
{ item: “Kingdom Signet (social item)”, chance: “55%”, note: “Grants Kingdom faction access and NPC trust in Kingdom-aligned communities.” },
],
dmNotes: “Valdris is a puzzle, not a combat encounter. The players who try to fight him in the throne room will fail — the Hollow keeps him intact there. The solution is settling his debts, which requires understanding what they are. He will never tell them directly. The Debt Ledger is the key.”,
},

// ─────────────────────────────────────────────────
{
id: “thesink”,
name: “The Sink”,
title: “What Lives at the Bottom of the Sunken Library”,
type: “Entity — Unknown Classification”,
arc: “Arc III — The Drowned Archive”,
location: “Sunken Library — the lowest level, permanently submerged”,
status: “Always been here”,
threat: “Unknown — possibly beyond scale”,
color: “#4fc3f7”,
glowColor: “rgba(79,195,247,0.15)”,
image: “🌊”,
tagline: “It didn’t sink the Library. It was why the Library was built there.”,
appearance: `Nobody has seen The Sink clearly. What has been documented: a presence in the deep water, a distortion of light at the bottom of the lowest reading room, a sound that isn’t quite sound that increases in intensity as depth increases.

Characters who have reached the deep levels describe it differently — some report a shape, some report a feeling, some report words in a language they understood perfectly and cannot remember afterward. Three researchers who reached the bottom level left their notes on the final stair. None of them came back up. The notes are coherent. They do not describe The Sink. They describe what they thought about on the way down.`, lore: `The Sunken Library was built on this location because of what was already here. The original founders believed that proximity to The Sink made knowledge more accessible — that the entity at the bottom had a relationship with information that could be leveraged for scholarship.

They were correct. The Library became the most complete archive in the Hollow Realm’s history. The founders’ notes on what they negotiated for this are in the restricted section. The restricted section is flooded.

The Sink has not acted aggressively. It has not acted at all in any observable sense. But the Library keeps sinking — a few inches per decade — and the water level keeps rising, and the lowest rooms keep becoming inaccessible, and occasionally a researcher who goes too deep doesn’t come back up but their notes do.

The Hollow considers The Sink to be something it keeps an eye on. This is, to scholars who understand the Hollow’s usual attitude toward things, extremely significant.`, motivation: `Unknown. Possibly not goal-oriented in a way that translates to motivation. The working theory among the Library’s remaining scholars is that The Sink is collecting — absorbing the knowledge in the drowned sections, pulling information down as the water rises.

What it intends to do with a complete archive of the Hollow Realm’s history is the question the current arc is asking.`,
strengths: [
“Omniscience (partial) — knows everything in the drowned Library sections”,
“Water domain — in flooded areas, all enemy rolls are at -2 and The Sink’s effective HP is doubled”,
“Unknowable — cannot be damaged by conventional means in deep water”,
“The Pull — characters below the second submerged level must roll WIS 12+ each round or drift one level deeper”,
“The Drowned — animated researchers who went too deep. They are not hostile. They are very insistent.”,
“Information Weapon — can reveal any character’s secrets, Shadow Traits, or Destiny Threads as an action”,
],
weaknesses: [
“Surface — above water, its power is significantly reduced”,
“Light — sustained magical light sources reduce The Pull effect by half”,
“Direct questions — it answers them. Always. The answers are true. The answers are not always safe”,
“The first archive — the founding documents, if recovered, describe a counter-condition”,
“Acknowledgment — has never been directly addressed. Nobody knows what happens if someone tries”,
],
phases: [
{
phase: 1,
name: “The Archive”,
hp: “Inapplicable”,
desc: “Passive. Characters feel its presence as increasing unease. The water rises slightly. Notes appear on desks.”,
behavior: “Provides information freely to any character who asks. The information is accurate and contextless and devastating.”,
color: “#4fc3f7”,
},
{
phase: 2,
name: “The Collector”,
hp: “Emerges partially — 100 HP”,
desc: “Responds to characters reaching the deep levels. The shape becomes visible. The Pull intensifies.”,
behavior: “Not attacking — cataloguing. Characters feel themselves being read. Shadow Traits and Destiny Threads activate involuntarily.”,
color: “#9c27b0”,
},
{
phase: 3,
name: “The Answer”,
hp: “Unknown — damage causes it to recede, not die”,
desc: “Direct confrontation. It has questions for the players. The session becomes a conversation with something vast.”,
behavior: “Asks one question of each character. The questions are about their Destiny Threads. Answering honestly gives +3 to all rolls for the session. Lying causes a permanent consequence.”,
color: “#ce93d8”,
},
],
abilities: [
{
name: “The Pull”,
type: “Passive — active in submerged levels”,
desc: “WIS 12+ each round in deep water or drift one level deeper. The deeper you go, the stronger the Pull.”,
},
{
name: “The Drowned Scholars”,
type: “Active”,
desc: “Summons 1d6 animated researchers. They do not attack. They approach calmly and attempt to lead characters deeper. Resisting requires STR or SPD roll 13+.”,
},
{
name: “Information Flood”,
type: “Active — once per session”,
desc: “Overwhelms one character with everything it knows about them. Target loses their next action and gains a permanent piece of arc-relevant knowledge.”,
},
{
name: “The Rising”,
type: “Environmental”,
desc: “Water level rises 6 inches per round during Phase 2+. Sessions in the Library have a time limit.”,
},
{
name: “True Answer”,
type: “Phase 3 only”,
desc: “Answers any question asked of it completely and accurately. The answer always contains something the character was not prepared for.”,
},
],
lootDrops: [
{ item: “Drowned Archive fragment (knowledge item)”, chance: “70%”, note: “Contains lore from a flooded section. Arc-relevant. Often answers a question the players had.” },
{ item: “The Sink’s attention (consequence)”, chance: “Phase 2 — automatic”, note: “It knows your character now. This has future implications across arcs.” },
{ item: “Founding Document (arc key item)”, chance: “40%”, note: “Describes the original negotiation. Contains the counter-condition. Changes the arc significantly.” },
{ item: “Waterlogged Enchantment Scroll”, chance: “35%”, note: “Contains a Hollow-adjacent spell not found anywhere else. Partially damaged — requires Wizard to complete.” },
{ item: “The Answer (arc resolution)”, chance: “Phase 3 — conditional”, note: “If all characters answer honestly, The Sink recedes fully. The Library stops sinking. This is the win condition.” },
],
dmNotes: “The Sink is not a villain in the traditional sense — it’s a force that the players have to understand, not defeat. The arc resolves through honesty, not combat. Characters who engage with it combatively waste resources and miss the point. Characters who ask it questions learn things they needed to know. The session where players realise what it actually wants is the session the arc is built toward.”,
},

// ─────────────────────────────────────────────────
{
id: “thessaly”,
name: “Thessaly Vane”,
title: “The Burned Cartographer”,
type: “Human Villain — Recurring”,
arc: “Arc IV — The Unmapped”,
location: “Underground Caverns — deep unmapped sections”,
status: “Active”,
threat: “High”,
color: “#ff9800”,
glowColor: “rgba(255,152,0,0.15)”,
image: “🗺️”,
tagline: “She mapped the Hollow Realm. Then she started making changes.”,
appearance: `Thessaly looks like someone who has been underground for too long — pale, precise, with the particular intensity of a person whose entire life has become a single purpose. Her maps cover every surface of her camp. They are extraordinarily accurate.

Her right hand is burned from wrist to fingertip. She maps with her left. The burn is old — years old — and she does not discuss it. Characters with medical knowledge who examine it without her knowing will note that the burn pattern is not accidental.

She carries more maps than a person should be able to carry. They don’t seem to add weight. The Hollow may have opinions about this.`, lore: `Thessaly Vane was the Hollow Realm’s foremost cartographer before she went underground and stopped coming back up. Her maps are used by every faction — the Guild for trade routes, the Kingdom remnants for survival paths, the Rogues for everything else. The Sunken Library has a complete collection of her early work.

The early work stopped a few years ago. What she’s been making since is different.

The new maps don’t just record the Hollow — they describe changes she made to it. Small ones at first: a path redirected, a room that appeared where a wall had been, a tunnel that connected two locations that had never been connected. The changes are real. People who use the new maps find them accurate — accurate to a Hollow that has been modified according to her design.

The Hollow has not stopped her. Whether this is permission or oversight is the question the arc is built around.`, motivation: `Thessaly believes the Hollow Realm is a structure that can be redesigned. She is correct. She is using this belief to build something — a specific configuration of locations, passages, and features that she has calculated will do something to the Hollow’s core.

What that something is, she has not told anyone. The players will find out in stages. Her motivation is not malicious in her own framing — she believes the Hollow is broken and that she can fix it. She may be right. The fix has side effects she has not fully accounted for, and she knows this, and she has decided the cost is acceptable.

She is not wrong about the Hollow being broken. She is not right about the cost being acceptable. This is the arc’s argument.`,
strengths: [
“Environmental Mastery — knows the Caverns completely, uses terrain with +3 effectiveness”,
“Remapping — can alter physical Cavern layout between sessions. Players may find familiar paths changed”,
“Her maps are always accurate — she uses them to predict player movement and prepare accordingly”,
“Trap setting — every corridor she controls has been prepared. Rogues detect them on SPD 14+”,
“The Hollow’s tolerance — within her mapped areas, she has partial Hollow protection. -1 damage from all sources”,
“Precision — all her attacks are aimed. Called shots that bypass armour on rolls of 17+”,
],
weaknesses: [
“Above ground — loses environmental advantage completely, -2 all rolls”,
“Her maps — if a player obtains one, they have her plans. She knows this and hunts map thieves specifically”,
“The burn — her right hand. It still responds to heat. Fire damage causes an additional -1 to her next action”,
“The Hollow’s patience has limits — deeper in the Caverns, things that agreed with her changes are reconsidering”,
“She needs the players to understand — she wants someone to know what she’s doing and agree it’s worth it”,
“The cost she hasn’t accounted for — specific Hollow entities know what her project will do to them and will help players stop it”,
],
phases: [
{
phase: 1,
name: “The Guide”,
hp: “Full — 70 HP”,
desc: “Thessaly presents as a resource — knowledgeable, practical, occasionally warns players away from danger.”,
behavior: “Genuinely helpful. Her help always serves her project. Players who follow her guidance advance her plans without knowing it.”,
color: “#4fc3f7”,
},
{
phase: 2,
name: “The Architect”,
hp: “Below 50 HP”,
desc: “Players have figured out what she’s doing. She stops pretending and starts explaining. Still believes she can convert them.”,
behavior: “Argues her position. Makes compelling points. Will trade information for cooperation. Continues the project regardless.”,
color: “#ff9800”,
},
{
phase: 3,
name: “The Burned”,
hp: “Below 25 HP”,
desc: “The project is near completion. She cannot be stopped by conventional means — stopping her requires addressing the project itself.”,
behavior: “Desperate. Still precise. Every action is calculated to buy the project more time. Will sacrifice herself if it means completion.”,
color: “#ef5350”,
},
],
abilities: [
{
name: “Terrain Control”,
type: “Passive”,
desc: “In mapped Cavern sections, Thessaly chooses the battlefield. She designates ambush points, escape routes, and advantageous positions before combat begins.”,
},
{
name: “The Redirect”,
type: “Active — once per session”,
desc: “Change the physical layout of one Cavern section between sessions. Players may find a tunnel blocked, a new passage opened, or a room’s exits changed.”,
},
{
name: “Precision Strike”,
type: “Attack”,
desc: “Aim for a specific item. On a roll of 17+, hits target item rather than character — destroys or removes it from inventory.”,
},
{
name: “Trap Network”,
type: “Passive”,
desc: “Every corridor she controls has one trap. Rogues detect on SPD 14+. Others trigger on entering on a d6 roll of 1-4.”,
},
{
name: “The Map”,
type: “Active — Phase 2+”,
desc: “Reveals something from a player’s character sheet — a Shadow Trait, an Enchantment, a Destiny Thread — and uses it against them tactically this session.”,
},
],
lootDrops: [
{ item: “Master Cavern Map (navigation item)”, chance: “85%”, note: “Most complete map of the Underground Caverns in existence. Also contains her project plans.” },
{ item: “Burnt Cartographer’s Tools (crafting item)”, chance: “60%”, note: “Her precision instruments. +2 to any navigation or location-finding roll.” },
{ item: “The Project Blueprint (arc key item)”, chance: “55%”, note: “Complete plans for what she was building. Required to understand and complete or stop the arc.” },
{ item: “Hollow Anchor (enchantment material)”, chance: “35%”, note: “A material she developed for fixing map changes in place. Rare enchantment component.” },
{ item: “Her acknowledgment (consequence)”, chance: “Phase 2 — conditional”, note: “If players understand and engage with her argument honestly, she leaves them one map of something they actually needed.” },
],
dmNotes: “Thessaly is the arc’s ethical debate. She is doing something that will cause harm and she has thought about it more than anyone else has. Players who engage with her argument will have a harder time than players who just try to fight her — and both approaches should feel valid and both should have real consequences. The best resolution is neither defeating her nor agreeing with her but finding the third option she didn’t account for.”,
},

// ─────────────────────────────────────────────────
{
id: “nullwarden”,
name: “The Null Warden”,
title: “Keeper of the Hollow’s Edge — That Which Holds the Boundary”,
type: “Entity — Environmental Boss”,
arc: “Arc V — The Edge”,
location: “The Hollow’s Edge exclusively”,
status: “Has always been here. Will always be here.”,
threat: “Absolute within its domain”,
color: “#ce93d8”,
glowColor: “rgba(206,147,216,0.2)”,
image: “🌑”,
tagline: “It doesn’t guard the Edge to keep things out. It guards it to keep things in.”,
appearance: `The Null Warden does not have a consistent appearance. What is consistent: it occupies the space between things. In gaps between rocks, in the space between one step and the next, in the pause between a sentence and a reply. Characters who look directly at it report seeing nothing. Characters who look slightly away report seeing something they cannot describe clearly and do not try to describe again.

It communicates through proximity. The closer it comes, the more certain you become that something is expected of you. The certainty has no content. You simply know that something is required and that you are in the position of either providing it or not.`, lore: `The Hollow’s Edge is a boundary. The Null Warden is why it holds.

Before the current configuration of the Hollow Realm, the boundary didn’t hold — things moved between the Hollow and whatever exists beyond it without restriction. The record of what that was like is in the flooded sections of the Sunken Library. The record is considered the reason those sections were allowed to flood.

The Null Warden arrived — or was created, or has always existed, depending on which theoretical framework the Library scholars prefer — and established the current boundary conditions. The Hollow retained its character. The beyond retained its character. The interaction between them became regulated.

The players arrive at the Edge in Arc V because something is destabilising the boundary. The Null Warden is aware of this. It has not stopped it. Whether this is because it cannot or because it is allowing it to happen is the arc’s central question.`, motivation: `The Null Warden maintains the boundary. It is not clear that it has motivations beyond this in a way that players can interact with through normal means.

What has been established through indirect evidence: it prefers the boundary to hold. It has helped characters who were working to stabilise the Edge, in ways that were not obvious until later. It has impeded characters who were, knowingly or not, contributing to destabilisation. The help and impediment are proportional, patient, and without apparent emotion.

The arc question — whether it is preventing the destabilisation or allowing it — resolves in the final session. The answer depends on what the players have done.`,
strengths: [
“Domain absolute — within The Hollow’s Edge, it cannot be defeated, only negotiated with”,
“Boundary knowledge — knows everything that has crossed the Edge in either direction”,
“Null field — in its direct presence, all magical effects are suppressed. Gift Powers unusable.”,
“Patience — operates on timescales that make individual sessions irrelevant to it”,
“The boundary itself — can apply the Edge’s properties to characters: they become partially intangible, partially absent”,
“It cannot be surprised — has no blind spots, no social vulnerabilities, no leverage points”,
],
weaknesses: [
“Away from the Edge — its power diminishes significantly at distance. At the Kingdom ruins, it has no power at all”,
“Direct questions answered directly — it does not deceive. The answers may not be useful but they are true”,
“Characters who understand the boundary — if players genuinely grasp what the Edge is and does, it treats them differently”,
“The destabilisation — whatever is causing it weakens the Warden’s ability to act consistently”,
“Commitment — if the players formally commit to stabilising the boundary, it becomes an ally. It holds commitments made to it as binding”,
],
phases: [
{
phase: 1,
name: “The Boundary”,
hp: “Inapplicable”,
desc: “Environmental. Players feel its presence as a directional sense of wrongness when moving toward the Edge.”,
behavior: “Observes. Does not interfere with characters who are not approaching the deepest sections. Watches.”,
color: “#7b6fa0”,
},
{
phase: 2,
name: “The Warden”,
hp: “150 HP — within Edge only”,
desc: “Engages characters who reach the deep Edge. Not hostile — assessing.”,
behavior: “Tests each character. The test is different for each one and relates to their Shadow Trait or Destiny Thread. Pass: access. Fail: gentle removal to the boundary.”,
color: “#9c27b0”,
},
{
phase: 3,
name: “The Keeper”,
hp: “Becomes a character, not a combat encounter”,
desc: “If players have engaged honestly across the arc, the Warden meets them as a communicative presence.”,
behavior: “The session becomes a negotiation about the boundary’s future. All player choices in this session are permanent.”,
color: “#ce93d8”,
},
],
abilities: [
{
name: “Null Field”,
type: “Passive — at the Edge”,
desc: “All Gift Powers, enchantments, and magical abilities are suppressed in direct proximity. Base stats only.”,
},
{
name: “The Test”,
type: “Phase 2 — per character”,
desc: “Presents each character with a scenario derived from their character sheet. Success requires engaging honestly with their Shadow Trait or Destiny Thread.”,
},
{
name: “Boundary Step”,
type: “Active”,
desc: “Move any character to any location they have previously visited. Instantaneous. Used to remove characters who are not ready for the deep Edge.”,
},
{
name: “The Record”,
type: “Passive”,
desc: “Has observed every session. Knows every action taken by every character. Uses this in The Test.”,
},
{
name: “Edge Manifestation”,
type: “Phase 3 only”,
desc: “Becomes fully communicative. Can answer any question about the Hollow, its history, and the destabilisation. Chooses to answer questions it considers relevant to the arc.”,
},
],
lootDrops: [
{ item: “Edge Fragment (mythic enchantment material)”, chance: “Phase 2 pass — 60%”, note: “Material from the boundary itself. Can stabilise any enchantment permanently.” },
{ item: “Boundary Access (consequence)”, chance: “Phase 2 pass — 100%”, note: “The Warden marks the character as known. Future Edge encounters treat them as recognised.” },
{ item: “The Record’s Summary (arc lore item)”, chance: “Phase 3 — 100%”, note: “Complete account of what the Hollow has been doing and why the boundary is destabilising.” },
{ item: “The Warden’s Commitment (arc resolution)”, chance: “Phase 3 — conditional”, note: “If players commit to the boundary, the Warden commits back. The Edge stabilises. This is the win condition.” },
{ item: “What’s Beyond (forbidden knowledge)”, chance: “Phase 3 — one character only”, note: “One character, DM’s choice, learns what is on the other side of the Edge. This is permanent and private and will affect their Destiny Thread.” },
],
dmNotes: “The Null Warden is the game’s final argument. Every arc has been building toward this — every character’s Shadow Trait, every Destiny Thread, every choice. The session where players face the Warden should feel like a culmination, not a boss fight. Characters who have played with integrity will find the encounter different from characters who haven’t. The Hollow has been paying attention. This is where it shows.”,
},
];

const AR = {
Common:    { color:”#aaa”,    bg:“rgba(40,40,50,0.8)”,   label:“Common”    },
Uncommon:  { color:”#66bb6a”, bg:“rgba(10,40,15,0.8)”,   label:“Uncommon”  },
Rare:      { color:”#4fc3f7”, bg:“rgba(5,30,50,0.8)”,    label:“Rare”      },
Legendary: { color:”#ffd54f”, bg:“rgba(40,30,5,0.8)”,    label:“Legendary” },
Mythic:    { color:”#ce93d8”, bg:“rgba(30,5,50,0.8)”,    label:“Mythic”    },
Cursed:    { color:”#ef5350”, bg:“rgba(50,5,5,0.8)”,     label:“Cursed”    },
};

// ── ARMOR DATA ────────────────────────────────────
const ARMOR_DATA = {
Warrior: [
{
name: “Cracked Garrison Plate”,
slot: “Chest”, rarity: “Common”,
defense: “+1 DEF”,
effect: “None.”,
location: “Crumbling Kingdom ruins, abandoned barracks”,
findChance: “65%”,
lore: “Standard issue before the collapse. Still holds shape. Barely.”,
image: “🪖”,
},
{
name: “Ironhide Brigandine”,
slot: “Chest”, rarity: “Uncommon”,
defense: “+2 DEF”,
effect: “Reduce first damage taken each session by 1.”,
location: “Military outposts, Kingdom armory remnants”,
findChance: “35%”,
lore: “Layered iron rings over boiled leather. Favoured by soldiers who expected to survive.”,
image: “🛡”,
},
{
name: “Hollow-Forged Pauldrons”,
slot: “Shoulders”, rarity: “Rare”,
defense: “+2 DEF”,
effect: “Immune to first curse each arc. The Hollow metal rejects foreign influence.”,
location: “Underground Cavern forges — requires Hollow ore”,
findChance: “18%”,
lore: “Forged in the deep dark. The smith who made them doesn’t charge coin.”,
image: “⚔️”,
},
{
name: “The Warden’s Mantle”,
slot: “Full Armour”, rarity: “Legendary”,
defense: “+4 DEF”,
effect: “Allies within range gain +1 DEF. Once per arc, negate a killing blow on any player.”,
location: “Final room of the Crumbling Kingdom throne — one per arc”,
findChance: “5%”,
lore: “Worn by the last Warden of the Kingdom. The Kingdom fell. The armour didn’t.”,
image: “👑”,
},
{
name: “The Void Carapace”,
slot: “Full Armour”, rarity: “Mythic”,
defense: “+6 DEF”,
effect: “Damage below 3 is reduced to 0. Once per arc: enter an invulnerable stance for one round.”,
location: “The Hollow’s Edge — guarded by something that doesn’t have a name yet”,
findChance: “2%”,
lore: “It doesn’t look like armour. It looks like the Hollow decided to protect someone.”,
image: “🌑”,
},
],
Wizard: [
{
name: “Scholar’s Vestments”,
slot: “Robes”, rarity: “Common”,
defense: “+0 DEF”,
effect: “+1 to knowledge and research rolls.”,
location: “Sunken Library, academic ruins”,
findChance: “60%”,
lore: “Unremarkable. Functional. The ink stains are not all theirs.”,
image: “📜”,
},
{
name: “Warded Linen Robes”,
slot: “Robes”, rarity: “Uncommon”,
defense: “+1 DEF”,
effect: “First magical attack each session deals -1 damage.”,
location: “Healing Order supply caches, abandoned sanctuaries”,
findChance: “30%”,
lore: “Warded against the things scholars tend to attract.”,
image: “🔮”,
},
{
name: “Hollow-Threaded Mantle”,
slot: “Cloak”, rarity: “Rare”,
defense: “+1 DEF”,
effect: “+2 to all spell rolls in Hollow locations. The threads hum near active magic.”,
location: “The Hollow’s Edge — woven from transition-zone plant fibres”,
findChance: “15%”,
lore: “The weaver refused payment. Said the mantle chose who it was for.”,
image: “✨”,
},
{
name: “The Arcanist’s Aegis”,
slot: “Full Robes”, rarity: “Legendary”,
defense: “+2 DEF”,
effect: “Once per session, completely absorb one incoming spell. Once per arc, redirect it back.”,
location: “Sunken Library — restricted archive, locked section”,
findChance: “4%”,
lore: “The Arcanist who wrote the locking spell on the archive was wearing this when they did it.”,
image: “🏛”,
},
{
name: “The Void Shroud”,
slot: “Full Robes”, rarity: “Mythic”,
defense: “+3 DEF”,
effect: “All spell rolls +3. Once per arc: become incorporeal for one round — untouchable.”,
location: “Beyond The Hollow’s Edge. Nobody returns from where this is found.”,
findChance: “1%”,
lore: “Wearing it feels like standing just outside of everything.”,
image: “🌌”,
},
],
Rogue: [
{
name: “Roughspun Travelling Cloak”,
slot: “Cloak”, rarity: “Common”,
defense: “+0 DEF”,
effect: “+1 stealth in crowds and urban environments.”,
location: “Any market, travelling merchants”,
findChance: “70%”,
lore: “Looks like nothing. That’s the point.”,
image: “🧥”,
},
{
name: “Darkleather Armour”,
slot: “Chest”, rarity: “Uncommon”,
defense: “+1 DEF”,
effect: “+1 to all stealth and movement rolls.”,
location: “Criminal underground suppliers, black market”,
findChance: “35%”,
lore: “Treated with something that makes it quieter. Nobody asks what.”,
image: “🗡️”,
},
{
name: “Hollow-Shadow Wrap”,
slot: “Full Armour”, rarity: “Rare”,
defense: “+1 DEF”,
effect: “In Hollow locations, visually blend with surroundings. Detection rolls against them have -2.”,
location: “The Hollow’s Edge — dark transition zone materials”,
findChance: “14%”,
lore: “The wrap absorbs light slightly wrong. In the Hollow, it absorbs it completely right.”,
image: “🌑”,
},
{
name: “The Phantom Weave”,
slot: “Full Armour”, rarity: “Legendary”,
defense: “+2 DEF”,
effect: “Once per session: become undetectable for 3 rounds. Not invisible — genuinely unregistered.”,
location: “The Ghost Contract title reward — or bought at extreme cost from underground”,
findChance: “4%”,
lore: “There are those who believe the Phantom Weave doesn’t exist. They’re wearing it.”,
image: “👻”,
},
{
name: “The Last Shadow”,
slot: “Full Armour”, rarity: “Mythic”,
defense: “+3 DEF”,
effect: “All stealth and covert rolls +3. Once per arc: leave no evidence of ever being present.”,
location: “Given — not found. The underground gives it to whoever they decide deserves it.”,
findChance: “1%”,
lore: “The Hollow itself doesn’t track whoever wears this. That should be impossible.”,
image: “🌑”,
},
],
Healer: [
{
name: “Field Mender’s Wrap”,
slot: “Vest”, rarity: “Common”,
defense: “+0 DEF”,
effect: “Healing materials can be stored and accessed without searching inventory.”,
location: “Healing Order supply points, medical caches”,
findChance: “65%”,
lore: “Practical. Pocketed. Stained in ways that tell a story.”,
image: “💚”,
},
{
name: “Order Vestments”,
slot: “Robes”, rarity: “Uncommon”,
defense: “+1 DEF”,
effect: “NPCs in need automatically trust the wearer. No CHA roll required for first impression.”,
location: “Active Healing Order locations — requires certification”,
findChance: “28%”,
lore: “The symbol still carries weight even where the Order doesn’t reach.”,
image: “⚕️”,
},
{
name: “Hollow-Blessed Linen”,
slot: “Full Robes”, rarity: “Rare”,
defense: “+1 DEF”,
effect: “+2 to all healing rolls. Patients under active treatment cannot be targeted by Hollow entities.”,
location: “Deep Hollow locations — the linen forms in areas of high spiritual resonance”,
findChance: “12%”,
lore: “The Hollow doesn’t often give. When it does, it’s specific about who receives.”,
image: “✨”,
},
{
name: “The Saint’s Shroud”,
slot: “Full Robes”, rarity: “Legendary”,
defense: “+2 DEF”,
effect: “Once per arc, prevent any character death in range without a roll. No coin cost.”,
location: “Hollow locations of historic significance — where many have died and been brought back”,
findChance: “3%”,
lore: “It doesn’t look holy. It feels like standing next to someone who has never once given up.”,
image: “🕊”,
},
{
name: “The First Cloth”,
slot: “Full Robes”, rarity: “Mythic”,
defense: “+2 DEF”,
effect: “All healing at maximum effect automatically. Once per arc: reverse a death that occurred this session.”,
location: “Exists in one place at a time. It moves. Nobody controls where.”,
findChance: “1%”,
lore: “Older than the Healing Orders. Older than the Hollow in its current form. It predates the need for it.”,
image: “🌟”,
},
],
Merchant: [
{
name: “Traveller’s Coat”,
slot: “Coat”, rarity: “Common”,
defense: “+0 DEF”,
effect: “Hidden interior pockets. +1 to concealing small items on person.”,
location: “Any market, road suppliers”,
findChance: “70%”,
lore: “More pockets than seems reasonable. That’s intentional.”,
image: “🧥”,
},
{
name: “Guild Merchant Coat”,
slot: “Coat”, rarity: “Uncommon”,
defense: “+0 DEF”,
effect: “Guild NPCs extend immediate professional courtesy. +1 to all trade negotiations.”,
location: “Guild suppliers — requires membership in good standing”,
findChance: “30%”,
lore: “The cut says money. The badge says access. Both are accurate.”,
image: “💼”,
},
{
name: “Hollow-Lined Coat”,
slot: “Full Coat”, rarity: “Rare”,
defense: “+1 DEF”,
effect: “Items stored in coat are undetectable. Carry capacity doubled. Items do not add weight.”,
location: “Black market — extremely expensive, rarely available”,
findChance: “13%”,
lore: “The lining isn’t from here. Neither is what it does to the space inside.”,
image: “🌑”,
},
{
name: “The Broker’s Regalia”,
slot: “Full Outfit”, rarity: “Legendary”,
defense: “+1 DEF”,
effect: “Wearing this, no NPC can refuse to negotiate. Once per arc, set the opening terms of any deal.”,
location: “Guild vault — awarded for completing an impossible transaction”,
findChance: “4%”,
lore: “Every faction has seen this outfit. Every faction has sat across from it.”,
image: “👔”,
},
{
name: “The Exchange Mantle”,
slot: “Full Outfit”, rarity: “Mythic”,
defense: “+2 DEF”,
effect: “All CHA and LCK rolls +3. Once per arc: any transaction the wearer proposes is automatically accepted.”,
location: “The Hollow’s economy gives it — usually after a deal that shouldn’t have been possible”,
findChance: “1%”,
lore: “The Hollow has opinions about commerce. This is its endorsement.”,
image: “✨”,
},
],
Bard: [
{
name: “Performer’s Travelling Clothes”,
slot: “Outfit”, rarity: “Common”,
defense: “+0 DEF”,
effect: “+1 to first performance roll in any new location.”,
location: “Markets, road merchants, tailors”,
findChance: “70%”,
lore: “Good first impression. That’s all it needs to do.”,
image: “🎭”,
},
{
name: “Court Performer Costume”,
slot: “Outfit”, rarity: “Uncommon”,
defense: “+0 DEF”,
effect: “+1 CHA in formal and high-status settings. Noble NPCs grant access more readily.”,
location: “Court tailors, Guild connections”,
findChance: “28%”,
lore: “Made to be noticed in rooms where being noticed matters.”,
image: “👑”,
},
{
name: “Hollow-Woven Performance Wear”,
slot: “Full Outfit”, rarity: “Rare”,
defense: “+1 DEF”,
effect: “+2 to all performance rolls. In Hollow locations, the outfit seems to move with the music.”,
location: “Hollow’s Edge weavers — only takes commissions they find interesting”,
findChance: “12%”,
lore: “Worn once by someone during a performance that the Hollow still hasn’t finished responding to.”,
image: “✨”,
},
{
name: “The Legend’s Mantle”,
slot: “Full Outfit”, rarity: “Legendary”,
defense: “+1 DEF”,
effect: “Once per session, a performance automatically reaches its intended audience regardless of distance.”,
location: “Hollow locations associated with great stories — earned, not found”,
findChance: “4%”,
lore: “The Hollow gave this to someone once. They used it to tell a story that changed a war.”,
image: “📖”,
},
{
name: “The Memory’s Weave”,
slot: “Full Outfit”, rarity: “Mythic”,
defense: “+2 DEF”,
effect: “All CHA rolls +3. Once per arc: a performance becomes permanent world memory — the Hollow itself remembers it.”,
location: “Exists where great stories ended. The outfit is always already there.”,
findChance: “1%”,
lore: “The Hollow has been keeping this for the right performer. It is very patient.”,
image: “🌟”,
},
],
};

// ── ENCHANTMENT SLOTS ────────────────────────────
const ENCHANTMENT_DATA = [
{
name: “Hollow Whisper”,
slot: “Weapon”, rarity: “Uncommon”,
effect: “Weapon alerts carrier when ambush or hidden threat is within 30 feet. A faint resonance.”,
applyTo: “Any weapon”,
location: “Hollow’s Edge enchanters — offered freely to those they trust”,
findChance: “25%”,
lore: “The Hollow whispers constantly. This enchantment just makes one specific warning audible.”,
image: “👂”,
},
{
name: “Bloodseeker”,
slot: “Weapon”, rarity: “Rare”,
effect: “+2 attack rolls against wounded targets (below half HP).”,
applyTo: “Bladed weapons only”,
location: “Underground Cavern weapon-shapers — costs something personal”,
findChance: “15%”,
lore: “The weapon can smell it. Not metaphorically.”,
image: “🩸”,
},
{
name: “Void Edge”,
slot: “Weapon”, rarity: “Legendary”,
effect: “Strikes ignore all DEF bonuses from armour. The blade finds the gap that isn’t there.”,
applyTo: “Any weapon”,
location: “The Hollow’s Edge — enchanted by proximity to what’s beyond”,
findChance: “5%”,
lore: “The Hollow doesn’t distinguish between armour and absence. Neither does this.”,
image: “🌑”,
},
{
name: “Ward of Returning”,
slot: “Armour”, rarity: “Uncommon”,
effect: “Once per session, survive what would be a death blow at 1 HP instead.”,
applyTo: “Any armour piece”,
location: “Healing Order enchanters — high cost, waiting period”,
findChance: “20%”,
lore: “The Order started offering this after the third Warrior came back and asked why they were surprised.”,
image: “🛡”,
},
{
name: “Shadow Weave”,
slot: “Armour”, rarity: “Rare”,
effect: “-2 to all enemy detection rolls against wearer. Footsteps quieted permanently.”,
applyTo: “Light armour only”,
location: “Criminal underground enchanters — referral only”,
findChance: “13%”,
lore: “The enchanter doesn’t advertise. You find them because someone else found them first.”,
image: “🌑”,
},
{
name: “The Hollow’s Mark”,
slot: “Any”, rarity: “Legendary”,
effect: “Item becomes permanently bound to carrier. Cannot be stolen, lost, or destroyed. The Hollow will not allow it.”,
applyTo: “One item only — permanent”,
location: “The Hollow’s Edge — the Hollow must agree to grant it”,
findChance: “3%”,
lore: “The Hollow marks things it considers important. Being marked is not always comfortable.”,
image: “🔮”,
},
{
name: “Curse of the Returning”,
slot: “Any”, rarity: “Cursed”,
effect: “Item returns to carrier every session regardless of how they lost it. Cannot be gifted, traded, or discarded.”,
applyTo: “Any item”,
location: “Applied by hostile entities — or by foolish enchanters”,
findChance: “Random — when the Hollow decides”,
lore: “The line between blessing and curse depends entirely on whether you wanted to keep it.”,
image: “⚗️”,
},
{
name: “Resonance Bond”,
slot: “Weapon + Armour pair”, rarity: “Mythic”,
effect: “A matched weapon and armour set. When both are equipped, +2 to all rolls. Once per arc, the set activates — full stat boost for one round.”,
applyTo: “Requires both weapon and armour to be enchanted together”,
location: “The Sunken Library — a ritual documented once, never replicated”,
findChance: “1%”,
lore: “The Library has one record of this working. The scholar who performed it never wrote down how.”,
image: “✨”,
},
];

// ── CHESTS ───────────────────────────────────────
const CHEST_DATA = [
{
name: “Garrison Footlocker”,
type: “Chest”,
location: “Crumbling Kingdom — barracks, guardhouses, collapsed towers”,
image: “📦”,
spawnChance: “Very Common”,
locked: false,
loot: [
{ item: “Cracked Garrison Sword”, chance: “45%” },
{ item: “Standard coin pouch (d20 × 5 coins)”, chance: “60%” },
{ item: “Garrison Plate (damaged)”, chance: “30%” },
{ item: “Old orders — readable intel”, chance: “20%” },
{ item: “Healing supplies (1 use)”, chance: “25%” },
{ item: “Empty”, chance: “15%” },
],
note: “Scattered throughout the Kingdom ruins. Most have been picked through. Some haven’t.”,
},
{
name: “Scholar’s Sealed Case”,
type: “Locked Chest”,
location: “Sunken Library — reading rooms, restricted stacks, drowned corridors”,
image: “📚”,
spawnChance: “Uncommon”,
locked: true,
lockDifficulty: “INT roll 12+ or lockpick roll 14+”,
loot: [
{ item: “Hollow-Tuned Grimoire”, chance: “20%” },
{ item: “Forbidden text (roll for content)”, chance: “15%” },
{ item: “Arcane focus component”, chance: “35%” },
{ item: “Research notes — arc-relevant intel”, chance: “40%” },
{ item: “Rune-inscribed scroll (one-use spell)”, chance: “25%” },
{ item: “Empty — contents already taken”, chance: “20%” },
],
note: “The Library locks cases for a reason. The reason is usually still inside.”,
},
{
name: “Cavern Ore Cache”,
type: “Hidden Cache”,
location: “Underground Caverns — behind false walls, under collapsed sections”,
image: “⛏️”,
spawnChance: “Uncommon”,
locked: false,
loot: [
{ item: “Hollow ore (weapon enchantment material)”, chance: “40%” },
{ item: “Hollow-Edged Stiletto”, chance: “15%” },
{ item: “Tempered Hollow Steel Blade”, chance: “12%” },
{ item: “Cavern root compounds (healing material)”, chance: “35%” },
{ item: “Map fragment — marks another cache”, chance: “20%” },
{ item: “Crude miner’s tools”, chance: “30%” },
],
note: “The Cavern miners hid caches before things went wrong. They didn’t come back to collect them.”,
},
{
name: “Hollow Edge Reliquary”,
type: “Sealed Reliquary”,
location: “The Hollow’s Edge — placed in locations of significance by unknown hands”,
image: “🌑”,
spawnChance: “Rare”,
locked: true,
lockDifficulty: “Cannot be forced. Opens for the right person at the right moment.”,
loot: [
{ item: “Hollow-specific enchantment material”, chance: “50%” },
{ item: “Destiny Thread item (arc-relevant)”, chance: “30%” },
{ item: “Hollow-Forged armour piece”, chance: “20%” },
{ item: “A message from something that knew you were coming”, chance: “15%” },
{ item: “Nothing — it wasn’t time yet”, chance: “25%” },
],
note: “The Hollow puts these here deliberately. What’s inside is always relevant. The relevance isn’t always welcome.”,
},
{
name: “Merchant Guild Strongbox”,
type: “Locked Strongbox”,
location: “Trade routes, abandoned caravans, Guild outposts”,
image: “💰”,
spawnChance: “Uncommon”,
locked: true,
lockDifficulty: “CHA roll 13+ (credentials) or lockpick roll 16+”,
loot: [
{ item: “Coin cache (d20 × 50 coins)”, chance: “55%” },
{ item: “Trade contract — leverage over a faction”, chance: “25%” },
{ item: “Rare trade goods (negotiable value)”, chance: “30%” },
{ item: “Gilded Tongue enchantment scroll”, chance: “10%” },
{ item: “Guild membership papers (forged or real)”, chance: “15%” },
{ item: “Debt record — someone owes someone something”, chance: “35%” },
],
note: “The Guild strongboxes are tracked. Taking one has consequences. The Guild has a long memory.”,
},
{
name: “The Hollow’s Offering”,
type: “Mythic Cache”,
location: “Appears once per arc — location shifts. Cannot be searched for. Only found.”,
image: “✨”,
spawnChance: “Once per arc — DM discretion”,
locked: false,
loot: [
{ item: “Mythic weapon (class-appropriate)”, chance: “20%” },
{ item: “Mythic armour (class-appropriate)”, chance: “20%” },
{ item: “Destiny Thread advancement”, chance: “30%” },
{ item: “Enchantment: The Hollow’s Mark”, chance: “15%” },
{ item: “A truth the character needed to know”, chance: “40%” },
{ item: “Nothing material — but something changes”, chance: “25%” },
],
note: “The Hollow doesn’t often give. When it does, it’s considered a message.”,
},
];

// ── LOOT BINS ─────────────────────────────────────
const LOOT_BIN_DATA = [
{
name: “Collapsed Barracks Pile”,
type: “Debris Loot”,
location: “Crumbling Kingdom — anywhere soldiers were stationed”,
image: “🏚️”,
roll: “d20 roll to search”,
loot: [
{ item: “Garrison weapon (random tier)”, chance: “40%”, roll: “1–8” },
{ item: “Garrison armour (damaged)”, chance: “30%”, roll: “9–12” },
{ item: “Coin pouch (d6 × 10)”, chance: “35%”, roll: “13–16” },
{ item: “Useful personal item (intel, key)”, chance: “20%”, roll: “17–19” },
{ item: “Nothing useful”, chance: “25%”, roll: “1–5” },
{ item: “Trap — something left intentionally”, chance: “10%”, roll: “6” },
],
note: “The rubble has been searched before. Not everything was found.”,
},
{
name: “Forest Cache”,
type: “Hidden Stash”,
location: “Dark Enchanted Forest — base of specific trees, marked rocks, hollow stumps”,
image: “🌲”,
roll: “WIS roll 11+ to notice / SPD roll 13+ to access safely”,
loot: [
{ item: “Forest herb bundle (healing, 2 uses)”, chance: “50%”, roll: “8–20” },
{ item: “Hollow-adjacent plant material (enchantment use)”, chance: “25%”, roll: “14–20” },
{ item: “Rogue’s tool cache (lockpicks, poisons)”, chance: “20%”, roll: “16–20” },
{ item: “Marked map — something significant nearby”, chance: “15%”, roll: “18–20” },
{ item: “Warning left by previous finder”, chance: “30%”, roll: “5–10” },
],
note: “The Forest keeps things for people who know how to look. It also keeps things for things that are waiting.”,
},
{
name: “Cavern Mushroom Cluster”,
type: “Natural Resource”,
location: “Underground Caverns — damp corridors, near underground water”,
image: “🍄”,
roll: “Healer or Merchant identifies on sight / others roll INT 10+”,
loot: [
{ item: “Healing compound (1 use, +3 HP)”, chance: “45%”, roll: “Any” },
{ item: “Poison compound (1 use, applicable)”, chance: “20%”, roll: “Any” },
{ item: “Hollow-resonant spore (Wizard material)”, chance: “15%”, roll: “14+” },
{ item: “Toxic — failure to identify causes -1 HP”, chance: “20%”, roll: “Fail” },
],
note: “The Cavern grows things that respond to the Hollow’s proximity. Most are useful. Some are very much not.”,
},
{
name: “Sunken Library Reading Desk”,
type: “Document Cache”,
location: “Sunken Library — partially submerged reading stations”,
image: “📖”,
roll: “INT roll 10+ to find / 14+ to understand without damage”,
loot: [
{ item: “Arc-relevant research notes”, chance: “40%”, roll: “10–20” },
{ item: “Sealed letter — recipient in current arc”, chance: “20%”, roll: “15–20” },
{ item: “Partial map of a Hollow location”, chance: “25%”, roll: “12–20” },
{ item: “Forbidden text (requires Wizard to read safely)”, chance: “15%”, roll: “17–20” },
{ item: “Water-damaged — unreadable”, chance: “30%”, roll: “1–9” },
],
note: “The Library is still sorting itself. Some desks surface with their contents intact. Some don’t.”,
},
{
name: “Abandoned Merchant Cart”,
type: “Commercial Salvage”,
location: “Trade routes between Kingdom and Caverns — the roads nobody uses anymore”,
image: “🛒”,
roll: “Merchant identifies full contents without roll / others roll CHA 10+”,
loot: [
{ item: “Trade goods (sellable, variable value)”, chance: “55%”, roll: “6–20” },
{ item: “Travelling supplies (food, rope, tools)”, chance: “40%”, roll: “4–20” },
{ item: “Guild strongbox (locked, see chests)”, chance: “15%”, roll: “18–20” },
{ item: “Ledger — someone’s debt records”, chance: “20%”, roll: “14–20” },
{ item: “Evidence of what happened to the merchant”, chance: “35%”, roll: “Any” },
{ item: “Something that wasn’t declared on the manifest”, chance: “25%”, roll: “16–20” },
],
note: “The roads were abandoned for a reason. The carts that stopped moving are part of that story.”,
},
{
name: “Hollow Rift Deposit”,
type: “Anomalous Loot”,
location: “The Hollow’s Edge — where the boundary thins. Appears unpredictably.”,
image: “🌀”,
roll: “Automatic — if you find the rift, you find what it left. Roll d20 for tier.”,
loot: [
{ item: “Common item from an unknown source”, chance: “30%”, roll: “1–6” },
{ item: “Rare enchantment material”, chance: “25%”, roll: “7–12” },
{ item: “Item from a dead player’s inventory (lore)”, chance: “20%”, roll: “13–16” },
{ item: “Something that belongs to the current arc’s villain”, chance: “15%”, roll: “17–19” },
{ item: “Nothing — but the rift noticed you”, chance: “10%”, roll: “20” },
],
note: “The Hollow deposits things near its edge. Whether this is intentional is a question nobody has answered satisfactorily.”,
},
];

const C={bg:”#050510”,card:“rgba(20,16,50,0.9)”,border:“rgba(138,90,220,0.25)”,borderGlow:“rgba(138,90,220,0.6)”,purple:”#8a5adc”,purpleLight:”#b388ff”,blue:”#4fc3f7”,gold:”#ffd54f”,red:”#ef5350”,green:”#66bb6a”,text:”#e8e0ff”,dim:”#7b6fa0”,dimmer:”#3d3560”};
const starsBg=`radial-gradient(ellipse at 20% 50%,rgba(100,60,200,0.15) 0%,transparent 50%),radial-gradient(ellipse at 80% 20%,rgba(60,100,200,0.1) 0%,transparent 50%),radial-gradient(ellipse at 60% 80%,rgba(150,60,200,0.1) 0%,transparent 40%),linear-gradient(135deg,#050510 0%,#0a0825 50%,#050510 100%)`;
const S={
app:{fontFamily:”‘Georgia’,serif”,background:starsBg,color:C.text,minHeight:“100vh”,maxWidth:480,margin:“0 auto”},
header:{background:“rgba(8,6,25,0.97)”,padding:“10px 16px 8px”,position:“sticky”,top:0,zIndex:100,borderBottom:`1px solid ${C.borderGlow}`,boxShadow:“0 2px 20px rgba(138,90,220,0.3)”},
tabs:{display:“flex”,background:“rgba(8,6,25,0.95)”,borderBottom:`1px solid ${C.border}`,overflowX:“auto”,scrollbarWidth:“none”},
tab:(a)=>({padding:“9px 11px”,fontSize:“0.65rem”,color:a?C.purpleLight:C.dim,cursor:“pointer”,whiteSpace:“nowrap”,borderBottom:a?`2px solid ${C.purple}`:“2px solid transparent”,background:a?“rgba(138,90,220,0.1)”:“transparent”,flexShrink:0,transition:“all 0.2s”,fontFamily:“Arial,sans-serif”}),
panel:{padding:14},
card:{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:14,marginBottom:12,boxShadow:“0 2px 15px rgba(0,0,0,0.4)”},
cardGlow:{background:C.card,border:`1px solid ${C.borderGlow}`,borderRadius:10,padding:14,marginBottom:12,boxShadow:“0 0 20px rgba(138,90,220,0.15)”},
sectionTitle:{fontSize:“0.58rem”,textTransform:“uppercase”,letterSpacing:2.5,color:C.purple,marginBottom:8,fontFamily:“Arial,sans-serif”},
input:{width:“100%”,padding:“9px 11px”,background:“rgba(10,8,30,0.8)”,border:`1px solid ${C.border}`,borderRadius:6,color:C.text,fontSize:“0.82rem”,outline:“none”,boxSizing:“border-box”,fontFamily:“Arial,sans-serif”},
select:{width:“100%”,padding:“9px 11px”,background:“rgba(10,8,30,0.8)”,border:`1px solid ${C.border}`,borderRadius:6,color:C.text,fontSize:“0.82rem”,outline:“none”,boxSizing:“border-box”,fontFamily:“Arial,sans-serif”},
textarea:{width:“100%”,padding:“9px 11px”,background:“rgba(10,8,30,0.8)”,border:`1px solid ${C.border}`,borderRadius:6,color:C.text,fontSize:“0.82rem”,outline:“none”,resize:“vertical”,minHeight:70,boxSizing:“border-box”,fontFamily:“Arial,sans-serif”},
label:{display:“block”,fontSize:“0.68rem”,color:C.dim,marginBottom:4,fontFamily:“Arial,sans-serif”},
btn:(color=C.purple,textColor=”#fff”)=>({padding:“8px 16px”,borderRadius:6,border:“1px solid rgba(255,255,255,0.1)”,cursor:“pointer”,fontSize:“0.78rem”,fontWeight:“bold”,background:color,color:textColor,fontFamily:“Arial,sans-serif”}),
btnSm:(color=C.purple,textColor=”#fff”)=>({padding:“5px 10px”,borderRadius:5,border:“1px solid rgba(255,255,255,0.08)”,cursor:“pointer”,fontSize:“0.68rem”,fontWeight:“bold”,background:color,color:textColor,fontFamily:“Arial,sans-serif”}),
tag:(bg,col)=>({fontSize:“0.6rem”,padding:“2px 7px”,borderRadius:10,fontWeight:“bold”,background:bg,color:col,display:“inline-block”,fontFamily:“Arial,sans-serif”}),
playerCard:(prot,dead)=>({background:C.card,border:prot?`1px solid ${C.gold}`:`1px solid ${C.border}`,borderRadius:10,padding:12,marginBottom:10,opacity:dead?0.4:1,boxShadow:prot?“0 0 15px rgba(255,213,79,0.1)”:“none”}),
rollBox:{background:“rgba(5,4,18,0.9)”,border:`1px solid ${C.border}`,borderRadius:8,padding:12,margin:“8px 0”},
};

// ═══════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════

export default function App() {
const [tab,setTab]=useState(“classes”);
const [charClass,setCharClass]=useState(“Warrior”);
const [charSection,setCharSection]=useState(“story”);
const [weaponClass,setWeaponClass]=useState(“Warrior”);
const [weaponRarity,setWeaponRarity]=useState(“all”);
const [selectedWeapon,setSelectedWeapon]=useState(null);
const [arsenalTab,setArsenalTab]=useState(“armor”);
const [arsenalClass,setArsenalClass]=useState(“Warrior”);
const [selectedArsenal,setSelectedArsenal]=useState(null);
const [selectedChest,setSelectedChest]=useState(null);
const [selectedVillainLore,setSelectedVillainLore]=useState(null);
const [villainLoreSection,setVillainLoreSection]=useState(“lore”);
const [npcs,setNpcs]=useState([]);
const [selectedNpc,setSelectedNpc]=useState(null);
const [npcForm,setNpcForm]=useState({name:””,faction:””,location:””,disposition:“neutral”,status:“active”,notes:””,relationships:[]});
const [npcSearch,setNpcSearch]=useState(””);
const [villains,setVillains]=useState([]);
const [selectedVillain,setSelectedVillain]=useState(null);
const [villainForm,setVillainForm]=useState({name:””,title:””,arc:””,faction:””,location:””,maxHp:100,hp:100,phase:1,status:“active”,description:””,motivation:””,weakness:””,abilities:[],crimes:[],phases:[]});
const [refClass,setRefClass]=useState(“Warrior”);
const [rulesSection,setRulesSection]=useState(“overview”);
const [faqSearch,setFaqSearch]=useState(””);
const [faqOpen,setFaqOpen]=useState(null);

const updatePlayer=(id,updates)=>{};
const TABS=[
{id:“classes”,   label:“🧙 Classes”},
{id:“arsenal”,   label:“🗡 Arsenal”},
{id:“bestiary”,  label:“🎭 Bestiary”},
{id:“npcs”,      label:“👁 NPCs”},
{id:“villains”,  label:“🎭 Villains”},
{id:“rules”,     label:“📜 Rules”},
{id:“ref”,       label:“📖 Ref”},
];

const filteredFaq=FAQ.filter(f=>!faqSearch||f.q.toLowerCase().includes(faqSearch.toLowerCase())||f.a.toLowerCase().includes(faqSearch.toLowerCase()));
const rulesData=RULES_SECTIONS.find(r=>r.id===rulesSection);

return (
<div style={S.app}>
<div style={S.header}>
<div style={{display:“flex”,alignItems:“center”,justifyContent:“space-between”}}>
<div>
<div style={{fontWeight:“bold”,fontSize:“0.95rem”,color:”#fff”,letterSpacing:2,fontFamily:“Georgia,serif”}}>
<span style={{color:C.purpleLight}}>✦</span> THE HOLLOW REALM <span style={{color:C.purpleLight}}>✦</span>
</div>
<div style={{fontSize:“0.6rem”,color:C.dim,letterSpacing:1,fontFamily:“Arial,sans-serif”}}>MOON SQUAD RPG · WORLD BIBLE</div>
</div>
<div style={{fontSize:“0.6rem”,color:C.dim,fontFamily:“Arial,sans-serif”,textAlign:“right”}}>
<div style={{color:C.purpleLight,fontWeight:“bold”}}>LORE & REFERENCE</div>
<div>MAY 2, 2026</div>
</div>
</div>
</div>
<div style={S.tabs}>
{TABS.map(t=><div key={t.id} style={S.tab(tab===t.id)} onClick={()=>setTab(t.id)}>{t.label}</div>)}
</div>

```
  {tab === "classes" && (() => {
    const lore = CHARACTER_LORE[charClass];
    return (
      <div style={S.panel}>
        // Class Selector
        <div style={{ display:"flex", gap:6, overflowX:"auto", paddingBottom:4, marginBottom:12, scrollbarWidth:"none" }}>
          {CLASSES.map(c => {
            const l = CHARACTER_LORE[c];
            return (
              <button key={c} onClick={() => { setCharClass(c); setCharSection("story"); }} style={{
                padding:"8px 12px",
                borderRadius:20,
                border:`1px solid ${charClass===c ? l.color : C.border}`,
                background: charClass===c ? `rgba(${l.color.replace("#","").match(/.{2}/g).map(x=>parseInt(x,16)).join(",")},0.15)` : "rgba(10,8,30,0.8)",
                color: charClass===c ? l.color : C.dim,
                fontSize:"0.72rem",
                cursor:"pointer",
                whiteSpace:"nowrap",
                flexShrink:0,
                fontFamily:"Arial,sans-serif",
                fontWeight: charClass===c ? "bold" : "normal",
                transition:"all 0.2s",
              }}>{CLASS_ICON[c]} {c}</button>
            );
          })}
        </div>

        // Hero Card
        <div style={{
          background: lore.glowColor,
          border:`1px solid ${lore.color}50`,
          borderRadius:12,
          padding:16,
          marginBottom:12,
          boxShadow:`0 0 30px ${lore.glowColor}`,
          position:"relative",
          overflow:"hidden",
        }}>
          <div style={{ position:"absolute", top:-20, right:-20, fontSize:"5rem", opacity:0.08, userSelect:"none" }}>{lore.icon}</div>
          <div style={{ fontSize:"2rem", marginBottom:6 }}>{lore.icon}</div>
          <div style={{ fontWeight:"bold", fontSize:"1rem", color:"#fff", letterSpacing:1 }}>{lore.title}</div>
          <div style={{ fontSize:"0.7rem", color:lore.color, fontStyle:"italic", margin:"4px 0 8px", fontFamily:"Arial,sans-serif" }}>"{lore.tagline}"</div>
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            <span style={{ fontSize:"0.65rem", color:"#fff", background:"rgba(0,0,0,0.4)", padding:"3px 10px", borderRadius:10, fontFamily:"Arial,sans-serif" }}>❤️ {lore.hp} HP</span>
            <span style={{ fontSize:"0.65rem", color:lore.color, fontFamily:"Arial,sans-serif" }}>{CLASS_ICON[charClass]} {charClass}</span>
          </div>
        </div>

        // Section Nav
        <div style={{ display:"flex", gap:6, marginBottom:12, overflowX:"auto", scrollbarWidth:"none" }}>
          {[
            {id:"story",    label:"📖 Story"},
            {id:"combat",   label:"⚔️ Combat"},
            {id:"abilities",label:"✨ Abilities"},
            {id:"social",   label:"🤝 Social"},
            {id:"lore",     label:"🌑 Lore"},
          ].map(s => (
            <button key={s.id} onClick={() => setCharSection(s.id)} style={{
              padding:"6px 12px",
              borderRadius:16,
              border:`1px solid ${charSection===s.id ? lore.color : C.border}`,
              background: charSection===s.id ? `${lore.color}20` : "transparent",
              color: charSection===s.id ? lore.color : C.dim,
              fontSize:"0.68rem",
              cursor:"pointer",
              whiteSpace:"nowrap",
              flexShrink:0,
              fontFamily:"Arial,sans-serif",
              transition:"all 0.2s",
            }}>{s.label}</button>
          ))}
        </div>

        // Story Section
        {charSection === "story" && (
          <div style={S.card}>
            <div style={S.sectionTitle}>Origin & Background</div>
            {lore.origin.split("\n\n").map((para, i) => (
              <p key={i} style={{ fontSize:"0.78rem", color:C.dim, lineHeight:1.7, margin:"0 0 12px", fontFamily:"Arial,sans-serif" }}>{para}</p>
            ))}
            <div style={{ ...S.sectionTitle, marginTop:8 }}>Famous For</div>
            {lore.famousFor.map((f,i) => (
              <div key={i} style={{ display:"flex", gap:8, padding:"5px 0", borderBottom:`1px solid ${C.dimmer}`, fontSize:"0.75rem", color:C.text, fontFamily:"Arial,sans-serif" }}>
                <span style={{ color:lore.color }}>✦</span>{f}
              </div>
            ))}
          </div>
        )}

        // Combat Section
        {charSection === "combat" && (
          <div>
            <div style={S.card}>
              <div style={S.sectionTitle}>Strengths</div>
              {lore.strengths.map((s,i) => (
                <div key={i} style={{ display:"flex", gap:8, padding:"6px 0", borderBottom:`1px solid ${C.dimmer}`, fontSize:"0.75rem", color:C.text, fontFamily:"Arial,sans-serif" }}>
                  <span style={{ color:"#66bb6a", flexShrink:0 }}>▲</span>{s}
                </div>
              ))}
            </div>
            <div style={S.card}>
              <div style={S.sectionTitle}>Weaknesses</div>
              {lore.weaknesses.map((w,i) => (
                <div key={i} style={{ display:"flex", gap:8, padding:"6px 0", borderBottom:`1px solid ${C.dimmer}`, fontSize:"0.75rem", color:C.text, fontFamily:"Arial,sans-serif" }}>
                  <span style={{ color:"#ef5350", flexShrink:0 }}>▼</span>{w}
                </div>
              ))}
            </div>
          </div>
        )}

        // Abilities Section
        {charSection === "abilities" && (
          <div style={S.card}>
            <div style={S.sectionTitle}>Abilities & Powers</div>
            {lore.abilities.map((a,i) => (
              <div key={i} style={{ padding:"10px 0", borderBottom:`1px solid ${C.dimmer}` }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:3 }}>
                  <span style={{ fontWeight:"bold", color:lore.color, fontSize:"0.8rem" }}>{a.name}</span>
                  <span style={{ fontSize:"0.62rem", color:C.dim, fontFamily:"Arial,sans-serif", textAlign:"right", maxWidth:"50%" }}>{a.type}</span>
                </div>
                <div style={{ fontSize:"0.72rem", color:C.dim, lineHeight:1.6, fontFamily:"Arial,sans-serif" }}>{a.desc}</div>
              </div>
            ))}
          </div>
        )}

        // Social Section
        {charSection === "social" && (
          <div>
            <div style={S.card}>
              <div style={S.sectionTitle}>Historical Allies</div>
              {lore.allies.map((a,i) => (
                <div key={i} style={{ padding:"8px 0", borderBottom:`1px solid ${C.dimmer}` }}>
                  <div style={{ fontWeight:"bold", color:"#90caf9", fontSize:"0.78rem" }}>{a.name}</div>
                  <div style={{ fontSize:"0.7rem", color:C.dim, marginTop:2, fontFamily:"Arial,sans-serif" }}>{a.rel}</div>
                </div>
              ))}
            </div>
            <div style={S.card}>
              <div style={S.sectionTitle}>Historical Enemies & Tensions</div>
              {lore.enemies.map((e,i) => (
                <div key={i} style={{ padding:"8px 0", borderBottom:`1px solid ${C.dimmer}` }}>
                  <div style={{ fontWeight:"bold", color:"#ef5350", fontSize:"0.78rem" }}>{e.name}</div>
                  <div style={{ fontSize:"0.7rem", color:C.dim, marginTop:2, fontFamily:"Arial,sans-serif" }}>{e.rel}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        // Lore Section
        {charSection === "lore" && (
          <div style={S.card}>
            <div style={S.sectionTitle}>Recorded Lore</div>
            {lore.lore.split("\n\n").map((para,i) => (
              <p key={i} style={{ fontSize:"0.78rem", color:C.dim, lineHeight:1.7, margin:"0 0 14px", fontFamily:"Arial,sans-serif" }}>{para}</p>
            ))}
          </div>
        )}
      </div>
    );
  })()}



  {tab === "arsenal" && (
    <div style={S.panel}>

      {// ── Sub-tab nav ──}
      <div style={{ display:"flex", gap:6, marginBottom:14, overflowX:"auto", scrollbarWidth:"none" }}>
        {[
          { id:"armor",     label:"🛡 Armor"        },
          { id:"enchant",   label:"✨ Enchantments" },
          { id:"chests",    label:"📦 Chests"       },
          { id:"lootbins",  label:"🎲 Loot Bins"   },
        ].map(s => (
          <button key={s.id} onClick={() => setArsenalTab(s.id)} style={{
            padding:"8px 14px", borderRadius:20, cursor:"pointer", whiteSpace:"nowrap",
            flexShrink:0, fontFamily:"Arial,sans-serif", fontSize:"0.72rem",
            border:`1px solid ${arsenalTab===s.id ? C.purple : C.border}`,
            background: arsenalTab===s.id ? "rgba(138,90,220,0.15)" : "transparent",
            color: arsenalTab===s.id ? C.purpleLight : C.dim,
            fontWeight: arsenalTab===s.id ? "bold" : "normal",
          }}>{s.label}</button>
        ))}
      </div>

      {// ══ ARMOR ══}
      {arsenalTab === "armor" && (
        <div>
          {// Class selector}
          <div style={{ display:"flex", gap:6, overflowX:"auto", paddingBottom:4, marginBottom:12, scrollbarWidth:"none" }}>
            {CLASSES.map(c => (
              <button key={c} onClick={() => { setArsenalClass(c); setSelectedArsenal(null); }} style={{
                padding:"6px 10px", borderRadius:16, border:`1px solid ${arsenalClass===c ? C.purple : C.border}`,
                background: arsenalClass===c ? "rgba(138,90,220,0.15)" : "rgba(10,8,30,0.8)",
                color: arsenalClass===c ? C.purpleLight : C.dim,
                fontSize:"0.68rem", cursor:"pointer", whiteSpace:"nowrap", flexShrink:0,
                fontFamily:"Arial,sans-serif", fontWeight: arsenalClass===c ? "bold" : "normal",
              }}>{CLASS_ICON[c]} {c}</button>
            ))}
          </div>
          {(ARMOR_DATA[arsenalClass] || []).map((armor, i) => {
            const rar = AR[armor.rarity] || AR.Common;
            const key = `armor-${arsenalClass}-${i}`;
            const isOpen = selectedArsenal === key;
            return (
              <div key={i} style={{
                background: isOpen ? rar.bg : C.card,
                border:`1px solid ${isOpen ? rar.color : rar.color+"40"}`,
                borderRadius:10, marginBottom:10, overflow:"hidden",
                boxShadow: isOpen ? `0 0 18px ${rar.color}20` : "none",
                transition:"all 0.2s",
              }}>
                <div style={{ padding:"12px 14px", cursor:"pointer" }} onClick={() => setSelectedArsenal(isOpen ? null : key)}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                    <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                      <span style={{ fontSize:"1.6rem" }}>{armor.image}</span>
                      <div>
                        <div style={{ fontWeight:"bold", fontSize:"0.88rem", color: armor.rarity==="Mythic"||armor.rarity==="Legendary" ? rar.color : "#fff" }}>{armor.name}</div>
                        <div style={{ fontSize:"0.65rem", color:C.dim, fontFamily:"Arial,sans-serif" }}>{armor.slot}</div>
                      </div>
                    </div>
                    <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:4 }}>
                      <span style={{ fontSize:"0.6rem", padding:"2px 8px", borderRadius:10, background:rar.bg, color:rar.color, fontWeight:"bold", fontFamily:"Arial,sans-serif", border:`1px solid ${rar.color}50` }}>{rar.label}</span>
                      <span style={{ fontSize:"0.65rem", color:C.green, fontFamily:"Arial,sans-serif" }}>{armor.defense}</span>
                    </div>
                  </div>
                  {!isOpen && <div style={{ fontSize:"0.68rem", color:"#888", marginTop:6, fontFamily:"Arial,sans-serif" }}>{armor.effect}</div>}
                </div>
                {isOpen && (
                  <div style={{ padding:"0 14px 14px" }}>
                    <div style={{ height:1, background:`linear-gradient(90deg,transparent,${rar.color}40,transparent)`, marginBottom:12 }}/>
                    <div style={{ fontSize:"0.65rem", color:rar.color, textTransform:"uppercase", letterSpacing:1.5, marginBottom:4, fontFamily:"Arial,sans-serif" }}>Effect</div>
                    <div style={{ fontSize:"0.76rem", color:C.text, marginBottom:12, fontFamily:"Arial,sans-serif" }}>{armor.effect}</div>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:12 }}>
                      <div style={{ background:"rgba(10,8,30,0.8)", border:`1px solid ${C.border}`, borderRadius:6, padding:"8px 10px" }}>
                        <div style={{ fontSize:"0.58rem", color:rar.color, textTransform:"uppercase", letterSpacing:1.5, marginBottom:4, fontFamily:"Arial,sans-serif" }}>Found At</div>
                        <div style={{ fontSize:"0.7rem", color:C.text, fontFamily:"Arial,sans-serif" }}>{armor.location}</div>
                      </div>
                      <div style={{ background:"rgba(10,8,30,0.8)", border:`1px solid ${C.border}`, borderRadius:6, padding:"8px 10px" }}>
                        <div style={{ fontSize:"0.58rem", color:rar.color, textTransform:"uppercase", letterSpacing:1.5, marginBottom:4, fontFamily:"Arial,sans-serif" }}>Find Chance</div>
                        <div style={{ fontSize:"1rem", fontWeight:"bold", color:rar.color, fontFamily:"Arial,sans-serif" }}>{armor.findChance}</div>
                      </div>
                    </div>
                    <div style={{ background:`${rar.color}10`, border:`1px solid ${rar.color}30`, borderRadius:6, padding:"8px 10px" }}>
                      <div style={{ fontSize:"0.58rem", color:rar.color, textTransform:"uppercase", letterSpacing:1.5, marginBottom:4, fontFamily:"Arial,sans-serif" }}>Lore</div>
                      <div style={{ fontSize:"0.72rem", color:"#aaa", lineHeight:1.6, fontStyle:"italic", fontFamily:"Arial,sans-serif" }}>{armor.lore}</div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {// ══ ENCHANTMENTS ══}
      {arsenalTab === "enchant" && (
        <div>
          {ENCHANTMENT_DATA.map((enc, i) => {
            const rar = AR[enc.rarity] || AR.Common;
            const key = `enc-${i}`;
            const isOpen = selectedArsenal === key;
            return (
              <div key={i} style={{
                background: isOpen ? rar.bg : C.card,
                border:`1px solid ${isOpen ? rar.color : rar.color+"40"}`,
                borderRadius:10, marginBottom:10, overflow:"hidden",
                boxShadow: isOpen ? `0 0 18px ${rar.color}20` : "none",
              }}>
                <div style={{ padding:"12px 14px", cursor:"pointer" }} onClick={() => setSelectedArsenal(isOpen ? null : key)}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                    <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                      <span style={{ fontSize:"1.6rem" }}>{enc.image}</span>
                      <div>
                        <div style={{ fontWeight:"bold", fontSize:"0.88rem", color: rar.color }}>{enc.name}</div>
                        <div style={{ fontSize:"0.65rem", color:C.dim, fontFamily:"Arial,sans-serif" }}>Slot: {enc.slot} · {enc.applyTo}</div>
                      </div>
                    </div>
                    <span style={{ fontSize:"0.6rem", padding:"2px 8px", borderRadius:10, background:rar.bg, color:rar.color, fontWeight:"bold", fontFamily:"Arial,sans-serif", border:`1px solid ${rar.color}50` }}>{rar.label}</span>
                  </div>
                  {!isOpen && <div style={{ fontSize:"0.68rem", color:"#888", marginTop:6, fontFamily:"Arial,sans-serif" }}>{enc.effect}</div>}
                </div>
                {isOpen && (
                  <div style={{ padding:"0 14px 14px" }}>
                    <div style={{ height:1, background:`linear-gradient(90deg,transparent,${rar.color}40,transparent)`, marginBottom:12 }}/>
                    <div style={{ fontSize:"0.65rem", color:rar.color, textTransform:"uppercase", letterSpacing:1.5, marginBottom:4, fontFamily:"Arial,sans-serif" }}>Effect</div>
                    <div style={{ fontSize:"0.76rem", color:C.text, marginBottom:12, fontFamily:"Arial,sans-serif" }}>{enc.effect}</div>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:12 }}>
                      <div style={{ background:"rgba(10,8,30,0.8)", border:`1px solid ${C.border}`, borderRadius:6, padding:"8px 10px" }}>
                        <div style={{ fontSize:"0.58rem", color:rar.color, textTransform:"uppercase", letterSpacing:1.5, marginBottom:4, fontFamily:"Arial,sans-serif" }}>Found At</div>
                        <div style={{ fontSize:"0.7rem", color:C.text, fontFamily:"Arial,sans-serif" }}>{enc.location}</div>
                      </div>
                      <div style={{ background:"rgba(10,8,30,0.8)", border:`1px solid ${C.border}`, borderRadius:6, padding:"8px 10px" }}>
                        <div style={{ fontSize:"0.58rem", color:rar.color, textTransform:"uppercase", letterSpacing:1.5, marginBottom:4, fontFamily:"Arial,sans-serif" }}>Find Chance</div>
                        <div style={{ fontSize:"1rem", fontWeight:"bold", color:rar.color, fontFamily:"Arial,sans-serif" }}>{enc.findChance}</div>
                      </div>
                    </div>
                    <div style={{ background:`${rar.color}10`, border:`1px solid ${rar.color}30`, borderRadius:6, padding:"8px 10px" }}>
                      <div style={{ fontSize:"0.58rem", color:rar.color, textTransform:"uppercase", letterSpacing:1.5, marginBottom:4, fontFamily:"Arial,sans-serif" }}>Lore</div>
                      <div style={{ fontSize:"0.72rem", color:"#aaa", lineHeight:1.6, fontStyle:"italic", fontFamily:"Arial,sans-serif" }}>{enc.lore}</div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {// ══ CHESTS ══}
      {arsenalTab === "chests" && (
        <div>
          {CHEST_DATA.map((chest, i) => {
            const key = `chest-${i}`;
            const isOpen = selectedChest === key;
            return (
              <div key={i} style={{
                background: isOpen ? "rgba(30,20,60,0.95)" : C.card,
                border:`1px solid ${isOpen ? C.borderGlow : C.border}`,
                borderRadius:10, marginBottom:10, overflow:"hidden",
                boxShadow: isOpen ? "0 0 20px rgba(138,90,220,0.2)" : "none",
              }}>
                <div style={{ padding:"12px 14px", cursor:"pointer" }} onClick={() => setSelectedChest(isOpen ? null : key)}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                    <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                      <span style={{ fontSize:"1.8rem" }}>{chest.image}</span>
                      <div>
                        <div style={{ fontWeight:"bold", fontSize:"0.88rem", color:"#fff" }}>{chest.name}</div>
                        <div style={{ fontSize:"0.65rem", color:C.purple, fontFamily:"Arial,sans-serif", textTransform:"uppercase", letterSpacing:1 }}>{chest.type}</div>
                        {chest.locked && <div style={{ fontSize:"0.62rem", color:"#ef5350", fontFamily:"Arial,sans-serif" }}>🔒 {chest.lockDifficulty}</div>}
                      </div>
                    </div>
                    <span style={{ fontSize:"0.62rem", color:C.dim, fontFamily:"Arial,sans-serif", textAlign:"right" }}>{chest.spawnChance}</span>
                  </div>
                  <div style={{ fontSize:"0.65rem", color:C.dim, marginTop:6, fontFamily:"Arial,sans-serif" }}>📍 {chest.location}</div>
                </div>
                {isOpen && (
                  <div style={{ padding:"0 14px 14px" }}>
                    <div style={{ height:1, background:`linear-gradient(90deg,transparent,${C.border},transparent)`, marginBottom:12 }}/>
                    <div style={{ fontSize:"0.65rem", color:C.purple, textTransform:"uppercase", letterSpacing:1.5, marginBottom:8, fontFamily:"Arial,sans-serif" }}>Loot Table</div>
                    {chest.loot.map((l, j) => (
                      <div key={j} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"6px 0", borderBottom:`1px solid ${C.dimmer}` }}>
                        <span style={{ fontSize:"0.74rem", color:C.text, fontFamily:"Arial,sans-serif", flex:1 }}>{l.item}</span>
                        <span style={{ fontSize:"0.8rem", fontWeight:"bold", color:
                          parseFloat(l.chance) >= 40 ? C.green :
                          parseFloat(l.chance) >= 20 ? C.gold :
                          parseFloat(l.chance) >= 10 ? C.blue : "#ce93d8",
                          fontFamily:"Arial,sans-serif", minWidth:40, textAlign:"right"
                        }}>{l.chance}</span>
                      </div>
                    ))}
                    <div style={{ background:"rgba(138,90,220,0.05)", border:`1px solid ${C.border}`, borderRadius:6, padding:"8px 10px", marginTop:12 }}>
                      <div style={{ fontSize:"0.7rem", color:C.dim, lineHeight:1.6, fontStyle:"italic", fontFamily:"Arial,sans-serif" }}>{chest.note}</div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {// ══ LOOT BINS ══}
      {arsenalTab === "lootbins" && (
        <div>
          {LOOT_BIN_DATA.map((bin, i) => {
            const key = `bin-${i}`;
            const isOpen = selectedChest === key;
            return (
              <div key={i} style={{
                background: isOpen ? "rgba(25,15,50,0.95)" : C.card,
                border:`1px solid ${isOpen ? C.gold+"60" : C.border}`,
                borderRadius:10, marginBottom:10, overflow:"hidden",
                boxShadow: isOpen ? `0 0 15px rgba(255,213,79,0.1)` : "none",
              }}>
                <div style={{ padding:"12px 14px", cursor:"pointer" }} onClick={() => setSelectedChest(isOpen ? null : key)}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                    <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                      <span style={{ fontSize:"1.8rem" }}>{bin.image}</span>
                      <div>
                        <div style={{ fontWeight:"bold", fontSize:"0.88rem", color:"#fff" }}>{bin.name}</div>
                        <div style={{ fontSize:"0.65rem", color:C.gold, fontFamily:"Arial,sans-serif", textTransform:"uppercase", letterSpacing:1 }}>{bin.type}</div>
                      </div>
                    </div>
                  </div>
                  <div style={{ fontSize:"0.65rem", color:C.dim, marginTop:6, fontFamily:"Arial,sans-serif" }}>📍 {bin.location}</div>
                  <div style={{ fontSize:"0.62rem", color:C.purple, marginTop:3, fontFamily:"Arial,sans-serif" }}>🎲 {bin.roll}</div>
                </div>
                {isOpen && (
                  <div style={{ padding:"0 14px 14px" }}>
                    <div style={{ height:1, background:`linear-gradient(90deg,transparent,${C.gold}40,transparent)`, marginBottom:12 }}/>
                    <div style={{ fontSize:"0.65rem", color:C.gold, textTransform:"uppercase", letterSpacing:1.5, marginBottom:8, fontFamily:"Arial,sans-serif" }}>Loot Table</div>
                    {bin.loot.map((l, j) => (
                      <div key={j} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"6px 0", borderBottom:`1px solid ${C.dimmer}` }}>
                        <div style={{ flex:1 }}>
                          <div style={{ fontSize:"0.74rem", color:C.text, fontFamily:"Arial,sans-serif" }}>{l.item}</div>
                          <div style={{ fontSize:"0.6rem", color:C.dim, fontFamily:"Arial,sans-serif" }}>Roll: {l.roll}</div>
                        </div>
                        <span style={{ fontSize:"0.8rem", fontWeight:"bold", color:
                          parseFloat(l.chance) >= 40 ? C.green :
                          parseFloat(l.chance) >= 20 ? C.gold :
                          parseFloat(l.chance) >= 10 ? C.blue : "#ce93d8",
                          fontFamily:"Arial,sans-serif", minWidth:40, textAlign:"right"
                        }}>{l.chance}</span>
                      </div>
                    ))}
                    <div style={{ background:"rgba(255,213,79,0.05)", border:`1px solid ${C.gold}30`, borderRadius:6, padding:"8px 10px", marginTop:12 }}>
                      <div style={{ fontSize:"0.7rem", color:C.dim, lineHeight:1.6, fontStyle:"italic", fontFamily:"Arial,sans-serif" }}>{bin.note}</div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

    </div>
  )}



  {tab === "bestiary" && (
    <div style={S.panel}>

      {selectedVillainLore === null ? (
        // ── Villain Index ──
        <div>
          <div style={{ ...S.card, marginBottom:16 }}>
            <div style={S.sectionTitle}>🎭 Hollow Realm Bestiary</div>
            <div style={{ fontSize:"0.73rem", color:C.dim, lineHeight:1.6, fontFamily:"Arial,sans-serif" }}>
              Pre-built villains for each arc. Full lore, abilities, phase breakdowns, and loot drops. Tap any villain to expand.
            </div>
          </div>
          {VILLAIN_LORE_DATA.map(v => (
            <div key={v.id} onClick={() => { setSelectedVillainLore(v.id); setVillainLoreSection("lore"); }} style={{
              background:`linear-gradient(135deg, ${v.glowColor}, rgba(10,8,30,0.95))`,
              border:`1px solid ${v.color}50`,
              borderRadius:12, padding:16, marginBottom:12, cursor:"pointer",
              boxShadow:`0 0 20px ${v.color}15`,
              transition:"all 0.2s",
              position:"relative", overflow:"hidden",
            }}>
              <div style={{ position:"absolute", top:-10, right:-10, fontSize:"4rem", opacity:0.08 }}>{v.image}</div>
              <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
                <div style={{ fontSize:"2.2rem", flexShrink:0 }}>{v.image}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:"bold", fontSize:"0.95rem", color:"#fff" }}>{v.name}</div>
                  <div style={{ fontSize:"0.68rem", color:v.color, fontStyle:"italic", margin:"2px 0 4px", fontFamily:"Arial,sans-serif" }}>{v.title}</div>
                  <div style={{ fontSize:"0.65rem", color:C.dim, fontFamily:"Arial,sans-serif" }}>{v.arc} · {v.location}</div>
                  <div style={{ display:"flex", gap:6, marginTop:8, flexWrap:"wrap" }}>
                    <span style={{ fontSize:"0.6rem", padding:"2px 8px", borderRadius:10, background:`${v.color}20`, color:v.color, fontFamily:"Arial,sans-serif", border:`1px solid ${v.color}40` }}>{v.type}</span>
                    <span style={{ fontSize:"0.6rem", padding:"2px 8px", borderRadius:10, background:"rgba(239,83,80,0.15)", color:"#ef5350", fontFamily:"Arial,sans-serif" }}>⚠ {v.threat}</span>
                  </div>
                </div>
              </div>
              <div style={{ fontSize:"0.7rem", color:"#aaa", fontStyle:"italic", marginTop:10, fontFamily:"Arial,sans-serif" }}>"{v.tagline}"</div>
            </div>
          ))}
        </div>

      ) : (
        // ── Villain Detail ──
        (() => {
          const v = VILLAIN_LORE_DATA.find(x => x.id === selectedVillainLore);
          if (!v) return null;
          return (
            <div>
              {// Back button}
              <button style={{ ...S.btnSm("rgba(138,90,220,0.15)", C.purpleLight), marginBottom:14 }} onClick={() => setSelectedVillainLore(null)}>← Back to Bestiary</button>

              {// Hero card}
              <div style={{
                background:`linear-gradient(135deg, ${v.glowColor}, rgba(10,8,30,0.98))`,
                border:`1px solid ${v.color}60`,
                borderRadius:12, padding:16, marginBottom:14,
                boxShadow:`0 0 30px ${v.color}20`,
                position:"relative", overflow:"hidden",
              }}>
                <div style={{ position:"absolute", top:-20, right:-20, fontSize:"6rem", opacity:0.07 }}>{v.image}</div>
                <div style={{ fontSize:"3rem", marginBottom:6 }}>{v.image}</div>
                <div style={{ fontWeight:"bold", fontSize:"1.1rem", color:"#fff", letterSpacing:1 }}>{v.name}</div>
                <div style={{ fontSize:"0.72rem", color:v.color, fontStyle:"italic", margin:"4px 0 8px", fontFamily:"Arial,sans-serif" }}>{v.title}</div>
                <div style={{ fontSize:"0.65rem", color:C.dim, fontFamily:"Arial,sans-serif", marginBottom:6 }}>{v.arc} · {v.location}</div>
                <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                  <span style={{ fontSize:"0.6rem", padding:"2px 8px", borderRadius:10, background:`${v.color}20`, color:v.color, fontFamily:"Arial,sans-serif", border:`1px solid ${v.color}40` }}>{v.type}</span>
                  <span style={{ fontSize:"0.6rem", padding:"2px 8px", borderRadius:10, background:"rgba(239,83,80,0.15)", color:"#ef5350", fontFamily:"Arial,sans-serif" }}>⚠ {v.threat}</span>
                </div>
                <div style={{ fontSize:"0.73rem", color:"#aaa", fontStyle:"italic", marginTop:10, fontFamily:"Arial,sans-serif" }}>"{v.tagline}"</div>
              </div>

              {// Section nav}
              <div style={{ display:"flex", gap:5, marginBottom:14, overflowX:"auto", scrollbarWidth:"none" }}>
                {[
                  { id:"lore",      label:"📖 Lore"       },
                  { id:"combat",    label:"⚔️ Combat"     },
                  { id:"phases",    label:"🔄 Phases"     },
                  { id:"abilities", label:"✨ Abilities"  },
                  { id:"loot",      label:"💰 Loot"       },
                  { id:"dm",        label:"🎭 DM Notes"   },
                ].map(s => (
                  <button key={s.id} onClick={() => setVillainLoreSection(s.id)} style={{
                    padding:"6px 12px", borderRadius:16, cursor:"pointer", whiteSpace:"nowrap",
                    flexShrink:0, fontFamily:"Arial,sans-serif", fontSize:"0.68rem",
                    border:`1px solid ${villainLoreSection===s.id ? v.color : C.border}`,
                    background: villainLoreSection===s.id ? `${v.color}20` : "transparent",
                    color: villainLoreSection===s.id ? v.color : C.dim,
                  }}>{s.label}</button>
                ))}
              </div>

              {// LORE}
              {villainLoreSection === "lore" && (
                <div>
                  <div style={S.card}>
                    <div style={S.sectionTitle}>Appearance</div>
                    {v.appearance.split("\n\n").map((p,i) => <p key={i} style={{ fontSize:"0.76rem", color:C.dim, lineHeight:1.7, margin:"0 0 10px", fontFamily:"Arial,sans-serif" }}>{p}</p>)}
                  </div>
                  <div style={S.card}>
                    <div style={S.sectionTitle}>History</div>
                    {v.lore.split("\n\n").map((p,i) => <p key={i} style={{ fontSize:"0.76rem", color:C.dim, lineHeight:1.7, margin:"0 0 10px", fontFamily:"Arial,sans-serif" }}>{p}</p>)}
                  </div>
                  <div style={S.card}>
                    <div style={S.sectionTitle}>Motivation</div>
                    {v.motivation.split("\n\n").map((p,i) => <p key={i} style={{ fontSize:"0.76rem", color:C.dim, lineHeight:1.7, margin:"0 0 10px", fontFamily:"Arial,sans-serif" }}>{p}</p>)}
                  </div>
                </div>
              )}

              {// COMBAT}
              {villainLoreSection === "combat" && (
                <div>
                  <div style={S.card}>
                    <div style={S.sectionTitle}>Strengths</div>
                    {v.strengths.map((s,i) => (
                      <div key={i} style={{ display:"flex", gap:8, padding:"7px 0", borderBottom:`1px solid ${C.dimmer}`, fontSize:"0.75rem", color:C.text, fontFamily:"Arial,sans-serif" }}>
                        <span style={{ color:C.green, flexShrink:0 }}>▲</span>{s}
                      </div>
                    ))}
                  </div>
                  <div style={S.card}>
                    <div style={S.sectionTitle}>Weaknesses</div>
                    {v.weaknesses.map((w,i) => (
                      <div key={i} style={{ display:"flex", gap:8, padding:"7px 0", borderBottom:`1px solid ${C.dimmer}`, fontSize:"0.75rem", color:C.text, fontFamily:"Arial,sans-serif" }}>
                        <span style={{ color:C.red, flexShrink:0 }}>▼</span>{w}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {// PHASES}
              {villainLoreSection === "phases" && (
                <div>
                  {v.phases.map((ph, i) => (
                    <div key={i} style={{
                      background:`${ph.color}10`,
                      border:`1px solid ${ph.color}40`,
                      borderRadius:10, padding:14, marginBottom:10,
                      boxShadow:`0 0 15px ${ph.color}10`,
                    }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
                        <div>
                          <div style={{ fontWeight:"bold", color:ph.color, fontSize:"0.9rem" }}>Phase {ph.phase} — {ph.name}</div>
                          <div style={{ fontSize:"0.68rem", color:"#888", fontFamily:"Arial,sans-serif", marginTop:2 }}>{ph.hp}</div>
                        </div>
                        <div style={{ width:12, height:12, borderRadius:"50%", background:ph.color, boxShadow:`0 0 8px ${ph.color}`, flexShrink:0, marginTop:4 }}/>
                      </div>
                      <div style={{ fontSize:"0.75rem", color:C.text, marginBottom:8, fontFamily:"Arial,sans-serif" }}>{ph.desc}</div>
                      <div style={{ background:"rgba(10,8,30,0.6)", borderRadius:6, padding:"8px 10px", borderLeft:`2px solid ${ph.color}60` }}>
                        <div style={{ fontSize:"0.62rem", color:ph.color, textTransform:"uppercase", letterSpacing:1.5, marginBottom:4, fontFamily:"Arial,sans-serif" }}>Behavior</div>
                        <div style={{ fontSize:"0.72rem", color:C.dim, lineHeight:1.6, fontFamily:"Arial,sans-serif" }}>{ph.behavior}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {// ABILITIES}
              {villainLoreSection === "abilities" && (
                <div style={S.card}>
                  <div style={S.sectionTitle}>Abilities & Powers</div>
                  {v.abilities.map((a,i) => (
                    <div key={i} style={{ padding:"10px 0", borderBottom:`1px solid ${C.dimmer}` }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:4 }}>
                        <span style={{ fontWeight:"bold", color:v.color, fontSize:"0.82rem" }}>{a.name}</span>
                        <span style={{ fontSize:"0.62rem", color:C.dim, fontFamily:"Arial,sans-serif" }}>{a.type}</span>
                      </div>
                      <div style={{ fontSize:"0.73rem", color:C.dim, lineHeight:1.6, fontFamily:"Arial,sans-serif" }}>{a.desc}</div>
                    </div>
                  ))}
                </div>
              )}

              {// LOOT}
              {villainLoreSection === "loot" && (
                <div style={S.card}>
                  <div style={S.sectionTitle}>💰 Loot Drop Table</div>
                  {v.lootDrops.map((l,i) => (
                    <div key={i} style={{ padding:"10px 0", borderBottom:`1px solid ${C.dimmer}` }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:4 }}>
                        <span style={{ fontSize:"0.78rem", color:C.text, fontFamily:"Arial,sans-serif", flex:1 }}>{l.item}</span>
                        <span style={{ fontSize:"0.88rem", fontWeight:"bold", fontFamily:"Arial,sans-serif", marginLeft:10, flexShrink:0, color:
                          l.chance.includes("100") ? C.gold :
                          l.chance.includes("conditional") ? "#ce93d8" :
                          parseInt(l.chance) >= 60 ? C.green :
                          parseInt(l.chance) >= 35 ? C.gold :
                          parseInt(l.chance) >= 20 ? C.blue : "#ce93d8"
                        }}>{l.chance}</span>
                      </div>
                      <div style={{ fontSize:"0.68rem", color:"#888", lineHeight:1.5, fontFamily:"Arial,sans-serif", fontStyle:"italic" }}>{l.note}</div>
                    </div>
                  ))}
                </div>
              )}

              {// DM NOTES}
              {villainLoreSection === "dm" && (
                <div style={{
                  background:"rgba(30,20,10,0.9)",
                  border:`1px solid ${C.gold}30`,
                  borderRadius:10, padding:16,
                  boxShadow:`0 0 15px rgba(255,213,79,0.05)`,
                }}>
                  <div style={{ fontSize:"0.62rem", color:C.gold, textTransform:"uppercase", letterSpacing:2, marginBottom:10, fontFamily:"Arial,sans-serif" }}>🎭 DM Eyes Only</div>
                  <div style={{ fontSize:"0.78rem", color:"#ccc", lineHeight:1.8, fontFamily:"Arial,sans-serif" }}>{v.dmNotes}</div>
                </div>
              )}

            </div>
          );
        })()
      )}

    </div>
  )}
```

{tab===“npcs”&&(
<div style={S.panel}>
<div style={{display:“flex”,gap:8,marginBottom:12}}>
<input style={{…S.input,flex:1}} placeholder=“🔍 Search NPCs…” value={npcSearch} onChange={e=>setNpcSearch(e.target.value)}/>
<button style={S.btn(C.purple)} onClick={()=>{setNpcForm({name:””,faction:””,location:””,disposition:“neutral”,status:“active”,notes:””,relationships:[]});setSelectedNpc(“new”);}}>+ NPC</button>
</div>
{npcs.length===0&&<div style={{textAlign:“center”,color:C.dimmer,padding:“50px 16px”,fontSize:“0.82rem”}}><div style={{fontSize:“2rem”,marginBottom:10}}>👁</div><div>No NPCs recorded yet.</div></div>}
{npcs.filter(n=>!npcSearch||n.name.toLowerCase().includes(npcSearch.toLowerCase())||n.faction.toLowerCase().includes(npcSearch.toLowerCase())).map(npc=>{
const disp=NPC_DISPOSITIONS[npc.disposition]||NPC_DISPOSITIONS.neutral;
const stat=NPC_STATUSES[npc.status]||NPC_STATUSES.active;
return(
<div key={npc.id} style={{background:C.card,border:`1px solid ${disp.color}40`,borderRadius:10,padding:12,marginBottom:10,opacity:npc.status===“dead”?0.45:1}}>
<div style={{display:“flex”,justifyContent:“space-between”,alignItems:“flex-start”}}>
<div>
<div style={{fontWeight:“bold”,fontSize:“0.95rem”,color:”#fff”}}>{disp.icon} {npc.name}</div>
<div style={{fontSize:“0.65rem”,color:C.purple,textTransform:“uppercase”,letterSpacing:1,fontFamily:“Arial,sans-serif”,marginTop:2}}>{npc.faction}</div>
{npc.location&&<div style={{fontSize:“0.65rem”,color:C.dim,fontFamily:“Arial,sans-serif”}}>📍 {npc.location}</div>}
</div>
<div style={{display:“flex”,flexDirection:“column”,alignItems:“flex-end”,gap:4}}>
<span style={{fontSize:“0.6rem”,padding:“2px 8px”,borderRadius:10,background:disp.bg,color:disp.color,fontWeight:“bold”,fontFamily:“Arial,sans-serif”}}>{disp.label}</span>
<span style={{fontSize:“0.6rem”,padding:“2px 8px”,borderRadius:10,background:“rgba(10,8,30,0.8)”,color:stat.color,fontFamily:“Arial,sans-serif”}}>{stat.label}</span>
</div>
</div>
{npc.notes&&<div style={{fontSize:“0.7rem”,color:”#888”,marginTop:8,lineHeight:1.5,fontFamily:“Arial,sans-serif”,borderLeft:`2px solid ${disp.color}50`,paddingLeft:8}}>{npc.notes}</div>}
{(npc.relationships||[]).length>0&&(
<div style={{marginTop:8}}>
<div style={{fontSize:“0.6rem”,color:C.dim,textTransform:“uppercase”,letterSpacing:1.5,marginBottom:4,fontFamily:“Arial,sans-serif”}}>Player Memory</div>
{npc.relationships.map((r,i)=>(
<div key={i} style={{display:“flex”,justifyContent:“space-between”,padding:“4px 0”,borderBottom:`1px solid ${C.dimmer}`,fontSize:“0.68rem”,fontFamily:“Arial,sans-serif”}}>
<span style={{color:C.purpleLight}}>@{r.player}</span>
<span style={{color:”#888”,maxWidth:“65%”,textAlign:“right”}}>{r.memory}</span>
</div>
))}
</div>
)}
<button style={{…S.btnSm(“rgba(138,90,220,0.15)”,C.purpleLight),marginTop:10}} onClick={()=>{setNpcForm({…npc});setSelectedNpc(npc.id);}}>Edit</button>
</div>
);
})}
{selectedNpc&&(()=>{
const isNew=selectedNpc===“new”;
const save=()=>{
if(!npcForm.name.trim())return alert(“Name required.”);
if(isNew){setNpcs(prev=>[…prev,{…npcForm,id:Date.now()}]);}
else{setNpcs(prev=>prev.map(n=>n.id===selectedNpc?{…n,…npcForm}:n));}
setNpcForm({name:””,faction:””,location:””,disposition:“neutral”,status:“active”,notes:””,relationships:[]});
setSelectedNpc(null);
};
return(
<div style={{position:“fixed”,inset:0,background:“rgba(2,1,15,0.97)”,zIndex:200,overflowY:“auto”,padding:16}}>
<div style={{background:“rgba(15,12,40,0.99)”,border:`1px solid ${C.borderGlow}`,borderRadius:12,padding:18,maxWidth:500,margin:“auto”}}>
<div style={{display:“flex”,justifyContent:“space-between”,alignItems:“center”,marginBottom:16}}>
<div style={{fontWeight:“bold”,fontSize:“0.95rem”,color:”#fff”}}>{isNew?“👁 New NPC”:`👁 Edit — ${npcForm.name}`}</div>
<button style={{background:“none”,border:“none”,color:C.dim,fontSize:“1.2rem”,cursor:“pointer”}} onClick={()=>setSelectedNpc(null)}>✕</button>
</div>
<label style={S.label}>Name</label><input style={{…S.input,marginBottom:10}} value={npcForm.name} onChange={e=>setNpcForm(p=>({…p,name:e.target.value}))} placeholder=“NPC name…”/>
<label style={S.label}>Faction</label>
<select style={{…S.select,marginBottom:10}} value={npcForm.faction} onChange={e=>setNpcForm(p=>({…p,faction:e.target.value}))}>
<option value="">— Select Faction —</option>
{NPC_FACTIONS.map(f=><option key={f}>{f}</option>)}
</select>
<label style={S.label}>Location</label><input style={{…S.input,marginBottom:10}} value={npcForm.location} onChange={e=>setNpcForm(p=>({…p,location:e.target.value}))} placeholder=“Where are they now…”/>
<label style={S.label}>Disposition</label>
<div style={{display:“grid”,gridTemplateColumns:“repeat(3,1fr)”,gap:6,marginBottom:10}}>
{Object.entries(NPC_DISPOSITIONS).map(([key,val])=>(
<button key={key} style={{…S.btnSm(npcForm.disposition===key?val.bg:“rgba(10,8,30,0.8)”,npcForm.disposition===key?val.color:C.dim),border:`1px solid ${npcForm.disposition===key?val.color:C.border}`}} onClick={()=>setNpcForm(p=>({…p,disposition:key}))}>{val.icon} {val.label}</button>
))}
</div>
<label style={S.label}>Status</label>
<div style={{display:“grid”,gridTemplateColumns:“repeat(4,1fr)”,gap:6,marginBottom:10}}>
{Object.entries(NPC_STATUSES).map(([key,val])=>(
<button key={key} style={{…S.btnSm(npcForm.status===key?“rgba(30,25,60,0.9)”:“rgba(10,8,30,0.8)”,npcForm.status===key?val.color:C.dim),border:`1px solid ${npcForm.status===key?val.color:C.border}`}} onClick={()=>setNpcForm(p=>({…p,status:key}))}>{val.label}</button>
))}
</div>
<label style={S.label}>Notes</label><textarea style={{…S.textarea,marginBottom:10}} value={npcForm.notes} onChange={e=>setNpcForm(p=>({…p,notes:e.target.value}))} placeholder=“Who are they, what do they want…”/>
<div style={{...S.sectionTitle,marginTop:4}}>Player Memory</div>
{(npcForm.relationships||[]).map((r,i)=>(
<div key={i} style={{display:“flex”,gap:6,marginBottom:6,alignItems:“center”}}>
<input style={{…S.input,flex:“0 0 100px”}} value={r.player} onChange={e=>{const u=[…npcForm.relationships];u[i]={…u[i],player:e.target.value};setNpcForm(p=>({…p,relationships:u}));}} placeholder=”@username”/>
<input style={{…S.input,flex:1}} value={r.memory} onChange={e=>{const u=[…npcForm.relationships];u[i]={…u[i],memory:e.target.value};setNpcForm(p=>({…p,relationships:u}));}} placeholder=“What they remember…”/>
<button style={{background:“none”,border:“none”,color:C.dim,cursor:“pointer”}} onClick={()=>setNpcForm(p=>({…p,relationships:p.relationships.filter((_,j)=>j!==i)}))}>✕</button>
</div>
))}
<button style={{…S.btnSm(“rgba(138,90,220,0.15)”,C.purpleLight),marginBottom:16}} onClick={()=>setNpcForm(p=>({…p,relationships:[…(p.relationships||[]),{player:””,memory:””}]}))}>+ Add Player Memory</button>
<div style={{display:“flex”,gap:8,flexWrap:“wrap”}}>
<button style={S.btn(C.purple)} onClick={save}>{isNew?“✦ Add NPC”:“✦ Save”}</button>
{!isNew&&<button style={S.btn(“rgba(60,10,10,0.8)”,C.red)} onClick={()=>{if(window.confirm(“Remove NPC?”)){setNpcs(prev=>prev.filter(n=>n.id!==selectedNpc));setSelectedNpc(null);}}}>Remove</button>}
<button style={S.btn(“rgba(20,16,50,0.8)”,C.dim)} onClick={()=>setSelectedNpc(null)}>Cancel</button>
</div>
</div>
</div>
);
})()}
</div>
)}

{tab===“villains”&&(
<div style={S.panel}>
<div style={{display:“flex”,justifyContent:“space-between”,alignItems:“center”,marginBottom:12}}>
<div style={{fontSize:“0.7rem”,color:C.dim,fontFamily:“Arial,sans-serif”}}>{villains.length} villain{villains.length!==1?“s”:””} tracked</div>
<button style={S.btn(C.purple)} onClick={()=>{setVillainForm({name:””,title:””,arc:””,faction:””,location:””,maxHp:100,hp:100,phase:1,status:“active”,description:””,motivation:””,weakness:””,abilities:[],crimes:[],phases:[]});setSelectedVillain(“new”);}}>+ Villain</button>
</div>
{villains.length===0&&<div style={{textAlign:“center”,color:C.dimmer,padding:“50px 16px”,fontSize:“0.82rem”}}><div style={{fontSize:“2rem”,marginBottom:10}}>🎭</div><div>No villains yet.</div><div style={{fontSize:“0.7rem”,marginTop:6,color:C.dim}}>The Hollow is quiet. For now.</div></div>}
{villains.map(v=>{
const stat=VILLAIN_STATUSES[v.status]||VILLAIN_STATUSES.active;
const hpPct=Math.max(0,(v.hp/v.maxHp)*100);
const hpColor=hpPct>60?”#ef5350”:hpPct>30?”#ff9800”:”#ffd54f”;
const phaseColor=VILLAIN_PHASE_COLORS[(v.phase-1)%VILLAIN_PHASE_COLORS.length];
return(
<div key={v.id} style={{background:“rgba(20,8,8,0.9)”,border:`1px solid ${stat.color}40`,borderRadius:10,padding:14,marginBottom:12,opacity:v.status===“defeated”?0.5:1}}>
<div style={{display:“flex”,justifyContent:“space-between”,alignItems:“flex-start”,marginBottom:10}}>
<div>
<div style={{fontWeight:“bold”,fontSize:“1rem”,color:”#fff”}}>{v.name}</div>
{v.title&&<div style={{fontSize:“0.7rem”,color:stat.color,fontStyle:“italic”,fontFamily:“Arial,sans-serif”}}>{v.title}</div>}
{v.arc&&<div style={{fontSize:“0.65rem”,color:C.dim,fontFamily:“Arial,sans-serif”}}>Arc: {v.arc}</div>}
</div>
<div style={{display:“flex”,flexDirection:“column”,alignItems:“flex-end”,gap:4}}>
<span style={{fontSize:“0.6rem”,padding:“2px 8px”,borderRadius:10,background:stat.bg,color:stat.color,fontWeight:“bold”,fontFamily:“Arial,sans-serif”}}>{stat.label}</span>
<span style={{fontSize:“0.6rem”,padding:“2px 8px”,borderRadius:10,background:`${phaseColor}20`,color:phaseColor,fontFamily:“Arial,sans-serif”}}>Phase {v.phase}</span>
</div>
</div>
<div style={{marginBottom:10}}>
<div style={{display:“flex”,justifyContent:“space-between”,fontSize:“0.65rem”,color:C.dim,marginBottom:3,fontFamily:“Arial,sans-serif”}}><span>Threat HP</span><span style={{color:hpColor,fontWeight:“bold”}}>{v.hp} / {v.maxHp}</span></div>
<div style={{height:8,background:“rgba(255,255,255,0.05)”,borderRadius:4,overflow:“hidden”}}>
<div style={{height:“100%”,width:`${hpPct}%`,background:`linear-gradient(90deg,${hpColor},${hpColor}99)`,borderRadius:4,boxShadow:`0 0 10px ${hpColor}`,transition:“width 0.4s”}}/>
</div>
<div style={{display:“flex”,gap:5,marginTop:6}}>
{[-20,-10,-5].map(d=><button key={d} style={S.btnSm(“rgba(60,10,10,0.8)”,”#ef5350”)} onClick={()=>setVillains(prev=>prev.map(x=>x.id===v.id?{…x,hp:Math.max(0,x.hp+d)}:x))}>{d}</button>)}
<div style={{flex:1}}/>
{[5,10,20].map(d=><button key={d} style={S.btnSm(“rgba(10,40,10,0.8)”,”#66bb6a”)} onClick={()=>setVillains(prev=>prev.map(x=>x.id===v.id?{…x,hp:Math.min(x.maxHp,x.hp+d)}:x))}>+{d}</button>)}
</div>
</div>
<div style={{display:“flex”,gap:6,marginBottom:10,alignItems:“center”,flexWrap:“wrap”}}>
<span style={{fontSize:“0.65rem”,color:C.dim,fontFamily:“Arial,sans-serif”}}>Phase:</span>
{[1,2,3,4].map(p=><button key={p} style={{…S.btnSm(v.phase===p?`${VILLAIN_PHASE_COLORS[p-1]}30`:“rgba(10,8,30,0.8)”,v.phase===p?VILLAIN_PHASE_COLORS[p-1]:C.dim),border:`1px solid ${v.phase===p?VILLAIN_PHASE_COLORS[p-1]:C.border}`}} onClick={()=>setVillains(prev=>prev.map(x=>x.id===v.id?{…x,phase:p}:x))}>{p}</button>)}
<div style={{flex:1}}/>
{Object.entries(VILLAIN_STATUSES).map(([key,val])=>(
<button key={key} style={{…S.btnSm(v.status===key?val.bg:“rgba(10,8,30,0.8)”,v.status===key?val.color:C.dimmer),border:`1px solid ${v.status===key?val.color:C.border}`,fontSize:“0.58rem”}} onClick={()=>setVillains(prev=>prev.map(x=>x.id===v.id?{…x,status:key}:x))}>{val.label}</button>
))}
</div>
{v.weakness&&<div style={{background:“rgba(255,213,79,0.05)”,border:“1px solid rgba(255,213,79,0.2)”,borderRadius:6,padding:“6px 10px”,marginBottom:8,fontSize:“0.7rem”,color:”#ffd54f”,fontFamily:“Arial,sans-serif”}}>⚠ Weakness: {v.weakness}</div>}
{(v.crimes||[]).length>0&&(
<div style={{marginBottom:8}}>
<div style={{fontSize:“0.6rem”,color:C.dim,textTransform:“uppercase”,letterSpacing:1.5,marginBottom:4,fontFamily:“Arial,sans-serif”}}>What They’ve Done</div>
{v.crimes.map((c,i)=><div key={i} style={{display:“flex”,gap:8,padding:“4px 0”,borderBottom:`1px solid ${C.dimmer}`,fontSize:“0.7rem”,fontFamily:“Arial,sans-serif”}}><span style={{color:”#ef5350”,flexShrink:0}}>✦</span><span style={{color:”#ccc”}}>{c.victim&&<span style={{color:”#b388ff”}}>@{c.victim} — </span>}{c.act}</span></div>)}
</div>
)}
{(v.phases||[]).filter(p=>p).length>0&&(
<div style={{marginBottom:8}}>
{v.phases.map((p,i)=>p&&<div key={i} style={{padding:“5px 8px”,marginBottom:4,borderRadius:5,background:v.phase===i+1?`${VILLAIN_PHASE_COLORS[i]}15`:“rgba(10,8,30,0.5)”,border:`1px solid ${v.phase===i+1?VILLAIN_PHASE_COLORS[i]+"50":C.dimmer}`,fontSize:“0.68rem”,color:v.phase===i+1?”#fff”:C.dim,fontFamily:“Arial,sans-serif”}}><span style={{color:VILLAIN_PHASE_COLORS[i],fontWeight:“bold”}}>Phase {i+1}: </span>{p}</div>)}
</div>
)}
<button style={{…S.btnSm(“rgba(239,83,80,0.15)”,”#ef5350”),marginTop:4}} onClick={()=>{setVillainForm({…v});setSelectedVillain(v.id);}}>Edit</button>
</div>
);
})}
{selectedVillain&&(()=>{
const isNew=selectedVillain===“new”;
const save=()=>{
if(!villainForm.name.trim())return alert(“Name required.”);
if(isNew){setVillains(prev=>[…prev,{…villainForm,id:Date.now()}]);}
else{setVillains(prev=>prev.map(v=>v.id===selectedVillain?{…v,…villainForm}:v));}
setSelectedVillain(null);
};
return(
<div style={{position:“fixed”,inset:0,background:“rgba(2,1,15,0.97)”,zIndex:200,overflowY:“auto”,padding:16}}>
<div style={{background:“rgba(15,8,8,0.99)”,border:“1px solid rgba(239,83,80,0.4)”,borderRadius:12,padding:18,maxWidth:500,margin:“auto”}}>
<div style={{display:“flex”,justifyContent:“space-between”,alignItems:“center”,marginBottom:16}}>
<div style={{fontWeight:“bold”,fontSize:“0.95rem”,color:”#fff”}}>{isNew?“🎭 New Villain”:`🎭 ${villainForm.name}`}</div>
<button style={{background:“none”,border:“none”,color:C.dim,fontSize:“1.2rem”,cursor:“pointer”}} onClick={()=>setSelectedVillain(null)}>✕</button>
</div>
<label style={S.label}>Name</label><input style={{…S.input,marginBottom:10}} value={villainForm.name} onChange={e=>setVillainForm(p=>({…p,name:e.target.value}))} placeholder=“Villain name…”/>
<label style={S.label}>Title / Epithet</label><input style={{…S.input,marginBottom:10}} value={villainForm.title} onChange={e=>setVillainForm(p=>({…p,title:e.target.value}))} placeholder=“e.g. The Warden of Ash…”/>
<label style={S.label}>Arc</label><input style={{…S.input,marginBottom:10}} value={villainForm.arc} onChange={e=>setVillainForm(p=>({…p,arc:e.target.value}))} placeholder=“Which arc are they active in…”/>
<label style={S.label}>Location</label><input style={{…S.input,marginBottom:10}} value={villainForm.location} onChange={e=>setVillainForm(p=>({…p,location:e.target.value}))} placeholder=“Where are they operating…”/>
<label style={S.label}>Motivation</label><textarea style={{…S.textarea,marginBottom:10}} value={villainForm.motivation} onChange={e=>setVillainForm(p=>({…p,motivation:e.target.value}))} placeholder=“What do they want and why…”/>
<label style={S.label}>Known Weakness</label><input style={{…S.input,marginBottom:10}} value={villainForm.weakness} onChange={e=>setVillainForm(p=>({…p,weakness:e.target.value}))} placeholder=“What can stop them…”/>
<div style={{display:“flex”,gap:8,marginBottom:10}}>
<div style={{flex:1}}><label style={S.label}>Max HP</label><input type=“number” style={S.input} value={villainForm.maxHp} onChange={e=>setVillainForm(p=>({…p,maxHp:parseInt(e.target.value)||100}))}/></div>
<div style={{flex:1}}><label style={S.label}>Current HP</label><input type=“number” style={S.input} value={villainForm.hp} onChange={e=>setVillainForm(p=>({…p,hp:parseInt(e.target.value)||0}))}/></div>
</div>
<div style={{...S.sectionTitle,marginTop:8}}>Phase Descriptions</div>
{[1,2,3,4].map(p=>(
<div key={p} style={{display:“flex”,gap:6,alignItems:“center”,marginBottom:6}}>
<span style={{fontSize:“0.65rem”,color:VILLAIN_PHASE_COLORS[p-1],minWidth:50,fontFamily:“Arial,sans-serif”}}>Phase {p}</span>
<input style={{…S.input,flex:1}} value={(villainForm.phases||[])[p-1]||””} onChange={e=>{const u=[…(villainForm.phases||[””,””,””,””])];while(u.length<4)u.push(””);u[p-1]=e.target.value;setVillainForm(prev=>({…prev,phases:u}));}} placeholder={`Phase ${p} behaviour...`}/>
</div>
))}
<div style={{...S.sectionTitle,marginTop:12}}>What They’ve Done to Players</div>
{(villainForm.crimes||[]).map((c,i)=>(
<div key={i} style={{display:“flex”,gap:6,marginBottom:6,alignItems:“center”}}>
<input style={{…S.input,flex:“0 0 100px”}} value={c.victim} onChange={e=>{const u=[…villainForm.crimes];u[i]={…u[i],victim:e.target.value};setVillainForm(p=>({…p,crimes:u}));}} placeholder=”@player”/>
<input style={{…S.input,flex:1}} value={c.act} onChange={e=>{const u=[…villainForm.crimes];u[i]={…u[i],act:e.target.value};setVillainForm(p=>({…p,crimes:u}));}} placeholder=“What they did…”/>
<button style={{background:“none”,border:“none”,color:C.dim,cursor:“pointer”}} onClick={()=>setVillainForm(p=>({…p,crimes:p.crimes.filter((_,j)=>j!==i)}))}>✕</button>
</div>
))}
<button style={{…S.btnSm(“rgba(239,83,80,0.15)”,”#ef5350”),marginBottom:16}} onClick={()=>setVillainForm(p=>({…p,crimes:[…(p.crimes||[]),{victim:””,act:””}]}))}>+ Add Crime</button>
<div style={{display:“flex”,gap:8,flexWrap:“wrap”}}>
<button style={S.btn(“rgba(239,83,80,0.6)”,”#fff”)} onClick={save}>{isNew?“🎭 Add Villain”:“🎭 Save”}</button>
{!isNew&&<button style={S.btn(“rgba(30,25,50,0.8)”,C.dim)} onClick={()=>{if(window.confirm(“Remove villain?”)){setVillains(prev=>prev.filter(v=>v.id!==selectedVillain));setSelectedVillain(null);}}}>Remove</button>}
<button style={S.btn(“rgba(20,16,50,0.8)”,C.dim)} onClick={()=>setSelectedVillain(null)}>Cancel</button>
</div>
</div>
</div>
);
})()}
</div>
)}
</div>
);
}

{/* ═══ RULES ═══ */}
{tab===“rules”&&(
<div style={S.panel}>
<div style={S.card}>
<div style={S.sectionTitle}>Rule Book — The Hollow Realm</div>
<select style={S.select} value={rulesSection} onChange={e=>setRulesSection(e.target.value)}>
{RULES_SECTIONS.map(r=><option key={r.id} value={r.id}>{r.label}</option>)}
</select>
</div>
{rulesData&&(
<div style={S.cardGlow}>
<div style={{fontSize:“1.4rem”,marginBottom:6}}>{rulesData.icon}</div>
<div style={{fontWeight:“bold”,fontSize:“0.9rem”,color:C.purpleLight,marginBottom:12}}>{rulesData.label.replace(/^.+? /,””)}</div>
{rulesData.content.split(”\n”).map((line,i)=>{
if(!line.trim())return <div key={i} style={{height:8}}/>;
const bold=[“⚔”,“💀”,“☠”,“⚠”,“👁”,“🌑”,“★”,“🎬”,“👑”,“🌟”,“⚗”,“💰”,“🎲”,“🤝”,“🗳”,“⚡”,“🛡”,“🎵”,“🔮”,“🗡”,“💚”,“🪆”,“📡”,“🌍”,“🏆”].some(e=>line.startsWith(e))||/^[1-5]./.test(line);
return <div key={i} style={{fontSize:“0.76rem”,color:bold?C.text:C.dim,lineHeight:1.6,marginBottom:2,fontFamily:“Arial,sans-serif”,fontWeight:bold?“bold”:“normal”}}>{line}</div>;
})}
</div>
)}
<div style={S.card}>
<div style={S.sectionTitle}>✦ FAQ</div>
<input style={{…S.input,marginBottom:12}} placeholder=“🔍 Search questions…” value={faqSearch} onChange={e=>setFaqSearch(e.target.value)}/>
{filteredFaq.map((f,i)=>(
<div key={i} style={{borderBottom:`1px solid ${C.dimmer}`,marginBottom:4}}>
<button style={{background:“none”,border:“none”,cursor:“pointer”,textAlign:“left”,width:“100%”,padding:“10px 0”,color:faqOpen===i?C.purpleLight:C.text,fontSize:“0.76rem”,fontFamily:“Arial,sans-serif”,display:“flex”,justifyContent:“space-between”,alignItems:“center”}} onClick={()=>setFaqOpen(faqOpen===i?null:i)}>
<span>{f.q}</span><span style={{color:C.dim,fontSize:“0.7rem”,marginLeft:8,flexShrink:0}}>{faqOpen===i?“▲”:“▼”}</span>
</button>
{faqOpen===i&&<div style={{fontSize:“0.72rem”,color:C.dim,lineHeight:1.6,paddingBottom:10,fontFamily:“Arial,sans-serif”}}>{f.a}</div>}
</div>
))}
</div>
</div>
)}

{/* ═══ REFERENCE ═══ */}
{tab===“ref”&&(
<div style={S.panel}>
<div style={S.card}>
<div style={S.sectionTitle}>Class Roll Tables</div>
<div style={{display:“grid”,gridTemplateColumns:“repeat(3,1fr)”,gap:6,marginBottom:14}}>
{CLASSES.map(c=><button key={c} style={{…S.btnSm(refClass===c?C.purple:“rgba(20,16,50,0.8)”,refClass===c?”#fff”:C.dim)}} onClick={()=>setRefClass(c)}>{CLASS_ICON[c]} {c}</button>)}
</div>
<div style={{fontSize:“0.75rem”,fontWeight:“bold”,color:”#fff”,marginBottom:10,fontFamily:“Arial,sans-serif”}}>Reputation Titles — {refClass}</div>
{REP[refClass]?.map((r,i)=>{
const mid=(r.r[0]+r.r[1])/2;
const col=mid<=4?”#f44336”:mid<=9?”#81c784”:mid<=14?”#64b5f6”:mid<=19?”#ffb300”:”#ce93d8”;
return(<div key={i} style={{padding:“8px 0”,borderBottom:`1px solid ${C.dimmer}`}}>
<div style={{display:“flex”,gap:8,alignItems:“baseline”}}><span style={{color:col,fontSize:“0.7rem”,minWidth:30,fontFamily:“Arial,sans-serif”}}>{r.r[0]===r.r[1]?r.r[0]:`${r.r[0]}–${r.r[1]}`}</span><span style={{color:col,fontWeight:mid===20?“bold”:“normal”,fontSize:“0.78rem”}}>{r.title}</span></div>
<div style={{color:C.dim,fontSize:“0.66rem”,marginTop:2,paddingLeft:36,fontFamily:“Arial,sans-serif”}}>{r.passive}</div>
</div>);
})}
<div style={{fontSize:“0.75rem”,fontWeight:“bold”,color:”#fff”,margin:“14px 0 10px”,fontFamily:“Arial,sans-serif”}}>Starting Weapons — {refClass}</div>
{WEAPONS[refClass]?.map((w,i)=>(
<div key={i} style={{padding:“7px 0”,borderBottom:`1px solid ${C.dimmer}`}}>
<div style={{display:“flex”,gap:8,alignItems:“baseline”}}><span style={{color:RARITY_COLOR[w.rarity],fontSize:“0.7rem”,minWidth:30,fontFamily:“Arial,sans-serif”}}>{w.r[0]===w.r[1]?w.r[0]:`${w.r[0]}–${w.r[1]}`}</span><span style={{color:RARITY_COLOR[w.rarity],fontSize:“0.76rem”}}>{w.name}</span></div>
<div style={{color:C.dim,fontSize:“0.66rem”,marginTop:2,paddingLeft:36,fontFamily:“Arial,sans-serif”}}>{w.special}</div>
</div>
))}
</div>
<div style={S.card}>
<div style={S.sectionTitle}>Coin & Gift Reference</div>
{[[“🌑 Entry”,“1,000”,”~$7”],[“⚔ Minor”,“100”,”~$0.70”],[“⚔⚔ Moderate”,“500”,”~$3.50”],[“⚔⚔⚔ Major”,“5,000”,”~$35”],[“⚡ Epic Lion”,“29,999”,”~$210”],[“🎬 Episode”,“5,000+”,”~$35”],[“👑 Origin Story”,“10,000”,”~$70”],[“🌟 Gift a Legend”,“20,000”,”~$140”],[“⚗ Resurrection”,“6,000”,”~$42”],[“🛡 Protection”,“1k/session”,”~$7”],[“🎲 Re-Roll 1st”,“500”,”~$3.50”],[“🎲 Re-Roll 2nd”,“1,500”,”~$10.50”]].map(([tier,coins,you])=>(
<div key={tier} style={{display:“flex”,justifyContent:“space-between”,padding:“6px 0”,borderBottom:`1px solid ${C.dimmer}`,fontSize:“0.7rem”,fontFamily:“Arial,sans-serif”}}>
<span style={{color:”#bbb”,flex:2}}>{tier}</span>
<span style={{color:C.gold,flex:1,textAlign:“center”}}>{coins}</span>
<span style={{color:C.dim,flex:1,textAlign:“right”}}>{you}</span>
</div>
))}
</div>
</div>
)}

```
</div>
```

);
}
