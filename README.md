# Production Line Builder

自建 Minecraft 整合包 **Production Line Builder** 的内容定制仓库：用 KubeJS 重排配方、统一材料、给高级材料接上多步产线，并附带少量机器配置微调。仓库内不含任何模组文件。

- 运行环境：Forge 1.20.1 + KubeJS `2001.6.5-build.26`（KubeJS 6）
- 规模：服务端脚本 47 个、启动脚本 5 个、客户端脚本 2 个；自注册物品 38 种、流体 9 种、气体 4 种
- 生效方式：脚本改动 `/reload`；**新增物品 / 流体 / 气体**与 **config 改动**必须重启游戏

---

## 目录结构

```
kubejs/
  server_scripts/     服务端脚本（47 个），放入实例的 kubejs/server_scripts/
  startup_scripts/    启动脚本（5 个）：自注册物品 / 流体 / 气体、TF 移植材料
  client_scripts/     客户端脚本（2 个）：中英译名
  assets/
    kubejs/lang/      中英译名补充（zh_cn / en_us）
    kubejs/textures/  物品 47 张、方块与流体 37 张、气体 4 张
    minecraft/atlases/blocks.json   自加气体的图集声明（缺了图标会变紫黑）
config/               改过的配置，覆盖到实例的 config/ 对应位置
  almostunified/unify.json
  instantunify-common.toml
  Mekanism/general.toml
  Mekanism/machine-usage.toml
```

安装：把 `kubejs/` 与 `config/` 两个目录覆盖到整合包实例根目录即可（同名文件会被替换，**覆盖前建议备份**）。`kubejs/` 下 KubeJS 自带的 `example.js`、`README.txt`、`assets/thermal` 不属于本仓库内容。

---

## 改动清单

### 一、材料统一与配方自检

| 脚本 | 内容 |
|---|---|
| `sulfur_unify.js` | 硫收敛到 Thermal：`forge:dusts/sulfur` 只留 `thermal:sulfur_dust`，`mekanism:dust_sulfur` 退出所有配方（一次性覆盖 5 条按标签写的配方） |
| `ender_pearl_dust_unify.js` | 末影粉只留 `thermal:ender_pearl_dust`，关掉 `ae2:ender_dust` 的全部配方 |
| `mekanism_tag_input_fix.js` | priority 300。把 Mekanism 系配方里「按标签写」的流体 / 气体 / 灌注类型输入改成具体 ID，绕开 `IncompleteRecipeScanner` 的空标签自检（否则每次启动随机判空、整条配方被过滤） |

### 二、热力（Thermal Series）

| 脚本 | 内容 |
|---|---|
| `thermal_machine_frame.js` | `thermal:machine_frame` 重做：铁锭 → 灌注合金、玻璃 → 透明塑料、锡齿轮 → 高级控制电路 |
| `thermal_machines_glass.js` | 6 台机器玻璃（`#forge:glass`）换成透明塑料块：灌装机、酿造机、冷凝机、熔化炉、培育机、精炼机 |
| `thermal_rf_coil.js` | `thermal:rf_coil`：红石粉 → 灌注合金，金锭 → 金齿轮 |
| `gears_from_rods_plates.js` | 42 条齿轮配方改为「四角 `#forge:rods/<材料>` + 四边 `#forge:plates/<材料>`」，中心留空 |
| `thermal_press_gears.js` | 为 Thermal 没有压印配方的 11 种材料补 `thermal:press` 齿轮配方（4 材料 + 齿轮模具，默认耗能） |
| `thermal_bottler_hdpe.js` | 灌装机新增：100 mB 乙烯 + 1 基质 → 2 颗 HDPE 颗粒，2000 RF |
| `thermal_smelter_endgame_alloys.js` | 禁用感应炉里产出末影 / 流明 / 信素锭的全部 9 条配方（合金合成 + 粉尘回炉 + 板材回炉） |
| `thermal_enderium_dust_recipe.js` | `thermal:enderium_dust_2` 整条重建：钻石粉 → 铂粉；末影珍珠 / 末影珍珠粉 → 只接受 `thermal:ender_pearl_dust`（数量、产物、ID 均不变；删除用「ID + 输入含末影珍珠 + 工作台类配方」三层过滤） |
| `thermal_cured_rubber_recipes.js` | 收紧硫化橡胶：禁用熔炉版与感应炉版，只留「橡胶块拆回」与灌装机版（1000 mB 乳胶 + 1 硫粉 → 3 个） |
| `thermal_elemental_dusts.js` | 为移植回来的 4 种元素粉补工作台配方（2 元素粉 + 红石 + 主题材料 → 2 个），并给对应流体补熔岩炉配方 |
| `disable_fire_charge_and_dust_recipes.js` | 禁用全部 11 条以火焰弹为材料的合成；禁用 AllTheOres 的 4 条合金粉尘手工配方 |
| `custom_recipes.js` | 本包自加的 Thermal 配方：熔融青金石（1 青金石 → 100 mB，2000 RF）、紫水晶粉、魔力粉基底（紫水晶粉 + 400 mB 熔融青金石）、共振魔源宝石（→ 9 魔力粉基底）、秘银粉（银粉 + 1000 mB 元始魔力）、硫化橡胶灌装 |

