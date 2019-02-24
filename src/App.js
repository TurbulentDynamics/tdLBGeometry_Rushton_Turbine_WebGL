import React, { Component } from 'react';
import { Checkbox, Icon, InputNumber, Layout, Menu } from 'antd';
import React3 from 'react-three-renderer';

import 'antd/dist/antd.css';
import './App.css';

const { Content, Header, Sider } = Layout;
const SubMenu = Menu.SubMenu;

const THREE = require('three');
var TrackballControls = require('three-trackballcontrols');

class App extends Component {
  constructor(props) {
    super(props);

    const unit = 300;
    this.state = {
      cameraPosition: new THREE.Vector3(0, 0, unit * 4 / 3),
      cubeRotation: new THREE.Euler(),
      tankDiameter: unit,
      tankHeight: unit,
      shaftRadius: unit * 2 / 75,
      kernelPosition: new THREE.Vector3(0, -(unit / 6), 0),
      kernelAngle: 0,
      kernelAutoRotation: true,
      diskRadius: unit / 8,
      diskHeight: unit / 75,
      hubRadius: unit * 4 / 75,
      hubHeight: unit / 15,
      bladeCount: 6,
      bladeInnerRadius: unit / 12,
      bladeOuterRadius: unit / 6,
      bladeWidth: unit / 75,
      bladeHeight: unit / 15,
      baffleCount: 4,
      baffleInnerRadius: unit * 2 / 5,
      baffleOuterRadius: unit / 2,
      baffleWidth: unit / 75
    };
  }

  componentDidMount() {
    let content = document.querySelector('.ant-layout-content');
    this.controls = new TrackballControls(this.refs.camera, content);

    this.controls.rotateSpeed = 1.0;
    this.controls.zoomSpeed = 1.2;
    this.controls.panSpeed = 0.8;

    this.controls.noZoom = false;
    this.controls.noPan = false;

    this.controls.staticMoving = true;
    this.controls.dynamicDampingFactor = 0.3;

    this.controls.keys = [ 65, 83, 68 ];

    this.refs.light.position.copy(this.refs.camera.position);
    this.controls.addEventListener('change', () => {
      this.state.cameraPosition.copy(this.refs.camera.position);
      this.refs.light.position.copy(this.refs.camera.position);
      this.render();
    });
    this.startAutoRotation();
  }

  startAutoRotation() {
    this.timerId = window.setInterval(() => {
      this.setState({ kernelAngle: (this.state.kernelAngle + 4) % 360 });
    }, 60);
  }

  stopAutoRotation() {
    if (this.timerId) {
      window.clearInterval(this.timerId);
    }
  }

  componentWillUnmount() {
    this.stopAutoRotation();
    this.controls.dispose();
    delete this.controls;
  }

  handleAnimate() {
    // we will get this callback every frame

    // pretend cubeRotation is immutable.
    // this helps with updates and pure rendering.
    // React will be sure that the rotation has now updated.
    this.setState({
      cubeRotation: new THREE.Euler(
        this.state.cubeRotation.x + 0.1,
        this.state.cubeRotation.y + 0.1,
        0
      )
    });
    this.controls.update();
  }

  handleChange(field, value) {
    this.setState({ [field]: value });
  }

  handleAutoRotation(event) {
    this.setState({ kernelAutoRotation: event.target.checked });
    if (event.target.checked) {
      this.startAutoRotation();
    } else {
      this.stopAutoRotation();
    }
  }

