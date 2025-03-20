import React, { Component } from "react";
import ResumePreview from "./ResumePreview";

class PrintableResume extends Component {
  render() {
    const { template, resumeInfo } = this.props;
    
    return (
      <div className="a4">
        <ResumePreview template={template} />
      </div>
    );
  }
}

export default PrintableResume; 