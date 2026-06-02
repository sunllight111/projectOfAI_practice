import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const heroImage = require("../../assets/profile-hero.jpg");
const avatarImage = require("../../assets/icon.png");
const PROFILE_NAME = "小火龙";
const PROFILE_GENDER = "\u7537";
const PROFILE_COMPANY = "\u9526\u7ee3\u516c\u53f8";

const SUMMARY_ITEMS = [
  { label: "公开内容", value: "0" },
  { label: "收藏夹", value: "0" },
  { label: "最近浏览", value: "12" }
];

const SERVICE_ITEMS: Array<{
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  color: string;
  background: string;
}> = [
  {
    icon: "person-circle-outline",
    title: "资料管理",
    subtitle: "头像、昵称和账号",
    color: "#059669",
    background: "#ECFDF5"
  },
  {
    icon: "heart-outline",
    title: "我的点赞",
    subtitle: "看过并喜欢的内容",
    color: "#F2542D",
    background: "#FFF2EE"
  },
  {
    icon: "bookmark-outline",
    title: "我的收藏",
    subtitle: "稍后再看的灵感",
    color: "#2563EB",
    background: "#EEF5FF"
  }
];

const SETTINGS = [
  "用户协议",
  "隐私政策",
  "数据收集政策",
  "关于我们",
  "第三方服务使用说明"
];

