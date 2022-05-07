import React from 'react';

import {useNavigation, useRoute, getFocusedRouteNameFromRoute} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Gallery, Player, Recording, Rating, Transcript, Home, Vistas, Settings, Feedback } from '../screens';

import CustomIcon from '../components/CustomIcon';

import { colors, icons, spacings } from '../styles';

// Initial params (NOT PROPS) for routes: See https://reactnavigation.org/docs/typescript/
// Specifying undefined means that the route doesn't have params.
// A union type with undefined (e.g. SomeType | undefined) means that params are optional.
type StackNavigatorParams = {
  "Recording": undefined,
  "Player": undefined,
  "Rating": undefined,
  "Transcript": undefined,
  "TabNavigator": undefined
}

type TabNavigatorParams = {
  "Gallery": undefined,
  "Recording": undefined,
  "Home": undefined,
  "Vistas": undefined,
  "Settings": undefined,
  "Feedback": undefined
}

const Stack = createNativeStackNavigator<StackNavigatorParams>();
const Tab = createBottomTabNavigator<TabNavigatorParams>();

// A bottom tab navigator to hold important screens that can be accessed directly from most other screens
// For styling, see https://reactnavigation.org/docs/tab-based-navigation#customizing-the-appearance
const TabNavigator = ({ setUser }): JSX.Element => {
  const [shouldDisplay, setShouldDisplay] = React.useState(true);

  // Constants for rendering TabNavigator conditionally
  const INITIAL_TAB_ROUTE = "Home";
  const navigation = useNavigation();
  const route = useRoute();
  const tabHiddenRoutes = ["Recording"];

  // On initial render, no navigation has happened yet, so current route name is undefined
  // Therefore, fallback to initial route.
  const routeName = getFocusedRouteNameFromRoute(route) ?? INITIAL_TAB_ROUTE;

  // React.useLayoutEffect: Works like useEffect, but for the rare situation that we mutate the DOM and/or do need to perform measurements
  // This works the same way as componentDidMount and componentDidUpdate
  // The code runs immediately after the DOM has been updated
  // Read more: https://kentcdodds.com/blog/useeffect-vs-uselayouteffect

  // The overall purpose of this hook is to hide the TabNavigator on the Recording screen. Details below:
  // The TabNavigator component determines whether itself should display or not based on state: shouldDisplay
  // This effect runs any time navigation or route changes and sets the display to true or false depending on the route name
  // Reference: https://stackoverflow.com/a/65529902
  // Read more: https://reactnavigation.org/docs/screen-options-resolution/#setting-parent-screen-options-based-on-child-navigators-state
  React.useLayoutEffect(() => {
    if (tabHiddenRoutes.includes(routeName)){
      setShouldDisplay(false);
    } else {
      setShouldDisplay(true);
    }
  }, [navigation, route]);

  return (
    <Tab.Navigator
      initialRouteName={INITIAL_TAB_ROUTE}
      screenOptions={({ route }) => ({
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: colors.BACKGROUND,
          paddingTop: spacings.MEDIUM,
          borderTopLeftRadius: 20,  // rounded tab bar style
          borderTopRightRadius: 20,  // rounded tab bar style
          borderTopColor: 'transparent',
          shadowColor: colors.SECONDARY,
          shadowOffset: { width: 0, height: 0 },  // negative values bring shadow up higher
          shadowOpacity: 0.75,
          shadowRadius: 20,
          display: shouldDisplay ? 'flex' : 'none'
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          size = icons.TINY.fontSize + 4;

          // The switch cases: conditionally render which icon to display based on if tab is selected or not
          // If focused (user is on this tab), the icon should be highlighted, and use a filled icon
          // Otherwise, the icon should just have an empty outline and not be filled
          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home_filled' : 'home_outline';
              break;
            case 'Gallery':
              iconName = focused ? 'grid_rounded_filled' : 'grid_rounded_outline';
              break;
            case "Recording":
              iconName = focused ? 'add_video' : 'add_video';
              break;
            case "Vistas":
              iconName = focused ? 'eyeball_filled' : 'eyeball_outline';
              break;
            case "Feedback":
              iconName = focused ? 'feedback_outline' : 'feedback_outline';  // TODO get custom Feedback icons from Greg
              break;
            default:
              iconName = "not_found"
              break;
          }
          return <CustomIcon name={iconName} size={size} color={color} />;

        },
        tabBarActiveTintColor: colors.HIGHLIGHT,
        tabBarInactiveTintColor: colors.PRIMARY,
      })}
    >
      <Tab.Screen name="Home" component={Home} options={{ headerShown: false }} />
      <Tab.Screen name="Gallery" component={Gallery} options={{ headerShown: false }} />

      {/* For unmount behavior: https://github.com/react-navigation/react-navigation/issues/6915#issuecomment-1038851130 */}
      <Tab.Screen 
        name="Recording" 
        component={Recording} 
        options={{ headerShown: false, unmountOnBlur: true }} 
        listeners={({navigation}) => ({blur: () => navigation.setParams({screen: undefined})})} 
      />

      <Tab.Screen name="Vistas" component={Vistas} options={{ headerShown: false }} />
      <Tab.Screen name="Feedback" component={Feedback} options={{ headerShown: false }} />
    </Tab.Navigator>
  )
}

// This StackNavigator is the navigator for the App stack (core functionality and features)
// It has TabNavigator nested inside of it: the syntax is identical to including an individual screen component
const AppNavigator = ({ setUser }): JSX.Element => {
  return (
    <Stack.Navigator initialRouteName="TabNavigator">
      <Stack.Screen name="TabNavigator" component={TabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="Player" component={Player} options={{ headerShown: false }} />
      <Stack.Screen name="Rating" component={Rating} options={{ headerShown: false }} />
      <Stack.Screen name="Transcript" component={Transcript} options={{ headerShown: false }} />
    </Stack.Navigator>
  )
}

export default AppNavigator;
