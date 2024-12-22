import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Spinner } from "react-bootstrap";
import "./CertGen.css";

function CertGen() {
  const [uploadStatus, setUploadStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    setUploadStatus(null);

    const formData = new FormData();
    formData.append("certificateTemplate", data.certificateTemplate[0]);
    formData.append("excelSheet", data.excelSheet[0]);

    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      const response = await fetch(`${apiUrl}/upload`, {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        setUploadStatus("success");
      } else {
        setUploadStatus("error");
      }
    } catch (error) {
      console.error("Error uploading files:", error);
      setUploadStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card shadow-sm">
        <div className="card-header bg-custom text-white text-center">
          <h2 className="mb-0">Certificate Generator</h2>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div className="mb-3 row">
              <div className="col-md-4">
                <label htmlFor="certificateTemplate" className="form-label">
                  Certificate Template
                </label>
              </div>
              <div className="col-md-8">
                <input
                  id="certificateTemplate"
                  type="file"
                  className={`form-control ${errors.certificateTemplate ? "is-invalid" : ""}`}
                  {...register("certificateTemplate", {
                    required: "Certificate Template is required",
                  })}
                />
                {errors.certificateTemplate && (
                  <div className="invalid-feedback">
                    {errors.certificateTemplate.message}
                  </div>
                )}
              </div>
            </div>

            <div className="mb-3 row">
              <div className="col-md-4">
                <label htmlFor="excelSheet" className="form-label">
                  Excel Sheet
                </label>
              </div>
              <div className="col-md-8">
                <input
                  id="excelSheet"
                  type="file"
                  className={`form-control ${errors.excelSheet ? "is-invalid" : ""}`}
                  accept=".xlsx, .xls"
                  {...register("excelSheet", {
                    required: "Excel Sheet is required",
                  })}
                />
                {errors.excelSheet && (
                  <div className="invalid-feedback">
                    {errors.excelSheet.message}
                  </div>
                )}
              </div>
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="btn btn-custom"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner
                      animation="grow"
                      border="none"
                      size="sm"
                      variant="success"
                      className="me-2"
                      role="status"
                    />
                    Uploading...
                  </>
                ) : (
                  "Upload Files"
                )}
              </button>
            </div>
          </form>
        </div>

        {uploadStatus === "success" && (
          <div className="alert alert-success mt-4 text-center" role="alert">
            Files uploaded successfully!
          </div>
        )}
        {uploadStatus === "error" && (
          <div className="alert alert-danger mt-4 text-center" role="alert">
            Failed to upload files. Please try again.
          </div>
        )}
      </div>
    </div>
  );
}

export default CertGen;
