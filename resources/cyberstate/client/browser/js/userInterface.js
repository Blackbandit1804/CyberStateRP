$(document).ready(() => {
    var userInterface = new Vue({
        el: "#userInterface",
        data: {
            render: false, // Отказаться от рендера и перейти на display none!!!
            currentOnline: 0,
            maxOnline: 0,
            currentTime: moment().format('HH:mm / DD.MM.YYYY')
        },
        methods: {
            updateTime: function() {
                this.$data.currentTime = moment().format('HH:mm / DD.MM.YYYY');
            }
        }
    });
});

alt.on(`userInterface::build`, (value) => {
    $('#userInterface .build').text(`${value}`);
});

alt.on(`userInterface::render`, () => {
    userInterface.__vue__.$data.render=true;
});

