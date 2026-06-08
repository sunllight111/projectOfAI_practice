import React, { useEffect, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  BottomTabNavigationProp,
  useBottomTabBarHeight
} from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import {
  Animated,
  Easing,
  FlatList,
  Image,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Language, TranslationKey, useLanguage } from "../i18n/language";
import type { RootTabParamList } from "../navigation/types";

type FeedItem = {
  id: string;
  title: Record<Language, string>;
  author: Record<Language, string>;
  likes: Record<Language, string>;
  image: string;
  avatar: string;
  tall?: boolean;
  liked?: boolean;
  video?: boolean;
};

type FeedSection = {
  id: "following" | "discover" | "city";
  labelKey: TranslationKey;
  items: FeedItem[];
};

const CHANNEL_KEYS: TranslationKey[] = [
  "home.channels.recommend",
  "home.channels.red",
  "home.channels.live",
  "home.channels.shortDrama",
  "home.channels.food",
  "home.channels.travel",
  "home.channels.outfit"
];

const DISCOVER_ITEMS: FeedItem[] = [
  {
    id: "food",
    title: {
      zh: "\u9999\u8ff7\u7cca\u4e86\uff0c\u8fd9\u624d\u662f\u9e21\u8089\u7684\u5929\u82b1\u677f\u505a\u6cd5\uff01",
      en: "This chicken recipe is pure comfort food."
    },
    author: {
      zh: "\u7172\u6c64\u5c0f\u53a8",
      en: "Soup Kitchen"
    },
    likes: {
      zh: "3765",
      en: "3,765"
    },
    liked: true,
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80"
  },
  {
    id: "trail",
    title: {
      zh: "Hello, I'm back.",
      en: "Hello, I'm back."
    },
    author: {
      zh: "MATI",
      en: "MATI"
    },
    likes: {
      zh: "1546",
      en: "1,546"
    },
    video: true,
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80"
  },
  {
    id: "hair",
    title: {
      zh: "\u5168\u90e8\u66dd\u5149\uff01\u7406\u53d1\u5e08\u628a\u6211\u5f53\u65f6\u5c1a\u5b9e\u9a8c\u4e86",
      en: "Full reveal: my stylist tried something bold."
    },
    author: {
      zh: "\u5c0f\u5c01\u8981\u9003\u79bb",
      en: "Faye Notes"
    },
    likes: {
      zh: "4.5\u4e07",
      en: "45K"
    },
    tall: true,
    image:
      "https://images.unsplash.com/photo-1522336572468-97b06e8ef143?auto=format&fit=crop&w=900&q=80",
    avatar:
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=120&q=80"
  },
  {
    id: "tree",
    title: {
      zh: "\u4e00\u6811\u4e00\u4e16\u754c",
      en: "A whole world in one tree."
    },
    author: {
      zh: "\u53ee\u549a",
      en: "Ding Dong"
    },
    likes: {
      zh: "5.8\u4e07",
      en: "58K"
    },
    image:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=900&q=80",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"
  },
  {
    id: "room",
    title: {
      zh: "\u5468\u672b\u5b85\u5bb6\u4e5f\u8981\u628a\u677e\u5f1b\u611f\u62ff\u634f\u4f4f",
      en: "Weekend at home, but make it relaxed."
    },
    author: {
      zh: "\u6a58\u5b50\u6c14\u6ce1\u6c34",
      en: "Orange Soda"
    },
    likes: {
      zh: "8922",
      en: "8,922"
    },
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80",
    avatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80"
  },
  {
    id: "city-night",
    title: {
      zh: "\u91cd\u5e86\u7684\u591c\u98ce\uff0c\u771f\u7684\u4f1a\u628a\u4eba\u54c4\u597d",
      en: "Chongqing night air can fix your mood."
    },
    author: {
      zh: "\u5c71\u57ce\u6f2b\u6e38",
      en: "City Wanderer"
    },
    likes: {
      zh: "2.3\u4e07",
      en: "23K"
    },
    tall: true,
    image:
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=900&q=80",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80"
  }
];

