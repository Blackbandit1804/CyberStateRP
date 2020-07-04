$(document).ready(() => {
    var houseMenu = new Vue({
        el: "#houseMenu",
        data: {
            render: false,
            houseId: 2,
            houseOwner: "",
            houseAddress: "",
            houseLock: "",
            houseLockAction: "",
            lockIcon: "",
            housePrice: 1,
            houseLockState: "Открыт",
            houseRooms: 1,
            houseGarage: "",
            houseGaragePlace: "",
            houseStatus: "Свободен",
            houseClass: "",
            houseSquare: 13
        },
        methods: {
            active: function() {
                return $("#houseMenu").css("display") != "none";
            },
            showMenu: function(id, interior, owner, address, type, lock, rooms, garage, garagecount, price, rooms, square) {
                this.$data.houseId = id;
                this.$data.houseOwner = owner;
                this.$data.houseAddress = address + ", дом №" + id;
                this.$data.houseClass = globalConstants.houseClasses[type];
                this.$data.houseRooms = rooms;
                this.$data.houseSquare = square;

                if (lock) this.$data.houseLock = "Закрыт";
                else this.$data.houseLock = "Открыт";

                if (owner.length > 3) this.$data.houseStatus = "Занят";
                else this.$data.houseStatus = "Свободен";

                this.$data.houseGarage = garage;

                if (garagecount) this.$data.houseGaragePlace = "1";
                else this.$data.houseGaragePlace = "Отсутствует";

                this.$data.housePrice = price;

                $("#houseMenu .img-class").attr("src", `img/houseMenu/classes/${this.$data.houseClass}.jpg`);

                //$(".house-menu-header").hide();
                $("#ownerMenu").hide();
                $("#houseMenu").show();
                $("#layoutPanel").show();
                //$(".house-info").show();

                alt.emit(`setHouseMenuActive`, true);
            },
            showOwnerMenu: function(lock) {

                if (lock) {
                    this.$data.houseLockState = "Закрыт";
                    this.$data.houseLockAction = "Открыть";
                    this.$data.lockIcon = "img/houseMenu/lock-lock.png";
                } else {
                    this.$data.houseLockState = "Открыт";
                    this.$data.houseLockAction = "Закрыть";
                    this.$data.lockIcon = "img/houseMenu/open-lock.png";
                }

                $("#layoutPanel").hide();
                $("#houseMenu").show();
                $("#ownerMenu").show();

                alt.emit(`setHouseMenuActive`, true);
            },
            hideOwnerMenu: function() {
                $("#houseMenu").hide();
                //$(".house-menu-header").hide();
                $("#ownerMenu").hide();

                alt.emit(`setHouseMenuActive`, false);
            },
            lockUnlockHouse: function() {
                alt.emit("lockUnlockHouse");
            },
            inspectHouse: function() {
                alt.emit("inspectHouse");
            },
            enterHouse: function() {
                alt.emit("enterHouse");
            },
            enterGarage: function() {
                alt.trigger("enterGarage");
            },
            sellHouseToGov: function() {
                alt.emit("sellHouseToGov");
            },
            sellHouseToPlayer: function() {
                alt.emit("sellHouseToPlayer");
            },
            showHousePlan: function() {
                $(".house-info").hide();
                $(".house-plan").show();
            },
            backToMenu: function() {
                $(".house-plan").hide();
                $(".house-info").show();
            },
            buyHouse: function() {
                alt.emit("buyHouse");
            },
            invitePlayer: function() {
                alt.emit("invitePlayer");
            },
            exitMenu: function() {
                $("#houseMenu").hide();
                $(".house-header").hide();
                $(".house-plan").hide();
                $(".house-info").hide();
                $(".house-menu-header").hide();
                $(".house-menu").hide();
                alt.emit("exitHouseMenu", false);
                alt.emit(`setHouseMenuActive`, false);
            }
        }
    });
});

alt.on(`houseMenu.__vue__.showMenu`, (params, houseOwner, streatName, haveGarage, garagePlace) => {
    houseMenu.__vue__.showMenu(params[0], params[2], houseOwner, streatName, params[1], params[5], 1, haveGarage, garagePlace, params[6], params[8], params[9]);
});

alt.on(`houseMenu.__vue__.showOwnerMenu`, (lock) => {
    houseMenu.__vue__.showOwnerMenu(lock);
});

alt.on(`houseMenu.__vue__.hideOwnerMenu`, () => {
    houseMenu.__vue__.hideOwnerMenu();
});

alt.on(`houseMenu.__vue__.exitMenu`, () => {
    houseMenu.__vue__.exitMenu();
});
