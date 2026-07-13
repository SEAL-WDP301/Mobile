import AsyncStorage from "@react-native-async-storage/async-storage";

const SKILLS_KEY = "seal_profile_skills";
const LINKS_KEY = "seal_profile_links";

export interface ProfileLinks {
  portfolioUrl: string;
  githubUrl: string;
  linkedinUrl: string;
}

const DEFAULT_LINKS: ProfileLinks = {
  portfolioUrl: "",
  githubUrl: "",
  linkedinUrl: "",
};

export async function getSkills(): Promise<string> {
  return (await AsyncStorage.getItem(SKILLS_KEY)) ?? "";
}

export async function saveSkills(skills: string): Promise<void> {
  await AsyncStorage.setItem(SKILLS_KEY, skills);
}

export async function getProfileLinks(): Promise<ProfileLinks> {
  const raw = await AsyncStorage.getItem(LINKS_KEY);
  if (!raw) return { ...DEFAULT_LINKS };
  try {
    return { ...DEFAULT_LINKS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_LINKS };
  }
}

export async function saveProfileLinks(links: ProfileLinks): Promise<void> {
  await AsyncStorage.setItem(LINKS_KEY, JSON.stringify(links));
}
