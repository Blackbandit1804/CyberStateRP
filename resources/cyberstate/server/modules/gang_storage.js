const StorageController = {
    minimal_summa: 1, // Минимальная сумма пополнения|снятия
    maximum_summa: 1000000, // Макисмальная сумма пополнения|снятия
    storages: [],
    max: [150, 3000, 3000],
    drugs: ["Марихуана", "МДМА", "Кокаин", "Метамфетамин"],
    ammo: ["Патроны 9mm", "Патроны 12mm", "Патроны 7.62mm", "Патроны 5.56mm"],
    ranks: ["Оружие доступно", "Наркотики доступны", "Боеприпасы доступны", "Управление доступно", "Деньги доступны"],
    weapons: {
      // [1] Холодное оружие
      65: {
          name: "Старинный кинжал",
          id: 0,
          params: {
              weaponHash: jhash("weapon_dagger"),
          },
      },
      41: {
          name: "Биту",
          id: 1,
          params: {
              weaponHash: jhash("weapon_bat"),
          },
      },
      66: {
          name: "Разбитую бутылку",
          id: 2,
          params: {
              weaponHash: jhash("weapon_bottle"),
          },
      },
      67: {
          name: "Лом",
          id: 3,
          params: {
              weaponHash: jhash("weapon_crowbar"),
          },
      },
      18: {
          name: "Фонарик",
          id: 4,
          params: {
              weaponHash: jhash("weapon_flashlight"),
          },
      },
      68: {
          name: "Клюшка",
          id: 5,
          params: {
              weaponHash: jhash("weapon_golfclub"),
          },
      },
      69: {
          name: "Молоток",
          id: 6,
          params: {
              weaponHash: jhash("weapon_hammer"),
          },
      },
      70: {
         name: "Топор",
         id: 7,
         params: {
             weaponHash: jhash("weapon_hatchet"),
         },
      },
      42: {
          name: "Кастет",
          id: 8,
          params: {
              weaponHash: jhash("weapon_knuckle"),
          },
      },
      43: {
          name: "Нож",
          id: 9,
          params: {
              weaponHash: jhash("weapon_knife"),
          },
      },
      71: {
          name: "Мачете",
          id: 10,
          params: {
              weaponHash: jhash("weapon_machete"),
          },
      },
      72: {
          name: "Складной нож",
          id: 11,
          params: {
              weaponHash: jhash("weapon_switchblade"),
          },
      },
      17: {
          name: "Полицейская дубинка",
          id: 12,
          params: {
              weaponHash: jhash("weapon_nightstick"),
          },
      },
      73: {
          name: "Гаечный ключ",
          id: 13,
          params: {
              weaponHash: jhash("weapon_wrench"),
          },
      },
      74: {
          name: "Боевой топор",
          id: 14,
          params: {
              weaponHash: jhash("weapon_battleaxe"),
          },
      },
      75: {
          name: "Кий",
          id: 15,
          params: {
              weaponHash: jhash("weapon_poolcue"),
          },
      },
      76: {
          name: "Каменный топор",
          id: 16,
          params: {
              weaponHash: jhash("weapon_stone_hatchet"),
          },
      },
      // [2] Пистолеты
      44: {
          name: "Pistol",
          id: 17,
          ammo: 37,
          params: {
              weaponHash: jhash("weapon_pistol"),
              ammo: 0
          },
      },
      77: {
          name: "Pistol Mk II",
          id: 18,
          params: {
              weaponHash: jhash("weapon_pistol_mk2"),
              ammo: 0
          },
      },
      20: {
          name: "Combat Pistol",
          id: 19,
          ammo: 37,
          params: {
              weaponHash: jhash("weapon_combatpistol"),
              ammo: 0
          },
      },
      45: {
          name: "AP Pistol",
          id: 20,
          ammo: 37,
          params: {
              weaponHash: jhash("weapon_appistol"),
              ammo: 0
          },
      },
      19: {
          name: "Stun Gun",
          id: 21,
          params: {
              weaponHash: jhash("weapon_stungun"),
          },
      },
      125: {
          name: "Pistol 50",
          id: 22,
          params: {
              weaponHash: jhash("weapon_pistol50"),
              ammo: 0
          },
      },
      78: {
          name: "SNS Pistol",
          id: 23,
          params: {
              weaponHash: jhash("weapon_snspistol"),
              ammo: 0
          },
      },
      79: {
          name: "SNS Pistol Mk II",
          id: 24,
          params: {
              weaponHash: jhash("weapon_snspistol_mk2"),
          },
      },
      80: {
          name: "Heavy Pistol",
          id: 25,
          params: {
              weaponHash: jhash("weapon_heavypistol"),
              ammo: 0
          },
      },
      81: {
          name: "Vintage Pistol",
          id: 26,
          params: {
              weaponHash: jhash("weapon_vintagepistol"),
              ammo: 0
          },
      },
      82: {
          name: "Flare Gun",
          id: 27,
          params: {
              weaponHash: jhash("weapon_flaregun"),
              ammo: 0
          },
      },
      83: {
          name: "Marksman Pistol",
          id: 28,
          params: {
              weaponHash: jhash("weapon_marksmanpistol"),
              ammo: 0
          },
      },
      46: {
          name: "Heavy Revolver",
          id: 29,
          ammo: 37,
          params: {
              weaponHash: jhash("weapon_revolver"),
              ammo: 0
          },
      },
      84: {
          name: "Heavy Revolver Mk II",
          id: 30,
          params: {
              weaponHash: jhash("weapon_revolver_mk2"),
              ammo: 0
          },
      },
      85: {
          name: "Double Action Revolver",
          id: 31,
          params: {
              weaponHash: jhash("weapon_doubleaction"),
              ammo: 0
          },
      },
      // [3] Пистолеты-пулеметы
      47: {
          name: "Micro SMG",
          id: 32,
          ammo: 37,
          params: {
              weaponHash: jhash("weapon_microsmg"),
              ammo: 0
          },
      },
      48: {
          name: "SMG",
          id: 33,
          ammo: 37,
          params: {
              weaponHash: jhash("weapon_smg"),
              ammo: 0
          },
      },
      86: {
          name: "SMG Mk II",
          id: 34,
          params: {
              weaponHash: jhash("weapon_smg_mk2"),
              ammo: 0
          },
      },
      87: {
          name: "Assault SMG",
          id: 35,
          params: {
              weaponHash: jhash("weapon_assaultsmg"),
              ammo: 0
          },
      },
      88: {
          name: "Combat PDW",
          id: 36,
          params: {
              weaponHash: jhash("weapon_combatpdw"),
              ammo: 0
          },
      },
      89: {
          name: "Machine Pistol",
          id: 37,
          params: {
              weaponHash: jhash("weapon_machinepistol"),
              ammo: 0
          },
      },
      90: {
          name: "Mini SMG",
          id: 38,
          params: {
              weaponHash: jhash("weapon_minismg"),
              ammo: 0
          },
      },
      // [4] Ружья
      21: {
          name: "Pump Shotgun",
          id: 39,
          ammo: 38,
          params: {
              weaponHash: jhash("weapon_pumpshotgun"),
              ammo: 0
          },
      },
      91: {
          name: "Pump Shotgun Mk II",
          id: 40,
          params: {
              weaponHash: jhash("weapon_pumpshotgun_mk2"),
              ammo: 0
          },
      },
      49: {
          name: "Sawed-Off Shotgun",
          id: 41,
          ammo: 38,
          params: {
              weaponHash: jhash("weapon_sawnoffshotgun"),
              ammo: 0
          },
      },
      92: {
          name: "Assault Shotgun",
          id: 42,
          params: {
              weaponHash: jhash("weapon_assaultshotgun"),
              ammo: 0

          },
      },
      93: {
          name: "Bullpup Shotgun",
          id: 43,
          params: {
              weaponHash: jhash("weapon_bullpupshotgun"),
              ammo: 0
          },
      },
      94: {
          name: "Musket",
          id: 44,
          params: {
              weaponHash: jhash("weapon_musket"),
              ammo: 0
          },
      },
      95: {
          name: "Heavy Shotgun",
          id: 45,
          params: {
              weaponHash: jhash("weapon_heavyshotgun"),
              ammo: 0
          },
      },
      96: {
          name: "Double Barrel Shotgun",
          id: 46,
          params: {
              weaponHash: jhash("weapon_dbshotgun"),
              ammo: 0
          },
      },
      97: {
          name: "Sweeper Shotgun",
          id: 47,
          params: {
              weaponHash: jhash("weapon_autoshotgun"),
              ammo: 0
          },
      },
      // [5] Штурмовые винтовки
      50: {
          name: "Assault Rifle",
          id: 48,
          ammo: 39,
          params: {
              weaponHash: jhash("weapon_assaultrifle"),
              ammo: 0
          },
      },
      98: {
          name: "Assault Rifle Mk II",
          id: 49,
          params: {
              weaponHash: jhash("weapon_assaultrifle_mk2"),
              ammo: 0
          },
      },
      22: {
          name: "Carbine Rifle",
          id: 50,
          ammo: 40,
          params: {
              weaponHash: jhash("weapon_carbinerifle"),
              ammo: 0
          },
      },
      99: {
          name: "Carbine Rifle Mk II",
          id: 51,
          params: {
              weaponHash: jhash("weapon_carbinerifle_mk2"),
              ammo: 0
          },
      },
      100: {
          name: "Advanced Rifle",
          id: 52,
          params: {
              weaponHash: jhash("weapon_advancedrifle"),
              ammo: 0
          },
      },
      101: {
          name: "Special Carbine",
          id: 53,
          params: {
              weaponHash: jhash("weapon_specialcarbine"),
              ammo: 0
          },
      },
      102: {
          name: "Special Carbine Mk II",
          id: 54,
          params: {
              weaponHash: jhash("weapon_specialcarbine_mk2"),
              ammo: 0
          },
      },
      51: {
          name: "Bullpup Rifle",
          id: 55,
          ammo: 40,
          params: {
              weaponHash: jhash("weapon_bullpuprifle_mk2"),
              ammo: 0
          },
      },
      103: {
          name: "Bullpup Rifle Mk II",
          id: 56,
          params: {
              weaponHash: jhash("weapon_bullpuprifle_mk2"),
              ammo: 0
          },
      },
      52: {
          name: "Compact Rifle",
          id: 57,
          ammo: 39,
          params: {
              weaponHash: jhash("weapon_compactrifle"),
              ammo: 0
          },
      },
      // [6] Легкие пулеметы
      53: {
          name: "MG",
          id: 58,
          ammo: 39,
          params: {
              weaponHash: jhash("weapon_mg"),
              ammo: 0
          },
      },
      104: {
          name: "Combat MG",
          id: 59,
          params: {
              weaponHash: jhash("weapon_combatmg"),
              ammo: 0
          },
      },
      105: {
          name: "Combat MG Mk II",
          id: 60,
          params: {
              weaponHash: jhash("weapon_combatmg_mk2"),
              ammo: 0
          },
      },
      106: {
          name: "Gusenberg Sweeper",
          id: 61,
          params: {
              weaponHash: jhash("weapon_gusenberg"),
              ammo: 0
          },
      },
      // [7] Снайперские винтовки
      23: {
          name: "Sniper Rifle",
          id: 62,
          ammo: 39,
          params: {
              weaponHash: jhash("weapon_sniperrifle"),
              ammo: 0
          },
      },
      107: {
          name: "Heavy Sniper",
          id: 63,
          params: {
              weaponHash: jhash("weapon_heavysniper"),
              ammo: 0
          },
      },
      108: {
          name: "Heavy Sniper Mk II",
          id: 64,
          params: {
              weaponHash: jhash("weapon_heavysniper_mk2"),
              ammo: 0
          },
      },
      109: {
          name: "Marksman Rifle",
          id: 65,
          params: {
              weaponHash: jhash("weapon_marksmanrifle"),
              ammo: 0
          },
      },
      110: {
          name: "Marksman Rifle Mk II",
          id: 66,
          params: {
              weaponHash: jhash("weapon_marksmanrifle_mk2"),
              ammo: 0
          },
      },
      // [8] Тяжелое оружие
      111: {
          name: "RPG",
          id: 67,
          params: {
              weaponHash: jhash("weapon_rpg"),
              ammo: 0
          },
      },
      112: {
          name: "Grenade Launcher",
          id: 68,
          params: {
              weaponHash: jhash("weapon_grenadelauncher"),
              ammo: 0
          },
      },
      113: {
          name: "Minigun",
          id: 69,
          params: {
              weaponHash: jhash("weapon_minigun"),
              ammo: 0
          },
      },
      114: {
          name: "Firework Launcher",
          id: 70,
          params: {
              weaponHash: jhash("weapon_firework"),
              ammo: 0
          },
      },
      115: {
          name: "Railgun",
          id: 71,
          params: {
              weaponHash: jhash("weapon_railgun"),
              ammo: 0
          },
      },
      116: {
          name: "Homing Launcher",
          id: 72,
          params: {
              weaponHash: jhash("weapon_hominglauncher"),
              ammo: 0
          },
      },
      117: {
          name: "Compact Grenade",
          id: 73,
          params: {
              weaponHash: jhash("weapon_compactlauncher"),
              ammo: 0
          },
      },
      // [9] Метательное оружие
      118: {
          name: "Осколочную гранату",
          id: 74,
          params: {
              weaponHash: jhash("weapon_grenade"),
          },
      },
      119: {
          name: "Газовую гранату",
          id: 75,
          params: {
              weaponHash: jhash("weapon_bzgas"),
          },
      },
      120: {
          name: "Коктейль молотова",
          id: 76,
          params: {
              weaponHash: jhash("weapon_molotov"),
          },
      },
      121: {
          name: "Дымовую гранату",
          id: 77,
          params: {
              weaponHash: jhash("weapon_smokegrenade"),
          },
      },
      122: {
          name: "Сигнальную гранату",
          id: 78,
          params: {
              weaponHash: jhash("weapon_flare"),
          },
      },
      // [10] Разное
      123: {
          name: "Парашют",
          id: 79,
          params: {
              weaponHash: jhash("gadget_parachute"),
          },
      },
      124: {
          name: "Огнетушитель",
          id: 80,
          params: {
              weaponHash: jhash("weapon_fireextinguisher"),
              ammo: 0
          },
      },
    },
    functions: {
      getStorage(id) {
        for (let i = 0; i < StorageController.storages.length; i++) if (StorageController.storages[i].id == id) return StorageController.storages[i];
      },
      inGetStorage(id) {
        for (let i = 0; i < StorageController.storages.length; i++) if (StorageController.storages[i].faction == id) return StorageController.storages[i];
      },
      putBalanceMoney(player, money) {
        if (money < StorageController.minimal_summa) {
          player.utils.error("Минимальная сумма пополнения $" + StorageController.minimal_summa);
          return;
        }

        if (money > StorageController.maximum_summa) {
          player.utils.error("Максимальная сумма пополнения $" + StorageController.maximum_summa);
          return;
        }

        if (player.money < money) {
          player.utils.error("У вас недостаточно денег!");
          return;
        }

        if (!player.gangId) return player.utils.error("Вы слишком далеко от склада!");
        let storage = StorageController.functions.getStorage(player.gangId);
        if (storage.faction != player.faction) return player.utils.error("Вы не можете использовать данный склад!");
        //if (player.rank < alt.factionRanks[player.faction].length - 1) return player.utils.error(`Вы не лидер!`);

        player.utils.setMoney(player.money - money);
        storage.setBalance(storage.balance + money);
        player.utils.success(`Вы пополнили сейф на $${money}`);
        alt.emitClient(player, "modal.hide");
      },
      takeBalanceMoney(player, money) {
        if (money < StorageController.minimal_summa) {
          player.utils.error("Минимальная сумма пополнения $" + StorageController.minimal_summa);
          return;
        }

        if (money > StorageController.maximum_summa) {
          player.utils.error("Максимальная сумма пополнения $" + StorageController.maximum_summa);
          return;
        }

        if (!player.gangId) return player.utils.error("Вы слишком далеко от склада!");
        let storage = StorageController.functions.getStorage(player.gangId);
        if (storage.faction != player.faction) return player.utils.error("Вы не можете использовать данный склад!");
        if (storage.money_rank > player.rank) return player.utils.error(`Деньги доступны с ${storage.money_rank} ранга!`);
        if (storage.balance < money) return player.utils.error("В сейфе недостаточно денег!");

        player.utils.setMoney(player.money + money);
        storage.setBalance(storage.balance - money);
        player.utils.error(`Вы сняли с сейфа $${money}`);
        alt.emitClient(player, "modal.hide");
      },
      putDrugs(player, count, id) {
        if (!player.gangId) return player.utils.error("Вы слишком далеко от склада!");
        let storage = StorageController.functions.getStorage(player.gangId);
        if (storage.faction != player.faction) return player.utils.error("Вы не можете использовать данный склад!");
        if (storage.isLock(player)) return player.utils.error("Склад закрыт!");
        if (count <= 0) return player.utils.error(`Неверный формат!`);
        let items = player.inventory.getArrayByItemId(id + 55);
        alt.emitClient(player, "modal.hide");
        let max = 0;
        for (let i = 0; i < storage.drugs.length; i++) max += storage.drugs[i];
        if (max + count > StorageController.max[1]) return player.utils.error("Недостаточно места на складе!");
        let icount = 0;
        for (let key in items) {
          let drug = items[key];
          if (drug.params.count == count) {
            player.inventory.delete(drug.id, (e) => {
                if (e) return player.utils.error(e);
                storage.setDrugs(id, storage.drugs[id] + count);
                player.utils.success(`Вы положили ${StorageController.drugs[id]} - ${count}г.`);
            });
            return;
          } else if (drug.params.count > count) {
            drug.params.count -= count;
            player.inventory.updateParams(drug.id, drug);
            storage.setDrugs(id, storage.drugs[id] + count);
            player.utils.success(`Вы положили ${StorageController.drugs[id]} - ${count}г.`);
            return;
          }
          icount += drug.params.count;
        }

        player.utils.error(`У вас недостаточно наркотиков${icount >= count ? ", соедините все наркотики в инвентаре!" : "!"}`);
      },
      takeDrugs(player, count, id) {
        if (!player.gangId) return player.utils.error("Вы слишком далеко от склада!");
        let storage = StorageController.functions.getStorage(player.gangId);
        if (storage.faction != player.faction) return player.utils.error("Вы не можете использовать данный склад!");
        if (storage.drugs_rank > player.rank) return player.utils.error(`Наркотики доступны с ${storage.drugs_rank} ранга!`);
        if (storage.isLock(player)) return player.utils.error("Склад закрыт!");
        if (count <= 0) return player.utils.error(`Неверный формат!`);
        if (storage.drugs[id] < count) return player.utils.error(`На складе недостаточно наркотиков!`);
        player.inventory.add(id + 55, { count: count }, {}, (e) => {
            if (e) return player.utils.error(e);
            storage.setDrugs(id, storage.drugs[id] - count);
            player.utils.success(`Вы взяли ${StorageController.drugs[id]} - ${count}г.`);
        });
        alt.emitClient(player, "modal.hide");
      },
      putWeapons(player, id) {
        if (!player.gangId) return player.utils.error("Вы слишком далеко от склада!");
        let storage = StorageController.functions.getStorage(player.gangId);
        if (storage.faction != player.faction) return player.utils.error("Вы не можете использовать данный склад!");
        if (storage.isLock(player)) return player.utils.error("Склад закрыт!");
        let items = player.inventory.getArrayByItemId(id);
        alt.emitClient(player, "modal.hide");
        let max = 0;
        for (let i = 0; i < storage.weapons.length; i++) max += storage.weapons[i];
        if (++max > StorageController.max[0]) return player.utils.error("Недостаточно места на складе!");
        let weapon = StorageController.weapons[id];
        if (!weapon) return player.utils.error("Оружие не найдено!");
        for (let key in items) {
          player.inventory.delete(items[key].id, (e) => {
              if (e) return player.utils.error(e);
              storage.setWeapons(weapon.id, ++storage.weapons[weapon.id]);
              player.utils.success(`Вы положили ${weapon.name}.`);
              if (items[key].params.ammo > 0) {
                if (weapon.ammo) {
                   let id_new = weapon.ammo - 37;
                   storage.setAmmo(id_new, storage.ammo[id_new] + items[key].params.ammo);
                   player.utils.success(`На складе пополнены боеприпасы: ${StorageController.ammo[id_new]} - ${items[key].params.ammo}пт.`);
                }
              }
          });
          return;
        }
        player.utils.error(`У вас нет данного оружия!`);
      },
      takeWeapons(player, id) {
        if (!player.gangId) return player.utils.error("Вы слишком далеко от склада!");
        let storage = StorageController.functions.getStorage(player.gangId);
        if (storage.faction != player.faction) return player.utils.error("Вы не можете использовать данный склад!");
        if (storage.weapon_rank > player.rank) return player.utils.error(`Оружие доступно с ${storage.weapon_rank} ранга!`);
        if (storage.isLock(player)) return player.utils.error("Склад закрыт!");
        let weapon = StorageController.weapons[id];
        weapon.params.ammo = 0;
        if (!weapon) return player.utils.error("Оружие не найдено!");
        if (storage.weapons[weapon.id] < 1) return player.utils.error(`На складе недостаточно оружия данного типа!`);
        player.inventory.add(id, weapon.params, {}, (e) => {
            if (e) return player.utils.error(e);
            storage.setWeapons(weapon.id, --storage.weapons[weapon.id]);
            player.utils.success(`Вы взяли ${weapon.name}.`);
        });
      },
      putAmmo(player, count, id) {
        if (!player.gangId) return player.utils.error("Вы слишком далеко от склада!");
        let storage = StorageController.functions.getStorage(player.gangId);
        if (storage.faction != player.faction) return player.utils.error("Вы не можете использовать данный склад!");
        if (storage.isLock(player)) return player.utils.error("Склад закрыт!");
        if (count <= 0) return player.utils.error(`Неверный формат!`);
        let items = player.inventory.getArrayByItemId(id + 37);
        let icount = 0;
        alt.emitClient(player, "modal.hide");
        let max = 0;
        for (let i = 0; i < storage.ammo.length; i++) max += storage.ammo[i];
        if (max + count > StorageController.max[2]) return player.utils.error("Недостаточно места на складе!");
        for (let key in items) {
          let drug = items[key];
          if (drug.params.ammo == count) {
            player.inventory.delete(drug.id, (e) => {
                if (e) return player.utils.error(e);
                storage.setAmmo(id, storage.ammo[id] + count);
                player.utils.success(`Вы положили ${StorageController.ammo[id]} - ${count}пт.`);
            });
            return;
          } else if (drug.params.ammo > count) {
            drug.params.ammo -= count;
            player.inventory.updateParams(drug.id, drug);
            storage.setAmmo(id, storage.ammo[id] + count);
            player.utils.success(`Вы положили ${StorageController.ammo[id]} - ${count}пт.`);
            return;
          }
          icount += drug.params.ammo;
        }

        player.utils.error(`У вас недостаточно боеприпасов${icount >= count ? ", соедините все боеприпасы в инвентаре!" : "!"}`);
      },
      takeAmmo(player, count, id) {
        if (!player.gangId) return player.utils.error("Вы слишком далеко от склада!");
        let storage = StorageController.functions.getStorage(player.gangId);
        if (storage.faction != player.faction) return player.utils.error("Вы не можете использовать данный склад!");
        if (storage.ammo_rank > player.rank) return player.utils.error(`Боеприпасы доступны с ${storage.ammo_rank} ранга!`);
        if (storage.isLock(player)) return player.utils.error("Склад закрыт!");
        if (count <= 0) return player.utils.error(`Неверный формат!`);
        if (storage.ammo[id] < count) return player.utils.error(`На складе недостаточно боеприпасов!`);
        player.inventory.add(id + 37, { ammo: count }, {}, (e) => {
            if (e) return player.utils.error(e);
            storage.setAmmo(id, storage.ammo[id] - count);
            player.utils.success(`Вы взяли ${StorageController.ammo[id]} - ${count}пт.`);
        });
        alt.emitClient(player, "modal.hide");
      },
      setLock(player) {
        if (!player.gangId) return player.utils.error("Вы слишком далеко от склада!");
        let storage = StorageController.functions.getStorage(player.gangId);
        if (storage.faction != player.faction) return player.utils.error("Вы не можете использовать данный склад!");
        // if (player.rank < alt.factionRanks[player.faction].length - 1) return player.utils.error(`Вы не лидер!`);

        if (storage.block != 0) {
            player.utils.success("Вы открыли склад!");
            storage.setBlock(false);
        } else {
            player.utils.error("Вы закрыли склад!");
            storage.setBlock(true);
        }
      },
      setAllow(player, id, rank) {
        if (!player.gangId) return player.utils.error("Вы слишком далеко от склада!");
        let storage = StorageController.functions.getStorage(player.gangId);
        if (storage.faction != player.faction) return player.utils.error("Вы не можете использовать данный склад!");
        let leadrank = alt.factionRanks[player.faction].length - 1;
        if (player.rank < leadrank) return player.utils.error(`Вы не лидер!`);
        if (rank < 1 || rank > leadrank) return player.utils.error(`Ранги: от 1 до ${leadrank}`);
        alt.emitClient(player, "modal.hide");
        player.utils.success(`${StorageController.ranks[id]} с ${rank} ранга!`);
        storage.setAllow(id, rank);
      },
      getPlayerDrugs(player) {
        let items = player.inventory.getArrayByItemId([55,56,57,58]);
        let args = [0, 0, 0, 0];
        for (let key in items) {
          let drug = items[key];
          let index = drug.itemId - 55;
          args[index] += drug.params.count;
        }
        return args;
      },
      getPlayerAmmo(player) {
        let items = player.inventory.getArrayByItemId([37,38,39,40]);
        let args = [0, 0, 0, 0];
        for (let key in items) {
          let ammo = items[key];
          let index = ammo.itemId - 37;
          args[index] += ammo.params.ammo;
        }
        return args;
      },
      getPlayerWeapons(player) {
        let items = player.inventory.getArrayWeapons();
        let args = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (let key in items) {
           let weapon = items[key];
           let index = StorageController.weapons[weapon.itemId].id;
           args[index]++;
        }
        return args;
      }
    }
}
module.exports = {
    StorageController,
    Init: () => {
        DB.Query("SELECT * FROM gang_storage", (e, result) => {
            for (let i = 0; i < result.length; i++) {
              let storage = new GangStorage(result[i].id, result[i].balance, alt.factions.getBySqlId(result[i].faction).warehouse.colshape, result[i].block, result[i].weapon_rank, result[i].ammo_rank, result[i].balance_rank, result[i].drugs_rank, result[i].storage_rank, result[i].money_rank, JSON.parse(result[i].drugs), JSON.parse(result[i].ammo), JSON.parse(result[i].weapons), result[i].faction);
              StorageController.storages.push(storage);
            }
            alt.log(`[Банды] Загружено ${StorageController.storages.length} складов`);
        });
    }
}
class GangStorage {
    constructor(id, balance, colshape, block, weapon_rank, ammo_rank, balance_rank, drugs_rank, storage_rank, money_rank, drugs, ammo, weapons, faction) {
        this.id = id;
        this.balance = balance;
        this.colshape = colshape;
        colshape.gangId = id;
        this.block = block;
        this.weapon_rank = weapon_rank;
        this.ammo_rank = ammo_rank;
        this.balance_rank = balance_rank;
        this.drugs_rank = drugs_rank;
        this.storage_rank = storage_rank;
        this.money_rank = money_rank;
        this.drugs = drugs;
        this.ammo = ammo;
        this.weapons = weapons;
        this.faction = faction;
    }