### 三、通用机械（Mekanism）

| 脚本 | 内容 |
|---|---|
| `mekanism_alloy_infused.js` | `mekanism:alloy_infused`（冶金灌注）：铁锭 → `alltheores:steel_ingot` |
| `mekanism_plastic_transparent.js` | 透明塑料块产出 8 → 2、普通塑料块产出 4 → 1 |
| `mekanism_atomic_to_infused.js` | 数字采矿机 / 传送核心 / 机器人 / 量子传送器：原子合金 → 灌注合金；机器人另把精炼黑曜石锭 → 锇锭；量子传送器另把终极电路 → 高级电路、精炼黑曜石锭 → 锇锭 |
| `mekanism_tier_upgrades.js` | 净化仓 / 化学氧化机：灌注合金 → 强化合金，基础·高级电路 → 精英电路；蒸馏控制器 / 阀门：高级电路 → 精英电路 |
| `mekanism_chemical_machines.js` | 化学溶解室 / 洗涤机 / 结晶器：精炼黑曜石锭 → 强化合金，终极电路 → 精英电路 |
| `mekanism_pigment_mixer.js` | 颜料混合器：强化合金 → 灌注合金，精英电路 → 高级电路 |
| `mekanism_advanced_circuit.js` | 高级控制电路：原「ACA」两行之外，上下中格各加 1 个富集红石（其余材料不变） |
| `mekanism_custom_recipes.js` | 本包自加的 Mekanism 配方：紫水晶簇富集、紫水晶粉 / 硫粉粉碎、氯化铂与氯化铱两级 PRC、硝酸链（氨气 → 氮氧化物 → 气体硝酸 → 液态硝酸）、塑料 PRC、液态松香 PRC、盐的结晶与溶解、**氨气 ⇄ 液态氨 旋转冷凝器（双向）** |

### 四、产线（高级材料的处理链）

| 脚本 | 内容 |
|---|---|
| `alltheores_platinum_dust_to_crude.js` | 铂：5 条「矿石 / 粗铂直接制铂粉」改为产 `kubejs:crude_platinum_dust`（富集仓 3 / 锤子 1 / 粉碎机 1）；另 6 条「矿石 / 粗铂熔炼或高炉出铂锭」同样改为粗铂粉 |
| `alltheores_iridium_dust_to_chloride.js` | 铱：矿与粗铱先出粗铱粉（4 条制粉 + 6 条烧炼 + 补 nether/end/other 三种矿），再「氯化铱粉 →（PRC）污浊铱粉 →（富集）铱粉」 |
| `allthemodium_chain.js` | ATM 湿法链：矿 / 粗矿 → 粗ATM粉（4 条制粉 + 2 条粗矿烧炼 + 4 条矿石烧炼）→ 离心出 ATM金属粉 + 粗铂 / 粗铱 / 锇粉 → 氨浸与沉淀（PRC）→ 精制ATM粉 →（PRC）ATM粉。稳态产率 30%（20 粗粉 → 6 粉） |
| `netherite_dust_recipes.js` | 下界合金：禁 `alltheores:netherite_dust` 既有配方与残骸直烧、禁 7 条捷径；残骸 →（PRC）碎片粉 →（工作台）下界合金粉；融合机配方重建 |
| `hot_ingots.js` | 热锭体系（7 种：末影 / 信素 / 流明 / 秘银 / 下界合金 / ATM / 铂铱锇）：感应炉出热锭 → 致冷器冷却成锭。约定见下节 |
| `platinum_iridium_osmium_alloy.js` | 铂铱锇合金：粉（铂 + 铱 + 锇）、热锭 20000 RF、两条冷却；并把 `pink_slime_ingot` 的溶解室配方改为「1 蕴魔秘银锭 + 1 铂铱锇合金锭 + 500 mB 粉红史莱姆」 |
| `airtight_alloy_recipes.js` | 气密合金：板坯（压缩铁锭 / 粉史莱姆锭 / 压缩铁锭 竖排）→ 压印机 1 板坯 → 3 板，7200 RF |
| `mithril_parts_recipes.js` | 蕴魔秘银板 / 齿轮：照 Thermal 的锭 → 板（压印机）与齿轮（压印 + 模具）补齐 |

