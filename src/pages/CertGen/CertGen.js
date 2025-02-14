import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { Modal, Button } from "react-bootstrap";
import "./CertGen.css";

function CertGen() {
  const [image, setImage] = useState(null);
  const [excelFile, setExcelFile] = useState(null);
  const [coordinates, setCoordinates] = useState({ name: null, date: null });
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const canvasRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleExcelUpload = (e) => {
    setExcelFile(e.target.files[0]);
  };

  const getCursorStyle = () => {
    if (!coordinates.name) {
      return 'crosshair';
    } else if (!coordinates.date) {
      return 'crosshair';
    } else {
      return 'not-allowed';
    }
  };


  const handleCanvasClick = (e) => {
    if (coordinates.name && coordinates.date) {
      return; 
    }
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;
    
    const scaledX = x * scaleX;
    const scaledY = y * scaleY;

    if (!coordinates.name) {
      setCoordinates((prev) => ({ ...prev, name: { x: scaledX, y: scaledY } }));
      drawCertificateOnCanvas({ name: { x: scaledX, y: scaledY }, date: coordinates.date });
    } else if (!coordinates.date) {
      setCoordinates((prev) => ({ ...prev, date: { x: scaledX, y: scaledY } }));
      drawCertificateOnCanvas({ name: coordinates.name, date: { x: scaledX, y: scaledY } });
    }
  };

  const drawCertificateOnCanvas = (coords = coordinates) => {
    if (canvasRef.current && image) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.src = image;
      
      img.onload = () => {
        const imgAspectRatio = img.width / img.height;
        const canvasWidth = 800;
        const canvasHeight = canvasWidth / imgAspectRatio;
        
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        ctx.font = "bold 24px Arial";
        ctx.fillStyle = "#2196F3";
        
        ctx.textBaseline = "top";
        
        if (coords.name) {
          const nameText = "John Doe";
          ctx.fillText(nameText, coords.name.x, coords.name.y);
          
          ctx.fillStyle = "#FF0000";
          ctx.beginPath();
          ctx.arc(coords.name.x, coords.name.y, 3, 0, 2 * Math.PI);
          ctx.fill();
          
          const nameMetrics = ctx.measureText(nameText);
          ctx.strokeStyle = "#FF0000";
          ctx.strokeRect(
            coords.name.x,
            coords.name.y,
            nameMetrics.width,
            24 
          );
        }
        
        if (coords.date) {
          const dateText = "01-01-2025";
          ctx.fillStyle = "#2196F3";
          ctx.fillText(dateText, coords.date.x, coords.date.y);
          
          ctx.fillStyle = "#FF0000";
          ctx.beginPath();
          ctx.arc(coords.date.x, coords.date.y, 3, 0, 2 * Math.PI);
          ctx.fill();
          
          const dateMetrics = ctx.measureText(dateText);
          ctx.strokeStyle = "#FF0000";
          ctx.strokeRect(
            coords.date.x,
            coords.date.y,
            dateMetrics.width,
            24 
          );
        }
      };
    }
  };

  const resetCoordinates = () => {
    setCoordinates({ name: null, date: null });
    drawCertificateOnCanvas({ name: null, date: null });
  };
  const handlePreviewCertificate = (formData) => {
    const { emailSubject, emailBody, coordinates, image } = formData;

    // actual preview logic
  };

  const handleGenerateCertificates = (formData) => {
    setShowConfirmModal(false);
    const { emailSubject, emailBody, coordinates, image, excelFile } = formData;
    console.log("Generating Certificates with the following data:");
    console.log("Email Subject:", emailSubject);
    console.log("Email Body:", emailBody);
    console.log("Coordinates:", coordinates);
    console.log("Image:", image);
    console.log("Excel File:", excelFile);

    // Implement the actual generation logic
  };

  const confirmGeneration = () => {
    setShowConfirmModal(true);
  };

  return (
    <div className="container">
      <div className="card shadow-sm">
        <div className="card-header bg-custom text-white text-center">
          <h2 className="mb-0">Certificate Generator</h2>
        </div>
        <div className="card-body">
          <form
            className="space-y-3"
          >
            {/* Upload Excel File */}
            <div className="mb-3 row">
              <label className="form-label col-md-3">Participants Excel</label>
              <div className="col-md-9">
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  className={`form-control input ${
                    errors.excelFile ? "is-invalid" : ""
                  }`}
                  {...register("excelFile", {
                    required: "Participants Excel file is required",
                    validate: {
                      isValidFile: (value) =>
                        value?.[0] || "File cannot be empty",
                    },
                  })}
                  onChange={(e) => {
                    handleExcelUpload(e); 
                    register("excelFile").onChange(e); 
                  }}
                />
                {errors.excelFile && (
                  <div className="invalid-feedback">
                    {errors.excelFile.message}
                  </div>
                )}
              </div>
            </div>

            {/* Upload Certificate Template */}
            <div className="mb-3 row">
              <label className="form-label col-md-3">
                Certificate Template
              </label>
              <div className="col-md-9">
                <input
                  type="file"
                  accept="image/png"
                  className={`form-control input ${
                    errors.imageFile ? "is-invalid" : ""
                  }`}
                  {...register("imageFile", {
                    required: "Certificate template is required",
                    validate: {
                      isPng: (value) =>
                        value?.[0]?.type === "image/png" ||
                        "Only PNG files are allowed.",
                    },
                  })}
                  onChange={(e) => {
                    handleImageUpload(e); 
                    register("imageFile").onChange(e); 
                  }}
                />
                {errors.imageFile && (
                  <div className="invalid-feedback">
                    {errors.imageFile.message}
                  </div>
                )}
                <small className="text-muted float-start">
                  Please upload a certificate template in PNG format.
                </small>
              </div>
            </div>

            {/* Email Subject */}
            <div className="mb-3 row">
              <label className="form-label col-md-3">Email Subject</label>
              <div className="col-md-9">
                <input
                  type="text"
                  className={`form-control input ${
                    errors.emailSubject ? "is-invalid" : ""
                  }`}
                  {...register("emailSubject", {
                    required: "Email subject is required",
                  })}
                />
                {errors.emailSubject && (
                  <div className="invalid-feedback">
                    {errors.emailSubject.message}
                  </div>
                )}
              </div>
            </div>

            {/* Email Body */}
            <div className="mb-3 row">
              <label className="form-label col-md-3">Email Body</label>
              <div className="col-md-9">
                <textarea
                  className={`form-control input ${
                    errors.emailBody ? "is-invalid" : ""
                  }`}
                  rows="4"
                  {...register("emailBody", {
                    required: "Email body is required",
                  })}
                />
                {errors.emailBody && (
                  <div className="invalid-feedback">
                    {errors.emailBody.message}
                  </div>
                )}
              </div>
            </div>
          </form>

          {/* Action Buttons */}
          <div className="d-flex justify-content-center mt-4">
            <button
              className="btn btn-outline-custom me-3"
              onClick={() => setShowModal(true)}
              disabled={!image}
            >
              Set Coordinates
            </button>
            <button
              className="btn btn-custom me-3"
              onClick={handleSubmit((data) =>
                handlePreviewCertificate({
                  ...data,
                  coordinates,
                  image,
                  excelFile,
                })
              )}
            >
              Preview Certificate
            </button>
            <button
              className="btn btn-custom"
              onClick={handleSubmit((data) => {
                confirmGeneration(data);
              })}
            >
              Generate Certificates
            </button>
          </div>
        </div>
      </div>

      {/* Coordinates Modal */}
      <Modal
      show={showModal}
      onHide={() => setShowModal(false)}
      onShow={drawCertificateOnCanvas}
      size="xl"
      dialogClassName="modal-90w"
    >
      <Modal.Header closeButton>
        <Modal.Title>Set Coordinates</Modal.Title>
      </Modal.Header>
      <Modal.Body className="modalBodyStyle">
        {image ? (
          <>
            <p className="mb-3">
              <strong>Instructions:</strong> Click to set the coordinates for
              the name (first click) and date (second click) fields.
            </p>
            <p>
              <strong>
              {!coordinates.name && " Click to set name position."}
              {coordinates.name && !coordinates.date && " Click to set date position."}
              {coordinates.name && coordinates.date && " Both positions are set."}
              </strong>
            </p>
            <div className="canvasContainerStyle">
              <canvas
                ref={canvasRef}
                style={{
                  cursor: getCursorStyle(),
                  maxWidth: '100%',
                  height: 'auto'
                }}
                onClick={handleCanvasClick}
              />
            </div>
          </>
        ) : (
          <p>Please upload a certificate template first.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={resetCoordinates}>
          Reset
        </Button>
        <Button variant="custom" onClick={() => setShowModal(false)}>
          Done
        </Button>
      </Modal.Footer>
    </Modal>


      {/* Confirmation Modal */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Generation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to generate certificates for all participants?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={() => setShowConfirmModal(false)}
          >
            Cancel
          </Button>
          <Button
            variant="custom"
            onClick={() =>
              handleSubmit((data) =>
                handleGenerateCertificates({
                  ...data,
                  coordinates,
                  image,
                  excelFile,
                })
              )()
            }
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default CertGen;
