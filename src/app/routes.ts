import { createBrowserRouter } from 'react-router';
import { Root } from './Root';
import { LoginScreen } from './screens/LoginScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { CreateChartScreen } from './screens/CreateChartScreen';
import { WeeklyResultScreen } from './screens/WeeklyResultScreen';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: LoginScreen },
      { path: 'profile', Component: ProfileScreen },
      { path: 'create-chart', Component: CreateChartScreen },
      { path: 'weekly-result', Component: WeeklyResultScreen },
    ],
  },
]);
