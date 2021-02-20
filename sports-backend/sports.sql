/*
 Navicat Premium Data Transfer

 Source Server         : node
 Source Server Type    : MySQL
 Source Server Version : 50726
 Source Host           : localhost:3306
 Source Schema         : sports

 Target Server Type    : MySQL
 Target Server Version : 50726
 File Encoding         : 65001

 Date: 20/02/2021 22:42:30
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for admin
-- ----------------------------
DROP TABLE IF EXISTS `admin`;
CREATE TABLE `admin` (
  `admin_id` int(100) NOT NULL AUTO_INCREMENT,
  `admin_username` varchar(100) NOT NULL,
  `admin_password` varchar(100) NOT NULL,
  `admin_type` varchar(100) NOT NULL,
  `admin_name` varchar(100) NOT NULL,
  `admin_sex` varchar(100) NOT NULL,
  PRIMARY KEY (`admin_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of admin
-- ----------------------------
BEGIN;
INSERT INTO `admin` VALUES (3, 'operator', '123', '1', '操作员1', '女');
INSERT INTO `admin` VALUES (5, 'admin', '123', '2', '管理员1', '男');
COMMIT;

-- ----------------------------
-- Table structure for competition
-- ----------------------------
DROP TABLE IF EXISTS `competition`;
CREATE TABLE `competition` (
  `schedule_id` int(100) NOT NULL AUTO_INCREMENT,
  `schedule_itemid` int(100) NOT NULL,
  `schedule_name` varchar(100) NOT NULL,
  `schedule_date` date DEFAULT NULL,
  `schedule_starttime` time DEFAULT NULL,
  `schedule_endtime` time DEFAULT NULL,
  `schedule_introduction` varchar(1000) NOT NULL,
  PRIMARY KEY (`schedule_id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of competition
-- ----------------------------
BEGIN;
INSERT INTO `competition` VALUES (11, 12, '跳远', '2020-01-08', '08:45:00', '15:25:00', '立定跳远');
INSERT INTO `competition` VALUES (14, 12, '1000米', '2020-01-09', '08:45:00', '15:25:00', '1000米长跑');
INSERT INTO `competition` VALUES (17, 12, '铅球', '2020-01-10', '08:45:00', '15:25:00', '扔铅球比赛');
COMMIT;

-- ----------------------------
-- Table structure for player
-- ----------------------------
DROP TABLE IF EXISTS `player`;
CREATE TABLE `player` (
  `player_id` int(100) NOT NULL AUTO_INCREMENT,
  `player_name` varchar(100) NOT NULL,
  `player_sex` varchar(100) NOT NULL,
  `player_birthday` varchar(100) NOT NULL,
  `player_class` varchar(100) NOT NULL,
  `player_studentid` varchar(100) NOT NULL,
  `player_number` varchar(100) NOT NULL,
  PRIMARY KEY (`player_id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of player
-- ----------------------------
BEGIN;
INSERT INTO `player` VALUES (14, '赵一', '男', '2019-10-29', '001', '001', '001');
INSERT INTO `player` VALUES (15, '王二', '男', '2019-10-16', '002', '002', '002');
INSERT INTO `player` VALUES (16, '李三', '男', '2019-10-30', '003', '003', '003');
COMMIT;

-- ----------------------------
-- Table structure for plog
-- ----------------------------
DROP TABLE IF EXISTS `plog`;
CREATE TABLE `plog` (
  `plog_id` int(100) NOT NULL AUTO_INCREMENT,
  `plog_playerid` int(100) NOT NULL,
  `plog_scheduleid` int(100) NOT NULL,
  `plog_score` int(100) NOT NULL,
  `plog_adminid` int(100) NOT NULL,
  PRIMARY KEY (`plog_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of plog
-- ----------------------------
BEGIN;
INSERT INTO `plog` VALUES (15, 14, 11, 1, 5);
COMMIT;

-- ----------------------------
-- Table structure for project
-- ----------------------------
DROP TABLE IF EXISTS `project`;
CREATE TABLE `project` (
  `type_id` int(100) NOT NULL AUTO_INCREMENT,
  `type_name` varchar(100) NOT NULL,
  `type_introduction` varchar(1000) NOT NULL,
  PRIMARY KEY (`type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of project
-- ----------------------------
BEGIN;
INSERT INTO `project` VALUES (12, '田赛', '田径场规定的区域内进行的跳跃及投掷项目竞赛的统称');
INSERT INTO `project` VALUES (13, '径赛', '田径场的跑道或规定道路上进行的跑和走的竞赛项目的统称');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
