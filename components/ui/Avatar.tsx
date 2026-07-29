import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { Image } from "expo-image";
import { getSocketBaseUrl } from "@/constants/api";
import { getInitials } from "@/utils/format";

interface AvatarProps {
  name: string;
  imageUrl?: string | null;
  size?: number;
  borderRadius?: number;
  backgroundColor?: string;
  textColor?: string;
  style?: StyleProp<ViewStyle>;
}

function resolveImageUrl(imageUrl?: string | null) {
  const trimmed = imageUrl?.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith("//")) return `https:${trimmed}`;
  return `${getSocketBaseUrl()}${trimmed.startsWith("/") ? "" : "/"}${trimmed}`;
}

export default function Avatar({
  name,
  imageUrl,
  size = 40,
  borderRadius = size / 2,
  backgroundColor = "#F37021",
  textColor = "#FFFFFF",
  style,
}: AvatarProps) {
  const resolvedUrl = resolveImageUrl(imageUrl);
  const [hasImageError, setHasImageError] = useState(false);

  useEffect(() => {
    setHasImageError(false);
  }, [resolvedUrl]);

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius,
          backgroundColor,
        },
        style,
      ]}
      accessibilityLabel={`Ảnh đại diện của ${name}`}
    >
      <Text
        style={[
          styles.fallbackText,
          {
            color: textColor,
            fontSize: Math.max(10, Math.round(size * 0.34)),
          },
        ]}
      >
        {getInitials(name)}
      </Text>
      {resolvedUrl && !hasImageError ? (
        <Image
          source={resolvedUrl}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          cachePolicy="memory-disk"
          transition={150}
          accessibilityLabel={`Ảnh đại diện của ${name}`}
          onError={() => setHasImageError(true)}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  fallbackText: {
    fontWeight: "900",
  },
});
