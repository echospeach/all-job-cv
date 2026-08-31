import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { CvContent } from "@/app/lib/cvTypes";

const styles = StyleSheet.create({
  page: { padding: 48, fontSize: 10.5, fontFamily: "Helvetica", color: "#000000" },
  name: { fontSize: 16, fontFamily: "Helvetica-Bold" },
  title: { fontSize: 10, marginTop: 2 },
  email: { fontSize: 10, marginTop: 2 },
  section: { marginTop: 16, borderTopWidth: 1, borderTopColor: "#CCCCCC", paddingTop: 10 },
  sectionLabel: { fontSize: 9, fontFamily: "Helvetica-Bold", textTransform: "uppercase", marginBottom: 6 },
  body: { fontSize: 10.5, lineHeight: 1.5 },
  expBlock: { marginBottom: 10 },
  expHeaderRow: { flexDirection: "row", justifyContent: "space-between" },
  expRole: { fontSize: 10.5, fontFamily: "Helvetica-Bold" },
  expDates: { fontSize: 9, color: "#555555" },
  expDescription: { fontSize: 10, lineHeight: 1.5, marginTop: 2, color: "#333333" },
});

export default function MinimalPdf({ content }: { content: CvContent }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.name}>{content.name || "Your name"}</Text>
        <Text style={styles.title}>{content.title || ""}</Text>
        <Text style={styles.email}>
          {[content.email, content.phone, [content.location, content.postcode].filter(Boolean).join(" ")].filter(Boolean).join(" - ")}
        </Text>

        {content.summary && (
          <View style={styles.section}>
            <Text style={styles.body}>{content.summary}</Text>
          </View>
        )}

        {content.skills && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Skills</Text>
            <Text style={styles.body}>{content.skills}</Text>
          </View>
        )}

        {content.experience && content.experience.some((e) => e.role || e.company) && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Experience</Text>
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
      </Page>
    </Document>
  );
}
