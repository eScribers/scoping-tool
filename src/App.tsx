import "./App.scss"
import ScoopingTool from "./components/ScoopingTool/ScoopingTool";
import {Layout} from 'antd';

const {Header, Sider, Content} = Layout;

const contentStyle={
    height: 'calc(100vh - 64px)',
    padding: 20

}

function App() {
    return (
        <Layout>
            <Header>
                <div className="logo"/>
            </Header>
            <Layout>
                <Sider>Sider</Sider>
                <Content className='scooping-content'>
                        <ScoopingTool/>
                </Content>
            </Layout>

        </Layout>
    )
}

export default App
