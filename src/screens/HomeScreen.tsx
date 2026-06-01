import React from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  FlatList,
  Image,
  ListRenderItemInfo,
  Pressable,
  StyleSheet,
  Text,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type FeedItem = {
  id: string;
  title: string;
  author: string;
  likes: string;
  image: string;
  avatar: string;
  tall?: boolean;
  liked?: boolean;
  video?: boolean;
};

const CHANNELS = ["推荐", "RED", "直播", "短剧", "美食", "旅行", "穿搭"];

const FEED_ITEMS: FeedItem[] = [
  {
    id: "food",
    title: "香迷糊了！这才是鸡肉的天花板做法！！",
    author: "煲汤小馋猫",
    likes: "3765",
    liked: true,
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80"
  },
  {
    id: "trail",
    title: "Hello, I'm back.",
    author: "MATI",
    likes: "1546",
    video: true,
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80"
  },
  {
    id: "hair",
    title: "全部暴露！理发把我当时社死！",
    author: "小封要逃离...",
    likes: "4.5万",
    tall: true,
    image:
      "https://images.unsplash.com/photo-1522336572468-97b06e8ef143?auto=format&fit=crop&w=900&q=80",
    avatar:
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=120&q=80"
  },
  {
    id: "tree",
    title: "一树一世界",
    author: "叮咚",
    likes: "5.8万",
    image:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=900&q=80",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"
  },
  {
    id: "room",
    title: "周末宅家也要把松弛感拿捏住",
    author: "橘子气泡水",
    likes: "8922",
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80",
    avatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80"
  },
  {
    id: "city",
    title: "重庆的夜风，真的会把人哄好",
    author: "山城漫游",
    likes: "2.3万",
    tall: true,
    image:
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=900&q=80",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80"
  }
];

export function HomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.screen}>
      <View style={[styles.topSafeArea, { paddingTop: insets.top }]}>
        <View style={styles.topBar}>
          <Pressable style={styles.iconButton} accessibilityLabel="打开菜单">
            <Ionicons name="menu-outline" size={32} color="#222222" />
          </Pressable>

          <View style={styles.mainTabs}>
            <View style={styles.followTabWrap}>
              <Text style={styles.inactiveMainTab}>关注</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>16</Text>
              </View>
            </View>
            <View style={styles.activeMainTabWrap}>
              <Text style={styles.activeMainTab}>发现</Text>
              <View style={styles.activeUnderline} />
            </View>
            <Text style={styles.inactiveMainTab}>重庆</Text>
          </View>

          <Pressable style={styles.iconButton} accessibilityLabel="搜索">
            <Ionicons name="search-outline" size={32} color="#222222" />
          </Pressable>
        </View>

        <View style={styles.channelBar}>
          {CHANNELS.map((channel, index) => (
            <Text
              key={channel}
              numberOfLines={1}
              style={[
                styles.channelText,
                index === 0 && styles.channelTextActive
              ]}
            >
              {channel}
            </Text>
          ))}
          <Ionicons name="chevron-down" size={22} color="#222222" />
        </View>
      </View>

      <FlatList
        data={FEED_ITEMS}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={renderFeedItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.feedContent}
        columnWrapperStyle={styles.feedRow}
      />
    </View>
  );
}

function renderFeedItem({ item }: ListRenderItemInfo<FeedItem>) {
  return (
    <View style={styles.card}>
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
        <Text style={styles.cardTitle}>{item.title}</Text>
        <View style={styles.metaRow}>
          <View style={styles.authorRow}>
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <Text numberOfLines={1} style={styles.author}>
              {item.author}
            </Text>
          </View>
          <View style={styles.likeRow}>
            <Ionicons
              name={item.liked ? "heart" : "heart-outline"}
              size={20}
              color={item.liked ? "#F43F5E" : "#7B7B7B"}
            />
            <Text style={styles.likes}>{item.likes}</Text>
          </View>
        </View>
      </View>
    </View>
  );
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
    height: 44,
    justifyContent: "center",
    width: 44
  },
  mainTabs: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    gap: 34
  },
  activeMainTabWrap: {
    alignItems: "center",
    gap: 6
  },
  activeMainTab: {
    color: "#191919",
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: 0
  },
  inactiveMainTab: {
    color: "#8E8E93",
    fontSize: 22,
    fontWeight: "500",
    letterSpacing: 0
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
    letterSpacing: 0
  },
  channelBar: {
    alignItems: "center",
    flexDirection: "row",
    height: 52,
    justifyContent: "space-between",
    paddingHorizontal: 12
  },
  channelText: {
    color: "#8E8E93",
    fontSize: 19,
    fontWeight: "500",
    letterSpacing: 0,
    maxWidth: 52
  },
  channelTextActive: {
    color: "#191919",
    fontWeight: "700"
  },
  feedContent: {
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 18
  },
  feedRow: {
    alignItems: "flex-start",
    gap: 8,
    marginBottom: 8
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    flex: 1,
    overflow: "hidden"
  },
  cardImage: {
    aspectRatio: 0.79,
    backgroundColor: "#F1F5F9",
    width: "100%"
  },
  tallCardImage: {
    aspectRatio: 0.68
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
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 12
  },
  cardTitle: {
    color: "#222222",
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 0,
    lineHeight: 25
  },
  metaRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    justifyContent: "space-between",
    marginTop: 12
  },
  authorRow: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    gap: 7,
    minWidth: 0
  },
  avatar: {
    backgroundColor: "#E5E7EB",
    borderRadius: 999,
    height: 24,
    width: 24
  },
  author: {
    color: "#7B7B7B",
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    letterSpacing: 0
  },
  likeRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 3
  },
  likes: {
    color: "#7B7B7B",
    fontSize: 14,
    fontWeight: "500",
    letterSpacing: 0
  }
});
