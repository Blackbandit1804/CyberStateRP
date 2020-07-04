import alt from 'alt';
import game from 'natives';

const player = alt.Player.local
const BusControl = {
  pos: [],
	blips: [],
	markers: []
};

alt.onServer('create.all.map.bus', (way, after) => {
    for (let i = 0; i < BusControl.blips.length; i++) if (BusControl.blips[i] !== undefined) {
      BusControl.blips[i].destroy(), delete BusControl.markers[i];
    }
    BusControl.blips = [], BusControl.pos = [], BusControl.markers = [];
    if (after === "cancel") return;
    let arr = JSON.parse(way);
    BusControl.pos = arr;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].type === 0) {
          BusControl.blips.push(alt.helpers.blip.new(1, arr[i].x, arr[i].y, 0, { alpha: 255, scale: 1.1, name: "Промежуток #" + arr[i].id, color: 2 }));
          BusControl.markers.push(alt.helpers.marker.new(1, new alt.Vector3(arr[i].x, arr[i].y, arr[i].z - 1.25), undefined, undefined, 6, {r: 0, g: 128, b: 0, alpha: 100}, undefined, true, 2));
        } else {
          BusControl.blips.push(alt.helpers.blip.new(1, arr[i].x, arr[i].y, 0, { alpha: 255, scale: 1.1, name: "Остановка #" + arr[i].id, color: 1 }));
          BusControl.markers.push(alt.helpers.marker.new(1, new alt.Vector3(arr[i].x, arr[i].y, arr[i].z - 1.25), undefined, undefined, 6, {r: 255, g: 0, b: 0, alpha: 100}, undefined, true, 2));
        }
    }
});

alt.onServer('create.one.map.bus', (x, y, z, type, id) => {
    BusControl.pos.push({ id: id, x: x, y: y, z: z, type: type });
    if (type === 0) {
      BusControl.blips.push(alt.helpers.blip.new(1, x, y, 0, { alpha: 255, scale: 1.1, name: "Промежуток #" + id, color: 2 }));
      BusControl.markers.push(alt.helpers.marker.new(1, new alt.Vector3(x, y, z - 1.25), undefined, undefined, 6, {r: 0, g: 128, b: 0, alpha: 100}, undefined, true, 2));
    } else {
      BusControl.blips.push(alt.helpers.blip.new(1, x, y, 0, { alpha: 255, scale: 1.1, name: "Остановка #" + id, color: 1 }));
      BusControl.markers.push(alt.helpers.marker.new(1, new alt.Vector3(x, y, z - 1.25), undefined, undefined, 6, {r: 255, g: 0, b: 0, alpha: 100}, undefined, true, 2));
    }
});

alt.onServer('change.one.map.bus.position', (num, x, y, z) => {
    for (let i = 0; i < BusControl.pos.length; i++) {
      if (BusControl.pos[i].id === num) {
        let need = BusControl.pos.indexOf(BusControl.pos[i]);
        BusControl.blips[need].position = new alt.Vector3(x, y, z);
        BusControl.markers[need].pos = new alt.Vector3(x, y, z - 1.25);
        BusControl.pos[i].x = x, BusControl.pos[i].y = y, BusControl.pos[i].z = z;
      }
    }
});

alt.onServer('change.one.map.bus.name', (num, type) => {
    for (let i = 0; i < BusControl.pos.length; i++) {
      if (BusControl.pos[i].id === num) {
        let need = BusControl.pos.indexOf(BusControl.pos[i]);
        if (BusControl.blips[need]) {
          BusControl.blips[need].destroy(), delete BusControl.markers[need];
        }
        if (type === 0) {
          BusControl.blips[need] = alt.helpers.blip.new(1, BusControl.pos[i].x, BusControl.pos[i].y, 0, { alpha: 255, scale: 1.1, name: "Промежуток #" + num, color: 2 });
          BusControl.markers[need] = alt.helpers.marker.new(1, new alt.Vector3(BusControl.pos[i].x, BusControl.pos[i].y, BusControl.pos[i].z - 1.25), undefined, undefined, 6, {r: 0, g: 128, b: 0, alpha: 100}, undefined, true, 2);
        } else {
          BusControl.blips[need] = alt.helpers.blip.new(1, BusControl.pos[i].x, BusControl.pos[i].y, 0, { alpha: 255, scale: 1.1, name: "Остановка #" + num, color: 1 });
          BusControl.markers[need] = alt.helpers.marker.new(1, new alt.Vector3(BusControl.pos[i].x, BusControl.pos[i].y, BusControl.pos[i].z - 1.25), undefined, undefined, 6, {r: 255, g: 0, b: 0, alpha: 100}, undefined, true, 2);
        }
      }
    }
});

alt.onServer('delete.one.map.bus', (num) => {
    for (let i = 0; i < BusControl.pos.length; i++) {
      if (BusControl.pos[i].id === num) {
        let need = BusControl.pos.indexOf(BusControl.pos[i]);
        BusControl.blips[need].destroy();
        delete BusControl.markers[need];
        BusControl.pos.splice(need, 1), BusControl.blips.splice(need, 1), BusControl.markers.splice(need, 1);
      }
    }
});
