import React from "react";
import { Document, Page, Text, View, StyleSheet, Link } from "@react-pdf/renderer";

const styles = StyleSheet.create({
    page: {
        padding: 20,
        fontFamily: "Helvetica",
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 4,
        color: "#000", // Default color
    },
    divider: {
        borderBottomWidth: 1,
        borderBottomColor: "#000",
        marginBottom: 10,
    },
    textCenter: {
        textAlign: "center",
    },
    textlittleSmall: {
        fontSize: 12,
    },
    textSmall: {
        fontSize: 10,
    },
    contactInfo: {
        flexDirection: "row",
        justifyContent: "space-between",
        fontSize: 10,
        marginBottom: 5,
    },
    section: {
        marginBottom: 10,
    },
    bulletPoint: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 4,
    },
    bullet: {
        marginRight: 5,
    },
    skillBar: {
        height: 4,
        backgroundColor: "#E0E0E0",
        width: 120,
        marginTop: 2,
    },
    skillFill: {
        height: 4,
        backgroundColor: "#000", // Default color
    },
});

const ResumePDF = ({ resumeInfo }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            {/* Personal Details */}
            <View>
                <Text style={[styles.sectionTitle, { color: resumeInfo?.themeColor || "#000" }]}>
                    {resumeInfo?.personalDetails?.firstName} {resumeInfo?.personalDetails?.lastName}
                </Text>
                <Text style={[styles.textCenter, styles.textlittleSmall]}>{resumeInfo?.personalDetails?.jobTitle}</Text>
                <Text style={[styles.textCenter, styles.textSmall, { color: resumeInfo?.themeColor || "#000" }]}>
                    {resumeInfo?.personalDetails?.address}
                </Text>
                <View style={styles.contactInfo}>
                    {resumeInfo?.personalDetails?.phone && (
                        <Link src={`tel:${resumeInfo.personalDetails.phone}`} style={{ color: resumeInfo?.themeColor || "#000" }}>
                            {resumeInfo.personalDetails.phone}
                        </Link>
                    )}
                    {resumeInfo?.personalDetails?.email && (
                        <Link src={`mailto:${resumeInfo.personalDetails.email}`} style={{ color: resumeInfo?.themeColor || "#000" }}>
                            {resumeInfo.personalDetails.email}
                        </Link>
                    )}
                </View>
            </View>
            <View style={[styles.divider, { borderBottomColor: resumeInfo?.themeColor || "#000" }]} />

            {/* Summary */}
            {resumeInfo?.summery && (
                <View style={styles.section}>
                    <Text style={styles.textSmall}>{resumeInfo.summery}</Text>
                </View>
            )}

            {/* Experience */}
            {resumeInfo?.Experience?.length > 0 && (
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, styles.textSmall, { color: resumeInfo?.themeColor || "#000" }]}>Experience</Text>
                    <View style={[styles.divider, { borderBottomColor: resumeInfo?.themeColor || "#000" }]} />
                    {resumeInfo.Experience.map((exp, index) => (
                        <View key={index} style={{ marginBottom: 10 }}>
                            <Text style={[styles.textSmall, { fontWeight: "bold" }]}>{exp.title}</Text>

                            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                <Text style={styles.textSmall}>
                                    {exp.companyName}, {exp.city}, {exp.state}
                                </Text>
                                <Text style={styles.textSmall}>
                                    {exp.startDate} - {exp.currentlyWorking ? "Present" : exp.endDate}
                                </Text>
                            </View>

                            {exp.workSummery && exp.workSummery.split("\n").map((point, i) => {
                                // Extract text from <li> tags if present
                                const liText = point.replace(/<li>(.*?)<\/li>/g, "$1").trim();
                                return (
                                    <View key={i} style={styles.bulletPoint}>
                                        <Text style={styles.bullet}>•</Text>
                                        <Text style={styles.textSmall}>{liText}</Text>
                                    </View>
                                );
                            })}
                        </View>
                    ))}
                </View>
            )}

            {/* Education */}
            {resumeInfo?.education?.length > 0 && (
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, styles.textSmall, { color: resumeInfo?.themeColor || "#000" }]}>Education</Text>
                    <View style={[styles.divider, { borderBottomColor: resumeInfo?.themeColor || "#000" }]} />
                    {resumeInfo.education.map((edu, index) => (
                        <View key={index} style={{ marginBottom: 10 }}>
                            <Text style={[styles.textSmall, { fontWeight: "bold" }]}>{edu.universityName}</Text>

                            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                <Text style={styles.textSmall}>
                                    {edu.degree} in {edu.major}
                                </Text>
                                <Text style={styles.textSmall}>
                                    {edu.startDate} - {edu.endDate}
                                </Text>
                            </View>

                            <Text style={styles.textSmall}>{edu.description}</Text>
                        </View>
                    ))}
                </View>
            )}

            {/* Projects */}
            {resumeInfo?.projects?.length > 0 && (
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, styles.textSmall, { color: resumeInfo?.themeColor || "#000" }]}>Projects</Text>
                    <View style={[styles.divider, { borderBottomColor: resumeInfo?.themeColor || "#000" }]} />
                    {resumeInfo.projects.map((proj, index) => (
                        <View key={index} style={{ marginBottom: 10 }}>
                            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                <Text style={[styles.textSmall, { fontWeight: "bold" }]}>{proj.name}</Text>
                                {proj.link && (
                                    <Link src={proj.link} style={[styles.textSmall, { color: resumeInfo?.themeColor || "#000" }]}>
                                        View Project
                                    </Link>
                                )}
                            </View>
                            <Text style={styles.textSmall}>{proj.technologies}</Text>
                            <Text style={styles.textSmall}>{proj.description}</Text>
                        </View>
                    ))}
                </View>
            )}

            {/* Skills */}
            {resumeInfo?.skills?.length > 0 && (
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, styles.textSmall, { color: resumeInfo?.themeColor || "#000" }]}>Skills</Text>
                    <View style={[styles.divider, { borderBottomColor: resumeInfo?.themeColor || "#000" }]} />
                    <View>
                        {resumeInfo.skills.map((skill, index) => (
                            <View key={index} style={{ marginBottom: 5 }}>
                                <Text style={styles.textSmall}>{skill.name}</Text>
                                <View style={styles.skillBar}>
                                    <View
                                        style={[
                                            styles.skillFill,
                                            { backgroundColor: resumeInfo?.themeColor || "#000", width: `${skill.rating * 20}%` },
                                        ]}
                                    />
                                </View>
                            </View>
                        ))}
                    </View>
                </View>
            )}
        </Page>
    </Document>
);

export default ResumePDF;