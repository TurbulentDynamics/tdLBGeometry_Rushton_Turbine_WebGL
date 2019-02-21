function getDimensionString(width, height, depth) {
  return [width, height, depth].join(",");
}

function getPolarCoordinate(x, y, z, angle) {
  return [x, y, z, (angle * Math.PI / 180).toFixed(4)].join(",");
}

function setUp(tankDiameter, impellerCount, baffleCount) {
  // Tank-related parameters
  $("#tank-diameter").val(tankDiameter.toString());
  var tankHeight = tankDiameter;
  $("#tank-height").text(tankHeight.toString());
  var shaftRadius = tankDiameter * 2 / 75;
  $("#shaft-radius").text(shaftRadius.toString());

  // Impeller-related parameters
  $("#impeller-count").val(impellerCount.toString());

  // Baffle-related parameters
  $("#baffle-count").val(baffleCount.toString());

  // Tank model
  $("#tank > appearance > material").attr("ambientIntensity", 0.2);
  $("#tank > appearance > material").attr("diffuseColor", "0.8,0.8,0.8");
  $("#tank > appearance > material").attr("emissiveColor", "0,0,0");
  $("#tank > appearance > material").attr("specularColor", "0,0,0");
  $("#tank > appearance > material").attr("transparency", 0.9);
  $("#tank > cylinder").attr("solid", false);
  $("#tank > cylinder").attr("top", false);
  $("#tank > cylinder").attr("bottom", false);
  $("#tank > cylinder").attr("radius", tankDiameter / 2);
  $("#tank > cylinder").attr("height", tankHeight);

  // Shaft model
  $("#shaft > cylinder").attr("radius", shaftRadius);
  $("#shaft > cylinder").attr("height", tankHeight);

  // Remove the kernel and baffles
  $.each($("scene > transform > transform"), function(index, transform) {
    transform.parentNode.removeChild(transform);
    transform.remove();
  });

  // Create the kernel
  var rootNode = document.querySelector("scene > transform");
  $(rootNode).append(createKernel(tankDiameter, impellerCount));

  // Create the baffles
  var baffleInnerRadius = tankDiameter * 0.4;
  $("#baffle-inner-radius").text(baffleInnerRadius.toString());
  var baffleOuterRadius = tankDiameter * 0.5;
  $("#baffle-outer-radius").text(baffleOuterRadius.toString());
  var baffleWidth = tankDiameter / 75;
  $("#baffle-width").text(baffleWidth.toString());
  for (var i = 0; i < baffleCount; i++) {
    var angle = 360 * i / baffleCount;
    $(rootNode).append(createImpeller(baffleInnerRadius, baffleOuterRadius, angle, baffleWidth, tankHeight));
  }
}

function createKernel(tankDiameter, impellerCount) {
  var transform = document.createElement("transform");
  $(transform).attr("translation", "0,-50,0");

  var diskRadius = tankDiameter / 8;
  $("#disk-radius").text(diskRadius.toString());
  var diskHeight = tankDiameter / 75;
  $("#disk-height").text(diskHeight.toString());

  $(transform).append(createDisk(diskRadius, diskHeight));

  var hubRadius = tankDiameter * 4 / 75;
  $("#hub-radius").text(hubRadius.toString());
  var hubHeight = tankDiameter / 15;
  $("#hub-height").text(hubHeight.toString());

  $(transform).append(createDisk(hubRadius, hubHeight));

  var impellerInnerRadius = tankDiameter / 12;
  $("#impeller-inner-radius").text(impellerInnerRadius.toString());
  var impellerOuterRadius = tankDiameter / 6;
  $("#impeller-outer-radius").text(impellerOuterRadius.toString());
  var impellerWidth = tankDiameter / 75;
  $("#impeller-width").text(impellerWidth.toString());
  var impellerHeight = tankDiameter / 15;
  $("#impeller-height").text(impellerHeight.toString());
  for (var i = 0; i < impellerCount; i++) {
    var angle = 360 * i / impellerCount;
    $(transform).append(createImpeller(impellerInnerRadius, impellerOuterRadius, angle, impellerWidth, impellerHeight));
  }
  return transform;
}

function createSurface() {
  var appearance = document.createElement("appearance");
  var material = document.createElement("material");
  $(appearance).append(material);
  $(material).attr("ambientIntensity", 0.2);
  $(material).attr("diffuseColor", "0.8,0.8,0.8");
  $(material).attr("emissiveColor", "0,0,0");
  $(material).attr("shininess", 0.2);
  $(material).attr("specularColor", "0,0,0");
  return appearance;
}

function createDisk(radius, height) {
  var shape = document.createElement("shape");
  $(shape).append(createSurface());
  var cylinder = document.createElement("cylinder");
  $(shape).append(cylinder);
  $(cylinder).attr("radius", radius);
  $(cylinder).attr("height", height);
  return shape;
}

function createImpeller(innerRadius, outerRadius, angle, width, height) {
  var depth = outerRadius - innerRadius;
  var transform = document.createElement("transform");
  $(transform).attr("translation", getDimensionString(0, 0, innerRadius + depth / 2));
  $(transform).attr("center", getDimensionString(0, 0, -(innerRadius + depth / 2)));
  $(transform).attr("rotation", getPolarCoordinate(0, 1, 0, angle));
  var shape = document.createElement("shape");
  $(transform).append(shape);
  $(shape).append(createSurface());
  var box = document.createElement("box");
  $(shape).append(box);
  $(box).attr("size", getDimensionString(width, height, depth));
  return transform;
}

function createBaffle(innerRadius, outerRadius, angle, width, height) {
  var depth = outerRadius - innerRadius;
  var transform = document.createElement("transform");
  $(transform).attr("translation", getDimensionString(0, 0, innerRadius + depth / 2));
  $(transform).attr("center", getDimensionString(0, 0, -(innerRadius + depth / 2)));
  $(transform).attr("rotation", getPolarCoordinate(0, 1, 0, angle));
  var shape = document.createElement("shape");
  $(transform).append(shape);
  $(shape).append(createSurface());
  var box = document.createElement("box");
  $(shape).append(box);
  $(box).attr("size", getDimensionString(width, height, depth));
  return transform;
}

$(function () {
  setUp(300, 6, 4);
  $("#submit").click(function () {
    setUp($("#tank-diameter").val(), $("#impeller-count").val(), $("#baffle-count").val());
  });
});
