// priority: 0
// 气动工艺：材料替换
//   强化石 -> 气密合金板、无色玻璃 -> 黑曜石玻璃、铜锭 -> 信素锭、红石 -> 富集红石
//
// 四条规则，都只改**输入侧**，产物与产量一律不动：
//   1) 强化石系列（reinforced_stone / _stone_slab / reinforced_bricks / _brick_slab|stairs|wall|pillar|tile）
//      -> kubejs:airtight_alloy_plate（气密合金板）
//        仅限「产物不是该系列」的配方；系列内部互转与切石机配方不动。
//   2) 无色玻璃 -> thermal:obsidian_glass（黑曜石玻璃）
//        只认 forge:glass、forge:glass/colorless、minecraft:glass。
//   3) 铜锭 -> alltheores:signalum_ingot（信素锭）
//        只认 forge:ingots/copper、minecraft:copper_ingot。
//   4) 红石 -> mekanism:enriched_redstone（富集红石）
//        只认 forge:dusts/redstone、minecraft:redstone（红石粉）。
//
// ── 刻意没改的 ──
//   · 红石火把（minecraft:redstone_torch，19 处，含 16 个反向壁灯）与红石灯
//     （minecraft:redstone_lamp，紫外灯箱）、红石块（forge:storage_blocks/redstone，
//     通量压缩机）：都是独立的成品/方块，不是红石粉本身。
//   · 染色玻璃（forge:glass/red 等）与玻璃板（forge:glass_panes*）：
//     换掉染色玻璃会改变成品配色，玻璃板也没有对应的黑曜石玻璃板。
//   · pneumaticcraft:copper_nugget（1 铜锭 -> 9 铜粒）与 copper_ingot_from_nugget
//     （9 铜粒 -> 1 铜锭）：一对单位换算配方，没有信素粒，整对保留。
//
// ── 为什么整条重建而不是 replaceInput ──
//   这些配方的 key / ingredients 里既有 {item} 也有 {tag}，还有
//   pneumaticcraft:crafting_shaped_pressurizable 这种自定义类型，
//   replaceInput 打不准（之前验证过对 tag 与自定义类型会空转），
//   故统一按 ID 删 + 用原 ID 重建，JSON 由 jar 原文程序化改写，
//   pattern / 数量 / category / show_notification 全部逐字保留。
//
// ── 覆盖清单 ──
//   第 1 段：强化石 -> 板（18 条；其中含玻璃 / 红石的条目一并替换）。
//   第 2 段：玻璃 5 条 + 铜锭 5 条。
//   第 3 段：红石粉 -> 富集红石（24 条：各色壁灯、模块、升级、空气罐、通量压缩机等）。
//   第 4 段：压力管道 —— 玻璃那格用**气密合金板**（此前单独要求，
//            优先于第 2 段的通用玻璃规则），铁锭与 8 个产量不动。
//
// 生效：/reload

