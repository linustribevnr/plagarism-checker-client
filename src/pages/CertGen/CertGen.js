import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Commet } from "react-loading-indicators";
import "./CertGen.css";

function CertGen() {
  const [uploadStatus, setUploadStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    setUploadStatus(null);

    const formData = new FormData();
    formData.append("certificateTemplate", data.certificateTemplate[0]);
    formData.append("excelSheet", data.excelSheet[0]);
    // should write fetch
  };

  return (
    <div className="cert-gen">
      <form className="form-container" onSubmit={handleSubmit(onSubmit)}>
        <div className="template-info row">
          <div className="template-label col-md-4">
            <h4 className="ms-5">Certificate Template:</h4>
          </div>
          <div className="template-input col-md-6">
            <input
              className="w-100 border border-dark rounded"
              type="file"
              name="certificateTemplate"
              {...register("certificateTemplate", { required: true })}
            />
          </div>
        </div>

        <div className="sheet-info row mt-4">
          <div className="sheet-label col-md-4">
            <h4 className="ms-5">Excel Sheet:</h4>
          </div>
          <div className="sheet-input col-md-6">
            <input
              className="w-100 border border-dark rounded"
              type="file"
              name="excelSheet"
              accept=".xlsx, .xls"
              {...register("excelSheet", { required: true })}
            />
          </div>
        </div>

        <button
          className={`submit-btn ${loading && "p-0 bg-transparent border-white"}`}
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <Commet color="#32cd32" size="small" text="Uploading" textColor="#32cd32" />
          ) : (
            "Upload"
          )}
        </button>
      </form>

      {uploadStatus === "success" && <p className="success-msg">Files uploaded successfully!</p>}
      {uploadStatus === "error" && <p className="error-msg">Failed to upload files. Please try again.</p>}
    </div>
  );
}

export default CertGen;
