# ChatGPT Demo 项目说明文档

更新时间：2026-05-29

本文档用于帮助后续维护者或 AI 助手快速理解本项目。它基于当前代码实际内容编写，不包含尚未实现的功能假设。

## 1. 项目概览

`chatgpt-demo` 是一个使用 Expo 搭建的 React Native 应用，当前实现了一个最小可运行的三 Tab 移动端界面：

- `Home`：首页，占位显示 `ChatGPT`
- `AI`：AI 页面，占位显示 `AI`
- `Profile`：个人页，占位显示 `Profile`

项目目前没有后端接口、没有本地持久化、没有全局状态管理，也没有真正的 ChatGPT / AI 调用逻辑。当前代码主要完成了应用壳、底部 Tab 导航、安全区域适配和基础页面占位。

## 2. 技术栈

核心技术：

- Expo：应用运行、打包和开发服务入口
- React 19
- React Native 0.85
- TypeScript，开启 `strict`
- React Navigation 6，使用 Bottom Tabs
- `react-native-safe-area-context`：处理刘海屏、状态栏等安全区域
- `expo-status-bar`：控制状态栏样式
- `@expo/vector-icons`：底部 Tab 图标使用 Ionicons
- `react-native-reanimated`：已配置 Babel 插件，但当前业务代码尚未使用动画
- `react-native-web` 与 `@expo/metro-runtime`：支持 Expo Web

重要依赖版本以 `package.json` 和 `package-lock.json` 为准。当前 `package-lock.json` 使用 lockfileVersion 3。

## 3. 运行方式

常用 npm scripts 定义在 `package.json`：

```bash
npm start
npm run android
npm run ios
npm run web
```

脚本含义：

- `npm start`：执行 `expo start`
- `npm run android`：执行 `expo start --android`
- `npm run ios`：执行 `expo start --ios`
- `npm run web`：执行 `expo start --web`

当前项目目录中已经存在 `node_modules`，也有 `package-lock.json`。如果在新环境中恢复依赖，应优先使用：

```bash
npm install
```

或在需要严格复现锁文件时使用：

```bash
npm ci
```

## 4. 目录结构

当前有效源码结构如下，`node_modules` 和 `.expo` 是生成/依赖目录，不应作为业务代码阅读重点。

```text
.
├── App.tsx
├── index.js
├── app.json
├── babel.config.js
├── package.json
├── package-lock.json
├── tsconfig.json
├── assets/
│   └── .gitkeep
└── src/
    ├── components/
    │   └── AppHeader.tsx
    ├── navigation/
    │   ├── RootNavigator.tsx
    │   └── types.ts
    └── screens/
        ├── AiScreen.tsx
        ├── HomeScreen.tsx
        └── ProfileScreen.tsx
```

## 5. 启动链路

应用启动链路非常短：

1. `index.js`
2. `App.tsx`
3. `src/navigation/RootNavigator.tsx`
4. 当前选中的 screen，例如 `HomeScreen`

### `index.js`

职责：

- 首先导入 `react-native-gesture-handler`
- 从 `expo` 导入 `registerRootComponent`
- 导入根组件 `App`
- 调用 `registerRootComponent(App)` 注册应用入口

注意点：

- `react-native-gesture-handler` 的导入放在最顶部，这是 React Navigation / 手势相关依赖的常见要求，不建议随意移动到其他导入之后。

### `App.tsx`

职责：

- 包裹 `SafeAreaProvider`
- 包裹 `NavigationContainer`
- 设置 Expo 状态栏为 `dark`
- 渲染 `RootNavigator`

当前组件结构：

```tsx
<SafeAreaProvider>
  <NavigationContainer>
    <StatusBar style="dark" />
    <RootNavigator />
  </NavigationContainer>
</SafeAreaProvider>
```

含义：

- `SafeAreaProvider` 为后代组件提供安全区域数据，`AppHeader` 会读取这里的数据。
- `NavigationContainer` 是 React Navigation 的根容器，所有 navigator 必须处于其内部。
- `StatusBar style="dark"` 表示状态栏图标/文字使用深色，适合当前白色背景。

## 6. 导航结构

导航代码集中在 `src/navigation`。

### `src/navigation/types.ts`

定义根 Tab 的参数类型：

```ts
export type RootTabParamList = {
  Home: undefined;
  AI: undefined;
  Profile: undefined;
};
```

当前三个 Tab 都不接收 route params，所以值都是 `undefined`。

如果以后某个 Tab 需要参数，例如 Profile 需要 `userId`，应修改为类似：

```ts
Profile: { userId: string };
```

然后同步更新跳转调用处和 screen props 类型。

### `src/navigation/RootNavigator.tsx`

