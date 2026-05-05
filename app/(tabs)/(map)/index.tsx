import { CAMPUS_BUILDINGS, FixedBuilding } from "@src/constants/campusBuildings";
import { COLORS } from "@src/constants/color";
import { supabase } from "@src/services/database";
import * as Location from "expo-location";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  FlatList,
  Linking,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import MapView, {
  Callout,
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

type Coord = { latitude: number; longitude: number };

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
  const coordinates: Coord[] = [];

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

    coordinates.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
  }

  return coordinates;
}

function formatDistance(meters?: number) {
  if (!meters) return "";
  const miles = meters / 1609.34;
  if (miles < 0.2) return `${Math.round(meters)} m`;
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

const BG = COLORS.background;
const SURFACE = "#2a2a24";
const BORDER = "#3d3d35";
const GOLD = COLORS.primary;
const MUTED = COLORS.secondary;

const TAB_BAR_HEIGHT = Platform.OS === "ios" ? 49 : 56;

export default function Map() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const cardBottom = insets.bottom + TAB_BAR_HEIGHT + 12;
  const mapRef = useRef<MapView | null>(null);

  const [campus, setCampus] = useState<CampusSlug>("kennesaw");
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [markers, setMarkers] = useState<BuildingMarker[]>([]);
  const [selected, setSelected] = useState<SearchResult | null>(null);
  const [selectedFixed, setSelectedFixed] = useState<FixedBuilding | null>(null);
  const [routeCoords, setRouteCoords] = useState<Coord[]>([]);
  const [routeMeta, setRouteMeta] = useState<{
    distanceMeters?: number;
    duration?: string;
  }>({});
  const [userLocation, setUserLocation] = useState<Coord | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingRoute, setLoadingRoute] = useState(false);
  const [customOrigin, setCustomOrigin] = useState<(Coord & { label: string }) | null>(null);
  const [selectingOrigin, setSelectingOrigin] = useState(false);

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
      if (permission.status !== "granted") return;
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

      if (error || !data) return;

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
      console.error("Error loading markers:", err);
    }
  }, [campus]);

  const searchDestinations = useCallback(
    async (text: string) => {
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
          setSuggestions([]);
          return;
        }
        setSuggestions((data ?? []) as SearchResult[]);
      } catch {
        setSuggestions([]);
      } finally {
        setLoadingSearch(false);
      }
    },
    [campus],
  );

  async function calculateRoute(origin: Coord, destination: Coord) {
    try {
      setLoadingRoute(true);
      setRouteCoords([]);
      setRouteMeta({});

      const url =
        `https://router.project-osrm.org/route/v1/foot/` +
        `${origin.longitude},${origin.latitude};` +
        `${destination.longitude},${destination.latitude}` +
        `?overview=full&geometries=polyline`;

      const res = await fetch(url);
      if (!res.ok) throw new Error(`OSRM ${res.status}`);

      const json = (await res.json()) as {
        code: string;
        routes?: Array<{ distance: number; duration: number; geometry: string }>;
      };

      if (json.code !== "Ok" || !json.routes?.length) {
        throw new Error("No route found");
      }

      const route = json.routes[0];
      setRouteMeta({
        distanceMeters: route.distance,
        duration: `${Math.round(route.duration)}s`,
      });
      setRouteCoords(decodePolyline(route.geometry));
    } catch (err) {
      console.error("Route error:", err);
    } finally {
      setLoadingRoute(false);
    }
  }

  async function handleSelectDestination(item: SearchResult) {
    setSelected(item);
    setSelectedFixed(null);
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

    const origin = customOrigin ?? userLocation;
    if (origin) {
      void calculateRoute(origin, { latitude: item.lat, longitude: item.lng });
    }
  }

  function handleFixedBuildingPress(building: FixedBuilding) {
    if (selectingOrigin) {
      const newOrigin = {
        latitude: building.lat,
        longitude: building.lng,
        label: `[${building.code}] ${building.label}`,
      };
      setCustomOrigin(newOrigin);
      setSelectingOrigin(false);
      const dest = selectedFixed ?? selected;
      if (dest) {
        void calculateRoute(newOrigin, { latitude: dest.lat, longitude: dest.lng });
      }
      return;
    }

    setSelectedFixed(building);
    setSelected(null);
    setRouteCoords([]);
    setRouteMeta({});
    setQuery("");
    setSuggestions([]);

    mapRef.current?.animateToRegion(
      {
        latitude: building.lat,
        longitude: building.lng,
        latitudeDelta: 0.004,
        longitudeDelta: 0.004,
      },
      500,
    );

    const origin = customOrigin ?? userLocation;
    if (origin) {
      void calculateRoute(origin, { latitude: building.lat, longitude: building.lng });
    }
  }

  function clearRoute() {
    setSelected(null);
    setSelectedFixed(null);
    setRouteCoords([]);
    setRouteMeta({});
    setCustomOrigin(null);
    setSelectingOrigin(false);
    setQuery("");
  }

  function openInMaps(destLat: number, destLng: number) {
    const origin = customOrigin ?? userLocation;
    const url =
      Platform.select({
        ios: origin
          ? `maps:?saddr=${origin.latitude},${origin.longitude}&daddr=${destLat},${destLng}&dirflg=w`
          : `maps:?daddr=${destLat},${destLng}&dirflg=w`,
        android: `google.navigation:q=${destLat},${destLng}&mode=w`,
      }) ??
      `https://www.google.com/maps/dir/?api=1&destination=${destLat},${destLng}&travelmode=walking`;

    void Linking.openURL(url);
  }

  function recenterCampus() {
    mapRef.current?.animateToRegion(activeRegion, 400);
  }

  function goToMyLocation() {
    if (!userLocation) return;
    mapRef.current?.animateToRegion(
      { ...userLocation, latitudeDelta: 0.005, longitudeDelta: 0.005 },
      400,
    );
  }

  const destLat = selectedFixed?.lat ?? selected?.lat;
  const destLng = selectedFixed?.lng ?? selected?.lng;
  const destLabel = selectedFixed
    ? `[${selectedFixed.code}] ${selectedFixed.label}`
    : selected?.label ?? "";
  const hasDestination = destLat !== undefined && destLng !== undefined;
  const effectiveOrigin = customOrigin ?? userLocation;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topPanel}>
        <Text style={styles.heading}>{t("map.head")}</Text>

        <View style={styles.switcher}>
          <Pressable
            onPress={() => setCampus("kennesaw")}
            style={[styles.switchBtn, campus === "kennesaw" && styles.switchBtnActive]}
          >
            <Text style={[styles.switchText, campus === "kennesaw" && styles.switchTextActive]}>
              Kennesaw
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setCampus("marietta")}
            style={[styles.switchBtn, campus === "marietta" && styles.switchBtnActive]}
          >
            <Text style={[styles.switchText, campus === "marietta" && styles.switchTextActive]}>
              Marietta
            </Text>
          </Pressable>
        </View>

        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={t("map.search")}
          placeholderTextColor={MUTED}
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
                    <Text style={styles.suggestionSubtitle}>{item.subtitle}</Text>
                  )}
                </Pressable>
              )}
            />
          </View>
        ) : null}
      </View>

      <MapView
        ref={(ref) => { mapRef.current = ref; }}
        style={styles.map}
        initialRegion={activeRegion}
        provider={Platform.OS === "android" ? PROVIDER_GOOGLE : undefined}
        showsUserLocation
        showsMyLocationButton={false}
      >
        {CAMPUS_BUILDINGS[campus].map((building) => (
          <Marker
            key={building.id}
            coordinate={{ latitude: building.lat, longitude: building.lng }}
            pinColor={
              customOrigin?.latitude === building.lat &&
              customOrigin?.longitude === building.lng
                ? "#2563eb"
                : selectingOrigin
                ? "#f97316"
                : "#f97316"
            }
            onPress={() => handleFixedBuildingPress(building)}
          >
            <Callout tooltip={false}>
              <View style={styles.callout}>
                <Text style={styles.calloutTitle}>
                  [{building.code}] {building.label}
                </Text>
                <Text style={styles.calloutCoords}>
                  {building.lat.toFixed(5)}, {building.lng.toFixed(5)}
                </Text>
              </View>
            </Callout>
          </Marker>
        ))}

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
          <Polyline coordinates={routeCoords} strokeWidth={5} strokeColor="#2563eb" />
        )}
      </MapView>

      <View style={[styles.floatingActions, { bottom: cardBottom + 110 }]}>
        <Pressable style={styles.actionButton} onPress={recenterCampus}>
          <Text style={styles.actionText}>{t("map.camp")}</Text>
        </Pressable>
        <Pressable style={styles.actionButton} onPress={goToMyLocation}>
          <Text style={styles.actionText}>{t("map.gps")}</Text>
        </Pressable>
      </View>

      <View style={[styles.bottomCard, { bottom: cardBottom }]}>
        {selectingOrigin ? (
          <>
            <Text style={styles.cardTitle}>{t("map.picking")}</Text>
            <Pressable
              onPress={() => setSelectingOrigin(false)}
              style={styles.cancelBtn}
            >
              <Text style={styles.cancelBtnText}>{t("normal.cancel")}</Text>
            </Pressable>
          </>
        ) : hasDestination ? (
          <>
            <View style={styles.cardRow}>
              <Text style={styles.cardTitle} numberOfLines={1}>
                {destLabel}
              </Text>
              <Pressable onPress={clearRoute}>
                <Text style={styles.clearText}>{t("map.clear")}</Text>
              </Pressable>
            </View>

            {customOrigin && (
              <Text style={styles.cardMuted} numberOfLines={1}>
                {t("map.from")} {customOrigin.label}
              </Text>
            )}

            {selectedFixed && (
              <Text style={styles.cardCoords}>
                {selectedFixed.lat.toFixed(5)}° N{"  "}
                {Math.abs(selectedFixed.lng).toFixed(5)}° W
              </Text>
            )}

            {loadingRoute ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator />
                <Text style={styles.cardMuted}>{t("map.calc")}</Text>
              </View>
            ) : routeCoords.length > 0 ? (
              <>
                <Text style={styles.cardRoute}>
                  {formatDistance(routeMeta.distanceMeters)} •{" "}
                  {formatDuration(routeMeta.duration)}
                </Text>
                <View style={styles.cardActions}>
                  <Pressable
                    style={styles.openMapsBtn}
                    onPress={() => openInMaps(destLat!, destLng!)}
                  >
                    <Text style={styles.openMapsBtnText}>{t("map.openMaps")}</Text>
                  </Pressable>
                  {!selectingOrigin && (
                    <Pressable
                      style={styles.pickStartBtn}
                      onPress={() => setSelectingOrigin(true)}
                    >
                      <Text style={styles.pickStartBtnText}>{t("map.pickStart")}</Text>
                    </Pressable>
                  )}
                </View>
              </>
            ) : !effectiveOrigin ? (
              <View style={styles.cardActions}>
                <Pressable
                  style={styles.openMapsBtn}
                  onPress={() => openInMaps(destLat!, destLng!)}
                >
                  <Text style={styles.openMapsBtnText}>{t("map.openMaps")}</Text>
                </Pressable>
                <Pressable
                  style={styles.pickStartBtn}
                  onPress={() => setSelectingOrigin(true)}
                >
                  <Text style={styles.pickStartBtnText}>{t("map.pickStart")}</Text>
                </Pressable>
              </View>
            ) : (
              <Text style={styles.cardMuted}>{t("map.calc")}</Text>
            )}
          </>
        ) : loadingLocation ? (
          <Text style={styles.cardMuted}>{t("map.gloc")}</Text>
        ) : (
          <Text style={styles.cardMuted}>{t("map.guide")}</Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  topPanel: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: BG,
    zIndex: 20,
  },
  heading: { fontSize: 24, fontWeight: "700", marginBottom: 10, color: "#fff" },
  switcher: { flexDirection: "row", marginBottom: 12, gap: 8 },
  switchBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: "center",
    backgroundColor: SURFACE,
  },
  switchBtnActive: { backgroundColor: GOLD, borderColor: GOLD },
  switchText: { color: MUTED, fontWeight: "600" },
  switchTextActive: { color: BG },
  searchInput: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 14,
    fontSize: 16,
    backgroundColor: SURFACE,
    color: "#fff",
  },
  suggestionsBox: {
    marginTop: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: SURFACE,
    maxHeight: 240,
    overflow: "hidden",
  },
  suggestionItem: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  suggestionTitle: { fontSize: 15, fontWeight: "600", color: "#fff" },
  suggestionSubtitle: { fontSize: 13, color: MUTED, marginTop: 2 },
  map: { flex: 1 },
  floatingActions: { position: "absolute", right: 16, gap: 10 },
  actionButton: {
    backgroundColor: GOLD,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
  },
  actionText: { color: BG, fontWeight: "700" },
  bottomCard: {
    position: "absolute",
    left: 16,
    right: 16,
    backgroundColor: SURFACE,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: BORDER,
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  cardTitle: { fontSize: 17, fontWeight: "700", color: "#fff", flex: 1 },
  clearText: { fontSize: 13, color: MUTED, fontWeight: "600" },
  cardCoords: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: "600",
    color: GOLD,
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
  cardSubtitle: { marginTop: 4, fontSize: 13, color: MUTED },
  cardRoute: { marginTop: 8, fontSize: 15, fontWeight: "700", color: GOLD },
  cardMuted: { fontSize: 14, color: MUTED, marginTop: 4 },
  cardActions: { flexDirection: "row", gap: 8, marginTop: 10 },
  openMapsBtn: {
    flex: 1,
    backgroundColor: GOLD,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  openMapsBtnText: { color: BG, fontWeight: "700", fontSize: 13 },
  pickStartBtn: {
    flex: 1,
    backgroundColor: BORDER,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  pickStartBtnText: { color: "#fff", fontWeight: "700", fontSize: 13 },
  cancelBtn: {
    marginTop: 10,
    backgroundColor: BORDER,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  cancelBtnText: { color: "#fff", fontWeight: "700", fontSize: 14 },
  loadingRow: {
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  callout: { paddingHorizontal: 10, paddingVertical: 6, minWidth: 180 },
  calloutTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 2,
  },
  calloutCoords: {
    fontSize: 12,
    color: "#6b7280",
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
});
