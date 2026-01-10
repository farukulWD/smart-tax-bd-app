import { createStaticNavigation } from '@react-navigation/native';
import AppStack from './AppStack';

const Navigation = createStaticNavigation(AppStack);
export default Navigation;
