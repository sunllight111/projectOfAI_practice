import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const HOT_KEYWORDS = ["重庆火锅", "通勤穿搭", "低脂鸡肉", "周末旅行", "桌面改造", "城市夜景"];

const RESULT_CARDS = [
  {
    id: "recipe",
    title: "最近大家都在搜",
    subtitle: "空气炸锅鸡肉、懒人早餐、重庆小面",
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "city",
    title: "本地灵感",
    subtitle: "山城步道、江边夜景、老茶馆路线",
    image:
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=400&q=80"
  }
];

export function SearchScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [query, setQuery] = useState("");

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#111827" />
        </Pressable>
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={20} color="#9CA3AF" />
          <TextInput
            autoFocus
            clearButtonMode="while-editing"
            placeholder="搜索笔记、用户、商品"
            placeholderTextColor="#9CA3AF"
            returnKeyType="search"
            style={styles.input}
            value={query}
            onChangeText={setQuery}
          />
        </View>
        <Pressable style={styles.cancelButton} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelText}>取消</Text>
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>热门搜索</Text>
          <Ionicons name="flame" size={18} color="#F43F5E" />
        </View>

        <View style={styles.keywordWrap}>
          {HOT_KEYWORDS.map((keyword) => (
            <Pressable
              key={keyword}
              style={styles.keywordPill}
              onPress={() => setQuery(keyword)}
            >
              <Text style={styles.keywordText}>{keyword}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>搜索发现</Text>
          <Text style={styles.moreText}>换一换</Text>
        </View>

        <View style={styles.resultList}>
          {RESULT_CARDS.map((card) => (
            <Pressable key={card.id} style={styles.resultCard}>
              <Image source={{ uri: card.image }} style={styles.resultImage} />
              <View style={styles.resultBody}>
                <Text numberOfLines={1} style={styles.resultTitle}>
                  {card.title}
                </Text>
                <Text numberOfLines={2} style={styles.resultSubtitle}>
                  {card.subtitle}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
            </Pressable>
          ))}
        </View>

        <View style={styles.emptyHint}>
          <Ionicons name="sparkles-outline" size={28} color="#94A3B8" />
          <Text style={styles.emptyTitle}>输入关键词开始探索</Text>
          <Text style={styles.emptyText}>
            可以搜索笔记标题、作者昵称、美食、城市或穿搭灵感。
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "#FFFFFF",
    flex: 1
  },
  header: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderBottomColor: "#F1F5F9",
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: 8,
    paddingBottom: 10,
    paddingHorizontal: 12
  },
  backButton: {
    alignItems: "center",
    height: 40,
    justifyContent: "center",
    width: 36
  },
  searchBox: {
    alignItems: "center",
    backgroundColor: "#F6F7F9",
    borderRadius: 999,
    flex: 1,
    flexDirection: "row",
    gap: 8,
    height: 42,
    paddingHorizontal: 14
  },
  input: {
    color: "#111827",
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    letterSpacing: 0,
    padding: 0
  },
  cancelButton: {
    alignItems: "center",
    height: 40,
    justifyContent: "center",
    minWidth: 44
  },
  cancelText: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0
  },
  content: {
    paddingBottom: 34,
    paddingHorizontal: 16,
    paddingTop: 18
  },
  sectionHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12
  },
  sectionTitle: {
    color: "#111827",
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 0
  },
  moreText: {
    color: "#64748B",
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0
  },
  keywordWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 24
  },
  keywordPill: {
    backgroundColor: "#F8FAFC",
    borderColor: "#E5E7EB",
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 9
  },
  keywordText: {
    color: "#334155",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0
  },
  resultList: {
    gap: 12
  },
  resultCard: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#EEF2F7",
    borderRadius: 8,
    borderWidth: 1,
    elevation: 2,
    flexDirection: "row",
    gap: 12,
    padding: 10,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8
  },
  resultImage: {
    backgroundColor: "#E5E7EB",
    borderRadius: 8,
    height: 70,
    width: 86
  },
  resultBody: {
    flex: 1,
    minWidth: 0
  },
  resultTitle: {
    color: "#111827",
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 0
  },
  resultSubtitle: {
    color: "#64748B",
    fontSize: 14,
    fontWeight: "500",
    letterSpacing: 0,
    lineHeight: 20,
    marginTop: 5
  },
  emptyHint: {
    alignItems: "center",
    marginTop: 34,
    paddingHorizontal: 22
  },
  emptyTitle: {
    color: "#334155",
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 0,
    marginTop: 10
  },
  emptyText: {
    color: "#94A3B8",
    fontSize: 14,
    fontWeight: "500",
    letterSpacing: 0,
    lineHeight: 21,
    marginTop: 6,
    textAlign: "center"
  }
});
