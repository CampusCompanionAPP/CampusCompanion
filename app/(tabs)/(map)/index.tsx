import { supabase } from "@src/lib/supabase";
import * as Location from "expo-location";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import MapView, {
  Marker,
  Polyline,
  PROVIDER_GOOGLE,
  Region,
} from "react-native-maps";

type CampusSlug = "kennesaw" | "marietta";

type SearchResult = {
  result_type: "building" | "room" | "class";
  building_id: string | null;
  room_id: string | null;
  class_section_id: string | null;
  campus_slug: CampusSlug;
  label: string;
  subtitle: string | null;
  lat: number;
  lng: number;
};

type BuildingMarker = {
  building_id: string;
  label: string;
  subtitle: string | null;
  lat: number;
  lng: number;
};

type RouteResponse = {
  distanceMeters: number;
  duration: string;
  encodedPolyline: string;
};

const CAMPUS_REGIONS: Record<CampusSlug, Region> = {
  kennesaw: {
    latitude: 34.0385,
    longitude: -84.5828,
    latitudeDelta: 0.012,
    longitudeDelta: 0.012,
  },
  marietta: {
    latitude: 33.9382,
    longitude: -84.5192,
    latitudeDelta: 0.012,
    longitudeDelta: 0.012,
  },
};

function decodePolyline(encoded: string) {
  let index = 0;
  let lat = 0;
  let lng = 0;
  const coordinates: { latitude: number; longitude: number }[] = [];

  while (index < encoded.length) {
    let b: number;
    let shift = 0;
    let result = 0;

    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);

    const dlat = result & 1 ? ~(result >> 1) : result >> 1;
    lat += dlat;

    shift = 0;
    result = 0;

    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);

    const dlng = result & 1 ? ~(result >> 1) : result >> 1;
    lng += dlng;

    coordinates.push({
      latitude: lat / 1e5,
      longitude: lng / 1e5,
    });
  }

  return coordinates;
}

function formatDistance(distanceMeters?: number) {
  if (!distanceMeters) return "";
  const miles = distanceMeters / 1609.34;
  if (miles < 0.2) return `${Math.round(distanceMeters)} m`;
  return `${miles.toFixed(2)} mi`;
}

function formatDuration(duration?: string) {
  if (!duration) return "";
  const seconds = Number(duration.replace("s", ""));
  if (Number.isNaN(seconds)) return duration;
  const mins = Math.round(seconds / 60);
  if (mins < 60) return `${mins} min`;
  const hours = Math.floor(mins / 60);
  const remaining = mins % 60;
  return `${hours}h ${remaining}m`;
}

