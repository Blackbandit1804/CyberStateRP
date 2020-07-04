import myEventEmmiter from '../helpers/events';

export const PlayerEvents = (dispatch) => {
    myEventEmmiter.on('adminPanel', (data) => {
        var event = data.event;
        if(event === 'reports') {
            window.adminPanel.changeOptions(event, data.reports);
        } else if(event === 'messages') {
            window.adminPanel.changeOptions(event, data.messages);
        } else if(event === "enable") {
            window.adminPanel.enable(data.enable);
        } else if(event === "closeTicket") {
            window.adminPanel.changeOptions(event, data.closeTicket);
        }
    });

    myEventEmmiter.on('telePhone', (data) => {
        var event = data.event;
        if (event === 'outComingMessage') {
            window.telephone.changeOptions(event, data.data);
        } else if (event === 'inComingMessage') {
            window.telephone.changeOptions(event, data.data);
        } else if (event === 'contacts') {
            window.telephone.changeOptions(event, data.contacts);
        } else if (event === 'contact') {
            window.telephone.changeOptions(event, data.contact);
        } else if (event === 'delete') {
            window.telephone.changeOptions(event, data.contact);
        } else if (event === 'setnum') {
            window.telephone.setnum(data.num);
        } else if (event === "enable") {
            window.telephone.enable(data.status);
        }
    });

    myEventEmmiter.on('hudControl', (data) => {
        var event = data.event;
        if(event === 'setData') {
            window.hudControl.changeOptions(event, data.data);
        } else if(event === 'setOnline') {
            window.hudControl.changeOptions(event, data.online);
        } else if(event === 'chat') {
            window.hudControl.changeOptions(event, data.chat);
        } else if(event === 'updateMoney') {
            window.hudControl.changeOptions(event, data.money);
        } else if(event === 'updateBank') {
            window.hudControl.changeOptions(event, data.bank);
        } else if(event === 'updateWanted') {
            window.hudControl.changeOptions(event, data.wanted);
        } else if(event === 'setDataWeapon') {
            window.hudControl.changeOptions(event, data.data);
        } else if(event === "enable") {
            window.hudControl.enable(data.status);
        }
    });

    myEventEmmiter.on('atmMenu', (data) => {
        var event = data.event;
        if(event === "enable") {
            window.atmMenu.enable(data.enable);
        }
    });
    
    myEventEmmiter.on('playerMenu', (data) => {
        var event = data.event;
        if(event === "enable") {
            window.playerMenu.enable(data.status);
        } else if(event === "bizes") {
            window.playerMenu.changeOptions(event, data.bizes);
        } else if(event === "houses") {
            window.playerMenu.changeOptions(event, data.houses);
        } else if(event === "paymentsAccount") {
            window.playerMenu.changeOptions(event, data.paymentsAccount);
        } else if(event === "chat") {
            window.chatAPI.changeOptions(data.chat);
            window.playerMenu.changeOptions(event, data.chat);
        } else if(event === "hud") {
            window.playerMenu.changeOptions(event, data.hud);
        } else if(event === "nickname") {
            window.playerMenu.changeOptions(event, data.nickname);
        } else if(event === "nickId") {
            window.playerMenu.changeOptions(event, data.nickId);
        } else if(event === "cars") {
            window.playerMenu.changeOptions(event, data.cars);
        } else if(event === "reports") {
            window.playerMenu.changeOptions(event, data.reports);
        } else if(event === "messages") {
            window.playerMenu.changeOptions(event, data.messages);
        } else if(event === "closeTicket") {
            window.playerMenu.changeOptions(event, data.closeTicket);
        } else if(event === "achievements") {
            window.playerMenu.changeOptions(event, data.achievements);
        } else if(event === "achievementsPlayer") {
            window.playerMenu.changeOptions(event, data.achievementsPlayer);
        } else if(event === "spawn") {
            window.playerMenu.changeOptions(event, data.spawn);
        } else if(event === "houseId") {
            window.playerMenu.changeOptions(event, data.houseId);
        } else if(event === "addHouse") {
            window.playerMenu.changeOptions(event, data.addHouse);
        } else if(event === "removeHouse") {
            window.playerMenu.changeOptions(event, data.removeHouse);
        } else if(event === "addBiz") {
            window.playerMenu.changeOptions(event, data.addBiz);
        } else if(event === "removeBiz") {
            window.playerMenu.changeOptions(event, data.removeBiz);
        } else if(event === "skills") {
            window.playerMenu.changeOptions(event, data.skills);
        } else if(event === "addReport") {
            window.playerMenu.changeOptions(event, data.addReport);
        }
    });

    myEventEmmiter.on('carSystem', (data) => {
        var event = data.event;
        if(event === 'specMenu') {
            window.specMenu.changeOptions(data.specMenu);
        } else if(event === 'enable') {
            window.specMenu.enable(data.enable);
        } else if(event === 'vehEnable') {
            window.speedoMetr.enable(data.enable);
        } else if(event === 'MileageHandler') {
            window.speedoMetr.changeOptions(event, data.mileage);
        } else if(event === 'VehPropHandler') {
            window.speedoMetr.changeOptions(event, data.data);
        } else if(event === 'engineStatus') {
            window.speedoMetr.changeOptions(event, data.engine);
        } else if(event === 'accumulatorStatus') {
            window.speedoMetr.changeOptions(event, data.accumulator);
        } else if(event === 'OilBrokenHandler') {
            window.speedoMetr.changeOptions(event, data.oil);
        } else if(event === 'LeftSignalHandler') {
            window.speedoMetr.changeOptions(event, data.left);
        } else if(event === 'RightSignalHandler') {
            window.speedoMetr.changeOptions(event, data.right);
        } else if(event === 'EmergencyHandler') {
            window.speedoMetr.changeOptions(event, data.emergency);
        } else if(event === 'LockedHandler') {
            window.speedoMetr.changeOptions(event, data.locked);
        } else if(event === 'BeltHandler') {
            window.speedoMetr.changeOptions(event, data.belt);
        } else if(event === 'LightsHandler') {
            window.speedoMetr.changeOptions(event, data.lights);
        }
    });

    myEventEmmiter.on('documents', (data) => {
        var event = data.event;
        if (event === "medic") {
            window.medicCerf.enable(true);
            dispatch({
                type: 'documents.medic',
                params: {
                    medic: data.medic 
                }
            });
        } else if (event === "sheriff") {
            window.sheriffCerf.enable(true);
            window.sheriffCerf.changeOptions(data.sheriff);
        } else if (event === "army") {
            window.armyCerf.enable(true);
            window.armyCerf.changeOptions(data.army);
        } else if (event === "fib") {
            window.fibCerf.enable(true);
            window.fibCerf.changeOptions(data.fib);
        } else if (event === "police") {
            window.policeCerf.enable(true);
            window.policeCerf.changeOptions(data.police);
        }
    });

    myEventEmmiter.on('autoSaloon', (data) => {
        var event = data.event;
        if(event === "selectCarParam") {
            window.autoSaloon.changeOptions(event, data.selectCarParam);
        } else if(event === "catalogData") {
            window.autoSaloon.changeOptions(event, data.catalogData);
        } else if(event === "colorSelect") {
            window.autoSaloon.changeOptions(event, data.colorSelect);
        } else if(event === "dim") {
            window.autoSaloon.changeOptions(event, data.dim);
        } else if(event === "bizId") {
            window.autoSaloon.changeOptions(event, data.bizId);
        } else if(event === "enable") {
            if(data.enable === true) {
                window.playerMenu.enable(false);
                window.chatAPI.enable(false);
                window.inventoryAPI.enable(false);
                window.hudControl.enable(false);
            } else {
                window.playerMenu.enable(true);
                window.chatAPI.enable(true);
                window.inventoryAPI.enable(true);
                window.hudControl.enable(true);
            }
            window.autoSaloon.enable(data.enable);
        }
    });

    myEventEmmiter.on('fibTablet', (data) => {
        var event = data.event;
        if(event === "addTeamPlayer") {
            window.fibTablet.changeOptions(event, data.addTeamPlayer);
        } else if(event === "removeTeamPlayer") {
            window.fibTablet.changeOptions(event, data.removeTeamPlayer);
        } else if(event === "addCall") {
            window.fibTablet.changeOptions(event, data.addCall);
        } else if(event === "removeCall") {
            window.fibTablet.changeOptions(event, data.removeCall);
        } else if(event === "addSearchPlayer") {
            window.fibTablet.changeOptions(event, data.addSearchPlayer);
        } else if(event === "enable") {
            window.fibTablet.enable(data.status);
        }
    });

    myEventEmmiter.on('armyTablet', (data) => {
        var event = data.event;
        if(event === "addTeamPlayer") {
            window.armyTablet.changeOptions(event, data.addTeamPlayer);
        } else if(event === "removeTeamPlayer") {
            window.armyTablet.changeOptions(event, data.removeTeamPlayer);
        } else if(event === "addCall") {
            window.armyTablet.changeOptions(event, data.addCall);
        } else if(event === "setInfoWareHouse") {
            window.armyTablet.changeOptions(event, data.setInfoWareHouse);
        } else if(event === "enable") {
            window.armyTablet.enable(data.status);
        }
    });

    myEventEmmiter.on('medicTablet', (data) => {
        var event = data.event;
        if(event === "addTeamPlayer") {
            window.medicTablet.changeOptions(event, data.addTeamPlayer);
        } else if(event === "removeTeamPlayer") {
            window.medicTablet.changeOptions(event, data.removeTeamPlayer);
        } else if(event === "addCall") {
            window.medicTablet.changeOptions(event, data.addCall);
        } else if(event === "removeCall") {
            window.medicTablet.changeOptions(event, data.removeCall);
        } else if(event === "enable") {
            window.medicTablet.enable(data.status);
        }
    });

    myEventEmmiter.on('pdTablet', (data) => {
        var event = data.event;
        if(event === "addTeamPlayer") {
            window.pdTablet.changeOptions(event, data.addTeamPlayer);
        } else if(event === "removeTeamPlayer") {
            window.pdTablet.changeOptions(event, data.removeTeamPlayer);
        } else if(event === "addCall") {
            window.pdTablet.changeOptions(event, data.addCall);
        } else if(event === "removeCall") {
            window.pdTablet.changeOptions(event, data.removeCall);
        } else if(event === "addSearchPlayer") {
            window.pdTablet.changeOptions(event, data.addSearchPlayer);
        } else if(event === "enable") {
            window.pdTablet.enable(data.status);
        }
    });

    myEventEmmiter.on('bandTablet', (data) => {
        var event = data.event;
        if(event === "enable") {
            window.bandTablet.enable(data.status);
        }
    });


    myEventEmmiter.on('sheriffTablet', (data) => {
        var event = data.event;
        if(event === "addTeamPlayer") {
            window.sheriffTablet.changeOptions(event, data.addTeamPlayer);
        } else if(event === "removeTeamPlayer") {
            window.sheriffTablet.changeOptions(event, data.removeTeamPlayer);
        } else if(event === "addCall") {
            window.sheriffTablet.changeOptions(event, data.addCall);
        } else if(event === "removeCall") {
            window.sheriffTablet.changeOptions(event, data.removeCall);
        } else if(event === "addSearchPlayer") {
            window.sheriffTablet.changeOptions(event, data.addSearchPlayer);
        } else if(event === "enable") {
            window.sheriffTablet.enable(data.status);
        }
    });
};
