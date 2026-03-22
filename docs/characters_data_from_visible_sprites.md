# characters_data.md

```json
{
  "characters": [
    {
      "id": "big_boss",
      "name": "Big Boss",
      "role": "crime_boss",
      "importance": "main",
      "defaultLocation": "italian_restaurant_interior",
      "availableFromStart": false,
      "spritePrefix": "character_big_boss",
      "emotionsAvailable": ["happy", "serious"],
      "emotionSprites": {
        "happy": "character_big_boss_happy.png",
        "serious": "character_big_boss_serious.png"
      },
      "notes": "Only appears in Italian Restaurant Interior."
    },
    {
      "id": "blondie",
      "name": "Blondie",
      "role": "missing_person",
      "importance": "main",
      "defaultLocation": "safehouse",
      "availableFromStart": false,
      "spritePrefix": "character_blondie",
      "emotionsAvailable": ["happy", "sad", "serious"],
      "emotionSprites": {
        "happy": "character_blondie_happy.png",
        "sad": "character_blondie_sad.png",
        "serious": "character_blondie_serious.png"
      },
      "notes": "Found at The Safehouse."
    },
    {
      "id": "bodyguard",
      "name": "BodyGuard",
      "role": "gatekeeper",
      "importance": "main",
      "defaultLocation": "italian_restaurant_exterior",
      "availableFromStart": true,
      "spritePrefix": "character_bodyguard",
      "emotionsAvailable": ["happy", "laughing", "serious", "tired"],
      "emotionSprites": {
        "happy": "character_bodyguard_happy.png",
        "laughing": "character_bodyguard_laughing.png",
        "serious": "character_bodyguard_serious.png",
        "tired": "character_bodyguard_tired.png"
      },
      "notes": "Blocks access to Big Boss until the player fulfills the required action."
    },
    {
      "id": "driver",
      "name": "Driver",
      "role": "transport_npc",
      "importance": "secondary",
      "defaultLocation": "cab",
      "availableFromStart": true,
      "spritePrefix": "character_driver",
      "emotionsAvailable": ["happy", "laughing", "serious"],
      "emotionSprites": {
        "happy": "character_driver_happy.png",
        "laughing": "character_driver_laughing.png",
        "serious": "character_driver_serious.png"
      },
      "notes": "Taxi driver / cab scene character."
    },
    {
      "id": "hero",
      "name": "Hero",
      "role": "vigilante",
      "importance": "secondary",
      "defaultLocation": "rooftop",
      "availableFromStart": false,
      "spritePrefix": "character_hero",
      "emotionsAvailable": ["happy", "serious", "thinking"],
      "emotionSprites": {
        "happy": "character_hero_happy.png",
        "serious": "character_hero_serious.png",
        "thinking": "character_hero_thinking.png"
      },
      "notes": "This appears to correspond to Blue Wing."
    },
    {
      "id": "lucy",
      "name": "Lucy",
      "role": "client",
      "importance": "main",
      "defaultLocation": "apartment",
      "availableFromStart": true,
      "spritePrefix": "character_lucy",
      "emotionsAvailable": ["angry", "happy", "sad", "serious"],
      "emotionSprites": {
        "angry": "character_lucy_angry.png",
        "happy": "character_lucy_happy.png",
        "sad": "character_lucy_sad.png",
        "serious": "character_lucy_serious.png"
      },
      "notes": "Starts the case and points the detective to the photo and the email."
    },
    {
      "id": "mind_reader",
      "name": "Mind Reader",
      "role": "witness",
      "importance": "main",
      "defaultLocation": "arcade_room",
      "availableFromStart": true,
      "spritePrefix": "character_mind_reader",
      "emotionsAvailable": ["angry", "happy", "suspicious"],
      "emotionSprites": {
        "angry": "character_mind_reader_angry.png",
        "happy": "character_mind_reader_happy.png",
        "suspicious": "character_mind_reader_suspicious.png"
      },
      "notes": "This appears to correspond to Mysterious Kid."
    },
    {
      "id": "nails",
      "name": "Nails",
      "role": "gang_member",
      "importance": "secondary",
      "defaultLocation": "motel_neon",
      "availableFromStart": false,
      "spritePrefix": "character_nails",
      "emotionsAvailable": ["serious", "thinking", "worried"],
      "emotionSprites": {
        "serious": "character_nails_serious.png",
        "thinking": "character_nails_thinking.png",
        "worried": "character_nails_worried.png"
      },
      "notes": "Weak link in Big Boss's chain. Later tracked to Motel Neon."
    },
    {
      "id": "pepe",
      "name": "Pepe",
      "role": "street_contact",
      "importance": "main",
      "defaultLocation": "dark_alley",
      "availableFromStart": false,
      "spritePrefix": "character_pepe",
      "emotionsAvailable": ["happy", "serious", "thiking"],
      "emotionSprites": {
        "happy": "character_pepe_happy.png",
        "serious": "character_pepe_serious.png",
        "thiking": "character_pepe_thiking.png"
      },
      "notes": "Filename appears to contain a typo: thiking instead of thinking."
    },
    {
      "id": "rose",
      "name": "Rose",
      "role": "street_witness",
      "importance": "main",
      "defaultLocation": "red_light_block",
      "availableFromStart": true,
      "spritePrefix": "character_rose",
      "emotionsAvailable": ["sensual", "serious", "thinking"],
      "emotionSprites": {
        "sensual": "character_rose_sensual.png",
        "serious": "character_rose_serious.png",
        "thinking": "character_rose_thinking.png"
      },
      "notes": "Gives the handwritten plate note after seeing Blondie get into a car."
    },
    {
      "id": "the_gambler",
      "name": "The Gambler",
      "role": "informant",
      "importance": "secondary",
      "defaultLocation": "bar",
      "availableFromStart": true,
      "spritePrefix": "character_the_gambler",
      "emotionsAvailable": ["angry", "happy", "serious", "winner"],
      "emotionSprites": {
        "angry": "character_the_gambler_angry.png",
        "happy": "character_the_gambler_happy.png",
        "serious": "character_the_gambler_serious.png",
        "winner": "character_the_gambler_winner.png"
      },
      "notes": "Can also trigger the short optional card minigame."
    }
  ],
  "pendingCharactersWithoutVerifiedSprites": [
    {
      "id": "detective",
      "name": "The Detective",
      "status": "pending_sprite_verification"
    },
    {
      "id": "doctor",
      "name": "The Doctor",
      "status": "pending_sprite_verification"
    },
    {
      "id": "street_racer",
      "name": "Street Racer",
      "status": "pending_sprite_verification"
    },
    {
      "id": "jenny",
      "name": "Jenny",
      "status": "pending_sprite_verification"
    },
    {
      "id": "dirty_cop",
      "name": "Dirty Cop",
      "status": "pending_sprite_verification"
    },
    {
      "id": "creator",
      "name": "The Creator",
      "status": "pending_sprite_verification"
    }
  ],
  "notes": {
    "source": "Built only from the filenames visible in the provided screenshot.",
    "normalizationWarnings": [
      "character_pepe_thiking.png appears misspelled in the filename.",
      "hero appears to be the internal sprite name for Blue Wing.",
      "mind_reader appears to be the internal sprite name for Mysterious Kid."
    ]
  }
}
```