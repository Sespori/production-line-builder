# Production Line Builder

自建 Minecraft 整合包 **Production Line Builder** 的内容定制仓库：用 KubeJS 重排配方、统一材料、调整机器门槛，并附带少量机器配置微调。仓库内不含任何模组文件。

- 运行环境：Forge 1.20.1 + KubeJS `2001.6.5-build.26`（KubeJS 6）
- 涉及的模组：Thermal Series（Foundation / Expansion / Integration / Dynamics）、Mekanism（含 Additions）、AllTheOres、AllTheModium、Almost Unified、Instant Unify
- 生效方式：脚本改动执行 `/reload`；Mekanism 的配置改动需要**重启游戏**

---

## 目录结构

```
kubejs/server_scripts/      # 服务端脚本，放入实例的 kubejs/server_scripts/
config/                     # 改过的配置文件，覆盖到实例的 config/ 对应位置
  almostunified/unify.json
  instantunify-common.toml
  Mekanism/machine-usage.toml
```

安装：把 `kubejs/` 和 `config/` 两个目录直接覆盖到整合包实例根目录即可（同名文件会被替换，**覆盖前建议备份**）。

---

## 改动清单

### 热力（Thermal Series）

| 脚本 | 内容 |
|---|---|
| `thermal_machine_frame.js` | `thermal:machine_frame` 重做：铁锭 → 灌注合金、玻璃 → 透明塑料、锡齿轮 → 高级控制电路 |
| `thermal_machines_glass.js` | 6 台机器的玻璃（`#forge:glass`）全部换成 `#mekanismadditions:plastic_blocks/transparent`：灌装机、酿造机、冷凝机、熔化炉、培育机、精炼机 |
| `thermal_rf_coil.js` | `thermal:rf_coil`：红石粉 → 灌注合金，金锭 → 金齿轮 |
| `gears_from_rods_plates.js` | 42 条齿轮配方改为「四角 `#forge:rods/<材料>` + 四边 `#forge:plates/<材料>`」，中心留空 |
| `thermal_press_gears.js` | 为 Thermal 没有压印配方的 11 种材料补 `thermal:press` 齿轮配方（4 材料 + 齿轮模具，默认耗能） |
| `thermal_bottler_hdpe.js` | 灌装机新增：100mb 乙烯 + 1 基质 → 2 颗 HDPE 颗粒，2000 RF |
| `thermal_smelter_endgame_alloys.js` | 禁用感应炉里产出末影 / 流明 / 信素锭的全部 9 条配方（合金合成 + 粉尘回炉 + 板材回炉） |
| `thermal_enderium_dust_recipe.js` | `thermal:enderium_dust_2`：钻石粉 → 铂粉 |
| `disable_fire_charge_and_dust_recipes.js` | 禁用全部 11 条以火焰弹为材料的合成；禁用 AllTheOres 的 4 条合金粉尘手工配方 |

### 通用机械（Mekanism）

| 脚本 | 内容 |
|---|---|
| `mekanism_alloy_infused.js` | `mekanism:alloy_infused`（冶金灌注）：铁锭 → `alltheores:steel_ingot` |
| `mekanism_plastic_transparent.js` | 透明塑料块产出 8 → 2、普通塑料块产出 4 → 1 |
| `mekanism_atomic_to_infused.js` | 数字采矿机 / 传送核心 / 机器人：原子合金 → 灌注合金；机器人另把精炼黑曜石锭 → 锇锭 |
| `mekanism_tier_upgrades.js` | 净化仓 / 化学氧化机：灌注合金 → 强化合金，基础·高级电路 → 精英电路；蒸馏控制器 / 阀门：高级电路 → 精英电路 |
| `mekanism_chemical_machines.js` | 化学溶解室 / 洗涤机 / 结晶器：精炼黑曜石锭 → 强化合金，终极电路 → 精英电路 |
| `mekanism_pigment_mixer.js` | 颜料混合器：强化合金 → 灌注合金，精英电路 → 高级电路 |

### 配置

| 文件 | 内容 |
|---|---|
| `config/almostunified/unify.json` | `modPriorities` 重排，`alltheores` 提到第 2 位（与 `instantunify` 完全一致），解决同名齿轮反复转换的问题 |
| `config/instantunify-common.toml` | `preferredMods` 与上面的列表逐项对齐 |
| `config/Mekanism/machine-usage.toml` | 数字采矿机基础耗能 1000 → 100 J/t（1/10） |

---

## 已知限制

- 齿轮改造只覆盖「材料同时存在 `forge:rods/<材料>` 与 `forge:plates/<材料>`」的配方。跳过的 5 条：`thermal:parts/emerald_gear`、`lapis_gear`、`netherite_gear`、`quartz_gear`、`rose_gold_gear`。
- 若干配方（`mekanism:mek_data` 等自定义序列化器）KubeJS 的 `replaceInput` 改不到，脚本里改用 `remove` + `event.custom` 整条重建，配方 ID 保持不变。
- Thermal 的配方数据位于 `thermal_foundation.jar` 内嵌的 `jarjar/thermal_core` 中，用常规方式翻 jar 会看不到。

## 环境版本

```
Minecraft      1.20.1
Forge          1.20.1-47.x
KubeJS         2001.6.5-build.26
Thermal        11.0.x（foundation / expansion / integration / dynamics）
Mekanism       10.4.16.80（含 Additions）
AllTheOres     47.1.3-2.2.4
Almost Unified 0.11.0
Instant Unify  1.3.0
```

## 许可

脚本部分可自由取用、修改；`config/` 下的文件是各自模组的配置，版权归原模组作者。
