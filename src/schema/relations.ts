import { relations } from "drizzle-orm";
import { accounts } from "./auth/accounts";
import { users } from "./auth/users";
import { batas } from "./org/batas";
import { keluargas } from "./org/keluargas";
import { media } from "./media/media";
import { handbook } from "./media/handbook";
import { attendanceSchedules } from "./attendance/schedules";
import { userAttendances } from "./attendance/user-attendances";
import { profilKats } from "./assignment/profil-kats";
import { assignments } from "./assignment/assignments";
import { assignmentRubrics } from "./assignment/assignment-rubrics";
import { assignmentAttachments } from "./assignment/assignment-attachments";
import { tags } from "./assignment/tags";
import { assignmentClues } from "./assignment/assignment-clues";
import { userClueScans } from "./assignment/user-clue-scans";
import { submissions } from "./assignment/submissions";
import { submissionRubricScores } from "./assignment/submission-rubric-scores";
import { classes } from "./class/classes";
import { classRegistrations } from "./class/class-registrations";
import { userMatches } from "./chat/user-matches";
import { messages } from "./chat/messages";
import { contentBlocks } from "./content/content-blocks";
import { endpointAnalytics } from "./analytics/endpoint-analytics";

export const accountsRelations = relations(accounts, ({ many }) => ({
  users: many(users),
  media: many(media),
  userAttendancesEdited: many(userAttendances),
  submissionsGraded: many(submissions),
  endpointAnalytics: many(endpointAnalytics),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  account: one(accounts, {
    fields: [users.id],
    references: [accounts.id],
  }),
  keluarga: one(keluargas, {
    fields: [users.keluargaId],
    references: [keluargas.id],
  }),
  bata: one(batas, {
    fields: [users.bataId],
    references: [batas.id],
  }),
  foto: one(media, {
    fields: [users.fotoMediaId],
    references: [media.id],
  }),
  tag: one(tags, {
    fields: [users.tagId],
    references: [tags.id],
  }),
  attendances: many(userAttendances),
  clueScans: many(userClueScans),
  submissions: many(submissions),
  classRegistration: one(classRegistrations),
  firstMatches: many(userMatches, { relationName: "firstUser" }),
  secondMatches: many(userMatches, { relationName: "secondUser" }),
  sentMessages: many(messages),
}));

export const batasRelations = relations(batas, ({ many }) => ({
  keluargas: many(keluargas),
  users: many(users),
}));

export const keluargasRelations = relations(keluargas, ({ one, many }) => ({
  bata: one(batas, {
    fields: [keluargas.bataId],
    references: [batas.id],
  }),
  users: many(users),
}));

export const mediaRelations = relations(media, ({ one, many }) => ({
  creator: one(accounts, {
    fields: [media.creatorId],
    references: [accounts.id],
  }),
  users: many(users),
  handbooks: many(handbook),
  clueImages: many(assignmentClues),
  submissions: many(submissions),
  contentBlocks: many(contentBlocks),
}));

export const handbookRelations = relations(handbook, ({ one }) => ({
  media: one(media, {
    fields: [handbook.mediaId],
    references: [media.id],
  }),
}));

export const attendanceSchedulesRelations = relations(attendanceSchedules, ({ many }) => ({
  attendances: many(userAttendances),
}));

export const userAttendancesRelations = relations(userAttendances, ({ one }) => ({
  schedule: one(attendanceSchedules, {
    fields: [userAttendances.scheduleId],
    references: [attendanceSchedules.id],
  }),
  user: one(users, {
    fields: [userAttendances.userId],
    references: [users.id],
  }),
  updatedBy: one(accounts, {
    fields: [userAttendances.updatedBy],
    references: [accounts.id],
  }),
}));

export const profilKatsRelations = relations(profilKats, ({ many }) => ({
  assignments: many(assignments),
}));

export const assignmentsRelations = relations(assignments, ({ one, many }) => ({
  profilKat: one(profilKats, {
    fields: [assignments.profilKatId],
    references: [profilKats.id],
  }),
  tag: one(tags, {
    fields: [assignments.tagId],
    references: [tags.id],
  }),
  rubrics: many(assignmentRubrics),
  attachments: many(assignmentAttachments),
  clues: many(assignmentClues),
  submissions: many(submissions),
}));

export const assignmentRubricsRelations = relations(assignmentRubrics, ({ one, many }) => ({
  assignment: one(assignments, {
    fields: [assignmentRubrics.assignmentId],
    references: [assignments.id],
  }),
  scores: many(submissionRubricScores),
}));

export const assignmentAttachmentsRelations = relations(assignmentAttachments, ({ one }) => ({
  assignment: one(assignments, {
    fields: [assignmentAttachments.assignmentId],
    references: [assignments.id],
  }),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  users: many(users),
  assignments: many(assignments),
}));

export const assignmentCluesRelations = relations(assignmentClues, ({ one, many }) => ({
  assignment: one(assignments, {
    fields: [assignmentClues.assignmentId],
    references: [assignments.id],
  }),
  clueImage: one(media, {
    fields: [assignmentClues.clueImageMediaId],
    references: [media.id],
  }),
  scans: many(userClueScans),
}));

export const userClueScansRelations = relations(userClueScans, ({ one }) => ({
  clue: one(assignmentClues, {
    fields: [userClueScans.clueId],
    references: [assignmentClues.id],
  }),
  user: one(users, {
    fields: [userClueScans.userId],
    references: [users.id],
  }),
}));

export const submissionsRelations = relations(submissions, ({ one, many }) => ({
  assignment: one(assignments, {
    fields: [submissions.assignmentId],
    references: [assignments.id],
  }),
  user: one(users, {
    fields: [submissions.userId],
    references: [users.id],
  }),
  media: one(media, {
    fields: [submissions.mediaId],
    references: [media.id],
  }),
  gradedBy: one(accounts, {
    fields: [submissions.gradedBy],
    references: [accounts.id],
  }),
  rubricScores: many(submissionRubricScores),
}));

export const submissionRubricScoresRelations = relations(submissionRubricScores, ({ one }) => ({
  submission: one(submissions, {
    fields: [submissionRubricScores.submissionId],
    references: [submissions.id],
  }),
  rubric: one(assignmentRubrics, {
    fields: [submissionRubricScores.rubricId],
    references: [assignmentRubrics.id],
  }),
}));

export const classesRelations = relations(classes, ({ many }) => ({
  registrations: many(classRegistrations),
}));

export const classRegistrationsRelations = relations(classRegistrations, ({ one }) => ({
  user: one(users, {
    fields: [classRegistrations.userId],
    references: [users.id],
  }),
  class: one(classes, {
    fields: [classRegistrations.classId],
    references: [classes.id],
  }),
}));

export const userMatchesRelations = relations(userMatches, ({ one, many }) => ({
  firstUser: one(users, {
    fields: [userMatches.firstUserId],
    references: [users.id],
    relationName: "firstUser",
  }),
  secondUser: one(users, {
    fields: [userMatches.secondUserId],
    references: [users.id],
    relationName: "secondUser",
  }),
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  match: one(userMatches, {
    fields: [messages.userMatchId],
    references: [userMatches.id],
  }),
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
  }),
}));

export const contentBlocksRelations = relations(contentBlocks, ({ one }) => ({
  media: one(media, {
    fields: [contentBlocks.mediaId],
    references: [media.id],
  }),
}));

export const endpointAnalyticsRelations = relations(endpointAnalytics, ({ one }) => ({
  account: one(accounts, {
    fields: [endpointAnalytics.accountId],
    references: [accounts.id],
  }),
}));
