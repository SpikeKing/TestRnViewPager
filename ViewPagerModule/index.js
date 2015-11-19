'use strict'

var React = require('react-native');

var {
  View,
  Text,
  Image,
  TouchableNativeFeedback, // 触碰响应
  TouchableOpacity, // 触碰更换透明度的属性
  ViewPagerAndroid, // Android的ViewPager
} = React;

// Styles
var styles = require('./style');

var PAGES = 5; // 页数

// 颜色
var BGCOLOR = ['#8ad3da', '#eecde2', '#e682b4', '#b7badd','#f1c7dd'];

// 本地图片地址
var IMAGE_URIS = [
  require('./images/jessicajung.png'),
  require('./images/tiffany.png'),
  require('./images/seohyun.png'),
  require('./images/taeyeon.png'),
  require('./images/yoona.png'),
];

// 名称
var NAMES = ['Jessica', 'Tiffany', 'Seohyun', 'Taeyeon', 'Yoona'];

/**
 * 点赞功能页面
 * @param  {likes: 点赞数}
 * @return {点赞视图} [点赞按钮, 动态增加点赞数]
 */
var LikeCount = React.createClass({
  // 初始化状态
  getInitialState: function() {
    return {
      likes: 0,
    };
  },

  // 点击增加
  onClick: function() {
    this.setState({likes: this.state.likes + 1});
  },

  render: function() {
    var thumbsUp = '\uD83D\uDC4D'; // 图标
    return (
      <View style = {styles.likeContainer}>
        <TouchableOpacity
          onPress={this.onClick}
          style={styles.likeButton}>
          <Text style={styles.likesText}>
            {thumbsUp}
          </Text>
        </TouchableOpacity>
        <Text style={styles.likesText}>
          {this.state.likes + ' 喜欢'}
        </Text>
      </View>
    );
  },
});

/**
* 按钮: 添加点击状态(enabled)和文本(text)
* @param  {enabled:点击状态} {text:显示文本} {onPress:点击事件}
* @return {TouchableNativeFeedback} [触摸反馈的视图]
*/
var Button = React.createClass({
  _handlePress: function() {
    if (this.props.enabled && this.props.onPress) {
      this.props.onPress();
    }
  },

  render: function() {
    return (
      <TouchableNativeFeedback onPress={this._handlePress}>
        <View style={[styles.button, this.props.enabled ? {} : styles.buttonDisabled]}>
          <Text style={styles.buttonText}>
            {this.props.text}
          </Text>
        </View>
      </TouchableNativeFeedback>
    );
  }
});

/**
* 滚动条, fractionalPosition滚动条长度, progressBarSize当前大小
* @param  {size:滚动条大小} {progress:过程}
* @return {View}   [里外两层视图, 背景白框黑底, 显示白框]
*/
var ProgressBar  = React.createClass({
  render: function() {
    var fractionalPosition = (this.props.progress.position + this.props.progress.offset);
    var progressBarSize = (fractionalPosition / (PAGES - 1)) * this.props.size;
    return (
      <View style={[styles.progressBarContainer, {width: this.props.size}]}>
        <View style={[styles.progressBar, {width: progressBarSize}]}/>
      </View>
    );
  }
});


var ViewPagerModule = React.createClass({

  /**
  * 初始化状态
  * @return {状态} [页面]
  */
  getInitialState: function() {
    return {
      page: 0, // 当前位置
      progress: { // Progress位置
        position: 0,
        offset: 0,
      }
    };
  },

  // 页面选择
  onPageSelected: function(e) {
    this.setState({page: e.nativeEvent.position});
  },

  // 页面滚动
  onPageScroll: function(e) {
    this.setState({progress: e.nativeEvent});
  },

  // 移动页面
  move: function(delta) {
    var page = this.state.page + delta;
    this.go(page);
  },

  // 跳转页面
  go: function(page) {
    this.viewPage.setPage(page);
    this.setState({page});
  },

  render: function() {
    var pages = [];

    for (var i=0; i<PAGES; i++) {
      // 背景
      var pageStyle = {
        backgroundColor: BGCOLOR[i % BGCOLOR.length],
        alignItems: 'center',
        padding: 20,
      }

      pages.push(
        <View
          key={i}
          style={pageStyle}
          collapsable={false}>
          <Image
            style={styles.image}
            resizeMode={'cover'}
            source={IMAGE_URIS[i%PAGES]}
            />
          <Text style={styles.nameText}>
            {NAMES[i%PAGES]}
          </Text>
          <LikeCount />
        </View>
      );
    }
    var {page} = this.state;

    return (
      <View style={styles.container}>
        <ViewPagerAndroid
          style={styles.viewPager}
          initialPage={0}
          onPageScroll={this.onPageScroll}
          onPageSelected={this.onPageSelected}
          ref={viewPager => {this.viewPage = viewPager;}}>
          {pages}
        </ViewPagerAndroid>

        <View style={styles.buttons}>
          <Button
            text="首页"
            enabled={page > 0}
            onPress={() => this.go(0)}/>
          <Button
            text="上一页"
            enabled={page > 0}
            onPress={() => this.move(-1)}/>
          <Text style={styles.buttonText}>
            页 {page+1} / {PAGES}
          </Text>
          {/*进度条*/}
          <ProgressBar
            size={80}
            progress={this.state.progress}/>
          <Button
            text="下一页"
            enabled={page < PAGES - 1}
            onPress={() => this.move(1)}/>
          <Button
            text="尾页"
            enabled={page < PAGES - 1}
            onPress={() => this.go(PAGES -1)}/>
        </View>
      </View>
    );
  },
});

module.exports = ViewPagerModule;