const FOLLOWING_ITEMS: FeedItem[] = [
  {
    id: "friend-breakfast",
    title: {
      zh: "\u6211\u5173\u6ce8\u7684\u535a\u4e3b\u53c8\u505a\u4e86\u4e00\u684c\u65e9\u9910",
      en: "A followed creator made another perfect breakfast."
    },
    author: {
      zh: "\u5c0f\u6843\u65e5\u8bb0",
      en: "Peach Diary"
    },
    likes: {
      zh: "982",
      en: "982"
    },
    image:
      "https://images.unsplash.com/photo-1493770348161-369560ae357d?auto=format&fit=crop&w=900&q=80",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80"
  },
  {
    id: "friend-outfit",
    title: {
      zh: "\u901a\u52e4\u7a7f\u642d\uff1a\u7070\u8272\u4e5f\u53ef\u4ee5\u5f88\u6709\u7cbe\u795e",
      en: "Commute outfit: gray can still feel bright."
    },
    author: {
      zh: "\u963f\u7af9\u7a7f\u642d",
      en: "Azhu Style"
    },
    likes: {
      zh: "1.1\u4e07",
      en: "11K"
    },
    tall: true,
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80",
    avatar:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=120&q=80"
  },
  {
    id: "friend-desk",
    title: {
      zh: "\u4eca\u5929\u7684\u4e66\u684c\u5c31\u50cf\u4e00\u4e2a\u5c0f\u5c0f\u7684\u907f\u98ce\u6e2f",
      en: "Today's desk feels like a tiny harbor."
    },
    author: {
      zh: "\u6d77\u76d0\u85af\u6761",
      en: "Sea Salt Fries"
    },
    likes: {
      zh: "6456",
      en: "6,456"
    },
    image:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=80",
    avatar:
      "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=120&q=80"
  },
  {
    id: "friend-coffee",
    title: {
      zh: "\u8001\u670b\u53cb\u63a8\u8350\u7684\u5496\u5561\u9986\uff0c\u7a97\u8fb9\u4f4d\u592a\u597d\u5750",
      en: "A friend's cafe pick with the best window seat."
    },
    author: {
      zh: "\u4e5d\u6708\u6563\u6b65",
      en: "September Walk"
    },
    likes: {
      zh: "3201",
      en: "3,201"
    },
    video: true,
    image:
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=900&q=80",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
  },
  {
    id: "friend-plant",
    title: {
      zh: "\u517b\u690d\u7269\u7684\u4eba\u5e94\u8be5\u90fd\u61c2\u8fd9\u79cd\u6cbb\u6108",
      en: "Plant people know this quiet kind of healing."
    },
    author: {
      zh: "\u7eff\u8272\u661f\u671f\u4e09",
      en: "Green Wednesday"
    },
    likes: {
      zh: "7788",
      en: "7,788"
    },
    image:
      "https://images.unsplash.com/photo-1463320726281-696a485928c7?auto=format&fit=crop&w=900&q=80",
    avatar:
      "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?auto=format&fit=crop&w=120&q=80"
  },
  {
    id: "friend-library",
    title: {
      zh: "\u5728\u56fe\u4e66\u9986\u8e72\u5230\u4e86\u4e00\u675f\u5f88\u597d\u7684\u5149",
      en: "Caught a perfect beam of light in the library."
    },
    author: {
      zh: "\u6162\u6162\u8bfb",
      en: "Slow Reader"
    },
    likes: {
      zh: "2.1\u4e07",
      en: "21K"
    },
    tall: true,
    image:
      "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=900&q=80",
    avatar:
      "https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&w=120&q=80"
  }
];

