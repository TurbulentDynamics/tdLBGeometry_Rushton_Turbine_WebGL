function getDimensionString(width, height, depth) {
  return [width, height, depth].join(",");
}

function getPolarCoordinate(x, y, z, angle) {
  return [x, y, z, (angle * Math.PI / 180).toFixed(4)].join(",");
}

$(function () {
  // Parameters
  const tankDiameter = 300;
  $("#tank-diameter").text(tankDiameter.toString());
  const tankHeight = tankDiameter;
  $("#tank-height").text(tankHeight.toString());
  const shaftRadius = tankDiameter * 2 / 75;
  $("#shaft-radius").text(shaftRadius.toString());
  const diskRadius = tankDiameter / 8;
  $("#disk-radius").text(diskRadius.toString());
  const diskHeight = tankDiameter / 75;
  $("#disk-height").text(diskHeight.toString());
  const hubRadius = tankDiameter * 4 / 75;
  $("#hub-radius").text(hubRadius.toString());
  const hubHeight = tankDiameter / 15;
  $("#hub-height").text(hubHeight.toString());
  const impellerInnerRadius = tankDiameter / 12;
  $("#impeller-inner-radius").text(shaftRadius.toString());
  const impellerOuterRadius = tankDiameter / 6;
  $("#impeller-outer-radius").text(impellerOuterRadius.toString());
  const impellerWidth = tankDiameter / 75;
  $("#impeller-width").text(impellerWidth.toString());
  const impellerHeight = tankDiameter / 15;
  $("#impeller-height").text(impellerHeight.toString());
  const baffleInnerRadius = tankDiameter * 0.4;
  $("#baffle-inner-radius").text(baffleInnerRadius.toString());
  const baffleOuterRadius = tankDiameter * 0.5;
  $("#baffle-outer-radius").text(baffleOuterRadius.toString());
  const baffleWidth = tankDiameter / 75;
  $("#baffle-width").text(baffleWidth.toString());

  // Tank
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

  // Shaft
  $("#shaft > cylinder").attr("radius", shaftRadius);
  $("#shaft > cylinder").attr("height", tankHeight);

  // Disk
  $("#disk > cylinder").attr("radius", diskRadius);
  $("#disk > cylinder").attr("height", diskHeight);

  // Hub
  $("#hub > cylinder").attr("radius", hubRadius);
  $("#hub > cylinder").attr("height", hubHeight);

  // Impellers - six
  const impellerDepth = impellerOuterRadius - impellerInnerRadius;
  $("transform.impeller").attr("translation", getDimensionString(0, 0, impellerInnerRadius + impellerDepth / 2));
  $("transform.impeller").attr("center", getDimensionString(0, 0, -(impellerInnerRadius + impellerDepth / 2)));
  $.each($("transform.impeller"), function (index, element) {
    $(element).attr("rotation", getPolarCoordinate(0, 1, 0, 60 * index));
  });
  $("transform.impeller > shape > box").attr("size", getDimensionString(impellerWidth, impellerHeight, impellerDepth));

  // Baffles - four
  const baffleDepth = baffleOuterRadius - baffleInnerRadius;
  $("transform.baffle").attr("translation", getDimensionString(0, 0, baffleInnerRadius + baffleDepth / 2));
  $("transform.baffle").attr("center", getDimensionString(0, 0, -(baffleInnerRadius + baffleDepth / 2)));
  $.each($("transform.baffle"), function (index, element) {
    $(element).attr("rotation", getPolarCoordinate(0, 1, 0, index * 90));
  });
  $("transform.baffle > shape > box").attr("size", getDimensionString(baffleWidth, tankHeight, baffleDepth));
});