    setBalance(balance) {
      this.balance = balance;
      DB.Query(`UPDATE gang_storage SET balance=? WHERE id=?`, [balance, this.id]);
    }
    setDrugs(id, drugs) {
      this.drugs[id] = drugs;
      DB.Query(`UPDATE gang_storage SET drugs=? WHERE id=?`, [JSON.stringify(this.drugs), this.id]);
    }
    setAmmo(id, ammo) {
      this.ammo[id] = ammo;
      DB.Query(`UPDATE gang_storage SET ammo=? WHERE id=?`, [JSON.stringify(this.ammo), this.id]);
    }
    setWeapons(id, weapons) {
      this.weapons[id] = weapons;
      DB.Query(`UPDATE gang_storage SET weapons=? WHERE id=?`, [JSON.stringify(this.weapons), this.id]);
    }
    setBlock(status) {
      this.block = status;
      DB.Query(`UPDATE gang_storage SET block=? WHERE id=?`, [status, this.id]);
    }
    setAllow(id, rank) {
      switch (id) {
        case 0:
          this.weapon_rank = rank;
          DB.Query(`UPDATE gang_storage SET weapon_rank=? WHERE id=?`, [rank, this.id]);
          break;
        case 1:
          this.drugs_rank = rank;
          DB.Query(`UPDATE gang_storage SET drugs_rank=? WHERE id=?`, [rank, this.id]);
          break;
        case 2:
          this.ammo_rank = rank;
          DB.Query(`UPDATE gang_storage SET ammo_rank=? WHERE id=?`, [rank, this.id]);
          break;
        case 3:
          this.storage_rank = rank;
          DB.Query(`UPDATE gang_storage SET storage_rank=? WHERE id=?`, [rank, this.id]);
          break;
        case 4:
          this.money_rank = rank;
          DB.Query(`UPDATE gang_storage SET money_rank=? WHERE id=?`, [rank, this.id]);
          break;
      }
    }

