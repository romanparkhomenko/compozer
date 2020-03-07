import colors from '../styles/colors';
import { Const, Create, Curve, Geom, Group, Num, Circle, Pt, Line } from 'pts';

export const colorShades = [
  colors.oxford,
  colors.orange,
  colors.white,
  colors.lemonade,
  colors.kermit,
];

// Function to generate face polygon and control the push and pull of the mouse.
export const getCtrlPoints = (t, space, radius, ctrls) => {
  const r = radius + radius * (Num.cycle((t % 3000) / 3000) * 0.2);
  const temp = ctrls.clone();

  for (let i = 0, len = temp.length; i < len; i++) {
    const d = ctrls[i].$subtract(space.pointer);

    if (d.magnitudeSq() < r * r) {
      // push out if inside threshold
      temp[i].to(space.pointer.$add(d.unit().$multiply(r)));
    } else if (!ctrls[i].equals(temp[i], 0.1)) {
      // pull in if outside threshold
      temp[i].to(Geom.interpolate(temp[i], ctrls[i], 0.02));
    }
  }
  // close the bspline curve with 3 extra points
  temp.push(temp.p1, temp.p2, temp.p3);
  return temp;
};

export const getWaveForms = (sound, space, form, time) => {
  // create a line and get 200 interpolated points
  let offset = space.size.$multiply(0.2).y;
  const bins = 256;
  let line = new Group(new Pt(0, offset), new Pt(space.size.x, space.size.y - offset));
  let pts = Line.subpoints(line, bins);

  // get perpendicular unit vectors from each points on the line
  let pps = pts.map(p => Geom.perpendicular(p.$subtract(line[0]).unit()).add(p));

  let angle = (space.center.x / space.size.x) * Const.two_pi * 2;

  // draw each perpendicular like a sine-wave
  pps.forEach((pp, i) => {
    let t = (i / bins) * Const.quarter_pi + angle + Num.cycle((time % 10000) / 10000);

    if (i % 2 === 0) {
      pp[0].to(Geom.interpolate(pts[i], pp[0], Math.sin(t) * offset * 2));
      pp[1].to(pts[i]);
      form.stroke('#0c6', 2).line(pp);
    } else {
      pp[0].to(pts[i]);
      pp[1].to(Geom.interpolate(pts[i], pp[1], Math.cos(t) * offset * 2));
      form.stroke('#f03', 2).line(pp);
    }
  });
};

export const getSpaceAndPointer = (sound, space, form, pts) => {
  // check if each point is within circle's range
  for (let i = 0, len = pts.length; i < len; i++) {
    form.fillOnly(colors.oxford).point(pts[i], 2, 'circle');
  }
};

export const generateTitle = (space, form) => {
  // console.info(space);
  console.info(form);
  form
    .font(72, 'bold')
    .fillOnly(colors.battleship)
    .text(space.center, 'compozer');
};

export const generateFaceDude = (sound, space, form, timings) => {
  const radius = space.size.minValue().value / 3.5;
  const ctrls = Create.radialPts(space.center, radius, 10, -Const.pi - Const.quarter_pi);
  const bins = 256;
  const anchors = getCtrlPoints(timings, space, radius, ctrls);
  const curve = Curve.bspline(anchors, 4);
  const center = anchors.centroid();
  form.fillOnly(colors.seablue).polygon(curve);

  // initiate spikes array, evenly distributed spikes aroundthe face
  const spikes = [];
  for (let i = 0; i < bins; i++) {
    spikes.push(curve.interpolate(i / bins));
  }

  // calculate spike shapes based on freqs
  const freqs = sound.freqDomainTo([bins, 1]);
  const tris = [];
  let tindex = 0;
  let fACC = 0;

  let temp;
  for (let i = 0, len = freqs.length; i < len; i++) {
    const prev = spikes[i === 0 ? spikes.length - 1 : i - 1];
    const dp = spikes[i].$subtract(prev);
    fACC += freqs[i].y;

    if (dp.magnitudeSq() < 2) continue;

    if (tindex === 0) {
      temp = [spikes[i]];
    } else if (tindex === 1) {
      const pp = Geom.perpendicular(dp);
      temp.push(spikes[i].$add(pp[1].$unit().multiply(freqs[i].y * radius)));
    } else if (tindex === 2) {
      temp.push(spikes[i]);
      tris.push(temp);
    }

    tindex = (i + 1) % 3;
  }

  const fScale = fACC / bins;
  // draw spikes
  for (let i = 0, len = tris.length; i < len; i++) {
    form.fillOnly(colors.seablue).polygon(tris[i]);
    form.fillOnly(colorShades[i % colorShades.length]).point(tris[i][1], freqs[i].y * 10, 'circle');
  }

  // Draw lips with frequency data
  const tdata = sound
    .timeDomainTo([radius, 12], [space.center.x - radius / 2, 0])
    .map(
      (t, i) =>
        new Group(
          [t.x, space.center.y + 50 - t.y * Num.cycle(i / bins) * (0.5 + 1.5 * fScale)],
          [t.x, space.center.y + 50 + t.y * Num.cycle(i / bins) * (0.5 + 10 * fScale) + 10],
        ),
    );

  for (let i = 0, len = tdata.length; i < len; i++) {
    const t2 = [
      tdata[i].interpolate(-1.25 + 0.2 * fScale),
      tdata[i].interpolate(1.5 + 0.3 * fScale),
    ];
    form.strokeOnly(colors.recordRed).line(tdata[i]);
    form.strokeOnly(colors.black, 3).line(t2);
  }

  // draw eyes
  const eyeRight = space.center.clone().toAngle(-Const.quarter_pi - 0.2, radius / 2, true);
  const eyeLeft = space.center.clone().toAngle(-Const.quarter_pi - 1.4, radius / 2, true);
  form.fillOnly('#fff').ellipse(eyeLeft, [18 + 15 * fScale, 18 + 15 * fScale], 0 - 0.25 * fScale);
  form.fillOnly('#fff').ellipse(eyeRight, [18 + 15 * fScale, 18 + 15 * fScale], 0 + 0.25 * fScale);

  const eyeBallRight = eyeRight
    .clone()
    .toAngle(eyeRight.$subtract(space.pointer).angle(), -5, true);
  const eyeBallLeft = eyeLeft.clone().toAngle(eyeLeft.$subtract(space.pointer).angle(), -5, true);
  form.fill(colors.black).points([eyeBallLeft, eyeBallRight], 15 + 10 * fScale, 'circle');
};

export const generateBlankFaceDude = (sound, space, form, timings) => {
  const radius = space.size.minValue().value / 3.5;
  const ctrls = Create.radialPts(space.center, radius, 10, -Const.pi - Const.quarter_pi);
  const anchors = getCtrlPoints(timings, space, radius, ctrls);
  const curve = Curve.bspline(anchors, 4);
  form.fillOnly(colors.seablue).polygon(curve);
};
