const ResumeSchema = new Schema({
    education: [
        {
            universityName: { type: String },
            degree: { type: String },
            major: { type: String },
            startDate: { type: String },
            endDate: { type: String },
            description: { type: String },
            certificate: {
                fileUrl: { type: String },
                fileName: { type: String },
                uploaded: { type: Boolean, default: false },
                uploadDate: { type: Date }
            }
        }
    ],
}); 