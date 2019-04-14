import React, { Component } from 'react';
import { Checkbox, Icon, InputNumber, Layout, Menu, Radio } from 'antd';
import Turbine from './Turbine';

import 'antd/dist/antd.css';
import './App.css';
import jQuery from 'jquery';

const { Content, Header, Sider } = Layout;

export default class App extends Component {
  constructor(props) {
    super(props);

    const unit = 300;
    this.state = {
      canvasWidth: 50,
      canvasHeight: 50,
      tankDiameter: unit,
      tankHeight: unit,
      shaftRadius: unit * 2 / 75,
      kernelAutoRotation: true,
      kernelRotationDir: 'clockwise',
      baffleCount: 4,
      baffleInnerRadius: unit * 2 / 5,
      baffleOuterRadius: unit / 2,
      baffleWidth: unit / 75,

      impellerCount: 3,
      hubRadius: [unit * 4 / 75, unit * 4 / 75, unit * 4 / 75],
      hubHeight: [unit / 15, unit / 15, unit / 15],
      diskRadius: [unit / 8, unit / 8, unit / 8],
      diskHeight: [unit / 75, unit / 75, unit / 75],
      bladeCount: [6, 6, 6],
      bladeInnerRadius: [unit / 12, unit / 12, unit / 12],
      bladeOuterRadius: [unit / 6, unit / 6, unit / 6],
      bladeWidth: [unit / 75, unit / 75, unit / 75],
      bladeHeight: [unit / 15, unit / 15, unit / 15],

      transPanXY: 0,
      transPanYZ: 0,
      transPanXZ: 0,
      transRotateAngle: 0,
      transEnableXY: false,
      transEnableYZ: false,
      transEnableXZ: false,
      transEnableImpeller: false,
      transEnableRotate: false,
      hoverObject: '',
      setting:''
    };
    this.fileReader = new FileReader();
    this.fileReader.onload = (event) => {
      // or do whatever manipulation you want on JSON.parse(event.target.result) here.

      var jsonData = JSON.parse(event.target.result);

      var hubRadius = [];
      var hubHeight = [];
      var diskRadius = [];
      var diskHeight = [];
      var bladeCount = [];
      var bladeInnerRadius = [];
      var bladeOuterRadius = [];
      var bladeWidth = [];
      var bladeHeight = [];

      var keyArr = Object.keys(jsonData.impeller);
  
      keyArr.forEach(key => {
        hubRadius[key] = jsonData.impeller[key].hub.radius;
        hubHeight[key] = jsonData.impeller[key].hub.top
        diskRadius[key] = jsonData.impeller[key].disk.radius;
        diskHeight[key] = jsonData.impeller[key].disk.top;
        bladeCount[key] = jsonData.impeller[key].numBlades;
        bladeInnerRadius[key] = jsonData.impeller[key].blades.innerRadius;
        bladeOuterRadius[key] = jsonData.impeller[key].blades.outerRadius;
        bladeWidth[key] = jsonData.impeller[key].blades.bladeThickness;
        bladeHeight[key] = jsonData.impeller[key].blades.top;
      });
 
      var importJsonData = {
        tankDiameter: jsonData.tankDiameter,
        tankHeight: jsonData.gridx,
        shaftRadius: jsonData.shaft.radius,
        baffleCount: jsonData.baffles.numBaffles,
        baffleInnerRadius: jsonData.baffles.innerRadius,
        baffleOuterRadius: jsonData.baffles.outerRadius,
        baffleWidth: jsonData.baffles.thickness,

        impellerCount : jsonData.numImpellers,
        hubRadius: hubRadius,
        hubHeight: hubHeight,
        diskRadius: diskRadius,
        diskHeight: diskHeight,
        bladeCount: bladeCount,
        bladeInnerRadius: bladeInnerRadius,
        bladeOuterRadius: bladeOuterRadius,
        bladeWidth: bladeWidth,
        bladeHeight: bladeHeight,
      };
      Object.keys(importJsonData).forEach(key => {
        this.setState({ [key]: importJsonData[key] });
      });
    };
  }

