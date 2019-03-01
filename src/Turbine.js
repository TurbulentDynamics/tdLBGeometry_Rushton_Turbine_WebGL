import React, { Component } from 'react';
import PropTypes from 'prop-types';

const THREE = require('three');
var TrackballControls = require('three-trackballcontrols');
var _ = require('lodash');

class Turbine extends Component {
  colors = {
    normal: {
      tank: 0xcccccc,
      shaft: 0xdddddd,
      disk: 0xdddddd,
      hub: 0xdddddd,
      blade: 0xdddddd,
      baffle: 0xdddddd
    },
    hover: {
      tank: 0x0000ff,
      shaft: 0x00ff00,
      disk: 0x00ff00,
      hub: 0x00ff00,
      blade: 0x00ff00,
      baffle: 0x00ff00
    }
  }

  componentDidMount() {
    this.glRenderer = new THREE.WebGLRenderer({
      canvas: this.refs.painter,
      alpha: true,
      antialias: true
    });
    this.glRenderer.animate(() => this.onAnimate());

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 10000);
    this.camera.position.set(0, 0, this.props.tankDiameter * 3);
    this.scene.add(this.camera);

    this.light = new THREE.PointLight(0xffffff, 0.3);
    this.light.position.set(0, 0, this.props.tankDiameter * 3);
    this.scene.add(this.light);

    this.controls = new TrackballControls(this.camera, this.refs.painter);

    this.controls.rotateSpeed = 1.0;
    this.controls.zoomSpeed = 1.2;
    this.controls.panSpeed = 0.8;

    this.controls.noZoom = false;
    this.controls.noPan = false;

    this.controls.staticMoving = true;
    this.controls.dynamicDampingFactor = 0.3;

    this.controls.keys = [ 65, 83, 68 ];

    this.controls.addEventListener('change', () => {
      this.light.position.copy(this.camera.position);
    });
    this.startAutoRotation();

    this.raycaster = new THREE.Raycaster();
    this.normalVector = new THREE.Vector2();
    window.addEventListener('mousemove', event => {
      // calculate mouse position in normalized device coordinates
      // (-1 to +1) for both components
      this.normalVector.x = ((event.clientX - 320) / this.props.width) * 2 - 1;
      this.normalVector.y = -((event.clientY - 64) / this.props.height) * 2 + 1;

      // update the picking ray with the camera and mouse position
      this.raycaster.setFromCamera(this.normalVector, this.camera);

      // calculate objects intersecting the picking ray
      var intersects = this.raycaster.intersectObjects(this.scene.children, true);
      intersects = this.excludeTankFromIntersects(intersects);
      if (this.checkFirstObject(this.tank, intersects)) {
        this.tank.material.color.set(this.colors.hover.tank);
        this.props.onHoverObject('tank');
      } else {
        this.tank.material.color.set(this.colors.normal.tank);
      }
      if (this.checkFirstObject(this.shaft, intersects)) {
        this.shaft.material.color.set(this.colors.hover.shaft);
        this.props.onHoverObject('shaft');
      } else {
        this.shaft.material.color.set(this.colors.normal.shaft);
      }
      if (this.checkFirstObject(this.disk, intersects)) {
        this.disk.material.color.set(this.colors.hover.disk);
        this.props.onHoverObject('disk');
      } else {
        this.disk.material.color.set(this.colors.normal.disk);
      }
      if (this.checkFirstObject(this.hub, intersects)) {
        this.hub.material.color.set(this.colors.hover.hub);
        this.props.onHoverObject('hub');
      } else {
        this.hub.material.color.set(this.colors.normal.hub);
      }
      if (this.checkFirstObject(this.hub, intersects)) {
        this.hub.material.color.set(this.colors.hover.hub);
        this.props.onHoverObject('hub');
      } else {
        this.hub.material.color.set(this.colors.normal.hub);
      }
      this.blades.forEach((blade, index) => {
        if (this.checkFirstObject(blade, intersects)) {
          this.blades[index].material.color.set(this.colors.hover.blade);
          this.props.onHoverObject('blade');
        } else {
          this.blades[index].material.color.set(this.colors.normal.blade);
        }
      });
      this.baffles.forEach((baffle, index) => {
        if (this.checkFirstObject(baffle, intersects)) {
          this.baffles[index].material.color.set(this.colors.hover.baffle);
          this.props.onHoverObject('baffle');
        } else {
          this.baffles[index].material.color.set(this.colors.normal.baffle);
        }
      });
    });

