import { createStackNavigator, createAppContainer } from 'react-navigation'
import * as Screens from '../Screens'
const StackNavigation = createStackNavigator(
  {
    // Login: {
    //   screen: Screens.Login
    // // },
    // Home: {
    //   screen: Screens.Home
    // },
    Companies: {
      screen: Screens.Companies
    },
    Company: {
      screen: Screens.Company
    },
    CompanyData: {
      screen: Screens.CompanyData
    },
    // User: {
    //   screen: Screens.User
    // }
  },
  {
    headerMode: 'none',
    navigationOptions: ({ navigation }) => ({
      header: null
    })
  }
)

const navigation = createAppContainer(StackNavigation)
export default navigation