export default function Map() {
  const mapRef = useRef<MapView | null>(null);

  const [campus, setCampus] = useState<CampusSlug>("kennesaw");
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [markers, setMarkers] = useState<BuildingMarker[]>([]);
  const [selected, setSelected] = useState<SearchResult | null>(null);
  const [routeCoords, setRouteCoords] = useState<
    { latitude: number; longitude: number }[]
  >([]);
  const [routeMeta, setRouteMeta] = useState<{
    distanceMeters?: number;
    duration?: string;
  }>({});
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingRoute, setLoadingRoute] = useState(false);

  const activeRegion = useMemo(() => CAMPUS_REGIONS[campus], [campus]);

  useEffect(() => {
    mapRef.current?.animateToRegion(activeRegion, 400);
  }, [activeRegion]);

  useEffect(() => {
    void getUserLocation();
  }, []);

  useEffect(() => {
    void loadCampusMarkers();
  }, [loadCampusMarkers]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      void searchDestinations(query);
    }, 250);

    return () => clearTimeout(timeout);
  }, [query, searchDestinations]);

  async function getUserLocation() {
    try {
      setLoadingLocation(true);
      const permission = await Location.requestForegroundPermissionsAsync();

      if (permission.status !== "granted") {
        setLoadingLocation(false);
        return;
      }

      const current = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setUserLocation({
        latitude: current.coords.latitude,
        longitude: current.coords.longitude,
      });
    } finally {
      setLoadingLocation(false);
    }
  }

  const loadCampusMarkers = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("map_search_index")
        .select("building_id,label,subtitle,lat,lng")
        .eq("campus_slug", campus)
        .eq("result_type", "building");

      if (error || !data) {
        console.error("Error loading buildings:", error);
        return;
      }

      setMarkers(
        data.map((item) => ({
          building_id: item.building_id as string,
          label: item.label as string,
          subtitle: item.subtitle as string | null,
          lat: item.lat as number,
          lng: item.lng as number,
        })),
      );
    } catch (err) {
      console.error("Unexpected error loading markers:", err);
    }
  }, [campus]);

  const searchDestinations = useCallback(async (text: string) => {
    const normalized = text.trim().toLowerCase();

    if (!normalized) {
      setSuggestions([]);
      return;
    }

    try {
      setLoadingSearch(true);

      const { data, error } = await supabase
        .from("map_search_index")
        .select(
          "result_type,building_id,room_id,class_section_id,campus_slug,label,subtitle,lat,lng",
        )
        .eq("campus_slug", campus)
        .ilike("search_text", `%${normalized}%`)
        .limit(8);

      if (error) {
        console.error("Search error:", error);
        setSuggestions([]);
        return;
      }

      setSuggestions((data ?? []) as SearchResult[]);
    } catch (err) {
      console.error("Unexpected error during search:", err);
      setSuggestions([]);
    } finally {
      setLoadingSearch(false);
    }
  }, [campus]);

  async function handleSelectDestination(item: SearchResult) {
    setSelected(item);
    setQuery(item.label);
    setSuggestions([]);
    setRouteCoords([]);
    setRouteMeta({});

    mapRef.current?.animateToRegion(
      {
        latitude: item.lat,
        longitude: item.lng,
        latitudeDelta: 0.004,
        longitudeDelta: 0.004,
      },
      500,
    );

    if (!userLocation) return;

    try {
      setLoadingRoute(true);

      const { data, error } = await supabase.functions.invoke<RouteResponse>(
        "campus-route",
        {
          body: {
            origin: userLocation,
            destination: {
              latitude: item.lat,
              longitude: item.lng,
            },
            travelMode: "WALK",
          },
        },
      );

      if (error || !data) {
        console.error("Route error:", error);
        return;
      }

      setRouteMeta({
        distanceMeters: data.distanceMeters,
        duration: data.duration,
      });

      setRouteCoords(decodePolyline(data.encodedPolyline));
    } catch (err) {
      console.error("Unexpected error calculating route:", err);
    } finally {
      setLoadingRoute(false);
    }
  }

  function recenterCampus() {
    mapRef.current?.animateToRegion(activeRegion, 400);
  }

  function goToMyLocation() {
    if (!userLocation) return;

    mapRef.current?.animateToRegion(
      {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      },
      400,
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topPanel}>
        <Text style={styles.heading}>Campus Map</Text>

        <View style={styles.switcher}>
          <Pressable
            onPress={() => setCampus("kennesaw")}
            style={[
              styles.switchBtn,
              campus === "kennesaw" && styles.switchBtnActive,
            ]}
          >
            <Text
              style={[
                styles.switchText,
                campus === "kennesaw" && styles.switchTextActive,
              ]}
            >
              Kennesaw
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setCampus("marietta")}
            style={[
              styles.switchBtn,
              campus === "marietta" && styles.switchBtnActive,
            ]}
          >
            <Text
              style={[
                styles.switchText,
                campus === "marietta" && styles.switchTextActive,
              ]}
            >
              Marietta
            </Text>
          </Pressable>
        </View>

        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search building, room, or class..."
          placeholderTextColor="#666"
          style={styles.searchInput}
          autoCapitalize="none"
        />

        {loadingSearch ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator />
          </View>
        ) : suggestions.length > 0 ? (
          <View style={styles.suggestionsBox}>
            <FlatList
              keyboardShouldPersistTaps="handled"
              data={suggestions}
              keyExtractor={(item, index) =>
                `${item.result_type}-${item.building_id ?? "x"}-${item.room_id ?? "x"}-${index}`
              }
              renderItem={({ item }) => (
                <Pressable
                  style={styles.suggestionItem}
                  onPress={() => handleSelectDestination(item)}
                >
                  <Text style={styles.suggestionTitle}>{item.label}</Text>
                  {!!item.subtitle && (
                    <Text style={styles.suggestionSubtitle}>
                      {item.subtitle}
                    </Text>
                  )}
                </Pressable>
              )}
            />
          </View>
        ) : null}
      </View>

      <MapView
        ref={(ref) => {
          mapRef.current = ref;
        }}
        style={styles.map}
        initialRegion={activeRegion}
        provider={Platform.OS === "android" ? PROVIDER_GOOGLE : undefined}
        showsUserLocation
        showsMyLocationButton={false}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.building_id}
            coordinate={{ latitude: marker.lat, longitude: marker.lng }}
            title={marker.label}
            description={marker.subtitle ?? undefined}
            onPress={() =>
              handleSelectDestination({
                result_type: "building",
                building_id: marker.building_id,
                room_id: null,
                class_section_id: null,
                campus_slug: campus,
                label: marker.label,
                subtitle: marker.subtitle,
                lat: marker.lat,
                lng: marker.lng,
              })
            }
          />
        ))}

        {selected && (
          <Marker
            coordinate={{ latitude: selected.lat, longitude: selected.lng }}
            title={selected.label}
            description={selected.subtitle ?? undefined}
            pinColor="green"
          />
        )}

        {routeCoords.length > 0 && (
          <Polyline
            coordinates={routeCoords}
            strokeWidth={5}
            strokeColor="#2563eb"
          />
        )}
      </MapView>

      <View style={styles.floatingActions}>
        <Pressable style={styles.actionButton} onPress={recenterCampus}>
          <Text style={styles.actionText}>Campus</Text>
        </Pressable>

        <Pressable style={styles.actionButton} onPress={goToMyLocation}>
          <Text style={styles.actionText}>My GPS</Text>
        </Pressable>
      </View>

      <View style={styles.bottomCard}>
        {loadingLocation ? (
          <Text style={styles.cardMuted}>Getting your current location...</Text>
        ) : !userLocation ? (
          <Text style={styles.cardMuted}>
            Location permission is off. You can still search buildings, but
            routing needs GPS.
          </Text>
        ) : selected ? (
          <>
            <Text style={styles.cardTitle}>{selected.label}</Text>
            {!!selected.subtitle && (
              <Text style={styles.cardSubtitle}>{selected.subtitle}</Text>
            )}

            {loadingRoute ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator />
                <Text style={styles.cardMuted}>
                  Calculating walking route...
                </Text>
              </View>
            ) : routeCoords.length > 0 ? (
              <Text style={styles.cardRoute}>
                {formatDistance(routeMeta.distanceMeters)} •{" "}
                {formatDuration(routeMeta.duration)}
              </Text>
            ) : (
              <Text style={styles.cardMuted}>
                Tap a result to get route guidance.
              </Text>
            )}
          </>
        ) : (
          <Text style={styles.cardMuted}>
            Search a building, classroom, or class section to guide the student
            there.
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topPanel: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: "#fff",
    zIndex: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 10,
  },
  switcher: {
    flexDirection: "row",
    marginBottom: 12,
    gap: 8,
  },
  switchBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#d4d4d8",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  switchBtnActive: {
    backgroundColor: "#111827",
    borderColor: "#111827",
  },
  switchText: {
    color: "#111827",
    fontWeight: "600",
  },
  switchTextActive: {
    color: "#fff",
  },
  searchInput: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#d4d4d8",
    paddingHorizontal: 14,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  suggestionsBox: {
    marginTop: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#fff",
    maxHeight: 240,
    overflow: "hidden",
  },
  suggestionItem: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  suggestionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },
  suggestionSubtitle: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 2,
  },
  map: {
    flex: 1,
  },
  floatingActions: {
    position: "absolute",
    right: 16,
    bottom: 140,
    gap: 10,
  },
  actionButton: {
    backgroundColor: "#111827",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
  },
  actionText: {
    color: "#fff",
    fontWeight: "700",
  },
  bottomCard: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 20,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
  },
  cardSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: "#6b7280",
  },
  cardRoute: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: "700",
    color: "#2563eb",
  },
  cardMuted: {
    fontSize: 14,
    color: "#6b7280",
  },
  loadingRow: {
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
});