const CITY_ITEMS: FeedItem[] = [
  {
    id: "cq-hotpot",
    title: {
      zh: "\u89e3\u653e\u7891\u9644\u8fd1\u7684\u8001\u706b\u9505\uff0c\u8fa3\u5f97\u5f88\u6b63",
      en: "Old-school hotpot near Jiefangbei, properly spicy."
    },
    author: {
      zh: "\u91cd\u5e86\u8fa3\u5b50",
      en: "Chili Chongqing"
    },
    likes: {
      zh: "8.6\u4e07",
      en: "86K"
    },
    liked: true,
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80",
    avatar:
      "https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&w=120&q=80"
  },
  {
    id: "cq-river",
    title: {
      zh: "\u5357\u6ee8\u8def\u665a\u98ce\u548c\u6c5f\u666f\uff0c\u4eca\u5929\u503c\u5f97\u6253\u5361",
      en: "Nanbin Road river views are worth the walk tonight."
    },
    author: {
      zh: "\u6c5f\u8fb9\u5c0f\u9e7f",
      en: "River Deer"
    },
    likes: {
      zh: "1.9\u4e07",
      en: "19K"
    },
    tall: true,
    image:
      "https://images.unsplash.com/photo-1542662565-7e4b66bae529?auto=format&fit=crop&w=900&q=80",
    avatar:
      "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=120&q=80"
  },
  {
    id: "cq-stairs",
    title: {
      zh: "\u5c71\u57ce\u6b65\u9053\u771f\u7684\u4e0d\u662f\u968f\u4fbf\u8d70\u8d70",
      en: "Mountain-city stair walks are not casual cardio."
    },
    author: {
      zh: "\u722c\u697c\u9009\u624b",
      en: "Stair Climber"
    },
    likes: {
      zh: "6532",
      en: "6,532"
    },
    image:
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=900&q=80",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
  },
  {
    id: "cq-market",
    title: {
      zh: "\u83dc\u5e02\u573a\u91cc\u7684\u70df\u706b\u6c14\uff0c\u6bd4\u653b\u7565\u66f4\u6709\u7528",
      en: "Market life says more than any travel guide."
    },
    author: {
      zh: "\u65e9\u5e02\u6536\u85cf\u5bb6",
      en: "Morning Market"
    },
    likes: {
      zh: "9345",
      en: "9,345"
    },
    video: true,
    image:
      "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=900&q=80",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"
  },
  {
    id: "cq-rail",
    title: {
      zh: "\u8f7b\u8f68\u7a7f\u697c\u7684\u90a3\u4e00\u523b\uff0c\u6e38\u5ba2\u90fd\u5728\u60ca\u547c",
      en: "The rail-through-building moment still gets everyone."
    },
    author: {
      zh: "\u8f7b\u8f68\u65c5\u4eba",
      en: "Rail Traveler"
    },
    likes: {
      zh: "3.4\u4e07",
      en: "34K"
    },
    image:
      "https://images.unsplash.com/photo-1485738422979-f5c462d49f74?auto=format&fit=crop&w=900&q=80",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80"
  },
  {
    id: "cq-tea",
    title: {
      zh: "\u8001\u8336\u9986\u91cc\u5750\u4e00\u4e0b\uff0c\u65f6\u95f4\u5c31\u6162\u4e86",
      en: "Sit in an old teahouse and time slows down."
    },
    author: {
      zh: "\u76d6\u7897\u8336",
      en: "Gaiwan Tea"
    },
    likes: {
      zh: "7261",
      en: "7,261"
    },
    tall: true,
    image:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=80",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80"
  }
];

const FEED_SECTIONS: FeedSection[] = [
  {
    id: "following",
    labelKey: "home.tabs.following",
    items: FOLLOWING_ITEMS
  },
  {
    id: "discover",
    labelKey: "home.tabs.discover",
    items: DISCOVER_ITEMS
  },
  {
    id: "city",
    labelKey: "home.tabs.city",
    items: CITY_ITEMS
  }
];

