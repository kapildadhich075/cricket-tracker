import React from "react";

interface MatchProps {
  match: {
    id: string;
    name: string;
    matchType: string;
    status: string;
    venue: string;
    date: string;
    dateTimeGMT: string;
    team1: string;
    team2: string;
    team1Img: string;
    team2Img: string;
    score: any[];
  };
  onClose: () => void;
}

const MatchModal: React.FC<MatchProps> = ({ match, onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-700 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl relative">
        <button
          className="absolute top-2 right-2 text-2xl font-bold text-red-600"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-3xl font-bold mb-4 text-blue-600">{match.name}</h2>
        <div className="flex items-center mb-4">
          <img
            src={match.team1Img}
            alt={match.team1}
            className="w-12 h-12 mr-4 rounded-full"
          />
          <p className="text-xl">
            {match.team1} vs {match.team2}
          </p>
          <img
            src={match.team2Img}
            alt={match.team2}
            className="w-12 h-12 ml-4 rounded-full"
          />
        </div>
        <p className="mb-2">
          <strong>Status:</strong> {match.status}
        </p>
        <p className="mb-2">
          <strong>Venue:</strong> {match.venue}
        </p>
        <p className="mb-2">
          <strong>Date:</strong> {match.date}
        </p>
        <p className="mb-4">
          <strong>Time:</strong> {match.dateTimeGMT}
        </p>
        {match.score && (
          <div>
            <h3 className="text-xl font-semibold text-green-600 mb-2">
              Scores:
            </h3>
            {match.score.map((inning: any, index: number) => (
              <div key={index} className="mb-2">
                <p>
                  <strong>Team:</strong> {inning.team}
                </p>
                <p>
                  <strong>Inning:</strong> {inning.inning}
                </p>
                <p>
                  <strong>Runs:</strong> {inning.runs}
                </p>
                <p>
                  <strong>Wickets:</strong> {inning.wickets}
                </p>
                <p>
                  <strong>Overs:</strong> {inning.overs}
                </p>
                <hr className="mt-2" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchModal;
