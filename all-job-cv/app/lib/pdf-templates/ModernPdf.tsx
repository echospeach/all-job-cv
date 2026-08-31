import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { CvContent } from "@/app/lib/cvTypes";

const styles = StyleSheet.create({
  page: { flexDirection: "row", fontFamily: "Helvetica" },
  sidebar: { width: "34%", backgroundColor: "#1B2438", padding: 20, color: "#FFFFFF" },
  main: { width: "66%", padding: 24, color: "#202A3C" },
  name: { fontSize: 15, fontFamily: "Helvetica-Bold" },
  title: { fontSize: 10, color: "#C08A3E", marginTop: 4 },
  email: { fontSize: 8.5, color: "#CBD2DE", marginTop: 12 },
  sideLabel: { fontSize: 8, fontFamily: "Helvetica-Bold", color: "#9AA3B5", textTransform: "uppercase", marginTop: 24, marginBottom: 6 },
  skillItem: { fontSize: 9.5, color: "#F0F1F4", marginBottom: 4 },
  mainLabel: { fontSize: 8, fontFamily: "Helvetica-Bold", color: "#8B8578", textTransform: "uppercase", marginBottom: 6 },
  summary: { fontSize: 9.5, lineHeight: 1.5, color: "#202A3C" },
  expBlock: { marginTop: 14 },
  expHeaderRow: { flexDirection: "row", justifyContent: "space-between" },
  expRole: { fontSize: 10, fontFamily: "Helvetica-Bold" },
  expDates: { fontSize: 8, color: "#8B8578" },
  expDescription: { fontSize: 9.5, lineHeight: 1.5, marginTop: 2, color: "#5C5A52" },
});

export default function ModernPdf({ content }: { content: CvContent }) {
  const skillList = content.skills ? content.skills.split(",").map((s) => s.trim()).filter(Boolean) : [];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.sidebar}>
          <Text style={styles.name}>{content.name || "Your name"}</Text>
          <Text style={styles.title}>{content.title || ""}</Text>
          <Text style={styles.email}>
            {[content.email, content.phone, [content.location, content.postcode].filter(Boolean).join(" ")].filter(Boolean).join(" - ")}
          </Text>
          {skillList.length > 0 && (
            <View>
              <Text style={styles.sideLabel}>Skills</Text>
              {skillList.map((s, i) => (
                <Text key={i} style={styles.skillItem}>{s}</Text>
              ))}
            </View>
          )}
        </View>
        <View style={styles.main}>
          {content.summary && (
            <View>
              <Text style={styles.mainLabel}>Profile</Text>
              <Text style={styles.summary}>{content.summary}</Text>
            </View>
          )}
          {content.experience && content.experience.some((e) => e.role || e.company) && (
            <View style={{ marginTop: 18 }}>
              <Text style={styles.mainLabel}>Experience</Text>
              {content.experience.map((exp, i) =>
                exp.role || exp.company ? (
                  <View key={i} style={styles.expBlock}>
                    <View style={styles.expHeaderRow}>
                      <Text style={styles.expRole}>
                        {exp.role || "Role"}
                        {exp.company ? ` - ${exp.company}` : ""}
                      </Text>
                      {exp.dates && <Text style={styles.expDates}>{exp.dates}</Text>}
                    </View>
                    {exp.description && <Text style={styles.expDescription}>{exp.description}</Text>}
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