### 五、工业先锋（Industrial Foregoing）

| 脚本 | 内容 |
|---|---|
| `industrialforegoing_frames_gears.js` | 四张机器框架（pity / simple / advanced / supreme）44 条配方的齿轮换档：铁 → 信素、金 → 末影、钻石 → 蕴魔秘银；`machine_frame_simple` 溶解室改「2 流明锭 + 1000 mB 元始魔力」；4 条溶解室迁到 KubeJS Industrial Foregoing schema |
| `industrialforegoing_machine_frame_pity.js` | 简易机器框架：拆掉 `forge:conditional` 外壳按原 ID 重建，换掉其中的铁锭与红石块 |
| `industrialforegoing_ore_laser.js` | 矿石激光钻 21 条：粗矿产物全部换成矿石方块、补锌与磷灰石、新增 AllTheModium 三矿（权重 1）、铱权重降到 3、全部白名单补 `allthemodium:mining` |
| `disable_industrialforegoing_rubber.js` | 禁用 IF 橡胶链：流体提取机、乳胶处理机、小干橡胶、干橡胶，物品与配方一并封掉 |

### 六、气动工艺（PneumaticCraft）

| 脚本 | 内容 |
|---|---|
| `pneumaticcraft_material_swaps.js` | 52 条配方按 ID 删除后重建：强化石系列 → 气密合金板（18 条，产物仍是该系列的不动）、无色玻璃 → 黑曜石玻璃（7 处）、铜锭 → 信素锭（5 处）、红石粉 → 富集红石（24 条）、压力管道玻璃 → 气密合金板 |
| `pneumaticcraft_empty_pcb.js` | 空电路板：2 高级控制电路 + 1 富集金 + 1 塑料 → 2 空板（压力 1.5） |
| `pneumaticcraft_etching_acid.js` | 蚀刻酸桶：1 铜粉 + 1 液态氯桶 + 4 液态氨桶 → 1 蚀刻酸桶 + 4 空桶 |

### 七、应用能源（AE2）

| 脚本 | 内容 |
|---|---|
| `ae2_inscriber_processors.js` | 三种处理器刻印配方的中间格：红石粉 → 高级控制电路 |
| `ae2_material_replace.js` | 铁 → 钢锭、铜 → 灌注合金、红石 → 富集红石（含 `forge:*` 标签引用；处理器刻印三条由上一个脚本负责，此处跳过） |
| `disable_ae2_fluix_transform.js` | 禁用 `ae2:transform/fluix_crystal`（充能赛特斯 + 福鲁伊克斯粉浸水）；「充能赛特斯 + 红石 + 石英 → 2 个」保留 |
| `disable_ae2_sky_dust_inscriber.js` | 禁用天空粉尘在刻印机里的制作 |
| `certus_quartz_multiply.js` | 赛特斯石英增殖环：富集室「簇 → 3 水晶」、结晶器「2000 mB 水 + 1 水晶 → 1 簇」 |

### 八、其他模组

| 脚本 | 内容 |
|---|---|
| `pylons_towers_recipes.js` | 四座塔：中心换高级控制电路、铁栏杆换玻璃、磨制黑石换灌注合金 |
| `pylons_filters_recipes.js` | 三种过滤卡：青色陶瓦换高级控制电路、玻璃换透明塑料块 |
| `ars_nouveau_imbuement_recipes.js` | Ars Nouveau 灌注室 6 条自定义配方 |
| `smithing_template_alt_recipes.js` | 锻造模板替代配方（用材料方块代替模板本身，产出 2 → 1）：下界合金与 ATM 各一条 |

### 九、自注册内容

| 文件 | 内容 |
|---|---|
| `startup_scripts/custom_items.js` | 22 种物品：热锭 7（末影 / 信素 / 流明 / 秘银 / 下界合金 / ATM / 铂铱锇）、粉类 11（粗铂 / 粗铱 / 氯化铱 / 铂铱锇 / 下界合金碎片 / 粗 ATM / ATM 金属 / 含杂 ATM / 精制 ATM / 紫水晶 / 魔力粉基底）、气密合金 2（板坯 / 板）、其他 2（铂铱锇合金锭、共振魔源宝石） |
| `startup_scripts/tf_material_items.js` | 从 TF 1.12.2 移植的 16 种材料：秘银全套 5（锭 / 粉 / 粒 / 板 / 齿轮）、元素粉 5（炽焱 / 凛冰 / 层岩 / 清风 / 元始魔力）、晶体 3（末影 / 萤石 / 红石）、能源线圈 2（银 / 琥珀金）、红石伺服 1 |
| `startup_scripts/custom_fluids.js` | 4 种流体：熔融青金石、液态松香、硝酸、液态氨 |
| `startup_scripts/tf_fluids.js` | 5 种 TF 流体：清风 / 凛冰 / 层岩 / 炽焱 / 元始魔力 |
| `startup_scripts/custom_gases.js` | 4 种 Mekanism 气体：氨气、氮氧化物、气态硝酸、富ATM氨 |
| `client_scripts/custom_lang.js`、`tf_lang.js` | 上述全部自注册内容的中英译名；另补 AllTheOres 缺失的 6 条铱组译名 |
| `assets/minecraft/atlases/blocks.json` | 自加气体的图集声明（`ClientEvents.atlasSpriteRegistry` 在此版本是死事件，只能手写图集） |