职责：

- 创建底部 Tab Navigator
- 注册三个 Tab 页面
- 统一设置顶部 header、底部 Tab 样式和 Tab 图标

核心实现：

```tsx
const Tab = createBottomTabNavigator<RootTabParamList>();
```

注册的页面：

```tsx
<Tab.Screen name="Home" component={HomeScreen} />
<Tab.Screen name="AI" component={AiScreen} />
<Tab.Screen name="Profile" component={ProfileScreen} />
```

统一 screen options：

- `header`：所有页面都使用 `AppHeader`，标题固定为 `ChatGPT Demo`
- `tabBarActiveTintColor`：选中颜色 `#111827`
- `tabBarInactiveTintColor`：未选中颜色 `#9CA3AF`
- `tabBarLabelStyle`：字体 12、字重 600、底部间距 4
- `tabBarStyle`：高度 64，白底，顶部边线，带轻微阴影
- `tabBarIcon`：根据 route name 和 focused 状态返回 Ionicons 图标

Tab 图标映射由 `getTabIcon` 负责：

| 路由名 | 选中图标 | 未选中图标 |
| --- | --- | --- |
| `Home` | `home` | `home-outline` |
| `AI` | `sparkles` | `sparkles-outline` |
| `Profile` | `person` | `person-outline` |

`getTabIcon` 返回类型是 `keyof typeof Ionicons.glyphMap`，这样 TypeScript 可以约束图标名称必须存在于 Ionicons 图标集中。

## 7. 公共组件

### `src/components/AppHeader.tsx`

`AppHeader` 是当前唯一公共组件。

Props：

```ts
type AppHeaderProps = {
  title: string;
};
```

职责：

- 读取设备安全区域顶部 inset
- 用 `paddingTop: insets.top` 避免内容被状态栏或刘海区域遮挡
- 渲染一个固定高度 56 的居中标题栏
- 提供白色背景、底部分割线和轻微阴影

结构：

```tsx
<View style={[styles.safeArea, { paddingTop: insets.top }]}>
  <View style={styles.header}>
    <Text style={styles.title}>{title}</Text>
  </View>
</View>
```

样式要点：

- `safeArea.backgroundColor` 是 `#FFFFFF`
- `safeArea.borderBottomWidth` 使用 `StyleSheet.hairlineWidth`
- `safeArea.elevation` 支持 Android 阴影
- `safeArea.shadow*` 支持 iOS 阴影
- `header.height` 固定为 56
- 标题颜色为 `#111827`，字号 18，字重 700

当前所有 Tab 的 header title 都由 `RootNavigator` 固定传入 `ChatGPT Demo`。如果未来希望不同页面显示不同标题，可以在 `screenOptions` 中根据 `route.name` 生成标题，或在每个 `Tab.Screen` 的 `options` 里单独配置。

## 8. 页面说明

当前三个页面都在 `src/screens` 下，结构高度一致：白色背景、flex 居中、水平 padding 24、一个标题文本。

### `src/screens/HomeScreen.tsx`

显示内容：

```tsx
<Text style={styles.title}>ChatGPT</Text>
```

样式：

- 背景白色
- 内容水平和垂直居中
- 标题颜色 `#111827`
- 字号 32
- 字重 700

这是当前默认首个 Tab，应用打开后通常先看到该页面。

### `src/screens/AiScreen.tsx`

显示内容：

```tsx
<Text style={styles.title}>AI</Text>
```

样式：

- 背景白色
- 内容居中
- 标题字号 28
- 字重 700

虽然页面名是 AI，但当前没有聊天输入、消息列表、模型调用、API key、网络请求或状态管理逻辑。

### `src/screens/ProfileScreen.tsx`

显示内容：

```tsx
<Text style={styles.title}>Profile</Text>
```

样式：

- 背景白色
- 内容居中
- 标题字号 28
- 字重 700

当前没有用户资料、登录态、设置项或账户相关逻辑。

## 9. 配置文件说明

### `package.json`

说明：

- 项目名：`chatgpt-demo`
- 版本：`1.0.0`
- 私有包：`private: true`
- 主入口：`index.js`
- 包含 Expo 常用启动脚本

主要运行依赖：

- Expo / React / React Native
- React Navigation bottom tabs
- React Native Gesture Handler
- React Native Reanimated
- React Native Safe Area Context
- React Native Screens
- Expo Vector Icons
- Expo Font / Status Bar
- React Native Web

开发依赖：

- `@babel/core`
- `@types/react`
- `typescript`

### `app.json`

Expo 应用配置：

