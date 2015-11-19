/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');

var {
  AppRegistry,
} = React;

var ViewPagerModule = require('./ViewPagerModule/index')

AppRegistry.registerComponent('TestViewPager', () => ViewPagerModule);
