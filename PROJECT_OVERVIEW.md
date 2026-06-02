# ChatGPT Demo 项目说明

更新时间：2026-06-02

本文档用于帮助维护者或 AI 助手快速理解当前项目。内容以现有代码为准，不描述尚未落地的功能假设。

## 1. 项目概览

`chatgpt-demo` 是一个基于 Expo 的 React Native 应用，目前已经从最初的占位 Demo 演进为一个包含内容流、搜索、工作台能力演示和虚拟宠物页的移动端原型。

当前主要功能：

- `Home`：类小红书首页，包含 `关注 / 发现 / 重庆` 三个频道，支持横向频道切换和纵向瀑布流浏览。
- `Search`：从 Home 搜索按钮进入的搜索页，包含搜索输入框、热门搜索、搜索发现和空状态提示。
- `AI`：工作台页，当前演示音频播放、手机震动和中英文切换。
- `Profile`：虚拟宠物页，包含 3D 宠物渲染、触摸/拖拽互动、喂食/逗玩/休息按钮和宠物状态 HUD。
- 全局：支持中英文文案切换，底部 tabbar 使用悬浮半透明胶囊样式。

项目目前没有后端接口、登录体系、真实 ChatGPT API 调用、持久化存储或测试框架。

## 2. 技术栈

核心依赖以 `package.json` 和 `package-lock.json` 为准：

- Expo `~54.0.35`
- React `19.1.0`
- React Native `0.81.5`
- TypeScript `~5.9.2`，启用 `strict`
- React Navigation 6，使用 Bottom Tabs
- `react-native-safe-area-context`：安全区适配
- `@expo/vector-icons`：Ionicons 图标
- `expo-audio`：AI 页音频播放演示
- `expo-gl`、`expo-three`、`three`、`@react-three/fiber`：虚拟宠物 3D 渲染
- `react-native-gesture-handler`、`react-native-reanimated`：手势和动画基础依赖
- `react-native-web`、`@expo/metro-runtime`：Expo Web 支持

## 3. 运行方式

`package.json` 中保留了常规 Expo scripts：

```bash
npm start
npm run android
npm run ios
npm run web
```

但当前机器环境里曾出现 `npm` 不在 PATH、用户目录 `.expo` 无写权限的问题。因此项目额外提供了 VS Code/Codex 任务：

```text
Expo: start
```

该任务定义在 `.vscode/tasks.json`，会使用 Codex bundled Node，并把 `USERPROFILE`、`HOME`、`EXPO_HOME` 指向项目内 `.expo-home`，避免 Expo 写入受限的用户目录。

手动等价命令：

```powershell
$env:USERPROFILE = "${PWD}\.expo-home"
$env:HOME = "${PWD}\.expo-home"
$env:EXPO_HOME = "${PWD}\.expo-home"
& 'C:\Users\11528\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' .\node_modules\expo\bin\cli start --localhost
```

类型检查可使用：

```powershell
& 'C:\Users\11528\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' .\node_modules\typescript\bin\tsc --noEmit
```

## 4. 目录结构

关键业务目录如下：

```text
.
├── App.tsx
├── index.js
├── app.json
├── babel.config.js
├── package.json
├── tsconfig.json
├── .vscode/
│   └── tasks.json
├── assets/
│   └── audio/
│       └── rain-3s.wav
└── src/
    ├── components/
    │   └── AppHeader.tsx
    ├── i18n/
    │   └── language.tsx
    ├── navigation/
    │   ├── RootNavigator.tsx
    │   └── types.ts
    ├── screens/
    │   ├── AiScreen.tsx
    │   ├── HomeScreen.tsx
    │   ├── ProfileScreen.tsx
    │   └── SearchScreen.tsx
    └── pet/
        ├── VirtualPetModule.tsx
        ├── engine/
        ├── interaction/
        ├── renderer/
        └── ui/
```

## 5. 应用启动链路

启动链路：

1. `index.js`
2. `App.tsx`
3. `src/navigation/RootNavigator.tsx`
4. 当前选中的 screen

`App.tsx` 当前包裹顺序：

