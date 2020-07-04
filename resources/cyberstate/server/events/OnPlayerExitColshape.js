alt.on("entityLeaveColshape", (colshape, player) => {
    if (player.sqlId && player instanceof alt.Player) {
        if (!colshape) return;
        if (player.colshape) delete player.colshape;
    
        if (colshape.menuName || colshape.tpMarker || colshape.targetMarker || colshape.gangId) {
            alt.emitClient(player, "prompt.hide");
            alt.emitClient(player, `Colshape::enable`, false);
    
            if (player.inColshapeUse) delete player.inColshapeUse;
        }
    
        if (colshape.menuName || colshape.gangId) {
            if (colshape.factionService) delete player.clearFine;
            if (!player.inDressingRoom) {
                return alt.emitClient(player, "selectMenu.hide");
            }
        }
        
        if (colshape.factionProducts) {
            player.utils.setLocalVar("insideProducts", false);
            delete player.factionProducts;
        } else if (colshape.warehouse) {
            player.utils.setLocalVar("insideWarehouseProducts", false);
        } else if (colshape.house) {
            alt.emitClient(player, "exitHouseMenu", true);
        } else if (colshape.tpMarker && player.lastTpMarkerId != colshape.tpMarker.id) {
            delete player.lastTpMarkerId;
        }
    }
});
