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
  var diskRadius = tankDiameter / 8;
  $("#disk-radius").text(diskRadius.toString());
  var diskHeight = tankDiameter / 75;
  $("#disk-height").text(diskHeight.toString());
  var hubRadius = tankDiameter * 4 / 75;
  $("#hub-radius").text(hubRadius.toString());
  var hubHeight = tankDiameter / 15;
  $("#hub-height").text(hubHeight.toString());

  // Impeller-related parameters
  $("#impeller-count").val(impellerCount.toString());
  var impellerInnerRadius = tankDiameter / 12;
  $("#impeller-inner-radius").text(shaftRadius.toString());
  var impellerOuterRadius = tankDiameter / 6;
  $("#impeller-outer-radius").text(impellerOuterRadius.toString());
  var impellerWidth = tankDiameter / 75;
  $("#impeller-width").text(impellerWidth.toString());
  var impellerHeight = tankDiameter / 15;
  $("#impeller-height").text(impellerHeight.toString());

  // Baffle-related parameters
  $("#baffle-count").val(baffleCount.toString());
  var baffleInnerRadius = tankDiameter * 0.4;
  $("#baffle-inner-radius").text(baffleInnerRadius.toString());
  var baffleOuterRadius = tankDiameter * 0.5;
  $("#baffle-outer-radius").text(baffleOuterRadius.toString());
  var baffleWidth = tankDiameter / 75;
  $("#baffle-width").text(baffleWidth.toString());

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

  // The surface of rigid body
  $("material.rigid-surface").attr("ambientIntensity", 0.2);
  $("material.rigid-surface").attr("diffuseColor", "0.8,0.8,0.8");
  $("material.rigid-surface").attr("emissiveColor", "0,0,0");
  $("material.rigid-surface").attr("shininess", 0.2);
  $("material.rigid-surface").attr("specularColor", "0,0,0");

  // Shaft model
  $("#shaft > cylinder").attr("radius", shaftRadius);
  $("#shaft > cylinder").attr("height", tankHeight);

  // Disk model
  $("#disk > cylinder").attr("radius", diskRadius);
  $("#disk > cylinder").attr("height", diskHeight);

  // Hub model
  $("#hub > cylinder").attr("radius", hubRadius);
  $("#hub > cylinder").attr("height", hubHeight);

  // Impeller models
  var changeOfImpellers = impellerCount - $("transform.impeller").length;
  if (changeOfImpellers > 0) {
    for (var i = 0; i < changeOfImpellers; i++)
      increaseImpeller();
  } else if (changeOfBaffles < 0) {
    for (var i = 0; i < -changeOfImpellers; i++)
      decreaseImpeller();
  }
  var impellerDepth = impellerOuterRadius - impellerInnerRadius;
  $("transform.impeller").attr("translation", getDimensionString(0, 0, impellerInnerRadius + impellerDepth / 2));
  $("transform.impeller").attr("center", getDimensionString(0, 0, -(impellerInnerRadius + impellerDepth / 2)));
  $.each($("transform.impeller"), function (index, element) {
    $(element).attr("rotation", getPolarCoordinate(0, 1, 0, 360 * index / impellerCount));
  });
  $("transform.impeller > shape > box").attr("size", getDimensionString(impellerWidth, impellerHeight, impellerDepth));

  // Baffle models
  var changeOfBaffles = baffleCount - $("transform.baffle").length;
  if (changeOfBaffles > 0) {
    for (var i = 0; i < changeOfBaffles; i++)
      increaseBaffle();
  } else if (changeOfBaffles < 0) {
    for (var i = 0; i < -changeOfBaffles; i++)
      decreaseBaffle();
  }
  var baffleDepth = baffleOuterRadius - baffleInnerRadius;
  $("transform.baffle").attr("translation", getDimensionString(0, 0, baffleInnerRadius + baffleDepth / 2));
  $("transform.baffle").attr("center", getDimensionString(0, 0, -(baffleInnerRadius + baffleDepth / 2)));
  $.each($("transform.baffle"), function (index, element) {
    $(element).attr("rotation", getPolarCoordinate(0, 1, 0, 360 * index / baffleCount));
  });
  $("transform.baffle > shape > box").attr("size", getDimensionString(baffleWidth, tankHeight, baffleDepth));
}

function increaseImpeller() {
  var transform = document.createElement('transform');
  transform.className = "impeller";
  var shape = document.createElement("shape");
  $(transform).append(shape);
  var appearance = document.createElement("appearance");
  $(shape).append(appearance);
  var material = document.createElement("material");
  material.className = "rigid-surface";
  $(appearance).append(material);
  var box = document.createElement("box");
  $(shape).append(box);
  $("#kernel").append(transform);
}

function decreaseImpeller() {
  var lastImpeller = $("transform.impeller:last")[0];
  lastImpeller.parentNode.removeChild(lastImpeller);
  lastImpeller.remove();
}

function increaseBaffle() {
  var transform = document.createElement('transform');
  transform.className = "baffle";
  var shape = document.createElement("shape");
  $(transform).append(shape);
  var appearance = document.createElement("appearance");
  $(shape).append(appearance);
  var material = document.createElement("material");
  material.className = "rigid-surface";
  $(appearance).append(material);
  var box = document.createElement("box");
  $(shape).append(box);
  $("scene > transform").append(transform);
}

function decreaseBaffle() {
  var lastBaffle = $("scene > transform > transform.baffle:last")[0];
  lastBaffle.parentNode.removeChild(lastBaffle);
  lastBaffle.remove();
}

$(function () {
  setUp(300, 6, 4);
  $("#submit").click(function () {
    setUp($("#tank-diameter").val(), $("#impeller-count").val(), $("#baffle-count").val());
  });
});
