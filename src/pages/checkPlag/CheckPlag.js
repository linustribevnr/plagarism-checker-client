import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Trash2, CheckCircle, AlertTriangle } from "lucide-react";
import { Spinner } from "react-bootstrap";
import "./CheckPlag.css";

function CheckPlag() {
  const [challengeSlugIds, setChallengeSlugIds] = useState([1]);
  const [results, setResults] = useState([]);
  const [runningPlagCheck, setRunningPlagCheck] = useState(false);
  const [individualStatus, setIndividualStatus] = useState([0]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setRunningPlagCheck(true); 
    setResults([]); 
    setIndividualStatus(challengeSlugIds.map(() => 1)); 
  
    const enteredChallengeSlugs = challengeSlugIds.map((id) => [
      id,
      data[`challengeSlug${id}`],
    ]);
    const enteredContestSlug = data.contestSlug;
  
    try {
      const results = await Promise.all(
        enteredChallengeSlugs.map(async (challengeSlug) => {
          const bodyPackage = {
            contest: enteredContestSlug,
            challenge: [challengeSlug[1]],
            cutoff: data[`cutoff${challengeSlug[0]}`],
          };
  
          try {
            const apiUrl = process.env.REACT_APP_API_URL;
            const res = await axios.post(`${apiUrl}/getResults`, bodyPackage);
  
            setIndividualStatus((prevStatus) => {
              const newStatus = [...prevStatus];
              newStatus[challengeSlug[0] - 1] = 2;
              return newStatus;
            });
  
            return {
              challenge: challengeSlug[1],
              links: res.data.Data,
              status: 2,
            };
          } catch (err) {

            setIndividualStatus((prevStatus) => {
              const newStatus = [...prevStatus];
              newStatus[challengeSlug[0] - 1] = 3;
              return newStatus;
            });
  
            return {
              challenge: challengeSlug[1],
              links: [],
              status: 3,
            };
          }
        })
      );
  
      setResults(results.filter((result) => result.links.length > 0)); 
    } catch (error) {
      console.error("Error running plag check:", error);
    } finally {
      setRunningPlagCheck(false); 
    }
  };
  

  

  return (
    <div className="container">
      <div className="card shadow-sm">
        <div className="card-header bg-custom text-white text-center">
          <h2 className="mb-0">Plagiarism Checker</h2>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            {/* Contest Slug */}
            <div className="mb-3 row">
              <div className="col-md-2">
                <label className="form-label mt-2">Contest Slug</label>
              </div>
              <div className="col-md-10">
                <input
                  type="text"
                  className={`form-control input ${
                    errors.contestSlug ? "is-invalid" : ""
                  }`}
                  placeholder="Contest Slug"
                  {...register("contestSlug", {
                    required: "Contest Slug is required",
                  })}
                />
                {errors.contestSlug && (
                  <div className="invalid-feedback">
                    {errors.contestSlug.message}
                  </div>
                )}
              </div>
            </div>

            {/* Challenge Slugs */}
            <div className="mb-3 row">
              <div className="col-md-2">
                <label className="form-label mt-2">Challenge Slugs</label>
              </div>
              <div className="col-md-10">
                {challengeSlugIds.map((challengeSlugId) => (
                  <div key={challengeSlugId} className="row mb-2">
                    {/* Challenge Slug Input */}
                    <div className="col-md-4 my-1">
                      <input
                        type="text"
                        className={`form-control input ${
                          errors[`challengeSlug${challengeSlugId}`]
                            ? "is-invalid"
                            : ""
                        }`}
                        placeholder="Challenge Slug"
                        {...register(`challengeSlug${challengeSlugId}`, {
                          required: "Challenge Slug is required",
                        })}
                      />
                      {errors[`challengeSlug${challengeSlugId}`] && (
                        <div className="invalid-feedback">
                          {errors[`challengeSlug${challengeSlugId}`].message}
                        </div>
                      )}
                    </div>
                    {/* Cutoff Input */}
                    <div className="col-md-4 my-1">
                      <input
                        type="number"
                        className={`form-control input ${
                          errors[`cutoff${challengeSlugId}`] ? "is-invalid" : ""
                        }`}
                        placeholder="Cutoff"
                        {...register(`cutoff${challengeSlugId}`, {
                          required: "Cutoff is required",
                          min: { value: 0, message: "Cutoff must be positive" },
                        })}
                      />
                      {errors[`cutoff${challengeSlugId}`] && (
                        <div className="invalid-feedback">
                          {errors[`cutoff${challengeSlugId}`].message}
                        </div>
                      )}
                    </div>
                    {/* Action Buttons and Status Indicator */}
                    <div className="col-md-4">
                      <div className="d-flex align-items-center justify-content-end">
                        {/* Trash Button */}
                        {!runningPlagCheck && (
                          <button
                            type="button"
                            className="btn dustbin me-2"
                            onClick={() =>
                              setChallengeSlugIds(
                                challengeSlugIds.filter(
                                  (id) => id !== challengeSlugId
                                )
                              )
                            }
                          >
                            <Trash2 size={20} />
                          </button>
                        )}
                        {/* Status Indicators */}
                        {runningPlagCheck &&
                        individualStatus[challengeSlugId - 1] === 1 ? (
                          <Spinner
                            animation="border"
                            size="sm"
                            variant="success"
                          />
                        ) : individualStatus[challengeSlugId - 1] === 2 ? (
                          <CheckCircle size={20} className="text-success" />
                        ) : individualStatus[challengeSlugId - 1] === 3 ? (
                          <AlertTriangle size={20} className="text-danger" />
                        ) : (
                          <span className=""></span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {!runningPlagCheck && (
                  <button
                    type="button"
                    className="btn btn-outline-custom mt-2"
                    onClick={() => {
                      setChallengeSlugIds([
                        ...challengeSlugIds,
                        challengeSlugIds.length + 1,
                      ]);
                      setIndividualStatus((prevStatus) => [...prevStatus, 0]);
                    }}
                  >
                    Add Challenge
                  </button>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-custom my-3"
              disabled={runningPlagCheck}
            >
              {runningPlagCheck ? (
                <>
                  <Spinner
                    animation="grow"
                    border="none"
                    size="sm"
                    variant="success"
                    className="me-2"
                    role="status"
                  />
                  (T⌓T)
                </>
              ) : (
                "Run Plag Checker"
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Results Section */}
      {results.length > 0 && (
        <div className="card mt-4 shadow-sm">
          <div className="card-header bg-custom text-white">
            <h3 className="mb-0">Potential Cheaters</h3>
          </div>
          <div className="card-body">
            {results.map((item, idx) => (
              <div key={idx} className="mb-4 pb-3 border-bottom">
                <h5 className="mb-2">{item.challenge}</h5>
                {item.links.map((link, linkIdx) => (
                  <div
                    key={linkIdx}
                    className="d-flex justify-content-center mb-2"
                  >
                    <span className="me-1 lang">{link[0]}</span>
                    <a
                      href={link[1]}
                      target="_blank"
                      rel="noreferrer"
                      className="mx-4"
                    >
                      {link[1]}
                    </a>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default CheckPlag;
