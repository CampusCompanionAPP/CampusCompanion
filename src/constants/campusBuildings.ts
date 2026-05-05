export type CampusSlug = "kennesaw" | "marietta";

export type FixedBuilding = {
  id: string;
  label: string;
  code: string;
  campus: CampusSlug;
  lat: number;
  lng: number;
};

export const CAMPUS_BUILDINGS: Record<CampusSlug, FixedBuilding[]> = {
  kennesaw: [
    { id: "ksu-kh",   label: "Kennesaw Hall",                  code: "KH",  campus: "kennesaw", lat: 34.03790, lng: -84.58260 },
    { id: "ksu-sl",   label: "Sturgis Library",                code: "SL",  campus: "kennesaw", lat: 34.03740, lng: -84.58370 },
    { id: "ksu-sc",   label: "Student Center",                 code: "SC",  campus: "kennesaw", lat: 34.03930, lng: -84.58400 },
    { id: "ksu-rec",  label: "Wilson Recreation Center",       code: "REC", campus: "kennesaw", lat: 34.03960, lng: -84.58310 },
    { id: "ksu-be",   label: "Bagwell College of Education",   code: "BE",  campus: "kennesaw", lat: 34.03880, lng: -84.58510 },
    { id: "ksu-sm",   label: "Science & Math Building",        code: "SM",  campus: "kennesaw", lat: 34.03690, lng: -84.58430 },
    { id: "ksu-ss",   label: "Social Science Building",        code: "SS",  campus: "kennesaw", lat: 34.03840, lng: -84.58170 },
    { id: "ksu-eb",   label: "English Building",               code: "EB",  campus: "kennesaw", lat: 34.03740, lng: -84.58220 },
    { id: "ksu-cc",   label: "Convocation Center",             code: "CC",  campus: "kennesaw", lat: 34.04040, lng: -84.58270 },
    { id: "ksu-aw",   label: "Atrium Building",                code: "AW",  campus: "kennesaw", lat: 34.03700, lng: -84.58460 },
    { id: "ksu-bh",   label: "Burruss Building",               code: "BH",  campus: "kennesaw", lat: 34.03820, lng: -84.58330 },
    { id: "ksu-np",   label: "Norton Park",                    code: "NP",  campus: "kennesaw", lat: 34.04100, lng: -84.58200 },
  ],
  marietta: [
    { id: "mar-q",    label: "Q Building – Student Center",    code: "Q",   campus: "marietta", lat: 33.93770, lng: -84.51940 },
    { id: "mar-l",    label: "L Building – Library",           code: "L",   campus: "marietta", lat: 33.93830, lng: -84.51880 },
    { id: "mar-h",    label: "H Building – Computing & SE",    code: "H",   campus: "marietta", lat: 33.93910, lng: -84.52020 },
    { id: "mar-j",    label: "J Building – Architecture",      code: "J",   campus: "marietta", lat: 33.93680, lng: -84.51750 },
    { id: "mar-etc",  label: "Engineering Technology Center",  code: "ETC", campus: "marietta", lat: 33.93880, lng: -84.51830 },
    { id: "mar-r",    label: "R Building – Recreation",        code: "R",   campus: "marietta", lat: 33.93730, lng: -84.52080 },
    { id: "mar-b",    label: "B Building",                     code: "B",   campus: "marietta", lat: 33.93800, lng: -84.51960 },
    { id: "mar-d",    label: "D Building",                     code: "D",   campus: "marietta", lat: 33.93750, lng: -84.51870 },
    { id: "mar-g",    label: "G Building",                     code: "G",   campus: "marietta", lat: 33.93850, lng: -84.52010 },
    { id: "mar-k",    label: "K Building – Gymnasium",         code: "K",   campus: "marietta", lat: 33.93700, lng: -84.52000 },
  ],
};
