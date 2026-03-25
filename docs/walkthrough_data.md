# walkthrough_data.md

```json
{
  "walkthrough": {
    "title": "Blondie Case — Canonical Basic Winning Route",
    "goal": "Find Blondie before 05:00.",
    "startTime": "22:00",
    "deadline": "05:00",
    "notes": [
      "This is the current canonical minimum route to win the case.",
      "The game is semi-linear, but this route defines the clearest intended chain of clues, item uses, and unlocks.",
      "Optional flavor scenes, collectibles, and alternate conversations are not all required here."
    ],
    "stages": [
      {
        "id": "stage_01_apartment_intro",
        "name": "Apartment Intro",
        "location": "apartment",
        "required": true,
        "actions": [
          {
            "type": "talk",
            "target": "lucy",
            "result": [
              "case_started",
              "lucy_explains_photo_in_jacket",
              "lucy_explains_bar_address_in_email"
            ],
            "notes": "Lucy explicitly tells the detective where to find Blondie's photo and that she emailed the Bar address."
          },
          {
            "type": "inspect_hotspot",
            "target": "jacket_pocket",
            "result": ["blondie_photo"]
          },
          {
            "type": "inspect_hotspot",
            "target": "computer_screen",
            "result": ["bar_address_known", "open_city_map_enabled", "bar_marked_on_map"]
          }
        ],
        "optionalActions": [
          {
            "type": "inspect_hotspot",
            "target": "videogame_screen",
            "result": ["flavor_text"]
          },
          {
            "type": "inspect_hotspot",
            "target": "window_city_view",
            "result": ["worldbuilding_text"]
          }
        ]
      },
      {
        "id": "stage_02_building_transition",
        "name": "Leave Apartment / Building Navigation",
        "location": "elevator",
        "required": true,
        "actions": [
          {
            "type": "scene_action",
            "target": "leave_apartment",
            "result": ["entered_elevator"]
          },
          {
            "type": "scene_action",
            "target": "exit_building",
            "result": ["entered_city_map"]
          }
        ],
        "optionalActions": [
          {
            "type": "inspect_hotspot",
            "target": "neighbor_note",
            "result": ["building_context"]
          },
          {
            "type": "inspect_hotspot",
            "target": "carved_number",
            "result": ["building_number_context"]
          },
          {
            "type": "scene_action",
            "target": "go_to_rooftop",
            "result": ["entered_rooftop"]
          }
        ]
      },
      {
        "id": "stage_03_rooftop_optional_early",
        "name": "Early Rooftop Optional Visit",
        "location": "rooftop",
        "required": false,
        "actions": [],
        "optionalActions": [
          {
            "type": "inspect_hotspot",
            "target": "edge_view",
            "result": ["city_observation_text"]
          },
          {
            "type": "inspect_hotspot",
            "target": "flower_pot",
            "result": ["trading_card_rooftop_01"]
          }
        ]
      },
      {
        "id": "stage_04_bar",
        "name": "The Bar",
        "location": "bar",
        "required": true,
        "actions": [
          {
            "type": "talk",
            "target": "the_gambler",
            "requirements": ["bar_address_known"],
            "result": [
              "gambler_confirms_blondie_was_here",
              "gambler_confirms_meeting_went_wrong",
              "gambler_points_to_arcade_room",
              "arcade_marked_on_map"
            ],
            "notes": "The Gambler confirms Blondie was at the Bar, seated at the back table, and suggests checking the Arcade Room because Mysterious Kid never sleeps."
          },
          {
            "type": "inspect_hotspot",
            "target": "under_the_table",
            "requirements": ["gambler_points_under_table"],
            "result": ["crumpled_receipt", "pharmacy_marked_on_map"],
            "notes": "Under Blondie's back table the detective finds a crumpled Pharmacy receipt, which unlocks Pharmacy on the city map."
          }
        ],
        "notes": [
          "After the Bar scene, the city map shows a New Locations tag.",
          "The two newly unlocked destinations are Pharmacy and Arcade Room.",
          "These two leads can be followed in either order."
        ],
        "optionalActions": [
          {
            "type": "talk_optional_minigame",
            "target": "the_gambler",
            "result": ["money_won_or_lost"],
            "notes": "Short optional card game with money risk/reward."
          },
          {
            "type": "inspect_hotspot",
            "target": "wall_poster",
            "result": ["flavor_text"]
          },
          {
            "type": "inspect_hotspot",
            "target": "bottle_bar",
            "result": ["context_text"]
          }
        ]
      },
      {
        "id": "stage_05_pharmacy",
        "name": "Pharmacy",
        "location": "pharmacy",
        "required": true,
        "notes": ["Unlocked from the crumpled receipt found under Blondie's back table at the Bar."],
        "actions": [
          {
            "type": "talk",
            "target": "doctor",
            "result": [
              "doctor_confirms_medical_suspicion",
              "doctor_hints_at_sedation_or_control"
            ]
          },
          {
            "type": "inspect_hotspot",
            "target": "medicine_shelf_2",
            "result": ["hint_text"]
          },
          {
            "type": "inspect_hotspot",
            "target": "medicine_shelf_1",
            "result": ["sedative_box"]
          }
        ],
        "optionalActions": [
          {
            "type": "inspect_hotspot",
            "target": "medical_diploma",
            "result": ["flavor_text"]
          }
        ]
      },
      {
        "id": "stage_06_arcade_room_first_pass",
        "name": "Arcade Room — First Pass",
        "location": "arcade_room",
        "required": true,
        "notes": ["Unlocked when The Gambler points the detective toward Mysterious Kid at the Arcade Room."],
        "actions": [
          {
            "type": "talk",
            "target": "mind_reader",
            "result": [
              "mysterious_kid_vague_lead",
              "future_energy_drink_hook"
            ],
            "notes": "At this point the kid is vague and not yet useful enough to unlock the Garage."
          },
          {
            "type": "inspect_hotspot",
            "target": "counter_computer",
            "result": ["has_arcade_timeline_clue"]
          },
          {
            "type": "inspect_hotspot",
            "target": "arcade_machine_2_dispenser",
            "result": ["arcade_token"]
          }
        ],
        "optionalActions": [
          {
            "type": "inspect_hotspot",
            "target": "arcade_machine_1",
            "result": ["flavor_text"]
          }
        ]
      },
      {
        "id": "stage_07_store",
        "name": "The Store",
        "location": "store",
        "required": true,
        "actions": [
          {
            "type": "talk",
            "target": "jenny",
            "result": ["jenny_small_but_useful_detail"]
          },
          {
            "type": "shop_hotspot",
            "target": "counter",
            "result": ["cigarette_pack"]
          }
        ],
        "optionalActions": [
          {
            "type": "shop_hotspot",
            "target": "fridge",
            "result": ["buy_small_product"]
          },
          {
            "type": "inspect_hotspot",
            "target": "ice_cream_freezer",
            "result": ["flavor_text"]
          }
        ]
      },
      {
        "id": "stage_08_red_light_block",
        "name": "Red Light Block",
        "location": "red_light_block",
        "required": true,
        "actions": [
          {
            "type": "talk",
            "target": "rose",
            "requirements": ["blondie_photo"],
            "result": [
              "rose_confirms_blondie_entered_a_car",
              "license_plate_note"
            ],
            "notes": "Rose gives the detective a handwritten note with the license plate number."
          },
          {
            "type": "use_hotspot",
            "target": "vending_machine",
            "requirements": ["arcade_token"],
            "result": ["energizing_drink"]
          },
          {
            "type": "transition_hotspot",
            "target": "alley_entrance",
            "result": ["entered_dark_alley"]
          }
        ],
        "optionalActions": [
          {
            "type": "inspect_hotspot",
            "target": "ramen_shop",
            "result": ["flavor_text"]
          }
        ]
      },
      {
        "id": "stage_09_dark_alley",
        "name": "Dark Alley",
        "location": "dark_alley",
        "required": true,
        "actions": [
          {
            "type": "talk",
            "target": "pepe",
            "result": [
              "pepe_confirms_hidden_movement",
              "territorial_clue_obtained"
            ]
          },
          {
            "type": "inspect_hotspot",
            "target": "crate_stack",
            "result": ["steel_bar"]
          }
        ],
        "optionalActions": [
          {
            "type": "transition_hotspot",
            "target": "fire_escape_ladder",
            "result": ["entered_fire_escape_landing"]
          },
          {
            "type": "inspect_hotspot",
            "target": "dumpster",
            "result": ["flavor_text"]
          }
        ]
      },
      {
        "id": "stage_10_fire_escape_landing_optional",
        "name": "Fire Escape Landing",
        "location": "fire_escape_landing",
        "required": false,
        "actions": [],
        "optionalActions": [
          {
            "type": "inspect_hotspot",
            "target": "hidden_trading_card",
            "result": ["trading_card_fire_escape_01"]
          }
        ]
      },
      {
        "id": "stage_11_arcade_room_return",
        "name": "Arcade Room — Return with Energy Drink",
        "location": "arcade_room",
        "required": true,
        "actions": [
          {
            "type": "give_item",
            "target": "mind_reader",
            "item": "energizing_drink",
            "result": [
              "mysterious_kid_clearer_clue",
              "garage_lead_discovered",
              "underground_garage_unlocked"
            ],
            "notes": "Giving the energy drink unlocks Underground Garage on the map."
          }
        ],
        "optionalActions": []
      },
      {
        "id": "stage_12_underground_garage",
        "name": "Underground Garage",
        "location": "underground_garage",
        "required": true,
        "actions": [
          {
            "type": "inspect_hotspot",
            "target": "car_license_plate",
            "requirements": ["license_plate_note"],
            "result": ["plate_match_confirmed"],
            "notes": "The detective confirms the plate matches Rose's handwritten note."
          },
          {
            "type": "talk",
            "target": "street_racer",
            "requirements": ["plate_match_confirmed"],
            "result": [
              "street_racer_identifies_car_as_nails",
              "motel_neon_address_known",
              "motel_neon_unlocked"
            ],
            "notes": "Street Racer reveals the car belongs to Nails and gives the Motel Neon address."
          },
          {
            "type": "inspect_hotspot",
            "target": "tool_bench",
            "result": ["screwdriver"]
          }
        ],
        "optionalActions": [
          {
            "type": "inspect_hotspot",
            "target": "car_body",
            "result": ["flavor_text"]
          }
        ]
      },
      {
        "id": "stage_13_italian_restaurant_exterior",
        "name": "Italian Restaurant Exterior",
        "location": "italian_restaurant_exterior",
        "required": true,
        "actions": [
          {
            "type": "use_hotspot",
            "target": "restaurant_door",
            "result": ["bodyguard_blocks_entry"]
          },
          {
            "type": "give_item",
            "target": "bodyguard",
            "item": "cigarette_pack",
            "result": ["restaurant_access_granted"]
          }
        ],
        "optionalActions": [
          {
            "type": "inspect_hotspot",
            "target": "menu_board",
            "result": ["flavor_text"]
          },
          {
            "type": "inspect_hotspot",
            "target": "delivery_motorcycle",
            "result": ["ambient_info"]
          }
        ]
      },
      {
        "id": "stage_14_italian_restaurant_interior",
        "name": "Italian Restaurant Interior",
        "location": "italian_restaurant_interior",
        "required": true,
        "actions": [
          {
            "type": "talk",
            "target": "big_boss",
            "result": [
              "knows_big_boss_connected",
              "knows_dirty_cop_connected",
              "nails_is_weak_link"
            ],
            "notes": "Big Boss confirms the criminal structure and indirectly points toward Nails as the weak point."
          }
        ],
        "optionalActions": []
      },
      {
        "id": "stage_15_return_to_building",
        "name": "Return to the Detective's Building",
        "location": "elevator",
        "required": false,
        "actions": [],
        "optionalActions": [
          {
            "type": "use_item_on_scene",
            "target": "elevator_panel_or_hidden_area",
            "item": "screwdriver",
            "result": ["hidden_elevator_note_found"],
            "notes": "Recommended current use for the screwdriver."
          },
          {
            "type": "scene_action",
            "target": "go_to_rooftop",
            "result": ["entered_rooftop_again"]
          }
        ]
      },
      {
        "id": "stage_16_blue_wing_optional",
        "name": "Blue Wing Optional Appearance",
        "location": "rooftop_or_dark_alley",
        "required": false,
        "actions": [],
        "optionalActions": [
          {
            "type": "talk",
            "target": "blue_wing",
            "requirements": ["knows_big_boss_connected", "late_night_condition"],
            "result": ["blue_wing_hint"],
            "notes": "Blue Wing can appear on Rooftop after a certain action/time, or in Dark Alley under a later condition."
          }
        ]
      },
      {
        "id": "stage_17_motel_neon",
        "name": "Motel Neon",
        "location": "motel_neon",
        "required": true,
        "actions": [
          {
            "type": "talk",
            "target": "nails",
            "requirements": ["motel_neon_unlocked", "nails_is_weak_link"],
            "result": ["safehouse_location_known"],
            "notes": "The detective pressures or deceives Nails until he reveals the Safehouse location."
          }
        ],
        "optionalActions": []
      },
      {
        "id": "stage_18_safehouse",
        "name": "The Safehouse",
        "location": "safehouse",
        "required": true,
        "actions": [
          {
            "type": "use_hotspot",
            "target": "metal_door",
            "requirements": ["steel_bar", "safehouse_location_known"],
            "result": ["force_entry", "blondie_found"],
            "notes": "The detective uses the steel bar to force the door and finds Blondie."
          }
        ],
        "optionalActions": []
      }
    ]
  },
  "keyItemChain": [
    {
      "item": "blondie_photo",
      "obtainedAt": "apartment.jacket_pocket",
      "usedWith": ["lucy", "the_gambler", "doctor", "mind_reader", "rose", "pepe", "jenny"],
      "purpose": "Recognition and case-specific dialogue."
    },
    {
      "item": "bar_address_known",
      "obtainedAt": "apartment.computer_screen",
      "usedWith": ["city_map", "the_gambler"],
      "purpose": "Unlocks Open City Map and marks The Bar. Also strengthens the Bar conversation."
    },
    {
      "item": "sedative_box",
      "obtainedAt": "pharmacy.medicine_shelf_1",
      "usedWith": ["doctor", "lucy"],
      "purpose": "Confirms possible sedation or chemical control."
    },
    {
      "item": "arcade_token",
      "obtainedAt": "arcade_room.arcade_machine_2_dispenser",
      "usedWith": ["red_light_block.vending_machine"],
      "purpose": "Trades for the energy drink."
    },
    {
      "item": "energizing_drink",
      "obtainedAt": "red_light_block.vending_machine",
      "usedWith": ["mind_reader"],
      "purpose": "Unlocks Underground Garage."
    },
    {
      "item": "license_plate_note",
      "obtainedAt": "rose",
      "usedWith": ["underground_garage.car_license_plate"],
      "purpose": "Lets the detective confirm the matching car."
    },
    {
      "item": "cigarette_pack",
      "obtainedAt": "store.counter",
      "usedWith": ["bodyguard"],
      "purpose": "Grants access to Italian Restaurant Interior."
    },
    {
      "item": "screwdriver",
      "obtainedAt": "underground_garage.tool_bench",
      "usedWith": ["elevator_hidden_area"],
      "purpose": "Opens a hidden panel / note area in Elevator."
    },
    {
      "item": "steel_bar",
      "obtainedAt": "dark_alley.crate_stack",
      "usedWith": ["safehouse.metal_door"],
      "purpose": "Forces entry into The Safehouse."
    }
  ],
  "majorUnlocks": [
    {
      "unlock": "Open City Map",
      "requirements": ["bar_address_known"],
      "result": "The Bar becomes visible and selectable."
    },
    {
      "unlock": "Underground Garage",
      "requirements": ["energizing_drink_given_to_mind_reader"],
      "result": "Underground Garage becomes visible and selectable."
    },
    {
      "unlock": "Motel Neon",
      "requirements": ["plate_match_confirmed", "street_racer_identifies_car_as_nails"],
      "result": "Motel Neon becomes visible and selectable."
    },
    {
      "unlock": "Italian Restaurant Interior",
      "requirements": ["restaurant_access_granted"],
      "result": "The player can enter and talk to Big Boss."
    },
    {
      "unlock": "Safehouse access",
      "requirements": ["safehouse_location_known", "steel_bar"],
      "result": "The player can reach The Safehouse and force the final entry."
    }
  ],
  "optionalContent": [
    {
      "content": "Rooftop early visit",
      "effect": "Flavor + Trading Card"
    },
    {
      "content": "Fire Escape Landing",
      "effect": "Trading Card"
    },
    {
      "content": "The Gambler short card game",
      "effect": "Win or lose money"
    },
    {
      "content": "Blue Wing appearance",
      "effect": "Optional hint / atmosphere"
    }
  ]
}
```

