import React from "react";
import Svg, { Path, Circle, Rect, Ellipse, G } from "react-native-svg";

/* ---------- 图标集注册 ----------
 * 添加新图标集只需两步：
 *   1. npm install @iconify-json/<name>
 *   2. 在下方 IMPORT 区加一行 import，然后塞进 SOURCES 数组里
 * ------------------------------------------------- */

import mdiData from "@iconify-json/mdi/icons.json";
import msData from "@iconify-json/material-symbols/icons.json";
import solarData from "@iconify-json/solar/icons.json";
import mingcuteData from "@iconify-json/mingcute/icons.json";
import tablerData from "@iconify-json/tabler/icons.json";
import riData from "@iconify-json/ri/icons.json";
import carbonData from "@iconify-json/carbon/icons.json";
import lucideData from "@iconify-json/lucide/icons.json";
import fluentData from "@iconify-json/fluent/icons.json";
import laData from "@iconify-json/la/icons.json";
import emjMonotoneData from "@iconify-json/emojione-monotone/icons.json";
import gameIconData from "@iconify-json/game-icons/icons.json";
import faSolidData from "@iconify-json/fa-solid/icons.json";


type IconData = { body: string; width?: number; height?: number };
type IconSetData = { prefix: string; icons: Record<string, IconData> };

const SOURCES = [
  mdiData, msData, solarData, mingcuteData, tablerData, laData, emjMonotoneData, gameIconData,
  riData, carbonData, lucideData, fluentData, faSolidData
] as IconSetData[];

const ICON_SETS: Record<string, IconSetData> = {};
for (const src of SOURCES) {
  ICON_SETS[src.prefix] = src;
}

// fallback viewBox when icon data lacks width/height
const DEFAULT_SIZE: Record<string, number> = {
  la: 30, ri: 24, mdi: 24, "material-symbols": 24, solar: 24,
  "emojione-monotone": 64, mingcute: 24, tabler: 24, carbon: 32,
  lucide: 24, fluent: 24,'game-icons': 512, 'fa-solid': 512
};

/* ---------- SVG 解析 ---------- */

const TAG_MAP: Record<string, React.ComponentType<any>> = { g: G, path: Path, circle: Circle, ellipse: Ellipse, rect: Rect };

function camelKey(k: string): string {
  return k.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

const NUMERIC_KEYS = ["cx", "cy", "r", "rx", "ry", "x", "y", "x1", "x2", "y1", "y2"];
const NUMERIC_KEYS_SET = new Set(NUMERIC_KEYS);

function parseBody(body: string, color?: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const re = /<(\w+)\s+([^>]*?)\s*\/>/g;
  let match;

  while ((match = re.exec(body)) !== null) {
    const tag = match[1];
    const attrs = match[2];
    const Component = TAG_MAP[tag];
    if (!Component) continue;

    const props: Record<string, any> = {};
    const attrRe = /(\w[\w-]*)=["']([^"']*)["']/g;
    let attrMatch;
    while ((attrMatch = attrRe.exec(attrs)) !== null) {
      const rawKey = attrMatch[1];
      const val = attrMatch[2];
      const key = camelKey(rawKey);

      // Replace currentColor in both fill and stroke
      if (val === "currentColor") {
        if (color && (key === "fill" || key === "stroke")) {
          props[key] = `#${color}`;
        } else {
          props[key] = val;
        }
      } else if (key === "d") {
        props.d = val;
      } else if (NUMERIC_KEYS_SET.has(key)) {
        props[key] = parseFloat(val);
      } else if (["opacity", "fillOpacity", "strokeOpacity", "strokeWidth", "strokeMiterlimit"].includes(key)) {
        props[key] = parseFloat(val);
      } else {
        props[key] = val;
      }
    }

    // Fallback: if icon is stroke-based (fill=none) and no stroke color, apply color there
    if (color && props.fill === "none" && !props.stroke) {
      props.stroke = `#${color}`;
    } else if (color && !props.fill) {
      props.fill = `#${color}`;
    }
    nodes.push(React.createElement(Component, { ...props, key: nodes.length }));
  }

  return nodes;
}

/* ---------- 组件 ---------- */

type IconifyProps = {
  icon: string;    // e.g. "mdi:home", "solar:accumulator-outline"
  size?: number;
  color?: string;  // hex without #, e.g. "ff4400"
};

export function Iconify({ icon, size = 24, color }: IconifyProps) {
  const [prefix, name] = icon.split(":");
  const set = ICON_SETS[prefix];
  const iconData: IconData | undefined = set?.icons?.[name];
  if (!iconData) return null;

  const defSize = DEFAULT_SIZE[prefix] ?? 24;
  const viewBox = `0 0 ${iconData.width ?? defSize} ${iconData.height ?? defSize}`;
  return (
    <Svg width={size} height={size} viewBox={viewBox}>
      {parseBody(iconData.body, color)}
    </Svg>
  );
}
