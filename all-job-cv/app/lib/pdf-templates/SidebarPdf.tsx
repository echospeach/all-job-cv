import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { CvContent } from "@/app/lib/cvTypes";

const styles = StyleSheet.create({
  page: { flexDirection: "row", fontFamily: "Helvetica" },
  sidebar: { width: "38%", backgroundColor: "#2E5A9C", padding: 18, color: "#FFFFFF" },
  main: { width: "62%", padding: 22, color: "#000000" },
  badge: { width: 40, height: 40, backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center", borderRadius: 3, marginBottom: 16 },
  badgeText: { fontSize: 13, fontFamily: "Helvetica-Bold", color: "#2E5A9C" },
  sideLabel: { fontSize: 8, fontFamily: "Helvetica-Bold", textTransform: "uppercase", color: "#D6E1F0", marginTop: 16, marginBottom: 6 },
  sideLine: { fontSize: 9, color: "#FFFFFF", marginBottom: 2 },
  bulletRow: { flexDirection: "row", marginBottom: 3 },
  bulletDot: { width: 8, fontSize: 9, color: "#FFFFFF" },
  bulletText: { fontSize: 9, flex: 1, color: "#FFFFFF", lineHeight: 1.3 },
  name: { fontSize: 15, fontFamily: "Helvetica-Bold" },
  jobTitle: { fontSize: 10, color: "#333333", marginTop: 2 },
  divider: { borderBottomWidth: 1, borderBottomColor: "#CCCCCC", marginTop: 8, marginBottom: 14 },
  mainLabel: { fontSize: 8.5, fontFamily: "Helvetica-Bold", textTransform: "uppercase", marginBottom: 6 },
  body: { fontSize: 9.5, lineHeight: 1.5 },
  expBlock: { marginBottom: 10 },
  expRole: { fontSize: 10, fontFamily: "Helvetica-Bold" },
  expMeta: { fontSize: 8.5, color: "#555555" },
  expBulletRow: { flexDirection: "row", marginBottom: 2 },
  expBulletDot: { width: 8, fontSize: 9.5 },
  expBulletText: { fontSize: 9.5, flex: 1, lineHeight: 1.4 },
  eduBlock: { marginBottom: 8 },
  eduQual: { fontSize: 9.5, fontFamily: "Helvetica-Bold" },
  eduInst: { fontSize: 9.5, fontStyle: "italic", color: "#333333" },
});

function bulletsFrom(text: string): string[] {
  return text.split("\n").map((l) => l.trim()).filter(Boolean);
}

function initials(name?: string): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  return parts.slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "").join("");
}

export default function SidebarPdf({ content }: { content: CvContent }) {
  const skillList = content.skills ? content.skills.split(",").map((s) => s.trim()).filter(Boolean) : [];
  const languageList = content.languages ? content.languages.split(",").map((s) => s.trim()).filter(Boolean) : [];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.sidebar}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{initials(content.name)}</Text>
          </View>

          <Text style={styles.sideLabel}>Contact</Text>
          {content.email && <Text style={styles.sideLine}>{content.email}</Text>}
          {content.phone && <Text style={styles.sideLine}>{content.phone}</Text>}
          {(content.location || content.postcode) && (
            <Text style={styles.sideLine}>{[content.location, content.postcode].filter(Boolean).join(" ")}</Text>
          )}
          {content.linkedin && <Text style={styles.sideLine}>{content.linkedin}</Text>}

          {skillList.length > 0 && (
            <View>
              <Text style={styles.sideLabel}>Skills</Text>
              {skillList.map((s, i) => (
                <View key={i} style={styles.bulletRow}>
                  <Text style={styles.bulletDot}>-</Text>
                  <Text style={styles.bulletText}>{s}</Text>
                </View>
              ))}
            </View>
          )}

          {languageList.length > 0 && (
            <View>
              <Text style={styles.sideLabel}>Languages</Text>
              {languageList.map((l, i) => (
                <Text key={i} style={styles.sideLine}>{l}</Text>
              ))}
            </View>
          )}

          {content.certificates && content.certificates.some((c) => c.name) && (
            <View>
              <Text style={styles.sideLabel}>Certificates</Text>
              {content.certificates.map((c, i) =>
                c.name ? (
                  <View key={i} style={styles.bulletRow}>
                    <Text style={styles.bulletDot}>-</Text>
                    <Text style={styles.bulletText}>
                      {c.name}
                      {c.issuer ? ` - ${c.issuer}` : ""}
                    </Text>
                  </View>
                ) : null
              )}
            </View>
          )}
        </View>

        <View style={styles.main}>
          <Text style={styles.name}>{content.name || "Your name"}</Text>
          {content.title && <Text style={styles.jobTitle}>{content.title}</Text>}
          <View style={styles.divider} />

          {content.summary && (
            <View style={{ marginBottom: 14 }}>
              <Text style={styles.mainLabel}>Summary</Text>
              <Text style={styles.body}>{content.summary}</Text>
            </View>
          )}

          {content.experience && content.experience.some((e) => e.role || e.company) && (
            <View style={{ marginBottom: 14 }}>
              <Text style={styles.mainLabel}>Experience</Text>
              {content.experience.map((exp, i) =>
                exp.role || exp.company ? (
                  <View key={i} style={styles.expBlock}>
                    <Text style={styles.expRole}>
                      {exp.company || "Company"}
                      {exp.role ? ` | ${exp.role}` : ""}
                    </Text>
                    {exp.dates && <Text style={styles.expMeta}>{exp.dates}</Text>}
                    {exp.description &&
                      bulletsFrom(exp.description).map((line, j) => (
                        <View key={j} style={styles.expBulletRow}>
                          <Text style={styles.expBulletDot}>-</Text>
                          <Text style={styles.expBulletText}>{line}</Text>
                        </View>
                      ))}
                  </View>
                ) : null
              )}
            </View>
          )}

          {content.education && content.education.some((e) => e.qualification || e.institution) && (
            <View>
              <Text style={styles.mainLabel}>Education</Text>
              {content.education.map((ed, i) =>
                ed.qualification || ed.institution ? (
                  <View key={i} style={styles.eduBlock}>
                    <Text style={styles.eduQual}>{ed.qualification}</Text>
                    <Text style={styles.eduInst}>
                      {ed.institution}
                      {ed.date ? ` - ${ed.date}` : ""}
                    </Text>
                  </View>
                ) : null
              )}
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
}
