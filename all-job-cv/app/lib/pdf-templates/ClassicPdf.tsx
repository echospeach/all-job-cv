import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { CvContent } from "@/app/lib/cvTypes";

const styles = StyleSheet.create({
  page: { padding: 48, fontSize: 11, fontFamily: "Helvetica", color: "#202A3C" },
  name: { fontSize: 22, fontFamily: "Helvetica-Bold", marginBottom: 4 },
  title: { fontSize: 13, color: "#3F6C51", marginBottom: 2 },
  email: { fontSize: 10, color: "#8B8578", marginBottom: 16 },
  summary: { fontSize: 11, lineHeight: 1.5, marginBottom: 16 },
  sectionLabel: { fontSize: 9, fontFamily: "Helvetica-Bold", color: "#8B8578", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 },
  skills: { fontSize: 11, marginBottom: 16 },
  expBlock: { marginBottom: 12 },
  expRole: { fontSize: 11, fontFamily: "Helvetica-Bold" },
  expDates: { fontSize: 9, color: "#8B8578", marginBottom: 2 },
  expDescription: { fontSize: 10.5, lineHeight: 1.5 },
});

export default function ClassicPdf({ content }: { content: CvContent }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.name}>{content.name || "Your name"}</Text>
        <Text style={styles.title}>{content.title || ""}</Text>
        <Text style={styles.email}>
          {[content.email, content.phone, content.location].filter(Boolean).join(" - ")}
        </Text>
        {content.summary && <Text style={styles.summary}>{content.summary}</Text>}
        {content.skills && (
          <View>
            <Text style={styles.sectionLabel}>Skills</Text>
            <Text style={styles.skills}>{content.skills}</Text>
          </View>
        )}
        {content.experience && content.experience.some((e) => e.role || e.company) && (
          <View>
            <Text style={styles.sectionLabel}>Experience</Text>
            {content.experience.map((exp, i) =>
              exp.role || exp.company ? (
                <View key={i} style={styles.expBlock}>
                  <Text style={styles.expRole}>
                    {exp.role || "Role"}
                    {exp.company ? ` - ${exp.company}` : ""}
                  </Text>
                  {exp.dates && <Text style={styles.expDates}>{exp.dates}</Text>}
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