  componentDidMount() {
    this.setState({
      canvasWidth: window.innerWidth - 320,
      canvasHeight: window.innerHeight - 64
    });
    this.handleResize = () => {
      this.setState({
        canvasWidth: window.innerWidth - 320,
        canvasHeight: window.innerHeight - 64
      });
    }
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleChange(field, value) {
    this.setState({ [field]: value });
  }
  handleImpellerChange(field, value, num) {
    const updatedInfo = this.state[field].map((item, idx) => {
      if(idx === num) {
        item = value;
      }
      return item;
    })
    this.setState({[field]: updatedInfo});
  }
  handleTransEnable(field, value) {
    setTimeout(() => {
      this.setState({ [field]: value.target.checked });
    }, 100);
    
  }

  handleAutoRotation(event) {
    this.setState({ kernelAutoRotation: event.target.checked });
  }

  handleRadio(event) {
    this.setState({ kernelRotationDir: event.target.value });
  }

  handleHoverObject(name) {
    this.setState({ hoverObject: name });
  }

  handleSetting(type) {
    this.setState({setting:type});
    setTimeout(() => {
      this.setState({setting:''});
    }, 100);
  }

  handleFileSelect = (e) => {
    e.preventDefault();
    this.refs.fileInput.click();
  }

  handleFile(file) {
    this.fileReader.readAsText(file);
  }

  exportJsonFile() {
    // kernelAutoRotation={this.state.kernelAutoRotation}
    // kernelRotationDir={this.state.kernelRotationDir}
    var exportJsonData = {
      name: "GeometryConfig",
      gridx: this.state.tankHeight,
      resolution: "0.699999988",
      tankDiameter: this.state.tankDiameter,
      starting_step: 0,
      impeller_start_angle: 0,
      impeller_startup_steps_until_normal_speed: 0,
      baffles: {
          numBaffles: this.state.baffleCount,
          firstBaffleOffset: "0.785398185",
          innerRadius: this.state.baffleInnerRadius,
          outerRadius: this.state.baffleOuterRadius,
          thickness: this.state.baffleWidth
      },
      numImpellers: this.state.impellerCount,
      shaft: {
          radius: this.state.shaftRadius
      }
    };

    var impeller = {};
    for (let i = 0; i < this.state.impellerCount; i++) {
      var keyStr = i;

      impeller[keyStr] = {
        numBlades: this.state.bladeCount[i],
        firstBladeOffset: 0,
        uav: "0.100000001",
        blade_tip_angular_vel_w0: "0.00588235306",
        impeller_position: this.state.tankDiameter/(this.state.impellerCount + 1) * (i + 1),
        blades: {
            innerRadius: this.state.bladeInnerRadius[i],
            outerRadius: this.state.bladeOuterRadius[i],
            bottom: "71.4000015",
            top: this.state.bladeHeight[i],
            bladeThickness: this.state.bladeWidth[i]
        },
        disk: {
            radius: this.state.diskRadius[i],
            bottom: "68.6800003",
            top: this.state.diskHeight[i]
        },
        hub: {
            radius: this.state.hubRadius[i],
            bottom: "71.4000015",
            top: this.state.hubHeight[i]
        }
      }
    }

    exportJsonData["impeller"] = impeller;

    jQuery("<a />", {
      "download": "data.json",
      "href" : "data:application/json," + encodeURIComponent(JSON.stringify(exportJsonData))
    }).appendTo("body")
    .click(function() {
      jQuery(this).remove()
    })[0].click();
  }
  
  render() {
    return (
      <div className="App">
        <Layout style={{ height: '100%' }}>
          <Layout>
            <Header>
              <h1>Turbulent Dynamics</h1>
            </Header>
            <Content style={{ overflowY: 'hidden' }}>
              <Turbine
                width={this.state.canvasWidth}
                height={this.state.canvasHeight}
                tankDiameter={this.state.tankDiameter}
                tankHeight={this.state.tankHeight}
                shaftRadius={this.state.shaftRadius}
                kernelAutoRotation={this.state.kernelAutoRotation}
                kernelRotationDir={this.state.kernelRotationDir}
                baffleCount={this.state.baffleCount}
                baffleInnerRadius={this.state.baffleInnerRadius}
                baffleOuterRadius={this.state.baffleOuterRadius}
                baffleWidth={this.state.baffleWidth}

                impellerCount={this.state.impellerCount}
                hubRadius={this.state.hubRadius}
                hubHeight={this.state.hubHeight}
                diskRadius={this.state.diskRadius}
                diskHeight={this.state.diskHeight}
                bladeCount={this.state.bladeCount}
                bladeInnerRadius={this.state.bladeInnerRadius}
                bladeOuterRadius={this.state.bladeOuterRadius}
                bladeWidth={this.state.bladeWidth}
                bladeHeight={this.state.bladeHeight}

                transPanXY={this.state.transPanXY}
                transPanYZ={this.state.transPanYZ}
                transPanXZ={this.state.transPanXZ}
                transRotateAngle={this.state.transRotateAngle}
                transEnableXY={this.state.transEnableXY}
                transEnableYZ={this.state.transEnableYZ}
                transEnableXZ={this.state.transEnableXZ}
                transEnableImpeller={this.state.transEnableImpeller}
                transEnableRotate={this.state.transEnableRotate}
                onHoverObject={name => this.handleHoverObject(name)}
                setting={this.state.setting}
              />
            </Content>
          </Layout>
          <Sider width={320} style={{ overflowY: 'auto' }}>
            <div className="logo"></div>
            <Menu theme="dark" mode="inline" defaultOpenKeys={['setting']}>
              <Menu.SubMenu className="setting subMenu" key="setting" title={
                <span>
                  <Icon type={this.state.hoverObject === 'setting' ? 'environment' : 'mail'} />
                  <span style={{
                    fontWeight: this.state.hoverObject === 'setting' ? 'bold' : 'normal'
                  }}>Setting</span>
                </span>
              }>
                <div className="setting-item">
                  <button onClick={ev => {this.handleSetting("reset")}}>Reset Camera</button>
                </div>
                <div><input id="fileInput" ref="fileInput" type="file" onChange={ (e) => this.handleFile(e.target.files[0]) } /></div>
                <div className="setting-item">
                  <button onClick={this.handleFileSelect}>Load Json</button>
                </div>
                <div className="setting-item">
                  <button onClick={this.exportJsonFile.bind(this)}>Save Json</button>
                </div>
              </Menu.SubMenu>
              <Menu.SubMenu className="subMenu" key="tank" title={
                <span>
                  <Icon type={this.state.hoverObject === 'tank' ? 'environment' : 'mail'} />
                  <span style={{fontWeight: this.state.hoverObject === 'tank' ? 'bold' : 'normal'}}>Tank</span>
                </span>
              }>
                <Menu.Item key="menuitem1">
                  <span>Diameter</span>
                  <InputNumber size="small" min={100} defaultValue={this.state.tankDiameter} onChange={(value) => this.handleChange('tankDiameter', value)} />
                </Menu.Item>
                <Menu.Item key="menuitem2">
                  <span>Height</span>
                  <InputNumber size="small" min={100} defaultValue={this.state.tankHeight} onChange={(value) => this.handleChange('tankHeight', value)} />
                </Menu.Item>
              </Menu.SubMenu>
              <Menu.SubMenu className="subMenu" key="shaft" title={
                <span>
                  <Icon type={this.state.hoverObject === 'shaft' ? 'environment' : 'mail'} />
                  <span style={{fontWeight: this.state.hoverObject === 'shaft' ? 'bold' : 'normal'}}>Shaft</span>
                </span>
              }>
                <Menu.Item key="menuitem3">
                  <span>Radius</span>
                  <InputNumber size="small" min={1} defaultValue={this.state.shaftRadius} onChange={(value) => this.handleChange('shaftRadius', value)} />
                </Menu.Item>
              </Menu.SubMenu>
              <Menu.SubMenu className="subMenu" key="baffle" title={
                <span>
                  <Icon type={this.state.hoverObject === 'baffle' ? 'environment' : 'mail'} />
                  <span style={{fontWeight: this.state.hoverObject === 'baffle' ? 'bold' : 'normal'}}>Baffle</span>
                </span>
              }>
                <Menu.Item key="menuitem15">
                  <span>Count</span>
                  <InputNumber size="small" min={1} defaultValue={this.state.baffleCount} onChange={(value) => this.handleChange('baffleCount', value)} />
                </Menu.Item>
                <Menu.Item key="menuitem16">
                  <span>Inner Radius</span>
                  <InputNumber size="small" min={1} defaultValue={this.state.baffleInnerRadius} onChange={(value) => this.handleChange('baffleInnerRadius', value)} />
                </Menu.Item>
                <Menu.Item key="menuitem17">
                  <span>Outer Radius</span>
                  <InputNumber size="small" min={1} defaultValue={this.state.baffleOuterRadius} onChange={(value) => this.handleChange('baffleOuterRadius', value)} />
                </Menu.Item>
                <Menu.Item key="menuitem18">
                  <span>Width</span>
                  <InputNumber size="small" min={1} defaultValue={this.state.baffleWidth} onChange={(value) => this.handleChange('baffleWidth', value)} />
                </Menu.Item>
              </Menu.SubMenu>
              <Menu.SubMenu className="subMenu" key="impellers" title={
                <span><Icon type={'mail'} /><span>Impeller Count</span></span>
              }>
                <Menu.Item key="impellerCount">
                  <span>Count</span>
                  <InputNumber size="small" min={1} defaultValue={this.state.impellerCount} onChange={(value) => this.handleChange('impellerCount', value)} />
                </Menu.Item>
              </Menu.SubMenu>

              {[...Array(this.state.impellerCount)].map((val, idx) => {
                return (
                  <Menu.SubMenu className="subMenu" key={`impeller-${idx}`} title={
                    <span><Icon type={'mail'} /><span>Impeller {idx + 1}</span></span>
                  }>

                    <Menu.SubMenu className="subMenu" key={`hub-${idx}`} title={
                      <span><Icon type={'mail'} /><span>Hub</span></span>
                    }>
                      <Menu.Item key={`hubRadius-${idx}`}>
                        <span>Radius</span>
                        <InputNumber size="small" min={1} defaultValue={this.state.hubRadius[0]} onChange={(value) => this.handleImpellerChange('hubRadius', value, idx)} />
                      </Menu.Item>
                      <Menu.Item key={`hubHeight-${idx}`}>
                        <span>Height</span>
                        <InputNumber size="small" min={1} defaultValue={this.state.hubHeight[0]} onChange={(value) => this.handleImpellerChange('hubHeight', value, idx)} />
                      </Menu.Item>
                    </Menu.SubMenu>
                    <Menu.SubMenu className="subMenu" key={`disk-${idx}`} title={
                      <span><Icon type={'mail'} /><span>Disk</span></span>
                    }>
                      <Menu.Item key={`diskRadius-${idx}`}>
                        <span>Radius</span>
                        <InputNumber size="small" min={1} defaultValue={this.state.diskRadius[0]} onChange={(value) => this.handleImpellerChange('diskRadius', value, idx)} />
                      </Menu.Item>
                      <Menu.Item key={`diskHeight-${idx}`}>
                        <span>Height</span>
                        <InputNumber size="small" min={1} defaultValue={this.state.diskHeight[0]} onChange={(value) => this.handleImpellerChange('diskHeight', value, idx)} />
                      </Menu.Item>
                    </Menu.SubMenu>
                    <Menu.SubMenu className="subMenu" key={`blade-${idx}`} title={
                      <span><Icon type={'mail'} /><span>Blade</span>
                      </span>
                    }>
                      <Menu.Item key={`bladeCount-${idx}`}>
                        <span>Count</span>
                        <InputNumber size="small" min={1} defaultValue={this.state.bladeCount[0]} onChange={(value) => this.handleImpellerChange('bladeCount', value, idx)} />
                      </Menu.Item>
                      <Menu.Item key={`bladeInnerRadius-${idx}`}>
                        <span>Inner Radius</span>
                        <InputNumber size="small" min={1} defaultValue={this.state.bladeInnerRadius[0]} onChange={(value) => this.handleImpellerChange('bladeInnerRadius', value, idx)} />
                      </Menu.Item>
                      <Menu.Item key={`bladeOuterRadius-${idx}`}>
                        <span>Outer Radius</span>
                        <InputNumber size="small" min={1} defaultValue={this.state.bladeOuterRadius[0]} onChange={(value) => this.handleImpellerChange('bladeOuterRadius', value, idx)} />
                      </Menu.Item>
                      <Menu.Item key={`bladeWidth-${idx}`}>
                        <span>Width</span>
                        <InputNumber size="small" min={1} defaultValue={this.state.bladeWidth[0]} onChange={(value) => this.handleImpellerChange('bladeWidth', value, idx)} />
                      </Menu.Item>
                      <Menu.Item key={`bladeHeight-${idx}`}>
                        <span>Height</span>
                        <InputNumber size="small" min={1} defaultValue={this.state.bladeHeight[0]} onChange={(value) => this.handleImpellerChange('bladeHeight', value, idx)} />
                      </Menu.Item>
                    </Menu.SubMenu>

                  </Menu.SubMenu>
                )
              })}

              <Menu.SubMenu className="subMenu" key="autoRotate" title={
                <span><Icon type={'mail'} /><span>Auto Rotate</span></span>
              }>
                <Menu.Item key="bladeAutoRotate">
                  <Checkbox checked={this.state.kernelAutoRotation} onChange={this.handleAutoRotation.bind(this)}>
                    <span className="ant-menu-control">Auto Rotation</span>
                  </Checkbox>
                </Menu.Item>
                <Menu.Item key="bladeKernel">
                  <Radio.Group onChange={this.handleRadio.bind(this)} value={this.state.kernelRotationDir}>
                    <Radio value="clockwise">
                      <span className="ant-menu-control">Clockwise</span>
                    </Radio>
                    <Radio value="counter-clockwise">
                      <span className="ant-menu-control">Counter-Clockwise</span>
                    </Radio>
                  </Radio.Group>
                </Menu.Item>
              </Menu.SubMenu>
              <Menu.SubMenu className="translucent subMenu" key="translucent" title={
                <span>
                  <Icon type={this.state.hoverObject === 'translucent' ? 'environment' : 'mail'} />
                  <span style={{fontWeight: this.state.hoverObject === 'translucent' ? 'bold' : 'normal'}}>Output Plane</span>
                </span>
              }>
                <Menu.Item className="testClass" key="menuitem15">
                  <span className="trans-pan">XY Plane</span>
                  <Checkbox className="transCheck" onChange={(value) => this.handleTransEnable('transEnableXY', value)}></Checkbox>
                  <InputNumber size="small" min={this.state.tankDiameter * -0.5} max={this.state.tankDiameter * 0.5} defaultValue={this.state.transPanXY} onChange={(value) => this.handleChange('transPanXY', value)} />
                </Menu.Item>
                <Menu.Item key="menuitem16">
                  <span className="trans-pan">YZ Plane</span>
                  <Checkbox className="transCheck" onChange={(value) => this.handleTransEnable('transEnableYZ', value)}></Checkbox>
                  <InputNumber size="small" min={this.state.tankDiameter * -0.5} max={this.state.tankDiameter * 0.5} defaultValue={this.state.transPanYZ} onChange={(value) => this.handleChange('transPanYZ', value)} />
                </Menu.Item>
                <Menu.Item key="menuitem17">
                  <span className="trans-pan">XZ Plane</span>
                  <Checkbox className="transCheck" onChange={(value) => this.handleTransEnable('transEnableXZ', value)}></Checkbox>
                  <InputNumber size="small" min={this.state.tankHeight * -0.5} max={this.state.tankHeight * 0.5} defaultValue={this.state.transPanXZ} onChange={(value) => this.handleChange('transPanXZ', value)} />
                </Menu.Item>
                <Menu.Item key="menuitem18">
                  <span className="trans-pan">Rotate Plane</span>
                  <Checkbox className="transCheck" onChange={(value) => this.handleTransEnable('transEnableRotate', value)}></Checkbox>
                  <InputNumber size="small" min={0} max={360} defaultValue={this.state.transRotateAngle} onChange={(value) => this.handleChange('transRotateAngle', value)} />
                </Menu.Item>
                {/* <Menu.Item key="menuitem19">
                  <span className="trans-pan">Impeller Plane</span>
                  <Checkbox className="transCheck" onChange={(value) => this.handleTransEnable('transEnableImpeller', value)}></Checkbox>
                </Menu.Item> */}
              </Menu.SubMenu>
            </Menu>
          </Sider>
        </Layout>
      </div>
    );
  }
}
//  onClick={ev => {this.handleSetting("load")}}