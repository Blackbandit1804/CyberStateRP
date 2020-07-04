module.exports = {
    Init: () => {
      DB.Query("SELECT * FROM spawn_pos", (e, result) => {
        let spawnOpen = require("../events/CharacterEvents.js");
        if (result.length < 1) return spawnOpen.SpawnInfo.user_spawn.push({ x: 0, y: 0, z: 0, h: 0 });
        for (let i = 0; i < result.length; i++) spawnOpen.SpawnInfo.user_spawn.push({ x: result[i].x, y: result[i].y, z: result[i].z, h: result[i].rot });
        alt.log("Загружено спавнов: " + spawnOpen.SpawnInfo.user_spawn.length + " шт.");
      });
    }
}
