import alt from 'alt';
import game from 'natives';

alt.blips = new Map();
let totalBlips = 3000;

class PointBlip extends alt.PointBlip {
    constructor(sprite, x, y, z, options) {
        super(x, y, z);
        this.sprite = sprite;

        if (options.number === undefined || options.number === null) {
          this.number = -1;
        } else {
          this.number = options.number;
        }

        if (options.name === undefined || options.name === null) {
          this.name = '';
        } else {
          this.name = options.name;
        }

        if (options.alpha === undefined || options.alpha === null) {
          this.alpha = 255;
        } else {
          this.alpha = options.alpha;
        }

        if (options.scale === undefined || options.scale === null) {
          this.scale = 0.7;
        } else {
          this.scale = options.scale;
        }

        if (options.color === undefined || options.color === null) {
          this.color = 1;
        } else {
          this.color = options.color;
        }

        if (options.tickVisible === undefined || options.tickVisible === null) {
          this.tickVisible = false;
        } else {
          this.tickVisible = options.tickVisible;
        }

        if (options.shortRange === undefined || options.shortRange === null) {
          this.shortRange = true;
        } else {
          this.shortRange = options.shortRange;
        }

        if (options.sqlId === undefined || options.sqlId === null) {
          this.sqlId = 0
        } else {
          this.sqlId = options.sqlId;
        }

        totalBlips += 1;
        this.spriteID = sprite;
        this.uniqueID = totalBlips;

        if (options.sqlId !== 0) {
          alt.blips.set(options.sqlId, this);
        } else {
          alt.blips.set(totalBlips, this);
        }

    }
}

const blipHelper = {
	"new": (sprite, x, y, z, options) => new PointBlip(sprite, x, y, z, options)
};

export default blipHelper;