export function HomeScreen() {
  const activeIndexRef = useRef(1);
  const widthRef = useRef(0);
  const activeProgress = useRef(new Animated.Value(1)).current;
  const pageTranslateX = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const navigation =
    useNavigation<BottomTabNavigationProp<RootTabParamList, "Home">>();
  const { width } = useWindowDimensions();
  const { language, t } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(1);
  const feedBottomPadding = Math.max(tabBarHeight + insets.bottom + 18, 100);

  useEffect(() => {
    widthRef.current = width;
    activeProgress.setValue(activeIndexRef.current);
    pageTranslateX.setValue(-activeIndexRef.current * width);
  }, [activeProgress, pageTranslateX, width]);

  const updateActiveIndex = (index: number) => {
    const nextIndex = Math.max(0, Math.min(index, FEED_SECTIONS.length - 1));

    if (nextIndex !== activeIndexRef.current) {
      activeIndexRef.current = nextIndex;
      setActiveIndex(nextIndex);
    }
  };

  const switchSection = (index: number) => {
    const nextIndex = Math.max(0, Math.min(index, FEED_SECTIONS.length - 1));
    const currentWidth = widthRef.current || width;

    updateActiveIndex(nextIndex);
    Animated.parallel([
      Animated.timing(activeProgress, {
        toValue: nextIndex,
        duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false
      }),
      Animated.timing(pageTranslateX, {
        toValue: -nextIndex * currentWidth,
        duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false
      })
    ]).start();
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        const horizontalMove = Math.abs(gestureState.dx);
        const verticalMove = Math.abs(gestureState.dy);

        return horizontalMove > 24 && horizontalMove > verticalMove * 1.35;
      },
      onPanResponderMove: (_, gestureState) => {
        const currentIndex = activeIndexRef.current;
        const currentWidth = widthRef.current;
        const minTranslate = -(FEED_SECTIONS.length - 1) * currentWidth;
        const maxTranslate = 0;
        const nextTranslate = Math.max(
          minTranslate,
          Math.min(maxTranslate, -currentIndex * currentWidth + gestureState.dx)
        );
        const nextProgress = Math.max(
          0,
          Math.min(
            FEED_SECTIONS.length - 1,
            currentIndex - gestureState.dx / currentWidth
          )
        );

        pageTranslateX.setValue(nextTranslate);
        activeProgress.setValue(nextProgress);
      },
      onPanResponderRelease: (_, gestureState) => {
        const currentIndex = activeIndexRef.current;
        let nextIndex = currentIndex;

        if (gestureState.dx < -54) {
          nextIndex = currentIndex + 1;
        }

        if (gestureState.dx > 54) {
          nextIndex = currentIndex - 1;
        }

        if (gestureState.vx < -0.45) {
          nextIndex = currentIndex + 1;
        }

        if (gestureState.vx > 0.45) {
          nextIndex = currentIndex - 1;
        }

        switchSection(nextIndex);
      },
      onPanResponderTerminate: () => {
        switchSection(activeIndexRef.current);
      }
    })
  ).current;

  return (
    <View style={styles.screen}>
      <View style={[styles.topSafeArea, { paddingTop: insets.top }]}>
        <View style={styles.topBar}>
          <Pressable
            style={styles.iconButton}
            accessibilityLabel={t("home.accessibility.menu")}
          >
            {/* <Ionicons name="menu-outline" size={32} color="#222222" /> */}
          </Pressable>

          <View style={styles.mainTabs}>
            {FEED_SECTIONS.map((section, index) => (
              <Pressable
                key={section.id}
                style={[
                  styles.tabSlot,
                  index === activeIndex && styles.activeMainTabWrap,
                  section.id === "following" && styles.followTabWrap
                ]}
                onPress={() => switchSection(index)}
              >
                <Animated.Text
                  adjustsFontSizeToFit
                  minimumFontScale={0.5}
                  numberOfLines={1}
                  style={[
                    styles.mainTabText,
                    index === activeIndex
                      ? styles.activeTabWeight
                      : styles.inactiveTabWeight,
                    getAnimatedTabTextStyle(activeProgress, index)
                  ]}
                >
                  {t(section.labelKey)}
                </Animated.Text>
                {/* {section.id === "following" ? (
                  <View style={styles.badge}>
                    <Text
                      adjustsFontSizeToFit
                      minimumFontScale={0.72}
                      numberOfLines={1}
                      style={styles.badgeText}
                    >
                      16
                    </Text>
                  </View>
                ) : null} */}
                <Animated.View
                  style={[
                    styles.activeUnderline,
                    getAnimatedUnderlineStyle(activeProgress, index)
                  ]}
                />
              </Pressable>
            ))}
          </View>

          <Pressable
            style={styles.iconButton}
            accessibilityLabel={t("home.accessibility.search")}
            onPress={() => navigation.navigate("Search")}
          >
            <Ionicons name="search-outline" size={32} color="#222222" />
          </Pressable>
        </View>

        {/* <View style={styles.channelBar}>
          {CHANNEL_KEYS.map((channelKey, index) => (
            <Text
              adjustsFontSizeToFit
              key={channelKey}
              minimumFontScale={0.62}
              numberOfLines={1}
              style={[
                styles.channelText,
                index === 0 && styles.channelTextActive
              ]}
            >
              {t(channelKey)}
            </Text>
          ))}
          <Ionicons name="chevron-down" size={22} color="#222222" />
        </View> */}
      </View>

      <View style={styles.feedPager} {...panResponder.panHandlers}>
        <Animated.View
          style={[
            styles.feedTrack,
            {
              width: width * FEED_SECTIONS.length,
              transform: [{ translateX: pageTranslateX }]
            }
          ]}
        >
          {FEED_SECTIONS.map((section) => (
            <FeedPage
              key={section.id}
              feedBottomPadding={feedBottomPadding}
              items={section.items}
              language={language}
              width={width}
            />
          ))}
        </Animated.View>
      </View>
    </View>
  );
}