```tsx
<SafeAreaProvider>
  <LanguageProvider>
    <NavigationContainer>
      <StatusBar style="dark" />
      <RootNavigator />
    </NavigationContainer>
  </LanguageProvider>
</SafeAreaProvider>
```

含义：

- `SafeAreaProvider` 提供刘海屏、状态栏、底部安全区数据。
- `LanguageProvider` 提供当前语言、切换语言和 `t(key)` 翻译函数。
- `NavigationContainer` 是 React Navigation 根容器。
- `RootNavigator` 注册底部 tab 和隐藏搜索页。

## 6. 导航结构

导航集中在 `src/navigation`。

### `types.ts`

当前路由类型：

```ts
export type RootTabParamList = {
  Home: undefined;
  AI: undefined;
  Profile: undefined;
  Search: undefined;
};
```

`Search` 是挂在 Bottom Tab Navigator 中的隐藏路由，用于从首页搜索按钮跳转；它不显示底部 tab 按钮。

### `RootNavigator.tsx`

主要职责：

- 注册 `Home`、`AI`、`Profile`、`Search`
- 首页、个人页、搜索页隐藏默认 header
- `Search` 隐藏底部 tabbar
- 底部 tabbar 使用悬浮半透明胶囊样式
- tab 文案走 i18n：`首页 / 工作台 / 我`

tab 图标映射：

| Route | 选中 | 未选中 |
| --- | --- | --- |
| `Home` | `home` | `home-outline` |
| `AI` | `briefcase` | `briefcase-outline` |
| `Profile` | `person` | `person-outline` |

底部 tabbar 注意点：

- 使用 `position: "absolute"` 悬浮在内容上。
- 页面底部内容需要自行预留空间，Home 和 Pet HUD 已分别通过 `useBottomTabBarHeight()` 做了底部安全留白。
- `Search` 页面通过 `tabBarButton: () => null` 隐藏 tab 按钮。

## 7. 国际化

国际化逻辑在 `src/i18n/language.tsx`。

能力：

- 语言类型：`zh | en`
- 默认语言：`zh`
- `LanguageProvider` 保存语言状态
- `useLanguage()` 返回：
  - `language`
  - `setLanguage`
  - `toggleLanguage`
  - `t(key)`

当前覆盖范围：

- Home 顶部 tab、频道、按钮 accessibility label
- AI 页按钮和语言切换文案
- Pet 页动作、状态、消息和数值标签
- 底部 tab 文案

新增文案时需要先扩展 `TranslationKey` 联合类型，再同步补齐 `TRANSLATIONS.zh` 和 `TRANSLATIONS.en`。

## 8. 页面说明

### `HomeScreen.tsx`

Home 是当前最复杂的页面，模拟小红书风格信息流。

主要能力：

- 顶部主频道：`关注 / 发现 / 重庆`
- 顶部二级频道：`推荐 / RED / 直播 / 短剧 / 美食 / 旅行 / 穿搭`
- 右上角搜索按钮跳转到 `Search`
- 三个主频道均有自定义内容数据
- 每个频道内部是两列 masonry 瀑布流
- 支持横向频道切换和纵向内容滚动
- 底部预留悬浮 tabbar 空间

当前实现要点：

- 三个频道页面并排渲染在 `Animated.View` track 中。
- `PanResponder` 只在横向移动明显大于纵向移动时接管手势，避免影响瀑布流上下滚动。
- `pageTranslateX` 控制页面横向跟手移动。
- `activeProgress` 控制顶部 tab 的字体大小、颜色和下划线动画。
- `switchSection()` 负责频道吸附和状态同步。
- 吸附动画使用 `Animated.timing + Easing.out(Easing.cubic)`，避免 spring 越界导致非目标 tab 抖动。
- 瀑布流不用 `FlatList numColumns`，而是手动把数据按估算高度拆成左右两列，避免行高对齐造成大空白。

瀑布流相关函数：

- `splitMasonryColumns(items)`
- `getEstimatedCardHeight(item)`
- `renderFeedCard(item, language)`

当前卡片特征：

