const canvasSketch = require("canvas-sketch");
const { lerp } = require("canvas-sketch-util/math");
const random = require("canvas-sketch-util/random");
const palettes = require("nice-color-palettes");

random.setSeed(35);

const settings = {
  dimensions: [2048, 2048],
};

const sketch = () => {
  const createGrid = () => {
    const points = [];
    // grid size
    const count = 6;

    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        const u = count <= 1 ? 0.5 : x / (count - 1);
        const v = count <= 1 ? 0.5 : y / (count - 1);

        points.push([u, v]);
      }
    }

    return points;
  };

  const grid = createGrid();
  const margin = 400;

  return ({ context, width, height }) => {
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);

    grid.forEach(([u, v]) => {
      const x = lerp(margin, width - margin, u);
      const y = lerp(margin, height - margin, v);

      context.beginPath();
      context.arc(x, y, 5, 0, Math.PI * 2, false);
      context.fillStyle = "white";
      context.fill();
    });

    const shuffledXCoords = random.shuffle(grid.map(([u]) => u));
    const shuffledYCoords = random.shuffle(grid.map(([, v]) => v));
    const shuffledGrid = shuffledXCoords.map((x, i) => [x, shuffledYCoords[i]]);

    const palette = random.pick(palettes);

    shuffledGrid.forEach(([u, v], idx) => {
      if (idx % 2 === 1) {
        return;
      }

      const x1 = lerp(margin, width - margin, u);
      const y1 = lerp(margin, height - margin, v);

      const [u2, v2] = shuffledGrid[idx + 1];

      const x2 = lerp(margin, width - margin, u2);
      const y2 = lerp(margin, height - margin, v2);

      context.beginPath();
      context.moveTo(x1, y1);
      context.lineTo(x2, y2);
      context.lineTo(x2, height - margin);
      context.lineTo(x1, height - margin);
      context.closePath();

      context.lineWidth = "50";
      context.strokeStyle = "white";
      context.stroke();

      context.fillStyle = random.pick(palette);
      context.fill();

      context.restore();
    });
  };
};

window.onload = () => {
  canvasSketch(sketch, settings);
};
