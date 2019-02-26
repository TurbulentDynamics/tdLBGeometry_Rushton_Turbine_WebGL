import React, { Component } from 'react';
import { Checkbox, Icon, InputNumber, Layout, Menu } from 'antd';
import Turbine from './Turbine';

import 'antd/dist/antd.css';
import './App.css';

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
      baffleWidth: unit / 75,
      hoverObject: ''
    };
  }

  componentDidMount() {
    this.setState({
      canvasWidth: window.innerWidth - 250,
      canvasHeight: window.innerHeight - 64
    });
    this.handleResize = () => {
      this.setState({
        canvasWidth: window.innerWidth - 250,
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

  handleAutoRotation(event) {
    this.setState({ kernelAutoRotation: event.target.checked });
  }

  handleHoverObject(name) {
    this.setState({ hoverObject: name });
  }

  render() {
    return (
      <div className="App">
        <Layout style={{ height: '100%' }}>
          <Sider width={250} style={{ overflowY: 'auto' }}>
            <div className="logo"></div>
            <Menu theme="dark" mode="inline" openKeys={[this.state.hoverObject]}>
              <Menu.SubMenu key="tank" title={<span><Icon type="mail" /><span>Tank</span></span>} isOpen={this.state.hoverObject === 'tank'}>
                <Menu.Item key="menuitem1">
                  <span>Diameter</span>
                  <InputNumber min={100} defaultValue={this.state.tankDiameter} onChange={(value) => this.handleChange('tankDiameter', value)} />
                </Menu.Item>
                <Menu.Item key="menuitem2">
                  <span>Height</span>
                  <InputNumber min={100} defaultValue={this.state.tankHeight} onChange={(value) => this.handleChange('tankHeight', value)} />
                </Menu.Item>
              </Menu.SubMenu>
              <Menu.SubMenu key="shaft" title={<span><Icon type="mail" /><span>Shaft</span></span>}>
                <Menu.Item key="menuitem3">
                  <span>Radius</span>
                  <InputNumber min={1} defaultValue={this.state.shaftRadius} onChange={(value) => this.handleChange('shaftRadius', value)} />
                </Menu.Item>
              </Menu.SubMenu>
              <Menu.SubMenu key="disk" title={<span><Icon type="mail" /><span>Disk</span></span>}>
                <Menu.Item key="menuitem4">
                  <span>Radius</span>
                  <InputNumber min={1} defaultValue={this.state.diskRadius} onChange={(value) => this.handleChange('diskRadius', value)} />
                </Menu.Item>
                <Menu.Item key="menuitem5">
                  <span>Height</span>
                  <InputNumber min={1} defaultValue={this.state.diskHeight} onChange={(value) => this.handleChange('diskHeight', value)} />
                </Menu.Item>
              </Menu.SubMenu>
              <Menu.SubMenu key="hub" title={<span><Icon type="mail" /><span>Hub</span></span>}>
                <Menu.Item key="menuitem6">
                  <span>Radius</span>
                  <InputNumber min={1} defaultValue={this.state.hubRadius} onChange={(value) => this.handleChange('hubRadius', value)} />
                </Menu.Item>
                <Menu.Item key="menuitem7">
                  <span>Height</span>
                  <InputNumber min={1} defaultValue={this.state.hubHeight} onChange={(value) => this.handleChange('hubHeight', value)} />
                </Menu.Item>
              </Menu.SubMenu>
              <Menu.SubMenu key="blade" title={<span><Icon type="mail" /><span>Blade</span></span>}>
                <Menu.Item key="menuitem8">
                  <span>Count</span>
                  <InputNumber min={1} defaultValue={this.state.bladeCount} onChange={(value) => this.handleChange('bladeCount', value)} />
                </Menu.Item>
                <Menu.Item key="menuitem9">
                  <span>Inner Radius</span>
                  <InputNumber min={1} defaultValue={this.state.bladeInnerRadius} onChange={(value) => this.handleChange('bladeInnerRadius', value)} />
                </Menu.Item>
                <Menu.Item key="menuitem10">
                  <span>Outer Radius</span>
                  <InputNumber min={1} defaultValue={this.state.bladeOuterRadius} onChange={(value) => this.handleChange('bladeOuterRadius', value)} />
                </Menu.Item>
                <Menu.Item key="menuitem11">
                  <span>Width</span>
                  <InputNumber min={1} defaultValue={this.state.bladeWidth} onChange={(value) => this.handleChange('bladeWidth', value)} />
                </Menu.Item>
                <Menu.Item key="menuitem12">
                  <span>Height</span>
                  <InputNumber min={1} defaultValue={this.state.bladeHeight} onChange={(value) => this.handleChange('bladeHeight', value)} />
                </Menu.Item>
                <Menu.Item key="menuitem13">
                  <Checkbox checked={this.state.kernelAutoRotation} onChange={this.handleAutoRotation.bind(this)}>Auto Rotation</Checkbox>
                </Menu.Item>
              </Menu.SubMenu>
              <Menu.SubMenu key="baffle" title={<span><Icon type="mail" /><span>Baffle</span></span>}>
                <Menu.Item key="menuitem14">
                  <span>Count</span>
                  <InputNumber min={1} defaultValue={this.state.baffleCount} onChange={(value) => this.handleChange('baffleCount', value)} />
                </Menu.Item>
                <Menu.Item key="menuitem15">
                  <span>Inner Radius</span>
                  <InputNumber min={1} defaultValue={this.state.baffleInnerRadius} onChange={(value) => this.handleChange('baffleInnerRadius', value)} />
                </Menu.Item>
                <Menu.Item key="menuitem16">
                  <span>Outer Radius</span>
                  <InputNumber min={1} defaultValue={this.state.baffleOuterRadius} onChange={(value) => this.handleChange('baffleOuterRadius', value)} />
                </Menu.Item>
                <Menu.Item key="menuitem17">
                  <span>Width</span>
                  <InputNumber min={1} defaultValue={this.state.baffleWidth} onChange={(value) => this.handleChange('baffleWidth', value)} />
                </Menu.Item>
              </Menu.SubMenu>
            </Menu>
          </Sider>
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
                diskRadius={this.state.diskRadius}
                diskHeight={this.state.diskHeight}
                hubRadius={this.state.hubRadius}
                hubHeight={this.state.hubHeight}
                bladeCount={this.state.bladeCount}
                bladeInnerRadius={this.state.bladeInnerRadius}
                bladeOuterRadius={this.state.bladeOuterRadius}
                bladeWidth={this.state.bladeWidth}
                bladeHeight={this.state.bladeHeight}
                baffleCount={this.state.baffleCount}
                baffleInnerRadius={this.state.baffleInnerRadius}
                baffleOuterRadius={this.state.baffleOuterRadius}
                baffleWidth={this.state.baffleWidth}
                onHoverObject={name => this.handleHoverObject(name)}
              />
            </Content>
          </Layout>
        </Layout>
      </div>
    );
  }
}