- 网络图片来自 Unsplash
- 支持普通图、长图、视频播放角标、点赞态
- 标题不再固定最小高度，短标题会让作者栏自然上移
- 作者头像、昵称、点赞信息按小红书信息流比例压缩

### `SearchScreen.tsx`

搜索页从首页右上角搜索按钮进入。

当前 UI：

- 顶部返回按钮
- 搜索输入框，`autoFocus`
- 取消按钮
- 热门搜索标签
- 搜索发现卡片
- 输入提示空状态

当前没有真实搜索逻辑、网络请求或结果过滤，点击热门词只会填充输入框。

### `AiScreen.tsx`

底部 tab 显示为“工作台”，对应代码路由仍是 `AI`。

当前能力：

- 页面标题显示 `AI 2112133`
- 播放 `assets/audio/rain-3s.wav`
- 调用 `Vibration.vibrate(500)`
- 切换中英文语言

注意：当前没有 ChatGPT 对话 UI、模型调用、API client 或消息状态管理。

### `ProfileScreen.tsx`

`ProfileScreen` 只渲染：

```tsx
<VirtualPetModule />
```

主要逻辑在 `src/pet`。

## 9. 虚拟宠物模块

入口：`src/pet/VirtualPetModule.tsx`

模块组成：

```text
src/pet/
├── VirtualPetModule.tsx
├── engine/
│   ├── petTypes.ts
│   └── usePetStateMachine.ts
├── interaction/
│   ├── petHitTest.ts
│   └── usePetGestures.ts
├── renderer/
│   ├── PetCanvas.tsx
│   ├── PetLighting.tsx
│   ├── PetModel.tsx
│   └── PetScene.tsx
└── ui/
    └── PetHud.tsx
```

能力：

- 3D 宠物场景渲染
- 宠物头部、身体、尾巴和空白区域命中测试
- tap、dragStart、dragMove、dragEnd 事件
- 喂食、逗玩、休息按钮
- 饥饿、精力、亲密度三项数值
- 心情和消息文案走 i18n

`PetHud` 底部按钮曾与悬浮 tabbar 重合，目前通过 `useBottomTabBarHeight()` 动态计算底部留白。

关键类型见 `petTypes.ts`：

- `PetState`
- `PetEvent`
- `PetHitRegion`
- `PetStats`
- `PetSnapshot`

## 10. 公共组件

### `AppHeader.tsx`

公共顶部 header，用于需要默认导航标题的页面。

职责：

- 读取顶部安全区 `insets.top`
- 渲染固定高度 56 的标题栏
- 提供白色背景、底部分割线和轻微阴影

Home、Profile、Search 当前隐藏默认 header；AI/工作台仍使用 `AppHeader title="ChatGPT Demo"`。

## 11. 配置文件

### `package.json`

保留 Expo 常规 scripts 和当前依赖声明。

### `app.json`

Expo 应用配置：

- name：`ChatGPT Demo`
- slug：`chatgpt-demo`
- version：`1.0.0`
- orientation：`portrait`
- userInterfaceStyle：`light`
- iOS supportsTablet：`true`

当前尚未配置生产级 icon、splash、bundle id/package name、权限、scheme、EAS build 字段等。

### `babel.config.js`

使用 `babel-preset-expo`，并启用：

```js
plugins: ["react-native-reanimated/plugin"]
```

Reanimated 插件通常需要放在 plugins 最后；当前只有这一个插件。

### `tsconfig.json`

当前配置：

- extends：`expo/tsconfig.base`
- `jsx: "react"`
- `strict: true`

## 12. 样式和交互约定

当前 UI 约定：

- 主要背景：白色或浅色
- 卡片圆角多为 8
- 字体统一 `letterSpacing: 0`
- 底部 tabbar 是悬浮胶囊，不占布局流空间
- 内容页需要主动为底部 tabbar 预留空间
- 首页信息流尽量贴近小红书式紧凑卡片
- 复杂交互优先保持移动端手势自然性：横向频道切换不能破坏纵向滚动

## 13. 当前未实现能力

