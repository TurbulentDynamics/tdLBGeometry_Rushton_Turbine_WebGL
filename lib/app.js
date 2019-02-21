function getDimensionString(width, height, depth) {
  return [width, height, depth].join(",");
}

function getPolarCoordinate(x, y, z, angle) {
  return [x, y, z, (angle * Math.PI / 180).toFixed(4)].join(",");
}

function setUp(params) {
  // Tank-related parameters
  $("#tank-diameter").val(params.tankDiameter.toString());
  $("#tank-height").val(params.tankHeight.toString());
  $("#shaft-radius").val(params.shaftRadius.toString());

  // Impeller-related parameters
  $("#impeller-count").val(params.impellerCount.toString());

  // Baffle-related parameters
  $("#baffle-count").val(params.baffleCount.toString());

  // Tank model
  $("#tank > appearance > material").attr("ambientIntensity", 0.2);
  $("#tank > appearance > material").attr("diffuseColor", "0.8,0.8,0.8");
  $("#tank > appearance > material").attr("emissiveColor", "0,0,0");
  $("#tank > appearance > material").attr("specularColor", "0,0,0");
  $("#tank > appearance > material").attr("transparency", 0.9);
  $("#tank > cylinder").attr("solid", false);
  $("#tank > cylinder").attr("top", false);
  $("#tank > cylinder").attr("bottom", false);
  $("#tank > cylinder").attr("radius", params.tankDiameter / 2);
  $("#tank > cylinder").attr("height", params.tankHeight);

  // Shaft model
  $("#shaft > cylinder").attr("radius", params.shaftRadius);
  $("#shaft > cylinder").attr("height", params.tankHeight);

  // Remove the kernel and baffles
  if (timerId) {
    window.clearInterval(timerId);
    kernelAngle = 0;
    $("#kernel").attr("rotation", getPolarCoordinate(0, 1, 0, kernelAngle));
  }
  $.each($("scene > transform > transform"), function(index, transform) {
    transform.parentNode.removeChild(transform);
    transform.remove();
  });

  // Create the kernel
  var rootNode = document.querySelector("scene > transform");
  $(rootNode).append(createKernel(params));

  // Create the baffles
  $("#baffle-inner-radius").val(params.baffleInnerRadius.toString());
  $("#baffle-outer-radius").val(params.baffleOuterRadius.toString());
  $("#baffle-width").val(params.baffleWidth.toString());
  for (var i = 0; i < params.baffleCount; i++) {
    var angle = 360 * i / params.baffleCount;
    $(rootNode).append(createBaffle(params, angle));
  }
}

var timerId = undefined;
var kernelAngle = 0;

function createKernel(params) {
  var transform = document.createElement("transform");
  $(transform).attr("id", "kernel");
  $(transform).attr("translation", "0,-50,0");

  $("#disk-radius").val(params.diskRadius.toString());
  $("#disk-height").val(params.diskHeight.toString());

  $(transform).append(createDisk(params.diskRadius, params.diskHeight));

  $("#hub-radius").val(params.hubRadius.toString());
  $("#hub-height").val(params.hubHeight.toString());

  $(transform).append(createDisk(params.hubRadius, params.hubHeight));

  $("#impeller-inner-radius").val(params.impellerInnerRadius.toString());
  $("#impeller-outer-radius").val(params.impellerOuterRadius.toString());
  $("#impeller-width").val(params.impellerWidth.toString());
  $("#impeller-height").val(params.impellerHeight.toString());
  for (var i = 0; i < params.impellerCount; i++) {
    var angle = 360 * i / params.impellerCount;
    $(transform).append(createImpeller(params, angle));
  }

  timerId = window.setInterval(function () {
    kernelAngle = (kernelAngle + 7) % 360;
    $("#kernel").attr("rotation", getPolarCoordinate(0, 1, 0, kernelAngle));
  }, 60);

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

function createImpeller(params, angle) {
  var depth = params.impellerOuterRadius - params.impellerInnerRadius;
  var transform = document.createElement("transform");
  $(transform).attr("translation", getDimensionString(0, 0, params.impellerInnerRadius + depth / 2));
  $(transform).attr("center", getDimensionString(0, 0, -(params.impellerInnerRadius + depth / 2)));
  $(transform).attr("rotation", getPolarCoordinate(0, 1, 0, angle));
  var shape = document.createElement("shape");
  $(transform).append(shape);
  $(shape).append(createSurface());
  var box = document.createElement("box");
  $(shape).append(box);
  $(box).attr("size", getDimensionString(params.impellerWidth, params.impellerHeight, depth));
  return transform;
}

function createBaffle(params, angle) {
  var depth = params.baffleOuterRadius - params.baffleInnerRadius;
  var transform = document.createElement("transform");
  $(transform).attr("translation", getDimensionString(0, 0, params.baffleInnerRadius + depth / 2));
  $(transform).attr("center", getDimensionString(0, 0, -(params.baffleInnerRadius + depth / 2)));
  $(transform).attr("rotation", getPolarCoordinate(0, 1, 0, angle));
  var shape = document.createElement("shape");
  $(transform).append(shape);
  $(shape).append(createSurface());
  var box = document.createElement("box");
  $(shape).append(box);
  $(box).attr("size", getDimensionString(params.baffleWidth, params.tankHeight, depth));
  return transform;
}

$(function () {
  setUp({
    tankDiameter: 300,
    tankHeight: 300,
    shaftRadius: 300 * 2 / 75,
    diskRadius: 300 / 8,
    diskHeight: 300 / 75,
    hubRadius: 300 * 4 / 75,
    hubHeight: 300 / 15,
    impellerCount: 6,
    impellerInnerRadius: 300 / 12,
    impellerOuterRadius: 300 / 6,
    impellerWidth: 300 / 75,
    impellerHeight: 300 / 15,
    baffleCount: 4,
    baffleInnerRadius: 300 * 2 / 5,
    baffleOuterRadius: 300 / 2,
    baffleWidth: 300 / 75
  });
  $("#submit").click(function () {
    setUp({
      tankDiameter: Number($("#tank-diameter").val()),
      tankHeight: Number($("#tank-height").val()),
      shaftRadius: Number($("#shaft-radius").val()),
      diskRadius: Number($("#disk-radius").val()),
      diskHeight: Number($("#disk-height").val()),
      hubRadius: Number($("#hub-radius").val()),
      hubHeight: Number($("#hub-height").val()),
      impellerCount: Number($("#impeller-count").val()),
      impellerInnerRadius: Number($("#impeller-inner-radius").val()),
      impellerOuterRadius: Number($("#impeller-outer-radius").val()),
      impellerWidth: Number($("#impeller-width").val()),
      impellerHeight: Number($("#impeller-height").val()),
      baffleCount: Number($("#baffle-count").val()),
      baffleInnerRadius: Number($("#baffle-inner-radius").val()),
      baffleOuterRadius: Number($("#baffle-outer-radius").val()),
      baffleWidth: Number($("#baffle-width").val())
    });
  });
});
