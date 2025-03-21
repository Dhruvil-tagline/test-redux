import { useCallback, useEffect, useState } from "react";
import { validateEmpty } from "../../utils/validation";
import InputCom from "../../CommonComponent/InputCom";
import RadioCom from "../../CommonComponent/RadioCom";
import ButtonCom from "../../CommonComponent/ButtonCom";
import { useLocation, useNavigate } from "react-router-dom";
import Loader from "../../CommonComponent/Loader";
import { useDispatch, useSelector } from "react-redux";
import { createExam, updateExam } from "../../action/examActions";
import { questionsErrorObj } from "../../StaticData/staticObj";
import { teacherErrorObj } from "../../StaticData/staticObj";
import { TOTAL_QUESTIONS } from "../../StaticData/staticObj";

const TeacherForm = () => {
  const { token } = useSelector((state) => state.auth);
  const exams = useSelector((state) => state.exams);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [currentQuestion, setCurrentQuestion] = useState(state?.currentQ || 0);
  const [allQuestionError, setAllQuestionError] = useState(
    Array(15).fill(false)
  );
  const [questionsError, setQuestionsError] = useState(questionsErrorObj);
  const [error, setError] = useState(teacherErrorObj);
  const [examData, setExamData] = useState({
    subjectName: state?.subject || "",
    questions:
      state?.questions ||
      Array(TOTAL_QUESTIONS)
        .fill()
        .map(() => ({
          question: "",
          answer: "",
          options: ["", "", "", ""],
        })),
    notes: state?.notes || ["", ""],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormReset, setIsFormReset] = useState(false);

  const handleInputChange = (index, field, value) => {
    const updatedQuestions = [...examData.questions];
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    setExamData({ ...examData, questions: updatedQuestions });
  };

  const handleQueValidate = (index) => {
    const errors = {};
    errors.optionsError = "";
    const updatedQuestions = [...examData.questions];
    errors.questionError = validateEmpty(
      updatedQuestions[index]?.question,
      "Question"
    );
    errors.answerError = validateEmpty(
      updatedQuestions[index]?.answer,
      "Answer"
    );
    updatedQuestions[index]?.options.forEach((val) => {
      if (!val) {
        errors.optionsError = "4 option is required for each question";
      }
    });
    setQuestionsError(errors);
    return Object.values(errors).every((val) => !val);
  };

  const handleQuestionSave = (index, page) => {
    let allQue;
    if (handleQueValidate(index)) {
      allQue = allQuestionError.map((val, arrIndex) =>
        arrIndex === index ? true : val
      );
      setAllQuestionError(allQue);
      page === "previous" && setCurrentQuestion(currentQuestion - 1);
      page === "next" && setCurrentQuestion(currentQuestion + 1);
    } else {
      allQue = allQuestionError.map((val, arrIndex) =>
        arrIndex === index ? false : val
      );
      setAllQuestionError(allQue);
    }
    return allQue;
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const updatedQuestions = [...examData.questions];
    updatedQuestions[qIndex].options[optIndex] = value;
    updatedQuestions[qIndex].answer = "";
    setExamData({ ...examData, questions: updatedQuestions });
  };

  const handleAnswerChange = (index, value) => {
    const updatedQuestions = [...examData.questions];
    updatedQuestions[index].answer = value;
    setExamData({ ...examData, questions: updatedQuestions });
  };

  const handleNoteChange = (index, value) => {
    const updatedNotes = [...examData.notes];
    updatedNotes[index] = value;
    setExamData({ ...examData, notes: updatedNotes });
  };

  const handleValidate = useCallback(
    (result) => {
      const errors = {};
      errors.noteError = "";
      errors.queError = "";
      errors.subjectError = validateEmpty(examData.subjectName, "Subject name");
      examData.notes.map((val) => {
        !val && (errors.noteError = "Notes is required");
      });
      if (result) {
        !result.every((val) => val) &&
          (errors.queError = "Please fill out all the question");
      } else {
        !allQuestionError.every((val) => val) &&
          (errors.queError = "Please fill out all the question");
      }
      setError(errors);
      return Object.values(errors).every((val) => !val);
    },
    [examData, allQuestionError]
  );

  const handleSubmit = async () => {
    let result = handleQuestionSave(currentQuestion);
    if (!handleValidate(result)) return;
    setIsSubmitting(true);
  };

  const resetForm = () => {
    setExamData({
      subjectName: "",
      questions: Array(TOTAL_QUESTIONS)
        .fill()
        .map(() => ({
          question: "",
          answer: "",
          options: ["", "", "", ""],
        })),
      notes: ["", ""],
    });
    setQuestionsError(questionsErrorObj);
    setAllQuestionError(Array(TOTAL_QUESTIONS).fill(false));
    setError(teacherErrorObj);
    setIsFormReset(true);
  };

  useEffect(() => {
    if (isSubmitting) {
      if (state?.examId) {
        dispatch(updateExam(examData, state?.examId, token, navigate));
      } else {
        dispatch(createExam(examData, token, navigate));
      }
    }
  }, [isSubmitting]);

  useEffect(() => {
    if (isFormReset) {
      setCurrentQuestion(0);
      setIsFormReset(false);
    }
  }, [isFormReset]);

  useEffect(() => {
    if (state?.questions) {
      setAllQuestionError(Array(15).fill(true));
    }
  }, [state?.questions]);

  return (
    <div>
      <div>
        {exams?.loading && <Loader />}
        <h1 style={{ textAlign: "center", color: "rgb(18, 219, 206)" }}>
          {state?.examId ? "Edit Exam" : "Create Exam"}
        </h1>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            height: "100%",
            alignItems: "center",
            padding: "20px",
            flexWrap: "wrap",
          }}
        >
          <div style={{ maxWidth: "1100px" }}>
            <label htmlFor="subjectName" style={{ fontSize: "20px" }}>
              Subject Name
            </label>{" "}
            <span style={{ color: "red" }}>{error.subjectError}</span>
            <InputCom
              type="text"
              name="subjectName"
              id="subjectName"
              value={examData.subjectName}
              onChange={(e) =>
                setExamData({ ...examData, subjectName: e.target.value })
              }
              placeholder="Subject Name"
            />
            <label
              style={{
                display: "inline-block",
                margin: "20px 0px",
                fontSize: "20px",
              }}
            >
              Question
            </label>
            <span style={{ color: "red" }}>{error.queError}</span>
            <div>
              <div
                style={{
                  border: "1px solid gray",
                  padding: "15px",
                  borderRadius: "10px",
                }}
              >
                <div>
                  <label htmlFor="question" >
                    Question {currentQuestion + 1}
                  </label>{" "}
                  <span style={{ color: "red" }}>
                    {questionsError.questionError}
                  </span>
                                  <InputCom

                    name="question"
                    type="text"
                    placeholder="Enter question"
                    id="question"
                    value={examData?.questions[currentQuestion]?.question}
                    onChange={(e) =>
                      handleInputChange(
                        currentQuestion,
                        "question",
                        e.target.value
                      )
                    }
                  />
                </div>
                <span style={{ color: "red" }}>
                  {questionsError.optionsError}
                </span>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "10px 0px",
                    flexWrap: "wrap",
                  }}
                >
                  {examData?.questions[currentQuestion]?.options &&
                    examData?.questions[currentQuestion]?.options.map(
                      (opt, idx) => (
                        <div key={idx}>
                          <InputCom
                            type="text"
                            placeholder={`Option ${idx + 1}`}
                            value={opt}
                            onChange={(e) =>
                              handleOptionChange(
                                currentQuestion,
                                idx,
                                e.target.value
                              )
                            }
                          />
                        </div>
                      )
                    )}
                </div>
                <div style={{ padding: "20px 0px" }}>
                  <label>
                    Select Correct Answer:{" "}
                    {examData?.questions[currentQuestion]?.answer}
                  </label>
                  <span style={{ color: "red" }}>
                    {questionsError.answerError}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "20px",
                    flexWrap: "wrap",
                    width: "100%",
                  }}
                >
                  {examData?.questions[currentQuestion]?.options &&
                    examData?.questions[currentQuestion]?.options.map(
                      (opt, idx) => {
                        if (!opt) return;
                        return (
                          <div
                            key={idx}
                            style={{ display: "flex", flexWrap: "wrap" }}
                          >
                            <RadioCom
                              name={`answer-${currentQuestion}`}
                              value={opt}
                              checked={
                                examData.questions[currentQuestion].answer ===
                                opt
                              }
                              onChange={(e) =>
                                handleAnswerChange(
                                  currentQuestion,
                                  e.target.value
                                )
                              }
                              text={opt}
                            />
                          </div>
                        );
                      }
                    )}
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "10px 0px",
                  flexWrap: "wrap",
                  gap: "10px",
                }}
              >
                <ButtonCom
                  disabled={currentQuestion === 0}
                  text="Previous"
                  onClick={() => {
                    handleQuestionSave(currentQuestion, "previous");
                  }}
                />
                <ButtonCom
                  text="Next"
                  disabled={currentQuestion === TOTAL_QUESTIONS - 1}
                  onClick={() => {
                    handleQuestionSave(currentQuestion, "next");
                  }}
                />
              </div>
            </div>
            <label style={{ fontSize: "20px" }}>Notes</label>
            <span style={{ color: "red" }}>{error.noteError}</span>
            {examData.notes.map((note, index) => (
              <InputCom
                key={index}
                type="text"
                placeholder={`Note ${index + 1}`}
                value={note}
                onChange={(e) => handleNoteChange(index, e.target.value)}
              />
            ))}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "10px",
              }}
            >
              <ButtonCom
                text="Cancel"
                              color="red"
                onClick={resetForm}
                style={{ backgroundColor: "gray" }}
              />
              <ButtonCom text="Back" onClick={() => navigate(-1)} />
              <ButtonCom
                color="green"
                text={state?.existingExam ? "Update" : "Submit"}
                onClick={handleSubmit}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherForm;