以下功能尚未实现：

- 真实 ChatGPT API 调用
- AI 聊天消息列表、输入框、流式输出
- 用户登录/注册
- 真实搜索请求或搜索结果过滤
- 后端接口层
- 本地持久化
- 深色模式
- 单元测试、组件测试、E2E 测试
- 生产级构建配置
- App icon 和 splash

## 14. 维护注意事项

- 不要删除 `index.js` 顶部的 `import "react-native-gesture-handler";`。
- 修改底部 tabbar 高度或位置时，同步检查：
  - Home 的 `feedBottomPadding`
  - PetHud 的 `bottomClearance`
- 修改路由名时，同步更新：
  - `RootTabParamList`
  - `Tab.Screen name`
  - `getTabLabel`
  - `getTabIcon`
  - 所有 `navigation.navigate(...)`
- 新增翻译 key 时必须同步补齐中英文。
- 首页频道切换使用自定义 `PanResponder + Animated.View`，修改时要同时验证左右切换和上下滚动。
- 首页瀑布流是手动两列 masonry，不是 `FlatList numColumns`。
- 网络图片来自外部 URL，离线或网络异常时图片可能不显示。
- 当前开发环境建议优先使用 `.vscode/tasks.json` 的 `Expo: start`。

## 15. 快速理解清单

如果需要快速恢复上下文，建议按顺序阅读：

1. `package.json`
2. `App.tsx`
3. `src/navigation/types.ts`
4. `src/navigation/RootNavigator.tsx`
5. `src/i18n/language.tsx`
6. `src/screens/HomeScreen.tsx`
7. `src/screens/SearchScreen.tsx`
8. `src/screens/AiScreen.tsx`
9. `src/screens/ProfileScreen.tsx`
10. `src/pet/VirtualPetModule.tsx`
11. `src/pet/engine/usePetStateMachine.ts`
12. `src/pet/ui/PetHud.tsx`

当前项目一句话概括：

```text
Expo App -> SafeArea + Language Provider -> Bottom Tabs -> 首页内容流 / 工作台演示 / 3D 虚拟宠物 / 隐藏搜索页
```

## 16. 文件职责速查

| 文件 | 职责 |
| --- | --- |
| `index.js` | 注册 Expo 根组件，初始化 gesture handler |
| `App.tsx` | 全局 Provider、导航容器、状态栏 |
| `src/i18n/language.tsx` | 中英文翻译和语言切换 |
| `src/navigation/types.ts` | 路由参数类型 |
| `src/navigation/RootNavigator.tsx` | Bottom Tabs、隐藏搜索路由、悬浮 tabbar |
| `src/components/AppHeader.tsx` | 默认页面 header |
| `src/screens/HomeScreen.tsx` | 首页频道、瀑布流、横向切换、搜索入口 |
| `src/screens/SearchScreen.tsx` | 搜索页基础 UI |
| `src/screens/AiScreen.tsx` | 工作台演示：音频、震动、语言切换 |
| `src/screens/ProfileScreen.tsx` | 虚拟宠物页入口 |
| `src/pet/VirtualPetModule.tsx` | 虚拟宠物布局整合 |
| `src/pet/engine/*` | 宠物状态机和类型 |
| `src/pet/interaction/*` | 宠物手势和命中测试 |
| `src/pet/renderer/*` | 3D 宠物渲染 |
| `src/pet/ui/PetHud.tsx` | 宠物状态 HUD 和操作按钮 |
| `.vscode/tasks.json` | 无 npm/PATH 依赖的 Expo 启动任务 |

## 17. 后续开发建议

- 首页若继续追求小红书效果，可引入成熟 masonry 列表库，减少手写高度估算误差。
- 搜索页可增加本地过滤或接入真实接口。
- AI 页如要变成 ChatGPT Demo，应先实现消息 UI，再抽 service/API 层。
- 虚拟宠物可增加本地存档，保存亲密度、精力、饥饿值。
- 引入真实 API 前不要在客户端硬编码密钥。
- UI 继续扩展时建议抽出 theme tokens，统一颜色、间距和字号。
