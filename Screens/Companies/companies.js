import React from 'react'
import { Text, View, Button, TouchableOpacity } from 'react-native'
import { Firebase } from '../../Config'
import styles from './style'
import { MetaModal } from '../../Components'
import {
  Container,
  Content,
  List,
  ListItem,
  Left,
  Right,
  Icon
} from 'native-base'
import Loader from '../Loader/loader'
export default class App extends React.Component {
  state = {
    companies: [
      { company: 'Abc' },
      { company: 'Abc' },
      { company: 'Abc' },
      { company: 'Abc' }
    ],
    isReady: true,
    showMetaModal: false
  }

  componentDidMount () {
    const { companies } = this.props.navigation.state.params
    console.log(companies);
    // this.setState({ companies, isReady: true })
  }

  // check if something is fetching than show loader else render the view
  render () {
    const { isReady } = this.state
    if (!isReady) return <Loader loading={!isReady} />
    return this.renderView()
  }

  // method to render the view
  renderView = () => {
    const { companies, showMetaModal } = this.state
    console.log('companies... companies=>', companies)
    return (
      <Container>
        <Content>
          <MetaModal
            showModal={showMetaModal}
            handleOnCloseModal={() => this.setState({ showMetaModal: false })}
            meta={this.renderCompanyMeta()}
          />
          <Text
            style={{
              backgroundColor: 'black',
              color: 'white',
              textAlign: 'center',
              padding: 10,
              paddingTop: 30
            }}
          >
            Select a company
          </Text>
          <List>
            {companies.map((value, index) => (
              <TouchableOpacity>
                <ListItem
                  key={value + index}
                  onPress={() => console.log(value.company)}
                  onLongPress={() => this.setState({ showMetaModal: true })}
                >
                  <Left>
                    <Text>{value.company}</Text>
                  </Left>
                  <Right>
                    <Icon name='arrow-forward' />
                  </Right>
                </ListItem>
              </TouchableOpacity>
            ))}
          </List>
        </Content>
      </Container>
    )
  }

  // method to render the companyMeta
  renderCompanyMeta = () => {
    return (
      <View>
        <View style={{marginBottom:15}}>
          <Text
            style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold' }}
          >
            Company Name
          </Text>
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between'
          }}
        >
          <View style={{ margin: 5 }}>
            <Text>CEO:Adnan Hussain</Text>
          </View>
          <View style={{ margin: 5 }}>
            <Icon name='user' type='FontAwesome' />
          </View>
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between'
          }}
        >
          <View style={{ margin: 5 }}>
            <Text>Address:Adnan Hussain</Text>
          </View>
          <View style={{ margin: 5 }}>
            <Icon name='location-on' type='MaterialIcons' />
          </View>
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between'
          }}
        >
          <View style={{ margin: 5 }}>
            <Text>Timings:Adnan Hussain</Text>
          </View>
          <View style={{ margin: 5 }}>
            <Icon name='clock-o' type='FontAwesome' />
          </View>
        </View>
      </View>
    )
  }
}
