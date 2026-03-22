import {useState,useEffect,useRef} from ‘react’;

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

const RARITY_COLOR = {Battered:”#888”,Standard:”#bbb”,Fine:”#81c784”,Rare:”#64b5f6”,LEGENDARY:”#ce93d8”};

// ═══════════════════════════════════════════════════
// EXPANDED CREATION ROLLS
// ═══════════════════════════════════════════════════
const SIGNATURE_SKILLS = {
Warrior:[
{r:[1,2],  name:“Reckless Charge”,      desc:”-1 DEF, +2 first attack roll each session.”},
{r:[3,4],  name:“Broken Form”,          desc:“Unpredictable style. +1 to surprise strikes.”},
{r:[5,6],  name:“Shield Wall”,          desc:“Allies behind them get +1 DEF while stationary.”},
{r:[7,8],  name:“Weapon Read”,          desc:”+1 to all rolls against same enemy after first exchange.”},
{r:[9,10], name:“War Cry”,              desc:“Once/session, enemy NPC must roll to act against them next turn.”},
{r:[11,12],name:“Controlled Aggression”,desc:”+2 to first strike after spending a full turn observing.”},
{r:[13,14],name:“Endurance Fighter”,    desc:“In extended conflicts, gains +1 each subsequent round.”},
{r:[15,16],name:“Execution Strike”,     desc:”+3 attack against any enemy below half HP.”},
{r:[17,18],name:“Counter”,             desc:“When an attack fails against them, rolls a free response strike.”},
{r:[19,19],name:“Battlefield Commander”,desc:“Once/session, every allied player gets +1 to their next roll.”},
{r:[20,20],name:“THE HOLLOW’S BLADE”,   desc:“UNIQUE. On a Critical, the effect lingers into next session.”},
],
Wizard:[
{r:[1,2],  name:“Volatile Casting”,    desc:“Spells hit harder but 1-in-6 chance of unexpected side effect.”},
{r:[3,4],  name:“Forbidden Indexing”,  desc:“Can attempt any knowledge roll regardless of subject.”},
{r:[5,6],  name:“Spell Dampening”,     desc:“Reduce an incoming magical effect by half. Once/session.”},
{r:[7,8],  name:“Rune Reading”,        desc:”+2 to deciphering magical inscriptions and Hollow markings.”},
{r:[9,10], name:“Projection”,          desc:“Cast a minor illusion without a roll. Once/session.”},
{r:[11,12],name:“Arcane Diagnosis”,    desc:“Touch something and identify any magical effect on it. No roll.”},
{r:[13,14],name:“Counter-Spell”,       desc:“When enemy spell cast, attempt to interrupt. Roll INT vs difficulty.”},
{r:[15,16],name:“Hollow Channelling”,  desc:“Once/arc, cast a spell beyond normal tier.”},
{r:[17,18],name:“Memory Casting”,      desc:“Replicate any spell witnessed once before. +1 to replicated spells.”},
{r:[19,19],name:“The Eye”,             desc:“See through one illusion, deception, or hidden thing per session.”},
{r:[20,20],name:“THE HOLLOW’S TONGUE”, desc:“UNIQUE. Once/arc, ask the Hollow anything. DM must answer truthfully.”},
],
Rogue:[
{r:[1,2],  name:“Pickpocketing”,       desc:“Lift small items on SPD roll. Fail means they notice.”},
{r:[3,4],  name:“Lock Reading”,        desc:“Identify any lock’s mechanism in 30 seconds. +2 lockpicking.”},
{r:[5,6],  name:“Forgery”,             desc:“Produce convincing false documents. CHA roll to use them.”},
{r:[7,8],  name:“Tailing”,             desc:“Follow a target without detection. Roll only if actively watched.”},
{r:[9,10], name:“Disguise”,            desc:“Assume different identity. +2 CHA while in disguise.”},
{r:[11,12],name:“Poison Craft”,        desc:“Apply contact poison to any item. Effect negotiated with DM.”},
{r:[13,14],name:“Escape Artist”,       desc:“Cannot be restrained for more than one round without SPD roll.”},
{r:[15,16],name:“Rooftop Navigation”,  desc:“Full speed across vertical terrain. No penalty rolls.”},
{r:[17,18],name:“Dead Drop Network”,   desc:“Once/arc, retrieve useful intel from a hidden cache.”},
{r:[19,19],name:“Ghost Entry”,         desc:“Enter any non-magical location without a roll. Leaves no trace.”},
{r:[20,20],name:“THE HOLLOW’S SHADOW”, desc:“UNIQUE. Becomes functionally invisible for one full scene/arc.”},
],
Healer:[
{r:[1,2],  name:“Field Stitching”,     desc:“Stabilise any wound without materials. Buys two rounds.”},
{r:[3,4],  name:“Poison Identification”,desc:“Identify any toxin by sight or smell. +2 treating poisoned.”},
{r:[5,6],  name:“Psychic First Aid”,   desc:“Treat mental trauma, fear, and psychological status effects.”},
{r:[7,8],  name:“Curse Reading”,       desc:“Identify nature and source of any curse on contact.”},
{r:[9,10], name:“Pain Management”,     desc:“Suppress injury penalty for one session. Damage still exists.”},
{r:[11,12],name:“Emergency Revival”,   desc:“Bring downed character to consciousness. One action, no roll, once/session.”},
{r:[13,14],name:“Herbal Synthesis”,    desc:“Create a restorative item from available materials. Once/location.”},
{r:[15,16],name:“Hollow Medicine”,     desc:“Treatments in Hollow locations have doubled effect.”},
{r:[17,18],name:“Death Diagnosis”,     desc:“Determine cause and time of death from a body with complete accuracy.”},
{r:[19,19],name:“Vital Read”,          desc:“By observation alone, know exact HP and conditions of any character.”},
{r:[20,20],name:“THE HOLLOW’S HANDS”,  desc:“UNIQUE. Once/arc, full heal any character instantly.”},
],
Merchant:[
{r:[1,2],  name:“Fast Talk”,           desc:“Distract or confuse an NPC. Buys one round without a roll.”},
{r:[3,4],  name:“Counterfeit Detection”,desc:“Identify fake currency, forged documents, or fraudulent goods instantly.”},
{r:[5,6],  name:“Bulk Negotiation”,    desc:”+2 group trade rolls. Always secures better combined rates.”},
{r:[7,8],  name:“Market Reading”,      desc:“Know approximate value and demand of any item. No roll.”},
{r:[9,10], name:“Smuggling Routes”,    desc:“Move restricted goods through any location. Risk roll only at checkpoints.”},
{r:[11,12],name:“Credit Network”,      desc:“Access funds beyond current inventory. Repaid within one arc.”},
{r:[13,14],name:“Auction Control”,     desc:“Control pace and pressure of any bidding situation.”},
{r:[15,16],name:“Bribery”,             desc:“CHA roll to find any NPC’s price. On success, they cooperate once.”},
{r:[17,18],name:“Hollow Arbitrage”,    desc:“Once/arc, turn a worthless item into something useful.”},
{r:[19,19],name:“The Long Game”,       desc:“Plant an arrangement. It pays off two sessions later without further action.”},
{r:[20,20],name:“THE HOLLOW’S PRICE”,  desc:“UNIQUE. Once/arc, name a price for anything. Any NPC will pay it.”},
],
Bard:[
{r:[1,2],  name:“Crowd Reading”,       desc:”+2 to all mass persuasion rolls.”},
{r:[3,4],  name:“Rumour Planting”,     desc:“Introduce false information into a community. CHA roll for spread speed.”},
{r:[5,6],  name:“Distraction Performance”,desc:“Hold any group’s attention for up to 10 minutes. No roll.”},
{r:[7,8],  name:“Emotional Manipulation”,desc:”+2 persuasion when exploiting a known emotional vulnerability.”},
{r:[9,10], name:“Song Memory”,         desc:“Remember any piece of information heard in passing, perfectly.”},
{r:[11,12],name:“Accent Mimicry”,      desc:“Replicate any voice or speech pattern after hearing it once.”},
{r:[13,14],name:“Tragedy Writing”,     desc:“Once/arc, a piece about a named NPC changes how others perceive them.”},
{r:[15,16],name:“Rally”,               desc:“Once/session, every player ignores their next negative modifier.”},
{r:[17,18],name:“The Earworm”,         desc:”+2 to influence a target for the rest of the session.”},
{r:[19,19],name:“Living Broadcast”,    desc:“Performance reaches people who weren’t present.”},
{r:[20,20],name:“THE HOLLOW’S SONG”,   desc:“UNIQUE. Once/arc, a performance changes something in the world permanently.”},
],
};

const SHADOW_TRAITS = {
Warrior:[
{r:[1,2],  name:“Blood Debt”,         desc:“Owes their life to someone dangerous. They will eventually collect.”},
{r:[3,4],  name:“The Shakes”,         desc:“After major combat, roll WIS or -1 to next session’s first roll.”},
{r:[5,6],  name:“Wanted — Desertion”, desc:“Military order has their name. Soldiers recognise them.”},
{r:[7,8],  name:“The Face”,           desc:“Haunted by someone they couldn’t save.”},
{r:[9,10], name:“Controlled Fury”,    desc:“On a fumble, roll WIS to avoid collateral damage to allies.”},
{r:[11,12],name:“The Oath Breaker”,   desc:“Once broke a sworn vow. Vow-dependent abilities start at -1.”},
{r:[13,14],name:“Pride”,              desc:“Cannot accept help without a CHA roll. Refuses healing unless downed.”},
{r:[15,16],name:“The Old Wound”,      desc:“In cold or damp locations, -1 to movement rolls.”},
{r:[17,18],name:“Survivor’s Weight”,  desc:”+1 WIS but -1 first roll when allies are in danger.”},
{r:[19,19],name:“The Hollow’s Pull”,  desc:“Something in the Hollow calls to them. They don’t know what yet.”},
{r:[20,20],name:“MARKED”,             desc:“UNIQUE. Visibly marked by the Hollow. Nobody knows why.”},
],
Wizard:[
{r:[1,2],  name:“Forbidden Debt”,     desc:“Acquired knowledge through a transaction. Payment still outstanding.”},
{r:[3,4],  name:“The Noise”,          desc:“Hears something others don’t. Gets louder near Hollow locations.”},
{r:[5,6],  name:“Spell Sickness”,     desc:“After two spells in one session, gains a minor physical symptom.”},
{r:[7,8],  name:“Institutional Exile”,desc:“Expelled from an order. Certain doors permanently closed.”},
{r:[9,10], name:“The Experiment”,     desc:“Was a subject of something once. Effects still surface.”},
{r:[11,12],name:“Truth Compulsion”,   desc:“Cannot lie convincingly. CHA roll required for deliberate deception.”},
{r:[13,14],name:“The Watcher”,        desc:“Something has been observing them since entering the Hollow.”},
{r:[15,16],name:“Knowledge Hunger”,   desc:“Cannot leave a mystery unsolved. Will pursue past safety.”},
{r:[17,18],name:“Hollow Sensitivity”, desc:“Vivid, intrusive impressions in certain locations.”},
{r:[19,19],name:“The Answering”,      desc:“Something responded to one of their spells. It’s been quiet since.”},
{r:[20,20],name:“THE OPEN CHANNEL”,   desc:“UNIQUE. The Hollow speaks through them sometimes. Uncontrolled.”},
],
Rogue:[
{r:[1,2],  name:“The Contract”,       desc:“Accepted a job not finished. The client is patient and well-connected.”},
{r:[3,4],  name:“Burned Identity”,    desc:“A previous name is compromised. Someone in every faction knows that face.”},
{r:[5,6],  name:“Paranoia”,           desc:“Allied players must roll CHA to share sensitive plans with them.”},
{r:[7,8],  name:“The Loose End”,      desc:“Left someone alive who should have stayed that way. They’re looking.”},
{r:[9,10], name:“Compulsive Acquisition”,desc:“Cannot resist taking something of value from new locations. SPD roll to resist.”},
{r:[11,12],name:“Double Identity”,    desc:“Two factions believe two different things about who this person is.”},
{r:[13,14],name:“The Witnessed”,      desc:“Someone saw them do the thing. That person is still alive.”},
{r:[15,16],name:“Hollow Debt”,        desc:“The Hollow helped them escape once. Debt not yet acknowledged.”},
{r:[17,18],name:“Exit Planning”,      desc:“Always planning how to leave. -1 to trust rolls.”},
{r:[19,19],name:“The Pattern”,        desc:“Someone is connecting their jobs. The picture is not flattering.”},
{r:[20,20],name:“THE ERASED”,         desc:“UNIQUE. Officially doesn’t exist. No record. The Hollow helped.”},
],
Healer:[
{r:[1,2],  name:“The One”,            desc:“Lost a patient who defined them. Will take irrational risks.”},
{r:[3,4],  name:“Cursed Sympathy”,    desc:“Absorbs minor ailments from patients. Carries residue.”},
{r:[5,6],  name:“The Order’s Eye”,    desc:“A healing institution wants them back. Interest not benevolent.”},
{r:[7,8],  name:“Overextension”,      desc:“Cannot refuse someone asking for help. CHA roll to walk away.”},
{r:[9,10], name:“Hollow Sensitivity”, desc:”-1 WIS in locations with heavy casualties.”},
{r:[11,12],name:“The Experiment”,     desc:“Treated someone with unsanctioned methods. It worked. Ethics unresolved.”},
{r:[13,14],name:“Marked by Death”,    desc:“Has been close to death so many times something followed them back.”},
{r:[15,16],name:“The Debt of Lives”,  desc:“Three people alive because of them. They know. They ask for things.”},
{r:[17,18],name:“The Limit”,          desc:“Found their limit once. Left a mark that affects their work.”},
{r:[19,19],name:“What Came Back”,     desc:“Revived someone and something was different afterward.”},
{r:[20,20],name:“THE HOLLOW’S WEIGHT”,desc:“UNIQUE. The Hollow gave them something and took something. Neither named yet.”},
],
Merchant:[
{r:[1,2],  name:“Outstanding Invoice”,desc:“Owed a significant amount by someone powerful. Collecting is complicated.”},
{r:[3,4],  name:“The Liability”,      desc:“Knows something about a faction they’d pay to keep quiet.”},
{r:[5,6],  name:“Creditor”,           desc:“Owes more than they hold. A collector appears once/arc.”},
{r:[7,8],  name:“The Insider”,        desc:“Feeding information to two competing factions. Neither knows.”},
{r:[9,10], name:“Hollow Goods”,       desc:“Once traded something from deep inside the Hollow. Not sure what it did.”},
{r:[11,12],name:“The Guarantee”,      desc:“Personally guaranteed a deal that went wrong. Compensation owed.”},
{r:[13,14],name:“The Addiction”,      desc:“Collects something specific. Will overpay. This is known.”},
{r:[15,16],name:“The List”,           desc:“Maintains a record of transactions that must never be discovered.”},
{r:[17,18],name:“False Front”,        desc:“A business identity with real obligations attached to it.”},
{r:[19,19],name:“The Price Paid”,     desc:“Acquired something rare by trading something personal. Cost surfaces.”},
{r:[20,20],name:“THE HOLLOW’S LEDGER”,desc:“UNIQUE. The Hollow has a record of every transaction. It has opinions.”},
],
Bard:[
{r:[1,2],  name:“The Song”,           desc:“Composed something that caused real harm. Subject knows it.”},
{r:[3,4],  name:“The Fabrication”,    desc:“A famous story turned out false. Believers still exist.”},
{r:[5,6],  name:“The Audience”,       desc:“Someone has been following their performances since before the Hollow.”},
{r:[7,8],  name:“Compulsive Documentation”,desc:“Records everything. Including things that shouldn’t be recorded.”},
{r:[9,10], name:“The Muse”,           desc:“Best work came during a period tied to someone now gone.”},
{r:[11,12],name:“The Revision”,       desc:“Changed an important story once. Original version still exists.”},
{r:[13,14],name:“What They Heard”,    desc:“Present for a conversation they weren’t meant to hear.”},
{r:[15,16],name:“The Unfinished Song”,desc:“Started a piece about the Hollow they cannot finish. It keeps growing.”},
{r:[17,18],name:“Hollow Resonance”,   desc:“Their voice does something in Hollow locations they cannot control.”},
{r:[19,19],name:“The Truth”,          desc:“Once told a truth so complete it destroyed something.”},
{r:[20,20],name:“THE HOLLOW’S VERSE”, desc:“UNIQUE. The Hollow has been composing something using their life.”},
],
};

const ENCHANTMENTS = {
Warrior:[
{r:[1,3],  name:“Cracked War-Mark”,    desc:“Faded symbol on weapon hand. Glows on a fumble — a warning.”},
{r:[4,6],  name:“The Enduring”,        desc:“Cannot be knocked unconscious by a single blow. Must reach 0 HP over time.”},
{r:[7,9],  name:“Hollow-Touched Steel”,desc:“Weapon harms entities that normal weapons cannot touch.”},
{r:[10,12],name:“The Ward”,            desc:“Once/arc, a killing blow instead leaves them at 1 HP.”},
{r:[13,15],name:“Battle Sight”,        desc:“Cannot be surprised or flanked in combat.”},
{r:[16,17],name:“Unbreakable”,         desc:“Equipment cannot be destroyed, stolen, or lost. Always returns.”},
{r:[18,19],name:“The Hollow’s Rage”,   desc:“Once/arc, three rounds of +3 to all combat rolls.”},
{r:[20,20],name:“CHOSEN WEAPON”,       desc:“UNIQUE. Their weapon has a name and a will. Acts to protect them.”},
],
Wizard:[
{r:[1,3],  name:“Hollow Static”,       desc:“Technology and locks behave strangely near them. Uncontrolled.”},
{r:[4,6],  name:“The Resonance”,       desc:“Sense when magic has been used recently in a location. No roll.”},
{r:[7,9],  name:“Spell Echo”,          desc:“After a successful spell, a faint afterimage that can repeat once.”},
{r:[10,12],name:“Mark of Seeking”,     desc:“Symbol on skin. Warm near hidden things.”},
{r:[13,15],name:“Hollow Fluency”,      desc:“Read any magical script or arcane language without a roll.”},
{r:[16,17],name:“The Suspension”,      desc:“Once/arc, freeze any magical effect mid-cast for one round.”},
{r:[18,19],name:“Void Touch”,          desc:“Hands pass through non-living matter once/session.”},
{r:[20,20],name:“THE HOLLOW’S EYE”,    desc:“UNIQUE. See the Hollow’s version of any location — past and present.”},
],
Rogue:[
{r:[1,3],  name:“Lucky Step”,          desc:“Once/session, reroll any movement or evasion roll.”},
{r:[4,6],  name:“Shadow Skin”,         desc:”+1 evasion rolls in low-light environments.”},
{r:[7,9],  name:“Hollow’s Blind Spot”, desc:“Hollow entities don’t see them unless directly targeted.”},
{r:[10,12],name:“Sound Suppression”,   desc:“Movement and handling of objects make no sound unless chosen.”},
{r:[13,15],name:“Face Blur”,           desc:“People who see them in passing cannot accurately describe them.”},
{r:[16,17],name:“Twice as Gone”,       desc:“Can disappear so completely witnesses believe they were never there.”},
{r:[18,19],name:“The Other Door”,      desc:“Once/arc, exit any location through a route that wasn’t there before.”},
{r:[20,20],name:“THE HOLLOW’S PASSAGE”,desc:“UNIQUE. Travel between any two Hollow locations instantly, once/arc.”},
],
Healer:[
{r:[1,3],  name:“The Steady Hand”,     desc:“Chaos does not affect their work. No anxiety penalties.”},
{r:[4,6],  name:“Hollow Warmth”,       desc:“Characters near them recover 1 extra HP per rest.”},
{r:[7,9],  name:“The Sense”,           desc:“Feel when a nearby character drops below half HP. Always active.”},
{r:[10,12],name:“Curse Resistance”,    desc:“Cannot be cursed by standard-tier curses.”},
{r:[13,15],name:“Life Read”,           desc:“Touch a living thing and know its full physical state.”},
{r:[16,17],name:“The Transfer”,        desc:“Once/arc, move a status effect from one character to another.”},
{r:[18,19],name:“Hollow Immunity”,     desc:“Hollow passive effects don’t apply to them or anyone they’re treating.”},
{r:[20,20],name:“THE THREAD”,          desc:“UNIQUE. Silver thread connects them to every character they’ve healed.”},
],
Merchant:[
{r:[1,3],  name:“Eye for Value”,       desc:“Assess rarity and worth of any Hollow artifact on sight. No roll.”},
{r:[4,6],  name:“Hollow Credit”,       desc:“Acquire goods on credit in any location. 10% surcharge.”},
{r:[7,9],  name:“The Closed Deal”,     desc:“Any verbal agreement they make is binding. Hollow enforces it.”},
{r:[10,12],name:“The Inventory”,       desc:“Their pack holds more than it should. Items undetectable by search.”},
{r:[13,15],name:“Price Sense”,         desc:“Know instantly if being overcharged, deceived, or manipulated.”},
{r:[16,17],name:“The Contact”,         desc:“In every location, someone owes them a favour. Call it in once/location.”},
{r:[18,19],name:“Hollow Currency”,     desc:“A single coin from inside the Hollow. Accepted everywhere, by everyone.”},
{r:[20,20],name:“THE EXCHANGE”,        desc:“UNIQUE. Once/arc, trade something intangible for equivalent story value.”},
],
Bard:[
{r:[1,3],  name:“The Carry”,           desc:“Voice carries further than it should. Whispers reach across a room.”},
{r:[4,6],  name:“Hollow Acoustics”,    desc:“Music is heard in Hollow locations by things that don’t perceive sound.”},
{r:[7,9],  name:“The Record”,          desc:“Everything performed is remembered perfectly by everyone who experiences it.”},
{r:[10,12],name:“Emotional Imprint”,   desc:“A performance in a location leaves lasting emotional residue.”},
{r:[13,15],name:“Compelled Truth”,     desc:“Target of a direct performance has -2 to deception rolls.”},
{r:[16,17],name:“Hollow Memory”,       desc:“By performing in a location, access residual impressions from past events.”},
{r:[18,19],name:“The Rewrite”,         desc:“Once/arc, a revised performance of a past event shifts emotional reality.”},
{r:[20,20],name:“THE HOLLOW’S CHORUS”, desc:“UNIQUE. Other voices join theirs — voices of those no longer in the Hollow.”},
],
};

const DESTINY_THREADS = {
Warrior:[
{r:[1,2],  thread:“They will be asked to protect something they do not believe deserves protection. They will do it anyway.”},
{r:[3,4],  thread:“The war they thought they left behind is waiting at the centre of the Hollow.”},
{r:[5,6],  thread:“Someone they failed once will return. The second chance will cost more than the first mistake.”},
{r:[7,8],  thread:“They will be the last one standing in a moment that defines the Hollow’s future.”},
{r:[9,10], thread:“The thing they’ve been fighting toward is not what they think it is.”},
{r:[11,12],thread:“They will be offered exactly what they want. Accepting it ends someone else’s story.”},
{r:[13,14],thread:“Their greatest enemy in the Hollow is someone who once called them a friend.”},
{r:[15,16],thread:“The Hollow chose them before they arrived. The reason will become clear at the worst moment.”},
{r:[17,18],thread:“They will die in the Hollow. They will not stay dead. What comes back will be different.”},
{r:[19,19],thread:“Every battle they survive makes the final one more inevitable.”},
{r:[20,20],thread:“UNIQUE THREAD — DM and player create this together. Sealed. It will happen.”},
],
Wizard:[
{r:[1,2],  thread:“The knowledge they came seeking will answer a question they never thought to ask.”},
{r:[3,4],  thread:“Something they cast early is still active. Its effects have not fully arrived yet.”},
{r:[5,6],  thread:“The forbidden thing they studied was a message. They are the intended recipient.”},
{r:[7,8],  thread:“They will find the thing at the centre of the Hollow. It won’t be what records described.”},
{r:[9,10], thread:“A spell will go wrong in a way that changes the Hollow permanently. Cannot be undone.”},
{r:[11,12],thread:“The entity they spoke to once has been speaking to others about them.”},
{r:[13,14],thread:“Their greatest discovery will require them to give up the ability to use it.”},
{r:[15,16],thread:“The Hollow has been writing them into its own history since before they arrived.”},
{r:[17,18],thread:“They will be asked to forget something. Forgetting saves lives. Remembering might save more.”},
{r:[19,19],thread:“The thing that answers when they cast is not what they assumed. It has its own intentions.”},
{r:[20,20],thread:“UNIQUE THREAD — DM and player create this together. Sealed. It will happen.”},
],
Rogue:[
{r:[1,2],  thread:“The job that brought them here was placed by someone who knew they’d never leave.”},
{r:[3,4],  thread:“The person they’re running from is already inside the Hollow.”},
{r:[5,6],  thread:“They will uncover something they were paid to keep buried.”},
{r:[7,8],  thread:“The one person who truly knows who they are will reappear at the moment it matters most.”},
{r:[9,10], thread:“They will be given the opportunity to disappear completely. Either choice changes the Hollow.”},
{r:[11,12],thread:“The truth they’ve been concealing is the same truth someone else has been trying to find.”},
{r:[13,14],thread:“Their last job before the Hollow and their current situation are connected.”},
{r:[15,16],thread:“Something in the Hollow has decided they’re the right person to carry a specific secret out.”},
{r:[17,18],thread:“They will be betrayed by someone they chose to trust against their better judgment.”},
{r:[19,19],thread:“The Hollow has an exit. They will find it. What they’ll have to leave behind is the question.”},
{r:[20,20],thread:“UNIQUE THREAD — DM and player create this together. Sealed. It will happen.”},
],
Healer:[
{r:[1,2],  thread:“The patient they couldn’t save is somehow present in the Hollow. Not as they were.”},
{r:[3,4],  thread:“They will be asked to heal something that should not be healed. The consequences are irreversible.”},
{r:[5,6],  thread:“Their gift has a limit the Hollow intends to find.”},
{r:[7,8],  thread:“Three people they save will together do something that changes the Hollow.”},
{r:[9,10], thread:“What they carry from all those healings will eventually need to go somewhere.”},
{r:[11,12],thread:“They will find a wound they cannot close. Learning to live with that will be the arc.”},
{r:[13,14],thread:“The thing following them since a past resurrection is not malevolent. It wants to understand.”},
{r:[15,16],thread:“They will choose between saving one person they love and preventing harm to many they don’t know.”},
{r:[17,18],thread:“The Hollow is sick. They are the only one who can diagnose it.”},
{r:[19,19],thread:“Something they healed early will become the most important thing in the Hollow.”},
{r:[20,20],thread:“UNIQUE THREAD — DM and player create this together. Sealed. It will happen.”},
],
Merchant:[
{r:[1,2],  thread:“The most valuable thing in the Hollow is not an object. They will be the first to understand this.”},
{r:[3,4],  thread:“A deal made before they entered the Hollow has obligations inside it.”},
{r:[5,6],  thread:“They will be offered ownership of something here. Accepting means they can never leave.”},
{r:[7,8],  thread:“The thing they actually came for is not the thing they told themselves.”},
{r:[9,10], thread:“Their network will be tested by a transaction that has no clean outcome.”},
{r:[11,12],thread:“Something they sold early will reappear at a critical moment. Changed. Consequential.”},
{r:[13,14],thread:“The most important negotiation of their life will happen here. Both sides are already in position.”},
{r:[15,16],thread:“They will discover the original cost of something they received for free. It was not free.”},
{r:[17,18],thread:“The Hollow has its own economy. They will find the currency. It is not what they expected to spend.”},
{r:[19,19],thread:“Everything they’ve built here will be needed in a single moment they cannot prepare for.”},
{r:[20,20],thread:“UNIQUE THREAD — DM and player create this together. Sealed. It will happen.”},
],
Bard:[
{r:[1,2],  thread:“The unfinished song will finish itself. They will not like what the final verse says.”},
{r:[3,4],  thread:“The most important story they will ever tell is happening to them right now.”},
{r:[5,6],  thread:“They came to document the Hollow. The Hollow intends to document them.”},
{r:[7,8],  thread:“A performance will change the outcome of the Hollow’s central conflict.”},
{r:[9,10], thread:“The person they wrote their most damaging piece about is here. Has read it. Is patient.”},
{r:[11,12],thread:“Their record of the Hollow will be the only record that survives.”},
{r:[13,14],thread:“The voices they hear in Hollow locations are trying to communicate something specific.”},
{r:[15,16],thread:“They must choose between a true story that ends something good, or a false one that preserves it.”},
{r:[17,18],thread:“The Hollow has been building toward a final performance. They are the intended performer.”},
{r:[19,19],thread:“Everything they’ve recorded about the other players will matter in the final arc.”},
{r:[20,20],thread:“UNIQUE THREAD — DM and player create this together. Sealed. It will happen.”},
],
};

// ═══════════════════════════════════════════════════
// CHARACTER LORE
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

const ROLL_PURPOSES = {
combat: {
label: “⚔️ Combat”,
color: “#ef5350”,
options: [
“Attack roll”,
“Counter-attack”,
“Sneak attack”,
“Executed strike”,
“Defensive strike”,
“Power Strike gift action”,
“Boss Phase transition”,
“Pack coordination roll”,
],
},
skill: {
label: “🎯 Skill Check”,
color: “#4fc3f7”,
options: [
“Stealth check”,
“Lockpicking”,
“Pickpocket”,
“Persuasion”,
“Intimidation”,
“Deception”,
“Perception”,
“Arcane knowledge”,
“Healing check”,
“Negotiation”,
“Forgery”,
“Tracking”,
],
},
save: {
label: “🛡 Saving Throw”,
color: “#ffd54f”,
options: [
“Death save”,
“Curse resist”,
“Hollow Pull resist”,
“Fear resist”,
“Poison resist”,
“Trap avoid”,
“Environmental hazard”,
“Structural collapse”,
“Reality distortion (Edge)”,
],
},
magic: {
label: “🔮 Spell / Magic”,
color: “#7c4dff”,
options: [
“Spell cast”,
“Arcane Surge activation”,
“Counter-spell”,
“Hollow channelling”,
“Void touch”,
“Spell echo trigger”,
“Forbidden knowledge roll”,
“Entity communication”,
],
},
social: {
label: “🤝 Social”,
color: “#ff9800”,
options: [
“Persuasion attempt”,
“NPC negotiation”,
“Bribe attempt”,
“Deception check”,
“Alliance declaration”,
“Betrayal consequence”,
“Reputation check”,
“Faction standing roll”,
],
},
explore: {
label: “🔍 Exploration”,
color: “#66bb6a”,
options: [
“Search area”,
“Chest / cache discovery”,
“Trap detection”,
“Path finding”,
“Loot roll”,
“Document recovery”,
“Hollow rift interaction”,
“Reliquary access”,
],
},
heal: {
label: “💚 Healing”,
color: “#66bb6a”,
options: [
“Healing roll”,
“Stabilise downed character”,
“Curse removal attempt”,
“Resurrection roll”,
“Soul Weave attempt”,
“Emergency revival”,
“Death prevention (Keeper)”,
“Saint’s revival (no cost)”,
],
},
raid: {
label: “⚔️ Raid Action”,
color: “#ff9800”,
options: [
“Strike action”,
“Defend action”,
“Search action”,
“Special ability activation”,
“Power Strike”,
“Gift Power activation”,
“Clutch Moment”,
“Boss encounter roll”,
“Extract attempt”,
“Breach roll”,
],
},
destiny: {
label: “🔮 Destiny / Hollow”,
color: “#ce93d8”,
options: [
“Destiny Thread trigger”,
“Shadow Trait activation”,
“Hollow Pull resist”,
“Enchantment check”,
“Hollow entity interaction”,
“Warden’s Test”,
“Null field resist”,
“Boundary crossing attempt”,
],
},
consequence: {
label: “⚗️ Consequence”,
color: “#9c27b0”,
options: [
“Curse activation”,
“Wanted consequence”,
“Exile enforcement”,
“Debt collection”,
“Box Battle consequence”,
“Domino effect roll”,
“Item condition degradation”,
“Base raid defense”,
],
},
custom: {
label: “✏️ Custom”,
color: “#bbb”,
options: [],
},
};

const LOG_TYPES = {
session:  { label:“Session”,  color:”#ffd54f”, bg:“rgba(50,40,5,0.8)”,   icon:“⏱” },
dice:     { label:“Dice”,     color:”#ce93d8”, bg:“rgba(40,5,60,0.8)”,   icon:“🎲” },
hp:       { label:“HP”,       color:”#66bb6a”, bg:“rgba(10,40,10,0.8)”,  icon:“❤️” },
death:    { label:“Death”,    color:”#ef5350”, bg:“rgba(60,5,5,0.8)”,    icon:“☠️” },
action:   { label:“Action”,   color:”#4fc3f7”, bg:“rgba(5,30,50,0.8)”,   icon:“⚔️” },
gift:     { label:“Gift”,     color:”#ff9800”, bg:“rgba(50,25,5,0.8)”,   icon:“🎁” },
battle:   { label:“Battle”,   color:”#e91e63”, bg:“rgba(50,5,25,0.8)”,   icon:“⚔️” },
item:     { label:“Item”,     color:”#81c784”, bg:“rgba(10,35,10,0.8)”,  icon:“🎒” },
note:     { label:“Note”,     color:”#bbb”,    bg:“rgba(30,28,50,0.8)”,  icon:“📝” },
consequence:{label:“Effect”,  color:”#9c27b0”, bg:“rgba(30,5,50,0.8)”,   icon:“⚗️” },
};

const WORLD_LOCATIONS = [
{
id: “forest”,
name: “The Dark Enchanted Forest”,
shortName: “The Forest”,
icon: “🌲”,
color: “#2e7d32”,
glowColor: “rgba(46,125,50,0.2)”,
dangerDefault: 3,
description: “Ancient. Breathing. The trees here remember everything that has walked beneath them. Some of them remember things that haven’t happened yet.”,
features: [
“Hollow-adjacent plant material grows at the tree line”,
“The Ashen Pack hunts here — Gravenor’s territory”,
“Forest caches hidden throughout by unknown parties”,
“Sound travels strangely — whispers carry further than shouts”,
],
lore: “The Forest predates the Kingdom, the Library, and the Caverns. The oldest maps show it occupying exactly the same space it occupies now. It has not grown. It has not receded. Whatever it is, it has decided to stay.”,
connectedTo: [“kingdom”, “edge”],
// Map position as percentage x/y on the map canvas
x: 18, y: 30,
},
{
id: “kingdom”,
name: “The Crumbling Kingdom”,
shortName: “The Kingdom”,
icon: “🏰”,
color: “#c62828”,
glowColor: “rgba(198,40,40,0.2)”,
dangerDefault: 2,
description: “What is left of an empire. The walls still stand in places. So do some of the people, which is the more troubling fact.”,
features: [
“Garrison footlockers scattered through the ruins”,
“Valdris the Unmourned holds the throne room”,
“Kingdom vault accessible with the right key”,
“Military remnant NPCs patrol unpredictably”,
],
lore: “The Kingdom’s collapse was not sudden. It was a long process that looked, from inside, like stability. By the time it was clearly falling, it was already finished. The Hollow moved in before the dust settled.”,
connectedTo: [“forest”, “caverns”, “library”],
x: 45, y: 22,
},
{
id: “caverns”,
name: “The Underground Caverns”,
shortName: “The Caverns”,
icon: “⛏️”,
color: “#6a1b9a”,
glowColor: “rgba(106,27,154,0.2)”,
dangerDefault: 3,
description: “The deep dark beneath everything else. The Hollow ore runs in veins here that don’t follow geological logic. Neither does much else.”,
features: [
“Hollow ore deposits — primary source for fine/rare weapons”,
“Thessaly Vane operates from unmapped deep sections”,
“Cavern mushroom clusters — healing and poison compounds”,
“The deepest sections have never been fully mapped”,
],
lore: “The Caverns were mined before the Kingdom was built. The miners found things that made them stop mining certain sections. The records of what they found are in the flooded parts of the Library. The flooding may not be coincidental.”,
connectedTo: [“kingdom”, “library”],
x: 38, y: 62,
},
{
id: “edge”,
name: “The Hollow’s Edge”,
shortName: “The Edge”,
icon: “🌑”,
color: “#9c27b0”,
glowColor: “rgba(156,39,176,0.25)”,
dangerDefault: 5,
description: “Where the Hollow ends and whatever comes next begins. The boundary is not always visible. Characters who walk toward it report that they never quite reach it — until suddenly they have.”,
features: [
“Hollow rift deposits appear unpredictably”,
“The Null Warden holds the deep boundary”,
“Hollow-Carved instruments sourced from transition-zone materials”,
“Time moves differently — sessions here feel shorter than they are”,
],
lore: “Three characters across documented Hollow history have crossed the Edge fully. None returned. One sent back a note. The note is in the Library’s restricted section. The restricted section is flooded.”,
connectedTo: [“forest”, “library”],
x: 72, y: 38,
},
{
id: “library”,
name: “The Sunken Library”,
shortName: “The Library”,
icon: “📚”,
color: “#1565c0”,
glowColor: “rgba(21,101,192,0.2)”,
dangerDefault: 2,
description: “Partially submerged. Still functional. The parts that aren’t accessible are accessible in ways that the parts still accessible are not.”,
features: [
“Scholar’s Sealed Cases throughout readable levels”,
“The Sink occupies the permanently flooded lower levels”,
“Restricted archive — requires specific clearance”,
“Research desks surface occasionally with intact contents”,
],
lore: “The Library sinks at a rate of a few inches per decade. Scholars have calculated when the last readable level will flood. The calculation keeps changing. The Library seems to have opinions about the timeline.”,
connectedTo: [“kingdom”, “caverns”, “edge”],
x: 62, y: 70,
},
];

// ── PIN TYPES ─────────────────────────────────────
const PIN_TYPES = {
player:    { label:“Player”,    color:”#b388ff”, bg:“rgba(138,90,220,0.3)”,  icon:“🧙”, emoji:“🟣” },
villain:   { label:“Villain”,   color:”#ef5350”, bg:“rgba(239,83,80,0.3)”,   icon:“🎭”, emoji:“🔴” },
npc:       { label:“NPC”,       color:”#4fc3f7”, bg:“rgba(79,195,247,0.3)”,  icon:“👤”, emoji:“🔵” },
merchant:  { label:“Merchant”,  color:”#ffd54f”, bg:“rgba(255,213,79,0.3)”,  icon:“💰”, emoji:“🟡” },
event:     { label:“Event”,     color:”#ff9800”, bg:“rgba(255,152,0,0.3)”,   icon:“⚡”, emoji:“🟠” },
danger:    { label:“Danger”,    color:”#f44336”, bg:“rgba(244,67,54,0.3)”,   icon:“⚠️”, emoji:“🔴” },
ally:      { label:“Ally”,      color:”#66bb6a”, bg:“rgba(102,187,106,0.3)”, icon:“🤝”, emoji:“🟢” },
mystery:   { label:“Mystery”,   color:”#ce93d8”, bg:“rgba(206,147,216,0.3)”, icon:“❓”, emoji:“🟤” },
};

// Danger level labels
const DANGER_LABELS = [””, “Calm”, “Tense”, “Dangerous”, “Hostile”, “Extreme”];
const DANGER_COLORS = [””,”#66bb6a”,”#81c784”,”#ff9800”,”#ef5350”,”#b71c1c”];

const ITEM_TYPES = {
weapon:     { label:“Weapon”,     icon:“⚔️”,  slots:2, color:”#ef5350” },
armor:      { label:“Armor”,      icon:“🛡”,  slots:2, color:”#ffd54f” },
consumable: { label:“Consumable”, icon:“⚗️”,  slots:1, color:”#66bb6a” },
key:        { label:“Key Item”,   icon:“🗝”,  slots:0, color:”#ce93d8” },
material:   { label:“Material”,   icon:“💎”,  slots:1, color:”#4fc3f7” },
trinket:    { label:“Trinket”,    icon:“✨”,  slots:1, color:”#ff9800” },
document:   { label:“Document”,  icon:“📜”,  slots:0, color:”#bbb”    },
coin:       { label:“Coin Pouch”, icon:“💰”,  slots:1, color:”#ffd54f” },
};

const ITEM_CONDITIONS = {
Pristine: { color:”#66bb6a”, penalty:0,    label:“Pristine” },
Good:     { color:”#4fc3f7”, penalty:0,    label:“Good”     },
Worn:     { color:”#ffd54f”, penalty:0,    label:“Worn”     },
Damaged:  { color:”#ff9800”, penalty:-1,   label:“Damaged”  },
Broken:   { color:”#ef5350”, penalty:-2,   label:“Broken”   },
};

const ITEM_RARITIES = {
Common:    “#aaa”,
Uncommon:  “#66bb6a”,
Rare:      “#4fc3f7”,
Legendary: “#ffd54f”,
Mythic:    “#ce93d8”,
Cursed:    “#ef5350”,
};

const OBTAIN_TYPES = {
found:    { label:“Found”,    icon:“🔍” },
looted:   { label:“Looted”,   icon:“⚔️” },
crafted:  { label:“Crafted”,  icon:“🔨” },
gifted:   { label:“Gifted”,   icon:“🎁” },
bought:   { label:“Bought”,   icon:“💰” },
stolen:   { label:“Stolen”,   icon:“🗡” },
reward:   { label:“Reward”,   icon:“🏆” },
};

// Pack capacity by class (slots)
const CLASS_PACK_CAPACITY = {
Warrior:  8,
Wizard:   6,
Rogue:    10,
Healer:   8,
Merchant: 12,
Bard:     7,
};

// ═══════════════════════════════════════════════════
// RAID DATA
// ═══════════════════════════════════════════════════

const RAID_TIERS = {
scouting: {
label:“🔍 Scouting”,
desc:“Light recon. Low risk, low reward. Useful for intel.”,
giftCost:“Minor Roll — 100 coins per action”,
encounterRange:[1,8],
rewardMultiplier:1,
color:”#66bb6a”,
maxParty:2,
phases:[“Enter”,“Encounter”,“Escape or Engage”,“Extract”],
},
skirmish: {
label:“⚔️ Skirmish”,
desc:“Hit hard, get out. Medium risk, solid rewards.”,
giftCost:“Moderate Roll — 500 coins per action”,
encounterRange:[5,14],
rewardMultiplier:2,
color:”#4fc3f7”,
maxParty:3,
phases:[“Enter”,“Encounter”,“Combat”,“Loot”,“Extract”],
},
fullraid: {
label:“🔥 Full Raid”,
desc:“Commit fully. High risk, high reward, lasting consequences.”,
giftCost:“Major Roll — 5,000 coins per action”,
encounterRange:[10,18],
rewardMultiplier:4,
color:”#ff9800”,
maxParty:5,
phases:[“Deploy”,“Breach”,“Combat”,“Boss/Event”,“Loot”,“Extract”],
},
bossassault: {
label:“💀 Boss Assault”,
desc:“Full commitment against a named villain. Destiny-level stakes.”,
giftCost:“Epic Roll — 29,999 coins. All or nothing.”,
encounterRange:[15,20],
rewardMultiplier:8,
color:”#ef5350”,
maxParty:6,
phases:[“Deploy”,“Breach”,“Elite Guards”,“Boss Phase 1”,“Boss Phase 2”,“Loot or Flee”],
},
};

const RAID_LOCATIONS = {
forest: {
name:“The Dark Enchanted Forest”,
icon:“🌲”,
encounters:[
{ name:“Ashen Pack Scouts”,    difficulty:5,  type:“combat”,    enemy:“2d4 wolves”,                reward:“Ashen Fang x2, Forest Herb” },
{ name:“Hollow Wisp Swarm”,    difficulty:7,  type:“combat”,    enemy:“Hollow wisps — INT rolls”,  reward:“Hollow ore fragment, Wisp essence” },
{ name:“Ancient Tree Spirit”,  difficulty:10, type:“negotiate”, enemy:“WIS challenge”,             reward:“Forest cache location revealed” },
{ name:“Gravenor’s Border”,    difficulty:14, type:“boss”,      enemy:“Gravenor — Phase 1”,        reward:“Pack Sigil, Ashen Fang x4” },
{ name:“Abandoned Forest Camp”,difficulty:3,  type:“explore”,   enemy:“None — search rolls”,       reward:“Random forest loot table” },
{ name:“Cursed Clearing”,      difficulty:9,  type:“survive”,   enemy:“Environmental curse rolls”, reward:“Hollow-Touched material if survived” },
],
},
kingdom: {
name:“The Crumbling Kingdom”,
icon:“🏰”,
encounters:[
{ name:“Kingdom Remnant Patrol”,  difficulty:4,  type:“combat”,    enemy:“3 soldiers”,                 reward:“Garrison weapons, coin pouch” },
{ name:“Vault Breach”,            difficulty:12, type:“stealth”,   enemy:“Vault guardian, traps”,      reward:“Kingdom Vault loot table” },
{ name:“Throne Room Confrontation”,difficulty:15,type:“boss”,      enemy:“Valdris — Phase 1”,          reward:“Chancellor’s Ring, Kingdom Signet” },
{ name:“Rubble Excavation”,       difficulty:5,  type:“explore”,   enemy:“Structural hazards”,         reward:“Garrison footlocker contents” },
{ name:“Debt Collector Ambush”,   difficulty:8,  type:“combat”,    enemy:“Faction enforcer”,           reward:“Debt record, guild strongbox” },
{ name:“Kingdom Archive”,         difficulty:7,  type:“explore”,   enemy:“Undead scholars”,            reward:“Research notes, arc intel” },
],
},
caverns: {
name:“The Underground Caverns”,
icon:“⛏️”,
encounters:[
{ name:“Deep Ore Vein”,          difficulty:4,  type:“explore”,   enemy:“Environmental — cave-ins”,   reward:“Hollow ore x3, Fine weapon material” },
{ name:“Thessaly’s Trap Network”,difficulty:11, type:“stealth”,   enemy:“Precision traps everywhere”, reward:“Master Cavern Map fragment” },
{ name:“Cave Creature Nest”,     difficulty:8,  type:“combat”,    enemy:“d6 cave creatures”,          reward:“Creature components, Hollow material” },
{ name:“The Unmapped Section”,   difficulty:13, type:“explore”,   enemy:“Unknown — Thessaly present”, reward:“Hollow Anchor material, blueprint” },
{ name:“Mushroom Field Harvest”, difficulty:3,  type:“explore”,   enemy:“Toxic spore chance”,         reward:“d4 healing compounds, poison material” },
{ name:“Cavern Smuggler Cache”,  difficulty:6,  type:“stealth”,   enemy:“Smuggler guard”,             reward:“Black market goods, coin cache” },
],
},
edge: {
name:“The Hollow’s Edge”,
icon:“🌑”,
encounters:[
{ name:“Rift Deposit”,           difficulty:5,  type:“explore”,   enemy:“The Pull — WIS rolls”,       reward:“Hollow rift deposit loot” },
{ name:“Null Warden’s Test”,     difficulty:16, type:“boss”,      enemy:“The Null Warden — Phase 2”,  reward:“Edge Fragment, Boundary Access” },
{ name:“Edge Entity”,            difficulty:12, type:“negotiate”, enemy:“Unknown entity”,             reward:“Forbidden knowledge, arc intel” },
{ name:“Transition Zone Harvest”,difficulty:6,  type:“explore”,   enemy:“Environmental instability”,  reward:“Hollow-Carved materials x2” },
{ name:“Boundary Collapse”,      difficulty:14, type:“survive”,   enemy:“Reality distortion rolls”,   reward:“Edge Fragment if survived” },
{ name:“Reliquary Hunt”,         difficulty:9,  type:“explore”,   enemy:“Edge creatures”,             reward:“Hollow Edge Reliquary contents” },
],
},
library: {
name:“The Sunken Library”,
icon:“📚”,
encounters:[
{ name:“Scholar’s Archive Dive”,  difficulty:5,  type:“explore”,   enemy:“Flooding — SPD rolls”,       reward:“Research notes, lore document” },
{ name:“The Drowned Scholars”,    difficulty:9,  type:“survive”,   enemy:“Animated scholars — The Pull”,reward:“Waterlogged scroll, archive fragment” },
{ name:“Restricted Section Breach”,difficulty:11,type:“stealth”,  enemy:“Library defences, INT rolls”, reward:“Forbidden text, founding document” },
{ name:“The Sink Encounter”,      difficulty:17, type:“boss”,      enemy:“The Sink — Phase 2”,         reward:“Drowned Archive fragment x2” },
{ name:“Flooded Vault”,           difficulty:7,  type:“explore”,   enemy:“Water depth — WIS rolls”,    reward:“Scholar’s Sealed Case contents” },
{ name:“Surface Reading Rooms”,   difficulty:3,  type:“explore”,   enemy:“None”,                       reward:“Standard research notes, maps” },
],
},
};

// Gift actions during a raid phase
const RAID_ACTIONS = [
{ coins:100,   label:“Scout Ahead”,     desc:“Minor recon action. Reveals what’s in the next encounter before committing.”, type:“intel”   },
{ coins:500,   label:“Strike”,          desc:“Player attacks or acts. Roll d20. Result determines outcome for their character.”, type:“combat” },
{ coins:500,   label:“Defend”,          desc:“Player holds position. +2 DEF this round. Can protect another character.”, type:“defend” },
{ coins:500,   label:“Search”,          desc:“Player searches the area. Roll d20. 10+ finds something. 15+ finds something good.”, type:“explore” },
{ coins:1000,  label:“Special Ability”, desc:“Player uses their class signature skill. Auto-success on one related action.”, type:“special” },
{ coins:1000,  label:“Use Item”,        desc:“Player uses a consumable from their pack. Effect applied immediately.”, type:“item”   },
{ coins:5000,  label:“Power Strike”,    desc:“All-in attack. Roll d20. 15+ deals major damage. 1-9 leaves player exposed.”, type:“combat” },
{ coins:5000,  label:“Gift Power”,      desc:“Activate class Gift Power. Once per session. Automatic success on activation.”, type:“power”  },
{ coins:10000, label:“Clutch Moment”,   desc:“Narrative override. Player defines what their character does. DM rolls for consequence scale only.”, type:“narrative” },
{ coins:29999, label:“EPIC ACTION”,     desc:“World-level action. Changes the raid outcome regardless of current state. DM narrates the full consequence.”, type:“epic” },
];

// ═══════════════════════════════════════════════════
// HOME BASE DATA
// ═══════════════════════════════════════════════════

const BASE_ROOMS = {
vault: {
name:“The Vault”,
icon:“🏦”,
desc:“Stores items safely between sessions. Higher tier = more capacity.”,
tiers:[
{ level:1, capacity:20,  cost:0,      bonus:“Basic storage. Items safe while at base.” },
{ level:2, capacity:50,  cost:5000,   bonus:“Expanded storage. Items organised by type.” },
{ level:3, capacity:100, cost:15000,  bonus:“Full vault. Item condition degrades 1 tier slower.” },
],
},
barracks: {
name:“The Barracks”,
icon:“⚔️”,
desc:“Housing for guard NPCs. Higher tier allows more defenders.”,
tiers:[
{ level:1, capacity:2,  cost:3000,  bonus:“2 guard slots. Base defended on a 12+ roll.” },
{ level:2, capacity:4,  cost:8000,  bonus:“4 guards. Defense roll reduced to 9+.” },
{ level:3, capacity:6,  cost:20000, bonus:“6 guards. Elite defenders. Raid against base requires 14+ to breach.” },
],
},
forge: {
name:“The Forge”,
icon:“🔨”,
desc:“Repairs and upgrades items. Requires a Merchant or Warrior resident.”,
tiers:[
{ level:1, capacity:0, cost:4000,  bonus:“Repair Damaged → Worn (1 session, 500 coins).” },
{ level:2, capacity:0, cost:10000, bonus:“Repair any condition. Apply Common enchantments.” },
{ level:3, capacity:0, cost:25000, bonus:“Full repair and Rare enchantments. One upgrade/arc.” },
],
},
infirmary: {
name:“The Infirmary”,
icon:“💚”,
desc:“Rest and recovery. Requires a Healer resident to function at full capacity.”,
tiers:[
{ level:1, capacity:0, cost:3000,  bonus:“Rest at base restores 3 HP between sessions.” },
{ level:2, capacity:0, cost:8000,  bonus:“Rest restores full HP. Cures standard curses.” },
{ level:3, capacity:0, cost:18000, bonus:“Full recovery. +1 to all rolls next session after full rest.” },
],
},
watchtower: {
name:“The Watchtower”,
icon:“🗼”,
desc:“Advance warning of incoming raids. Allows preparation.”,
tiers:[
{ level:1, capacity:0, cost:4000,  bonus:“1 session warning before a base raid.” },
{ level:2, capacity:0, cost:10000, bonus:“2 session warning. Reveals attacker type.” },
{ level:3, capacity:0, cost:22000, bonus:“Full intel. Choose one encounter to remove from incoming raid.” },
],
},
};

const RESIDENT_ROLES = {
guard:    { label:“Guard”,    icon:“🛡”, bonus:“Counts toward barracks defense rolls.”, color:”#ef5350” },
healer:   { label:“Healer”,  icon:“💚”, bonus:“Infirmary heals +2 HP per session.”, color:”#66bb6a” },
smith:    { label:“Smith”,   icon:“🔨”, bonus:“Forge repair costs reduced by 20%.”, color:”#ffd54f” },
scholar:  { label:“Scholar”, icon:“📜”, bonus:“Vault items identified automatically.”, color:”#4fc3f7” },
merchant: { label:“Merchant”,icon:“💰”, bonus:“Base income: 50 coins per session.”, color:”#ff9800” },
bard:     { label:“Bard”,    icon:“🎵”, bonus:“Boosts morale — all players +1 first roll after resting.”, color:”#ce93d8” },
};

// Base raid encounters (when base is attacked)
const BASE_RAID_ENCOUNTERS = [
{ name:“Ashen Pack Scouting Party”, difficulty:6,  reward:“If defended: Ashen Fang loot. If breached: one vault item stolen.” },
{ name:“Kingdom Remnant Patrol”,    difficulty:8,  reward:“If defended: Garrison loot. If breached: coin cache taken.” },
{ name:“Hollow Entity Drift”,       difficulty:10, reward:“If defended: Hollow material. If breached: curse applied to one resident.” },
{ name:“Valdris Debt Collector”,    difficulty:12, reward:“If defended: Debt record seized. If breached: Debt token applied to one player.” },
{ name:“Rival Player Raid”,         difficulty:9,  reward:“Box Battle determines outcome. Winner chooses one item from vault.” },
{ name:“Thessaly’s Remapping”,      difficulty:14, reward:“If defended: Blueprint fragment. If breached: one room downgraded 1 tier.” },
];

const CLASS_BASE_STATS = {
Warrior:  { STR:8, DEF:7, INT:3, WIS:4, SPD:4, CHA:3, LCK:3 },
Wizard:   { STR:3, DEF:2, INT:9, WIS:7, SPD:5, CHA:4, LCK:4 },
Rogue:    { STR:5, DEF:3, INT:5, WIS:4, SPD:9, CHA:6, LCK:7 },
Healer:   { STR:3, DEF:4, INT:6, WIS:9, SPD:4, CHA:7, LCK:5 },
Merchant: { STR:3, DEF:3, INT:6, WIS:5, SPD:5, CHA:8, LCK:8 },
Bard:     { STR:3, DEF:2, INT:5, WIS:6, SPD:6, CHA:10,LCK:5 },
};

// Stat bonuses applied from trait tier
const TRAIT_STAT_BONUS = {
“⚠ Weakened”:   -1,
“✓ Standard”:    0,
“★ Strong”:      1,
“✦ Exceptional”: 2,
“⚡ LEGENDARY”:  3,
};

function getRep(cls,roll){return REP[cls]?.find(r=>roll>=r.r[0]&&roll<=r.r[1]);}
function getWeapon(cls,roll){return WEAPONS[cls]?.find(r=>roll>=r.r[0]&&roll<=r.r[1]);}
function getTrait(roll){return TRAIT_TIERS.find(t=>roll>=t.range[0]&&roll<=t.range[1]);}
function getSkill(cls,roll){return SIGNATURE_SKILLS[cls]?.find(r=>roll>=r.r[0]&&roll<=r.r[1]);}
function getShadow(cls,roll){return SHADOW_TRAITS[cls]?.find(r=>roll>=r.r[0]&&roll<=r.r[1]);}
function getEnchant(cls,roll){return ENCHANTMENTS[cls]?.find(r=>roll>=r.r[0]&&roll<=r.r[1]);}
function getDestiny(cls,roll){return DESTINY_THREADS[cls]?.find(r=>roll>=r.r[0]&&roll<=r.r[1]);}
function d20(){return Math.floor(Math.random()*20)+1;}

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

function getPlayerStats(player) {
const base=CLASS_BASE_STATS[player.cls]||{STR:5,DEF:5,INT:5,WIS:5,SPD:5,CHA:5,LCK:5};
const bonus=TRAIT_STAT_BONUS[player.traitLevel]||0;
const primary={Warrior:“STR”,Wizard:“INT”,Rogue:“SPD”,Healer:“WIS”,Merchant:“CHA”,Bard:“CHA”}[player.cls]||“STR”;
return Object.fromEntries(Object.entries(base).map(([k,v])=>[k,k===primary?v+bonus:v]));
}
function getPackUsed(pack){return(pack||[]).reduce((a,i)=>a+(ITEM_TYPES[i.type]?.slots||1),0);}
function getPackCapacity(cls){return CLASS_PACK_CAPACITY[cls]||8;}

export default function App() {
const [tab,setTab]=useState(“players”);
const [players,setPlayers]=useState([]);
const [alliances,setAlliances]=useState([]);
const [hof,setHof]=useState([]);
const [world,setWorld]=useState({arcTitle:””,arcVillain:””,arcThread:””,arcNumber:1,events:””});
const [session,setSession]=useState({notes:””,threads:””,episodePlayers:””,episodeScene:””});
const [search,setSearch]=useState(””);
const [selectedPlayer,setSelectedPlayer]=useState(null);
const [creation,setCreation]=useState({username:””,charname:””,cls:””,origin:””,payment:“tiktok”,notes:””,repRoll:null,traitRoll:null,weaponRoll:null,skillRoll:null,shadowRoll:null,enchantRoll:null,destinyRoll:null});
const [diceRoll,setDiceRoll]=useState(null);
const [diceAnim,setDiceAnim]=useState(false);
const [battleP1,setBattleP1]=useState(””); const [battleP2,setBattleP2]=useState(””);
const [battleCoins1,setBattleCoins1]=useState(””); const [battleCoins2,setBattleCoins2]=useState(””);
const [battleTime,setBattleTime]=useState(180); const [battleRunning,setBattleRunning]=useState(false);
const [refClass,setRefClass]=useState(“Warrior”);
const [rulesSection,setRulesSection]=useState(“overview”);
const [faqSearch,setFaqSearch]=useState(””); const [faqOpen,setFaqOpen]=useState(null);
const [charClass,setCharClass]=useState(“Warrior”); const [charSection,setCharSection]=useState(“story”);
const [weaponClass,setWeaponClass]=useState(“Warrior”); const [weaponRarity,setWeaponRarity]=useState(“all”); const [selectedWeapon,setSelectedWeapon]=useState(null);
const [npcs,setNpcs]=useState([]); const [selectedNpc,setSelectedNpc]=useState(null);
const [npcForm,setNpcForm]=useState({name:””,faction:””,location:””,disposition:“neutral”,status:“active”,notes:””,relationships:[]});
const [npcSearch,setNpcSearch]=useState(””);
const [villains,setVillains]=useState([]); const [selectedVillain,setSelectedVillain]=useState(null);
const [villainForm,setVillainForm]=useState({name:””,title:””,arc:””,faction:””,location:””,maxHp:100,hp:100,phase:1,status:“active”,description:””,motivation:””,weakness:””,abilities:[],crimes:[],phases:[]});
const battleRef=useRef(null);
// Session Log
const [sessionLog,setSessionLog]=useState([]);
const [sessionActive,setSessionActive]=useState(false);
const [sessionNumber,setSessionNumber]=useState(1);
const [sessionStartTime,setSessionStartTime]=useState(null);
const [logSearch,setLogSearch]=useState(””);
const [logFilter,setLogFilter]=useState(“all”);
const [manualLogEntry,setManualLogEntry]=useState({who:””,what:””,type:null});
// Dice context
const [diceContext,setDiceContext]=useState({player:””,purpose:””,target:””,customPurpose:””});
const [diceHistory,setDiceHistory]=useState([]);
const [diceSpinning,setDiceSpinning]=useState(false);
// Map
const [mapLocation,setMapLocation]=useState(null);
const [mapPins,setMapPins]=useState([]);
const [mapEvents,setMapEvents]=useState({});
const [mapDanger,setMapDanger]=useState({});
const [addPinForm,setAddPinForm]=useState({name:””,type:“player”,location:””,note:””});
const [showAddPin,setShowAddPin]=useState(false);
// Raids
const [activeRaid,setActiveRaid]=useState(null);
const [raidLog,setRaidLog]=useState([]);
const [raidPhase,setRaidPhase]=useState(0);
const [raidParty,setRaidParty]=useState([]);
const [raidLocation,setRaidLocation]=useState(””);
const [raidTier,setRaidTier]=useState(“skirmish”);
const [raidHistory,setRaidHistory]=useState([]);
// Base
const [baseRooms,setBaseRooms]=useState({vault:1,barracks:0,forge:0,infirmary:0,watchtower:0});
const [baseResidents,setBaseResidents]=useState([]);
const [baseDefense,setBaseDefense]=useState(3);
const [baseUnderAttack,setBaseUnderAttack]=useState(false);
const [baseAttackLog,setBaseAttackLog]=useState([]);
const [showAddResident,setShowAddResident]=useState(false);
const [residentForm,setResidentForm]=useState({name:””,role:“guard”,note:””});
// Inventory
const [vaults,setVaults]=useState({});
const [packs,setPacks]=useState({});
const [selectedInventoryPlayer,setSelectedInventoryPlayer]=useState(null);
const [inventoryTab,setInventoryTab]=useState(“pack”);
const [addItemForm,setAddItemForm]=useState({name:””,type:“weapon”,rarity:“Common”,condition:“Pristine”,slots:1,enchantment:””,provenance:””,obtainedBy:“found”,note:””});
const [arsenalTab,setArsenalTab]=useState(“armor”);
const [arsenalClass,setArsenalClass]=useState(“Warrior”);
const [selectedArsenal,setSelectedArsenal]=useState(null);
const [selectedChest,setSelectedChest]=useState(null);

useEffect(()=>{
if(battleRunning){battleRef.current=setInterval(()=>{setBattleTime(t=>{if(t<=1){clearInterval(battleRef.current);setBattleRunning(false);return 0;}return t-1;});},1000);}
else{clearInterval(battleRef.current);}
return()=>clearInterval(battleRef.current);
},[battleRunning]);

const fmt=(s)=>`${Math.floor(s/60)}:${(s%60).toString().padStart(2,"0")}`;

const addPlayer=()=>{
if(!creation.username||!creation.charname||!creation.cls)return alert(“Username, name, and class required.”);
const hp=CLASS_HP[creation.cls]||8;
const rep=creation.repRoll?getRep(creation.cls,creation.repRoll):null;
const wpn=creation.weaponRoll?getWeapon(creation.cls,creation.weaponRoll):null;
const trait=creation.traitRoll?getTrait(creation.traitRoll):null;
const skill=creation.skillRoll?getSkill(creation.cls,creation.skillRoll):null;
const shadow=creation.shadowRoll?getShadow(creation.cls,creation.shadowRoll):null;
const enchant=creation.enchantRoll?getEnchant(creation.cls,creation.enchantRoll):null;
const destiny=creation.destinyRoll?getDestiny(creation.cls,creation.destinyRoll):null;
const p={
id:Date.now(),…creation,hp,maxHp:hp,
position:“Starting Position — Pending May 2nd”,
title:rep?.title||””,repPassive:rep?.passive||””,traitLevel:trait?.level||””,
inventory:wpn?[wpn.name+(wpn.special!==“None.”?” (”+wpn.special+”)”:””)]:[],
signatureSkill:skill?.name||””,signatureSkillDesc:skill?.desc||””,
shadowTrait:shadow?.name||””,shadowTraitDesc:shadow?.desc||””,
enchantment:enchant?.name||””,enchantmentDesc:enchant?.desc||””,
destinyThread:destiny?.thread||””,
consequences:[],protectionBalance:0,isDead:false,giftPowerUsed:false,
joined:new Date().toLocaleDateString(),
};
setPlayers(prev=>[…prev,p]);
setCreation({username:””,charname:””,cls:””,origin:””,payment:“tiktok”,notes:””,repRoll:null,traitRoll:null,weaponRoll:null,skillRoll:null,shadowRoll:null,enchantRoll:null,destinyRoll:null});
setTab(“players”);
};

const updatePlayer=(id,updates)=>setPlayers(prev=>prev.map(p=>p.id===id?{…p,…updates}:p));
const adjHP=(id,d)=>{
const p=players.find(x=>x.id===id);
if(p){
const nh=Math.max(0,Math.min(p.maxHp,p.hp+d));
updatePlayer(id,{hp:nh});
addLog({type:“hp”,who:p.charname,what:`HP ${d>0?"+":""}${d} → ${nh}/${p.maxHp}`});
if(nh===0)addLog({type:“death”,who:p.charname,what:`${p.charname} DOWNED at 0 HP`});
}
};

const winnerCoins=Math.max(parseInt(battleCoins1)||0,parseInt(battleCoins2)||0);
const getBattleTier=(c)=>{
if(!c)return null;
if(c<5000)return{tier:“⚠ MINOR”,cons:“Lose title OR stat debuff (1 session)”,color:“rgba(20,40,10,0.8)”,border:”#4caf50”};
if(c<10000)return{tier:“⚔ MODERATE”,cons:“Cursed 2 sessions OR item stolen”,color:“rgba(40,25,5,0.8)”,border:”#ff9800”};
if(c<20000)return{tier:“💀 MAJOR”,cons:“Exile from region OR servant (1 session)”,color:“rgba(40,5,5,0.8)”,border:”#ef5350”};
if(c<45000)return{tier:“☠ SEVERE”,cons:“Character killed OR curse+exile+theft”,color:“rgba(40,5,20,0.8)”,border:”#880e4f”};
return{tier:“👁 OP — NARRATIVE CONTROL”,cons:“Winner narrates what they want.”,color:“rgba(15,5,40,0.8)”,border:”#9c27b0”};
};
const battleTier=getBattleTier(winnerCoins);

```
const addLog=(entry)=>{
if(!sessionActive)return;
const now=new Date();
setSessionLog(prev=>[...prev,{id:Date.now()+Math.random(),time:now.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit"}),timestamp:now.getTime(),session:sessionNumber,...entry}]);
```

};

const rollDice=()=>{
if(diceSpinning)return;
setDiceSpinning(true);
setDiceRoll(null);
setTimeout(()=>{
const result=d20();
setDiceRoll(result);
setDiceSpinning(false);
const cat=diceContext.purpose?ROLL_PURPOSES[diceContext.purpose]:null;
const purpose=diceContext.customPurpose||(diceContext.target&&diceContext.target!==“custom”?diceContext.target:””)||cat?.label||“General roll”;
const who=diceContext.player||“DM”;
const display=getDiceDisplay(result);
setDiceHistory(prev=>[{id:Date.now(),result,label:display?.label||””,player:who,purpose,time:new Date().toLocaleTimeString([],{hour:“2-digit”,minute:“2-digit”,second:“2-digit”})},…prev].slice(0,30));
addLog({type:“dice”,who,what:purpose,result,label:display?.label||””});
},1400);
};

const getDiceDisplay=(r)=>{
if(!r)return null;
if(r===1)return{label:“💀 FUMBLE”,desc:“Catastrophic backfire.”,bg:”#b71c1c”,glow:”#ef5350”};
if(r<=4)return{label:“✗ FAIL”,desc:“Action fails entirely.”,bg:”#c62828”,glow:”#ef5350”};
if(r<=9)return{label:“⚠ WEAK HIT”,desc:“Partial — something goes wrong.”,bg:“rgba(100,40,5,0.9)”,glow:”#ff9800”};
if(r<=14)return{label:“✓ SUCCESS”,desc:“Clean success.”,bg:“rgba(10,50,20,0.9)”,glow:”#4caf50”};
if(r<=19)return{label:“★ STRONG HIT”,desc:“Success + bonus effect.”,bg:“rgba(5,30,80,0.9)”,glow:”#4fc3f7”};
return{label:“⚡ CRITICAL!”,desc:“LEGENDARY. ANNOUNCE IT.”,bg:“rgba(60,10,100,0.9)”,glow:”#ce93d8”};
};
const diceDisplay=getDiceDisplay(diceRoll);

const TABS=[
{id:“players”,label:“👥 Players”},
{id:“create”,label:“🪆 Create”},
{id:“dice”,label:“🎲 Dice”},
{id:“battle”,label:“⚔️ Battle”},
{id:“protect”,label:“🛡 Protect”},
{id:“world”,label:“🗺 World”},
{id:“hof”,label:“🏆 HOF”},
{id:“log”,label:“⏱ Log”},
{id:“map”,label:“🌍 Map”},
{id:“raids”,label:“⚔️ Raids”},
{id:“base”,label:“🏠 Base”},
];

return (
<div style={S.app}>
{/* HEADER */}
<div style={S.header}>
<div style={{display:“flex”,alignItems:“center”,justifyContent:“space-between”}}>
<div>
<div style={{fontWeight:“bold”,fontSize:“0.95rem”,color:”#fff”,letterSpacing:2,fontFamily:“Georgia,serif”}}>
<span style={{color:C.purpleLight}}>✦</span> THE HOLLOW REALM <span style={{color:C.purpleLight}}>✦</span>
</div>
<div style={{fontSize:“0.6rem”,color:C.dim,letterSpacing:1,fontFamily:“Arial,sans-serif”}}>MOON SQUAD RPG · GM DASHBOARD</div>
</div>
<div style={{textAlign:“right”}}>
<div style={{background:`linear-gradient(135deg,${C.purple},#3f51b5)`,color:”#fff”,fontSize:“0.6rem”,fontWeight:“bold”,padding:“4px 10px”,borderRadius:20,letterSpacing:1,boxShadow:“0 0 15px rgba(138,90,220,0.4)”}}>⚡ LIVE READY</div>
<div style={{fontSize:“0.55rem”,color:C.dim,marginTop:2,fontFamily:“Arial,sans-serif”}}>GOES LIVE MAY 2, 2026</div>
</div>
</div>
</div>

```
  {/* TABS */}
  <div style={S.tabs}>
    {TABS.map(t=><div key={t.id} style={S.tab(tab===t.id)} onClick={()=>setTab(t.id)}>{t.label}</div>)}
  </div>

  {/* ═══ PLAYERS ═══ */}
  {tab==="players"&&(
    <div style={S.panel}>
      <div style={{display:"flex",gap:8,marginBottom:12}}>
        <input style={{...S.input,flex:1}} placeholder="✦ Search players..." value={search} onChange={e=>setSearch(e.target.value)}/>
        <button style={S.btn(C.purple)} onClick={()=>setTab("create")}>+ New</button>
      </div>
      {players.filter(p=>p.charname?.toLowerCase().includes(search.toLowerCase())||p.username?.toLowerCase().includes(search.toLowerCase())).length===0
        ?<div style={{textAlign:"center",color:C.dimmer,padding:"50px 16px",fontSize:"0.82rem"}}>
          <div style={{fontSize:"2rem",marginBottom:10}}>🌑</div>
          <div>The Hollow awaits its first adventurers.</div>
          <div style={{fontSize:"0.7rem",marginTop:6,color:C.dim}}>May 2nd, 2026</div>
        </div>
        :players.filter(p=>p.charname?.toLowerCase().includes(search.toLowerCase())||p.username?.toLowerCase().includes(search.toLowerCase())).map(p=>{
          const pct=Math.max(0,(p.hp/p.maxHp)*100);
          const hpColor=pct>60?C.green:pct>30?"#ff9800":C.red;
          return(
            <div key={p.id} style={S.playerCard(p.protectionBalance>0,p.isDead)}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                <div>
                  <div style={{fontWeight:"bold",fontSize:"1rem",color:"#fff"}}>{p.charname} {p.isDead?"☠":""}</div>
                  <div style={{fontSize:"0.65rem",color:C.purple,textTransform:"uppercase",letterSpacing:1,fontFamily:"Arial,sans-serif"}}>{CLASS_ICON[p.cls]} {p.cls} · @{p.username}</div>
                  <div style={{fontSize:"0.65rem",color:C.dim,fontFamily:"Arial,sans-serif"}}>📍 {p.origin}</div>
                  {p.title&&<div style={{fontSize:"0.68rem",color:C.gold,fontStyle:"italic"}}>✦ {p.title}</div>}
                </div>
                <button style={S.btnSm("rgba(138,90,220,0.2)",C.purpleLight)} onClick={()=>setSelectedPlayer(p.id)}>Manage</button>
              </div>
              <div style={{fontSize:"0.65rem",color:C.dim,display:"flex",justifyContent:"space-between",marginTop:8,fontFamily:"Arial,sans-serif"}}><span>HP</span><span>{p.hp}/{p.maxHp}</span></div>
              <div style={{height:5,background:"rgba(138,90,220,0.1)",borderRadius:4,overflow:"hidden",marginTop:3}}>
                <div style={{height:"100%",width:`${pct}%`,background:hpColor,borderRadius:4,transition:"width 0.3s",boxShadow:`0 0 8px ${hpColor}`}}/>
              </div>
              <div style={{display:"flex",flexWrap:"wrap",gap:4,marginTop:6}}>
                {p.isDead&&<span style={S.tag("rgba(50,10,10,0.8)","#ef5350")}>☠ DEAD</span>}
                {p.protectionBalance>0&&<span style={S.tag("rgba(60,50,10,0.8)",C.gold)}>🛡 {p.protectionBalance.toLocaleString()}</span>}
                {(p.consequences||[]).map((c,i)=><span key={i} style={S.tag(c.type==="curse"?"rgba(60,10,70,0.8)":c.type==="wanted"?"rgba(60,10,10,0.8)":c.type==="exile"?"rgba(30,30,40,0.8)":"rgba(5,40,35,0.8)",c.type==="curse"?"#e1bee7":c.type==="wanted"?"#ffcdd2":c.type==="exile"?"#bbb":"#b2dfdb")}>{c.label}</span>)}
              </div>
            </div>
          );
        })
      }
      {/* Player Detail Modal */}
      {selectedPlayer&&(()=>{
        const p=players.find(x=>x.id===selectedPlayer);
        if(!p)return null;
        const pct=Math.max(0,(p.hp/p.maxHp)*100);
        const hpColor=pct>60?C.green:pct>30?"#ff9800":C.red;
        return(
          <div style={{position:"fixed",inset:0,background:"rgba(2,1,15,0.97)",zIndex:200,overflowY:"auto",padding:16}}>
            <div style={{background:"rgba(15,12,40,0.99)",border:`1px solid ${C.borderGlow}`,borderRadius:12,padding:18,maxWidth:500,margin:"auto",boxShadow:"0 0 40px rgba(138,90,220,0.2)"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
                <div>
                  <div style={{fontWeight:"bold",fontSize:"0.95rem",color:"#fff"}}>{p.charname} — {CLASS_ICON[p.cls]} {p.cls}</div>
                  <div style={{fontSize:"0.65rem",color:C.dim,fontFamily:"Arial,sans-serif"}}>@{p.username} · {p.origin} · joined {p.joined}</div>
                  {p.title&&<div style={{fontSize:"0.73rem",color:C.gold,fontStyle:"italic",marginTop:2}}>✦ {p.title}</div>}
                  {p.repPassive&&<div style={{background:"rgba(10,8,30,0.8)",borderLeft:`2px solid ${C.gold}`,padding:"5px 10px",fontSize:"0.68rem",color:"#bbb",marginTop:8,borderRadius:"0 6px 6px 0",fontFamily:"Arial,sans-serif"}}>{p.repPassive}</div>}
                  {p.signatureSkill&&<div style={{background:"rgba(10,8,30,0.8)",borderLeft:`2px solid ${C.blue}`,padding:"5px 10px",fontSize:"0.68rem",color:"#bbb",marginTop:6,borderRadius:"0 6px 6px 0",fontFamily:"Arial,sans-serif"}}><span style={{color:C.blue,fontWeight:"bold"}}>⚡ {p.signatureSkill}: </span>{p.signatureSkillDesc}</div>}
                  {p.shadowTrait&&<div style={{background:"rgba(10,8,30,0.8)",borderLeft:"2px solid #ef5350",padding:"5px 10px",fontSize:"0.68rem",color:"#bbb",marginTop:6,borderRadius:"0 6px 6px 0",fontFamily:"Arial,sans-serif"}}><span style={{color:"#ef5350",fontWeight:"bold"}}>🌑 {p.shadowTrait}: </span>{p.shadowTraitDesc}</div>}
                  {p.enchantment&&<div style={{background:"rgba(10,8,30,0.8)",borderLeft:`2px solid ${C.gold}`,padding:"5px 10px",fontSize:"0.68rem",color:"#bbb",marginTop:6,borderRadius:"0 6px 6px 0",fontFamily:"Arial,sans-serif"}}><span style={{color:C.gold,fontWeight:"bold"}}>✨ {p.enchantment}: </span>{p.enchantmentDesc}</div>}
                  {p.destinyThread&&<div style={{background:"rgba(30,10,50,0.8)",borderLeft:"2px solid #ce93d8",padding:"5px 10px",fontSize:"0.7rem",color:"#ce93d8",marginTop:6,borderRadius:"0 6px 6px 0",fontStyle:"italic",fontFamily:"Arial,sans-serif"}}>🔮 "{p.destinyThread}"</div>}
                </div>
                <button style={{background:"none",border:"none",color:C.dim,fontSize:"1.2rem",cursor:"pointer"}} onClick={()=>setSelectedPlayer(null)}>✕</button>
              </div>
              <div style={S.sectionTitle}>HP — {p.hp}/{p.maxHp}</div>
              <div style={{height:8,background:"rgba(138,90,220,0.1)",borderRadius:4,overflow:"hidden",marginBottom:8}}>
                <div style={{height:"100%",width:`${pct}%`,background:hpColor,borderRadius:4,boxShadow:`0 0 10px ${hpColor}`}}/>
              </div>
              <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap"}}>
                {[-3,-2,-1].map(d=><button key={d} style={S.btnSm("rgba(80,10,10,0.8)",C.red)} onClick={()=>{adjHP(p.id,d);setSelectedPlayer(null);setTimeout(()=>setSelectedPlayer(p.id),10);}}>{d}</button>)}
                <div style={{flex:1}}/>
                {[1,2,3].map(d=><button key={d} style={S.btnSm("rgba(10,50,20,0.8)",C.green)} onClick={()=>{adjHP(p.id,d);setSelectedPlayer(null);setTimeout(()=>setSelectedPlayer(p.id),10);}}>+{d}</button>)}
                <button style={S.btnSm("rgba(30,25,60,0.8)",C.purpleLight)} onClick={()=>{updatePlayer(p.id,{hp:p.maxHp});setSelectedPlayer(null);setTimeout(()=>setSelectedPlayer(p.id),10);}}>Full</button>
              </div>
              <div style={S.sectionTitle}>Position</div>
              <input style={{...S.input,marginBottom:14}} defaultValue={p.position} onBlur={e=>updatePlayer(p.id,{position:e.target.value})}/>
              <div style={S.sectionTitle}>Inventory ({(p.inventory||[]).length} items)</div>
              {(p.inventory||[]).map((item,i)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:`1px solid ${C.dimmer}`,fontSize:"0.76rem",color:"#bbb",fontFamily:"Arial,sans-serif"}}>
                  <span>{item}</span>
                  <button onClick={()=>updatePlayer(p.id,{inventory:p.inventory.filter((_,j)=>j!==i)})} style={{background:"none",border:"none",color:C.dim,cursor:"pointer"}}>✕</button>
                </div>
              ))}
              <div style={{display:"flex",gap:6,marginTop:6,marginBottom:14}}>
                <input id={`item-${p.id}`} style={{...S.input,flex:1}} placeholder="Add item..."/>
                <button style={S.btnSm("rgba(10,50,20,0.8)",C.green)} onClick={()=>{const el=document.getElementById(`item-${p.id}`);if(el&&el.value.trim()){updatePlayer(p.id,{inventory:[...(p.inventory||[]),el.value.trim()]});el.value='';}}}>Add</button>
              </div>
              <div style={S.sectionTitle}>Consequences</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5,marginBottom:8}}>
                {[{type:"curse",label:"⚗ Cursed",bg:"rgba(50,10,60,0.8)"},{type:"wanted",label:"🎯 Wanted",bg:"rgba(60,10,10,0.8)"},{type:"exile",label:"🚫 Exiled",bg:"rgba(20,20,30,0.8)"},{type:"servant",label:"⛓ Servant",bg:"rgba(5,30,25,0.8)"}].map(c=>(
                  <button key={c.type} style={{...S.btnSm(c.bg),color:"#ddd"}} onClick={()=>updatePlayer(p.id,{consequences:[...(p.consequences||[]),{type:c.type,label:c.label}]})}>+ {c.label}</button>
                ))}
              </div>
              {(p.consequences||[]).map((c,i)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"5px 8px",background:"rgba(10,8,25,0.8)",borderRadius:5,marginBottom:5,fontSize:"0.74rem",fontFamily:"Arial,sans-serif"}}>
                  <span>{c.label}</span>
                  <button onClick={()=>updatePlayer(p.id,{consequences:p.consequences.filter((_,j)=>j!==i)})} style={{background:"none",border:"none",color:C.dim,cursor:"pointer",fontSize:"0.7rem"}}>✕ Lift</button>
                </div>
              ))}
              <div style={{...S.sectionTitle,marginTop:12}}>Gift Power</div>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
                <span style={{fontSize:"0.74rem",color:p.giftPowerUsed?C.dim:C.green,fontFamily:"Arial,sans-serif"}}>{p.giftPowerUsed?"✕ Used":"✓ Available"}</span>
                <button style={S.btnSm(p.giftPowerUsed?"rgba(30,25,50,0.8)":"rgba(60,10,80,0.8)",p.giftPowerUsed?C.dim:"#e1bee7")} onClick={()=>updatePlayer(p.id,{giftPowerUsed:!p.giftPowerUsed})}>{p.giftPowerUsed?"Reset":"Mark Used"}</button>
              </div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {p.isDead
                  ?<button style={S.btn(C.gold,"#000")} onClick={()=>{updatePlayer(p.id,{isDead:false,hp:Math.ceil(p.maxHp/2)});setSelectedPlayer(null);}}>⚗ Resurrect</button>
                  :<button style={S.btn("rgba(60,10,10,0.8)",C.red)} onClick={()=>{if(window.confirm("Mark dead?")){updatePlayer(p.id,{isDead:true});setSelectedPlayer(null);}}}>☠ Mark Dead</button>
                }
                <button style={S.btn("rgba(20,16,50,0.9)",C.dim)} onClick={()=>setSelectedPlayer(null)}>Close</button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  )}

  
  {tab==="create"&&(
    <div style={S.panel}>
      <div style={S.card}>
        <div style={S.sectionTitle}>New Character — 7-Roll Creation</div>

        {// Basic Info}
        <div style={{marginBottom:8}}>
          <label style={S.label}>TikTok Username</label>
          <input style={S.input} value={creation.username} onChange={e=>setCreation(p=>({...p,username:e.target.value}))} placeholder="@username"/>
        </div>
        <div style={{marginBottom:8}}>
          <label style={S.label}>Character Name</label>
          <select style={S.select} value={creation.charname} onChange={e=>setCreation(p=>({...p,charname:e.target.value}))}>
            <option value="">— Select Name —</option>
            {NAMES.filter(n=>!players.find(p=>p.charname===n&&!p.isDead)).map(n=><option key={n}>{n}</option>)}
          </select>
        </div>
        <div style={{marginBottom:8}}>
          <label style={S.label}>Class</label>
          <select style={S.select} value={creation.cls} onChange={e=>setCreation(p=>({...p,cls:e.target.value,repRoll:null,traitRoll:null,weaponRoll:null,skillRoll:null,shadowRoll:null,enchantRoll:null,destinyRoll:null}))}>
            <option value="">— Select Class —</option>
            {CLASSES.map(c=><option key={c}>{CLASS_ICON[c]} {c} — HP {CLASS_HP[c]}</option>)}
          </select>
        </div>

        {// Show base stats preview when class selected}
        {creation.cls&&(()=>{
          const base=CLASS_BASE_STATS[creation.cls];
          const traitBonus=TRAIT_STAT_BONUS[getTrait(creation.traitRoll)?.level]||0;
          const primaryStat={Warrior:"STR",Wizard:"INT",Rogue:"SPD",Healer:"WIS",Merchant:"CHA",Bard:"CHA"}[creation.cls];
          return(
            <div style={{background:"rgba(8,6,25,0.8)",border:`1px solid ${C.border}`,borderRadius:8,padding:10,marginBottom:10}}>
              <div style={{fontSize:"0.6rem",color:C.dim,textTransform:"uppercase",letterSpacing:2,marginBottom:8,fontFamily:"Arial,sans-serif"}}>Base Stats — {creation.cls}</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6}}>
                {Object.entries(base).map(([stat,val])=>{
                  const bonus=stat===primaryStat?traitBonus:0;
                  const final=val+bonus;
                  const statColor={STR:"#ef5350",DEF:"#ffd54f",INT:"#7c4dff",WIS:"#66bb6a",SPD:"#4fc3f7",CHA:"#ff9800",LCK:"#ce93d8"}[stat]||C.purpleLight;
                  return(
                    <div key={stat} style={{textAlign:"center"}}>
                      <div style={{fontSize:"0.58rem",color:C.dim,fontFamily:"Arial,sans-serif",marginBottom:2}}>{stat}</div>
                      <div style={{fontSize:"0.95rem",fontWeight:"bold",color:statColor,fontFamily:"Arial,sans-serif"}}>
                        {final}{bonus>0&&<span style={{fontSize:"0.55rem",color:C.green}}> +{bonus}</span>}
                      </div>
                      <div style={{height:3,background:"rgba(255,255,255,0.05)",borderRadius:2,overflow:"hidden",marginTop:2}}>
                        <div style={{height:"100%",width:`${Math.min(100,(final/12)*100)}%`,background:statColor,borderRadius:2}}/>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{fontSize:"0.62rem",color:C.dim,marginTop:8,fontFamily:"Arial,sans-serif"}}>HP: <span style={{color:C.green,fontWeight:"bold"}}>{CLASS_HP[creation.cls]}</span> · Primary stat bonus applied from Trait roll</div>
            </div>
          );
        })()}

        <div style={{marginBottom:8}}>
          <label style={S.label}>Origin</label>
          <select style={S.select} value={creation.origin} onChange={e=>setCreation(p=>({...p,origin:e.target.value}))}>
            <option value="">— Select Origin —</option>
            {ORIGINS.map(o=><option key={o}>{o}</option>)}
          </select>
        </div>
        <div style={{marginBottom:8}}>
          <label style={S.label}>Payment</label>
          <select style={S.select} value={creation.payment} onChange={e=>setCreation(p=>({...p,payment:e.target.value}))}>
            <option value="tiktok">TikTok Coins (1,000)</option>
            <option value="paypal">PayPal ($11.20 CAD)</option>
          </select>
        </div>
        <div style={{marginBottom:12}}>
          <label style={S.label}>Notes</label>
          <textarea style={S.textarea} value={creation.notes} onChange={e=>setCreation(p=>({...p,notes:e.target.value}))} placeholder="Trait description, player notes..."/>
        </div>

        {// 7 Creation Rolls — auto-populated dropdowns}
        {creation.cls&&(
          <div style={S.rollBox}>
            <div style={S.sectionTitle}>Creation Rolls — {creation.cls}</div>

            {// Roll config with full dropdown options}
            {[
              {
                key:"repRoll", label:"Roll 1 — Reputation Title",
                color:(r)=>r<=4?"#f44336":r<=9?"#81c784":r<=14?"#64b5f6":r<=19?"#ffb300":"#ce93d8",
                getResult:(r)=>getRep(creation.cls,r),
                options:REP[creation.cls]?.map(r=>{
                  const mid=(r.r[0]+r.r[1])/2;
                  const col=mid<=4?"#f44336":mid<=9?"#81c784":mid<=14?"#64b5f6":mid<=19?"#ffb300":"#ce93d8";
                  const range=r.r[0]===r.r[1]?String(r.r[0]):(r.r[0]+'–'+r.r[1]);
                  return{value:r.r[0],label:`${range} — ${r.title}`,col};
                }),
                renderResult:(r,result)=>(
                  <div style={{background:"rgba(10,8,30,0.9)",border:`1px solid ${r}40`,borderRadius:6,padding:"8px 12px"}}>
                    <div style={{color:r,fontWeight:"bold",fontSize:"0.78rem",marginBottom:4}}>{result.title}</div>
                    <div style={{fontSize:"0.68rem",color:"#888",lineHeight:1.5}}>{result.passive}</div>
                  </div>
                ),
              },
              {
                key:"traitRoll", label:"Roll 2 — Trait Effectiveness",
                color:(r)=>getTrait(r)?.color||C.purpleLight,
                getResult:(r)=>getTrait(r),
                options:TRAIT_TIERS.map((t,i)=>{
                  const ranges=[[1,4],[5,9],[10,14],[15,19],[20,20]];
                  const [lo,hi]=ranges[i];
                  return{value:lo,label:(lo===hi?String(lo):(lo+'-'+hi))+' — '+t.level,col:t.color};
                }),
                renderResult:(r,result)=>(
                  <div style={{background:"rgba(10,8,30,0.9)",border:`1px solid ${r}40`,borderRadius:6,padding:"8px 12px"}}>
                    <div style={{color:r,fontWeight:"bold",fontSize:"0.78rem",marginBottom:4}}>{result.level}</div>
                    <div style={{fontSize:"0.68rem",color:"#888"}}>{result.desc}</div>
                  </div>
                ),
              },
              {
                key:"weaponRoll", label:"Roll 3 — Starting Weapon",
                color:(r)=>RARITY_COLOR[getWeapon(creation.cls,r)?.rarity]||"#bbb",
                getResult:(r)=>getWeapon(creation.cls,r),
                options:WEAPONS[creation.cls]?.map(w=>{
                  const range=w.r[0]===w.r[1]?String(w.r[0]):(w.r[0]+'–'+w.r[1]);
                  return{value:w.r[0],label:`${range} — ${w.name} [${w.rarity}]`,col:RARITY_COLOR[w.rarity]};
                }),
                renderResult:(r,result)=>(
                  <div style={{background:"rgba(10,8,30,0.9)",border:`1px solid ${r}40`,borderRadius:6,padding:"8px 12px"}}>
                    <div style={{color:r,fontWeight:"bold",fontSize:"0.78rem",marginBottom:4}}>{result.name}</div>
                    <div style={{fontSize:"0.68rem",color:"#888"}}>{result.special}</div>
                    <div style={{fontSize:"0.62rem",color:RARITY_COLOR[result.rarity],marginTop:3}}>{result.rarity}</div>
                  </div>
                ),
              },
              {
                key:"skillRoll", label:"Roll 4 — Signature Skill",
                color:()=>C.blue,
                getResult:(r)=>getSkill(creation.cls,r),
                options:SIGNATURE_SKILLS[creation.cls]?.map(s=>{
                  const range=s.r[0]===s.r[1]?String(s.r[0]):(s.r[0]+'–'+s.r[1]);
                  return{value:s.r[0],label:`${range} — ${s.name}`,col:C.blue};
                }),
                renderResult:(r,result)=>(
                  <div style={{background:"rgba(10,8,30,0.9)",border:`1px solid ${r}40`,borderRadius:6,padding:"8px 12px"}}>
                    <div style={{color:r,fontWeight:"bold",fontSize:"0.78rem",marginBottom:4}}>{result.name}</div>
                    <div style={{fontSize:"0.68rem",color:"#888",lineHeight:1.5}}>{result.desc}</div>
                  </div>
                ),
              },
              {
                key:"shadowRoll", label:"Roll 5 — Shadow Trait",
                color:()=>"#ef5350",
                getResult:(r)=>getShadow(creation.cls,r),
                options:SHADOW_TRAITS[creation.cls]?.map(s=>{
                  const range=s.r[0]===s.r[1]?String(s.r[0]):(s.r[0]+'–'+s.r[1]);
                  return{value:s.r[0],label:`${range} — ${s.name}`,col:"#ef5350"};
                }),
                renderResult:(r,result)=>(
                  <div style={{background:"rgba(10,8,30,0.9)",border:`1px solid ${r}40`,borderRadius:6,padding:"8px 12px"}}>
                    <div style={{color:r,fontWeight:"bold",fontSize:"0.78rem",marginBottom:4}}>{result.name}</div>
                    <div style={{fontSize:"0.68rem",color:"#888",lineHeight:1.5}}>{result.desc}</div>
                  </div>
                ),
              },
              {
                key:"enchantRoll", label:"Roll 6 — Enchantment",
                color:()=>C.gold,
                getResult:(r)=>getEnchant(creation.cls,r),
                options:ENCHANTMENTS[creation.cls]?.map(e=>{
                  const range=e.r[0]===e.r[1]?String(e.r[0]):(e.r[0]+'–'+e.r[1]);
                  return{value:e.r[0],label:`${range} — ${e.name}`,col:C.gold};
                }),
                renderResult:(r,result)=>(
                  <div style={{background:"rgba(10,8,30,0.9)",border:`1px solid ${r}40`,borderRadius:6,padding:"8px 12px"}}>
                    <div style={{color:r,fontWeight:"bold",fontSize:"0.78rem",marginBottom:4}}>{result.name}</div>
                    <div style={{fontSize:"0.68rem",color:"#888",lineHeight:1.5}}>{result.desc}</div>
                  </div>
                ),
              },
              {
                key:"destinyRoll", label:"Roll 7 — Destiny Thread",
                color:()=>"#ce93d8",
                getResult:(r)=>getDestiny(creation.cls,r),
                options:DESTINY_THREADS[creation.cls]?.map(d=>{
                  const range=d.r[0]===d.r[1]?String(d.r[0]):(d.r[0]+'–'+d.r[1]);
                  const preview=d.thread.length>45?d.thread.slice(0,45)+"…":d.thread;
                  return{value:d.r[0],label:`${range} — ${preview}`,col:"#ce93d8"};
                }),
                renderResult:(r,result)=>(
                  <div style={{background:"rgba(20,5,35,0.9)",border:`1px solid ${r}40`,borderRadius:6,padding:"8px 12px"}}>
                    <div style={{color:r,fontSize:"0.72rem",lineHeight:1.6,fontStyle:"italic"}}>🔮 "{result.thread}"</div>
                  </div>
                ),
              },
            ].map(({key,label,color,getResult,options,renderResult})=>{
              const roll=creation[key];
              const result=roll?getResult(roll):null;
              const col=roll?color(roll):C.dim;
              return(
                <div key={key} style={{marginBottom:14,paddingBottom:14,borderBottom:`1px solid ${C.dimmer}`}}>
                  <div style={{fontSize:"0.68rem",color:C.dim,marginBottom:6,fontFamily:"Arial,sans-serif",fontWeight:"bold"}}>{label}</div>

                  {// Roll button + number input + dropdown}
                  <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:6,flexWrap:"wrap"}}>
                    <button style={{...S.btnSm(C.purple),flexShrink:0}} onClick={()=>setCreation(p=>({...p,[key]:d20()}))}>🎲 Roll</button>
                    <input
                      type="number" min="1" max="20"
                      style={{...S.input,width:56,flexShrink:0}}
                      value={creation[key]||""}
                      onChange={e=>setCreation(p=>({...p,[key]:parseInt(e.target.value)||null}))}
                      placeholder="1–20"
                    />
                    <span style={{fontSize:"0.7rem",color:C.dim,fontFamily:"Arial,sans-serif",flexShrink:0}}>or pick:</span>
                    <select
                      style={{...S.select,flex:1,fontSize:"0.68rem",padding:"7px 8px"}}
                      value={creation[key]||""}
                      onChange={e=>setCreation(p=>({...p,[key]:parseInt(e.target.value)||null}))}
                    >
                      <option value="">— Select result —</option>
                      {options?.map(opt=>(
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>

                  {// Auto-populated result card}
                  {roll&&result&&renderResult(col,result)}
                </div>
              );
            })}

            {// Character preview summary}
            {(creation.repRoll||creation.weaponRoll||creation.skillRoll)&&(
              <div style={{background:"rgba(138,90,220,0.05)",border:`1px solid ${C.border}`,borderRadius:8,padding:12,marginTop:8}}>
                <div style={{fontSize:"0.6rem",color:C.purple,textTransform:"uppercase",letterSpacing:2,marginBottom:8,fontFamily:"Arial,sans-serif"}}>Character Preview</div>
                <div style={{fontSize:"0.75rem",color:"#fff",fontWeight:"bold",marginBottom:4}}>{creation.charname||"—"} · {CLASS_ICON[creation.cls]} {creation.cls}</div>
                {creation.repRoll&&getRep(creation.cls,creation.repRoll)&&<div style={{fontSize:"0.68rem",color:C.gold,fontStyle:"italic",marginBottom:2}}>✦ {getRep(creation.cls,creation.repRoll)?.title}</div>}
                {creation.weaponRoll&&getWeapon(creation.cls,creation.weaponRoll)&&<div style={{fontSize:"0.68rem",color:RARITY_COLOR[getWeapon(creation.cls,creation.weaponRoll)?.rarity],marginBottom:2}}>⚔️ {getWeapon(creation.cls,creation.weaponRoll)?.name}</div>}
                {creation.skillRoll&&getSkill(creation.cls,creation.skillRoll)&&<div style={{fontSize:"0.68rem",color:C.blue,marginBottom:2}}>⚡ {getSkill(creation.cls,creation.skillRoll)?.name}</div>}
                {creation.shadowRoll&&getShadow(creation.cls,creation.shadowRoll)&&<div style={{fontSize:"0.68rem",color:"#ef5350",marginBottom:2}}>🌑 {getShadow(creation.cls,creation.shadowRoll)?.name}</div>}
                {creation.destinyRoll&&getDestiny(creation.cls,creation.destinyRoll)&&<div style={{fontSize:"0.67rem",color:"#ce93d8",fontStyle:"italic"}}>🔮 "{getDestiny(creation.cls,creation.destinyRoll)?.thread?.slice(0,80)}…"</div>}
              </div>
            )}
          </div>
        )}

        <button style={{...S.btn(C.purple),width:"100%",marginTop:8}} onClick={addPlayer}>✦ Add to The Hollow Realm</button>
      </div>
    </div>
  )}



  {tab === "dice" && (
    <div style={S.panel}>

      {// ── Animated d20 ──}
      <div style={S.cardGlow}>
        <div style={{ textAlign:"center", padding:"10px 0 20px" }}>

          {// D20 SVG — icosahedron face projection}
          <div style={{ position:"relative", display:"inline-block", marginBottom:16 }}>
            <svg
              viewBox="0 0 120 120"
              width="160" height="160"
              style={{
                filter: diceSpinning
                  ? "drop-shadow(0 0 12px #b388ff)"
                  : diceNumber ? `drop-shadow(0 0 16px ${getDiceDisplay(diceNumber)?.glow || "#b388ff"})`
                  : "drop-shadow(0 0 8px rgba(138,90,220,0.4))",
                transition:"filter 0.3s",
                animation: diceSpinning ? "d20spin 0.18s linear infinite" : "none",
              }}
            >
              <defs>
                <style>{`
                  @keyframes d20spin {
                    0%   { transform: rotate(0deg);   transform-origin: 60px 60px; }
                    100% { transform: rotate(360deg); transform-origin: 60px 60px; }
                  }
                `}</style>
                <radialGradient id="faceGrad" cx="50%" cy="40%" r="60%">
                  <stop offset="0%" stopColor={
                    diceSpinning ? "#3d2b6b" :
                    diceNumber === null ? "#2a1f5e" :
                    diceNumber === 1 ? "#5d0a0a" :
                    diceNumber <= 4 ? "#4a1010" :
                    diceNumber <= 9 ? "#4a2a08" :
                    diceNumber <= 14 ? "#0a3d1a" :
                    diceNumber <= 19 ? "#0a2550" :
                    "#3d0a6b"
                  }/>
                  <stop offset="100%" stopColor="#050510"/>
                </radialGradient>
                <radialGradient id="edgeGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor={
                    diceSpinning ? "#b388ff" :
                    !diceNumber ? "#7b6fa0" :
                    getDiceDisplay(diceNumber)?.glow || "#b388ff"
                  } stopOpacity="0.9"/>
                  <stop offset="100%" stopColor="transparent"/>
                </radialGradient>
              </defs>

              {// Outer glow circle}
              <circle cx="60" cy="60" r="56" fill="none"
                stroke={diceSpinning ? "#b388ff" : !diceNumber ? "#3d3560" : getDiceDisplay(diceNumber)?.glow || "#b388ff"}
                strokeWidth="0.5" opacity="0.4"/>

              {// Main d20 icosahedron — top-view projection}
              {// Outer pentagon}
              <polygon
                points="60,8 106,37 91,88 29,88 14,37"
                fill="url(#faceGrad)"
                stroke={diceSpinning ? "#b388ff" : !diceNumber ? "#4a3f7a" : getDiceDisplay(diceNumber)?.glow || "#b388ff"}
                strokeWidth="1.2"
              />
              {// Inner top triangle}
              <polygon points="60,8 80,42 40,42" fill="none"
                stroke={diceSpinning?"#b388ff60":!diceNumber?"#3d3560":getDiceDisplay(diceNumber)?.glow+"60"||"#b388ff60"}
                strokeWidth="0.6"/>
              {// Inner facets — left}
              <polygon points="14,37 40,42 29,88" fill="none"
                stroke={diceSpinning?"#b388ff40":!diceNumber?"#3d3560":getDiceDisplay(diceNumber)?.glow+"40"||"#b388ff40"}
                strokeWidth="0.6"/>
              {// Inner facets — right}
              <polygon points="106,37 80,42 91,88" fill="none"
                stroke={diceSpinning?"#b388ff40":!diceNumber?"#3d3560":getDiceDisplay(diceNumber)?.glow+"40"||"#b388ff40"}
                strokeWidth="0.6"/>
              {// Bottom facet}
              <polygon points="29,88 60,72 91,88" fill="none"
                stroke={diceSpinning?"#b388ff40":!diceNumber?"#3d3560":getDiceDisplay(diceNumber)?.glow+"40"||"#b388ff40"}
                strokeWidth="0.6"/>
              {// Centre lines}
              <line x1="60" y1="8"   x2="60" y2="72"  stroke={diceSpinning?"#b388ff20":!diceNumber?"#2a2040":"#b388ff20"} strokeWidth="0.4"/>
              <line x1="14" y1="37"  x2="91" y2="88"  stroke={diceSpinning?"#b388ff20":!diceNumber?"#2a2040":"#b388ff20"} strokeWidth="0.4"/>
              <line x1="106" y1="37" x2="29" y2="88"  stroke={diceSpinning?"#b388ff20":!diceNumber?"#2a2040":"#b388ff20"} strokeWidth="0.4"/>
              {// Centre cross point}
              <line x1="40" y1="42" x2="80" y2="42" stroke={diceSpinning?"#b388ff30":!diceNumber?"#2a2040":"#b388ff30"} strokeWidth="0.4"/>
              <line x1="40" y1="42" x2="60" y2="72" stroke={diceSpinning?"#b388ff30":!diceNumber?"#2a2040":"#b388ff30"} strokeWidth="0.4"/>
              <line x1="80" y1="42" x2="60" y2="72" stroke={diceSpinning?"#b388ff30":!diceNumber?"#2a2040":"#b388ff30"} strokeWidth="0.4"/>

              {// Number display — centre}
              {diceSpinning ? (
                <text x="60" y="58" textAnchor="middle" dominantBaseline="middle"
                  fontSize="28" fontWeight="bold" fill="#b388ff" opacity="0.5"
                  fontFamily="Georgia, serif" style={{userSelect:"none"}}>
                  ?
                </text>
              ) : diceNumber ? (
                <text x="60" y="58" textAnchor="middle" dominantBaseline="middle"
                  fontSize={diceNumber >= 10 ? "22" : "28"}
                  fontWeight="bold"
                  fill={getDiceDisplay(diceNumber)?.glow || "#fff"}
                  fontFamily="Georgia, serif"
                  style={{userSelect:"none"}}
                  filter="url(#glow)">
                  {diceNumber}
                </text>
              ) : (
                <text x="60" y="58" textAnchor="middle" dominantBaseline="middle"
                  fontSize="13" fill="#4a3f7a" fontFamily="Arial, sans-serif"
                  style={{userSelect:"none"}}>
                  d20
                </text>
              )}

              {// "20" underline decoration}
              {diceNumber === 20 && !diceSpinning && (
                <line x1="46" y1="66" x2="74" y2="66"
                  stroke="#ce93d8" strokeWidth="1.2"
                  opacity="0.8"/>
              )}
            </svg>
          </div>

          {// Result display}
          {diceNumber && !diceSpinning && (() => {
            const display = getDiceDisplay(diceNumber);
            return (
              <div style={{
                padding:"12px 20px",
                background: display.bg,
                border:`1px solid ${display.glow}`,
                borderRadius:10,
                boxShadow:`0 0 30px ${display.glow}40`,
                marginBottom:16,
                transition:"all 0.4s",
              }}>
                <div style={{ fontSize:"1.3rem", fontWeight:"bold", color:"#fff", letterSpacing:2, fontFamily:"Georgia,serif" }}>{display.label}</div>
                <div style={{ fontSize:"0.76rem", color:"rgba(255,255,255,0.7)", marginTop:4, fontFamily:"Arial,sans-serif" }}>{display.desc}</div>
                {diceContext.player && (
                  <div style={{ fontSize:"0.68rem", color:"rgba(255,255,255,0.5)", marginTop:4, fontFamily:"Arial,sans-serif" }}>
                    {diceContext.player} · {diceContext.customPurpose || diceContext.target || ROLL_PURPOSES[diceContext.purpose]?.label || ""}
                  </div>
                )}
              </div>
            );
          })()}

          {// Roll Button}
          <button
            disabled={diceSpinning}
            style={{
              ...S.btn(`linear-gradient(135deg, ${C.purple}, #3f51b5)`),
              fontSize:"1rem", padding:"12px 40px",
              boxShadow: diceSpinning ? "none" : "0 0 25px rgba(138,90,220,0.5)",
              letterSpacing:1, opacity: diceSpinning ? 0.6 : 1,
              transition:"all 0.2s",
              cursor: diceSpinning ? "not-allowed" : "pointer",
            }}
            onClick={rollDice}>
            {diceSpinning ? "Rolling..." : "ROLL THE DICE"}
          </button>
        </div>
      </div>

      {// ── Context Dropdowns ──}
      <div style={S.card}>
        <div style={S.sectionTitle}>Roll Context — Auto-Logs to Session Feed</div>

        {// Player selector}
        <div style={{ marginBottom:10 }}>
          <label style={S.label}>For which player?</label>
          <select
            style={S.select}
            value={diceContext.player}
            onChange={e => setDiceContext(p => ({ ...p, player:e.target.value }))}
          >
            <option value="">DM / General Roll</option>
            <option value="DM">DM</option>
            <optgroup label="── Active Players ──">
              {players.filter(p=>!p.isDead).map(p => (
                <option key={p.id} value={p.charname}>
                  {CLASS_ICON[p.cls]} {p.charname} ({p.cls})
                </option>
              ))}
            </optgroup>
            {players.filter(p=>p.isDead).length > 0 && (
              <optgroup label="── Dead (legacy) ──">
                {players.filter(p=>p.isDead).map(p => (
                  <option key={p.id} value={p.charname}>☠ {p.charname}</option>
                ))}
              </optgroup>
            )}
          </select>
        </div>

        {// Purpose category}
        <div style={{ marginBottom:10 }}>
          <label style={S.label}>Roll Category</label>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:5 }}>
            {Object.entries(ROLL_PURPOSES).map(([key,cat]) => (
              <button key={key}
                onClick={() => setDiceContext(p => ({ ...p, purpose:key, target:"", customPurpose:"" }))}
                style={{
                  ...S.btnSm(
                    diceContext.purpose===key ? `${cat.color}25` : "rgba(10,8,30,0.8)",
                    diceContext.purpose===key ? cat.color : C.dim
                  ),
                  border:`1px solid ${diceContext.purpose===key ? cat.color : C.border}`,
                  fontSize:"0.62rem", padding:"6px 4px",
                  transition:"all 0.15s",
                }}>
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {// Specific purpose — shown when category selected}
        {diceContext.purpose && diceContext.purpose !== "custom" && (
          <div style={{ marginBottom:10 }}>
            <label style={S.label}>Specific Action</label>
            <select
              style={S.select}
              value={diceContext.target}
              onChange={e => setDiceContext(p => ({ ...p, target:e.target.value, customPurpose:"" }))}
            >
              <option value="">— Select action —</option>
              {ROLL_PURPOSES[diceContext.purpose]?.options.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
              <option value="custom">✏️ Custom...</option>
            </select>
          </div>
        )}

        {// Custom input}
        {(diceContext.purpose === "custom" || diceContext.target === "custom") && (
          <div style={{ marginBottom:10 }}>
            <label style={S.label}>Describe the roll</label>
            <input
              style={S.input}
              value={diceContext.customPurpose}
              onChange={e => setDiceContext(p => ({ ...p, customPurpose:e.target.value }))}
              placeholder="What is this roll for..."
            />
          </div>
        )}

        {// Context preview}
        {(diceContext.player || diceContext.purpose) && (
          <div style={{
            background:"rgba(138,90,220,0.05)",
            border:`1px solid ${C.border}`,
            borderRadius:6, padding:"8px 12px",
            fontSize:"0.7rem", color:C.dim, fontFamily:"Arial,sans-serif",
            display:"flex", gap:6, flexWrap:"wrap", alignItems:"center",
          }}>
            <span style={{ color:C.purpleLight }}>Next roll will log as:</span>
            {diceContext.player && <span style={{ color:C.gold }}>@{diceContext.player}</span>}
            {(diceContext.target && diceContext.target !== "custom") && <span style={{ color:"#fff" }}>— {diceContext.target}</span>}
            {diceContext.customPurpose && <span style={{ color:"#fff" }}>— {diceContext.customPurpose}</span>}
            {!diceContext.target && !diceContext.customPurpose && diceContext.purpose && (
              <span style={{ color:"#fff" }}>— {ROLL_PURPOSES[diceContext.purpose]?.label}</span>
            )}
            <button style={{ ...S.btnSm("rgba(60,10,10,0.5)","#888"), marginLeft:"auto", fontSize:"0.6rem" }}
              onClick={() => setDiceContext({ player:"", purpose:"", target:"", customPurpose:"" })}>
              Clear
            </button>
          </div>
        )}
      </div>

      {// ── Roll Reference ──}
      <div style={S.card}>
        <div style={S.sectionTitle}>Roll Reference</div>
        {[
          {r:"1",    label:"💀 FUMBLE",    col:"#ef5350", desc:"Catastrophic backfire — announce it"},
          {r:"2–4",  label:"✗ FAIL",       col:"#ef5350", desc:"Action fails entirely"},
          {r:"5–9",  label:"⚠ WEAK HIT",  col:"#ff9800", desc:"Partial — something goes wrong"},
          {r:"10–14",label:"✓ SUCCESS",    col:C.green,   desc:"Clean success"},
          {r:"15–19",label:"★ STRONG HIT", col:C.blue,    desc:"Success + bonus effect"},
          {r:"20",   label:"⚡ CRITICAL",  col:"#ce93d8", desc:"Legendary moment — ANNOUNCE IT"},
        ].map(({r,label,col,desc}) => (
          <div key={r} style={{ display:"flex", alignItems:"center", gap:10, padding:"7px 0", borderBottom:`1px solid ${C.dimmer}` }}>
            <span style={{ color:col, fontWeight:"bold", minWidth:36, fontSize:"0.75rem", fontFamily:"Arial,sans-serif" }}>{r}</span>
            <span style={{ color:col, fontWeight:"bold", fontSize:"0.75rem", minWidth:110, fontFamily:"Arial,sans-serif" }}>{label}</span>
            <span style={{ color:C.dim, fontSize:"0.7rem", fontFamily:"Arial,sans-serif" }}>{desc}</span>
          </div>
        ))}
      </div>

      {// ── Recent Roll History ──}
      {diceHistory.length > 0 && (
        <div style={S.card}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
            <div style={S.sectionTitle}>Recent Rolls</div>
            <button style={S.btnSm("rgba(60,10,10,0.6)","#888")}
              onClick={() => setDiceHistory([])}>Clear</button>
          </div>
          {diceHistory.slice(0,10).map((entry,i) => {
            const display = getDiceDisplay(entry.result);
            return (
              <div key={entry.id} style={{
                display:"flex", gap:10, alignItems:"center",
                padding:"7px 0", borderBottom:`1px solid ${C.dimmer}`,
              }}>
                {// Result badge}
                <div style={{
                  minWidth:38, height:38, borderRadius:6,
                  background: display?.bg || "rgba(30,25,60,0.8)",
                  border:`1px solid ${display?.glow || C.border}`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  flexShrink:0,
                  boxShadow: i===0 ? `0 0 10px ${display?.glow}40` : "none",
                }}>
                  <span style={{ fontWeight:"bold", color: display?.glow || "#fff", fontSize:"0.9rem", fontFamily:"Georgia,serif" }}>{entry.result}</span>
                </div>
                {// Info}
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", gap:6, alignItems:"baseline", flexWrap:"wrap" }}>
                    {entry.player && entry.player !== "DM" && (
                      <span style={{ fontSize:"0.72rem", fontWeight:"bold", color:C.purpleLight, fontFamily:"Arial,sans-serif" }}>{entry.player}</span>
                    )}
                    <span style={{ fontSize:"0.68rem", color: display?.glow || C.dim, fontFamily:"Arial,sans-serif", fontWeight:"bold" }}>{entry.label}</span>
                  </div>
                  <div style={{ fontSize:"0.67rem", color:C.dim, marginTop:2, fontFamily:"Arial,sans-serif" }}>{entry.purpose || "General roll"}</div>
                </div>
                {// Time}
                <div style={{ fontSize:"0.6rem", color:C.dimmer, fontFamily:"Arial,sans-serif", textAlign:"right", flexShrink:0 }}>{entry.time}</div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  )}
```

{/* ═══ BATTLE ═══ */}
{tab===“battle”&&(
<div style={S.panel}>
<div style={S.cardGlow}>
<div style={S.sectionTitle}>⚔️ Box Battle</div>
<div style={{display:“grid”,gridTemplateColumns:“1fr 1fr”,gap:10,marginBottom:12}}>
<div><label style={S.label}>Player 1</label><input style={S.input} value={battleP1} onChange={e=>setBattleP1(e.target.value)} placeholder=”@username”/><input style={{…S.input,marginTop:6}} value={battleCoins1} onChange={e=>setBattleCoins1(e.target.value)} placeholder=“Coins” type=“number”/></div>
<div><label style={S.label}>Player 2</label><input style={S.input} value={battleP2} onChange={e=>setBattleP2(e.target.value)} placeholder=”@username”/><input style={{…S.input,marginTop:6}} value={battleCoins2} onChange={e=>setBattleCoins2(e.target.value)} placeholder=“Coins” type=“number”/></div>
</div>
<div style={{textAlign:“center”,marginBottom:12}}>
<div style={{fontSize:“3rem”,fontWeight:“bold”,color:battleTime===0?C.red:battleTime<30?C.gold:C.blue,fontFamily:“Georgia,serif”,textShadow:`0 0 20px ${battleTime<30?C.gold:C.blue}`}}>{fmt(battleTime)}</div>
<div style={{display:“flex”,gap:8,justifyContent:“center”,marginTop:8}}>
<button style={S.btn(battleRunning?“rgba(60,10,10,0.8)”:C.purple)} onClick={()=>{if(!battleRunning){setBattleTime(180);}setBattleRunning(!battleRunning);}}>{battleRunning?“⏹ Stop”:“▶ Start (3 min)”}</button>
<button style={S.btn(“rgba(20,16,50,0.8)”,C.dim)} onClick={()=>{setBattleTime(180);setBattleRunning(false);}}>Reset</button>
</div>
</div>
{battleTier&&(<div style={{background:battleTier.color,border:`1px solid ${battleTier.border}`,borderRadius:8,padding:12,textAlign:“center”,boxShadow:`0 0 20px ${battleTier.border}30`}}><div style={{fontWeight:“bold”,fontSize:“0.9rem”,color:battleTier.border,fontFamily:“Arial,sans-serif”}}>{battleTier.tier}</div><div style={{fontSize:“0.76rem”,color:”#ccc”,marginTop:4,fontFamily:“Arial,sans-serif”}}>{battleTier.cons}</div></div>)}
</div>
<div style={S.card}>
<div style={S.sectionTitle}>Consequence Ladder</div>
{[{coins:”< 5,000”,tier:“⚠ MINOR”,cons:“Lose title OR stat debuff”,col:”#4caf50”},{coins:“5k–9,999”,tier:“⚔ MODERATE”,cons:“Cursed 2 sessions OR item stolen”,col:”#ff9800”},{coins:“10k–19,999”,tier:“💀 MAJOR”,cons:“Exile from region OR servant”,col:C.red},{coins:“20k–44,999”,tier:“☠ SEVERE”,cons:“Character killed OR curse+exile+theft”,col:”#e91e63”},{coins:“45k+”,tier:“👁 OP CONTROL”,cons:“Winner narrates anything.”,col:”#9c27b0”}].map(({coins,tier,cons,col})=>(
<div key={tier} style={{padding:“8px 0”,borderBottom:`1px solid ${C.dimmer}`,fontFamily:“Arial,sans-serif”}}>
<div style={{display:“flex”,gap:8,alignItems:“baseline”}}><span style={{color:col,fontWeight:“bold”,fontSize:“0.75rem”,minWidth:100}}>{tier}</span><span style={{color:C.dim,fontSize:“0.65rem”}}>{coins}</span></div>
<div style={{color:”#888”,fontSize:“0.68rem”,marginTop:2,paddingLeft:4}}>{cons}</div>
</div>
))}
</div>
</div>
)}

{/* ═══ PROTECT ═══ */}
{tab===“protect”&&(
<div style={S.panel}>
<div style={S.card}>
<div style={S.sectionTitle}>🛡 Protection Insurance Board</div>
<div style={{fontSize:“0.73rem”,color:C.dim,marginBottom:12,lineHeight:1.5,fontFamily:“Arial,sans-serif”}}>1,000 coins/session missed. Covers death + Box Battle targeting only.</div>
{players.filter(p=>!p.isDead).length===0?<div style={{color:C.dimmer,fontSize:“0.78rem”,textAlign:“center”,padding:“20px 0”,fontFamily:“Arial,sans-serif”}}>No active players yet.</div>
:players.filter(p=>!p.isDead).map(p=>(
<div key={p.id} style={{display:“flex”,justifyContent:“space-between”,alignItems:“center”,padding:“10px 0”,borderBottom:`1px solid ${C.dimmer}`}}>
<div><div style={{fontWeight:“bold”,fontSize:“0.82rem”,color:”#fff”}}>{p.charname}</div><div style={{fontSize:“0.65rem”,color:C.dim,fontFamily:“Arial,sans-serif”}}>@{p.username}</div></div>
<div style={{textAlign:“right”}}>
<div style={{color:p.protectionBalance>0?C.gold:C.dim,fontWeight:“bold”,fontSize:“0.8rem”,fontFamily:“Arial,sans-serif”}}>{p.protectionBalance>0?`🛡 ${p.protectionBalance.toLocaleString()} coins`:“⚠ Unprotected”}</div>
<div style={{display:“flex”,gap:5,marginTop:5,justifyContent:“flex-end”}}>
<button style={S.btnSm(“rgba(60,50,10,0.8)”,C.gold)} onClick={()=>updatePlayer(p.id,{protectionBalance:(p.protectionBalance||0)+1000})}>+1,000</button>
<button style={S.btnSm(“rgba(60,10,10,0.8)”,C.red)} onClick={()=>updatePlayer(p.id,{protectionBalance:Math.max(0,(p.protectionBalance||0)-1000)})}>-1,000</button>
</div>
</div>
</div>
))
}
</div>
</div>
)}

{/* ═══ WORLD ═══ */}
{tab===“world”&&(
<div style={S.panel}>
<div style={S.card}>
<div style={S.sectionTitle}>Current Arc</div>
<div style={{marginBottom:8}}><label style={S.label}>Arc Title</label><input style={S.input} value={world.arcTitle} onChange={e=>setWorld(p=>({…p,arcTitle:e.target.value}))} placeholder=“Arc title…”/></div>
<div style={{marginBottom:8}}><label style={S.label}>Villain / Antagonist</label><input style={S.input} value={world.arcVillain} onChange={e=>setWorld(p=>({…p,arcVillain:e.target.value}))} placeholder=“Who opposes them…”/></div>
<div style={{marginBottom:8}}><label style={S.label}>Active Story Thread</label><textarea style={S.textarea} value={world.arcThread} onChange={e=>setWorld(p=>({…p,arcThread:e.target.value}))} placeholder=“What’s happening right now…”/></div>
<div style={{marginBottom:8}}><label style={S.label}>World Events</label><textarea style={S.textarea} value={world.events} onChange={e=>setWorld(p=>({…p,events:e.target.value}))} placeholder=“Global events, faction news…”/></div>
</div>
<div style={S.card}>
<div style={S.sectionTitle}>Session Notes</div>
<div style={{marginBottom:8}}><label style={S.label}>Live Notes</label><textarea style={S.textarea} value={session.notes} onChange={e=>setSession(p=>({…p,notes:e.target.value}))} placeholder=“What happened this session…”/></div>
<div style={{marginBottom:8}}><label style={S.label}>Open Threads</label><textarea style={S.textarea} value={session.threads} onChange={e=>setSession(p=>({…p,threads:e.target.value}))} placeholder=“Cliffhangers, unresolved actions…”/></div>
<div style={{marginBottom:8}}><label style={S.label}>Episode Queue</label><input style={S.input} value={session.episodePlayers} onChange={e=>setSession(p=>({…p,episodePlayers:e.target.value}))} placeholder=“Who features in next episode…”/></div>
<div style={{marginBottom:8}}><label style={S.label}>Scene to Animate</label><textarea style={S.textarea} value={session.episodeScene} onChange={e=>setSession(p=>({…p,episodeScene:e.target.value}))} placeholder=“What moment gets animated…”/></div>
</div>
</div>
)}

{/* ═══ HOF ═══ */}
{tab===“hof”&&(
<div style={S.panel}>
{hof.map((h,i)=>(
<div key={i} style={{…S.card,borderColor:“rgba(255,213,79,0.3)”,boxShadow:“0 0 15px rgba(255,213,79,0.1)”}}>
<div style={{display:“flex”,justifyContent:“space-between”,alignItems:“flex-start”}}>
<div>
<div style={{fontWeight:“bold”,color:C.gold,fontSize:“0.9rem”}}>🏆 {h.name}</div>
{h.title&&<div style={{fontSize:“0.72rem”,color:C.dim,fontStyle:“italic”,fontFamily:“Arial,sans-serif”}}>✦ {h.title}</div>}
<div style={{fontSize:“0.68rem”,color:C.purple,marginTop:2,fontFamily:“Arial,sans-serif”}}>{h.reason}</div>
{h.notes&&<div style={{fontSize:“0.7rem”,color:”#888”,marginTop:4,fontFamily:“Arial,sans-serif”}}>{h.notes}</div>}
</div>
<div style={{fontSize:“0.62rem”,color:C.dim,whiteSpace:“nowrap”,fontFamily:“Arial,sans-serif”}}>{h.date}</div>
</div>
</div>
))}
<div style={S.card}>
<div style={S.sectionTitle}>Induct a Legend</div>
<div style={{marginBottom:8}}><input id="hof-n" style={S.input} placeholder="Character Name"/></div>
<div style={{marginBottom:8}}><input id="hof-t" style={S.input} placeholder="Title / Honor"/></div>
<div style={{marginBottom:8}}><select id="hof-r" style={S.select}><option>Natural 20 on world-changing action</option><option>Story-defining death</option><option>Box Battle OP tier (45,000+ coins)</option><option>Legendary reputation title earned</option><option>Origin Story episode produced</option><option>Other legendary moment</option></select></div>
<div style={{marginBottom:8}}><textarea id="hof-nn" style={S.textarea} placeholder="Describe the moment..."/></div>
<button style={S.btn(C.gold,”#000”)} onClick={()=>{const n=document.getElementById(“hof-n”).value.trim();if(!n)return;setHof(p=>[…p,{name:n,title:document.getElementById(“hof-t”).value,reason:document.getElementById(“hof-r”).value,notes:document.getElementById(“hof-nn”).value,date:new Date().toLocaleDateString()}]);[“hof-n”,“hof-t”,“hof-nn”].forEach(id=>document.getElementById(id).value=””);}}>🏆 Induct into the Hall</button>
</div>
</div>
)}

```
  {tab === "log" && (
    <div style={S.panel}>

      {// ── Session Control Bar ──}
      <div style={{
        background: sessionActive ? "rgba(10,40,15,0.95)" : "rgba(20,16,50,0.95)",
        border:`1px solid ${sessionActive ? "#66bb6a60" : C.border}`,
        borderRadius:10, padding:14, marginBottom:12,
        boxShadow: sessionActive ? "0 0 20px rgba(102,187,106,0.1)" : "none",
      }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:sessionActive?10:0 }}>
          <div>
            <div style={{ fontWeight:"bold", fontSize:"0.88rem", color:"#fff" }}>
              {sessionActive ? `● Session ${sessionNumber} — Live` : `Session ${sessionNumber} — Standby`}
            </div>
            {sessionActive && sessionStartTime && (
              <div style={{ fontSize:"0.65rem", color:"#66bb6a", fontFamily:"Arial,sans-serif", marginTop:2 }}>
                Started {new Date(sessionStartTime).toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" })}
                {" · "}{Math.floor((Date.now() - sessionStartTime) / 60000)} min elapsed
              </div>
            )}
            {!sessionActive && (
              <div style={{ fontSize:"0.65rem", color:C.dim, fontFamily:"Arial,sans-serif", marginTop:2 }}>
                {sessionLog.filter(e => e.session === sessionNumber - 1).length > 0
                  ? `Last session: ${sessionLog.filter(e=>e.session===sessionNumber-1).length} entries logged`
                  : "No sessions logged yet"}
              </div>
            )}
          </div>
          <div style={{ display:"flex", gap:8 }}>
            {!sessionActive ? (
              <button style={{
                ...S.btn("rgba(10,60,20,0.9)", "#66bb6a"),
                border:"1px solid #66bb6a60",
                boxShadow:"0 0 15px rgba(102,187,106,0.2)",
              }} onClick={() => {
                const now = Date.now();
                setSessionActive(true);
                setSessionStartTime(now);
                addLog({
                  type:"session",
                  who:"DM",
                  what:`Session ${sessionNumber} began`,
                });
              }}>▶ Begin Session</button>
            ) : (
              <button style={{
                ...S.btn("rgba(60,10,10,0.9)", "#ef5350"),
                border:"1px solid #ef535060",
              }} onClick={() => {
                const duration = sessionStartTime ? Math.floor((Date.now() - sessionStartTime) / 60000) : 0;
                addLog({
                  type:"session",
                  who:"DM",
                  what:`Session ${sessionNumber} ended — ${duration} minutes`,
                });
                setSessionActive(false);
                setSessionStartTime(null);
                setSessionNumber(n => n + 1);
              }}>⏹ End Session</button>
            )}
          </div>
        </div>

        {// Quick Log Buttons — only when session active}
        {sessionActive && (
          <div style={{ borderTop:`1px solid rgba(255,255,255,0.05)`, paddingTop:10 }}>
            <div style={{ fontSize:"0.6rem", color:C.dim, textTransform:"uppercase", letterSpacing:1.5, marginBottom:8, fontFamily:"Arial,sans-serif" }}>Quick Log</div>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
              {[
                { label:"🎲 Roll", type:"dice", quick:true },
                { label:"❤️ HP Change", type:"hp", quick:true },
                { label:"⚔️ Action", type:"action", quick:true },
                { label:"🎁 Gift", type:"gift", quick:true },
                { label:"⚗️ Consequence", type:"consequence", quick:true },
                { label:"📝 Note", type:"note", quick:true },
              ].map(btn => (
                <button key={btn.type} style={{
                  ...S.btnSm(LOG_TYPES[btn.type].bg, LOG_TYPES[btn.type].color),
                  border:`1px solid ${LOG_TYPES[btn.type].color}40`,
                }} onClick={() => setManualLogEntry(p => ({ ...p, type: btn.type, who:"", what:"" }))}>
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {// ── Manual Entry Form ──}
      {manualLogEntry.type && sessionActive && (
        <div style={{
          ...S.card,
          border:`1px solid ${LOG_TYPES[manualLogEntry.type]?.color}40`,
          marginBottom:12,
        }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
            <div style={{ fontSize:"0.72rem", color:LOG_TYPES[manualLogEntry.type]?.color, fontFamily:"Arial,sans-serif", fontWeight:"bold" }}>
              {LOG_TYPES[manualLogEntry.type]?.icon} Log {LOG_TYPES[manualLogEntry.type]?.label}
            </div>
            <button style={{ background:"none", border:"none", color:C.dim, cursor:"pointer", fontSize:"1rem" }}
              onClick={() => setManualLogEntry({ who:"", what:"", type:null })}>✕</button>
          </div>
          <div style={{ display:"flex", gap:8, marginBottom:8 }}>
            <div style={{ flex:"0 0 130px" }}>
              <label style={S.label}>Who</label>
              <input style={S.input} value={manualLogEntry.who}
                onChange={e => setManualLogEntry(p => ({ ...p, who: e.target.value }))}
                placeholder="@player or DM"
                list="player-names-list"
              />
              <datalist id="player-names-list">
                <option value="DM"/>
                {players.filter(p => !p.isDead).map(p => <option key={p.id} value={p.charname}/>)}
              </datalist>
            </div>
            <div style={{ flex:1 }}>
              <label style={S.label}>What happened</label>
              <input style={S.input} value={manualLogEntry.what}
                onChange={e => setManualLogEntry(p => ({ ...p, what: e.target.value }))}
                placeholder="Describe the action..."
                onKeyDown={e => {
                  if (e.key === "Enter" && manualLogEntry.what.trim()) {
                    addLog({ type: manualLogEntry.type, who: manualLogEntry.who || "DM", what: manualLogEntry.what });
                    setManualLogEntry(p => ({ ...p, who:"", what:"" }));
                  }
                }}
              />
            </div>
          </div>
          <button style={{ ...S.btn(LOG_TYPES[manualLogEntry.type]?.bg, LOG_TYPES[manualLogEntry.type]?.color), border:`1px solid ${LOG_TYPES[manualLogEntry.type]?.color}40` }}
            onClick={() => {
              if (!manualLogEntry.what.trim()) return;
              addLog({ type: manualLogEntry.type, who: manualLogEntry.who || "DM", what: manualLogEntry.what });
              setManualLogEntry(p => ({ ...p, who:"", what:"" }));
            }}>
            + Add to Log
          </button>
        </div>
      )}

      {// ── Filter & Search ──}
      {sessionLog.length > 0 && (
        <div style={{ marginBottom:12 }}>
          <input style={{ ...S.input, marginBottom:8 }} placeholder="🔍 Search log..." value={logSearch}
            onChange={e => setLogSearch(e.target.value)}/>
          <div style={{ display:"flex", gap:5, overflowX:"auto", scrollbarWidth:"none" }}>
            <button onClick={() => setLogFilter("all")} style={{
              ...S.btnSm(logFilter==="all" ? C.purple : "rgba(10,8,30,0.8)", logFilter==="all" ? "#fff" : C.dim),
              border:`1px solid ${logFilter==="all" ? C.purple : C.border}`, flexShrink:0,
            }}>All ({sessionLog.length})</button>
            {Object.entries(LOG_TYPES).map(([key, val]) => {
              const count = sessionLog.filter(e => e.type === key).length;
              if (count === 0) return null;
              return (
                <button key={key} onClick={() => setLogFilter(key)} style={{
                  ...S.btnSm(logFilter===key ? val.bg : "rgba(10,8,30,0.8)", logFilter===key ? val.color : C.dim),
                  border:`1px solid ${logFilter===key ? val.color : C.border}`, flexShrink:0,
                }}>{val.icon} {val.label} ({count})</button>
              );
            })}
          </div>
        </div>
      )}

      {// ── Session Dividers + Log Feed ──}
      {sessionLog.length === 0 ? (
        <div style={{ textAlign:"center", color:C.dimmer, padding:"50px 16px", fontSize:"0.82rem" }}>
          <div style={{ fontSize:"2rem", marginBottom:10 }}>⏱</div>
          <div>No session started yet.</div>
          <div style={{ fontSize:"0.7rem", marginTop:6, color:C.dim }}>Hit Begin Session to start logging.</div>
        </div>
      ) : (
        <div>
          {// Undo last entry}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
            <div style={{ fontSize:"0.65rem", color:C.dim, fontFamily:"Arial,sans-serif" }}>
              {sessionLog.length} entries total
            </div>
            <button style={S.btnSm("rgba(60,10,10,0.8)", "#ef5350")} onClick={() => {
              if (sessionLog.length === 0) return;
              setSessionLog(prev => prev.slice(0, -1));
            }}>↩ Undo Last</button>
          </div>

          {// Group entries by session}
          {(() => {
            const sessions = [...new Set(sessionLog.map(e => e.session))].sort((a,b) => b-a);
            return sessions.map(sNum => {
              const entries = sessionLog
                .filter(e => e.session === sNum)
                .filter(e => logFilter === "all" || e.type === logFilter)
                .filter(e => !logSearch || e.who?.toLowerCase().includes(logSearch.toLowerCase()) || e.what?.toLowerCase().includes(logSearch.toLowerCase()))
                .reverse();

              if (entries.length === 0) return null;

              const sessionEntries = sessionLog.filter(e => e.session === sNum);
              const startEntry = sessionEntries.find(e => e.type === "session" && e.what.includes("began"));
              const endEntry = sessionEntries.find(e => e.type === "session" && e.what.includes("ended"));

              return (
                <div key={sNum} style={{ marginBottom:16 }}>
                  {// Session header}
                  <div style={{
                    background:"rgba(138,90,220,0.08)",
                    border:`1px solid ${C.border}`,
                    borderRadius:8, padding:"8px 12px", marginBottom:8,
                    display:"flex", justifyContent:"space-between", alignItems:"center",
                  }}>
                    <div style={{ fontWeight:"bold", fontSize:"0.78rem", color:C.purpleLight }}>
                      Session {sNum}
                    </div>
                    <div style={{ fontSize:"0.65rem", color:C.dim, fontFamily:"Arial,sans-serif", textAlign:"right" }}>
                      {startEntry && <div>Started {startEntry.time}</div>}
                      {endEntry && <div>Ended {endEntry.time}</div>}
                      <div>{sessionEntries.length} entries</div>
                    </div>
                  </div>

                  {// Log entries}
                  {entries.map((entry, i) => {
                    const t = LOG_TYPES[entry.type] || LOG_TYPES.note;
                    const isSession = entry.type === "session";
                    return (
                      <div key={entry.id} style={{
                        display:"flex", gap:10, padding:"8px 0",
                        borderBottom:`1px solid ${C.dimmer}`,
                        opacity: isSession ? 0.7 : 1,
                      }}>
                        {// Time column}
                        <div style={{ flexShrink:0, width:58, textAlign:"right" }}>
                          <div style={{ fontSize:"0.6rem", color:C.dim, fontFamily:"Arial,sans-serif", letterSpacing:0.3 }}>{entry.time}</div>
                        </div>

                        {// Type icon}
                        <div style={{ flexShrink:0, width:22, textAlign:"center" }}>
                          <span style={{ fontSize:"0.85rem" }}>{t.icon}</span>
                        </div>

                        {// Content}
                        <div style={{ flex:1 }}>
                          <div style={{ display:"flex", gap:6, alignItems:"baseline", flexWrap:"wrap" }}>
                            {entry.who && (
                              <span style={{ fontSize:"0.72rem", fontWeight:"bold", color:
                                entry.who === "DM" ? C.gold :
                                players.find(p => p.charname === entry.who) ? C.purpleLight : C.blue,
                                fontFamily:"Arial,sans-serif",
                              }}>{entry.who}</span>
                            )}
                            <span style={{ fontSize:"0.68rem", padding:"1px 6px", borderRadius:8, background:t.bg, color:t.color, fontFamily:"Arial,sans-serif" }}>{t.label}</span>
                          </div>
                          <div style={{ fontSize:"0.74rem", color:C.text, marginTop:3, lineHeight:1.5, fontFamily:"Arial,sans-serif" }}>{entry.what}</div>
                          {// Special display for dice rolls}
                          {entry.type === "dice" && entry.result && (
                            <div style={{
                              display:"inline-block", marginTop:4,
                              padding:"3px 10px", borderRadius:6,
                              background: entry.result === 20 ? "rgba(60,10,100,0.8)" :
                                entry.result >= 15 ? "rgba(5,30,80,0.8)" :
                                entry.result >= 10 ? "rgba(10,50,20,0.8)" :
                                entry.result >= 5  ? "rgba(100,40,5,0.8)" : "rgba(80,10,10,0.8)",
                              border:`1px solid ${
                                entry.result === 20 ? "#ce93d8" :
                                entry.result >= 15 ? "#4fc3f7" :
                                entry.result >= 10 ? "#66bb6a" :
                                entry.result >= 5  ? "#ff9800" : "#ef5350"
                              }`,
                              fontSize:"0.68rem", fontWeight:"bold", color:"#fff", fontFamily:"Arial,sans-serif",
                            }}>
                              {entry.result === 1 ? "💀" : entry.result === 20 ? "⚡" : ""} {entry.result} — {entry.label}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            });
          })()}

          {// Clear log button}
          <div style={{ textAlign:"center", marginTop:16, paddingTop:12, borderTop:`1px solid ${C.dimmer}` }}>
            <button style={S.btn("rgba(40,10,10,0.8)", "#888")} onClick={() => {
              if (window.confirm("Clear entire session log? This cannot be undone.")) {
                setSessionLog([]);
                setSessionNumber(1);
                setSessionActive(false);
                setSessionStartTime(null);
              }
            }}>🗑 Clear All Logs</button>
          </div>
        </div>
      )}

    </div>
  )}



  {tab === "map" && (
    <div style={S.panel}>

      {mapLocation === null ? (
        // ══ WORLD OVERVIEW ══
        <div>
          {// Legend}
          <div style={{ ...S.card, marginBottom:12 }}>
            <div style={S.sectionTitle}>Map Legend</div>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
              {Object.entries(PIN_TYPES).map(([key,pt]) => (
                <div key={key} style={{ display:"flex", alignItems:"center", gap:4 }}>
                  <div style={{ width:10, height:10, borderRadius:"50%", background:pt.color, boxShadow:`0 0 6px ${pt.color}` }}/>
                  <span style={{ fontSize:"0.62rem", color:C.dim, fontFamily:"Arial,sans-serif" }}>{pt.label}</span>
                </div>
              ))}
            </div>
          </div>

          {// SVG Map Canvas}
          <div style={{
            background:"rgba(5,4,18,0.95)",
            border:`1px solid ${C.borderGlow}`,
            borderRadius:12,
            padding:0,
            marginBottom:12,
            position:"relative",
            overflow:"hidden",
            boxShadow:"0 0 30px rgba(138,90,220,0.15)",
          }}>
            <svg viewBox="0 0 100 100" style={{ width:"100%", display:"block" }}>
              {// Deep space background layers}
              <defs>
                <radialGradient id="mapBg" cx="50%" cy="50%" r="70%">
                  <stop offset="0%" stopColor="#0a0825" />
                  <stop offset="100%" stopColor="#050510" />
                </radialGradient>
                <radialGradient id="forestGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#2e7d32" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#2e7d32" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="edgeGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#9c27b0" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#9c27b0" stopOpacity="0" />
                </radialGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="0.8" result="coloredBlur"/>
                  <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
              </defs>

              {// Background}
              <rect width="100" height="100" fill="url(#mapBg)" />

              {// Ambient glows for key locations}
              <ellipse cx="18" cy="30" rx="18" ry="15" fill="url(#forestGlow)" />
              <ellipse cx="72" cy="38" rx="20" ry="18" fill="url(#edgeGlow)" />

              {// Star field (static decorative)}
              {[[8,12],[15,55],[25,80],[35,8],[42,45],[55,15],[65,88],[78,60],[88,25],[92,72],[5,90],[48,95]].map(([x,y],i) => (
                <circle key={i} cx={x} cy={y} r="0.3" fill="white" opacity={0.3+Math.sin(i)*0.3} />
              ))}

              {// Connection paths between locations}
              {WORLD_LOCATIONS.map(loc =>
                loc.connectedTo.map(toId => {
                  const to = WORLD_LOCATIONS.find(l => l.id === toId);
                  if (!to || to.id < loc.id) return null;
                  return (
                    <line key={`${loc.id}-${toId}`}
                      x1={loc.x} y1={loc.y} x2={to.x} y2={to.y}
                      stroke="rgba(138,90,220,0.2)" strokeWidth="0.4"
                      strokeDasharray="1.5,1.5"
                    />
                  );
                })
              )}

              {// Location circles + pins}
              {WORLD_LOCATIONS.map(loc => {
                const danger = mapDanger[loc.id] ?? loc.dangerDefault;
                const dangerColor = DANGER_COLORS[danger] || "#888";
                const pinsHere = mapPins.filter(pin => pin.location === loc.id);
                const playersHere = players.filter(p => !p.isDead && p.position && p.position.toLowerCase().includes(loc.shortName.toLowerCase().split(" ")[2]||loc.shortName.toLowerCase().split(" ")[1]||loc.shortName.toLowerCase()));

                return (
                  <g key={loc.id} onClick={() => setMapLocation(loc.id)} style={{ cursor:"pointer" }}>
                    {// Outer danger ring}
                    <circle cx={loc.x} cy={loc.y} r="5.5"
                      fill="none"
                      stroke={dangerColor}
                      strokeWidth="0.4"
                      opacity="0.5"
                      filter="url(#glow)"
                    />
                    {// Location circle}
                    <circle cx={loc.x} cy={loc.y} r="4.2"
                      fill={`${loc.color}25`}
                      stroke={loc.color}
                      strokeWidth="0.6"
                      filter="url(#glow)"
                    />
                    {// Icon text}
                    <text x={loc.x} y={loc.y+1.2} textAnchor="middle"
                      fontSize="3.5" style={{ userSelect:"none" }}>
                      {loc.icon}
                    </text>
                    {// Location name}
                    <text x={loc.x} y={loc.y+7.5} textAnchor="middle"
                      fontSize="2.2" fill="white" opacity="0.9"
                      fontFamily="Arial" style={{ userSelect:"none" }}>
                      {loc.shortName.replace("The ","")}
                    </text>
                    {// Danger indicator}
                    <text x={loc.x+3.5} y={loc.y-3} textAnchor="middle"
                      fontSize="1.8" fill={dangerColor} style={{ userSelect:"none" }}>
                      {"!".repeat(Math.max(0,danger-2))}
                    </text>
                    {// Pin count badges}
                    {pinsHere.length > 0 && (
                      <g>
                        <circle cx={loc.x-3.5} cy={loc.y-3.5} r="2.2"
                          fill="rgba(138,90,220,0.9)" stroke="#b388ff" strokeWidth="0.3" />
                        <text x={loc.x-3.5} y={loc.y-2.7} textAnchor="middle"
                          fontSize="2" fill="white" fontFamily="Arial" style={{ userSelect:"none" }}>
                          {pinsHere.length}
                        </text>
                      </g>
                    )}
                    {// Player dots}
                    {playersHere.slice(0,3).map((pl,i) => (
                      <circle key={pl.id}
                        cx={loc.x - 3 + i*2.2}
                        cy={loc.y + 4.8}
                        r="1"
                        fill="#b388ff"
                        stroke="#7b1fa2"
                        strokeWidth="0.2"
                      />
                    ))}
                  </g>
                );
              })}
            </svg>

            {// Tap hint}
            <div style={{ textAlign:"center", padding:"8px", fontSize:"0.62rem", color:C.dim, fontFamily:"Arial,sans-serif" }}>
              Tap any location to view details and manage pins
            </div>
          </div>

          {// Quick summary row}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, marginBottom:12 }}>
            <div style={{ ...S.card, textAlign:"center", padding:10 }}>
              <div style={{ fontSize:"1.2rem" }}>🧙</div>
              <div style={{ fontSize:"0.65rem", color:C.dim, fontFamily:"Arial,sans-serif" }}>Active Players</div>
              <div style={{ fontSize:"1rem", fontWeight:"bold", color:C.purpleLight }}>{players.filter(p=>!p.isDead).length}</div>
            </div>
            <div style={{ ...S.card, textAlign:"center", padding:10 }}>
              <div style={{ fontSize:"1.2rem" }}>📍</div>
              <div style={{ fontSize:"0.65rem", color:C.dim, fontFamily:"Arial,sans-serif" }}>Active Pins</div>
              <div style={{ fontSize:"1rem", fontWeight:"bold", color:C.gold }}>{mapPins.length}</div>
            </div>
            <div style={{ ...S.card, textAlign:"center", padding:10 }}>
              <div style={{ fontSize:"1.2rem" }}>⚠️</div>
              <div style={{ fontSize:"0.65rem", color:C.dim, fontFamily:"Arial,sans-serif" }}>Avg Danger</div>
              <div style={{ fontSize:"1rem", fontWeight:"bold", color:"#ef5350" }}>
                {WORLD_LOCATIONS.length > 0
                  ? DANGER_LABELS[Math.round(WORLD_LOCATIONS.reduce((a,l)=>a+(mapDanger[l.id]??l.dangerDefault),0)/WORLD_LOCATIONS.length)]
                  : "—"}
              </div>
            </div>
          </div>

          {// Location quick list}
          {WORLD_LOCATIONS.map(loc => {
            const danger = mapDanger[loc.id] ?? loc.dangerDefault;
            const pinsHere = mapPins.filter(p => p.location === loc.id);
            const byType = Object.entries(PIN_TYPES).map(([key,pt]) => ({
              key, pt, count: pinsHere.filter(p=>p.type===key).length
            })).filter(x=>x.count>0);

            return (
              <div key={loc.id}
                onClick={() => setMapLocation(loc.id)}
                style={{
                  ...S.card,
                  border:`1px solid ${loc.color}40`,
                  cursor:"pointer",
                  marginBottom:8,
                  transition:"all 0.2s",
                }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                    <span style={{ fontSize:"1.5rem" }}>{loc.icon}</span>
                    <div>
                      <div style={{ fontWeight:"bold", fontSize:"0.85rem", color:"#fff" }}>{loc.name}</div>
                      <div style={{ fontSize:"0.62rem", color:loc.color, fontFamily:"Arial,sans-serif", marginTop:1 }}>
                        Danger: <span style={{ color:DANGER_COLORS[danger], fontWeight:"bold" }}>{DANGER_LABELS[danger]}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    {byType.length > 0 && (
                      <div style={{ display:"flex", gap:5, justifyContent:"flex-end", flexWrap:"wrap" }}>
                        {byType.map(({key,pt,count}) => (
                          <span key={key} style={{
                            fontSize:"0.6rem", padding:"2px 6px", borderRadius:8,
                            background:pt.bg, color:pt.color,
                            fontFamily:"Arial,sans-serif",
                          }}>{pt.icon} {count}</span>
                        ))}
                      </div>
                    )}
                    <div style={{ fontSize:"0.62rem", color:C.dim, marginTop:4, fontFamily:"Arial,sans-serif" }}>Tap to expand →</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      ) : (
        // ══ LOCATION DETAIL ══
        (() => {
          const loc = WORLD_LOCATIONS.find(l => l.id === mapLocation);
          if (!loc) return null;
          const danger = mapDanger[loc.id] ?? loc.dangerDefault;
          const pinsHere = mapPins.filter(p => p.location === loc.id);
          const event = mapEvents[loc.id] || "";

          return (
            <div>
              {// Back button}
              <button style={{ ...S.btnSm("rgba(138,90,220,0.15)", C.purpleLight), marginBottom:14 }}
                onClick={() => { setMapLocation(null); setShowAddPin(false); }}>
                ← Back to Map
              </button>

              {// Location hero}
              <div style={{
                background:`linear-gradient(135deg, ${loc.glowColor}, rgba(5,4,18,0.98))`,
                border:`1px solid ${loc.color}60`,
                borderRadius:12, padding:16, marginBottom:12,
                position:"relative", overflow:"hidden",
              }}>
                <div style={{ position:"absolute", top:-15, right:-15, fontSize:"5rem", opacity:0.07 }}>{loc.icon}</div>
                <div style={{ fontSize:"2.5rem", marginBottom:6 }}>{loc.icon}</div>
                <div style={{ fontWeight:"bold", fontSize:"1rem", color:"#fff" }}>{loc.name}</div>
                <div style={{ fontSize:"0.72rem", color:loc.color, marginTop:4, lineHeight:1.5, fontFamily:"Arial,sans-serif" }}>{loc.description}</div>

                {// Danger slider}
                <div style={{ marginTop:12 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                    <span style={{ fontSize:"0.62rem", color:C.dim, textTransform:"uppercase", letterSpacing:1.5, fontFamily:"Arial,sans-serif" }}>Danger Level</span>
                    <span style={{ fontSize:"0.78rem", fontWeight:"bold", color:DANGER_COLORS[danger], fontFamily:"Arial,sans-serif" }}>
                      {danger}/5 — {DANGER_LABELS[danger]}
                    </span>
                  </div>
                  <div style={{ display:"flex", gap:5 }}>
                    {[1,2,3,4,5].map(d => (
                      <div key={d}
                        onClick={() => setMapDanger(prev => ({ ...prev, [loc.id]: d }))}
                        style={{
                          flex:1, height:8, borderRadius:4, cursor:"pointer",
                          background: d <= danger ? DANGER_COLORS[d] : "rgba(255,255,255,0.06)",
                          boxShadow: d <= danger ? `0 0 6px ${DANGER_COLORS[d]}80` : "none",
                          transition:"all 0.2s",
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {// Active event note}
              <div style={{ ...S.card, marginBottom:12 }}>
                <div style={S.sectionTitle}>📡 Active Event / Notes</div>
                <textarea style={{ ...S.textarea, minHeight:60 }}
                  value={event}
                  onChange={e => setMapEvents(prev => ({ ...prev, [loc.id]: e.target.value }))}
                  placeholder="What's happening here right now..."
                />
              </div>

              {// Location features}
              <div style={{ ...S.card, marginBottom:12 }}>
                <div style={S.sectionTitle}>Location Features</div>
                {loc.features.map((f,i) => (
                  <div key={i} style={{ display:"flex", gap:8, padding:"5px 0", borderBottom:`1px solid ${C.dimmer}`, fontSize:"0.73rem", color:C.dim, fontFamily:"Arial,sans-serif" }}>
                    <span style={{ color:loc.color, flexShrink:0 }}>✦</span>{f}
                  </div>
                ))}
                <div style={{ marginTop:10, fontSize:"0.71rem", color:"#888", lineHeight:1.6, fontStyle:"italic", fontFamily:"Arial,sans-serif" }}>{loc.lore}</div>
              </div>

              {// Pins section}
              <div style={{ ...S.card, marginBottom:12 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                  <div style={S.sectionTitle}>📍 Pins ({pinsHere.length})</div>
                  <button style={{ ...S.btnSm(C.purple), fontSize:"0.65rem" }}
                    onClick={() => setShowAddPin(!showAddPin)}>
                    {showAddPin ? "✕ Cancel" : "+ Add Pin"}
                  </button>
                </div>

                {// Add pin form}
                {showAddPin && (
                  <div style={{
                    background:"rgba(8,6,25,0.9)", border:`1px solid ${C.border}`,
                    borderRadius:8, padding:12, marginBottom:12,
                  }}>
                    <div style={{ marginBottom:8 }}>
                      <label style={S.label}>Name</label>
                      <input style={S.input} value={addPinForm.name}
                        onChange={e => setAddPinForm(p=>({...p,name:e.target.value}))}
                        placeholder="Who or what is here..."
                        list="pin-name-list"
                      />
                      <datalist id="pin-name-list">
                        {players.filter(p=>!p.isDead).map(p=><option key={p.id} value={p.charname}/>)}
                        {(typeof npcs !== "undefined" ? npcs : []).map(n=><option key={n.id} value={n.name}/>)}
                      </datalist>
                    </div>
                    <div style={{ marginBottom:8 }}>
                      <label style={S.label}>Type</label>
                      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:5 }}>
                        {Object.entries(PIN_TYPES).map(([key,pt]) => (
                          <button key={key}
                            style={{
                              ...S.btnSm(addPinForm.type===key ? pt.bg : "rgba(10,8,30,0.8)", addPinForm.type===key ? pt.color : C.dim),
                              border:`1px solid ${addPinForm.type===key ? pt.color : C.border}`,
                              fontSize:"0.6rem",
                            }}
                            onClick={() => setAddPinForm(p=>({...p,type:key}))}>
                            {pt.icon} {pt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div style={{ marginBottom:8 }}>
                      <label style={S.label}>Note (optional)</label>
                      <input style={S.input} value={addPinForm.note}
                        onChange={e => setAddPinForm(p=>({...p,note:e.target.value}))}
                        placeholder="Additional context..."
                      />
                    </div>
                    <button style={S.btn(C.purple)} onClick={() => {
                      if (!addPinForm.name.trim()) return;
                      setMapPins(prev => [...prev, {
                        id: Date.now(),
                        ...addPinForm,
                        location: loc.id,
                        addedAt: new Date().toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" }),
                      }]);
                      setAddPinForm({ name:"", type:"player", location:"", note:"" });
                      setShowAddPin(false);
                    }}>📍 Place Pin</button>
                  </div>
                )}

                {// Auto-suggest players currently at this location}
                {(() => {
                  const playersHere = players.filter(p =>
                    !p.isDead &&
                    p.position &&
                    p.position.toLowerCase().includes(
                      (loc.shortName.split(" ").slice(-1)[0] || "").toLowerCase()
                    ) &&
                    !mapPins.find(pin => pin.location===loc.id && pin.name===p.charname)
                  );
                  if (playersHere.length === 0) return null;
                  return (
                    <div style={{ background:"rgba(138,90,220,0.05)", borderRadius:6, padding:"8px 10px", marginBottom:10 }}>
                      <div style={{ fontSize:"0.6rem", color:C.purple, textTransform:"uppercase", letterSpacing:1.5, marginBottom:6, fontFamily:"Arial,sans-serif" }}>Players at this location</div>
                      {playersHere.map(p => (
                        <div key={p.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"3px 0" }}>
                          <span style={{ fontSize:"0.72rem", color:C.purpleLight, fontFamily:"Arial,sans-serif" }}>{p.charname} ({p.cls})</span>
                          <button style={{ ...S.btnSm("rgba(138,90,220,0.2)", C.purpleLight), fontSize:"0.6rem" }}
                            onClick={() => {
                              setMapPins(prev => [...prev, {
                                id: Date.now(),
                                name: p.charname,
                                type:"player",
                                location: loc.id,
                                note: `${p.cls} · HP ${p.hp}/${p.maxHp}`,
                                addedAt: new Date().toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" }),
                              }]);
                            }}>+ Pin</button>
                        </div>
                      ))}
                    </div>
                  );
                })()}

                {// Pin list}
                {pinsHere.length === 0 ? (
                  <div style={{ color:C.dimmer, fontSize:"0.72rem", textAlign:"center", padding:"12px 0", fontFamily:"Arial,sans-serif" }}>No pins placed here yet.</div>
                ) : (
                  // Group pins by type
                  Object.entries(PIN_TYPES).map(([typeKey, pt]) => {
                    const typePins = pinsHere.filter(p => p.type === typeKey);
                    if (typePins.length === 0) return null;
                    return (
                      <div key={typeKey} style={{ marginBottom:10 }}>
                        <div style={{ fontSize:"0.6rem", color:pt.color, textTransform:"uppercase", letterSpacing:1.5, marginBottom:5, fontFamily:"Arial,sans-serif" }}>
                          {pt.icon} {pt.label}s
                        </div>
                        {typePins.map(pin => (
                          <div key={pin.id} style={{
                            display:"flex", justifyContent:"space-between", alignItems:"flex-start",
                            padding:"7px 10px", marginBottom:5, borderRadius:7,
                            background: pt.bg,
                            border:`1px solid ${pt.color}30`,
                          }}>
                            <div>
                              <div style={{ fontWeight:"bold", fontSize:"0.78rem", color:pt.color }}>{pin.name}</div>
                              {pin.note && <div style={{ fontSize:"0.65rem", color:"#888", marginTop:2, fontFamily:"Arial,sans-serif" }}>{pin.note}</div>}
                              <div style={{ fontSize:"0.58rem", color:C.dimmer, marginTop:2, fontFamily:"Arial,sans-serif" }}>Added {pin.addedAt}</div>
                            </div>
                            <button style={{ background:"none", border:"none", color:C.dim, cursor:"pointer", fontSize:"0.9rem", flexShrink:0, marginLeft:8 }}
                              onClick={() => setMapPins(prev => prev.filter(p => p.id !== pin.id))}>✕</button>
                          </div>
                        ))}
                      </div>
                    );
                  })
                )}
              </div>

              {// Connections}
              <div style={S.card}>
                <div style={S.sectionTitle}>Connected Locations</div>
                <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                  {loc.connectedTo.map(toId => {
                    const to = WORLD_LOCATIONS.find(l => l.id === toId);
                    if (!to) return null;
                    return (
                      <button key={toId}
                        style={{
                          ...S.btnSm(`${to.color}20`, to.color),
                          border:`1px solid ${to.color}50`,
                        }}
                        onClick={() => { setMapLocation(toId); setShowAddPin(false); }}>
                        {to.icon} {to.shortName}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          );
        })()
      )}

    </div>
  )}



  {tab === "raids" && (
    <div style={S.panel}>

      {!activeRaid ? (
        // ══ RAID SETUP ══
        <div>
          <div style={S.cardGlow}>
            <div style={S.sectionTitle}>⚔️ Launch a Raid</div>
            <div style={{ fontSize:"0.72rem", color:C.dim, marginBottom:12, lineHeight:1.6, fontFamily:"Arial,sans-serif" }}>
              Raids are driven live by player gifts. Each phase presents an encounter — viewers gift to trigger their character&#39;s actions. Results roll in real time.
            </div>

            {// Tier selector}
            <div style={{ marginBottom:14 }}>
              <label style={S.label}>Raid Tier</label>
              <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                {Object.entries(RAID_TIERS).map(([key,tier]) => (
                  <div key={key}
                    onClick={() => setRaidTier(key)}
                    style={{
                      border:`1px solid ${raidTier===key ? tier.color : C.border}`,
                      borderRadius:8, padding:"10px 12px", cursor:"pointer",
                      background: raidTier===key ? `${tier.color}15` : "rgba(10,8,30,0.8)",
                      transition:"all 0.2s",
                    }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <div style={{ fontWeight:"bold", color: raidTier===key ? tier.color : "#fff", fontSize:"0.82rem" }}>{tier.label}</div>
                      <div style={{ fontSize:"0.62rem", color:tier.color, fontFamily:"Arial,sans-serif" }}>Max {tier.maxParty} players</div>
                    </div>
                    <div style={{ fontSize:"0.68rem", color:C.dim, marginTop:3, fontFamily:"Arial,sans-serif" }}>{tier.desc}</div>
                    <div style={{ fontSize:"0.62rem", color:tier.color, marginTop:3, fontFamily:"Arial,sans-serif" }}>💰 {tier.giftCost}</div>
                  </div>
                ))}
              </div>
            </div>

            {// Location selector}
            <div style={{ marginBottom:14 }}>
              <label style={S.label}>Target Location</label>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
                {Object.entries(RAID_LOCATIONS).map(([key,loc]) => (
                  <button key={key}
                    onClick={() => setRaidLocation(key)}
                    style={{
                      ...S.btnSm(raidLocation===key ? "rgba(138,90,220,0.2)" : "rgba(10,8,30,0.8)", raidLocation===key ? C.purpleLight : C.dim),
                      border:`1px solid ${raidLocation===key ? C.purple : C.border}`,
                      padding:"8px 10px", textAlign:"left",
                    }}>
                    {loc.icon} {loc.name.replace("The ","")}
                  </button>
                ))}
              </div>
            </div>

            {// Party selector}
            <div style={{ marginBottom:14 }}>
              <label style={S.label}>Raid Party (max {RAID_TIERS[raidTier]?.maxParty})</label>
              <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
                {players.filter(p=>!p.isDead).map(p => {
                  const inParty = raidParty.includes(p.id);
                  const maxParty = RAID_TIERS[raidTier]?.maxParty || 3;
                  return (
                    <div key={p.id} style={{
                      display:"flex", justifyContent:"space-between", alignItems:"center",
                      padding:"8px 10px", borderRadius:7,
                      border:`1px solid ${inParty ? C.purple : C.border}`,
                      background: inParty ? "rgba(138,90,220,0.1)" : "rgba(10,8,30,0.5)",
                    }}>
                      <div>
                        <div style={{ fontWeight:"bold", fontSize:"0.8rem", color:"#fff" }}>{p.charname}</div>
                        <div style={{ fontSize:"0.62rem", color:C.dim, fontFamily:"Arial,sans-serif" }}>{CLASS_ICON[p.cls]} {p.cls} · HP {p.hp}/{p.maxHp}</div>
                      </div>
                      <button style={S.btnSm(inParty ? C.purple : "rgba(30,25,60,0.8)", inParty ? "#fff" : C.dim)}
                        onClick={() => {
                          if (inParty) {
                            setRaidParty(prev => prev.filter(id => id !== p.id));
                          } else if (raidParty.length < maxParty) {
                            setRaidParty(prev => [...prev, p.id]);
                          }
                        }}>
                        {inParty ? "✓ In" : "+ Add"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              style={{ ...S.btn(raidParty.length > 0 && raidLocation ? C.purple : "rgba(30,25,60,0.5)", raidParty.length > 0 && raidLocation ? "#fff" : C.dim), width:"100%" }}
              onClick={() => {
                if (!raidParty.length || !raidLocation) return;
                const loc = RAID_LOCATIONS[raidLocation];
                const tier = RAID_TIERS[raidTier];
                const encounter = loc.encounters[Math.floor(Math.random() * loc.encounters.length)];
                setActiveRaid({ tier:raidTier, location:raidLocation, encounter, phase:0, log:[], actions:[] });
                setRaidPhase(0);
                setRaidLog([{
                  time: new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),
                  text:`🚨 ${tier.label} launched — ${loc.name}`,
                  type:"system"
                }]);
                setRaidResult(null);
              }}>
              ⚔️ Launch Raid
            </button>
          </div>

          {// Raid History}
          {raidHistory.length > 0 && (
            <div style={S.card}>
              <div style={S.sectionTitle}>Recent Raids</div>
              {raidHistory.slice(-5).reverse().map((r,i) => (
                <div key={i} style={{ padding:"8px 0", borderBottom:`1px solid ${C.dimmer}` }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <div style={{ fontWeight:"bold", fontSize:"0.78rem", color: r.success ? C.green : C.red }}>
                      {r.success ? "✓" : "✗"} {RAID_TIERS[r.tier]?.label} — {RAID_LOCATIONS[r.location]?.icon} {RAID_LOCATIONS[r.location]?.name.replace("The ","")}
                    </div>
                    <div style={{ fontSize:"0.62rem", color:C.dim, fontFamily:"Arial,sans-serif" }}>{r.date}</div>
                  </div>
                  {r.loot && <div style={{ fontSize:"0.65rem", color:C.gold, marginTop:2, fontFamily:"Arial,sans-serif" }}>💰 {r.loot}</div>}
                </div>
              ))}
            </div>
          )}
        </div>

      ) : (
        // ══ ACTIVE RAID ══
        (() => {
          const tier = RAID_TIERS[activeRaid.tier];
          const loc = RAID_LOCATIONS[activeRaid.location];
          const enc = activeRaid.encounter;
          const phase = tier.phases[raidPhase];
          const partyPlayers = players.filter(p => raidParty.includes(p.id));

          return (
            <div>
              {// Raid header}
              <div style={{
                background:`linear-gradient(135deg, ${tier.color}15, rgba(5,4,18,0.98))`,
                border:`1px solid ${tier.color}50`,
                borderRadius:12, padding:14, marginBottom:12,
              }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
                  <div>
                    <div style={{ fontWeight:"bold", color:tier.color, fontSize:"0.9rem" }}>{tier.label}</div>
                    <div style={{ fontSize:"0.78rem", color:"#fff", marginTop:2 }}>{loc.icon} {loc.name}</div>
                    <div style={{ fontSize:"0.68rem", color:C.dim, fontFamily:"Arial,sans-serif", marginTop:2 }}>
                      Encounter: <span style={{ color:"#fff" }}>{enc.name}</span>
                    </div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ fontSize:"0.62rem", color:C.dim, fontFamily:"Arial,sans-serif" }}>Phase {raidPhase+1}/{tier.phases.length}</div>
                    <div style={{ fontWeight:"bold", color:tier.color, fontSize:"0.82rem" }}>{phase}</div>
                  </div>
                </div>

                {// Phase progress bar}
                <div style={{ display:"flex", gap:3 }}>
                  {tier.phases.map((ph,i) => (
                    <div key={i} style={{
                      flex:1, height:5, borderRadius:3,
                      background: i <= raidPhase ? tier.color : "rgba(255,255,255,0.06)",
                      boxShadow: i === raidPhase ? `0 0 8px ${tier.color}` : "none",
                    }}/>
                  ))}
                </div>

                {// Party HP bars}
                <div style={{ marginTop:10 }}>
                  <div style={{ fontSize:"0.6rem", color:C.dim, textTransform:"uppercase", letterSpacing:1.5, marginBottom:6, fontFamily:"Arial,sans-serif" }}>Raid Party</div>
                  {partyPlayers.map(p => {
                    const pct = Math.max(0,(p.hp/p.maxHp)*100);
                    const hpColor = pct>60?C.green:pct>30?"#ff9800":C.red;
                    return (
                      <div key={p.id} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5 }}>
                        <span style={{ fontSize:"0.7rem", color:C.purpleLight, minWidth:70, fontFamily:"Arial,sans-serif" }}>{p.charname}</span>
                        <div style={{ flex:1, height:5, background:"rgba(255,255,255,0.05)", borderRadius:3, overflow:"hidden" }}>
                          <div style={{ height:"100%", width:`${pct}%`, background:hpColor, borderRadius:3, boxShadow:`0 0 4px ${hpColor}` }}/>
                        </div>
                        <span style={{ fontSize:"0.65rem", color:hpColor, minWidth:32, textAlign:"right", fontFamily:"Arial,sans-serif" }}>{p.hp}/{p.maxHp}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {// Encounter info}
              <div style={{ ...S.card, marginBottom:12 }}>
                <div style={S.sectionTitle}>Current Encounter</div>
                <div style={{ fontWeight:"bold", color:"#fff", fontSize:"0.85rem", marginBottom:6 }}>{enc.name}</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                  <div style={{ background:"rgba(10,8,30,0.8)", borderRadius:6, padding:"7px 10px" }}>
                    <div style={{ fontSize:"0.58rem", color:C.purple, textTransform:"uppercase", letterSpacing:1.5, marginBottom:3, fontFamily:"Arial,sans-serif" }}>Enemy / Challenge</div>
                    <div style={{ fontSize:"0.7rem", color:C.text, fontFamily:"Arial,sans-serif" }}>{enc.enemy}</div>
                  </div>
                  <div style={{ background:"rgba(10,8,30,0.8)", borderRadius:6, padding:"7px 10px" }}>
                    <div style={{ fontSize:"0.58rem", color:C.gold, textTransform:"uppercase", letterSpacing:1.5, marginBottom:3, fontFamily:"Arial,sans-serif" }}>Potential Reward</div>
                    <div style={{ fontSize:"0.7rem", color:C.gold, fontFamily:"Arial,sans-serif" }}>{enc.reward}</div>
                  </div>
                </div>
                <div style={{ marginTop:8, fontSize:"0.68rem", color:C.dim, fontFamily:"Arial,sans-serif" }}>
                  Difficulty: <span style={{ color: enc.difficulty>=14?"#ef5350":enc.difficulty>=10?"#ff9800":enc.difficulty>=7?"#ffd54f":C.green, fontWeight:"bold" }}>{enc.difficulty}/20</span>
                </div>
              </div>

              {// Gift Actions}
              <div style={{ ...S.card, marginBottom:12 }}>
                <div style={S.sectionTitle}>💰 Gift Actions — Log Live</div>
                <div style={{ fontSize:"0.68rem", color:C.dim, marginBottom:10, fontFamily:"Arial,sans-serif" }}>
                  As viewers gift, log the action here. Roll d20 after each major action.
                </div>
                {RAID_ACTIONS.map((action,i) => (
                  <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", padding:"8px 0", borderBottom:`1px solid ${C.dimmer}` }}>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:"bold", fontSize:"0.76rem", color:"#fff" }}>{action.label}</div>
                      <div style={{ fontSize:"0.65rem", color:C.dim, marginTop:2, fontFamily:"Arial,sans-serif" }}>{action.desc}</div>
                    </div>
                    <div style={{ textAlign:"right", marginLeft:10, flexShrink:0 }}>
                      <div style={{ fontSize:"0.7rem", color:C.gold, fontWeight:"bold", fontFamily:"Arial,sans-serif" }}>{action.coins.toLocaleString()}</div>
                      <button style={{ ...S.btnSm("rgba(138,90,220,0.2)", C.purpleLight), marginTop:4, fontSize:"0.6rem" }}
                        onClick={() => {
                          const time = new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit"});
                          setRaidLog(prev => [...prev, { time, text:`${action.label} triggered (${action.coins.toLocaleString()} coins) — roll d20`, type:"action" }]);
                        }}>Log</button>
                    </div>
                  </div>
                ))}
              </div>

              {// Raid Log}
              {raidLog.length > 0 && (
                <div style={{ ...S.card, marginBottom:12 }}>
                  <div style={S.sectionTitle}>📋 Raid Feed</div>
                  {raidLog.slice().reverse().map((entry,i) => (
                    <div key={i} style={{ display:"flex", gap:8, padding:"5px 0", borderBottom:`1px solid ${C.dimmer}` }}>
                      <span style={{ fontSize:"0.6rem", color:C.dim, flexShrink:0, fontFamily:"Arial,sans-serif", minWidth:48 }}>{entry.time}</span>
                      <span style={{ fontSize:"0.72rem", color: entry.type==="system"?C.gold:entry.type==="action"?C.blue:C.text, fontFamily:"Arial,sans-serif" }}>{entry.text}</span>
                    </div>
                  ))}
                </div>
              )}

              {// Phase controls}
              <div style={{ display:"flex", gap:8, marginBottom:12 }}>
                <button style={S.btn(C.purple)} onClick={() => {
                  if (raidPhase < tier.phases.length - 1) {
                    setRaidPhase(p => p+1);
                    const time = new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});
                    setRaidLog(prev => [...prev, { time, text:`Phase advanced → ${tier.phases[raidPhase+1]}`, type:"system" }]);
                  }
                }}>Next Phase →</button>

                <button style={S.btn(C.green,"#000")} onClick={() => {
                  setRaidHistory(prev => [...prev, {
                    tier:activeRaid.tier, location:activeRaid.location,
                    success:true, loot:enc.reward,
                    date:new Date().toLocaleDateString(),
                  }]);
                  setActiveRaid(null); setRaidParty([]); setRaidPhase(0); setRaidLog([]);
                }}>✓ Success</button>

                <button style={S.btn("rgba(60,10,10,0.8)",C.red)} onClick={() => {
                  setRaidHistory(prev => [...prev, {
                    tier:activeRaid.tier, location:activeRaid.location,
                    success:false, loot:"None — raid failed",
                    date:new Date().toLocaleDateString(),
                  }]);
                  setActiveRaid(null); setRaidParty([]); setRaidPhase(0); setRaidLog([]);
                }}>✗ Retreat</button>
              </div>
            </div>
          );
        })()
      )}
    </div>
  )}



  {tab === "base" && (
    <div style={S.panel}>

      {// Base header}
      <div style={{
        background:"linear-gradient(135deg, rgba(30,20,60,0.95), rgba(5,4,18,0.98))",
        border:`1px solid ${C.borderGlow}`,
        borderRadius:12, padding:16, marginBottom:12,
        boxShadow:"0 0 30px rgba(138,90,220,0.15)",
        position:"relative", overflow:"hidden",
      }}>
        <div style={{ position:"absolute", top:-15, right:-15, fontSize:"5rem", opacity:0.05 }}>🏠</div>
        <div style={{ fontSize:"2rem", marginBottom:6 }}>🏠</div>
        <div style={{ fontWeight:"bold", fontSize:"1rem", color:"#fff" }}>The Hollow Hearth</div>
        <div style={{ fontSize:"0.68rem", color:C.dim, fontFamily:"Arial,sans-serif", marginTop:2 }}>
          Home Base · Level {baseLevel} · {baseResidents.length} residents
        </div>

        {// Defense bar}
        <div style={{ marginTop:10 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
            <span style={{ fontSize:"0.62rem", color:C.dim, fontFamily:"Arial,sans-serif", textTransform:"uppercase", letterSpacing:1.5 }}>Defense Rating</span>
            <span style={{ fontSize:"0.72rem", fontWeight:"bold", color:DANGER_COLORS[Math.min(5,6-Math.ceil(baseDefense/2))], fontFamily:"Arial,sans-serif" }}>{baseDefense}/10</span>
          </div>
          <div style={{ height:6, background:"rgba(255,255,255,0.05)", borderRadius:3, overflow:"hidden" }}>
            <div style={{ height:"100%", width:`${(baseDefense/10)*100}%`, background:C.purple, borderRadius:3, boxShadow:`0 0 8px ${C.purple}` }}/>
          </div>
          <div style={{ display:"flex", gap:5, marginTop:6 }}>
            <button style={S.btnSm("rgba(10,50,20,0.8)",C.green)} onClick={()=>setBaseDefense(p=>Math.min(10,p+1))}>+1 DEF</button>
            <button style={S.btnSm("rgba(60,10,10,0.8)",C.red)} onClick={()=>setBaseDefense(p=>Math.max(0,p-1))}>-1 DEF</button>
            <button style={{ ...S.btnSm("rgba(60,10,10,0.8)","#ff9800"), marginLeft:"auto" }}
              onClick={() => {
                if (window.confirm("Trigger a base raid event?")) {
                  const enc = BASE_RAID_ENCOUNTERS[Math.floor(Math.random()*BASE_RAID_ENCOUNTERS.length)];
                  setBaseUnderAttack(true);
                  setBaseAttackLog(prev => [...prev, {
                    time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),
                    enc, defended: baseDefense >= enc.difficulty,
                  }]);
                }
              }}>⚠️ Base Raid</button>
          </div>
        </div>
      </div>

      {// Base raid alert}
      {baseUnderAttack && baseAttackLog.length > 0 && (() => {
        const latest = baseAttackLog[baseAttackLog.length-1];
        return (
          <div style={{ background:"rgba(60,10,10,0.9)", border:"1px solid #ef535060", borderRadius:10, padding:14, marginBottom:12 }}>
            <div style={{ fontWeight:"bold", color:"#ef5350", marginBottom:6 }}>🚨 BASE UNDER ATTACK</div>
            <div style={{ fontWeight:"bold", fontSize:"0.82rem", color:"#fff", marginBottom:4 }}>{latest.enc.name}</div>
            <div style={{ fontSize:"0.72rem", color:"#ccc", marginBottom:8, fontFamily:"Arial,sans-serif" }}>Difficulty: {latest.enc.difficulty}/10</div>
            <div style={{
              padding:"8px 12px", borderRadius:6,
              background: latest.defended ? "rgba(10,50,10,0.8)" : "rgba(50,10,10,0.8)",
              border:`1px solid ${latest.defended?"#66bb6a":"#ef5350"}50`,
              fontSize:"0.73rem", color: latest.defended?C.green:C.red, fontFamily:"Arial,sans-serif",
            }}>
              {latest.defended ? `✓ DEFENDED — ${latest.enc.reward.split(".")[0]}` : `✗ BREACHED — ${latest.enc.reward.split(".").slice(-1)[0]}`}
            </div>
            <button style={{ ...S.btnSm("rgba(30,25,50,0.8)",C.dim), marginTop:10 }} onClick={()=>setBaseUnderAttack(false)}>Dismiss</button>
          </div>
        );
      })()}

      {// Rooms grid}
      <div style={{ marginBottom:14 }}>
        <div style={S.sectionTitle}>Rooms & Facilities</div>
        {Object.entries(BASE_ROOMS).map(([key,room]) => {
          const currentLevel = baseRooms[key] || 0;
          const nextTier = room.tiers[currentLevel];
          const currentTier = room.tiers[currentLevel-1];
          return (
            <div key={key} style={{
              ...S.card,
              border:`1px solid ${currentLevel>0?C.purple:C.border}`,
              marginBottom:8,
              opacity: currentLevel===0 ? 0.7 : 1,
            }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                <div>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ fontSize:"1.4rem" }}>{room.icon}</span>
                    <div>
                      <div style={{ fontWeight:"bold", fontSize:"0.85rem", color: currentLevel>0?"#fff":C.dim }}>{room.name}</div>
                      <div style={{ fontSize:"0.62rem", color:C.dim, fontFamily:"Arial,sans-serif" }}>Level {currentLevel}/3</div>
                    </div>
                  </div>
                  <div style={{ fontSize:"0.68rem", color:"#888", marginTop:6, fontFamily:"Arial,sans-serif" }}>{room.desc}</div>
                  {currentTier && <div style={{ fontSize:"0.68rem", color:C.green, marginTop:4, fontFamily:"Arial,sans-serif" }}>✓ {currentTier.bonus}</div>}
                </div>
                <div style={{ textAlign:"right", flexShrink:0, marginLeft:10 }}>
                  {// Level pips}
                  <div style={{ display:"flex", gap:3, justifyContent:"flex-end", marginBottom:6 }}>
                    {[1,2,3].map(l => (
                      <div key={l} style={{ width:8, height:8, borderRadius:"50%", background: l<=currentLevel?C.purple:"rgba(255,255,255,0.1)", boxShadow:l<=currentLevel?`0 0 4px ${C.purple}`:"none" }}/>
                    ))}
                  </div>
                  {nextTier && (
                    <button style={{ ...S.btnSm(C.purple), fontSize:"0.62rem" }}
                      onClick={() => setBaseRooms(prev=>({...prev,[key]:currentLevel+1}))}>
                      Upgrade ({nextTier.cost.toLocaleString()} coins)
                    </button>
                  )}
                  {!nextTier && currentLevel>0 && <div style={{ fontSize:"0.62rem", color:C.gold, fontFamily:"Arial,sans-serif" }}>✦ Max Level</div>}
                  {currentLevel===0 && nextTier && (
                    <button style={{ ...S.btnSm("rgba(138,90,220,0.2)",C.purpleLight), fontSize:"0.62rem" }}
                      onClick={() => setBaseRooms(prev=>({...prev,[key]:1}))}>
                      Build ({nextTier.cost.toLocaleString()} coins)
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {// Residents}
      <div style={S.card}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
          <div style={S.sectionTitle}>Residents ({baseResidents.length})</div>
          <button style={S.btnSm(C.purple)} onClick={()=>setShowAddResident(!showAddResident)}>
            {showAddResident?"✕":"+ Add"}
          </button>
        </div>

        {showAddResident && (
          <div style={{ background:"rgba(8,6,25,0.9)", border:`1px solid ${C.border}`, borderRadius:8, padding:12, marginBottom:12 }}>
            <label style={S.label}>Name</label>
            <input style={{ ...S.input, marginBottom:8 }} value={residentForm.name} onChange={e=>setResidentForm(p=>({...p,name:e.target.value}))} placeholder="Resident name..."/>
            <label style={S.label}>Role</label>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:5, marginBottom:8 }}>
              {Object.entries(RESIDENT_ROLES).map(([key,role]) => (
                <button key={key}
                  style={{ ...S.btnSm(residentForm.role===key?`${role.color}30`:"rgba(10,8,30,0.8)", residentForm.role===key?role.color:C.dim), border:`1px solid ${residentForm.role===key?role.color:C.border}`, fontSize:"0.62rem" }}
                  onClick={()=>setResidentForm(p=>({...p,role:key}))}>
                  {role.icon} {role.label}
                </button>
              ))}
            </div>
            <label style={S.label}>Note</label>
            <input style={{ ...S.input, marginBottom:10 }} value={residentForm.note} onChange={e=>setResidentForm(p=>({...p,note:e.target.value}))} placeholder="Background, history..."/>
            <button style={S.btn(C.purple)} onClick={()=>{
              if(!residentForm.name.trim())return;
              setBaseResidents(prev=>[...prev,{...residentForm,id:Date.now()}]);
              setResidentForm({name:"",role:"guard",note:""});
              setShowAddResident(false);
              setBaseDefense(d=>Math.min(10,d+(residentForm.role==="guard"?1:0)));
            }}>+ Add Resident</button>
          </div>
        )}

        {baseResidents.length===0 && <div style={{ color:C.dimmer, fontSize:"0.72rem", textAlign:"center", padding:"12px 0", fontFamily:"Arial,sans-serif" }}>No residents yet. The Hearth is empty.</div>}
        {baseResidents.map(r => {
          const role = RESIDENT_ROLES[r.role];
          return (
            <div key={r.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", padding:"8px 0", borderBottom:`1px solid ${C.dimmer}` }}>
              <div style={{ display:"flex", gap:8, alignItems:"flex-start" }}>
                <span style={{ fontSize:"1.2rem" }}>{role?.icon}</span>
                <div>
                  <div style={{ fontWeight:"bold", fontSize:"0.78rem", color:"#fff" }}>{r.name}</div>
                  <div style={{ fontSize:"0.62rem", color:role?.color, fontFamily:"Arial,sans-serif" }}>{role?.label}</div>
                  {r.note && <div style={{ fontSize:"0.65rem", color:C.dim, marginTop:2, fontFamily:"Arial,sans-serif" }}>{r.note}</div>}
                  <div style={{ fontSize:"0.62rem", color:"#888", marginTop:2, fontFamily:"Arial,sans-serif" }}>{role?.bonus}</div>
                </div>
              </div>
              <button style={{ background:"none", border:"none", color:C.dim, cursor:"pointer" }}
                onClick={()=>setBaseResidents(prev=>prev.filter(x=>x.id!==r.id))}>✕</button>
            </div>
          );
        })}
      </div>

      {// Player Inventory — Pack vs Vault}
      <div style={S.card}>
        <div style={S.sectionTitle}>🎒 Player Inventories</div>
        {players.filter(p=>!p.isDead).map(p => {
          const pack = packs[p.id] || [];
          const vault = vaults[p.id] || [];
          const packUsed = pack.reduce((a,item)=>a+(ITEM_TYPES[item.type]?.slots||1),0);
          const packCap = CLASS_PACK_CAPACITY[p.cls]||8;
          const pct = Math.min(100,(packUsed/packCap)*100);
          const packColor = pct>85?C.red:pct>65?"#ff9800":C.green;

          return (
            <div key={p.id} style={{ marginBottom:12 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
                <div style={{ fontWeight:"bold", fontSize:"0.82rem", color:"#fff" }}>{p.charname} <span style={{ color:C.dim, fontSize:"0.65rem", fontWeight:"normal" }}>({p.cls})</span></div>
                <button style={S.btnSm("rgba(138,90,220,0.15)",C.purpleLight)} onClick={()=>setSelectedInventoryPlayer(p.id==="selected"?null:p.id)}>
                  Manage
                </button>
              </div>
              {// Pack bar}
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:"0.6rem", color:C.dim, marginBottom:2, fontFamily:"Arial,sans-serif" }}>
                <span>🎒 Pack: {packUsed}/{packCap} slots</span>
                <span>🏦 Vault: {vault.length} items</span>
              </div>
              <div style={{ height:5, background:"rgba(255,255,255,0.05)", borderRadius:3, overflow:"hidden" }}>
                <div style={{ height:"100%", width:`${pct}%`, background:packColor, borderRadius:3, transition:"width 0.3s", boxShadow:`0 0 6px ${packColor}` }}/>
              </div>
            </div>
          );
        })}
      </div>

      {// Inventory Management Modal}
      {selectedInventoryPlayer && (() => {
        const p = players.find(x=>x.id===selectedInventoryPlayer);
        if(!p)return null;
        const pack = packs[p.id]||[];
        const vault = vaults[p.id]||[];
        const packUsed = pack.reduce((a,item)=>a+(ITEM_TYPES[item.type]?.slots||1),0);
        const packCap = CLASS_PACK_CAPACITY[p.cls]||8;

        const addItem = (toPack) => {
          if(!addItemForm.name.trim())return;
          const newItem = { ...addItemForm, id:Date.now() };
          if(toPack) {
            const slotCost = ITEM_TYPES[addItemForm.type]?.slots||1;
            if(packUsed+slotCost>packCap)return alert(`Pack full! ${packCap-packUsed} slots remaining.`);
            setPacks(prev=>({...prev,[p.id]:[...pack,newItem]}));
          } else {
            setVaults(prev=>({...prev,[p.id]:[...vault,newItem]}));
          }
          setAddItemForm({name:"",type:"weapon",rarity:"Common",condition:"Pristine",slots:1,enchantment:"",provenance:"",obtainedBy:"found",note:""});
          setShowAddItem(false);
        };

        const moveItem = (item, fromPack) => {
          if(fromPack) {
            // Move pack → vault
            setPacks(prev=>({...prev,[p.id]:pack.filter(x=>x.id!==item.id)}));
            setVaults(prev=>({...prev,[p.id]:[...vault,item]}));
          } else {
            // Move vault → pack
            const slotCost = ITEM_TYPES[item.type]?.slots||1;
            if(packUsed+slotCost>packCap)return alert("Pack full!");
            setVaults(prev=>({...prev,[p.id]:vault.filter(x=>x.id!==item.id)}));
            setPacks(prev=>({...prev,[p.id]:[...pack,item]}));
          }
        };

        const removeItem = (item, fromPack) => {
          if(fromPack) setPacks(prev=>({...prev,[p.id]:pack.filter(x=>x.id!==item.id)}));
          else setVaults(prev=>({...prev,[p.id]:vault.filter(x=>x.id!==item.id)}));
        };

        const renderItem = (item, fromPack) => {
          const type = ITEM_TYPES[item.type];
          const cond = ITEM_CONDITIONS[item.condition];
          const rarColor = ITEM_RARITIES[item.rarity]||"#aaa";
          const obtain = OBTAIN_TYPES[item.obtainedBy];
          return (
            <div key={item.id} style={{
              background:"rgba(8,6,25,0.8)", border:`1px solid ${rarColor}30`,
              borderRadius:7, padding:"8px 10px", marginBottom:6,
            }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", gap:6, alignItems:"center", flexWrap:"wrap", marginBottom:3 }}>
                    <span style={{ fontSize:"0.9rem" }}>{type?.icon}</span>
                    <span style={{ fontWeight:"bold", fontSize:"0.78rem", color:"#fff" }}>{item.name}</span>
                    <span style={{ fontSize:"0.58rem", padding:"1px 5px", borderRadius:6, background:`${rarColor}20`, color:rarColor, fontFamily:"Arial,sans-serif" }}>{item.rarity}</span>
                    <span style={{ fontSize:"0.58rem", padding:"1px 5px", borderRadius:6, background:`${cond?.color}20`, color:cond?.color, fontFamily:"Arial,sans-serif" }}>{item.condition}</span>
                    {cond?.penalty!==0 && <span style={{ fontSize:"0.58rem", color:"#ef5350", fontFamily:"Arial,sans-serif" }}>{cond.penalty}</span>}
                  </div>
                  <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                    <span style={{ fontSize:"0.6rem", color:C.dim, fontFamily:"Arial,sans-serif" }}>{obtain?.icon} {obtain?.label}</span>
                    {item.provenance && <span style={{ fontSize:"0.6rem", color:C.dim, fontFamily:"Arial,sans-serif" }}>· ex: {item.provenance}</span>}
                    {item.enchantment && <span style={{ fontSize:"0.6rem", color:C.gold, fontFamily:"Arial,sans-serif" }}>✨ {item.enchantment}</span>}
                    <span style={{ fontSize:"0.6rem", color:C.dim, fontFamily:"Arial,sans-serif" }}>· {type?.slots||1} slot{type?.slots!==1?"s":""}</span>
                  </div>
                  {item.note && <div style={{ fontSize:"0.62rem", color:"#888", marginTop:3, fontStyle:"italic", fontFamily:"Arial,sans-serif" }}>{item.note}</div>}
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:4, marginLeft:8, flexShrink:0 }}>
                  <button style={{ ...S.btnSm("rgba(138,90,220,0.15)",C.purpleLight), fontSize:"0.6rem" }}
                    onClick={()=>moveItem(item,fromPack)}>
                    {fromPack?"→ Vault":"→ Pack"}
                  </button>
                  <button style={{ ...S.btnSm("rgba(50,10,10,0.8)",C.red), fontSize:"0.6rem" }}
                    onClick={()=>removeItem(item,fromPack)}>Drop</button>
                </div>
              </div>
            </div>
          );
        };

        return (
          <div style={{ position:"fixed", inset:0, background:"rgba(2,1,15,0.97)", zIndex:200, overflowY:"auto", padding:16 }}>
            <div style={{ background:"rgba(15,12,40,0.99)", border:`1px solid ${C.borderGlow}`, borderRadius:12, padding:18, maxWidth:500, margin:"auto" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
                <div>
                  <div style={{ fontWeight:"bold", fontSize:"0.95rem", color:"#fff" }}>{p.charname} — Inventory</div>
                  <div style={{ fontSize:"0.65rem", color:C.dim, fontFamily:"Arial,sans-serif" }}>{CLASS_ICON[p.cls]} {p.cls}</div>
                </div>
                <button style={{ background:"none", border:"none", color:C.dim, fontSize:"1.2rem", cursor:"pointer" }} onClick={()=>setSelectedInventoryPlayer(null)}>✕</button>
              </div>

              {// Tab selector}
              <div style={{ display:"flex", gap:6, marginBottom:14 }}>
                {[
                  {id:"pack",  label:`🎒 Pack (${packUsed}/${packCap})`},
                  {id:"vault", label:`🏦 Vault (${vault.length})`},
                  {id:"add",   label:"+ Add Item"},
                ].map(t => (
                  <button key={t.id} style={{
                    ...S.btnSm(inventoryTab===t.id?C.purple:"rgba(20,16,50,0.8)", inventoryTab===t.id?"#fff":C.dim),
                    flex:1,
                  }} onClick={()=>setInventoryTab(t.id)}>{t.label}</button>
                ))}
              </div>

              {// Pack}
              {inventoryTab==="pack" && (
                <div>
                  <div style={{ marginBottom:10 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", fontSize:"0.68rem", color:C.dim, marginBottom:4, fontFamily:"Arial,sans-serif" }}>
                      <span>Pack Capacity</span>
                      <span style={{ color: packUsed>=packCap?C.red:C.green }}>{packUsed}/{packCap} slots used</span>
                    </div>
                    <div style={{ height:8, background:"rgba(255,255,255,0.05)", borderRadius:4, overflow:"hidden" }}>
                      <div style={{
                        height:"100%",
                        width:`${Math.min(100,(packUsed/packCap)*100)}%`,
                        background: packUsed>=packCap?C.red:packUsed/packCap>0.7?"#ff9800":C.green,
                        borderRadius:4, transition:"width 0.3s",
                      }}/>
                    </div>
                    <div style={{ display:"flex", gap:6, marginTop:4, flexWrap:"wrap" }}>
                      {Object.entries(ITEM_TYPES).map(([k,t])=>{
                        const count=pack.filter(i=>i.type===k).length;
                        if(!count)return null;
                        return <span key={k} style={S.tag(`${t.color}20`,t.color)}>{t.icon} {count}</span>;
                      })}
                    </div>
                  </div>
                  {pack.length===0?<div style={{color:C.dimmer,textAlign:"center",padding:"16px 0",fontSize:"0.72rem",fontFamily:"Arial,sans-serif"}}>Pack is empty.</div>
                    :pack.map(item=>renderItem(item,true))}
                </div>
              )}

              {// Vault}
              {inventoryTab==="vault" && (
                <div>
                  <div style={{ fontSize:"0.68rem", color:C.dim, marginBottom:10, fontFamily:"Arial,sans-serif" }}>
                    Vault capacity: {baseRooms.vault>=2?50:baseRooms.vault>=1?20:"Unavailable"} items. Upgrade at Home Base.
                  </div>
                  {vault.length===0?<div style={{color:C.dimmer,textAlign:"center",padding:"16px 0",fontSize:"0.72rem",fontFamily:"Arial,sans-serif"}}>Vault is empty.</div>
                    :vault.map(item=>renderItem(item,false))}
                </div>
              )}

              {// Add Item}
              {inventoryTab==="add" && (
                <div>
                  <label style={S.label}>Item Name</label>
                  <input style={{...S.input,marginBottom:8}} value={addItemForm.name} onChange={e=>setAddItemForm(p=>({...p,name:e.target.value}))} placeholder="Item name..."/>

                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
                    <div>
                      <label style={S.label}>Type</label>
                      <select style={S.select} value={addItemForm.type} onChange={e=>setAddItemForm(p=>({...p,type:e.target.value}))}>
                        {Object.entries(ITEM_TYPES).map(([k,t])=><option key={k} value={k}>{t.icon} {t.label} ({t.slots}s)</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={S.label}>Rarity</label>
                      <select style={S.select} value={addItemForm.rarity} onChange={e=>setAddItemForm(p=>({...p,rarity:e.target.value}))}>
                        {Object.keys(ITEM_RARITIES).map(r=><option key={r}>{r}</option>)}
                      </select>
                    </div>
                  </div>

                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
                    <div>
                      <label style={S.label}>Condition</label>
                      <select style={S.select} value={addItemForm.condition} onChange={e=>setAddItemForm(p=>({...p,condition:e.target.value}))}>
                        {Object.keys(ITEM_CONDITIONS).map(c=><option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={S.label}>Obtained By</label>
                      <select style={S.select} value={addItemForm.obtainedBy} onChange={e=>setAddItemForm(p=>({...p,obtainedBy:e.target.value}))}>
                        {Object.entries(OBTAIN_TYPES).map(([k,t])=><option key={k} value={k}>{t.icon} {t.label}</option>)}
                      </select>
                    </div>
                  </div>

                  <label style={S.label}>Provenance (previous owner)</label>
                  <input style={{...S.input,marginBottom:8}} value={addItemForm.provenance} onChange={e=>setAddItemForm(p=>({...p,provenance:e.target.value}))} placeholder="e.g. Gravenor, Kingdom vault..."/>

                  <label style={S.label}>Enchantment (if any)</label>
                  <input style={{...S.input,marginBottom:8}} value={addItemForm.enchantment} onChange={e=>setAddItemForm(p=>({...p,enchantment:e.target.value}))} placeholder="e.g. Hollow Whisper, Bloodseeker..."/>

                  <label style={S.label}>Note</label>
                  <input style={{...S.input,marginBottom:12}} value={addItemForm.note} onChange={e=>setAddItemForm(p=>({...p,note:e.target.value}))} placeholder="Additional context..."/>

                  <div style={{display:"flex",gap:8}}>
                    <button style={{...S.btn(C.purple),flex:1}} onClick={()=>addItem(true)}>+ Add to Pack</button>
                    <button style={{...S.btn("rgba(255,213,79,0.3)",C.gold),flex:1}} onClick={()=>addItem(false)}>+ Add to Vault</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })()}

    </div>
  )}

</div>
```

);
}