- 应用名：`ChatGPT Demo`
- slug：`chatgpt-demo`
- 版本：`1.0.0`
- 方向：竖屏 `portrait`
- 用户界面风格：浅色 `light`
- 背景色：白色
- `assetBundlePatterns`：打包所有 assets
- iOS 支持 iPad：`supportsTablet: true`
- Android 当前没有额外配置

当前没有配置：

- icon
- splash
- bundle identifier / package name
- permissions
- scheme
- OTA updates
- EAS build 相关字段

### `babel.config.js`

使用 Expo Babel preset：

```js
presets: ["babel-preset-expo"]
```

并配置：

```js
plugins: ["react-native-reanimated/plugin"]
```

注意点：

- `react-native-reanimated/plugin` 通常要求放在 Babel plugins 最后。当前 plugins 数组只有它一个，所以满足该要求。

### `tsconfig.json`

配置说明：

- 继承 `expo/tsconfig.base`
- 开启 `strict: true`
- 设置 `baseUrl: "."`
- 配置路径别名：

```json
"@/*": ["src/*"]
```

当前源码里还没有使用 `@/` 别名，全部使用相对路径导入。后续可以选择继续相对导入，也可以统一迁移到别名导入。

当前验证到的注意点：

- 直接运行 `.\node_modules\.bin\tsc.cmd --noEmit` 会因为 TypeScript 6 的 `baseUrl` 弃用提示失败：

```text
Option 'baseUrl' is deprecated and will stop functioning in TypeScript 7.0.
Specify compilerOption '"ignoreDeprecations": "6.0"' to silence this error.
```

- 这不是业务代码类型错误，而是 TypeScript 6 对配置项的迁移提示。如果希望当前 `tsc --noEmit` 通过，可以在 `compilerOptions` 中补充 `"ignoreDeprecations": "6.0"`，或后续按 TypeScript 7 迁移建议调整路径别名配置。

### `package-lock.json`

锁定依赖版本。当前 lockfileVersion 是 3。维护依赖时应避免手动编辑该文件，使用 `npm install`、`npm uninstall` 或 `npm update` 让 npm 自动维护。

## 10. 样式约定

当前 UI 风格非常克制：

- 主背景：白色 `#FFFFFF`
- 主文字：深灰黑 `#111827`
- 次级/未选中：灰色 `#9CA3AF`
- 分割线：`#F1F5F9` 或 `#EEF2F7`
- 字体通过系统默认字体渲染，没有自定义字体加载逻辑
- 组件样式都用 React Native 的 `StyleSheet.create`
- 所有页面都使用 `letterSpacing: 0`

重复出现的页面布局模式：

```ts
container: {
  alignItems: "center",
  backgroundColor: "#FFFFFF",
  flex: 1,
  justifyContent: "center",
  paddingHorizontal: 24
}
```

如果新增页面并希望保持现有视觉一致，可以先复用这个布局模式。

## 11. 当前数据流和状态

当前项目没有复杂数据流：

- 没有 React Context 业务状态
- 没有 Redux、Zustand、MobX 等状态库
- 没有 React Query / SWR
- 没有 AsyncStorage
- 没有网络请求
- 没有表单状态
- 没有环境变量
- 没有 API client 层

唯一动态数据来自：

- React Navigation 的当前 route
- `tabBarIcon` 的 focused 状态
- `useSafeAreaInsets()` 返回的安全区域 top inset

## 12. 如何新增一个 Tab 页面

假设要新增 `Settings` 页面，建议步骤如下：

1. 在 `src/screens/SettingsScreen.tsx` 新建页面组件。
2. 在 `src/navigation/types.ts` 增加：

```ts
Settings: undefined;
```

3. 在 `src/navigation/RootNavigator.tsx` 导入页面：

```ts
import { SettingsScreen } from "../screens/SettingsScreen";
```

4. 在 `Tab.Navigator` 内增加：

```tsx
<Tab.Screen name="Settings" component={SettingsScreen} />
```

5. 在 `getTabIcon` 里增加 Settings 的图标映射，例如：

```ts
if (routeName === "Settings") {
  return focused ? "settings" : "settings-outline";
}
```

6. 如果需要不同 header 标题，调整 `screenOptions` 或给对应 `Tab.Screen` 添加 `options`。

## 13. 如何把 AI 页面扩展成聊天功能

当前 `AiScreen` 是最适合承载 ChatGPT 聊天功能的位置。推荐演进方向：

1. 先在 `AiScreen` 内实现本地 UI 状态：消息列表、输入框、发送按钮、loading 状态、错误状态。
2. 再抽离 API 层，例如新增 `src/services/openaiClient.ts` 或 `src/api/chat.ts`。
3. 不要在前端源码中硬编码 API key。移动端应用无法真正保密前端内置 key，生产场景应通过自己的后端代理调用模型服务。
4. 如果要保存历史记录，再考虑引入本地存储或后端账户体系。
5. 当页面逻辑变复杂时，再拆分组件，例如：