function getAnimatedTabTextStyle(scrollX: Animated.Value, index: number) {
  const inputRange = [index - 1, index, index + 1];

  return {
    color: scrollX.interpolate({
      inputRange,
      outputRange: ["#B1B1B6", "#191919", "#B1B1B6"],
      extrapolate: "clamp"
    }),
    fontSize: scrollX.interpolate({
      inputRange,
      outputRange: [19, 24, 19],
      extrapolate: "clamp"
    })
  };
}

function getAnimatedUnderlineStyle(scrollX: Animated.Value, index: number) {
  const inputRange = [index - 1, index, index + 1];

  return {
    opacity: scrollX.interpolate({
      inputRange,
      outputRange: [0, 1, 0],
      extrapolate: "clamp"
    }),
    transform: [
      {
        scaleX: scrollX.interpolate({
          inputRange,
          outputRange: [0.35, 1, 0.35],
          extrapolate: "clamp"
        })
      }
    ]
  };
}

function FeedPage({
  feedBottomPadding,
  items,
  language,
  width
}: {
  feedBottomPadding: number;
  items: FeedItem[];
  language: Language;
  width: number;
}) {
  const columns = splitMasonryColumns(items);

  return (
    <View style={[styles.feedPage, { width }]}>
      <FlatList
        data={["masonry"]}
        keyExtractor={(item) => item}
        renderItem={() => (
          <View style={styles.masonryGrid}>
            {columns.map((column, index) => (
              <View key={index} style={styles.masonryColumn}>
                {column.map((item) => renderFeedCard(item, language))}
              </View>
            ))}
          </View>
        )}
        style={styles.feedList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.feedContent,
          { paddingBottom: feedBottomPadding }
        ]}
      />
    </View>
  );
}

function splitMasonryColumns(items: FeedItem[]) {
  const columns: FeedItem[][] = [[], []];
  const columnHeights = [0, 0];

  items.forEach((item) => {
    const targetColumn = columnHeights[0] <= columnHeights[1] ? 0 : 1;
    columns[targetColumn].push(item);
    columnHeights[targetColumn] += getEstimatedCardHeight(item);
  });

  return columns;
}

function getEstimatedCardHeight(item: FeedItem) {
  const titleLength = Math.max(item.title.zh.length, item.title.en.length);
  const titleLines = titleLength > 30 ? 2 : 1;
  const imageWeight = item.tall ? 1.46 : 1.26;

  return imageWeight * 100 + titleLines * 25 + 46;
}

