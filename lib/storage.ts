import localforage from "localforage";

export interface CVData {
  created_at: string;
  design: string;
  content: string;
  name: string;
  templateId?: string;
  style: {
    fontSize: number;
    lineHeight: number;
    marginV: number;
    pageSize: string;
    paragraphSpace: number;
    theme: string;
  };
  updated_at: string;
}

export interface StoredCVs {
  [key: string]: CVData;
}

const STORAGE_KEY = "lebenslaufs";

// Configure localForage
localforage.config({
  name: "lebenslauf",
  storeName: "cv_data",
});

export async function saveCV(cvId: string, cvData: CVData): Promise<void> {
  try {
    const existingData = await localforage.getItem(STORAGE_KEY);
    const storedCVs: StoredCVs = existingData
      ? (existingData as StoredCVs)
      : {};

    storedCVs[cvId] = cvData;

    await localforage.setItem(STORAGE_KEY, storedCVs);
  } catch (error) {
    console.error("Error saving CV to localForage:", error);
  }
}

export async function loadCV(cvId: string): Promise<CVData | null> {
  try {
    const existingData = await localforage.getItem(STORAGE_KEY);
    if (!existingData) return null;

    const storedCVs: StoredCVs = existingData as StoredCVs;
    return storedCVs[cvId] || null;
  } catch (error) {
    console.error("Error loading CV from localForage:", error);
    return null;
  }
}

export async function getAllCVs(): Promise<StoredCVs> {
  try {
    const existingData = await localforage.getItem(STORAGE_KEY);
    return existingData ? (existingData as StoredCVs) : {};
  } catch (error) {
    console.error("Error loading all CVs from localForage:", error);
    return {};
  }
}

export async function deleteCV(cvId: string): Promise<void> {
  try {
    const existingData = await localforage.getItem(STORAGE_KEY);
    if (!existingData) return;

    const storedCVs: StoredCVs = existingData as StoredCVs;
    delete storedCVs[cvId];

    await localforage.setItem(STORAGE_KEY, storedCVs);
  } catch (error) {
    console.error("Error deleting CV from localForage:", error);
  }
}

export async function createNewCV(
  templateId: string,
  templateMarkdown: string,
  templateCss: string,
  templateName: string
): Promise<string> {
  const cvId = Date.now().toString();
  const now = Date.now().toString();

  const cvData: CVData = {
    created_at: now,
    design: templateCss,
    content: templateMarkdown,
    name: templateName,
    templateId,
    style: {
      fontSize: 12,
      lineHeight: 1.4,
      marginV: 20,
      pageSize: "A4",
      paragraphSpace: 1,
      theme: "#3ECF8E",
    },
    updated_at: now,
  };

  await saveCV(cvId, cvData);
  return cvId;
}

export async function updateCV(
  cvId: string,
  updates: Partial<CVData>
): Promise<void> {
  const existingCV = await loadCV(cvId);
  if (!existingCV) return;

  const updatedCV: CVData = {
    ...existingCV,
    ...updates,
    updated_at: Date.now().toString(),
  };

  await saveCV(cvId, updatedCV);
}