```text
src/screens/AiScreen.tsx
src/components/chat/MessageList.tsx
src/components/chat/MessageBubble.tsx
src/components/chat/Composer.tsx
src/services/chatService.ts
```

当前项目没有上述文件，它们只是后续可选扩展方向。

## 14. 维护注意事项

- 不要删除 `index.js` 顶部的 `import "react-native-gesture-handler";`。
- 修改 Reanimated 配置时，确保 `react-native-reanimated/plugin` 仍然在 Babel plugins 最后。
- 当前 TypeScript 版本约为 6.0，`tsconfig.json` 中的 `baseUrl` 已触发弃用提示；做类型检查前需要处理 `ignoreDeprecations` 或迁移配置。
- 新增 navigator 时要确认仍被 `NavigationContainer` 包裹。
- 新增使用安全区域的组件时，应继续依赖 `SafeAreaProvider` 和 `useSafeAreaInsets`。
- 修改路由名称时，需要同步更新：
  - `RootTabParamList`
  - `Tab.Screen name`
  - `getTabIcon`
  - 所有导航跳转调用处
- `assets` 当前只有 `.gitkeep`，如果新增图片或字体，应同步检查 `app.json` 的 asset 配置是否满足需求。
- 当前不是 Git 仓库，目录里没有 `.git`。如果要进行版本管理，需要先初始化或放入已有仓库。

## 15. 当前未实现能力

以下能力从项目名或页面名看起来可能会被期待，但当前代码并未实现：

- ChatGPT API 调用
- 聊天消息 UI
- AI 响应流式输出
- 用户登录/注册
- Profile 数据读取或编辑
- 设置页
- 深色模式
- 多语言
- 错误边界
- 单元测试 / 组件测试
- E2E 测试
- 环境变量管理
- 生产构建配置
- App 图标和启动屏

## 16. 快速理解清单

如果之后只想用最短时间恢复项目上下文，按下面顺序读：

1. `package.json`：确认技术栈和启动脚本。
2. `index.js`：确认 Expo 注册入口。
3. `App.tsx`：确认全局 Provider 和导航容器。
4. `src/navigation/types.ts`：确认路由类型。
5. `src/navigation/RootNavigator.tsx`：确认 Tab 结构、header 和图标映射。
6. `src/components/AppHeader.tsx`：确认顶部栏实现。
7. `src/screens/*.tsx`：确认各页面当前业务内容。

当前项目的核心可以概括为：

```text
Expo 入口 -> App Provider -> React Navigation Bottom Tabs -> 三个占位页面
```

## 17. 文件职责速查表

| 文件 | 职责 | 当前复杂度 |
| --- | --- | --- |
| `index.js` | 注册 Expo 根组件，初始化 gesture handler | 很低 |
| `App.tsx` | 全局 Provider、导航容器、状态栏 | 很低 |
| `src/navigation/types.ts` | 定义 Tab 路由参数类型 | 很低 |
| `src/navigation/RootNavigator.tsx` | 底部 Tab 导航、统一 header、Tab 图标和样式 | 中低 |
| `src/components/AppHeader.tsx` | 顶部标题栏和安全区域适配 | 中低 |
| `src/screens/HomeScreen.tsx` | 首页占位 | 很低 |
| `src/screens/AiScreen.tsx` | AI 页占位 | 很低 |
| `src/screens/ProfileScreen.tsx` | 个人页占位 | 很低 |
| `app.json` | Expo 应用元配置 | 很低 |
| `babel.config.js` | Babel 和 Reanimated 插件配置 | 很低 |
| `tsconfig.json` | TypeScript strict 和路径别名配置 | 很低 |
| `package.json` | 依赖和脚本 | 很低 |

## 18. 后续开发建议

短期建议：

- 如果目标是做 ChatGPT Demo，优先完善 `AiScreen`，先做本地聊天 UI，再接 API。
- 如果目标是做产品原型，补齐 `app.json` 的 icon、splash、bundle id/package name。
- 如果代码继续增长，提取共享颜色、间距、字体等 design tokens，例如 `src/theme.ts`。
- 如果引入真实 API，新增 service 层并避免把密钥写入客户端。
- 如果页面需要复杂布局，优先保证 iOS、Android、Web 三端表现一致。

测试建议：

- 当前项目没有测试框架配置。由于代码很少，暂时可以依赖 TypeScript 检查和手动运行。
- 当增加聊天逻辑、API 层或数据转换时，应补充单元测试。
- 当增加关键用户流程时，可考虑后续引入 E2E 测试。
