// project.js - visualizing baskin engineering majors by gender
// Author: Thanyared Wong
// Date: 2024.02.28
import * as Plot from "https://cdn.jsdelivr.net/npm/@observablehq/plot@0.6/+esm";

document.addEventListener("DOMContentLoaded", function() {
  fetch('./assets/BEgenders.csv')
      .then(response => response.text())
      .then(csvText => d3.csvParse(csvText))
      .then(processData)
      .then(createPlot);
});

function processData(data) {
  const students = [];
  data.forEach((department) => {
      let major = department.Major;
      let words = department.Major.split(' ');
      if (words.length >= 3) {
          major = words.slice(0,2).join(' ') + '\n' + words.slice(2).join(' ');
      }
      let women = Math.ceil(department.Women);
      let men = Math.ceil(department.Men);
      let total = Math.ceil(department.Total);
      let neither = total - (women + men);

      let percentWomen = women / total;
      let percentMen = men / total;
      let percentNeither = neither / total;

      for(let i = 0; i < women; i++) {
          students.push({major: major, gender: 'female', count: i, percent: percentWomen});
      }
      for(let i = 0; i < men; i++) {
          students.push({major: major, gender: 'male', count: women + i, percent: percentMen});
      }
      for(let i = 0; i < neither; i++) {
          students.push({major: major, gender: 'neither/decline to state', count: women + men + i, percent: percentNeither});
      }
  });
  return students;
}

function createPlot(students) {
  const plot = Plot.plot({
      x: {axis: {labelAngle: -45}},
      y: {grid: true},
      color: {legend: true},
      width: 1200,
      height: 600,
      marks: [
          Plot.dot(students, Plot.dodgeX({fx: "major", y: 'count', fill: "gender", channels: {major: 'major', gender: "gender", percentOfMajor: 'percent'}, tip: true}))
      ]
  });
  document.getElementById("canvas-container").appendChild(plot);
}