### 十、配置

| 文件 | 内容 |
|---|---|
| `config/almostunified/unify.json` | `modPriorities` 重排，`alltheores` 提到第 2 位（与 `instantunify` 一致），解决同名齿轮反复转换 |
| `config/instantunify-common.toml` | `preferredMods` 与上面的列表逐项对齐 |
| `config/Mekanism/machine-usage.toml` | 数字采矿机基础耗能 1000 → 100 J/t（1/10） |
| `config/Mekanism/general.toml` | 数字采矿机挖掘时间 80 → 8 tick（1/10） |

> 注意：Mekanism 的 config 有被模组在启动时重写的现象，改完第一次启动后要回查数值是否还在。

---

## 关键约定与踩坑

**热锭配方（2026-11-22 起的统一规则）**

输入顺序固定为 **炽焱粉 → 被加热的粉 → 可选附加材料**：第一位永远是 `kubejs:dust_pyrotheum`，第二位是合金粉，第三位只在明确要求时才填（未说明就留空）。冷却沿用同一比例：水版耗能为烧制的 1/2，凛冰版为 1/20。早期四条（末影 / 信素 / 流明 / 秘银）仍是旧顺序，未回改。

**KubeJS 的几处硬约束**

- `event.remove` 的删除在新增之前统一应用；若某条配方在 `priority` 更高的脚本里被「重建清单」重新加入，删除就形同失效。
- `replaceInput` / `replaceOutput` 对自定义序列化器（`JsonRecipeJS`、`mekanism:mek_data`、`ae2:transform` 等）空转，必须 `remove` + `event.custom` 用**原 ID** 重建。
- 复合配料（ingredient 是 tag 数组）不吃 `replaceInput`，只能整条重建。
- 按 `{tag:...}` 写的输入，用物品 ID 扫描扫不到，要额外按标签名扫一遍。

**数据位置**

- Thermal 的配方不在 `thermal_foundation.jar` 顶层，而在内嵌的 `META-INF/jarjar/thermal_core-*.jar` 里，常规翻 jar 看不到。
- 扫描配方时要排除 `data/*/advancements/recipes/...`，路径里也含 `/recipes/`。

**注册表核对**

判断某物品是否存在，不能只看 `lang/zh_cn.json`。AllTheOres 2.2.4 就存在「有译名键、无物品」的情况（`dirty_iron_dust` / `dirty_gold_dust`），其污浊粉实际只有 11 种。正确查法是 `models/item/<id>.json`。

**其他**

- 齿轮改造只覆盖「材料同时存在 `forge:rods/<材料>` 与 `forge:plates/<材料>`」的配方，跳过 5 条（`emerald_gear`、`lapis_gear`、`netherite_gear`、`quartz_gear`、`rose_gold_gear`）。
- Rhino 不支持对象属性简写 `{ values }`，要写 `values: values`。
- 若报「配方大量缺失」，先看 `logs/kubejs/server.log` 的 `Error parsing recipe` 行，通常是物品 ID 打错或引用了尚未注册的自注册物品。

## 环境版本

```
Minecraft        1.20.1
Forge            47.x
KubeJS           2001.6.5-build.26
Thermal          11.0.x（foundation 11.0.6.70 / expansion 11.0.1.29 / integration 11.0.1.27 / dynamics 11.0.1.23）
CoFH Core        11.0.2.56
Mekanism         10.4.16.80（含 Additions / Generators / Tools）
AllTheOres       47.1.3-2.2.4
AllTheModium     47.1.25-2.5.8
Industrial Foregoing  3.5.22（+ KubeJS Industrial Foregoing）
PneumaticCraft   6.0.22
AE2              15.4.12
Ars Nouveau      4.12.7
Pylons           4.3.0
Almost Unified   0.11.0
Instant Unify    1.3.0
```

## 许可

脚本部分可自由取用、修改；`config/` 下的文件是各自模组的配置，版权归原模组作者。
