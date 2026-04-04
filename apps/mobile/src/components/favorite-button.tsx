import { Pressable, StyleSheet, Text } from "react-native";

import { useFavorites } from "../lib/favorites";
import { palette } from "../theme";

type FavoriteButtonProps = {
  isFavorited: boolean;
  placeId: string;
};

export function FavoriteButton({ isFavorited, placeId }: FavoriteButtonProps) {
  const { toggleFavorite } = useFavorites();

  return (
    <Pressable
      onPress={() => toggleFavorite(placeId)}
      style={[styles.button, isFavorited ? styles.buttonActive : undefined]}
    >
      <Text style={[styles.text, isFavorited ? styles.textActive : undefined]}>
        {isFavorited ? "Saved to favorites" : "Save place"}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: palette.text,
    borderRadius: 999,
    justifyContent: "center",
    minHeight: 46,
    paddingHorizontal: 16
  },
  buttonActive: {
    backgroundColor: palette.brand
  },
  text: {
    color: "#fffdf8",
    fontSize: 14,
    fontWeight: "700"
  },
  textActive: {
    color: "#fffdf8"
  }
});
