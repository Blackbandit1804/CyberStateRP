module.exports = {
    build: "v. 5.3.20",
    closedMode: false, // закрытый доступ к серверу
    pin: 3641,
    adminCode: "WdPvuakRJmwh8QSgNVOp", // код в чат для выдачи админки

    autoLogin: false, // автологин для экономии времени
    login: "Admin",
    password: "123499",

    maxCharacters: 3, // макс. кол-во персонажей на учётную запись
    maxWantedLevel: 5, // макс. уровень розыска
    maxPickUpItemDist: 2, // макс. дистанция взятия предмета с земли
    maxInteractionDist: 5, // макс. дистанция взаимодействия с игроком/авто
    minSpawnCarDist: 10, // мин. дистанция для срабатывания спавна кара
    maxInventoryWeight: 30, // макс. вес предметов игрока в КГ
    maxVehInventoryWeight: 50, // макс. вес предметов авто в КГ
    maxLevelAdmin: 10, // макс. лвл админки

    gasRange: 10, // радиус заправки у АЗС

    spawnCarsWaitTime: 10000, // ожидание перед спавном всех каров сервера (мс)
	restartWaitTime: 10000, // ожидание перед рестартом сервера (мс)

	hospitalSpawn: true
}