    this.createAxis(this.props.tankDiameter, this.props.tankHeight);
    this.createPlane();

    this.createTank();
    this.createShaft();
    this.createDisk();
    this.createHub();

    this.blades = [];
    this.changeBladeCount(this.props.bladeCount, 0);
    this.baffles = [];
    this.changeBaffleCount(this.props.baffleCount, 0);

    this.kernelAngle = 0;
  }

  componentWillUnmount() {
    this.stopAutoRotation();
    this.controls.dispose();
    delete this.controls;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.width !== this.props.width || nextProps.height !== this.props.height) {
      this.glRenderer.setSize(nextProps.width, nextProps.height);
      this.camera.aspect = nextProps.width / nextProps.height;
      this.camera.updateProjectionMatrix();
    }

    if (nextProps.tankDiameter !== this.props.tankDiameter || nextProps.tankHeight !== this.props.tankHeight) {
      this.scene.remove(this.axis);
      this.scene.remove(this.xArrow);
      this.scene.remove(this.xLabel);
      this.scene.remove(this.yArrow);
      this.scene.remove(this.yLabel);
      this.scene.remove(this.zArrow);
      this.scene.remove(this.zLabel);
      this.createAxis(nextProps.tankDiameter, nextProps.tankHeight);
    }

    if (nextProps.kernelAutoRotation && !this.props.kernelAutoRotation) {
      this.startAutoRotation();
    } else if (!nextProps.kernelAutoRotation && this.props.kernelAutoRotation) {
      this.stopAutoRotation();
    }

    if (nextProps.bladeCount !== this.props.bladeCount) {
      this.changeBladeCount(nextProps.bladeCount, this.props.bladeCount);
    }
    if (nextProps.bladeInnerRadius !== this.props.bladeInnerRadius || nextProps.bladeOuterRadius !== this.props.bladeOuterRadius || nextProps.bladeWidth !== this.props.bladeWidth || nextProps.bladeHeight !== this.props.bladeHeight) {
      this.changeBladeGeometry(nextProps.bladeInnerRadius, nextProps.bladeOuterRadius, nextProps.bladeWidth, nextProps.bladeHeight);
    }
    if (nextProps.baffleCount !== this.props.baffleCount) {
      this.changeBaffleCount(nextProps.baffleCount, this.props.baffleCount);
    }

    if (!_.isEqual(nextProps, this.props)) {
      this.updatePlane(nextProps);
      this.updateTank(nextProps);
      this.updateShaft(nextProps);
      this.updateDisk(nextProps);
      this.updateHub(nextProps);
      this.updateBlades(nextProps);
      this.updateBaffles(nextProps);
    }
  }

  startAutoRotation() {
    this.timerId = window.setInterval(() => {
      switch (this.props.kernelRotationDir) {
        case 'clockwise':
          this.kernelAngle = (this.kernelAngle + 4) % 360;
          this.updateBlades(this.props);
          break;
        case 'counter-clockwise':
          this.kernelAngle = (this.kernelAngle - 4) % 360;
          this.updateBlades(this.props);
          break;
        default:
          break;
      }
    }, 60);
  }

  stopAutoRotation() {
    if (this.timerId) {
      window.clearInterval(this.timerId);
    }
  }

  onAnimate() {
    // we will get this callback every frame

    // pretend cubeRotation is immutable.
    // this helps with updates and pure rendering.
    // React will be sure that the rotation has now updated.
    // this.setState({
    //   cubeRotation: new THREE.Euler(
    //     this.props.cubeRotation.x + 0.1,
    //     this.props.cubeRotation.y + 0.1,
    //     0
    //   )
    // });
    this.controls.update();

    this.glRenderer.render(this.scene, this.camera);
  }

  createAxis(tankDiameter, tankHeight) {
    this.axis = new THREE.AxisHelper(Math.max(tankDiameter, tankHeight));
    var offset = new THREE.Vector3(-(tankDiameter / 2), tankHeight / 2, tankDiameter / 2);
    // Don't change the coordinate system and display the axis reversely
    var positionEndAxes = this.axis.geometry.attributes.position;
    this.axis.geometry.attributes.position.setY(3, -positionEndAxes.getY(3));
    this.axis.geometry.attributes.position.setZ(5, -positionEndAxes.getZ(5));
    // Don't change the coordinate system and move the axis
    this.axis.position.add(offset);
    this.scene.add(this.axis);

    var loader = new THREE.FontLoader();
    loader.load('fonts/helvetiker_regular.typeface.json', font => {
      var geoOption = {
        font: font,
        size: 10,
        height: 2,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 2,
        bevelSize: 2,
        bevelSegments: 5
      };

      // Position of axes extremities
      var xGeometry = new THREE.TextGeometry('X', geoOption);
      var xMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color(0xff0000)
      });
      this.xLabel = new THREE.Mesh(xGeometry, xMaterial);
      var xPos = new THREE.Vector3(positionEndAxes.getX(1), positionEndAxes.getY(1), positionEndAxes.getZ(1));
      xPos.add(offset);
      this.xLabel.position.copy(xPos).add(new THREE.Vector3(0, 10, 0));
      this.scene.add(this.xLabel);
      this.xArrow = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), 20, 0xff0000, 10, 5);
      this.xArrow.position.copy(xPos);
      this.scene.add(this.xArrow);

      var yGeometry = new THREE.TextGeometry('Y', geoOption);
      var yMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color(0x00ff00)
      });
      this.yLabel = new THREE.Mesh(yGeometry, yMaterial);
      var yPos = new THREE.Vector3(positionEndAxes.getX(3), positionEndAxes.getY(3), positionEndAxes.getZ(3));
      yPos.add(offset);
      this.yLabel.position.copy(yPos).add(new THREE.Vector3(0, -10, 10));
      this.yLabel.rotation.set(-Math.PI, Math.PI / 2, 0);
      this.scene.add(this.yLabel);
      this.yArrow = new THREE.ArrowHelper(new THREE.Vector3(0, -1, 0), new THREE.Vector3(0, 0, 0), 20, 0x00ff00, 10, 5);
      this.yArrow.position.copy(yPos);
      this.scene.add(this.yArrow);

      var zGeometry = new THREE.TextGeometry('Z', geoOption);
      var zMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color(0x0000ff)
      });
      this.zLabel = new THREE.Mesh(zGeometry, zMaterial);
      var zPos = new THREE.Vector3(positionEndAxes.getX(5), positionEndAxes.getY(5), positionEndAxes.getZ(5));
      zPos.add(offset);
      this.zLabel.position.copy(zPos).add(new THREE.Vector3(0, -10, 0));
      this.zLabel.rotation.set(-Math.PI, -(Math.PI / 2), 0);
      this.scene.add(this.zLabel);
      this.zArrow = new THREE.ArrowHelper(new THREE.Vector3(0, 0, -1), new THREE.Vector3(0, 0, 0), 20, 0x0000ff, 10, 5);
      this.zArrow.position.copy(zPos);
      this.scene.add(this.zArrow);
    });
  }

  createPlane() {
    this.grid = new THREE.GridHelper(1000, 50);
    this.grid.position.y = -(this.props.tankHeight / 2);
    this.scene.add(this.grid);
  }

  updatePlane(props) {
    this.grid.position.y = -(props.tankHeight / 2);
  }

  createTankGeometry({ tankDiameter, tankHeight }) {
    return new THREE.CylinderGeometry(tankDiameter / 2, tankDiameter / 2, tankHeight, 30);
  }

  createTank() {
    var geometry = this.createTankGeometry(this.props);
    var material = new THREE.MeshLambertMaterial({
      color: 0xcccccc,
      opacity: 0.2,
      transparent: true,
      side: THREE.DoubleSide
    });
    this.tank = new THREE.Mesh(geometry, material);
    this.scene.add(this.tank);
  }

  updateTank(props) {
    delete this.tank.geometry;
    this.tank.geometry = this.createTankGeometry(props);
  }

  createShaftGeometry({ shaftRadius, tankHeight }) {
    return new THREE.CylinderGeometry(shaftRadius, shaftRadius, tankHeight, 30);
  }

  createShaft() {
    var geometry = this.createShaftGeometry(this.props);
    var material = new THREE.MeshPhongMaterial({
      color: 0xdddddd
    });
    this.shaft = new THREE.Mesh(geometry, material);
    this.scene.add(this.shaft);
  }

  updateShaft(props) {
    delete this.shaft.geometry;
    this.shaft.geometry = this.createShaftGeometry(props);
  }

  createDiskGeometry({ diskRadius, diskHeight }) {
    return new THREE.CylinderGeometry(diskRadius, diskRadius, diskHeight, 30);
  }

  createDisk() {
    var geometry = this.createDiskGeometry(this.props);
    var material = new THREE.MeshPhongMaterial({
      color: 0xdddddd
    });
    this.disk = new THREE.Mesh(geometry, material);
    this.disk.position.set(0, -(this.props.tankHeight / 6), 0);
    this.scene.add(this.disk);
  }

  updateDisk(props) {
    delete this.disk.geometry;
    this.disk.geometry = this.createDiskGeometry(props);
    this.disk.position.set(0, -(props.tankHeight / 6), 0);
  }

  createHubGeometry({ hubRadius, hubHeight }) {
    return new THREE.CylinderGeometry(hubRadius, hubRadius, hubHeight, 30);
  }

  createHub() {
    var geometry = this.createHubGeometry(this.props);
    var material = new THREE.MeshPhongMaterial({
      color: 0xdddddd
    });
    this.hub = new THREE.Mesh(geometry, material);
    this.hub.position.set(0, -(this.props.tankHeight / 6), 0);
    this.scene.add(this.hub);
  }

  updateHub(props) {
    delete this.hub.geometry;
    this.hub.geometry = this.createHubGeometry(props);
    this.hub.position.set(0, -(props.tankHeight / 6), 0);
  }

  changeBladeCount(newValue: number, oldValue: number) {
    var i;
    if (newValue < oldValue) {
      for (i = oldValue - 1; i >= newValue; i--) {
        this.scene.remove(this.blades[i]);
        this.blades.pop();
        delete this.blades[i];
      }
    } else if (newValue > oldValue) {
      for (i = oldValue; i < newValue; i++) {
        var blade = new THREE.BoxGeometry(this.props.bladeWidth, this.props.bladeHeight, this.props.bladeOuterRadius - this.props.bladeInnerRadius);
        var material = new THREE.MeshPhongMaterial({ color: 0xeeeeee });
        var mesh = new THREE.Mesh(blade, material);
        this.blades.push(mesh);
        this.scene.add(mesh);
      }
    }
  }

  changeBladeGeometry(innerRadius: number, outerRadius: number, width: number, height: number) {
    for (var i = 0; i < this.blades.length; i++) {
      delete this.blades[i].geometry;
      this.blades[i].geometry = new THREE.BoxGeometry(width, height, outerRadius - innerRadius);
    }
  }

  updateBlades({ bladeInnerRadius, bladeOuterRadius, tankHeight }) {
    var distance = (bladeInnerRadius + bladeOuterRadius) / 2;
    var yAxis = new THREE.Vector3(0, 1, 0);
    var offset = new THREE.Vector3(0, -(tankHeight / 6), 0);
    for (var i = 0; i < this.blades.length; i++) {
      var angle = (360 * i / this.blades.length + this.kernelAngle) % 360;
      angle = 2 * Math.PI * angle / 360;
      this.blades[i].position.set(0, 0, distance);
      this.blades[i].position.applyAxisAngle(yAxis, angle);
      this.blades[i].position.add(offset);
      this.blades[i].rotation.set(0, angle, 0);
    }
  }

  createBaffleGeometry({ baffleInnerRadius, baffleOuterRadius, baffleWidth, tankHeight }) {
    return new THREE.BoxGeometry(baffleWidth, tankHeight, baffleOuterRadius - baffleInnerRadius);
  }

  changeBaffleCount(newValue: number, oldValue: number) {
    var i;
    if (newValue < oldValue) {
      for (i = oldValue - 1; i >= newValue; i--) {
        this.scene.remove(this.baffles[i]);
        this.baffles.pop();
        delete this.baffles[i];
      }
    } else if (newValue > oldValue) {
      for (i = oldValue; i < newValue; i++) {
        var baffle = this.createBaffleGeometry(this.props);
        var material = new THREE.MeshPhongMaterial({ color: 0xeeeeee });
        var mesh = new THREE.Mesh(baffle, material);
        this.baffles.push(mesh);
        this.scene.add(mesh);
      }
    }
  }

  updateBaffles(props) {
    const { baffleInnerRadius, baffleOuterRadius } = props;
    var distance = (baffleInnerRadius + baffleOuterRadius) / 2;
    var yAxis = new THREE.Vector3(0, 1, 0);
    for (var i = 0; i < this.baffles.length; i++) {
      delete this.baffles[i].geometry;
      this.baffles[i].geometry = this.createBaffleGeometry(props);
      var angle = 2 * Math.PI * i / this.baffles.length;
      this.baffles[i].position.set(0, 0, distance);
      this.baffles[i].position.applyAxisAngle(yAxis, angle);
      this.baffles[i].rotation.set(0, angle, 0);
    }
  }

  excludeTankFromIntersects(intersects: Array) {
    var onlyTank = true;
    intersects.forEach(intersect => {
      if (intersect.object.uuid !== this.tank.uuid) {
        onlyTank = false;
        return false;
      }
    }, this);
    if (onlyTank) {
      return intersects;
    }
    return intersects.filter((intersect, index) => {
      return intersect.object.uuid !== this.tank.uuid;
    }, this);
  }

  checkFirstObject(needle: THREE.Object3D, haystack: Array) {
    if (haystack.length > 0) {
      return needle.uuid === haystack[0].object.uuid;
    } else {
      return false;
    }
  }

  render() {
    return (
      <canvas ref="painter" width={this.props.width} height={this.props.height}></canvas>
    );
  }
}

Turbine.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  tankDiameter: PropTypes.number.isRequired,
  tankHeight: PropTypes.number.isRequired,
  shaftRadius: PropTypes.number.isRequired,
  kernelAutoRotation: PropTypes.bool,
  kernelRotationDir: PropTypes.string,
  diskRadius: PropTypes.number.isRequired,
  diskHeight: PropTypes.number.isRequired,
  hubRadius: PropTypes.number.isRequired,
  hubHeight: PropTypes.number.isRequired,
  bladeCount: PropTypes.number.isRequired,
  bladeInnerRadius: PropTypes.number.isRequired,
  bladeOuterRadius: PropTypes.number.isRequired,
  bladeWidth: PropTypes.number.isRequired,
  bladeHeight: PropTypes.number.isRequired,
  baffleCount: PropTypes.number.isRequired,
  baffleInnerRadius: PropTypes.number.isRequired,
  baffleOuterRadius: PropTypes.number.isRequired,
  baffleWidth: PropTypes.number.isRequired,
  onHoverObject: PropTypes.func
};

export default Turbine;
