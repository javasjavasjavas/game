# locations_and_hotspots_data.md

```json
{
  "locations": [
    {
      "id": "apartment",
      "name": "Apartment",
      "type": "building_scene",
      "group": "detective_building",
      "availableFromStart": true,
      "appearsOnCityMap": false,
      "npcs": ["lucy"],
      "notes": "Starting scene. The detective wakes up here. Leave Apartment leads to Elevator.",
      "hotspots": [
        {
          "id": "jacket_pocket",
          "name": "Jacket Pocket",
          "type": "pickup",
          "result": "blondie_photo",
          "storyImpact": "Lucy tells the detective that Blondie's photo is in the jacket pocket."
        },
        {
          "id": "videogame_screen",
          "name": "Videogame Screen",
          "type": "humor",
          "result": "flavor_text",
          "storyImpact": "No direct story impact."
        },
        {
          "id": "computer_screen",
          "name": "Computer Screen",
          "type": "clue",
          "result": "bar_address_known",
          "storyImpact": "The detective reads Lucy's email with the Bar address. This enables Open City Map and marks The Bar."
        },
        {
          "id": "window_city_view",
          "name": "City Through the Window",
          "type": "info",
          "result": "worldbuilding_text",
          "storyImpact": "No direct story impact."
        }
      ]
    },
    {
      "id": "elevator",
      "name": "Elevator",
      "type": "building_scene",
      "group": "detective_building",
      "availableFromStart": true,
      "appearsOnCityMap": false,
      "npcs": [],
      "notes": "Reached from Apartment via Leave Apartment. Lets the player go to Rooftop or Exit Building.",
      "hotspots": [
        {
          "id": "button_panel",
          "name": "Button Panel",
          "type": "navigation",
          "result": "scene_transition",
          "storyImpact": "Lets the player choose Rooftop or Exit Building / city map."
        },
        {
          "id": "neighbor_note",
          "name": "Neighbor Note",
          "type": "info",
          "result": "building_context",
          "storyImpact": "Provides contextual information. Can later be revisited with more meaning."
        },
        {
          "id": "carved_number",
          "name": "Carved Number",
          "type": "clue",
          "result": "building_number_context",
          "storyImpact": "Useful later as contextual spatial information."
        }
      ]
    },
    {
      "id": "rooftop",
      "name": "Rooftop",
      "type": "building_scene",
      "group": "detective_building",
      "availableFromStart": true,
      "appearsOnCityMap": false,
      "npcs": ["blue_wing"],
      "notes": "Optional exploration scene from the Elevator. Blue Wing can appear later based on time or prior action.",
      "hotspots": [
        {
          "id": "edge_view",
          "name": "Edge View",
          "type": "info",
          "result": "city_observation_text",
          "storyImpact": "No direct story impact."
        },
        {
          "id": "flower_pot",
          "name": "Flower Pot",
          "type": "collectible",
          "result": "trading_card_rooftop_01",
          "storyImpact": "Optional score / collectible."
        }
      ]
    },
    {
      "id": "bar",
      "name": "The Bar",
      "type": "city_location",
      "group": "downtown",
      "availableFromStart": false,
      "appearsOnCityMap": true,
      "npcs": ["the_gambler"],
      "notes": "First city location unlocked through Lucy's email. The Gambler can also offer a short optional card game.",
      "hotspots": [
        {
          "id": "wall_poster",
          "name": "Wall Poster",
          "type": "humor",
          "result": "flavor_text",
          "storyImpact": "No direct story impact."
        },
        {
          "id": "under_the_table",
          "name": "Under the Table",
          "type": "pickup",
          "result": "crumpled_receipt",
          "storyImpact": "Secondary clue found after investigating the Bar."
        },
        {
          "id": "bottle_bar",
          "name": "Bottle Bar",
          "type": "info",
          "result": "context_text",
          "storyImpact": "Minor observational support for the scene."
        }
      ]
    },
    {
      "id": "pharmacy",
      "name": "Pharmacy",
      "type": "city_location",
      "group": "residential",
      "availableFromStart": true,
      "appearsOnCityMap": true,
      "npcs": ["doctor"],
      "notes": "Technical truth scene. The Doctor helps confirm sedation / panic / medical implications.",
      "hotspots": [
        {
          "id": "medical_diploma",
          "name": "Medical Diploma",
          "type": "humor",
          "result": "flavor_text",
          "storyImpact": "No direct story impact."
        },
        {
          "id": "medicine_shelf_1",
          "name": "Medicine Shelf 1",
          "type": "pickup",
          "result": "sedative_box",
          "storyImpact": "Physical evidence suggesting sedation or control."
        },
        {
          "id": "medicine_shelf_2",
          "name": "Medicine Shelf 2",
          "type": "info",
          "result": "hint_text",
          "storyImpact": "Suggests the player should inspect the other shelf."
        }
      ]
    },
    {
      "id": "arcade_room",
      "name": "Arcade Room",
      "type": "city_location",
      "group": "downtown",
      "availableFromStart": true,
      "appearsOnCityMap": true,
      "npcs": ["mind_reader"],
      "notes": "Mysterious Kid scene. Later, giving him the energy drink unlocks Underground Garage.",
      "hotspots": [
        {
          "id": "counter_computer",
          "name": "Counter Computer",
          "type": "clue",
          "result": "has_arcade_timeline_clue",
          "storyImpact": "Gives a timeline clue about who was there and when."
        },
        {
          "id": "arcade_machine_1",
          "name": "Arcade Machine",
          "type": "humor",
          "result": "flavor_text",
          "storyImpact": "No direct story impact."
        },
        {
          "id": "arcade_machine_2_dispenser",
          "name": "Arcade 2 / Token Dispenser",
          "type": "pickup",
          "result": "arcade_token",
          "storyImpact": "Needed to buy the energy drink at Red Light Block."
        }
      ]
    },
    {
      "id": "store",
      "name": "The Store",
      "type": "city_location",
      "group": "downtown",
      "availableFromStart": true,
      "appearsOnCityMap": true,
      "npcs": ["jenny", "cop"],
      "notes": "Utility scene with purchases and minor witness information.",
      "hotspots": [
        {
          "id": "fridge",
          "name": "Fridge",
          "type": "shop",
          "result": "buy_small_product",
          "storyImpact": "Optional utility purchase."
        },
        {
          "id": "counter",
          "name": "Counter",
          "type": "shop",
          "result": "cigarette_pack",
          "storyImpact": "Cigarette pack is used on BodyGuard."
        },
        {
          "id": "ice_cream_freezer",
          "name": "Ice Cream Freezer",
          "type": "humor",
          "result": "flavor_text",
          "storyImpact": "No direct story impact."
        }
      ]
    },
    {
      "id": "red_light_block",
      "name": "Red Light Block",
      "type": "city_location",
      "group": "downtown",
      "availableFromStart": true,
      "appearsOnCityMap": true,
      "npcs": ["rose"],
      "notes": "Rose gives the handwritten note with the license plate number of the car Blondie entered.",
      "hotspots": [
        {
          "id": "vending_machine",
          "name": "Vending Machine",
          "type": "use_shop",
          "result": "energizing_drink",
          "requirements": ["arcade_token"],
          "storyImpact": "Consumes arcade_token and gives energizing_drink for Mysterious Kid."
        },
        {
          "id": "alley_entrance",
          "name": "Alley Entrance",
          "type": "transition",
          "result": "go_to_dark_alley",
          "storyImpact": "Directly connects Red Light Block to Dark Alley."
        },
        {
          "id": "ramen_shop",
          "name": "Ramen Shop",
          "type": "humor",
          "result": "flavor_text",
          "storyImpact": "No direct story impact."
        }
      ]
    },
    {
      "id": "dark_alley",
      "name": "Dark Alley",
      "type": "city_location",
      "group": "industrial_edge",
      "availableFromStart": true,
      "appearsOnCityMap": true,
      "npcs": ["pepe", "blue_wing"],
      "notes": "Pepe scene. Blue Wing may appear here later under certain conditions.",
      "hotspots": [
        {
          "id": "dumpster",
          "name": "Dumpster",
          "type": "humor",
          "result": "flavor_text",
          "storyImpact": "No direct story impact."
        },
        {
          "id": "fire_escape_ladder",
          "name": "Fire Escape Ladder",
          "type": "transition",
          "result": "go_to_fire_escape_landing",
          "storyImpact": "Leads to optional Fire Escape Landing."
        },
        {
          "id": "crate_stack",
          "name": "Crate Stack",
          "type": "pickup",
          "result": "steel_bar",
          "storyImpact": "Steel bar is used to force open the Safehouse metal door."
        }
      ]
    },
    {
      "id": "fire_escape_landing",
      "name": "Fire Escape Landing",
      "type": "side_location",
      "group": "dark_alley_vertical",
      "availableFromStart": false,
      "appearsOnCityMap": false,
      "npcs": [],
      "notes": "Small optional sub-scene reached from the Dark Alley ladder. Not required for story progression.",
      "hotspots": [
        {
          "id": "hidden_trading_card",
          "name": "Hidden Trading Card",
          "type": "collectible",
          "result": "trading_card_fire_escape_01",
          "storyImpact": "Optional score / collectible."
        }
      ]
    },
    {
      "id": "underground_garage",
      "name": "Underground Garage",
      "type": "city_location",
      "group": "industrial_edge",
      "availableFromStart": false,
      "appearsOnCityMap": true,
      "npcs": ["street_racer"],
      "notes": "Unlocked after giving the energy drink to Mysterious Kid. The player confirms the license plate match here and asks Street Racer whose car it is.",
      "hotspots": [
        {
          "id": "car_license_plate",
          "name": "Car License Plate",
          "type": "clue",
          "result": "plate_match_confirmed",
          "requirements": ["license_plate_note"],
          "storyImpact": "Confirms that the car in the Garage matches Rose's handwritten plate note."
        },
        {
          "id": "tool_bench",
          "name": "Tool Bench",
          "type": "pickup",
          "result": "screwdriver",
          "storyImpact": "Optional tool later used in Elevator."
        },
        {
          "id": "car_body",
          "name": "Car",
          "type": "humor",
          "result": "flavor_text",
          "storyImpact": "No direct story impact."
        }
      ]
    },
    {
      "id": "italian_restaurant_exterior",
      "name": "Italian Restaurant Exterior",
      "type": "city_location",
      "group": "downtown",
      "availableFromStart": true,
      "appearsOnCityMap": true,
      "npcs": ["bodyguard"],
      "notes": "Access point to Big Boss.",
      "hotspots": [
        {
          "id": "restaurant_door",
          "name": "Door",
          "type": "gate",
          "result": "blocked_by_bodyguard",
          "storyImpact": "Blocked by BodyGuard until the player fulfills the required action."
        },
        {
          "id": "menu_board",
          "name": "Menu Board",
          "type": "humor",
          "result": "flavor_text",
          "storyImpact": "No direct story impact."
        },
        {
          "id": "delivery_motorcycle",
          "name": "Delivery Motorcycle",
          "type": "info",
          "result": "ambient_info",
          "storyImpact": "No relevant story impact."
        }
      ]
    },
    {
      "id": "italian_restaurant_interior",
      "name": "Italian Restaurant Interior",
      "type": "city_location",
      "group": "downtown",
      "availableFromStart": false,
      "appearsOnCityMap": false,
      "npcs": ["big_boss", "dirty_cop"],
      "notes": "Conversation-only scene with Big Boss. No hotspots.",
      "hotspots": []
    },
    {
      "id": "motel_neon",
      "name": "Motel Neon",
      "type": "city_location",
      "group": "outer_district",
      "availableFromStart": false,
      "appearsOnCityMap": true,
      "npcs": ["nails"],
      "notes": "Unlocked after Street Racer identifies the car as Nails's and gives the address.",
      "hotspots": [
        {
          "id": "status",
          "name": "Pending",
          "type": "pending",
          "result": "pending_definition",
          "storyImpact": "Hotspots not yet fully defined."
        }
      ]
    },
    {
      "id": "safehouse",
      "name": "The Safehouse",
      "type": "city_location",
      "group": "hidden",
      "availableFromStart": false,
      "appearsOnCityMap": true,
      "npcs": ["blondie"],
      "notes": "Final location. Reached after Nails reveals its location.",
      "hotspots": [
        {
          "id": "metal_door",
          "name": "Metal Door",
          "type": "gate_use",
          "result": "force_entry",
          "requirements": ["steel_bar"],
          "storyImpact": "The final entry point. The player uses the steel bar to force the door open."
        }
      ]
    }
  ],
  "notes": {
    "source": "Compiled from the currently agreed canon in the conversation.",
    "pendingWork": [
      "Define Motel Neon hotspots",
      "Define the exact screwdriver use in Elevator",
      "Define Blue Wing late-appearance triggers in Rooftop and Dark Alley",
      "Optionally add collectable hotspots to more scenes"
    ]
  }
}
```