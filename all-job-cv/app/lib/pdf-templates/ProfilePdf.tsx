import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import type { CvContent } from "@/app/lib/cvTypes";

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: "Helvetica", color: "#000000" },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", borderBottomWidth: 1, borderBottomColor: "#CCCCCC", paddingBottom: 12 },
  name: { fontSize: 14, fontFamily: "Helvetica-Bold", textTransform: "uppercase" },
  email: { fontSize: 9.5, marginTop: 3 },
  photo: { width: 48, height: 48, borderRadius: 3 },
  section: { marginTop: 14 },
  sectionLabel: { fontSize: 8.5, fontFamily: "Helvetica-Bold", textTransform: "uppercase", marginBottom: 6 },
  body: { fontSize: 9.5, lineHeight: 1.5 },
  bulletRow: { flexDirection: "row", marginBottom: 3 },
  bulletDot: { width: 10, fontSize: 9.5 },
  bulletText: { fontSize: 9.5, flex: 1, lineHeight: 1.4 },
  expBlock: { marginBottom: 10 },
  expRole: { fontSize: 10, fontFamily: "Helvetica-Bold" },
  expMeta: { fontSize: 8.5, color: "#555555" },
  eduLine: { fontSize: 9.5, marginBottom: 2 },
  references: { fontSize: 8.5, fontStyle: "italic", marginTop: 14, color: "#555555" },
});

function bulletsFrom(text: string): string[] {
  return text.split("\n").map((l) => l.trim()).filter(Boolean);
}

export default function ProfilePdf({ content }: { content: CvContent }) {
  const skillList = content.skills ? content.skills.split(",").map((s) => s.trim()).filter(Boolean) : [];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.name}>{content.name || "Your name"}</Text>
            <Text style={styles.email}>
              {[content.email, content.phone, [content.location, content.postcode].filter(Boolean).join(" ")].filter(Boolean).join(" - ")}
            </Text>
          </View>
          {content.photoUrl && <Image src={content.photoUrl} style={styles.photo} />}
        </View>

        {content.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Personal Profile</Text>
            <Text style={styles.body}>{content.summary}</Text>
          </View>
        )}

        {skillList.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Key Skills</Text>
            {skillList.map((s, i) => (
              <View key={i} style={styles.bulletRow}>
                <Text style={styles.bulletDot}>-</Text>
                <Text style={styles.bulletText}>{s}</Text>
              </View>
            ))}
          </View>
        )}

        {content.experience && content.experience.some((e) => e.role || e.company) && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Work Experience</Text>
            {content.experience.map((exp, i) =>
              exp.role || exp.company ? (
                <View key={i} style={styles.expBlock}>
                  <Text style={styles.expRole}>
                    {exp.role || "Role"}
                    {exp.company ? ` - ${exp.company}` : ""}
                  </Text>
                  {exp.dates && <Text style={styles.expMeta}>{exp.dates}</Text>}
                  {exp.description &&
                    bulletsFrom(exp.description).map((line, j) => (
                      <View key={j} style={styles.bulletRow}>
                        <Text style={styles.bulletDot}>-</Text>
                        <Text style={styles.bulletText}>{line}</Text>
                      </View>
                    ))}
                </View>
              ) : null
            )}
          </View>
        )}

        {content.education && content.education.some((e) => e.qualification || e.institution) && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Education & Training</Text>
            {content.education.map((ed, i) =>
              ed.qualification || ed.institution ? (
                <Text key={i} style={styles.eduLine}>
                  {ed.qualification}
                  {ed.institution ? ` - ${ed.institution}` : ""}
                  {ed.date ? ` (${ed.date})` : ""}
                </Text>
              ) : null
            )}
          </View>
        )}

        {content.hobbies && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Hobbies & Interests</Text>
            <Text style={styles.body}>{content.hobbies}</Text>
          </View>
        )}

        <Text style={styles.references}>References available on request.</Text>
      </Page>
    </Document>
  );
}
