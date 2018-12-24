import React from "react";
import { View, Button as NativeButton } from "react-native";
import {
  Container,
  Content,
  List,
  ListItem,
  Left,
  Right,
  Button
} from "native-base";
import styles from "./style";
export default class ComponyList extends React.Component {
  state = {
    companyList: []
  };
  componentDidMount() {
    console.log(
      "companyList=>",
      this.props.navigation.state.params.companyList
    );
    // const { companyList } = this.props.navigation.state;
    this.setState({
      companyList: this.props.navigation.state.params.companyList
    });
  }

  handleSelectCompany = (value, index) => {
    this.props.navigation.state.handleSelectCompany(value, index);
  };

  render() {
    const { companyList } = this.state;
    return (
      <View style={{ marginTop: 30 }}>
        <NativeButton
          title="Click"
          onPress={() => {
            this.props.navigation.state.params.handleSelectCompany(['Q','W','E'],1);
          }}
        />
      </View>
      // <Container style={styles.companiesContainer}>
      //   <Content>
      //     {/* <List>
      //       {companyList && companyList.length && companyList.map((value, index) => (
      //         <ListItem
      //           key={value.name + index}
      //           onPress={() => {
      //             this.handleSelectCompany(value, index);
      //           }}
      //         >
      //           <Left>
      //             <Text>{value.name}</Text>
      //           </Left>
      //           <Right>
      //             <Icon name="arrow-forward" />
      //           </Right>
      //         </ListItem>
      //       ))}
      //     </List> */}
      //   </Content>
      // </Container>
    );
  }
}
