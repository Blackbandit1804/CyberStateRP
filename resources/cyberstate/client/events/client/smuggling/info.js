import alt from 'alt';
import game from 'natives';

const localPlayer = alt.Player.local;

alt.on(`Client::init`, (view) => {
  alt.onServer(`Blip::informator::create`, (blip) => {
    const _blip = JSON.parse(blip);
    alt.helpers.blip.new(_blip.sprite, _blip.x, _blip.y, _blip.z, {
      sqlId: 989898,
      alpha: 255,
      name: _blip.params.name,
      color: _blip.params.color,
      scale: _blip.params.scale,
      shortRange: _blip.params.shortRange
    });
  });

  alt.onServer(`Blip::informator::delete`, (id) => {
    const blip = alt.blips.get(id);
    if (blip.sqlId === id || blip !== undefined || blip !== null) {
      blip.destroy();
    }
  });
});
