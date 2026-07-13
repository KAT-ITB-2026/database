import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey().notNull(),
  fakultas: text("fakultas"),
  prodi: text("prodi"),
  keluargaId: text("keluarga_id"),
  bataId: text("bata_id"),
  fotoMediaId: text("foto_media_id"),
  tagId: text("tag_id"),
  idLine: text("id_line"),
  noHp: text("no_hp"),
  instagram: text("instagram"),
  twitter: text("twitter"),
  linkedin: text("linkedin"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at"),
});
