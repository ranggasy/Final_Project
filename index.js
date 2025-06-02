/**
 * @author Veris Juniardi
 * @description Index file for React Native
 * @since 2025-05-29
 * @version 1.0.0
 **/

import { AppRegistry } from 'react-native';
import Application from './Application';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => Application);