export function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const [showTopTabbar, setShowTopTabbar] = useState(false);

  return (
    <View style={styles.screen}>
      {showTopTabbar ? (
        <View
          style={[
            styles.floatingProfileBar,
            {
              height: insets.top + 60,
              paddingTop: insets.top
            }
          ]}
        >
          <View style={styles.floatingProfileContent}>
            <Image source={avatarImage} style={styles.floatingAvatar} />
            <View style={styles.floatingIdentity}>
              <Text numberOfLines={1} style={styles.floatingName}>
                {PROFILE_NAME}
              </Text>
            </View>
            <View style={styles.floatingGenderPill}>
              <Ionicons name="male" size={12} color="#2563EB" />
              <Text numberOfLines={1} style={styles.floatingGenderText}>
                {PROFILE_GENDER}
              </Text>
            </View>
            <View style={styles.floatingProfileTabs}>
              <Text numberOfLines={1} style={styles.floatingProfileTabActive}>
                主页
              </Text>
              {/* <Text numberOfLines={1} style={styles.floatingProfileTab}>
                动态
              </Text>
              <Text numberOfLines={1} style={styles.floatingProfileTab}>
                收藏
              </Text> */}
            </View>
          </View>
        </View>
      ) : null}
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        onScroll={({ nativeEvent }) => {
          const shouldShow = nativeEvent.contentOffset.y > insets.top + 24;
          setShowTopTabbar((current) =>
            current === shouldShow ? current : shouldShow
          );
        }}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingBottom: Math.max(tabBarHeight + insets.bottom + 28, 112)
        }}
      >
        <ImageBackground
          source={heroImage}
          imageStyle={styles.heroImage}
          resizeMode="cover"
          style={[styles.hero, { paddingTop: insets.top + 18 }]}
        >
          <View style={styles.heroShade} />

          <View style={styles.heroContent}>
            <View style={styles.avatarStage}>
              <View style={styles.avatarRing}>
                <Image source={avatarImage} style={styles.avatarImage} />
                <View style={styles.genderBadge}>
                  <Ionicons name="male" size={17} color="#2563EB" />
                </View>
              </View>
            </View>

            <View style={styles.identityBlock}>
              <View style={styles.profileTextStack}>
                <Text
                  adjustsFontSizeToFit
                  minimumFontScale={0.68}
                  numberOfLines={1}
                  style={styles.name}
                >
                  {PROFILE_NAME}
                </Text>
                <Text
                  adjustsFontSizeToFit
                  minimumFontScale={0.72}
                  numberOfLines={1}
                  style={styles.companyName}
                >
                  {PROFILE_COMPANY}
                </Text>
              </View>
            </View>
          </View>
        </ImageBackground>

        <View style={styles.contentSheet}>
          <View style={styles.sheetTabs}>
            <View style={styles.sheetTabsInner}>
              <View style={styles.activeTab}>
                <Text style={styles.activeTabText}>主页</Text>
                <View style={styles.activeTabLine} />
              </View>
              {/* <Text style={styles.tabText}>动态</Text>
              <Text style={styles.tabText}>收藏</Text> */}
              {/* <Ionicons name="search" size={22} color="#8F949B" /> */}
            </View>
          </View>

          <View style={styles.contentBody}>
          {/* <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <View>
                <Text style={styles.sectionTitle}>账号概览</Text>
                <Text style={styles.sectionCaption}>你的内容和互动数据</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
            </View>

            <View style={styles.summaryGrid}>
              {SUMMARY_ITEMS.map((item, index) => (
                <React.Fragment key={item.label}>
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryValue}>{item.value}</Text>
                    <Text style={styles.summaryLabel}>{item.label}</Text>
                  </View>
                  {index < SUMMARY_ITEMS.length - 1 ? (
                    <View style={styles.summaryDivider} />
                  ) : null}
                </React.Fragment>
              ))}
            </View>
          </View> */}

          <View style={styles.sectionBlock}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>常用服务</Text>
              <Text style={styles.sectionCaption}>更快找到常用功能</Text>
            </View>

            <View style={styles.serviceGrid}>
              {SERVICE_ITEMS.map((item, index) => (
                <Pressable
                  key={item.title}
                  style={[
                    styles.serviceCard,
                    index === 0 && styles.serviceCardFeatured
                  ]}
                >
                  <View
                    style={[
                      styles.serviceIcon,
                      { backgroundColor: item.background },
                      index === 0 && styles.serviceIconFeatured
                    ]}
                  >
                    <Ionicons
                      name={item.icon}
                      size={index === 0 ? 26 : 22}
                      color={item.color}
                    />
                  </View>
                  <View style={styles.serviceText}>
                    <Text numberOfLines={1} style={styles.serviceTitle}>
                      {item.title}
                    </Text>
                    <Text numberOfLines={1} style={styles.serviceSubtitle}>
                      {item.subtitle}
                    </Text>
                  </View>
                  {index === 0 ? (
                    <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
                  ) : null}
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.settingsBlock}>
            <Text style={styles.sectionTitle}>账号与协议</Text>
            <Text style={styles.sectionCaption}>服务协议查阅</Text>
            <View style={styles.settingsList}>
              {SETTINGS.map((item, index) => (
                <Pressable
                  key={item}
                  style={[
                    styles.settingsRow,
                    index === SETTINGS.length - 1 && styles.settingsRowLast
                  ]}
                >
                  <Text style={styles.settingsLabel}>{item}</Text>
                  <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                </Pressable>
              ))}
            </View>
          </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "#F2F3F5",
    flex: 1
  },
  hero: {
    minHeight: 304,
    overflow: "hidden",
    width: "100%"
  },
  floatingProfileBar: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderBottomColor: "rgba(229, 231, 235, 0.92)",
    borderBottomWidth: StyleSheet.hairlineWidth,
    elevation: 12,
    left: 0,
    position: "absolute",
    right: 0,
    shadowColor: "#111827",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    top: 0,
    zIndex: 30
  },
  floatingProfileContent: {
    alignItems: "center",
    alignSelf: "center",
    flex: 1,
    flexDirection: "row",
    gap: 10,
    maxWidth: 560,
    paddingHorizontal: 16,
    width: "100%"
  },
  floatingAvatar: {
    borderColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 2,
    height: 36,
    width: 36
  },
  floatingIdentity: {
    flex: 1,
    minWidth: 0
  },
  floatingName: {
    color: "#111827",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 18
  },
  floatingGenderPill: {
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    borderColor: "#BFDBFE",
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: "row",
    flexShrink: 0,
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 4
  },
  floatingGenderText: {
    color: "#2563EB",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0
  },
  floatingProfileTabs: {
    alignItems: "center",
    flexDirection: "row",
    gap: 4
  },
  floatingProfileTabActive: {
    backgroundColor: "#111827",
    borderRadius: 8,
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0,
    overflow: "hidden",
    paddingHorizontal: 9,
    paddingVertical: 5
  },
  floatingProfileTab: {
    color: "#6B7280",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0,
    paddingHorizontal: 4
  },
  heroImage: {
    height: "100%",
    width: "100%"
  },
  heroShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(8, 13, 22, 0.18)"
  },
  heroContent: {
    alignItems: "center",
    alignSelf: "center",
    flex: 1,
    flexDirection: "row",
    gap: 14,
    justifyContent: "flex-end",
    maxWidth: 560,
    paddingBottom: 42,
    paddingHorizontal: 20,
    width: "100%"
  },
  avatarStage: {
    alignItems: "center",
    flexShrink: 0
  },
  avatarRing: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderColor: "#FFFFFF",
    borderRadius: 43,
    borderWidth: 2,
    height: 86,
    justifyContent: "center",
    position: "relative",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.22,
    shadowRadius: 22,
    width: 86
  },
  avatarImage: {
    borderRadius: 38,
    height: 76,
    width: 76
  },
  genderBadge: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 17,
    borderWidth: 1,
    bottom: -2,
    height: 34,
    justifyContent: "center",
    position: "absolute",
    right: -9,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    width: 34
  },
  identityBlock: {
    flex: 1,
    minWidth: 0,
    minHeight: 86,
    justifyContent: "center"
  },
  profileTextStack: {
    justifyContent: "center",
    minHeight: 76
  },
  name: {
    color: "#FFFFFF",
    flexShrink: 1,
    fontSize: 29,
    fontWeight: "800",
    letterSpacing: 0,
    lineHeight: 34
  },
  companyName: {
    color: "rgba(255, 255, 255, 0.82)",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0,
    lineHeight: 20,
    marginTop: 5
  },
  contentSheet: {
    backgroundColor: "#FFFFFF",
    marginTop: -34,
    overflow: "hidden",
    width: "100%"
  },
  sheetTabs: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8
  },
  sheetTabsInner: {
    alignItems: "center",
    alignSelf: "center",
    flexDirection: "row",
    maxWidth: 560,
    minHeight: 72,
    paddingHorizontal: 22,
    width: "100%"
  },
  contentBody: {
    alignSelf: "center",
    backgroundColor: "#F2F3F5",
    maxWidth: 560,
    paddingBottom: 18,
    width: "100%"
  },
  activeTab: {
    marginRight: 32
  },
  activeTabText: {
    color: "#111827",
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: 0
  },
  activeTabLine: {
    backgroundColor: "#111827",
    borderRadius: 8,
    height: 4,
    marginTop: 8,
    width: 38
  },
  tabText: {
    color: "#8F949B",
    flex: 1,
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: 0
  },
  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 14,
    padding: 16
  },
  summaryHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12
  },
  sectionTitle: {
    color: "#111827",
    fontSize: 17,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 23
  },
  sectionCaption: {
    color: "#9CA3AF",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0,
    marginTop: 3
  },
  summaryGrid: {
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    flexDirection: "row",
    marginTop: 15,
    paddingVertical: 13
  },
  summaryItem: {
    alignItems: "center",
    flex: 1
  },
  summaryValue: {
    color: "#111827",
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 25
  },
  summaryLabel: {
    color: "#6B7280",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0,
    marginTop: 3
  },
  summaryDivider: {
    backgroundColor: "#E5E7EB",
    height: 30,
    width: StyleSheet.hairlineWidth
  },
  sectionBlock: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 14,
    padding: 16
  },
  sectionHeader: {
    marginBottom: 14
  },
  serviceGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  serviceCard: {
    alignItems: "center",
    backgroundColor: "#FBFCFE",
    borderColor: "#EEF2F7",
    borderRadius: 8,
    borderWidth: 1,
    flexBasis: "48%",
    flexDirection: "row",
    flexGrow: 1,
    gap: 10,
    minHeight: 70,
    paddingHorizontal: 12
  },
  serviceCardFeatured: {
    flexBasis: "100%",
    flexGrow: 0,
    minHeight: 82,
    paddingHorizontal: 14
  },
  serviceIcon: {
    alignItems: "center",
    borderRadius: 8,
    height: 42,
    justifyContent: "center",
    width: 42
  },
  serviceIconFeatured: {
    height: 50,
    width: 50
  },
  serviceText: {
    flex: 1,
    minWidth: 0
  },
  serviceTitle: {
    color: "#111827",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 0
  },
  serviceSubtitle: {
    color: "#9CA3AF",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0,
    marginTop: 4
  },
  settingsBlock: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 14,
    paddingHorizontal: 16,
    paddingTop: 16
  },
  settingsList: {
    marginTop: 8
  },
  settingsRow: {
    alignItems: "center",
    borderBottomColor: "#F1F5F9",
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 52
  },
  settingsRowLast: {
    borderBottomWidth: 0
  },
  settingsLabel: {
    color: "#111827",
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0,
    lineHeight: 21
  }
});