ServerEvents.recipes(event => {
  const PLATE = 'kubejs:airtight_alloy_plate'

  // ── 第 1 段：强化石系列 -> 气密合金板 ──
  // [原配方 ID, 改写后的配方 JSON]
  const STONE_RECIPES = [
    ['pneumaticcraft:air_cannon', {
      "category": "misc",
      "key": {
        "B": {
          "item": "pneumaticcraft:cannon_barrel"
        },
        "H": {
          "item": "kubejs:airtight_alloy_plate"
        },
        "S": {
          "item": "pneumaticcraft:stone_base"
        },
        "T": {
          "item": "pneumaticcraft:pressure_tube"
        }
      },
      "pattern": [
        " B ",
        " ST",
        "HHH"
      ],
      "result": {
        "item": "pneumaticcraft:air_cannon"
      },
      "show_notification": true,
      "type": "minecraft:crafting_shaped"
    }],
    ['pneumaticcraft:air_compressor', {
      "category": "misc",
      "key": {
        "F": {
          "item": "minecraft:furnace"
        },
        "I": {
          "item": "kubejs:airtight_alloy_plate"
        },
        "T": {
          "item": "pneumaticcraft:pressure_tube"
        }
      },
      "pattern": [
        "III",
        "I T",
        "IFI"
      ],
      "result": {
        "item": "pneumaticcraft:air_compressor"
      },
      "show_notification": true,
      "type": "minecraft:crafting_shaped"
    }],
    ['pneumaticcraft:cannon_barrel', {
      "category": "misc",
      "key": {
        "I": {
          "item": "kubejs:airtight_alloy_plate"
        },
        "P": {
          "item": "pneumaticcraft:pressure_tube"
        }
      },
      "pattern": [
        "I I",
        "I I",
        "IPI"
      ],
      "result": {
        "item": "pneumaticcraft:cannon_barrel"
      },
      "show_notification": true,
      "type": "minecraft:crafting_shaped"
    }],
    ['pneumaticcraft:charging_station', {
      "category": "misc",
      "key": {
        "P": {
          "item": "minecraft:brick"
        },
        "S": {
          "item": "kubejs:airtight_alloy_plate"
        },
        "T": {
          "item": "pneumaticcraft:pressure_tube"
        }
      },
      "pattern": [
        "  T",
        "PPP",
        "SSS"
      ],
      "result": {
        "item": "pneumaticcraft:charging_station"
      },
      "show_notification": true,
      "type": "minecraft:crafting_shaped"
    }],
    ['pneumaticcraft:display_table', {
      "category": "misc",
      "key": {
        "I": {
          "tag": "forge:ingots/compressed_iron"
        },
        "S": {
          "item": "kubejs:airtight_alloy_plate"
        }
      },
      "pattern": [
        "SSS",
        "I I"
      ],
      "result": {
        "item": "pneumaticcraft:display_table"
      },
      "show_notification": true,
      "type": "minecraft:crafting_shaped"
    }],
    ['pneumaticcraft:etching_tank', {
      "category": "misc",
      "key": {
        "G": {
          "tag": "forge:glass_panes"
        },
        "O": {
          "tag": "forge:obsidian"
        },
        "S": {
          "item": "kubejs:airtight_alloy_plate"
        },
        "T": {
          "count": 1,
          "item": "pneumaticcraft:small_tank",
          "type": "forge:nbt"
        },
        "W": {
          "item": "kubejs:airtight_alloy_plate"
        }
      },
      "pattern": [
        "OGO",
        "WTW",
        "SSS"
      ],
      "result": {
        "item": "pneumaticcraft:etching_tank"
      },
      "show_notification": true,
      "type": "minecraft:crafting_shaped"
    }],
    ['pneumaticcraft:fluid_mixer', {
      "category": "misc",
      "key": {
        "P": {
          "item": "pneumaticcraft:pressure_tube"
        },
        "R": {
          "item": "pneumaticcraft:turbine_rotor"
        },
        "T": {
          "item": "pneumaticcraft:small_tank"
        },
        "W": {
          "item": "kubejs:airtight_alloy_plate"
        }
      },
      "pattern": [
        " T ",
        "WRW",
        "TPT"
      ],
      "result": {
        "item": "pneumaticcraft:fluid_mixer"
      },
      "show_notification": true,
      "type": "minecraft:crafting_shaped"
    }],
    ['pneumaticcraft:gas_lift', {
      "category": "misc",
      "key": {
        "G": {
          "count": 1,
          "item": "pneumaticcraft:small_tank",
          "type": "forge:nbt"
        },
        "S": {
          "item": "kubejs:airtight_alloy_plate"
        },
        "T": {
          "item": "pneumaticcraft:pressure_tube"
        }
      },
      "pattern": [
        " T ",
        "TGT",
        "SSS"
      ],
      "result": {
        "item": "pneumaticcraft:gas_lift"
      },
      "show_notification": true,
      "type": "minecraft:crafting_shaped"
    }],
    ['pneumaticcraft:logistics_core', {
      "category": "misc",
      "key": {
        "B": {
          "item": "kubejs:airtight_alloy_plate"
        },
        "R": {
          "item": "mekanism:enriched_redstone"
        }
      },
      "pattern": [
        "BBB",
        "BRB",
        "BBB"
      ],
      "result": {
        "count": 2,
        "item": "pneumaticcraft:logistics_core"
      },
      "show_notification": true,
      "type": "minecraft:crafting_shaped"
    }],
    ['pneumaticcraft:pressure_chamber_glass', {
      "category": "misc",
      "key": {
        "G": {
          "item": "thermal:obsidian_glass"
        },
        "I": {
          "item": "kubejs:airtight_alloy_plate"
        }
      },
      "pattern": [
        "III",
        "IGI",
        "III"
      ],
      "result": {
        "count": 16,
        "item": "pneumaticcraft:pressure_chamber_glass"
      },
      "show_notification": true,
      "type": "minecraft:crafting_shaped"
    }],
    ['pneumaticcraft:pressure_chamber_wall', {
      "category": "misc",
      "key": {
        "I": {
          "item": "kubejs:airtight_alloy_plate"
        }
      },
      "pattern": [
        "III",
        "I I",
        "III"
      ],
      "result": {
        "count": 16,
        "item": "pneumaticcraft:pressure_chamber_wall"
      },
      "show_notification": true,
      "type": "minecraft:crafting_shaped"
    }],
    ['pneumaticcraft:refinery', {
      "category": "misc",
      "key": {
        "R": {
          "item": "mekanism:enriched_redstone"
        },
        "S": {
          "item": "kubejs:airtight_alloy_plate"
        },
        "T": {
          "count": 1,
          "item": "pneumaticcraft:small_tank",
          "type": "forge:nbt"
        }
      },
      "pattern": [
        "SSS",
        "RTR",
        "SSS"
      ],
      "result": {
        "item": "pneumaticcraft:refinery"
      },
      "show_notification": true,
      "type": "minecraft:crafting_shaped"
    }],
    ['pneumaticcraft:refinery_output', {
      "category": "misc",
      "key": {
        "D": {
          "tag": "forge:gems/diamond"
        },
        "G": {
          "item": "thermal:obsidian_glass"
        },
        "S": {
          "item": "kubejs:airtight_alloy_plate"
        }
      },
      "pattern": [
        "SSS",
        "GDG",
        "SSS"
      ],
      "result": {
        "item": "pneumaticcraft:refinery_output"
      },
      "show_notification": true,
      "type": "minecraft:crafting_shaped"
    }],
    ['pneumaticcraft:reinforced_chest', {
      "category": "misc",
      "key": {
        "C": {
          "tag": "forge:chests/wooden"
        },
        "G": {
          "tag": "forge:nuggets/gold"
        },
        "I": {
          "tag": "forge:ingots/compressed_iron"
        },
        "O": {
          "tag": "forge:obsidian"
        },
        "W": {
          "item": "kubejs:airtight_alloy_plate"
        }
      },
      "pattern": [
        "IGI",
        "WCW",
        "IOI"
      ],
      "result": {
        "item": "pneumaticcraft:reinforced_chest"
      },
      "show_notification": true,
      "type": "minecraft:crafting_shaped"
    }],
    ['pneumaticcraft:thermopneumatic_processing_plant', {
      "category": "misc",
      "key": {
        "P": {
          "item": "pneumaticcraft:pressure_tube"
        },
        "S": {
          "item": "kubejs:airtight_alloy_plate"
        },
        "T": {
          "count": 1,
          "item": "pneumaticcraft:small_tank",
          "type": "forge:nbt"
        }
      },
      "pattern": [
        "SSS",
        "TPT",
        "SSS"
      ],
      "result": {
        "item": "pneumaticcraft:thermopneumatic_processing_plant"
      },
      "show_notification": true,
      "type": "minecraft:crafting_shaped"
    }],
    ['pneumaticcraft:tube_junction', {
      "category": "misc",
      "key": {
        "I": {
          "item": "kubejs:airtight_alloy_plate"
        },
        "P": {
          "item": "pneumaticcraft:pressure_tube"
        }
      },
      "pattern": [
        "IPI",
        "PPP",
        "IPI"
      ],
      "result": {
        "item": "pneumaticcraft:tube_junction"
      },
      "show_notification": true,
      "type": "minecraft:crafting_shaped"
    }],
    ['pneumaticcraft:vacuum_pump', {
      "category": "misc",
      "key": {
        "G": {
          "item": "pneumaticcraft:pressure_gauge"
        },
        "R": {
          "item": "pneumaticcraft:turbine_rotor"
        },
        "S": {
          "item": "kubejs:airtight_alloy_plate"
        },
        "T": {
          "item": "pneumaticcraft:pressure_tube"
        }
      },
      "pattern": [
        "GRG",
        "TRT",
        "SSS"
      ],
      "result": {
        "item": "pneumaticcraft:vacuum_pump"
      },
      "show_notification": true,
      "type": "minecraft:crafting_shaped"
    }],
    ['pneumaticcraft:vacuum_trap', {
      "category": "misc",
      "key": {
        "E": {
          "item": "minecraft:ender_eye"
        },
        "I": {
          "tag": "forge:ingots/compressed_iron"
        },
        "P": {
          "item": "pneumaticcraft:pressure_tube"
        },
        "S": {
          "item": "kubejs:airtight_alloy_plate"
        },
        "T": {
          "item": "minecraft:iron_trapdoor"
        },
        "W": {
          "item": "kubejs:airtight_alloy_plate"
        }
      },
      "pattern": [
        "ITI",
        "WEP",
        "SSS"
      ],
      "result": {
        "item": "pneumaticcraft:vacuum_trap"
      },
      "show_notification": true,
      "type": "minecraft:crafting_shaped"
    }],

  ]

  // ── 第 2 段：玻璃 -> 黑曜石玻璃、铜锭 -> 信素锭 ──
  const MATERIAL_RECIPES = [
    ['pneumaticcraft:pressure_chamber_glass_x1', {
      "category": "misc",
      "ingredients": [
        {
          "item": "thermal:obsidian_glass"
        },
        {
          "item": "pneumaticcraft:pressure_chamber_wall"
        }
      ],
      "result": {
        "item": "pneumaticcraft:pressure_chamber_glass"
      },
      "type": "minecraft:crafting_shapeless"
    }],
    ['pneumaticcraft:pressure_chamber_glass_x4', {
      "category": "misc",
      "ingredients": [
        {
          "item": "thermal:obsidian_glass"
        },
        {
          "item": "pneumaticcraft:pressure_chamber_wall"
        },
        {
          "item": "pneumaticcraft:pressure_chamber_wall"
        },
        {
          "item": "pneumaticcraft:pressure_chamber_wall"
        },
        {
          "item": "pneumaticcraft:pressure_chamber_wall"
        }
      ],
      "result": {
        "count": 4,
        "item": "pneumaticcraft:pressure_chamber_glass"
      },
      "type": "minecraft:crafting_shapeless"
    }],
    ['pneumaticcraft:seismic_sensor', {
      "category": "misc",
      "key": {
        "C": {
          "item": "minecraft:note_block"
        },
        "G": {
          "item": "thermal:obsidian_glass"
        },
        "R": {
          "item": "minecraft:repeater"
        },
        "T": {
          "item": "minecraft:redstone_torch"
        }
      },
      "pattern": [
        " T ",
        "GRG",
        "GCG"
      ],
      "result": {
        "item": "pneumaticcraft:seismic_sensor"
      },
      "show_notification": true,
      "type": "minecraft:crafting_shaped"
    }],
    ['pneumaticcraft:small_tank', {
      "category": "misc",
      "key": {
        "B": {
          "item": "minecraft:iron_bars"
        },
        "G": {
          "item": "thermal:obsidian_glass"
        },
        "I": {
          "tag": "forge:ingots/compressed_iron"
        }
      },
      "pattern": [
        "BIB",
        "IGI",
        "BIB"
      ],
      "result": {
        "item": "pneumaticcraft:small_tank"
      },
      "show_notification": true,
      "type": "minecraft:crafting_shaped"
    }],
    ['pneumaticcraft:thermal_lagging', {
      "category": "misc",
      "key": {
        "G": {
          "item": "thermal:obsidian_glass"
        },
        "W": {
          "tag": "minecraft:wool"
        }
      },
      "pattern": [
        "WGW",
        "GWG",
        "WGW"
      ],
      "result": {
        "count": 6,
        "item": "pneumaticcraft:thermal_lagging"
      },
      "show_notification": true,
      "type": "minecraft:crafting_shaped"
    }],
    ['pneumaticcraft:gun_ammo', {
      "category": "misc",
      "ingredients": [
        {
          "tag": "forge:gunpowder"
        },
        {
          "tag": "forge:ingots/compressed_iron"
        },
        {
          "item": "alltheores:signalum_ingot"
        }
      ],
      "result": {
        "item": "pneumaticcraft:gun_ammo"
      },
      "type": "minecraft:crafting_shapeless"
    }],
    ['pneumaticcraft:heat_sink', {
      "category": "misc",
      "key": {
        "B": {
          "item": "minecraft:iron_bars"
        },
        "G": {
          "item": "alltheores:signalum_ingot"
        },
        "I": {
          "tag": "forge:ingots/compressed_iron"
        }
      },
      "pattern": [
        "BBB",
        "IGI"
      ],
      "result": {
        "item": "pneumaticcraft:heat_sink"
      },
      "show_notification": true,
      "type": "minecraft:crafting_shaped"
    }],
    ['pneumaticcraft:minigun', {
      "category": "misc",
      "key": {
        "A": {
          "item": "pneumaticcraft:air_canister"
        },
        "B": {
          "item": "pneumaticcraft:cannon_barrel"
        },
        "C": {
          "tag": "forge:chests/wooden"
        },
        "G": {
          "item": "alltheores:signalum_ingot"
        },
        "I": {
          "tag": "forge:ingots/compressed_iron"
        },
        "L": {
          "item": "minecraft:lever"
        }
      },
      "pattern": [
        "A  ",
        "CIB",
        "GL "
      ],
      "result": {
        "item": "pneumaticcraft:minigun"
      },
      "show_notification": true,
      "type": "pneumaticcraft:crafting_shaped_pressurizable"
    }],
    ['pneumaticcraft:pressure_gauge', {
      "category": "misc",
      "key": {
        "G": {
          "item": "alltheores:signalum_ingot"
        },
        "I": {
          "tag": "forge:ingots/compressed_iron"
        }
      },
      "pattern": [
        " G ",
        "GIG",
        " G "
      ],
      "result": {
        "item": "pneumaticcraft:pressure_gauge"
      },
      "show_notification": true,
      "type": "minecraft:crafting_shaped"
    }],
    ['pneumaticcraft:vortex_tube', {
      "category": "misc",
      "key": {
        "G": {
          "item": "alltheores:signalum_ingot"
        },
        "I": {
          "tag": "forge:ingots/compressed_iron"
        },
        "T": {
          "item": "pneumaticcraft:pressure_tube"
        }
      },
      "pattern": [
        "ITI",
        "GTG",
        "III"
      ],
      "result": {
        "item": "pneumaticcraft:vortex_tube"
      },
      "show_notification": true,
      "type": "minecraft:crafting_shaped"
    }],

  ]

  // ── 第 3 段：红石粉 -> 富集红石 ──
  const REDSTONE_RECIPES = [
    ['pneumaticcraft:air_canister', {
      "category": "misc",
      "key": {
        "I": {
          "tag": "forge:ingots/compressed_iron"
        },
        "R": {
          "item": "mekanism:enriched_redstone"
        },
        "T": {
          "item": "pneumaticcraft:pressure_tube"
        }
      },
      "pattern": [
        " T ",
        "IRI",
        "IRI"
      ],
      "result": {
        "item": "pneumaticcraft:air_canister"
      },
      "show_notification": true,
      "type": "minecraft:crafting_shaped"
    }],
    ['pneumaticcraft:coordinate_tracker_upgrade', {
      "category": "misc",
      "key": {
        "C": {
          "item": "pneumaticcraft:gps_tool"
        },
        "L": {
          "tag": "pneumaticcraft:upgrade_components"
        },
        "X": {
          "item": "mekanism:enriched_redstone"
        }
      },
      "pattern": [
        "LXL",
        "XCX",
        "LXL"
      ],
      "result": {
        "item": "pneumaticcraft:coordinate_tracker_upgrade"
      },
      "show_notification": true,
      "type": "minecraft:crafting_shaped"
    }],
    ['pneumaticcraft:flux_compressor', {
      "category": "misc",
      "key": {
        "C": {
          "item": "pneumaticcraft:compressed_iron_gear"
        },
        "F": {
          "tag": "forge:storage_blocks/redstone"
        },
        "G": {
          "item": "mekanism:enriched_redstone"
        },
        "P": {
          "item": "pneumaticcraft:printed_circuit_board"
        },
        "Q": {
          "item": "minecraft:blast_furnace"
        },
        "R": {
          "item": "pneumaticcraft:turbine_rotor"
        },
        "T": {
          "item": "pneumaticcraft:advanced_pressure_tube"
        }
      },
      "pattern": [
        "GCP",
        "FRT",
        "GQP"
      ],
      "result": {
        "item": "pneumaticcraft:flux_compressor"
      },
      "show_notification": true,
      "type": "minecraft:crafting_shaped"
    }],
    ['pneumaticcraft:logistics_module', {
      "category": "misc",
      "key": {
        "C": {
          "item": "pneumaticcraft:logistics_core"
        },
        "R": {
          "item": "mekanism:enriched_redstone"
        },
        "T": {
          "item": "pneumaticcraft:pressure_tube"
        }
      },
      "pattern": [
        " R ",
        "RCR",
        "TRT"
      ],
      "result": {
        "item": "pneumaticcraft:logistics_module"
      },
      "show_notification": true,
      "type": "minecraft:crafting_shaped"
    }],
    ['pneumaticcraft:module_expansion_card', {
      "category": "misc",
      "key": {
        "C": {
          "item": "pneumaticcraft:printed_circuit_board"
        },
        "P": {
          "tag": "pneumaticcraft:plastic_sheets"
        },
        "R": {
          "item": "mekanism:enriched_redstone"
        }
      },
      "pattern": [
        "RPR",
        "PCP",
        "RPR"
      ],
      "result": {
        "count": 4,
        "item": "pneumaticcraft:module_expansion_card"
      },
      "show_notification": true,
      "type": "minecraft:crafting_shaped"
    }],
    ['pneumaticcraft:pressure_gauge_module', {
      "category": "misc",
      "key": {
        "G": {
          "item": "pneumaticcraft:pressure_gauge"
        },
        "R": {
          "item": "mekanism:enriched_redstone"
        },
        "T": {
          "item": "pneumaticcraft:pressure_tube"
        }
      },
      "pattern": [
        " G ",
        "RTR"
      ],
      "result": {
        "item": "pneumaticcraft:pressure_gauge_module"
      },
      "show_notification": true,
      "type": "minecraft:crafting_shaped"
    }],
    ['pneumaticcraft:redstone_module', {
      "category": "misc",
      "key": {
        "D": {
          "item": "minecraft:repeater"
        },
        "R": {
          "item": "mekanism:enriched_redstone"
        },
        "T": {
          "item": "pneumaticcraft:pressure_tube"
        }
      },
      "pattern": [
        " R ",
        "TDT"
      ],
      "result": {
        "item": "pneumaticcraft:redstone_module"
      },
      "show_notification": true,
      "type": "minecraft:crafting_shaped"
    }],
    ['pneumaticcraft:thermostat_module', {
      "category": "misc",
      "key": {
        "D": {
          "item": "mekanism:enriched_redstone"
        },
        "H": {
          "item": "pneumaticcraft:heat_pipe"
        },
        "M": {
          "item": "pneumaticcraft:manometer"
        },
        "T": {
          "item": "pneumaticcraft:pressure_tube"
        }
      },
      "pattern": [
        " M ",
        " H ",
        "TDT"
      ],
      "result": {
        "item": "pneumaticcraft:thermostat_module"
      },
      "show_notification": true,
      "type": "minecraft:crafting_shaped"
    }],
    ['pneumaticcraft:wall_lamp_black', {
      "category": "misc",
      "key": {
        "D": {
          "tag": "forge:dyes/black"
        },
        "G": {
          "item": "minecraft:glowstone"
        },
        "I": {
          "tag": "forge:ingots/compressed_iron"
        },
        "R": {
          "item": "mekanism:enriched_redstone"
        }
      },
      "pattern": [
        " R ",
        "IGI",
        " D "
      ],
      "result": {
        "count": 4,
        "item": "pneumaticcraft:wall_lamp_black"
      },
      "show_notification": true,
      "type": "minecraft:crafting_shaped"
    }],
    ['pneumaticcraft:wall_lamp_blue', {
      "category": "misc",
      "key": {
        "D": {
          "tag": "forge:dyes/blue"
        },
        "G": {
          "item": "minecraft:glowstone"
        },
        "I": {
          "tag": "forge:ingots/compressed_iron"
        },
        "R": {
          "item": "mekanism:enriched_redstone"
        }
      },
      "pattern": [
        " R ",
        "IGI",
        " D "
      ],
      "result": {
        "count": 4,
        "item": "pneumaticcraft:wall_lamp_blue"
      },
      "show_notification": true,
      "type": "minecraft:crafting_shaped"
    }],
    ['pneumaticcraft:wall_lamp_brown', {
      "category": "misc",
      "key": {
        "D": {
          "tag": "forge:dyes/brown"
        },
        "G": {
          "item": "minecraft:glowstone"
        },
        "I": {
          "tag": "forge:ingots/compressed_iron"
        },
        "R": {
          "item": "mekanism:enriched_redstone"
        }
      },
      "pattern": [
        " R ",
        "IGI",
        " D "
      ],
      "result": {
        "count": 4,
        "item": "pneumaticcraft:wall_lamp_brown"
      },
      "show_notification": true,
      "type": "minecraft:crafting_shaped"
    }],
    ['pneumaticcraft:wall_lamp_cyan', {
      "category": "misc",
      "key": {
        "D": {
          "tag": "forge:dyes/cyan"
        },
        "G": {
          "item": "minecraft:glowstone"
        },
        "I": {
          "tag": "forge:ingots/compressed_iron"
        },
        "R": {
          "item": "mekanism:enriched_redstone"
        }
      },
      "pattern": [
        " R ",
        "IGI",
        " D "
      ],
      "result": {
        "count": 4,
        "item": "pneumaticcraft:wall_lamp_cyan"
      },
      "show_notification": true,
      "type": "minecraft:crafting_shaped"
    }],
    ['pneumaticcraft:wall_lamp_gray', {
      "category": "misc",
      "key": {
        "D": {
          "tag": "forge:dyes/gray"
        },
        "G": {
          "item": "minecraft:glowstone"
        },
        "I": {
          "tag": "forge:ingots/compressed_iron"
        },
        "R": {
          "item": "mekanism:enriched_redstone"
        }
      },
      "pattern": [
        " R ",
        "IGI",
        " D "
      ],
      "result": {
        "count": 4,
        "item": "pneumaticcraft:wall_lamp_gray"
      },
      "show_notification": true,
      "type": "minecraft:crafting_shaped"
    }],
    ['pneumaticcraft:wall_lamp_green', {
      "category": "misc",
      "key": {
        "D": {
          "tag": "forge:dyes/green"
        },
        "G": {
          "item": "minecraft:glowstone"
        },
        "I": {
          "tag": "forge:ingots/compressed_iron"
        },
        "R": {
          "item": "mekanism:enriched_redstone"
        }
      },
      "pattern": [
        " R ",
        "IGI",
        " D "
      ],
      "result": {
        "count": 4,
        "item": "pneumaticcraft:wall_lamp_green"
      },
      "show_notification": true,
      "type": "minecraft:crafting_shaped"
    }],
    ['pneumaticcraft:wall_lamp_light_blue', {
      "category": "misc",
      "key": {
        "D": {
          "tag": "forge:dyes/light_blue"
        },
        "G": {
          "item": "minecraft:glowstone"
        },
        "I": {
          "tag": "forge:ingots/compressed_iron"
        },
        "R": {
          "item": "mekanism:enriched_redstone"
        }
      },
      "pattern": [
        " R ",
        "IGI",
        " D "
      ],
      "result": {
        "count": 4,
        "item": "pneumaticcraft:wall_lamp_light_blue"
      },
      "show_notification": true,
      "type": "minecraft:crafting_shaped"
    }],
    ['pneumaticcraft:wall_lamp_light_gray', {
      "category": "misc",
      "key": {
        "D": {
          "tag": "forge:dyes/light_gray"
        },
        "G": {
          "item": "minecraft:glowstone"
        },
        "I": {
          "tag": "forge:ingots/compressed_iron"
        },
        "R": {
          "item": "mekanism:enriched_redstone"
        }
      },
      "pattern": [
        " R ",
        "IGI",
        " D "
      ],
      "result": {
        "count": 4,
        "item": "pneumaticcraft:wall_lamp_light_gray"
      },
      "show_notification": true,
      "type": "minecraft:crafting_shaped"
    }],
    ['pneumaticcraft:wall_lamp_lime', {
      "category": "misc",
      "key": {
        "D": {
          "tag": "forge:dyes/lime"
        },
        "G": {
          "item": "minecraft:glowstone"
        },
        "I": {
          "tag": "forge:ingots/compressed_iron"
        },
        "R": {
          "item": "mekanism:enriched_redstone"
        }
      },
      "pattern": [
        " R ",
        "IGI",
        " D "
      ],
      "result": {
        "count": 4,
        "item": "pneumaticcraft:wall_lamp_lime"
      },
      "show_notification": true,
      "type": "minecraft:crafting_shaped"
    }],
    ['pneumaticcraft:wall_lamp_magenta', {
      "category": "misc",
      "key": {
        "D": {
          "tag": "forge:dyes/magenta"
        },
        "G": {
          "item": "minecraft:glowstone"
        },
        "I": {
          "tag": "forge:ingots/compressed_iron"
        },
        "R": {
          "item": "mekanism:enriched_redstone"
        }
      },
      "pattern": [
        " R ",
        "IGI",
        " D "
      ],
      "result": {
        "count": 4,
        "item": "pneumaticcraft:wall_lamp_magenta"
      },
      "show_notification": true,
      "type": "minecraft:crafting_shaped"
    }],
    ['pneumaticcraft:wall_lamp_orange', {
      "category": "misc",
      "key": {
        "D": {
          "tag": "forge:dyes/orange"
        },
        "G": {
          "item": "minecraft:glowstone"
        },
        "I": {
          "tag": "forge:ingots/compressed_iron"
        },
        "R": {
          "item": "mekanism:enriched_redstone"
        }
      },
      "pattern": [
        " R ",
        "IGI",
        " D "
      ],
      "result": {
        "count": 4,
        "item": "pneumaticcraft:wall_lamp_orange"
      },
      "show_notification": true,
      "type": "minecraft:crafting_shaped"
    }],
    ['pneumaticcraft:wall_lamp_pink', {
      "category": "misc",
      "key": {
        "D": {
          "tag": "forge:dyes/pink"
        },
        "G": {
          "item": "minecraft:glowstone"
        },
        "I": {
          "tag": "forge:ingots/compressed_iron"
        },
        "R": {
          "item": "mekanism:enriched_redstone"
        }
      },
      "pattern": [
        " R ",
        "IGI",
        " D "
      ],
      "result": {
        "count": 4,
        "item": "pneumaticcraft:wall_lamp_pink"
      },
      "show_notification": true,
      "type": "minecraft:crafting_shaped"
    }],
    ['pneumaticcraft:wall_lamp_purple', {
      "category": "misc",
      "key": {
        "D": {
          "tag": "forge:dyes/purple"
        },
        "G": {
          "item": "minecraft:glowstone"
        },
        "I": {
          "tag": "forge:ingots/compressed_iron"
        },
        "R": {
          "item": "mekanism:enriched_redstone"
        }
      },
      "pattern": [
        " R ",
        "IGI",
        " D "
      ],
      "result": {
        "count": 4,
        "item": "pneumaticcraft:wall_lamp_purple"
      },
      "show_notification": true,
      "type": "minecraft:crafting_shaped"
    }],
    ['pneumaticcraft:wall_lamp_red', {
      "category": "misc",
      "key": {
        "D": {
          "tag": "forge:dyes/red"
        },
        "G": {
          "item": "minecraft:glowstone"
        },
        "I": {
          "tag": "forge:ingots/compressed_iron"
        },
        "R": {
          "item": "mekanism:enriched_redstone"
        }
      },
      "pattern": [
        " R ",
        "IGI",
        " D "
      ],
      "result": {
        "count": 4,
        "item": "pneumaticcraft:wall_lamp_red"
      },
      "show_notification": true,
      "type": "minecraft:crafting_shaped"
    }],
    ['pneumaticcraft:wall_lamp_white', {
      "category": "misc",
      "key": {
        "D": {
          "tag": "forge:dyes/white"
        },
        "G": {
          "item": "minecraft:glowstone"
        },
        "I": {
          "tag": "forge:ingots/compressed_iron"
        },
        "R": {
          "item": "mekanism:enriched_redstone"
        }
      },
      "pattern": [
        " R ",
        "IGI",
        " D "
      ],
      "result": {
        "count": 4,
        "item": "pneumaticcraft:wall_lamp_white"
      },
      "show_notification": true,
      "type": "minecraft:crafting_shaped"
    }],
    ['pneumaticcraft:wall_lamp_yellow', {
      "category": "misc",
      "key": {
        "D": {
          "tag": "forge:dyes/yellow"
        },
        "G": {
          "item": "minecraft:glowstone"
        },
        "I": {
          "tag": "forge:ingots/compressed_iron"
        },
        "R": {
          "item": "mekanism:enriched_redstone"
        }
      },
      "pattern": [
        " R ",
        "IGI",
        " D "
      ],
      "result": {
        "count": 4,
        "item": "pneumaticcraft:wall_lamp_yellow"
      },
      "show_notification": true,
      "type": "minecraft:crafting_shaped"
    }],
  ]

  ;[STONE_RECIPES, MATERIAL_RECIPES, REDSTONE_RECIPES].forEach(table => {
    table.forEach(function (entry) {
      event.remove({ id: entry[0] })
      event.custom(entry[1]).id(entry[0])
    })
  })

  // ── 第 4 段：压力管道 —— 玻璃 -> 气密合金板（铁锭与产量 8 个不动）──
  //   这一条优先于第 2 段的通用玻璃规则：管道要的是板，不是黑曜石玻璃。
  const TUBE = 'pneumaticcraft:pressure_tube'
  event.remove({ id: TUBE })
  event.custom({
    type: 'minecraft:crafting_shaped',
    category: 'misc',
    key: {
      G: { item: PLATE },
      I: { tag: 'forge:ingots/compressed_iron' }
    },
    pattern: ['IGI'],
    result: { count: 8, item: TUBE },
    show_notification: true
  }).id(TUBE)

  console.info('[PLB] pneumaticcraft material swaps: ' + STONE_RECIPES.length +
    ' reinforced-stone -> plate, ' + MATERIAL_RECIPES.length + ' glass/copper, ' +
    REDSTONE_RECIPES.length + ' redstone -> enriched redstone, pressure_tube glass -> plate')
})
