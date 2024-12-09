import { Document, Page, Text, View, StyleSheet, PDFViewer } from "@react-pdf/renderer";
import { LoanApplication } from "@/types/loan";

const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  section: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    marginBottom: 15,
    textAlign: "center",
  },
  heading: {
    fontSize: 14,
    marginBottom: 10,
    color: "#334155",
  },
  row: {
    flexDirection: "row",
    marginBottom: 5,
  },
  label: {
    width: "40%",
    fontSize: 10,
    color: "#64748b",
  },
  value: {
    width: "60%",
    fontSize: 10,
  },
});

interface ApplicationPDFProps {
  application: LoanApplication;
}

export const ApplicationPDF = ({ application }: ApplicationPDFProps) => {
  return (
    <PDFViewer style={{ width: "100%", height: "600px" }}>
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <Text style={styles.title}>Loan Application Summary</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.heading}>Personal Information</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Full Name:</Text>
              <Text style={styles.value}>{application.first_name} {application.surname}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Date of Birth:</Text>
              <Text style={styles.value}>{new Date(application.date_of_birth).toLocaleDateString()}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Gender:</Text>
              <Text style={styles.value}>{application.gender}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Marital Status:</Text>
              <Text style={styles.value}>{application.marital_status}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.heading}>Location Details</Text>
            <View style={styles.row}>
              <Text style={styles.label}>District:</Text>
              <Text style={styles.value}>{application.district}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Village:</Text>
              <Text style={styles.value}>{application.village}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Home Province:</Text>
              <Text style={styles.value}>{application.home_province}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.heading}>Employment Information</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Employment Status:</Text>
              <Text style={styles.value}>{application.employment_status}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Employer:</Text>
              <Text style={styles.value}>{application.employer_name || "N/A"}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Monthly Income:</Text>
              <Text style={styles.value}>K {application.monthly_income.toLocaleString()}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.heading}>Loan Details</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Loan Amount:</Text>
              <Text style={styles.value}>K {application.loan_amount.toLocaleString()}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Purpose:</Text>
              <Text style={styles.value}>{application.loan_purpose}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Repayment Period:</Text>
              <Text style={styles.value}>{application.repayment_period} months</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.heading}>Application Status</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Current Status:</Text>
              <Text style={styles.value}>{application.status}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Submission Date:</Text>
              <Text style={styles.value}>{new Date(application.created_at).toLocaleDateString()}</Text>
            </View>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};