function renderFeedCard(item: FeedItem, language: Language) {
  return (
    <View key={item.id} style={styles.card}>
      <View>
        <Image
          source={{ uri: item.image }}
          style={[styles.cardImage, item.tall && styles.tallCardImage]}
        />
        {item.video ? (
          <View style={styles.playBadge}>
            <Ionicons name="play" size={18} color="#FFFFFF" />
          </View>
        ) : null}
      </View>

      <View style={styles.cardBody}>
        <Text
          adjustsFontSizeToFit
          minimumFontScale={0.74}
          numberOfLines={2}
          style={[
            styles.cardTitle,
            isShortTitle(item, language) && styles.shortCardTitle
          ]}
        >
          {item.title[language]}
        </Text>
        <View style={styles.metaRow}>
          <View style={styles.authorRow}>
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <Text
              adjustsFontSizeToFit
              minimumFontScale={0.68}
              numberOfLines={1}
              style={styles.author}
            >
              {item.author[language]}
            </Text>
          </View>
          <View style={styles.likeRow}>
            <Ionicons
              name={item.liked ? "heart" : "heart-outline"}
              size={20}
              color={item.liked ? "#F43F5E" : "#7B7B7B"}
            />
            <Text
              adjustsFontSizeToFit
              minimumFontScale={0.72}
              numberOfLines={1}
              style={styles.likes}
            >
              {item.likes[language]}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

function isShortTitle(item: FeedItem, language: Language) {
  return item.title[language].length <= 18;
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "#FFFFFF",
    flex: 1
  },
  topSafeArea: {
    backgroundColor: "#FFFFFF",
    borderBottomColor: "#F0F0F0",
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  topBar: {
    alignItems: "center",
    flexDirection: "row",
    height: 64,
    justifyContent: "space-between",
    paddingHorizontal: 14
  },
  iconButton: {
    alignItems: "center",
    flexShrink: 0,
    height: 44,
    justifyContent: "center",
    width: 44
  },
  mainTabs: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    gap: 6,
    justifyContent: "center",
    minWidth: 0
  },
  tabSlot: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    minHeight: 48,
    minWidth: 0
  },
  activeMainTabWrap: {
    gap: 5
  },
  mainTabText: {
    letterSpacing: 0,
    maxWidth: "100%",
    textAlign: "center",
    width: "100%"
  },
  activeTabWeight: {
    fontWeight: "800"
  },
  inactiveTabWeight: {
    fontWeight: "500"
  },
  activeUnderline: {
    backgroundColor: "#F43F5E",
    borderRadius: 999,
    height: 4,
    width: 44
  },
  followTabWrap: {
    position: "relative"
  },
  badge: {
    alignItems: "center",
    backgroundColor: "#F43F5E",
    borderRadius: 999,
    height: 26,
    justifyContent: "center",
    minWidth: 30,
    paddingHorizontal: 6,
    position: "absolute",
    right: -23,
    top: -17
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0,
    maxWidth: 38
  },
  channelBar: {
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
    height: 52,
    justifyContent: "space-between",
    paddingHorizontal: 12
  },
  channelText: {
    color: "#8E8E93",
    flex: 1,
    fontSize: 17,
    fontWeight: "500",
    letterSpacing: 0,
    maxWidth: 76,
    minWidth: 0,
    textAlign: "center"
  },
  channelTextActive: {
    color: "#191919",
    fontWeight: "700"
  },
  feedContent: {
    paddingHorizontal: 8,
    paddingTop: 8
  },
  feedPager: {
    flex: 1,
    overflow: "hidden"
  },
  feedTrack: {
    flex: 1,
    flexDirection: "row"
  },
  feedPage: {
    flex: 1
  },
  feedList: {
    flex: 1
  },
  masonryGrid: {
    flexDirection: "row",
    gap: 6
  },
  masonryColumn: {
    flex: 1,
    gap: 10,
    minWidth: 0
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    width: "100%",
    overflow: "hidden"
  },
  cardImage: {
    aspectRatio: 0.76,
    backgroundColor: "#F1F5F9",
    width: "100%"
  },
  tallCardImage: {
    aspectRatio: 0.62
  },
  playBadge: {
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.35)",
    borderRadius: 999,
    height: 34,
    justifyContent: "center",
    position: "absolute",
    right: 12,
    top: 12,
    width: 34
  },
  cardBody: {
    paddingBottom: 9,
    paddingHorizontal: 9,
    paddingTop: 8
  },
  cardTitle: {
    color: "#222222",
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: 0,
    lineHeight: 23
  },
  shortCardTitle: {
    lineHeight: 22
  },
  metaRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
    justifyContent: "space-between",
    marginTop: 7
  },
  authorRow: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    gap: 6,
    minWidth: 0
  },
  avatar: {
    backgroundColor: "#E5E7EB",
    borderRadius: 999,
    flexShrink: 0,
    height: 22,
    width: 22
  },
  author: {
    color: "#7B7B7B",
    flex: 1,
    fontSize: 13,
    fontWeight: "500",
    letterSpacing: 0,
    minWidth: 0
  },
  likeRow: {
    alignItems: "center",
    flexDirection: "row",
    flexShrink: 0,
    gap: 3,
    maxWidth: 58
  },
  likes: {
    color: "#7B7B7B",
    fontSize: 13,
    fontWeight: "500",
    letterSpacing: 0,
    maxWidth: 38
  }
});