    isLock(player) {
      if (this.block != 0) if (player.rank < this.storage_rank) return true; // !player.gangId || player.faction != this.faction
      else return false;
    }
}

alt.onClient("gang.take.money", (player, money) => {
   StorageController.functions.takeBalanceMoney(player, money);
});
alt.onClient("gang.put.money", (player, money) => {
   StorageController.functions.putBalanceMoney(player, money);
});
alt.onClient("gang.take.drugs", (player, count, id) => {
   StorageController.functions.takeDrugs(player, count, id);
});
alt.onClient("gang.put.drugs", (player, count, id) => {
   StorageController.functions.putDrugs(player, count, id);
});
alt.onClient("gang.take.ammo", (player, count, id) => {
   StorageController.functions.takeAmmo(player, count, id);
});
alt.onClient("gang.put.ammo", (player, count, id) => {
   StorageController.functions.putAmmo(player, count, id);
});
alt.onClient("gang.take.weapons", (player, id) => {
   StorageController.functions.takeWeapons(player, id);
});
alt.onClient("gang.put.weapons", (player, id) => {
   StorageController.functions.putWeapons(player, id);
});
alt.onClient("gang.set.lock", (player) => {
   StorageController.functions.setLock(player);
});
alt.onClient("gang.control.allow", (player, id, count) => {
   StorageController.functions.setAllow(player, id, count);
});