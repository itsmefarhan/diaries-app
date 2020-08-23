import { Request, Response } from "miragejs";
import { User, Diary, Entry } from "../../../interface";
import { handleErrors } from "../server";

/* DIARY ROUTES */

// Create diary
export const create = (
  schema: any,
  req: Request
): { user: User; diary: Diary } | Response => {
  try {
    const { title, type, userId } = JSON.parse(req.requestBody) as Partial<
      Diary
    >;
    // Check existing user
    const user = schema.users.findBy({ id: userId });
    // If not found, call handleErrors func
    if (!user) {
      return handleErrors(null, "No such user exists.");
    }
    // Get current date
    const now = new Date().toDateString();

    const diary = user.createDiary({
      title,
      type,
      createdAt: now,
      updatedAt: now,
    });
    return {
      user: {
        ...user.attrs,
      },
      diary: diary.attrs,
    };
  } catch (error) {
    return handleErrors(error, "Failed to create Diary.");
  }
};

// Get diaries
export const getDiaries = (schema: any, req: Request): Diary[] | Response => {
  try {
    // Find user by params(user id)
    const user = schema.users.find(req.params.id);
    return user.diary as Diary[];
  } catch (error) {
    return handleErrors(error, "Could not get user diaries.");
  }
};

// Update diary
export const updateDiary = (schema: any, req: Request): Diary | Response => {
  try {
    // Find diary by params
    const diary = schema.diaries.find(req.params.id);

    const data = JSON.parse(req.requestBody) as Partial<Diary>;

    // Get current date
    const now = new Date().toDateString();

    diary.update({
      ...data,
      updatedAt: now,
    });
    return diary.attrs as Diary;
  } catch (error) {
    return handleErrors(error, "Failed to update Diary.");
  }
};

/* END DIARY ROUTES */

/* ENTRY ROUTES */

// Add an entry
export const addEntry = (
  schema: any,
  req: Request
): { diary: Diary; entry: Entry } | Response => {
  try {
    // Find diary by params
    const diary = schema.diaries.find(req.params.id);

    const { title, content } = JSON.parse(req.requestBody) as Partial<Entry>;

    // Get current date
    const now = new Date().toDateString();

    const entry = diary.createEntry({
      title,
      content,
      createdAt: now,
      updatedAt: now,
    });
    diary.update({
      ...diary.attrs,
      updatedAt: now,
    });
    return {
      diary: diary.attrs,
      entry: entry.attrs,
    };
  } catch (error) {
    return handleErrors(error, "Failed to save entry.");
  }
};

// Get entries
export const getEntries = (
  schema: any,
  req: Request
): { entries: Entry[] } | Response => {
  try {
    // Find diary by params
    const diary = schema.diaries.find(req.params.id);
    return diary.entry;
  } catch (error) {
    return handleErrors(error, "Failed to get Diary entries.");
  }
};

// Update an entry
export const updateEntry = (schema: any, req: Request): Entry | Response => {
  try {
    // Find entry by params
    const entry = schema.entries.find(req.params.id);

    const data = JSON.parse(req.requestBody) as Partial<Entry>;

    // Get current date
    const now = new Date().toDateString();

    entry.update({
      ...data,
      updatedAt: now,
    });
    return entry.attrs as Entry;
  } catch (error) {
    return handleErrors(error, "Failed to update entry.");
  }
};

/* END ENTRY ROUTES */
