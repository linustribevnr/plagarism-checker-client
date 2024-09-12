import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { Commet } from "react-loading-indicators";
import { Riple } from "react-loading-indicators";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { BiSolidErrorAlt } from "react-icons/bi";

import "./CheckPlag.css";

function CheckPlag() {
  const [challengeSlugIds, setChallengeSlugIds] = useState([1]);
  const [results, setResults] = useState([]);


  const [runningPlagCheck, setRunningPlagCheck] = useState(false);
  const [individualStatus, setIndividualStatus] = useState([0,0]);

  const {
    register,
    handleSubmit,
    // watch,
    // formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setRunningPlagCheck(true);
    setResults([])

    const enteredChallengeSlugs = challengeSlugIds.map((id) => [
      id,
      data[`challengeSlug${id}`],
    ]);
    const enteredContestSlug = data.contestSlug;

    for (const challengeSlug of enteredChallengeSlugs) {
      // update the running status
      setIndividualStatus((prevStatus) => {
        const newStatus = [...prevStatus];
        newStatus[challengeSlug[0]] = 1;
        return newStatus;
      });

      const bodyPackage = {
        contest: enteredContestSlug,
        challenge: [challengeSlug[1]],
        cutoff: data[`cutoff${challengeSlug[0]}`],
      };
      try {
        const apiUrl = process.env.REACT_APP_API_URL;
        const res = await axios.post(
          `${apiUrl}/getResults`,
          bodyPackage
        );
        // console.log("RESULT : \n", res.data.Data);
        
        setResults((prevResults) => {
          const newResults = [...prevResults, { challenge: challengeSlug[1], links: res.data.Data }];
          console.log("Updated results -> ", newResults);
          return newResults;
        });
  
        setIndividualStatus((prevStatus) => {
          const newStatus = [...prevStatus];
          newStatus[challengeSlug[0]] = 2;
          return newStatus;
        });
      } catch (err) {
        setIndividualStatus((prevStatus) => {
          const newStatus = [...prevStatus];
          newStatus[challengeSlug[0]] = 3;
          return newStatus;
        });
        console.log("ERROR OCCURED !!!", err);
      }
    }
    setRunningPlagCheck(false);
  };

  return (
    <div className="check-plag ">
  <form className="form-container" onSubmit={handleSubmit(onSubmit)}>
    {/* Contest Slug */}
    <div className="contest-info row">
      <div className="contest-lable col-md-4 ">
        <h4 className="ms-5">Contest Slug :</h4>
      </div>
      <div className="contest-input col-md-6 ">
        <input
          height={"20px"}
          className="w-100 border border-dark rounded"
          placeholder="Contest Slug"
          name="contestSlug"
          type="text"
          {...register("contestSlug", { required: true })}
        />
      </div>
    </div>

    <div className="challenges-info row mt-5">
      {/* Challenge Slugs */}
      <div className="challenge-lable col-md-4">
        <h4 className="ms-5">Challenge Slugs :</h4>
      </div>
      <div className="challenge-inputs m-0 col-md-8 ">
        {challengeSlugIds.map((challengeSlugId) => (
          <div className="challenge-input row" key={challengeSlugId}>
            {/* slug */}
            <input
              className="col-6 options"
              placeholder={`Challenge Slug ${challengeSlugId}`}
              type="text"
              name={`challengeSlug${challengeSlugId}`}
              id={`challengeSlug${challengeSlugId}`}
              {...register(`challengeSlug${challengeSlugId}`, {
                required: true,
              })}
            />

            {/* Cutoff */}
            <input
              className=" col-2 options"
              placeholder={`Cut Off`}
              type="number"
              name={`cutoff${challengeSlugId}`}
              id={`cutoff${challengeSlugId}`}
              {...register(`cutoff${challengeSlugId}`, { required: true })}
            />

            {/* Riple */}
            {individualStatus[challengeSlugId] === 1 && (
              <div className=" col-1 options">
                <Riple
                  className="option-icon"
                  color="#32cd32"
                  size="small"
                  text=""
                  textColor=""
                />
              </div>
            )}

            {/* Done icon */}
            {individualStatus[challengeSlugId] === 2 && (
              <div className="col-1 options">
                <RiVerifiedBadgeFill
                  color="green"
                  className="option-icon"
                />
              </div>
            )}

            {/* Error icon */}
            {individualStatus[challengeSlugId] === 3 && (
              <div className="col-1 options">
                <BiSolidErrorAlt
                  color="red"
                  className="option-icon"
                />
              </div>
            )}

            {/* Delete button */}
            {!runningPlagCheck && (
              <div className="col-2 options">
                <button
                  className="dustbin"
                  onClick={() =>
                    setChallengeSlugIds(
                      challengeSlugIds.filter(
                        (id) => id !== challengeSlugId
                      )
                    )
                  }
                >
                  <RiDeleteBin6Fill className=" option-icon" />
                </button>
              </div>
            )}
          </div>
        ))}

        {!runningPlagCheck && (
          <button
            className="add-challenge"
            onClick={() => {
              setChallengeSlugIds([
                ...challengeSlugIds,
                (challengeSlugIds.length > 0
                  ? challengeSlugIds[challengeSlugIds.length - 1]
                  : 0) + 1,
              ]);
              setIndividualStatus((prevstate) => [
                ...prevstate,
                0,
              ]);
            }}
          >
            Add Challenge
          </button>
        )}
      </div>
    </div>

    <button
      className={`submit-btn ${
        runningPlagCheck && "p-0 bg-transparent border-white"
      }`}
      type="submit"
      disabled={runningPlagCheck}
    >
      {runningPlagCheck ? (
        <Commet
          color="#32cd32"
          size="small"
          text="Running"
          textColor="#32cd32"
        />
      ) : (
        "Run Plag Checker"
      )}
    </button>
  </form>

  <div className="plag-results">
    <h2>Potential Cheater</h2>
    {results.map((item, key) => (
      <div className="row">
        <i>
          <h4 className="fw-bold">{item.challenge}</h4>
        </i>
        {item.links.map((link, linkKey) => (
          <p className="links">
            {link[0]}{" "}
            <a href={link[1]} rel="noreferrer" target="_blank">
              {link[1]}
            </a>
          </p>
        ))}
      </div>
    ))}
  </div>
</div>

  ); 
}

export default CheckPlag;
