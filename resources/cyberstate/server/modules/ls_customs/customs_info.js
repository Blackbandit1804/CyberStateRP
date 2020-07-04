const customsInfo = {
	places: [
		{ // 0
			waypointRecord: "carmod_01_intro",
			door: { model: -550347177, position: new alt.Vector3(-1145.898, -1991.144, 14.18357) },
			angledArea: {
				origin: new alt.Vector3(-1138.812, -1991.065, 12.1663),
				edge: new alt.Vector3(-1145.784, -1983.836, 16.16096),
				angle: 13.125,
				headingBound: [ 134.3411, 90 ]
			},
			enterPosition: new alt.Vector3(-1147.314, -1992.434, 12.1803),
			startVehInfo: {
				position: new alt.Vector3(-1148.276, -1994.007, 12.1803),
				heading: 135.1723
			},
			exitVehInfo: [
				{ position: new alt.Vector3(-1141.3168, -1986.4746, 12.7496), heading: 315.0128 },
				{ position: new alt.Vector3(-1129.8910, -1975.8311, 12.7469), heading: 269.5273 },
				{ position: new alt.Vector3(-1133.1935, -1994.3329, 12.7536), heading: 314.0168 },
				{ position: new alt.Vector3(-1123.9664, -1987.2574, 12.7509), heading: 314.8069 },
				{ position: new alt.Vector3(-1122.7488, -2005.7106, 12.7626), heading: 225.7873 }
			],
			startCamParams: {
				from: {
					position: new alt.Vector3(-1155.424, -2018.87, 13.03204),
					rotation: new alt.Vector3(1.669779, 0.017783, -0.949821),
					fov: 42.5,
					duration: 0,
					unk: 1
				},
				to: {
					position: new alt.Vector3(-1156.688, -2016.962, 13.0895),
					rotation: new alt.Vector3(2.467418, 0.017783, 7.845163),
					fov: 42.5,
					duration: 6250,
					unk: 0
				}
			},
			lampObj: { model: 0x51CA161F, position: new alt.Vector3(-1158.845, -2005.97, 13.66), rotation: new alt.Vector3(0, 0, 112.32) }
		},
		{ // 2
			waypointRecord: "carmod_06_intro",
			door: { model: -550347177, position: new alt.Vector3(-356.0905, -134.7714, 40.01295) },
			angledArea: {
				origin: new alt.Vector3(-357.7921, -129.7133, 37.67917),
				edge: new alt.Vector3(-360.7289, -137.6424, 41.67917),
				angle: 10.75,
				headingBound: [ 253.8394, 90 ]
			},
			enterPosition: new alt.Vector3(-354.5272, -135.4011, 38.185),
			startVehInfo: {
				position: new alt.Vector3(-351.2211, -136.5706, 39.0096),
				heading: 250.6349
			},
			exitVehInfo: [
				{ position: new alt.Vector3(-362.4390, -132.6477, 38.2728), heading: 71.3717 },
				{ position: new alt.Vector3(-364.0660, -137.0169, 38.2686), heading: 70.8664 },
				{ position: new alt.Vector3(-360.4952, -128.0338, 38.2805), heading: 70.8251 },
				{ position: new alt.Vector3(-365.6716, -113.8504, 38.2814), heading: 71.5006 },
				{ position: new alt.Vector3(-376.4722, -110.2156, 38.2809), heading: 70.4458 }
			],
			startCamParams: {
				from: {
					position: new alt.Vector3(-326.9433, -131.7547, 38.85204),
					rotation: new alt.Vector3(2.894465, -0.056487, -246.1757),
					fov: 42.5,
					duration: 0,
					unk: 1
				},
				to: {
					position: new alt.Vector3(-328.146, -133.7019, 38.9095),
					rotation: new alt.Vector3(4.065939, -0.056487, -237.3808),
					fov: 42.5,
					duration: 6250,
					unk: 0
				}
			},
			lampObj: { model: 0x51CA161F, position: new alt.Vector3(-339.113, -140.087, 39.49), rotation: new alt.Vector3(0, 0, -132.906) }
		}
	],
	currentPlace: -1,
	horns: [
		[ // Стандарт
			{ label: "Стандартный клаксон", value: -1, duration: 1960 },
			{ label: "Клаксон грузовика", value: 0, duration: 1000 },
			{ label: "Полицейский клаксон", value: 1, duration: 1000 },
			{ label: "Клоунский клаксон", value: 2, duration: 1000 },
			{ label: "Клаксон 1", value: 52, duration: 1000 },
			{ label: "Клаксон 2", value: 54, duration: 1000 },
			{ label: "Клаксон 3", value: 56, duration: 1000 }
		],
		[ // Музыкальные
			{ label: "Джаз-клаксон 1", value: 24, duration: 2000 },
			{ label: "Джаз-клаксон 2", value: 25, duration: 2000 },
			{ label: "Джаз-клаксон 3", value: 26, duration: 1500 },
			{ label: "Нота - До", value: 16, duration: 1000 },
			{ label: "Нота - Ре", value: 17, duration: 1000 },
			{ label: "Нота - Ми", value: 18, duration: 1000 },
			{ label: "Нота - Фа", value: 19, duration: 1000 },
			{ label: "Нота - Соль", value: 20, duration: 1000 },
			{ label: "Нота - Ля", value: 21, duration: 1000 },
			{ label: "Нота - Си", value: 22, duration: 1000 },
			{ label: "Нота - До (Выс.)", value: 23, duration: 1000 },
			{ label: "Классический клаксон 1", value: 9, duration: 5500 },
			{ label: "Классический клаксон 2", value: 10, duration: 5500 },
			{ label: "Классический клаксон 3", value: 11, duration: 5500 },
			{ label: "Классический клаксон 4", value: 12, duration: 4500 },
			{ label: "Классический клаксон 5", value: 13, duration: 4500 },
			{ label: "Классический клаксон 6", value: 14, duration: 4500 },
			{ label: "Классический клаксон 7", value: 15, duration: 4500 },
			{ label: "Классический клаксон 8", value: 33, duration: 4000 },
			{ label: "Музыкальный клаксон 1", value: 3, duration: 3500 },
			{ label: "Музыкальный клаксон 2", value: 4, duration: 5500 },
			{ label: "Музыкальный клаксон 3", value: 5, duration: 4500 },
			{ label: "Музыкальный клаксон 4", value: 6, duration: 4500 },
			{ label: "Музыкальный клаксон 5", value: 7, duration: 4500 },
			{ label: "Печальная труба", value: 8, duration: 4500 }
		],
		[ // С повтором
			{ label: "Джаз-клаксон (повтор)", value: 27, duration: 2500 },
			{ label: "Классический 1 (повтор)", value: 32, duration: 2500 },
			{ label: "Классический 2 (повтор)", value: 34, duration: 5000 },
			{ label: "Сан-Андреас (повтор)", value: 42, duration: 5500 },
			{ label: "Либерти-Сити (повтор)", value: 44, duration: 9500 },
		]
	],
	colors: [
		[ // Хромированный
			{ text: "CHROME", color: 120 }
		],
		[ // Классик
			{ text: "CHOCOLATE_BROWN", color: 96 },
			{ text: "ULTRA_BLUE", color: 70 },
			{ text: "RACING_GREEN", color: 50 },
			{ text: "RACE_YELLOW", color: 89 },
			{ text: "ORANGE", color: 38 },
			{ text: "WHITE", color: 111 },
			{ text: "BLACK", color: 0 },
			{ text: "BLACK_GRAPHITE", color: 147 },
			{ text: "GRAPHITE", color: 1 },
			{ text: "ANTHR_BLACK", color: 11 },
			{ text: "BLACK_STEEL", color: 2 },
			{ text: "DARK_SILVER", color: 3 },
			{ text: "SILVER", color: 4 },
			{ text: "BLUE_SILVER", color: 5 },
			{ text: "ROLLED_STEEL", color: 6 },
			{ text: "SHADOW_SILVER", color: 7 },
			{ text: "STONE_SILVER", color: 8 },
			{ text: "MIDNIGHT_SILVER", color: 9 },
			{ text: "CAST_IRON_SIL", color: 10 },
			{ text: "RED", color: 27 },
			{ text: "TORINO_RED", color: 28 },
			{ text: "FORMULA_RED", color: 29 },
			{ text: "LAVA_RED", color: 150 },
			{ text: "BLAZE_RED", color: 30 },
			{ text: "GRACE_RED", color: 31 },
			{ text: "GARNET_RED", color: 32 },
			{ text: "SUNSET_RED", color: 33 },
			{ text: "CABERNET_RED", color: 34 },
			{ text: "WINE_RED", color: 143 },
			{ text: "CANDY_RED", color: 35 },
			{ text: "HOT PINK", color: 135 },
			{ text: "PINK", color: 137 },
			{ text: "SALMON_PINK", color: 136 },
			{ text: "SUNRISE_ORANGE", color: 36 },
			{ text: "BRIGHT_ORANGE", color: 138 },
			{ text: "GOLD", color: 99 },
			{ text: "BRONZE", color: 90 },
			{ text: "YELLOW", color: 88 },
			{ text: "FLUR_YELLOW", color: 91 },
			{ text: "DARK_GREEN", color: 49 },
			{ text: "SEA_GREEN", color: 51 },
			{ text: "OLIVE_GREEN", color: 52 },
			{ text: "BRIGHT_GREEN", color: 53 },
			{ text: "PETROL_GREEN", color: 54 },
			{ text: "LIME_GREEN", color: 92 },
			{ text: "MIDNIGHT_BLUE", color: 141 },
			{ text: "GALAXY_BLUE", color: 61 },
			{ text: "DARK_BLUE", color: 62 },
			{ text: "SAXON_BLUE", color: 63 },
			{ text: "BLUE", color: 64 },
			{ text: "MARINER_BLUE", color: 65 },
			{ text: "HARBOR_BLUE", color: 66 },
			{ text: "DIAMOND_BLUE", color: 67 },
			{ text: "SURF_BLUE", color: 68 },
			{ text: "NAUTICAL_BLUE", color: 69 },
			{ text: "RACING_BLUE", color: 73 },
			{ text: "LIGHT_BLUE", color: 74 },
			{ text: "BISON_BROWN", color: 101 },
			{ text: "CREEK_BROWN", color: 95 },
			{ text: "UMBER_BROWN", color: 94 },
			{ text: "MAPLE_BROWN", color: 97 },
			{ text: "BEECHWOOD_BROWN", color: 103 },
			{ text: "SIENNA_BROWN", color: 104 },
			{ text: "SADDLE_BROWN", color: 98 },
			{ text: "MOSS_BROWN", color: 100 },
			{ text: "WOODBEECH_BROWN", color: 102 },
			{ text: "STRAW_BROWN", color: 99 },
			{ text: "SANDY_BROWN", color: 105 },
			{ text: "BLEECHED_BROWN", color: 106 },
			{ text: "PURPLE", color: 71 },
			{ text: "SPIN_PURPLE", color: 72 },
			{ text: "MIGHT_PURPLE", color: 142 },
			{ text: "BRIGHT_PURPLE", color: 145 },
			{ text: "CREAM", color: 107 },
			{ text: "FROST_WHITE", color: 112 }
		],
		[ // Матовый
			{ text: "LIME_GREEN", color: 55 },
			{ text: "BLACK", color: 12 },
			{ text: "GREY", color: 13 },
			{ text: "LIGHT_GREY", color: 14 },
			{ text: "WHITE", color: 131 },
			{ text: "BLUE", color: 83 },
			{ text: "DARK_BLUE", color: 82 },
			{ text: "MIDNIGHT_BLUE", color: 84 },
			{ text: "MIGHT_PURPLE", color: 149 },
			{ text: "Purple", color: 148 },
			{ text: "RED", color: 39 },
			{ text: "DARK_RED", color: 40 },
			{ text: "ORANGE", color: 41 },
			{ text: "YELLOW", color: 42 },
			{ text: "GREEN", color: 128 },
			{ text: "MATTE_FOR", color: 151 },
			{ text: "MATTE_FOIL", color: 155 },
			{ text: "MATTE_OD", color: 152 },
			{ text: "MATTE_DIRT", color: 153 },
			{ text: "MATTE_DESERT", color: 154 }
		],
		[ // Металлик
			{ text: "BLACK_GRAPHITE", color: 147 },
			{ text: "PURPLE", color: 71 },
			{ text: "HOT PINK", color: 135 },
			{ text: "FORMULA_RED", color: 29 },
			{ text: "BLUE", color: 64 },
			{ text: "GOLD", color: 37 },
			{ text: "SILVER", color: 4 },
			{ text: "BLACK", color: 0 },
			{ text: "GRAPHITE", color: 1 },
			{ text: "ANTHR_BLACK", color: 11 },
			{ text: "BLACK_STEEL", color: 2 },
			{ text: "DARK_SILVER", color: 3 },
			{ text: "BLUE_SILVER", color: 5 },
			{ text: "ROLLED_STEEL", color: 6 },
			{ text: "SHADOW_SILVER", color: 7 },
			{ text: "STONE_SILVER", color: 8 },
			{ text: "MIDNIGHT_SILVER", color: 9 },
			{ text: "CAST_IRON_SIL", color: 10 },
			{ text: "RED", color: 27 },
			{ text: "TORINO_RED", color: 28 },
			{ text: "LAVA_RED", color: 150 },
			{ text: "BLAZE_RED", color: 30 },
			{ text: "GRACE_RED", color: 31 },
			{ text: "GARNET_RED", color: 32 },
			{ text: "SUNSET_RED", color: 33 },
			{ text: "CABERNET_RED", color: 34 },
			{ text: "WINE_RED", color: 143 },
			{ text: "CANDY_RED", color: 35 },
			{ text: "PINK", color: 137 },
			{ text: "SALMON_PINK", color: 136 },
			{ text: "SUNRISE_ORANGE", color: 36 },
			{ text: "ORANGE", color: 38 },
			{ text: "BRIGHT_ORANGE", color: 138 },
			{ text: "BRONZE", color: 90 },
			{ text: "YELLOW", color: 88 },
			{ text: "RACE_YELLOW", color: 89 },
			{ text: "FLUR_YELLOW", color: 91 },
			{ text: "DARK_GREEN", color: 49 },
			{ text: "RACING_GREEN", color: 50 },
			{ text: "SEA_GREEN", color: 51 },
			{ text: "OLIVE_GREEN", color: 52 },
			{ text: "BRIGHT_GREEN", color: 53 },
			{ text: "PETROL_GREEN", color: 54 },
			{ text: "LIME_GREEN", color: 92 },
			{ text: "MIDNIGHT_BLUE", color: 141 },
			{ text: "GALAXY_BLUE", color: 61 },
			{ text: "DARK_BLUE", color: 62 },
			{ text: "SAXON_BLUE", color: 63 },
			{ text: "MARINER_BLUE", color: 65 },
			{ text: "HARBOR_BLUE", color: 66 },
			{ text: "DIAMOND_BLUE", color: 67 },
			{ text: "SURF_BLUE", color: 68 },
			{ text: "NAUTICAL_BLUE", color: 69 },
			{ text: "RACING_BLUE", color: 73 },
			{ text: "ULTRA_BLUE", color: 70 },
			{ text: "LIGHT_BLUE", color: 74 },
			{ text: "CHOCOLATE_BROWN", color: 96 },
			{ text: "BISON_BROWN", color: 101 },
			{ text: "CREEK_BROWN", color: 95 },
			{ text: "UMBER_BROWN", color: 94 },
			{ text: "MAPLE_BROWN", color: 97 },
			{ text: "BEECHWOOD_BROWN", color: 103 },
			{ text: "SIENNA_BROWN", color: 104 },
			{ text: "SADDLE_BROWN", color: 98 },
			{ text: "MOSS_BROWN", color: 100 },
			{ text: "WOODBEECH_BROWN", color: 102 },
			{ text: "STRAW_BROWN", color: 99 },
			{ text: "SANDY_BROWN", color: 105 },
			{ text: "BLEECHED_BROWN", color: 106 },
			{ text: "SPIN_PURPLE", color: 72 },
			{ text: "MIGHT_PURPLE", color: 146 },
			{ text: "BRIGHT_PURPLE", color: 145 },
			{ text: "CREAM", color: 107 },
			{ text: "WHITE", color: 111 },
			{ text: "FROST_WHITE", color: 112 }
		],
		[ // Металл
			{ text: "BR BLACK_STEEL", color: 118 },
			{ text: "BR_STEEL", color: 117 },
			{ text: "BR_ALUMINIUM", color: 119 },
			{ text: "GOLD_P", color: 158 },
			{ text: "GOLD_S", color: 159 }
		]
	],
	wheelColors: [ 156, 0, 1, 11, 2, 8, 122, 27, 30, 45, 35, 33, 136, 135, 36, 41, 138, 37, 99, 90,
		95, 115, 109, 153, 154, 88, 89, 91, 55, 125, 53, 56, 151, 82, 64, 87, 70, 140, 81, 145, 142 ],
	tiresSmokeColors: [
		{ text: "CMOD_TYR_3", color: [ 0, 0, 0 ] },
		{ text: "CMOD_TYR_4", color: [ 20, 20, 20 ] },
		{ text: "CMOD_TYR_5", color: [ 0, 174, 239 ] },
		{ text: "CMOD_TYR_6", color: [ 252, 238, 0 ] },
		{ text: "CMOD_TYR_11", color: [ 132, 102, 226 ] },
		{ text: "CMOD_TYR_7", color: [ 255, 127, 0 ] },
		{ text: "CMOD_TYR_10", color: [ 114, 204, 114 ] },
		{ text: "CMOD_TYR_8", color: [ 226, 6, 6 ] },
		{ text: "CMOD_TYR_12", color: [ 203, 54, 148 ] },
		{ text: "CMOD_TYR_13", color: [ 0, 0, 0 ] }
	],
	prices: {
        repair: 1,
        mods: {
            0: { base: 0.01, add: 0.003 }, // Спойлеры
            1: { base: 0.01, add: 0.003 }, // Передние бамперы
            2: { base: 0.01, add: 0.003 }, // Задние бамперы
            3: { base: 0.01, add: 0.003 }, // Юбки
            4: { base: 0.02, add: 0.003 }, // Глушители
            5: { base: 0.01, add: 0.003 }, // Каркас безопасности
            6: { base: 0.03, add: 0.003 }, // Решетки радиатора
            7: { base: 0.03, add: 0.003 }, // Капот
            10: { base: 0.02, add: 0.003 }, // Крыша
            11: [ 0.1, 0.14, 0.17, 0.2 ], // Двигатель
            12: [ 0.03, 0.06, 0.09, 0.14 ], // Тормоза
            13: [ 0.01, 0.04, 0.06, 0.09, 0.15 ], // Трансмиссия
            14: { base: 0.015, add: 0 }, // Клаксоны
            15: { base: 0.06, add: 0.01 }, // Подвеска
            16: [ 0, 0.02, 0.06, 0.09, 0.11, 0.14 ], // Броня
            18: { base :0.05, add: 0.01}, // Турбо
            22: [ 0.015, 0.1 ] // Ксенон
        },
        neonColor: { base: 0.03, add: 0 },
        neonPosition: [ 0, 0.02, 0.02, 0.04, 0.04, 0.06, 0.06, 0.08 ],
        numberPlateType: { base: 0.02, add: 0 },
        color: [ 0.06, 0.05, 0.02, 0.02, 0.02 ],
        carWheels: [ 0.02, 0.02, 0.02, 0.025, 0.02, 0.01, 0.02 ],
        motoWheels: { base: 0.02, add: 0 },
        wheelColor: { base: 0.01, add: 0 },
        tiresDesign: { base: 0.01, add: 0.01 },
        tiresBurst: { base: 0.04, add: 0 },
        tiresSmokeColor: { base: 0.015, add: 0 },
        windowTint: { base: 0.01, add: 0.01 }
    }
};

module.exports = customsInfo;
