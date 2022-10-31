import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Pathways } from "../screens";
import { Procrastination } from "../screens/pathways/";

type PathwaysStackParams = {
  "Pathways": undefined,
  "ProcrastinationScreen": undefined,
}

const Stack = createNativeStackNavigator<PathwaysStackParams>();

const PathwaysNavigator = (): JSX.Element => {
  return (
    <Stack.Navigator>
      {/* <Stack.Screen
        name="Pathways"
        component={Pathways}
        //options
      /> */}
      <Stack.Screen
        name="ProcrastinationScreen"
        component={Procrastination}
      />
    </Stack.Navigator>
  )
}

export default PathwaysNavigator;
