// This file is a fallback for using MaterialIcons on Android and web.

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { SymbolWeight } from 'expo-symbols';
import React from 'react';
import { OpaqueColorValue, StyleProp, TextStyle } from 'react-native';

// Mapeo universal para iOS y Android
const MAPPING = {
  'house.fill': 'home',
  'plus': 'plus',
  'person.fill': 'account',
  'book.fill': 'book',
  'chart.bar.fill': 'chart-bar',
  'camera.rotate.fill': 'camera-flip',
  'xmark.square.fill': 'close-box',
  'stop': 'stop',
  'play': 'play',
  'checkmark': 'check',
  'plus.app': 'plus-box',
  'pencil': 'pencil',
  'trash': 'delete'
} as const;

export type IconSymbolName = keyof typeof MAPPING;

/**
 * An icon component that uses native SFSymbols on iOS, and MaterialIcons on Android and web. This ensures a consistent look across platforms, and optimal resource usage.
 *
 * Icon `name`s are based on SFSymbols and require manual mapping to MaterialIcons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
}) {
  return <MaterialCommunityIcons name={MAPPING[name]} size={size} color={color} style={style} />;
}
