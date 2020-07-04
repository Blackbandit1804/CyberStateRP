alt.on("playerStartEnteredVehicle", (player, vehicle, seat) => {
    if (player.getSyncedMeta("attachedObject")) {
      if (player.job === 9 && player.getSyncedMeta("attachedObject") === "hei_prop_heist_binbag") return;
      if (player.job === 7 && player.builder) {
        let jobOpen = require("../modules/jobs/builder/job.js");
        jobOpen.stopBringingLoad(player);
      }
      player.setSyncedMeta("attachedObject", null);
    }
});

