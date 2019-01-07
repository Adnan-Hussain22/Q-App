import Companies from "./Companies/companies";
import Dashboard from "./Dashboard/dasboard";
import Profile from "./Profile/profile";
import styles from "./style";
import React from "react";
import { Tab, Tabs } from "native-base";
import { View } from "react-native";
//Method to render the tabs
const UserTabs = props => {
  const {
    userProfile,
    currentPage,
    handleChangePage,
    handleValidateTodayTokkens,
    handleFetchProfile,
    currentTokken,
    currentTokkenTimer,
    handleOnCurrentTokkenTimeElapsed
  } = props;
  return (
    <View>
      <Tabs initialPage={currentPage} page={currentPage}>
        <Tab
          heading="Dashboard"
          tabStyle={styles.tabsBackground}
          textStyle={styles.tabText}
          activeTabStyle={styles.activeTabStyle}
        >
          <Dashboard
            userProfile={userProfile}
            handleChangePage={handleChangePage}
            handleValidateTodayTokkens={handleValidateTodayTokkens}
            currentTokken={currentTokken}
            currentTokkenTimer={currentTokkenTimer}
            handleOnCurrentTokkenTimeElapsed={handleOnCurrentTokkenTimeElapsed}
          />
        </Tab>
        <Tab
          heading="Companies"
          tabStyle={styles.tabsBackground}
          textStyle={styles.tabText}
          activeTabStyle={styles.activeTabStyle}
        >
          <Companies
            authProfile={userProfile}
            handleChangePage={handleChangePage}
            handleValidateTodayTokkens={handleValidateTodayTokkens}
            currentTokkenTimer={currentTokkenTimer}
          />
        </Tab>
        <Tab
          heading="Profile"
          tabStyle={styles.tabsBackground}
          textStyle={styles.tabText}
          activeTabStyle={styles.activeTabStyle}
        >
          <Profile
            authProfile={userProfile}
            handleChangePage={handleChangePage}
            handleFetchProfile={handleFetchProfile}
          />
        </Tab>
      </Tabs>
    </View>
  );
};

export default UserTabs;
