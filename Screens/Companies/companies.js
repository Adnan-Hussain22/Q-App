import React from 'react'
import { Text, View, Button, TouchableOpacity, Dimensions } from 'react-native'
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
const company = {
  address: ['Creek Club Bakery, Phase VIII, DHA', 'کراچی', 'پاکستان'],
  admins: ['adnanrajput22@gmail.com', 'adnanrajput42@gmail.com'],
  certificates: [
    'https://firebasestorage.googleapis.com/v0/b/qapp-ca040.appspot.com/o/companyCertificates%2Fa9f942ea-9351-4157-b7e5-dbad49b9edc7.jpg?alt=media&token=25d0a999-3b2f-4e62-98a4-1660e1236861',
    'https://firebasestorage.googleapis.com/v0/b/qapp-ca040.appspot.com/o/companyCertificates%2Fdabcd738-071f-42df-8da8-d78e77e0161f.jpg?alt=media&token=cf960777-e23e-4e5c-b1e3-035adfcaba04',
    'https://firebasestorage.googleapis.com/v0/b/qapp-ca040.appspot.com/o/companyCertificates%2F11020cd1-3741-49ab-8dba-1643525141ac.jpg?alt=media&token=e062109b-f3c8-41c7-95c3-5bf732d57698'
  ],
  coords: {
    latitude: 24.8481905,
    longitude: 67.0277179
  },
  name: 'Tech Native',
  registeredBy: 'adnanrajput42@gmail.com',
  since: 1537556400000,
  timing: {
    from: {
      amPM: 'AM',
      hour: '08',
      minute: '00'
    },
    to: {
      amPM: 'PM',
      hour: '11',
      minute: '00'
    }
  }
}
export default class App extends React.Component {
  state = {
    companies: [company],
    isReady: true,
    showMetaModal: false,
    metaCompany: null
  }

  componentDidMount () {
    // const { companies } = this.props.navigation.state.params
    // console.log('componentDidMount...companies ==>', companies)
    this.setState({ isReady: true })
  }

  handleSelectCompany = (value, index) => {
    console.log(value)
  }

  // check if something is fetching than show loader else render the view
  render () {
    const { isReady } = this.state
    if (!isReady) return <Loader loading={!isReady} />
    return this.renderView()
  }

  // method to render the view
  renderView = () => {
    console.log('renderView==>', companies)
    const { companies, showMetaModal, metaCompany } = this.state
    return (
      <Container>
        <Content>
          <MetaModal
            showModal={showMetaModal}
            handleOnCloseModal={() => this.setState({ showMetaModal: false })}
            meta={metaCompany && this.renderCompanyMeta()}
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
              <TouchableOpacity key={index + value}>
                <ListItem
                  onPress={() => this.handleSelectCompany(value, index)}
                  onLongPress={() =>
                    this.setState({
                      metaCompany: this.state.companies[index],
                      showMetaModal: true
                    })
                  }
                >
                  <Left>
                    <Text>{value.name}</Text>
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
    const { metaCompany } = this.state
    return (
      <View>
        <View style={{ marginBottom: 15 }}>
          <Text style={styles.metaCompanyBrand}>{metaCompany.name}</Text>
        </View>
        <View style={styles.metaCompanyItem}>
          <View style={{ margin: 5 }}>
            <Text style={styles.metaCompanyItemMeta}>
              CEO:{metaCompany.registeredBy}
            </Text>
          </View>
          <View style={{ margin: 5 }}>
            <Icon name='user' type='FontAwesome' />
          </View>
        </View>
        <View style={styles.metaCompanyItem}>
          <View style={{ margin: 5 }}>
            <Text style={[styles.metaCompanyItemMeta]}>
              Address:{this.renderAddress(metaCompany.address)}
            </Text>
          </View>
          <View style={{ margin: 5 }}>
            <Icon name='location-on' type='MaterialIcons' />
          </View>
        </View>
        <View style={styles.metaCompanyItem}>
          <View style={{ margin: 5 }}>
            <Text style={styles.metaCompanyItemMeta}>
              Timings:From {metaCompany.timing.from.hour}:
              {metaCompany.timing.from.minute}
              {metaCompany.timing.from.amPM} - To {metaCompany.timing.to.hour}:
              {metaCompany.timing.to.minute}
              {metaCompany.timing.from.amPM}
              {/* Timings:From {metaCompany.timing.from.hour}:{metaCompany.timing.from.minute}
            {metaCompany.timing.from.amPM} -
            To {metaCompany.timing.to.hour}:{metaCompany.timing.to.minute}
            {metaCompany.timing.from.amPM} */}
            </Text>
          </View>
          <View style={{ margin: 5 }}>
            <Icon name='clock-o' type='FontAwesome' />
          </View>
        </View>
      </View>
    )
  }

  renderAddress = address => {
    let address_d = ` `
    for (let i = 0; i < address.length; i++) {
      address_d += `${address[i]}`
    }
    return address_d
  }
}
