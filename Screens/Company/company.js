import React from 'react'
import CountdownCircle from 'react-native-countdown-circle'
import StepIndicator from '../../Components/react-native-step-indicator'
import {
  View,
  AsyncStorage,
  Button as NativeButton,
  Text as NativeText
} from 'react-native'
import { Firebase } from '../../Config'
import {
  Container,
  Content,
  Badge,
  Text,
  List,
  ListItem,
  Left,
  Right,
  Button,
  Icon
} from 'native-base'
import styles, { customStyles } from './style'
import Loader from '../Loader/loader'

export default class ComponyList extends React.Component {
  state = {
    isReady: true
  }

  componentDidMount(){
  }
  
  // Handle awake when the current tokken timmer is elapsed
  handleTimeElapsed (secondsElapsed, totalSeconds) {
    console.log(secondsElapsed, totalSeconds)
    if (totalSeconds > 0) return totalSeconds - secondsElapsed
    return 0
  }

  // Handle to get the layout width and height
  handleGetSize = e => {
    const { height, width } = e.nativeEvent.layout
    console.log({ height, width })
    this.setState({ headerElementsSize: { height, width } })
  }

  render () {
    const { isReady } = this.state
    if (!isReady) return <Loader isReady={this.state.isReady} />
    return this.renderView()
  }

  renderView = () => {
    return (
      <Container style={styles.container}>
        <Content>
          <NativeText style={styles.brand}>WELCOME</NativeText>
          {this.renderHeader()}
          {this.renderMain()}
          {this.renderFooter()}
        </Content>
      </Container>
    )
  }

  renderHeader = () => {
    return (
      <View style={styles.header} onLayout={this.handleGetSize}>
        {this.renderStepsIndicator()}
        {this.renderTokkenTimmer()}
      </View>
    )
  }

  renderMain = () => {
    return <View style={styles.main}>{this.renderCardsConatainer()}</View>
  }

  renderFooter = () => {
    return <View style={styles.footer}>{this.renderAddTokkens()}</View>
  }

  //= ==================Header methods===================//
  // method to render steps navigator
  renderStepsIndicator = () => {
    const labels = [
      {
        text: 'Date:'+new Date().toLocaleDateString(),
        icon: (
          <Icon
            style={{ color: 'white' }}
            type='MaterialIcons'
            name='date-range'
          />
        ),
        handle: null
      },
      {
        text: 'Current Tokken',
        icon: (
          <Icon
            style={{ color: 'white' }}
            type='MaterialCommunityIcons'
            name='coins'
          />
        ),
        handle: null
      },
      {
        text: 'Notifications',
        icon: (
          <Icon
            style={{ color: 'white' }}
            type='Ionicons'
            name='md-notifications'
          />
        ),
        handle: null
      }
    ]
    return (
      <View style={[styles.headerElements]}>
        <StepIndicator
          customStyles={customStyles.stepIndicator}
          currentPosition={-1}
          direction='vertical'
          labels={labels}
          stepCount={3}
          stepHandle={() => console.log('asd')}
        />
      </View>
    )
  }

  // method to render tokken timmer
  renderTokkenTimmer = () => {
    const { headerElementsSize } = this.state
    return (
      <View style={[styles.headerElements]}>
        <View style={styles.tokkenTimmer}>
          <CountdownCircle
            seconds={0}
            radius={headerElementsSize ? headerElementsSize.width / 3 - 50 : 90}
            borderWidth={8}
            color='#ff003f'
            bgColor='#fff'
            textStyle={{ fontSize: 20 }}
            onTimeElapsed={() => console.log('Elapsed!')}
            updateText={this.handleTimeElapsed}
           
          />
        </View>
        <NativeText
          style={[
            styles.brand,
            { fontSize: 16, paddingTop: 8, backgroundColor: 'transparent' }
          ]}
        >
          CURRENT TOKKEN
        </NativeText>
      </View>
    )
  }
  //= ==================End of Header methods===================//

  //= ==================Main methods===================//
  // method to render card cantainer
  renderCardsConatainer = () => {
    return (
      <View style={styles.cardContainerOverlay}>
        {this.renderCard(this.renderTodayTokkenCard())}
        {this.renderCard(this.renderTodayTokkenCard())}
        {this.renderCard(this.renderTodayTokkenCard())}
        {this.renderCard(this.renderTodayTokkenCard())}
      </View>
    )
  }

  // method to render a card
  renderCard = Element => {
    return <View style={styles.card}>{Element}</View>
  }

  renderTodayTokkenCard = () => {
    return (
      <View>
        <NativeText>Today's Tokkens</NativeText>
      </View>
    )
  }

  //= ==================End of Main methods===================//

  //= ==================Footer methods===================//
  // method to render steps navigator
  renderAddTokkens = () => {
    return <View style={[styles.addTokkensContainer]} />
  }

  // method to render tokken timmer
  // renderTokkenTimmer = () => {}
  //= ==================End of footer methods===================//
}
