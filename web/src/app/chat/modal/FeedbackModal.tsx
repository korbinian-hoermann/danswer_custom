"use client";

import { useState } from "react";
import { FeedbackType } from "../types";
import { FiThumbsDown, FiThumbsUp } from "react-icons/fi";
import { ModalWrapper } from "@/components/modals/ModalWrapper";
import {
  DislikeFeedbackIcon,
  FilledLikeIcon,
  LikeFeedbackIcon,
} from "@/components/icons/icons";

const predefinedPositiveFeedbackOptions =
  process.env.NEXT_PUBLIC_POSITIVE_PREDEFINED_FEEDBACK_OPTIONS?.split(",") ||
  [];
const predefinedNegativeFeedbackOptions =
  process.env.NEXT_PUBLIC_NEGATIVE_PREDEFINED_FEEDBACK_OPTIONS?.split(",") || [
    "Retrieved documents were not relevant",
    "AI misread the documents",
    "Cited source had incorrect information",
  ];
const resultQualityOptions = [
  "Correct",
  "Partly correct (can be improved)",
  "Completely wrong",
];

const contextEvaluationOptions = [
  "Retrieved documents were relevant",
  "Retrieved documents were not relevant",
  "Cited source had incorrect information",
  "AI misread the documents",
];

interface FeedbackModalProps {
  feedbackType: FeedbackType;
  onClose: () => void;
  onSubmit: (feedbackDetails: {
    message: string;
    correctCode: string;
    rating?: number;
    resultQuality?: string;
    contextEvaluation?: string;
    additionalFiles?: FileList | null;
    predefinedFeedback?: string;
  }) => void;
}

export const FeedbackModal = ({
  feedbackType,
  onClose,
  onSubmit,
}: FeedbackModalProps) => {
  const [message, setMessage] = useState("");
  const [predefinedFeedback, setPredefinedFeedback] = useState<
    string | undefined
  >();
  const [correctCode, setCorrectCode] = useState("");
  const [rating, setRating] = useState<number | undefined>();
  const [isRatingMissing, setIsRatingMissing] = useState(false);
  const [resultQuality, setResultQuality] = useState<string | undefined>();
  const [contextEvaluation, setContextEvaluation] = useState<string | undefined>();
  const [additionalFiles, setAdditionalFiles] = useState<FileList | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAdditionalFiles(event.target.files);
  };


  const handlePredefinedFeedback = (feedback: string) => {
    setPredefinedFeedback(feedback);
  };

const handleSubmit = () => {
    if (!rating) {
      setIsRatingMissing(true);
      console.log("Rating is missing");
      return;
    }
    setIsRatingMissing(false);
    console.log("Submitting Feedback:", { message, correctCode, rating, resultQuality, contextEvaluation, additionalFiles });
    onSubmit({ message, predefinedFeedback, correctCode, rating, resultQuality, contextEvaluation, additionalFiles });
    onClose();
  };

  const predefinedFeedbackOptions =
    feedbackType === "like"
      ? predefinedPositiveFeedbackOptions
      : predefinedNegativeFeedbackOptions;

  return (
    <ModalWrapper onClose={onClose} modalClassName="max-w-5xl">
      <>
        <h2 className="text-2xl text-emphasis font-bold mb-4 flex">
          <div className="mr-1 my-auto">
            {feedbackType === "like" ? (
              <FilledLikeIcon
                size={20}
                className="text-green-500 my-auto mr-2"
              />
            ) : (
              <FilledLikeIcon
                size={20}
                className="rotate-180 text-red-600 my-auto mr-2"
              />
            )}
          </div>
          Provide additional feedback
        </h2>

        <div className="mb-4">
          <label className="block mb-1">Quality of the result:</label>
          <div className="flex flex-wrap justify-start">
            {resultQualityOptions.map((option, index) => (
              <button
                key={index}
                className={`bg-border hover:bg-hover text-default py-2 px-4 rounded m-1
                  ${resultQuality === option && "ring-2 ring-accent"}`}
                onClick={() => setResultQuality(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-1">Evaluation of the context:</label>
          <div className="flex flex-wrap justify-start">
            {contextEvaluationOptions.map((option, index) => (
              <button
                key={index}
                className={`bg-border hover:bg-hover text-default py-2 px-4 rounded m-1
                  ${contextEvaluation === option && "ring-2 ring-accent"}`}
                onClick={() => setContextEvaluation(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-1">Upload additional files which would have contained relevant information:</label>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="border border-border-strong rounded py-2 px-4 w-full"
          />
        </div>


        <textarea
          autoFocus
          className={`
            w-full flex-grow 
            border border-border-strong rounded 
            outline-none placeholder-subtle 
            pl-4 pr-4 py-4 bg-background 
            overflow-hidden h-28 
            whitespace-normal resize-none 
            break-all overscroll-contain
          `}
          role="textarea"
          aria-multiline
          placeholder={
            feedbackType === "like"
              ? "In case the code can be improved, provide the full code including the imports."
              : "Provide the full correct code including the imports."
          }

          value={correctCode}
          onChange={(e) => setCorrectCode(e.target.value)}
          style={{
            overflowY: 'auto',
            whiteSpace: 'pre-wrap',
          }}
        />
        <textarea

          className={`
            w-full flex-grow
            border border-border-strong rounded
            outline-none placeholder-subtle
            pl-4 pr-4 py-4 bg-background
            overflow-hidden h-28
            whitespace-normal resize-none
            break-all overscroll-contain
          `}
          role="textarea"
          aria-multiline
          placeholder={
            feedbackType === "like"
              ? "(Optional) What did you like about this response? How could it be improved?"
              : "(Optional) What was the issue with the response? How could it be improved?"
          }
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{
            overflowY: 'auto',
            whiteSpace: 'pre-wrap',
          }}
        />

        <div className="flex mt-2">
          <button
            className="bg-accent text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none mx-auto"
            onClick={handleSubmit}
          >
            Submit feedback
          </button>
        </div>
        {isRatingMissing && (
        <div className="text-red-500 text-center mt-2">
          A rating is required to submit feedback.
        </div>
        )}
      </>
    </ModalWrapper>
  );
};