  render() {
    const width = window.innerWidth - 250;
    const height = window.innerHeight - 64;

    let axis = new THREE.Vector3(0, 1, 0);
    let bladeAngles = [];
    for (let i = 0; i < this.state.bladeCount; i++) {
      let angle = 2 * Math.PI * i / this.state.bladeCount + this.state.kernelAngle;
      bladeAngles.push(angle);
    }
    let baffleAngles = [];
    for (let i = 0; i < this.state.baffleCount; i++) {
      let angle = 2 * Math.PI * i / this.state.baffleCount;
      baffleAngles.push(angle);
    }

    return (
      <div className="App">
        <Layout style={{ height: '100%' }}>
          <Sider width={250} style={{ overflowY: 'auto' }}>
            <div className="logo"></div>
            <Menu theme="dark" mode="inline">
              <SubMenu key="1" title={<span><Icon type="mail" /><span>Tank</span></span>}>
                <Menu.Item key="1">
                  <span>Diameter</span>
                  <InputNumber min={100} defaultValue={this.state.tankDiameter} onChange={(value) => this.handleChange('tankDiameter', value)} />
                </Menu.Item>
                <Menu.Item key="2">
                  <span>Height</span>
                  <InputNumber min={100} defaultValue={this.state.tankHeight} onChange={(value) => this.handleChange('tankHeight', value)} />
                </Menu.Item>
              </SubMenu>
              <SubMenu key="2" title={<span><Icon type="mail" /><span>Shaft</span></span>}>
                <Menu.Item key="1">
                  <span>Radius</span>
                  <InputNumber min={1} defaultValue={this.state.shaftRadius} onChange={(value) => this.handleChange('shaftRadius', value)} />
                </Menu.Item>
              </SubMenu>
              <SubMenu key="3" title={<span><Icon type="mail" /><span>Disk</span></span>}>
                <Menu.Item key="1">
                  <span>Radius</span>
                  <InputNumber min={1} defaultValue={this.state.diskRadius} onChange={(value) => this.handleChange('diskRadius', value)} />
                </Menu.Item>
                <Menu.Item key="2">
                  <span>Height</span>
                  <InputNumber min={1} defaultValue={this.state.diskHeight} onChange={(value) => this.handleChange('diskHeight', value)} />
                </Menu.Item>
              </SubMenu>
              <SubMenu key="4" title={<span><Icon type="mail" /><span>Hub</span></span>}>
                <Menu.Item key="1">
                  <span>Radius</span>
                  <InputNumber min={1} defaultValue={this.state.hubRadius} onChange={(value) => this.handleChange('hubRadius', value)} />
                </Menu.Item>
                <Menu.Item key="2">
                  <span>Height</span>
                  <InputNumber min={1} defaultValue={this.state.hubHeight} onChange={(value) => this.handleChange('hubHeight', value)} />
                </Menu.Item>
              </SubMenu>
              <SubMenu key="5" title={<span><Icon type="mail" /><span>Blade</span></span>}>
                <Menu.Item key="1">
                  <span>Count</span>
                  <InputNumber min={1} defaultValue={this.state.bladeCount} onChange={(value) => this.handleChange('bladeCount', value)} />
                </Menu.Item>
                <Menu.Item key="2">
                  <span>Inner Radius</span>
                  <InputNumber min={1} defaultValue={this.state.bladeInnerRadius} onChange={(value) => this.handleChange('bladeInnerRadius', value)} />
                </Menu.Item>
                <Menu.Item key="3">
                  <span>Outer Radius</span>
                  <InputNumber min={1} defaultValue={this.state.bladeOuterRadius} onChange={(value) => this.handleChange('bladeOuterRadius', value)} />
                </Menu.Item>
                <Menu.Item key="4">
                  <span>Width</span>
                  <InputNumber min={1} defaultValue={this.state.bladeWidth} onChange={(value) => this.handleChange('bladeWidth', value)} />
                </Menu.Item>
                <Menu.Item key="5">
                  <span>Height</span>
                  <InputNumber min={1} defaultValue={this.state.bladeHeight} onChange={(value) => this.handleChange('bladeHeight', value)} />
                </Menu.Item>
                <Menu.Item key="6">
                  <Checkbox checked={this.state.kernelAutoRotation} onChange={this.handleAutoRotation.bind(this)}>Auto Rotation</Checkbox>
                </Menu.Item>
              </SubMenu>
              <SubMenu key="6" title={<span><Icon type="mail" /><span>Baffle</span></span>}>
                <Menu.Item key="1">
                  <span>Count</span>
                  <InputNumber min={1} defaultValue={this.state.baffleCount} onChange={(value) => this.handleChange('baffleCount', value)} />
                </Menu.Item>
                <Menu.Item key="2">
                  <span>Inner Radius</span>
                  <InputNumber min={1} defaultValue={this.state.baffleInnerRadius} onChange={(value) => this.handleChange('baffleInnerRadius', value)} />
                </Menu.Item>
                <Menu.Item key="3">
                  <span>Outer Radius</span>
                  <InputNumber min={1} defaultValue={this.state.baffleOuterRadius} onChange={(value) => this.handleChange('baffleOuterRadius', value)} />
                </Menu.Item>
                <Menu.Item key="4">
                  <span>Width</span>
                  <InputNumber min={1} defaultValue={this.state.baffleWidth} onChange={(value) => this.handleChange('baffleWidth', value)} />
                </Menu.Item>
              </SubMenu>
            </Menu>
          </Sider>
          <Layout>
            <Header>
              <h1>Turbulent Dynamics</h1>
            </Header>
            <Content style={{ overflowY: 'hidden' }}>
              <React3 mainCamera="camera" width={width} height={height} alpha={true} onAnimate={() => this.handleAnimate()}>
                <scene>
                  <perspectiveCamera
                    ref="camera"
                    name="camera"
                    fov={75}
                    aspect={width / height}
                    near={0.1}
                    far={1000}
                    position={this.state.cameraPosition}
                  />
                  <pointLight ref="light" position={this.state.cameraPosition} intensity={0.3} />
                  <axisHelper size={this.state.tankDiameter} />
                  <mesh rotation={new THREE.Euler(-(Math.PI / 2), 0, 0)} position={new THREE.Vector3(0, -(this.state.tankHeight / 2), 0)}>
                    <planeGeometry width={this.state.tankDiameter * 2} height={this.state.tankDiameter * 2} widthSegments={100} heightSegments={1000} />
                    <meshLambertMaterial color={0xffff00} opacity={0.5} transparent={true} side={THREE.DoubleSide} />
                  </mesh>
                  <mesh rotation={this.state.cubeRotation}>
                    <boxGeometry
                      width={1}
                      height={1}
                      depth={1}
                    />
                    <meshBasicMaterial color={0x00ff00} />
                  </mesh>
                  <mesh>
                    <cylinderGeometry
                      radiusTop={this.state.tankDiameter / 2}
                      radiusBottom={this.state.tankDiameter / 2}
                      height={this.state.tankHeight}
                      radialSegments={30}
                    />
                    <meshLambertMaterial color={0xcccccc} opacity={0.2} transparent={true} side={THREE.DoubleSide} />
                  </mesh>
                  <mesh>
                    <cylinderGeometry
                      radiusTop={this.state.shaftRadius}
                      radiusBottom={this.state.shaftRadius}
                      height={this.state.tankHeight}
                      radialSegments={30}
                    />
                    <meshPhongMaterial color={0xdddddd} />
                  </mesh>
                  <mesh position={this.state.kernelPosition}>
                    <cylinderGeometry
                      radiusTop={this.state.diskRadius}
                      radiusBottom={this.state.diskRadius}
                      height={this.state.diskHeight}
                      radialSegments={30}
                    />
                    <meshPhongMaterial color={0xeeeeee} />
                  </mesh>
                  <mesh position={this.state.kernelPosition}>
                    <cylinderGeometry
                      radiusTop={this.state.hubRadius}
                      radiusBottom={this.state.hubRadius}
                      height={this.state.hubHeight}
                      radialSegments={30}
                    />
                    <meshPhongMaterial color={0xeeeeee} />
                  </mesh>
                  {bladeAngles.map((angle, index) => {
                    let distance = (this.state.bladeInnerRadius + this.state.bladeOuterRadius) / 2;
                    let position = new THREE.Vector3(0, 0, distance).applyAxisAngle(new THREE.Vector3(0, 1, 0), angle).add(this.state.kernelPosition);
                    let rotation = new THREE.Euler(0, angle, 0);
                    return (
                      <mesh key={'blade' + index} position={position} rotation={rotation}>
                        <boxGeometry
                          width={this.state.bladeWidth}
                          height={this.state.bladeHeight}
                          depth={this.state.bladeOuterRadius - this.state.bladeInnerRadius}
                        />
                        <meshPhongMaterial color={0xeeeeee} />
                      </mesh>
                    );
                  })}
                  {baffleAngles.map((angle, index) => {
                    let distance = (this.state.baffleInnerRadius + this.state.baffleOuterRadius) / 2;
                    let position = new THREE.Vector3(0, 0, distance).applyAxisAngle(new THREE.Vector3(0, 1, 0), angle);
                    let rotation = new THREE.Euler(0, angle, 0);
                    return (
                      <mesh key={'baffle' + index} position={position} rotation={rotation}>
                        <boxGeometry
                          width={this.state.baffleWidth}
                          height={this.state.tankHeight}
                          depth={this.state.baffleOuterRadius - this.state.baffleInnerRadius}
                        />
                        <meshPhongMaterial color={0xeeeeee} />
                      </mesh>
                    );
                  })}
                </scene>
              </React3>
            </Content>
          </Layout>
        </Layout>
      </div>
    );
  }
}

export default App;
