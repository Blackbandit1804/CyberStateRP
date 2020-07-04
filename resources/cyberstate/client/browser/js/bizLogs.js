$(document).ready(() => {
    window.bizLogsAPI = {
        init: (logs, offset) => {
            logs = JSON.parse(logs);
            $(".bizLogs tbody").empty();
            $(".bizLogs table").data("offset", offset);
            if (logs == 0) {
                $(".bizLogs tbody").append(`<tr><td colspan="5">Пусто</td></tr>`);
            }
            logs.forEach((log) => {
                bizLogsAPI.add(log);
            });

            if (offset == 0) {
                $(".bizLogs button").eq(0).hide();
            } else {
                $(".bizLogs button").eq(0).show();
            }
            if (logs.length < 30) $(".bizLogs button").eq(1).hide();
            else $(".bizLogs button").eq(1).show();

            $(".bizLogs .content").scrollTop(0);
            if (!bizLogsAPI.active()) bizLogsAPI.show(true);
        },
        add: (log) => {
            var el = `<tr data-logId=${log.id}>
                        <td>${log.text}</td>
                        <td>${log.price}$</td>
                        <td>${log.products} ед.</td>
                        <td>№${log.id}</td>
                        <td>${convertMillsToDate(log.date)}</td>
                  </tr>`;

            $(".bizLogs tbody").append(el);
        },
        show: (enable) => {
            if (window.playerMenu.active() || chatAPI.active() || consoleAPI.active()) return;
            if (enable) {
                $(".bizLogs").slideDown('fast');
            } else {
                $(".bizLogs").slideUp('fast');
            }
        },
        active: () => {
            return $(".bizLogs").css("display") != "none";
        }
    }

});


function bizLogsNext() {
    var offset = parseInt($(".bizLogs table").data("offset"));
    offset += 30;
    alt.trigger("events.emitServer", "biz.getStats", offset);
}

function bizLogsPrev() {
    var offset = parseInt($(".bizLogs table").data("offset"));
    offset -= 30;
    if (offset < 0) offset = 0;
    alt.trigger("events.emitServer", "biz.getStats", offset);
}
